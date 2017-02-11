"use strict";define(["jquery","underscore","module","models/Base","models/services/search/jobs/Result","models/services/search/IntentionsParser","views/Base","sa-threatintelligence/js/components/incident_review/eventsviewer/table/Master"],function(a,b,c,d,e,f,g,h){var i=/r\d+/;return g.extend({moduleId:c.id,initialize:function(){g.prototype.initialize.apply(this,arguments),this.options=a.extend(!0,{selectableFields:!0,sortableFields:!0,headerMode:"dock",headerOffset:0,allowRowExpand:!0,scrollToTopOnPagination:!1,defaultDrilldown:!0},this.options),this.rendered={listraw:!1},this.model._result=new e,this.model.state=this.model.state||new d,this.model.listrawState=new d,this.model.intentions=new f,this.model.state.ROW_EXPAND_REX=i,this.model.listrawState.ROW_EXPAND_REX=i,this.children.listraw=new h({model:{result:this.model._result,summary:this.model.summary,searchJob:this.model.searchJob,report:this.model.report,application:this.model.application,state:this.model.listrawState},collection:{selectedFields:this.collection.selectedFields,selectedRows:this.collection.selectedRows,eventRenderers:this.collection.eventRenderers,workflowActions:this.collection.workflowActions,notableEventSuppressions:this.collection.notableEventSuppressions},selectableFields:this.options.selectableFields,sortableFields:this.options.sortableFields,headerMode:this.options.headerMode,headerOffset:this.options.headerOffset,allowRowExpand:this.options.allowRowExpand,tableHeaderLabels:this.options.tableHeaderLabels,tableHeaderFieldNames:this.options.tableHeaderFieldNames,fieldNameMapping:this.options.fieldNameMapping,backboneEventMediator:this.options.backboneEventMediator,filedNameReplacementForActions:this.options.filedNameReplacementForActions,fieldFormating:this.options.fieldFormating}),this.activate({stopRender:!0})},startListening:function(){this.listenTo(this.model.result.results,"reset",function(){if(this.model.state.get("isModalized"))this.model.state.set("pendingRender",!0);else{var a=this.model.result.responseText?JSON.parse(this.model.result.responseText):{};this.model._result.setFromSplunkD(a,{skipStoringResponseText:!0})}}),this.listenTo(this.model.intentions,"change",function(){this.model.report.entry.content.set("search",this.model.intentions.fullSearch())}),this.listenTo(this.model.listrawState,"drilldown",this.drilldownHandler),this.listenTo(this.model.report.entry.content,"change:display.prefs.events.offset",function(){if(this.options.scrollToTopOnPagination){var b=this.$el.offset().top,c=a(document).scrollTop(),d=this.$el.children(":visible").find("thead:visible").height(),e=a(".events-controls-inner").height();c>b&&a(document).scrollTop(b-(d+e))}})},activate:function(a){var c=b.extend({},a||{});return delete c.deep,this.active?g.prototype.activate.call(this,c):(this.model._result.setFromSplunkD(this.model.result.responseText?JSON.parse(this.model.result.responseText):{}),g.prototype.activate.call(this,c),this.manageStateOfChildren(c),this)},deactivate:function(a){return this.active?(g.prototype.deactivate.apply(this,arguments),this.model._result.clear(),this.model.intentions.clear(),this.model.listrawState.clear(),this):g.prototype.deactivate.apply(this,arguments)},drilldownHandler:function(a){var b=this.getDrilldownCallback(a.data,a.noFetch);this.options.defaultDrilldown&&b(),this.trigger("drilldown",a,b)},getDrilldownCallback:function(b,c){var d=this;return function(){return c?(d.model.report.entry.content.set(b),a.Deferred().resolve()):d.model.intentions.fetch({data:b})}},handlePendingRender:function(){if(this.model.state.get("pendingRender")){var a=this.model.result.responseText?JSON.parse(this.model.result.responseText):{};this.model._result.setFromSplunkD(a,{clone:!0}),this.model.state.set("pendingRender",!1)}},getType:function(){return"listraw"},manageStateOfChildren:function(a){void 0===a&&(a={});var b=this.getType();a.stopRender||this._render(b),this.children.listraw.activate({deep:!0}).$el.show()},updateContainerHeight:function(a){this.children[this.getType()].updateContainerHeight(a)},_render:function(a){this.rendered[a]||(this.children[a].render().appendTo(this.$el),this.rendered[a]=!0)},render:function(){return this._render(this.getType()),this}})});