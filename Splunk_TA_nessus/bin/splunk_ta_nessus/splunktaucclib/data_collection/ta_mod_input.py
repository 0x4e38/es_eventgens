#!/usr/bin/python

"""
This is the main entry point for My TA
"""

import os.path as op
import sys
import time
import splunktalib.modinput as modinput
import splunktalib.common.util as utils
import splunktaucclib.common.log as stulog
from splunktaucclib.data_collection import ta_data_loader as dl
from splunktaucclib.data_collection import ta_config as tc
from splunktaucclib.data_collection import ta_checkpoint_manager as cpmgr
import splunktalib.orphan_process_monitor as opm
import splunktalib.file_monitor as fm
from splunktaucclib.common import load_schema_file as ld
from splunktaucclib.data_collection import ta_data_client as tdc

utils.remove_http_proxy_env_vars()


def do_scheme(ta_short_name, ta_name):
    """
    Feed splunkd the TA's scheme

    """

    print """
    <scheme>
    <title>Splunk Add-on for {ta_short_name}</title>
    <description>Enable data inputs for {ta_name}</description>
    <use_external_validation>true</use_external_validation>
    <streaming_mode>xml</streaming_mode>
    <use_single_instance>true</use_single_instance>
    <endpoint>
      <args>
        <arg name="name">
          <title>{ta_name} Data Input Name</title>
        </arg>
        <arg name="description">
          <title>{ta_name}</title>
          <required_on_create>0</required_on_create>
          <required_on_edit>0</required_on_edit>
        </arg>
      </args>
    </endpoint>
    </scheme>
    """.format(ta_short_name=ta_short_name,
               ta_name=ta_name)


def _setup_signal_handler(data_loader, ta_short_name):
    """
    Setup signal handlers
    :data_loader: data_loader.DataLoader instance
    """

    def _handle_exit(signum, frame):
        stulog.logger.info("{} receives exit signal".format(ta_short_name))
        if data_loader is not None:
            data_loader.tear_down()

    utils.handle_tear_down_signals(_handle_exit)


def _handle_file_changes(data_loader):
    """
    :reload conf files and exit
    """

    def _handle_refresh(changed_files):
        stulog.logger.info("Detect {} changed, reboot itself".format(
            changed_files))
        data_loader.tear_down()

    return _handle_refresh


def _get_conf_files(local_file_list):
    cur_dir = op.dirname(op.dirname(op.dirname(op.dirname(op.dirname(op.abspath(
        __file__))))))
    files = []
    for f in local_file_list:
        files.append(op.join(cur_dir, "local", f))
    return files


def run(collector_cls, settings, checkpoint_cls=None, config_cls=None):
    """
    Main loop. Run this TA forever
    """
    # This is for stdout flush
    utils.disable_stdout_buffer()

    # http://bugs.python.org/issue7980
    time.strptime('2016-01-01', '%Y-%m-%d')

    tconfig = tc.create_ta_config(settings, config_cls or tc.TaConfig)
    stulog.set_log_level(tconfig.get_log_level())
    task_configs = tconfig.get_task_configs()

    if not task_configs:
        stulog.logger.debug("No task and exiting...")
        return
    meta_config = tconfig.get_meta_config()

    if tconfig.is_shc_but_not_captain():
        # In SHC env, only captain is able to collect data
        stulog.logger.debug("This search header is not captain, will exit.")
        return

    loader = dl.create_data_loader(meta_config)

    jobs = [tdc.create_data_collector(loader, tconfig, meta_config, task_config,
                                      collector_cls,
            checkpoint_cls=checkpoint_cls or cpmgr.TACheckPointMgr)
            for task_config in task_configs]

    # handle signal
    _setup_signal_handler(loader, settings["basic"]["title"])

    # monitor files to reboot
    if settings["basic"].get("monitor_file"):
        monitor = fm.FileMonitor(_handle_file_changes(loader),
                             _get_conf_files(settings["basic"]["monitor_file"]))
        loader.add_timer(monitor.check_changes, time.time(), 10)

    # add orphan process handling, which will check each 1 second
    orphan_checker = opm.OrphanProcessChecker(loader.tear_down)
    loader.add_timer(orphan_checker.check_orphan, time.time(), 1)

    loader.run(jobs)


def validate_config():
    """
    Validate inputs.conf
    """

    _, configs = modinput.get_modinput_configs_from_stdin()
    return 0


def usage():
    """
    Print usage of this binary
    """

    hlp = "%s --scheme|--validate-arguments|-h"
    print >> sys.stderr, hlp % sys.argv[0]
    sys.exit(1)


def main(collector_cls, schema_file_path, log_suffix="modinput",
         checkpoint_cls=None, configer_cls=None):
    """
    Main entry point
    """
    assert collector_cls, "ucc modinput collector is None."
    assert schema_file_path, "ucc modinput schema file is None"

    stulog.reset_logger(log_suffix)
    settings = ld(schema_file_path)
    ta_short_name = settings["basic"]["title"]
    ta_desc = settings["basic"]["description"]

    args = sys.argv
    if len(args) > 1:
        if args[1] == "--scheme":
            do_scheme(ta_short_name, ta_desc)
        elif args[1] == "--validate-arguments":
            sys.exit(validate_config())
        elif args[1] in ("-h", "--h", "--help"):
            usage()
        else:
            usage()
    else:
        stulog.logger.info("Start {} task".format(ta_short_name))
        try:
            run(collector_cls, settings, checkpoint_cls=checkpoint_cls,
                config_cls=configer_cls)
        except Exception as e:
            stulog.logger.exception(
                "{} task encounter exception".format(ta_short_name))
        stulog.logger.info("End {} task".format(ta_short_name))
    sys.exit(0)
