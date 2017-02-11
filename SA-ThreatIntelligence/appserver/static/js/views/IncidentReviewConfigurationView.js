"use strict";require.config({paths:{text:"../app/SA-Utils/js/lib/text",datatables:"../app/SA-Utils/js/lib/DataTables/js/jquery.dataTables",bootstrapDataTables:"../app/SA-Utils/js/lib/DataTables/js/dataTables.bootstrap"},shim:{bootstrapDataTables:{deps:["datatables"]}}}),define(["underscore","backbone","jquery","sa-utils/js/util/Utils","text!sa-threatintelligence/js/templates/IncidentReviewConfiguration.html","text!sa-threatintelligence/js/templates/IncidentReviewConfigurationTableAttributes.html","text!sa-threatintelligence/js/templates/IncidentReviewConfigurationEventAttributes.html","datatables","sa-threatintelligence/js/views/IncidentReviewConfigurationEditorView","sa-threatintelligence/js/views/IncidentReviewConfigurationDialogView","bootstrapDataTables","bootstrap.modal","css!sa-utils/js/lib/DataTables/css/jquery.dataTables.css","css!sa-utils/js/lib/DataTables/css/dataTables.bootstrap.css","css!sa-utils/css/SplunkDataTables2.css"],function(a,b,c,d,e,f,g,h,i,j){var k=b.View.extend({events:{"click .remove_table_attr":"removeAttr","click .remove_event_attr":"removeAttr","click .add_table_attr":"addTableAttr","click .add_event_attr":"addEventAttr","click .edit_table_attr":"editTableAttr","click .edit_event_attr":"editEventAttr","click .up_table_attr":"upTableAttr","click .down_table_attr":"downTableAttr","change .change_minimum_length":"changeMinimumLength","change .change_is_required":"changeIsRequired","change .change_allow_urgency_override":"changeAllowUrgencyOverride","click #btn-save":"ircsubmit","click #btn-cancel":"irccancel",'click a[href="#"]':function(a){a.preventDefault()}},initialize:function(b){var d=this;this.options=a.defaults(b||{},this.options),this.pendingChanges=!1,this.allowReloadOnce=!1,c(window).on("beforeunload",function(){return d.pendingChanges&&!d.allowReloadOnce?a("Please apply your changes!").t():void(d.allowReloadOnce&&(d.allowReloadOnce=!1))})},removeAttr:function(a){var b=this,d=c(a.target).data("key"),e=a.target.classList.contains("remove_table_attr")?"table_attributes":"event_attributes",f={el:c("#dialog_modal",this.$el),title:"Confirmation",unescapedMsg:"",msg:"Are you sure you want to remove this item from the list of attributes?",okText:"Ok",cancelText:"Cancel",onOk:function(){b.onPendingChange(),c("#dialog",b.$el).modal("hide");var a=b.options.attrConfig.entry.content,f=JSON.parse(a.get(e));f.splice(d,1),a.set(e,JSON.stringify(f)),b.trigger("refresh")},onCancel:function(){}};new j(f).render(),c("#dialog",this.$el).modal()},_editAttr:function(a,b,d,e,f,g){var h=this,j={key:a,label:b,field:d,isEdit:e,onSave:f,data:g},k=new i(j);c("#attr_modal",this.$el).html(k.render().el);var l=c("#attr-editor",this.$el).modal();l.on("shown.bs.modal",function(){var a=c('#attr-editor input[type="text"]',h.$el)[0];a.focus(),a.select()})},_saveAttr:function(a,b,d,e){var f=JSON.parse(e.config.get(e.config_key));e.isCreate&&f.splice(a,0,{label:"",field:""}),f[a].label=b,f[a].field=d,e.config.set(e.config_key,JSON.stringify(f)),c("#attr-editor",this.$el).modal("hide"),e.obj.trigger("refresh"),e.obj.onPendingChange()},editTableAttr:function(a){var b=c(a.target,this.$el).data("key"),d=this.options.attrConfig.entry.content,e=JSON.parse(d.get("table_attributes"))[b],f={config:d,config_key:"table_attributes",obj:this,isCreate:!1};return this._editAttr(b,e.label,e.field,!0,this._saveAttr,f)},editEventAttr:function(a){var b=c(a.target,this.$el).data("key"),d=this.options.attrConfig.entry.content,e=JSON.parse(d.get("event_attributes"))[b],f={config:d,config_key:"event_attributes",obj:this};return this._editAttr(b,e.label,e.field,!0,this._saveAttr,f)},addTableAttr:function(a){var b=c(a.target,this.$el).data("key"),d=this.options.attrConfig.entry.content,e={config:d,config_key:"table_attributes",obj:this,isCreate:!0};return this._editAttr(b,"","",!1,this._saveAttr,e)},addEventAttr:function(a){var b=this.options.attrConfig.entry.content,c={config:b,config_key:"event_attributes",obj:this,isCreate:!0};return this._editAttr(0,"","",!1,this._saveAttr,c)},_moveAttr:function(a,b,c,d){var e=JSON.parse(a.get(b));if(!(c<0||d<0||c===d||c>=e.length||d>=e.length)){var f=e[c];e.splice(c,1),e.splice(d,0,f),a.set(b,JSON.stringify(e)),this.trigger("refresh")}},upTableAttr:function(a){this.onPendingChange();var b=c(a.target,this.$el).data("key"),d=this.options.attrConfig.entry.content;this._moveAttr(d,"table_attributes",b,b-1)},downTableAttr:function(a){this.onPendingChange();var b=c(a.target,this.$el).data("key"),d=this.options.attrConfig.entry.content;this._moveAttr(d,"table_attributes",b,b+1)},changeMinimumLength:function(a){this.onPendingChange();var b=c("#minimum_length",this.$el).val();if(Splunk.util.isInt(b)){var d=this.options.commentConfig.entry.content;d.set("minimum_length",b)}},changeAllowUrgencyOverride:function(a){this.onPendingChange();var b=c("#allow_urgency_override",this.$el).prop("checked")?"1":"0",d=this.options.notableEditingConfig.entry.content;d.set("allow_urgency_override",b)},changeIsRequired:function(a){this.onPendingChange();var b=c("#is_required",this.$el).prop("checked")?"1":"0",d=this.options.commentConfig.entry.content;d.set("is_required",b)},onPendingChange:function(){this.pendingChanges=!0,c(".actions",this.$el).show(),c(".splunk-footer",this.$el).addClass("pending-changes"),c("#feedback-saved",this.$el).hide()},onSaved:function(){var a=this;this.pendingChanges=!1,c("#btn-save span",this.$el).text("Save");var b={title:"Success!",unescapedMsg:'<i aria-hidden="true" class="feedback-icon icon icon-check-circle" style="position: relative;"></i> ',msg:"Your changes have been successfully saved!",okText:"Done",cancelText:"Go to All Configurations",onOk:function(){c("#dialog",a.$el).modal("hide")},onCancel:function(){window.location.href=Splunk.util.make_url("app/SplunkEnterpriseSecuritySuite/ess_configuration")}},d=new j(b);c("#dialog_modal",this.$el).html(d.render().el),c("#dialog",this.$el).modal(),c(".actions",this.$el).hide(),c(".splunk-footer",this.$el).removeClass("pending-changes")},onModelSaved:function(a,b){this._savedModels+=1,3===this._savedModels&&this.onSaved()},onModelSaveFailed:function(a,b){var d=this,e={title:"Error",unescapedMsg:'<i aria-hidden="true" class="icon icon-alert alert-error" style="position: relative;"></i> ',msg:"Your changes were NOT successfully saved. Please try to save again!",okText:"Ok",cancelText:"Cancel",onOk:function(){c("#dialog",d.$el).modal("hide")},onCancel:function(){c("#dialog",d.$el).modal("hide")}},f=new j(e);c("#dialog_modal").html(f.render().el),c("#dialog").modal(),c("#btn-save span").text("Save")},ircsubmit:function(){this._savedModels=0,this.options.notableEditingConfig.save(null,{success:this.onModelSaved.bind(this),error:this.onModelSaveFailed.bind(this)}),this.options.commentConfig.save(null,{success:this.onModelSaved.bind(this),error:this.onModelSaveFailed.bind(this)}),this.options.attrConfig.save(null,{success:this.onModelSaved.bind(this),error:this.onModelSaveFailed.bind(this)}),c("#btn-save span",this.$el).text("Saving...")},irccancel:function(){this.allowReloadOnce=!0,window.location.reload()},update_notableEditing:function(a){if(void 0!==a&&a.isValid(!0)){var b=a.entry.content.get("allow_urgency_override");c("#allow_urgency_override",this.$el).prop("checked",Splunk.util.normalizeBoolean(b))}},update_comment:function(a){if(void 0!==a&&a.isValid(!0)){var b=a.entry.content;c("#minimum_length",this.$el).val(b.get("minimum_length")),c("#is_required",this.$el).prop("checked",Splunk.util.normalizeBoolean(b.get("is_required")))}},update_attr:function(b){if(void 0!==b&&b.isValid(!0)){var d=b.entry.content.get("table_attributes"),e=b.entry.content.get("event_attributes");void 0!==d&&void 0!==e&&(d=JSON.parse(d),c("#table_table_div",this.$el).html(a.template(f,{attr:d,insufficient_permissions:this.insufficient_permissions})),c("#table_table",this.$el).dataTable({iDisplayLength:25,bLengthChange:!1,bStateSave:!0,paging:!0,ordering:!1,searching:!1,columnDefs:[{width:"35%",targets:1},{width:"30%",targets:2}]}),e=JSON.parse(e),c("#event_table_div",this.$el).html(a.template(g,{attr:e,insufficient_permissions:this.insufficient_permissions})),c("#event_table",this.$el).dataTable({iDisplayLength:25,bLengthChange:!1,bStateSave:!0,paging:!0,ordering:!1,searching:!1,columnDefs:[{width:"35%",targets:1},{width:"30%",targets:2}]}))}},render:function(){var b=this,f='\n            <div class="breadcrumb">\n              <a href="<%= url %>">\n                <i aria-hidden="true" class="icon-chevron-left icon-no-underline"></i>\n                <span><%- text %></span>\n              </a>\n            </div>';return c(".dashboard-header").append(a.template(f,{url:Splunk.util.make_url("app/SplunkEnterpriseSecuritySuite/ess_configuration"),text:a("Back to ES Configuration").t()})),c.when(d.hasCapability("edit_log_review_settings")).then(function(c){b.insufficient_permissions=!c,b.$el.html(a.template(e,{insufficient_permissions:b.insufficient_permissions})),b.listenTo(b.options.notableEditingConfig,"change",b.update_notableEditing.bind(b)),b.listenTo(b.options.commentConfig,"change",b.update_comment.bind(b)),b.listenTo(b.options.attrConfig,"change",b.update_attr.bind(b)),b.on("refresh",function(){b.update_notableEditing(b.options.notableEditingConfig),b.update_comment(b.options.commentConfig),b.update_attr(b.options.attrConfig)}),b.trigger("refresh")}),this}});return k});