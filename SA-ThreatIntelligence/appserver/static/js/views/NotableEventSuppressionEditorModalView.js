"use strict";define(["underscore","backbone","jquery","sa-threatintelligence/js/collections/NotableEventSuppressions","sa-threatintelligence/js/models/NotableEventSuppression","views/shared/controls/ControlGroup","models/shared/DateInput","text!sa-threatintelligence/js/templates/NotableEventSuppressionEditorModal.html"],function(a,b,c,d,e,f,g,h){var i=b.View.extend({className:"NotableEventSuppressionEditModalView",events:{"click #save_suppression":"saveSuppression"},initialize:function(){void 0===this.collection?this.passed_collection=!1:this.passed_collection=!0,this.fetch_name_holder="",this.edit_valid_name=!1,this.edit_valid_search=!1,this.edit_model=new b.Model,this.edit_model.on("change:name",this.validateName,this),this.edit_model.on("change:search",this.validateSearch,this),this.edit_model.on("change:description",this.descriptionChanged,this),this.edit_modal_expiration=new g,this.edit_modal_expiration.on("change",this.expirationChanged,this),this.edit_modal_start=new g,this.edit_modal_start.on("change",this.startChanged,this),this.edit_suppression_name=new f({label:a("Name").t(),required:!0,controlType:"Text",controlOptions:{model:this.edit_model,modelAttribute:"name",placeholder:a("Enter a unique name").t()}}),this.edit_suppression_description=new f({label:a("Description (optional)").t(),controlType:"Text",controlOptions:{model:this.edit_model,modelAttribute:"description",placeholder:a("Enter a description of the suppression").t()}}),this.edit_suppression_search=new f({label:a("Search").t(),required:!0,controlType:"Textarea",controlOptions:{model:this.edit_model,modelAttribute:"search"}}),this.edit_suppression_expiration=new f({label:a("Expiration Time (optional)").t(),controlType:"Date",controlOptions:{model:this.edit_modal_expiration,validate:!1},help:a("Events after this time will not be suppressed.").t()}),this.edit_suppression_start=new f({label:a("Start Time (optional)").t(),controlType:"Date",controlOptions:{model:this.edit_modal_start,validate:!0},help:a("Events before this time will not be suppressed.").t()})},_nameExists:function(a){var b="notable_suppression-"+a,c=this.collection.find(function(a){return a.entry.get("name")===b});return void 0!==c},validateName:function(){var b=this.edit_model.get("name");0===b.length?(this.edit_suppression_name.error(!0,""),this.edit_suppression_name.setHelpText(a("Suppression name cannot be empty").t()),this.edit_valid_name=!1,this.edit_save.addClass("disabled")):b.search(/[^\w \-]/)!==-1?(this.edit_suppression_name.error(!0,""),this.edit_suppression_name.setHelpText(a("Suppression name can only have alpha-numeric characters, space, dash, and underscore").t()),this.edit_valid_name=!1,this.edit_save.addClass("disabled")):this.edit_model.get("is_new")&&this._nameExists(b)?(this.edit_suppression_name.error(!0,""),this.edit_suppression_name.setHelpText(a("A suppression of the same name already exists").t()),this.edit_valid_name=!1,this.edit_save.addClass("disabled")):(this.edit_suppression_name.error(!1,""),this.edit_suppression_name.setHelpText(""),this.edit_valid_name=!0,this.edit_valid_search&&this.edit_save.removeClass("disabled"))},validateSearch:function(){var b=this.edit_model.get("search");0===b.length?(this.edit_suppression_search.error(!0,""),this.edit_suppression_search.setHelpText(a("Search cannot be empty").t()),this.edit_valid_search=!1,this.edit_save.addClass("disabled")):(this.edit_suppression_search.error(!1,""),this.edit_suppression_search.setHelpText(""),this.edit_valid_search=!0,this.edit_valid_name&&this.edit_save.removeClass("disabled"))},descriptionChanged:function(){!this.edit_model.get("is_new")&&this.edit_valid_search&&this.edit_save.removeClass("disabled")},expirationChanged:function(){var a=this.edit_model.get("search").replace(/\s+_time\s*<=?\s*\d+/g,""),b=Math.floor(this.edit_modal_expiration.jsDate({includeTime:!1}).valueOf()/1e3),c=a+" _time<"+b;this.edit_model.set("search",c)},startChanged:function(){var a=this.edit_model.get("search").replace(/\s+_time\s*>=?\s*\d+/g,""),b=Math.floor(this.edit_modal_start.jsDate({includeTime:!1}).valueOf()/1e3),c=a+" _time>"+b;this.edit_model.set("search",c)},saveSuppression:function(){if(!this.edit_save.hasClass("disabled"))if(this.edit_save.text(a("Saving...").t()),this.edit_save.addClass("disabled"),this.edit_model.get("is_new")){var b=new e;b.entry.content.set({name:"notable_suppression-"+this.edit_model.get("name"),search:this.edit_model.get("search"),description:this.edit_model.get("description")||"",disabled:!1}),b.save({},{data:{app:"SA-ThreatIntelligence",owner:"nobody",sharing:"global"},success:function(){this.trigger("saved"),this.edit_save.text(a("Save").t()),this.edit_modal.modal("hide"),this.passed_collection||this.fetchCollection()}.bind(this),error:function(){this.edit_save.text(a("Save").t()),this.edit_modal_body.hide(),c("div",this.error_message).text(a("Error saving new suppression").t()),this.error_message.show()}.bind(this)})}else this.suppression.entry.content.set({search:this.edit_model.get("search"),description:this.edit_model.get("description")||"",disabled:!1}),this.suppression.save({},{success:function(){this.trigger("saved"),this.edit_save.text(a("Save").t()),this.edit_modal.modal("hide"),this.passed_collection||this.fetchCollection()}.bind(this),error:function(){this.edit_save.text(a("Save").t()),this.edit_modal_body.hide(),c("div",this.error_message).text(a("Error updating suppression").t()),this.error_message.show()}.bind(this)})},openModal:function(a){this.fetching_collection?void 0===a?this.fetch_name_holder="":this.fetch_name_holder=a:void 0===a?this.prepareEdit(""):this.prepareEdit(a),this.edit_modal.modal("show")},prepareEdit:function(b){var c,d,e;if(""===b)c="",d="`get_notable_index`",e="",this.edit_modal_header.text(a("Create New Suppression").t()),this.edit_model.set("is_new",!0),this.edit_suppression_name.enable(),this.edit_suppression_expiration.$("input[type=text]").val(""),this.edit_suppression_expiration.show(),this.edit_suppression_start.$("input[type=text]").val(""),this.edit_suppression_start.show();else{var f=this.collection.find(function(a){return a.entry.get("name")===b});this.suppression=f,c=b.replace(/^notable_suppression-/,""),d=f.entry.content.get("search"),e=f.entry.content.get("description"),this.edit_modal_header.text(a("Edit Suppression").t()),this.edit_model.set("is_new",!1),this.edit_suppression_name.disable(),this.edit_suppression_expiration.hide(),this.edit_suppression_start.hide()}this.edit_modal_body.show(),this.error_message.hide(),this.edit_model.set("name",c),this.edit_model.set("description",e),this.edit_model.set("search",d),this.edit_save.addClass("disabled")},fetchCollection:function(){this.edit_modal_body.hide(),this.edit_fetch_message.show(),this.fetching_collection=!0,this.collection.fetch({success:function(){this.fetching_collection=!1,this.edit_modal_body.show(),this.edit_fetch_message.hide(),this.prepareEdit(this.fetch_name_holder)}.bind(this),error:function(){this.edit_modal_body.hide(),this.edit_fetch_message.hide(),c("div",this.error_message).text(a("Error fetching suppressions").t()),this.error_message.show()}.bind(this)})},render:function(){return this.$el.html(a.template(h)),this.edit_modal=c("#edit_suppressions_modal",this.$el),this.edit_modal_header=c("h3",this.edit_modal),this.edit_modal_body=c("#edit_suppressions_form",this.$el),this.edit_save=c("#save_suppression",this.$el),this.edit_fetch_message=c("#edit_supp_fetch_message",this.$el),this.error_message=c("#edit_supp_error_message",this.$el),this.edit_suppression_name.render().appendTo(this.edit_modal_body),this.edit_suppression_description.render().appendTo(this.edit_modal_body),this.edit_suppression_search.render().appendTo(this.edit_modal_body),this.edit_suppression_start.render().appendTo(this.edit_modal_body),this.edit_suppression_expiration.render().appendTo(this.edit_modal_body),this.passed_collection||(this.collection=new d,this.fetchCollection()),this}});return i});