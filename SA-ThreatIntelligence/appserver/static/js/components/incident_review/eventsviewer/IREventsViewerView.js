"use strict";define(["jquery","underscore","splunk.util","collections/search/SelectedFields","sa-threatintelligence/js/components/incident_review/eventsviewer/IRSelectedRowsCollection","collections/services/configs/EventRenderers","collections/services/data/ui/WorkflowActions","sa-threatintelligence/js/collections/NotableEventSuppressions","models/search/Job","models/services/search/jobs/Result","splunk.config","models/services/search/jobs/Summary","util/console","sa-threatintelligence/js/components/incident_review/eventsviewer/IRTableView","sa-threatintelligence/js/components/incident_review/eventsviewer/EditLinkView","splunkjs/mvc/basesplunkview","splunkjs/mvc/messages","splunkjs/mvc/mvc","splunkjs/mvc/paginatorview","splunkjs/mvc/utils","splunkjs/mvc/sharedmodels","util/general_utils","splunkjs/mvc/tokenawaremodel","models/search/Report","splunkjs/mvc/drilldown","backbone"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z){var A=z.Model.extend({urlRoot:Splunk.util.make_url("/custom/SA-ThreatIntelligence/notable_info/incident_review_settings"),defaults:{table_labels:"",table_fields:""}}),B=/(["'].*?["']|[^"',\s]+)(?=\s*|\s*,|\s*$)/g,C=/^["']|["|']$/g,D=p.extend({className:"incident-events-viewer",options:{managerid:null,data:"events",showPager:!0,pagerPosition:"top",maxCount:100,logReviewSettingsStanza:null,tableHeaderLabels:["Time","Security Domain","Title","Urgency","Status","Owner"],tableHeaderFieldNames:["_time","security_domain","rule_title","urgency","status_label","owner_realname"],filedNameReplacementForActions:{rule_title:"rule_name",owner_realname:"owner"},fieldNameMapping:{action:"Action",app:"Application",bytes_in:"Bytes In",bytes_out:"Bytes Out",category:"Category",change_type:"Change Type",channel:"Channel",command:"Command",cpu_load_percent:"CPU Load (%)",cve:"CVE",decoration:"Decoration",desc:"Description",dest:"Destination",dest_threatlist_category:"Destination Threat List Category",dest_threatlist_description:"Destination Threat List Description",dest_threatlist_name:"Destination Threat List Name",dest_bunit:"Destination Business Unit",dest_category:"Destination Category",dest_city:"Destination City",dest_country:"Destination Country",dest_dns:"Destination DNS",dest_ip:"Destination IP Address",dest_is_expected:"Destination Expected",dest_lat:"Destination Latitude",dest_long:"Destination Longitude",dest_mac:"Destination MAC Address",dest_nt_domain:"Destination NT Domain",dest_nt_host:"Destination NT Hostname",dest_owner:"Destination Owner",dest_pci_domain:"Destination PCI Domain",dest_port:"Destination Port",dest_record:"Destination Record",dest_should_timesync:"Destination Should Time Synchronize",dest_should_update:"Destination Should Update",dest_requires_av:"Destination Requires Antivirus",dest_translated_ip:"Destination Translated IP Address",dest_translated_port:"Destination Translated Port",dest_zone:"Destination Zone",dhcp_pool:"DHCP Pool",direction:"Direction",dns:"DNS",duration:"Duration",dvc:"Device",dvc_bunit:"Device Business Unit",dvc_category:"Device Category",dvc_city:"Device City",dvc_country:"Device Country",dvc_dns:"Device DNS",dvc_ip:"Device IP Address",dvc_is_expected:"Device Expected",dvc_lat:"Device Latitude",dvc_long:"Device Longitude",dvc_mac:"Device MAC Address",dvc_nt_host:"Device NT Hostname",dvc_owner:"Device Owner",dvc_pci_domain:"Device PCI Domain",dvc_should_timesync:"Device Should Time Synchronize",dvc_should_update:"Device Should Update",dvc_requires_av:"Device Requires Antivirus",end_time:"End Time",file_access_time:"File Access Time",file_create_time:"File Creation Time",file_hash:"File Hash",file_modify_time:"File Modify Time",file_name:"File Name",file_path:"File Path",file_permission:"File Permission",file_size:"File Size",FreeMBytes:"Free Megabytes",gap:"Gap",gid:"GID",hash:"Hash",http_content_type:"HTTP Content Type",http_method:"HTTP Method",http_referrer:"HTTP Referrer",http_user_agent:"HTTP User Agent",ids_type:"Intrusion Detection Type",iin_issuer:"Issuer Identification Number (IIN)",ip:"IP Address",ip_version:"Internet Protocol Version",is_interactive:"Interactive",is_lockout:"Is Lockout",is_privileged:"Is Privileged",isdir:"Is Directory",length:"Length",location:"Location",log_level:"Log Level",mac:"MAC Address",mem:"Total Memory",mem_committed:"Committed Memory",mem_free:"Free Memory",mem_used:"Used Memory",mode:"Mode",modtime:"Modification Time",mount:"Mount",name:"Name",note:"Note",nt_host:"NT Hostname",object_handle:"Object Handle",object_name:"Object Name",object_type:"Object Type",orig_host:"Host",orig_host_bunit:"Host Business Unit",orig_host_category:"Host Category",orig_host_city:"Host City",orig_host_country:"Host Country",orig_host_dns:"Host DNS",orig_host_ip:"Host IP Address",orig_host_is_expected:"Host Expected",orig_host_lat:"Host Latitude",orig_host_long:"Host Longitude",orig_host_mac:"Host MAC Address",orig_host_nt_host:"Host NT Hostname",orig_host_owner:"Host Owner",orig_host_pci_domain:"Host PCI Domain",orig_host_should_timesync:"Host Should Time Synchronize",orig_host_should_update:"Host Should Update",orig_host_requires_av:"Host Requires Av",os:"Operating System",os_name:"Operating System Name",os_release:"Operating System Release",outbound_interface:"Outbound Interface","package":"Package",package_title:"Package Title",packets_in:"Packets In",packets_out:"Packets Out",path:"Path",PercentFreeSpace:"Free Space (%)",PercentProcessorTime:"Processor Time (%)",pid:"Process Identifier",pii:"Personally Identifiable Information (PII)",port:"Port",process:"Process",product:"Product",product_version:"Product Version",proto:"Internet Protocol",reason:"Reason",recipient:"Recipient",record_class:"Record Class",record_type:"Record Type",result:"Result",rule_number:"Rule Identifier",selinux:"SELinux",selinuxtype:"SELinux Type",sender:"Sender",session_id:"Session Identifier",setlocaldefs:"Set Local Definitions",severity_id:"Severity Identifier ",signature:"Signature",signature_id:"Signature Identifier",signature_version:"Signature Version",size:"Size",src:"Source",src_threatlist_category:"Source Threat List Category",src_threatlist_description:"Source Threat List Description",src_threatlist_name:"Source Threat List Name",src_bunit:"Source Business Unit",src_category:"Source Category",src_city:"Source City",src_country:"Source Country",src_dns:"Source DNS",src_ip:"Source IP Address",src_is_expected:"Source Expected",src_lat:"Source Latitude",src_long:"Source Longitude",src_mac:"Source MAC Address",src_nt_domain:"Source NT Domain",src_nt_host:"Source NT Hostname",src_owner:"Source Owner",src_pci_domain:"Source PCI Domain",src_port:"Source Port",src_record:"Source Record",src_should_timesync:"Source Should Time Synchronize",src_should_update:"Source Should Update",src_requires_av:"Source Requires Antivirus",src_translated_ip:"Source Translated IP Address",src_translated_port:"Source Translated Port",src_user:"Source User",src_user_group:"Source User Group",src_user_group_id:"Source User Group Identifier",src_user_id:"Source User Identifier",src_user_privilege:"Source User Privilege",src_zone:"Source Zone",sshd_protocol:"SSHD Protocol",ssid:"Service Set Identifier (SSID)",storage:"Total Storage",storage_free:"Free Storage",storage_free_percent:"Free Storage (%)",storage_used:"Used Storage",storage_used_percent:"Used Storage (%)",start_mode:"Start Mode",start_time:"Start Time",StartMode:"Start Mode",subject:"Subject",syslog_facility:"Syslog Facility",syslog_priority:"Syslog Priority",SystemUpTime:"System Uptime",tcp_flags:"TCP Flags",threat_ip:"Threat IP",tos:"Type Of Service",TotalMBytes:"Total Megabytes",transaction_id:"Transaction Identifier",transport:"Transport Protocol",ttl:"Time To Live",uid:"UID",uptime:"Uptime",url:"URL",UsedMBytes:"Used Megabytes",user:"User",user_group:"User Group",user_group_id:"User Group Identifier",user_id:"User Identifier",user_privilege:"User Privilege",validity:"Validity",vendor:"Vendor",vendor_product:"Vendor/Product",view:"View",vlan_id:"VLAN Identifier",vlan_name:"VLAN Name"},fieldFormating:{start_time:function(a,b,c){if(isNaN(parseFloat(c)))return c;var d=new Date(1e3*parseFloat(c)),e={0:"Jan",1:"Feb",2:"Mar",3:"Apr",4:"May",5:"Jun",6:"Jul",7:"Aug",8:"Sep",9:"Oct",10:"Nov",11:"Dec"};return d.getFullYear()+" "+e[d.getMonth()]+" "+d.getDate()+" "+d.toLocaleTimeString()},modify_time:function(a,b,c){if(isNaN(parseFloat(c)))return c;var d=new Date(1e3*parseFloat(c)),e={0:"Jan",1:"Feb",2:"Mar",3:"Apr",4:"May",5:"Jun",6:"Jul",7:"Aug",8:"Sep",9:"Oct",10:"Nov",11:"Dec"};return d.getFullYear()+" "+e[d.getMonth()]+" "+d.getDate()+" "+d.toLocaleTimeString()}}},reportDefaults:{"display.events.fields":'["host", "source", "sourcetype"]',"display.events.type":"table","display.prefs.events.count":20,"display.events.maxLines":"5","display.events.table.sortDirection":"asc"},omitFromSettings:["el","id","name","manager","reportModel","displayRowNumbers","segmentation","softWrap"],normalizeOptions:function(a,b){b.hasOwnProperty("count")||a.has("count")||a.set("count",this.reportDefaults["display.prefs.events.count"]),b.hasOwnProperty("maxLines")||a.has("maxLines")?a.set("maxLines",a.get("maxLines").toString()):a.set("maxLines",this.reportDefaults["display.events.count"].toString())},initialize:function(c){this.configure(),this.model=this.options.reportModel||w._createReportModel(this.reportDefaults),this.settings._sync=t.syncModels({source:this.settings,dest:this.model,prefix:"display.events.",include:["fields","type","count","rowNumbers","maxLines","table.sortDirection","table.sortColumn"],exclude:["drilldownRedirect","managerid","tableHeaderLabels","tableHeaderFieldName","fieldNameMapping","filedNameReplacementForActions"],auto:!0,alias:{count:"display.prefs.events.count"}}),this.settings.on("change",this.onSettingsChange,this),this.model.on("change",this.onReportChange,this),this.normalizeOptions(this.settings,c),this.resultModel=new j,this.summaryModel=new l,this.searchJobModel=new i,this.reportModel=new x,this.reportModel._syncPush=t.syncModels({source:this.model,dest:this.reportModel.entry.content,tokens:!1,auto:"push"}),this.reportModel._syncPull=t.syncModels({source:this.model,dest:this.reportModel.entry.content,tokens:!1,include:["display.events.table.sortColumn","display.events.table.sortDirection"],auto:"pull"}),this.listenTo(this.reportModel,"eventsviewer:drilldown",this.handleMiscDrilldown),this.reportModel.entry.content.on("change",this.onReportChange,this),this.applicationModel=u.get("app"),this.selectedFieldsCollection=new d,this.selectedRowsCollection=new e,this.workflowActionsCollection=new g,this.workflowActionsCollection.fetch({data:{app:this.applicationModel.get("app"),owner:this.applicationModel.get("owner"),count:-1,search:a.param({disabled:0}),sort_key:"name"},success:b.bind(function(){this._isWorkflowActionsCollectionReady=!0,this.render()},this)}),this.notableEventSuppressions=new h,this.notableEventSuppressions.fetch({data:{app:this.applicationModel.get("app"),owner:this.applicationModel.get("owner"),count:-1},success:b.bind(function(){this._isSuppressionsReady=!0,this.render()},this)}),this.eventRenderersCollection=new f,this.eventRenderersCollection.fetch({success:b.bind(function(){this._isEventRenderersCollectionReady=!0,this.render()},this)}),this._lastJobFetched=null,this.updateSelectedFields(),this.bindToComponentSetting("managerid",this.onManagerChange,this),this.backboneEventMediator=b.extend({},z.Events),this.editLinkView=new o({model:{result:this.resultModel,summary:this.summaryModel,report:this.reportModel,application:this.applicationModel},collection:{selectedRows:this.selectedRowsCollection},backboneEventMediator:this.backboneEventMediator});var k=new A;k.fetch({data:a.param({stanza:this.settings.get("logReviewSettingsStanza")}),success:function(a){if(null!==a&&a.attributes.table_fields.length>0&&(a.attributes.table_labels.length>0&&(this.settings.set("tableHeaderLabels",a.attributes.table_labels),this.settings.set("tableHeaderFieldNames",a.attributes.table_fields)),a.attributes.attribute_fields.length>0)){for(var b={},c=0;c<a.attributes.attribute_fields.length;c++)b[a.attributes.attribute_fields[c]]=a.attributes.attribute_labels[c];this.settings.set("fieldNameMapping",b)}}.bind(this),complete:function(){this.eventsViewer=new n({model:{result:this.resultModel,summary:this.summaryModel,searchJob:this.searchJobModel,report:this.reportModel,application:this.applicationModel},collection:{selectedFields:this.selectedFieldsCollection,selectedRows:this.selectedRowsCollection,workflowActions:this.workflowActionsCollection,notableEventSuppressions:this.notableEventSuppressions,eventRenderers:this.eventRenderersCollection},selectableFields:!1,headerMode:"none",allowRowExpand:!0,defaultDrilldown:!1,tableHeaderLabels:this.settings.get("tableHeaderLabels"),tableHeaderFieldNames:this.settings.get("tableHeaderFieldNames"),fieldNameMapping:this.settings.get("fieldNameMapping"),backboneEventMediator:this.backboneEventMediator,filedNameReplacementForActions:this.options.filedNameReplacementForActions,fieldFormating:this.options.fieldFormating}),this.listenTo(this.eventsViewer,"drilldown",this.emitDrilldownEvent)}.bind(this)}),this.manager||this.onManagerChange(r.Components,null)},onManagerChange:function(a,b){if(this.manager&&(this.manager.off(null,null,this),this.manager=null),this.eventData&&(this.eventData.off(),this.eventData.destroy(),this.eventData=null),this.summaryData&&(this.summaryData.off(),this.summaryData.destroy(),this.summaryData=null),this._searchStatus=null,this._eventCount=0,this._isSummaryModelReady=!1,this._isSearchJobModelReady=!1,this._lastJobFetched=null,this.resultModel.setFromSplunkD({}),this.summaryModel.setFromSplunkD({}),!b)return this._searchStatus={state:"nomanager"},void this.render();this._searchStatus={state:"start"},this.manager=b,this.manager.on("search:start",this.onSearchStart,this),this.manager.on("search:progress",this.onSearchProgress,this),this.manager.on("search:done",this.onSearchDone,this),this.manager.on("search:cancelled",this.onSearchCancelled,this),this.manager.on("search:refresh",this.onSearchRefreshed,this),this.manager.on("search:error",this.onSearchError,this),this.manager.on("search:fail",this.onSearchFailed,this),this.eventData=this.manager.data("events",{autofetch:!1,output_mode:"json",truncation_mode:"abstract"}),this.eventData.on("data",this.onEventData,this),this.eventData.on("error",this.onSearchError,this),this.summaryData=this.manager.data("summary",{autofetch:!1,output_mode:"json",top_count:10,output_time_format:"%d/%m/%y %l:%M:%S.%Q %p"}),this.summaryData.on("data",this.onSummaryData,this),this.summaryData.on("error",this._onSummaryError,this);var c=this.manager.get("data");c&&c.eventAvailableCount?(this.onSearchStart(c),this.onSearchProgress({content:c}),c.isDone&&this.onSearchDone({content:c})):this.render(),b.replayLastSearchEvent(this)},_fetchJob:function(a){this._isRealTimeSearch=a.isRealTimeSearch,this._lastJobFetched!==a.sid&&(this._lastJobFetched=a.sid,this.searchJobModel.set("id",a.sid));var c=this.manager.job.state();0!==b(c).size()&&(this.searchJobModel.setFromSplunkD({entry:[c]}),this._isSearchJobModelReady||(this._isSearchJobModelReady=!0,this.render()))},onSearchStart:function(a){this._searchStatus={state:"running"},this._eventCount=0,this._statusBuckets=void 0,this._lastJobFetched=null,this._isSummaryModelReady=!1,this._isSearchJobModelReady=!1,this.resultModel.setFromSplunkD({}),this.summaryModel.setFromSplunkD({}),this._fetchJob(a),this.render()},onSearchProgress:function(a){this._searchStatus={state:"running"},a=a||{};var b=a.content||{},d=b.eventAvailableCount||0,e=this._statusBuckets=b.statusBuckets||0,f=a.name,g=b.isRealTimeSearch;this._fetchJob(b),f&&(f=c.stripLeadingSearchCommand(f),this.reportModel.entry.content.set("search",f,{silent:!0})),this._eventCount=d,d>0&&this.updateEventData(),(e>0||g)&&this.updateSummaryData(),this.render()},onSearchDone:function(a){this._searchStatus={state:"done"},a=a||{};var b=a.content||{},c=b.eventAvailableCount||0;this._fetchJob(b),this._eventCount=c,this.updateEventData(),this.updateSummaryData(),this.render()},onSearchCancelled:function(){this._searchStatus={state:"cancelled"},this.render()},onSearchRefreshed:function(){this._searchStatus={state:"refresh"},this.render()},onSearchError:function(a,b){var c=q.getSearchErrorMessage(b)||a;this._searchStatus={state:"error",message:c},this.render()},onSearchFailed:function(a){var b=q.getSearchFailureMessage(a);this._searchStatus={state:"error",message:b},this.render()},onEventData:function(a,b){this.resultModel.setFromSplunkD(b),this.render()},onSummaryData:function(a,b){this.summaryModel.setFromSplunkD(b),this._isSummaryModelReady||(this._isSummaryModelReady=!0,this.render())},_onSummaryError:function(a,b){this.onSearchError(a,b)},onSettingsChange:function(a){a.hasChanged("fields")&&this.updateSelectedFields(),(a.hasChanged("showPager")||a.hasChanged("pagerPosition")||a.hasChanged("count")||a.hasChanged("fields"))&&this.render(),(a.hasChanged("showPager")||a.hasChanged("type")||a.hasChanged("count")||a.hasChanged("maxLines")||a.hasChanged("list.drilldown"))&&this.updateEventData()},onReportChange:function(a){(a.hasChanged("display.events.table.sortColumn")||a.hasChanged("display.events.table.sortDirection"))&&this.updateEventData()},emitDrilldownEvent:function(a,d){var e=this.model.get("display.events.type"),f=this.settings.get(e+".drilldown");if("none"!==f&&("table"!==e||c.normalizeBoolean(f)!==!1)){var g=a.data.field,h=a.data.value;void 0===g&&"addterm"===a.data.action?g="_raw":void 0===g&&a._time&&(g="_time",h=c.getEpochTimeFromISO(a._time));var i={"click.name":g,"click.value":h,"click.name2":g,"click.value2":h},j=a.idx;if(void 0!==j&&j>=0){var k=this.resultModel.results.at(j).toJSON();if(k){b.each(k,function(a,b){i["row."+b]=a.length>1?a.join(","):a[0]});var l=c.getEpochTimeFromISO(k._time);i.earliest=l,i.latest=String(parseFloat(l)+1)}}var m=b.bind(this._onIntentionsApplied,this,a),n=this.model,o=y.createEventPayload({field:g,data:i,event:a},function(){var a=b.pick(n.toJSON({tokens:!0}),"search","dispatch.earliest_time","dispatch.latest_time");d().done(m).always(function(){n.set(a,{tokens:!0,silent:!0})})});this.trigger("drilldown click",o,this),this.settings.get("drilldownRedirect")&&!o.defaultPrevented()&&o.drilldown()}},_onIntentionsApplied:function(a){var c=this.reportModel.entry.content,d=c.get("search"),e={earliest:c.get("dispatch.earliest_time"),latest:c.get("dispatch.latest_time")};e.earliest===this.manager.get("earliest_time")&&e.latest===this.manager.get("latest_time")&&(e=y.getNormalizedTimerange(this.manager));var f=b.extend({q:d},e),g=!1;if(this.trigger("drilldown:redirect",{data:f,preventDefault:function(){g=!0}}),!g){var h=k.ON_DRILLDOWN||y.redirectToSearchPage;h(f,a.event.ctrlKey||a.event.metaKey)}},handleMiscDrilldown:function(){var a=k.ON_DRILLDOWN||y.redirectToSearchPage,b={q:this.reportModel.entry.content.get("search"),earliest:this.reportModel.entry.content.get("dispatch.earliest_time")||"",latest:this.reportModel.entry.content.get("dispatch.latest_time")||""};a(b)},onPageChange:function(){this.selectedRowsCollection.reset(),this.updateEventData()},updateEventData:function(){if(this.eventData){var a=this.paginator?parseInt(this.paginator.settings.get("pageSize"),10):0,c=this.paginator?parseInt(this.paginator.settings.get("page"),10):0,d=this.settings.get("type"),e=a*c,f=parseInt(this.settings.get("count"),10)||this.reportDefaults["display.prefs.events.count"],g=b.isFunction(this.manager.query.postProcessResolve)?this.manager.query.postProcessResolve():"";this._isRealTimeSearch&&!g&&(e=0-f-e);var h=this.settings.get("maxLines").toString(),i=this.settings.get("list.drilldown"),j=this.model.get("display.events.table.sortColumn"),k=this.model.get("display.events.table.sortDirection"),l=i,m=null;switch(f=f>this.options.maxCount||f<1?this.reportDefaults["display.prefs.events.count"]:f,l=l?l.toLowerCase():null){case"inner":case"outer":case"full":case"none":break;default:l="full"}"table"===d&&j&&!this._isRealTimeSearch&&(m="desc"===k?"| sort "+(e+f)+" - "+j:"| sort "+(e+f)+" "+j);var n=JSON.parse(this.settings.get("fields"));n=b.union(n,["_raw","_time","_audit","_decoration","eventtype","linecount","_fulllinecount"]),this._isRealTimeSearch&&(n=b.union(n,["_serial","splunk_server"])),this.eventData.set({offset:e,count:f,max_lines:h,segmentation:l,search:m,fields:n}),this.eventData.fetch()}},updateSummaryData:function(){this.summaryData&&this.summaryData.fetch()},updateSelectedFields:function(){var c=this.settings.get("fields");if(c){if(b.isString(c))if(c=a.trim(c),"["===c[0]&&"]"===c.slice(-1))try{c=JSON.parse(c)}catch(d){}else c=b.map(c.match(B),function(a){return a.replace(C,"")}),this.updateFieldSetting(c);else this.updateFieldSetting(c);c=b.map(c,function(a){return{name:a}}),0!==c.length&&"*"!==c[0].name||(c=b.filter(this.resultModel.fields.toJSON(),function(a){return"_"!==a.name.charAt(0)}))}this.selectedFieldsCollection.reset(c),this.updateEventData()},updateFieldSetting:function(a){var b=JSON.stringify(a);this.settings.set("fields",b,{silent:!0}),this.model.set("display.events.fields",b,{silent:!0})},render:function(){var d=this._searchStatus||null,e=this._eventCount||0,f=(void 0===this._statusBuckets||this._statusBuckets>0,this._isSummaryModelReady===!0),g=this._isSearchJobModelReady===!0,h=this._isWorkflowActionsCollectionReady===!0,i=this._isSuppressionsReady===!0,j=this._isEventRenderersCollectionReady===!0,k=f&&g&&h&&j&&i,l=c.normalizeBoolean(this.settings.get("showPager")),m=this.settings.get("pagerPosition"),n=parseInt(this.settings.get("count"),10)||this.reportDefaults["display.prefs.events.count"];n=n>this.options.maxCount||n<1?this.reportDefaults["display.prefs.events.count"]:n;var o=null;if(d)switch(d.state){case"nomanager":o="no-search";break;case"start":o="empty";break;case"running":0!==e&&k||(o="waiting");break;case"cancelled":o="cancelled";break;case"refresh":o="refresh";break;case"done":0===e&&(o="no-events");break;case"error":o={level:"error",icon:"warning-sign",message:d.message};break;default:o="unknown"}return o?(this.messageElement||(this.messageElement=a('<div class="msg"></div>')),q.render(o,this.messageElement),this.$el.append(this.messageElement)):this.messageElement&&(this.messageElement.remove(),this.messageElement=null),k&&d&&!o?(this.eventsViewer&&!this._eventsViewerRendered&&(this._eventsViewerRendered=!0,this.eventsViewer.render(),this.$el.append(this.eventsViewer.el),this.editLinkView.render(),this.$el.prepend(this.editLinkView.el)),this.eventsViewer.activate({deep:!0}).$el.show(),this.editLinkView.activate({deep:!0}).$el.show()):this.eventsViewer&&(this.editLinkView.deactivate({deep:!0}).$el.hide(),this.eventsViewer.deactivate({deep:!0}).$el.hide()),k&&d&&!o&&l?(this.paginator||(this.paginator=new s({id:b.uniqueId(this.id+"-paginator")}),this.paginator.$el.addClass("ir-pagination-right"),this.paginator.settings.on("change:page",this.onPageChange,this)),this.paginator.settings.set({pageSize:n,itemCount:e}),"top"===m?this.$el.prepend(this.paginator.el):this.$el.append(this.paginator.el)):this.paginator&&(this.paginator.settings.off("change:page",this.onPageChange,this),this.paginator.remove(),this.paginator=null),this.trigger("rendered",this),this},remove:function(){this.eventsViewer&&(this.eventsViewer.deactivate({deep:!0}),this.eventsViewer.remove(),this.eventsViewer=null),this.paginator&&(this.paginator.settings.off("change:page",this.onPageChange,this),this.paginator.remove(),this.paginator=null),this.eventData&&(this.eventData.off(),this.eventData.destroy(),this.eventData=null),this.summaryData&&(this.summaryData.off(),this.summaryData.destroy(),this.summaryData=null),this.settings&&(this.settings.off(),this.settings._sync&&this.settings._sync.destroy()),this.reportModel&&(this.reportModel.off(),this.reportModel._syncPush&&this.reportModel._syncPush.destroy(),this.reportModel._syncPull&&this.reportModel._syncPull.destroy()),this.editLinkView&&(this.editLinkView.deactivate({deep:!0}),this.editLinkView.remove(),this.editLinkView=null),p.prototype.remove.call(this)}});return D});