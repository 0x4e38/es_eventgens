"use strict";define(["backbone","jquery","underscore","module","collections/Base","views/Base","views/shared/results_table/ResultsTableHeader","views/shared/results_table/ResultsTableRow","views/shared/delegates/ColumnSort","views/shared/delegates/TableDock","views/shared/delegates/TableHeadStatic","helpers/Printer","splunk.util","util/general_utils","util/time","util/math_utils","jquery.sparkline","views/shared/results_table/renderers/BaseCellRenderer","views/shared/results_table/renderers/BaseRowExpansionRenderer","views/shared/results_table/renderers/NullCellRenderer","views/shared/results_table/renderers/NumberCellRenderer","views/shared/results_table/renderers/SparklineCellRenderer","views/shared/results_table/renderers/StringCellRenderer","views/shared/results_table/renderers/TimeCellRenderer","util/console"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y){var z=/^[^_]|^_time$|^_raw$/,A=o.RESULTS_TIMESTAMP_FORMATS,B=["wrap","rowNumbers"],C="."+h.MV_SUBCELL_CLASSNAME,D=13;return f.extend({moduleId:d.id,events:{"mouseover tbody td":function(a){this.handleCellMouseover(b(a.target))},"mouseout tbody td":function(a){this.handleCellMouseout(b(a.target))},"mousedown tbody td":function(a){this.handleCellMousedown(b(a.target),a)},"click tbody td":function(a){this.handleCellClick(b(a.target),a)},"keypress tbody td":function(a){a.which===D&&this.handleCellClick(b(a.target),a)},"keypress tbody tr":function(a){a.which===D&&this.handleCellClick(b(a.target).find("td[data-cell-index]").first(),a)}},initialize:function(a){f.prototype.initialize.call(this,a);var c={sortKeyAttr:"sortKey",sortDirAttr:"sortDirection",sortableFields:!0,countAttr:"count",offsetAttr:"offset",numRowSplits:1,headerClass:g,enableTableDock:!0};if(this.options=b.extend(!0,c,this.options),this.options.enableStaticHeader&&this.options.enableTableDock)throw new Error("Static header and docking header cannot be enabled at the same time");this.$el.addClass("results-table"),this.collection=this.collection||{},this.collection.customCellRenderers||(this.collection.customCellRenderers=new e),this.collection.customRowMappers.each(function(a){this.ensureValidRowMapper(a.get("mapper"))},this),this.collection.customCellRenderers.each(function(a){this.ensureValidCellRenderer(a.get("renderer"))},this),this.collection.customRowExpansionRenderers||(this.collection.customRowExpansionRenderers=new e),this.collection.customRowExpansionRenderers.each(function(a){this.ensureValidRowExpansionRenderer(a.get("renderer"))},this),this._cellRenderers=[],this._rowExpansionRenderers=[],this.children.columnSort=new i({el:this.el,model:this.model.config,autoUpdate:!0,sortKeyAttr:this.options.sortKeyAttr,sortDirAttr:this.options.sortDirAttr}),this.options.enableTableDock&&(this.children.tableDock=new j({el:this.el,offset:this.options.tableDockOffset,disableAutoResize:!0})),this.addCellRenderer(new w),this.addCellRenderer(new x),this.addCellRenderer(new u),this.addCellRenderer(new v),this.addCellRenderer(new t),this.dataFields=[],this.dataRows=[],this.columnTypes={},this.fieldHeatRanges={},this.fieldHeatOffsets={},this.fieldExtremes={},this.fieldTimestampFormats={},this.sparklineFormatSettings={},this.updateFormatSettings(),this.readResults(),this.activate({skipUpdate:!0})},startListening:function(){var a=c.debounce(function(){this.active&&this.handleResultsChange()},0);this.listenTo(this.model.collection,"add remove reset sort",a),this.listenTo(this.model.config,"change:count change:offset",a),this.listenTo(this.model.config,"change",this.handleFormatChange),this.listenTo(this.collection.customCellRenderers,"add",function(a){this.ensureValidCellRenderer(a.get("renderer"))}),this.listenTo(this.collection.customRowExpansionRenderers,"add",function(a){this.ensureValidRowExpansionRenderer(a.get("renderer"))}),this.$el.on("elementResize",function(a){this.invalidateReflow()}.bind(this)),this.listenTo(l,l.PRINT_START,this.invalidateReflow),this.listenTo(l,l.PRINT_END,this.invalidateReflow)},activate:function(a){return a=a||{},this.active?f.prototype.activate.apply(this,arguments):(this.options.disable&&this.$el.addClass("table-disabled"),a.skipUpdate||(this.updateFormatSettings(),this.handleResultsChange()),f.prototype.activate.apply(this,arguments))},deactivate:function(a){return this.active?(f.prototype.deactivate.apply(this,arguments),this.collapseRow(),this.$el.off("elementResize"),this):f.prototype.deactivate.apply(this,arguments)},ensureValidRowMapper:function(a){if("function"!=typeof a)throw new Error("Parameter rowMapper must be a function.")},addCellRenderer:function(a){this.ensureValidCellRenderer(a),this._cellRenderers.unshift(a)},removeCellRenderer:function(a){this.ensureValidCellRenderer(a);for(var b=this._cellRenderers,c=0,d=b.length;c<d;c++)if(b[c]===a){b.splice(c,1);break}},ensureValidCellRenderer:function(a){if("function"!=typeof a&&!(a instanceof r))throw new Error("Parameter cellRenderer must be a function or an instance of views/shared/results_table/renderers/BaseCellRenderer.")},getCellRenderers:function(){return this.collection.customCellRenderers.pluck("renderer").concat(this._cellRenderers)},addRowExpansionRenderer:function(a){this.ensureValidRowExpansionRenderer(a),this._rowExpansionRenderers.unshift(a)},removeRowExpansionRenderer:function(a){this.ensureValidRowExpansionRenderer(a);for(var b=this._rowExpansionRenderers,c=0,d=b.length;c<d;c++)if(b[c]===a){b.splice(c,1);break}},getRowExpansionRenderers:function(){return this.collection.customRowExpansionRenderers.pluck("renderer").concat(this._rowExpansionRenderers)},ensureValidRowExpansionRenderer:function(a){if("function"!=typeof a&&!(a instanceof s))throw new Error("Parameter rowExpansionRenderer must be a function or an instance of views/shared/results_table/renderers/BaseCellRenderer.")},expandRow:function(a){if("number"!=typeof a)throw new Error("Parameter rowIndex must be a Number.");this.collapseRow();var b=this.children["row_"+a];if(b)for(var c,d=b.getRowData(),e=this.getRowExpansionRenderers(),f=0,g=e.length;f<g;f++)if(c=e[f],c.canRender(d)){this._expandedRow=b,this._expandedRowIndex=a,b.expandRow(c,d);break}},collapseRow:function(){var a=this._expandedRow;a&&(this._expandedRowIndex=-1,this._expandedRow=null,a.collapseRow())},getExpandedRowIndex:function(){return this._expandedRowIndex>=0?this._expandedRowIndex:-1},remove:function(){return this.collapseRow(),this.$el.off("elementResize"),f.prototype.remove.apply(this,arguments)},handleResultsChange:function(){this.readResults(),this.render()},readResults:function(){var a=this.model.collection;coolection=this.collection.customRowMappers.each(function(b){var c=b.get("mapper");a=a.map(c)}),this.dataRows=a,this.dataFields=this.getFieldList(this.dataRows)},handleFormatChange:function(){var a=this.model.config.changedAttributes();return c(a).chain().pick(B).isEmpty().value()?void(a.hasOwnProperty("drilldown")&&this.updateDrilldownClasses()):(this.updateFormatSettings(),void this.debouncedRender())},render:function(){this.options.enableStaticHeader&&!this.el.innerHTML&&(this.$el.html(this.staticHeaderTemplate),this.children.staticHead=new k({el:this.el,flexWidthColumn:!1,disableAutoResize:!0}));var a=this.compiledTemplate({wrapResults:m.normalizeBoolean(this.model.config.get("wrap")),numDataColumns:this.dataFields.length}),c=b(a);if(this.disposeOfChildren(),this.dataFields.length>0&&this.dataRows.length>0){y.debug("rendering results table with data:",{fields:this.dataFields,rows:this.dataRows});var d=this.resultsAsColumns();this.updateColumnTypes(d),this.insertHeader(c,this.dataFields),this.insertRows(c,this.dataFields,this.dataRows,d),this.children.columnSort.update(c)}return this.options.enableStaticHeader?(this.$(".scroll-table-wrapper").html(c),this.children.staticHead.update()):this.$el.html(c),b.sparkline_display_visible(),this.children.tableDock&&this.children.tableDock.update(),this.options.disable&&(this.$tableDisabled=b('<div class="table-disabled-screen"></div>'),this.$el.append(this.$tableDisabled)),this.updateDrilldownClasses(),this.trigger("rendered"),this.$table=this.$("table").last(),this.invalidateReflow(),this},reflow:function(){this.children.tableDock&&(this.children.tableDock.update(),this.children.tableDock.handleContainerResize()),this.$tableDisabled&&this.$table.length>0&&this.$tableDisabled.width(this.$table[0].scrollWidth||"100%"),this.children.staticHead&&this.children.staticHead.handleContainerResize()},onAddedToDocument:function(){f.prototype.onAddedToDocument.apply(this,arguments),b.sparkline_display_visible()},handleCellMouseover:function(a){var b=this.model.config.get("drilldown"),c=m.normalizeBoolean(this.model.config.get("rowNumbers")),d=this.getRowExpansionRenderers().length>0;if("none"!==b){var e=a.closest("td"),f=this.getCellInfo(e),g=this.children["row_"+f.rowIndex];if(g)if("cell"===b){if(e.find(C).length>0&&!a.is(C))return;this.children.header.highlightColumn(f.cellIndex);var h=(c?1:0)+(d?1:0);this.children.tableDock&&this.children.tableDock.$headerTable.find("th").eq(parseInt(f.cellIndex,10)+h).addClass("highlighted"),this.children.staticHead&&this.children.staticHead.$headerTable.find("th").eq(parseInt(f.cellIndex,10)+h).addClass("highlighted"),g.highlightCell(a,f.cellIndex)}else g.highlightRow()}},handleCellMouseout:function(a){var b=this.model.config.get("drilldown"),c=m.normalizeBoolean(this.model.config.get("rowNumbers")),d=this.getRowExpansionRenderers().length>0;if("none"!==b){var e=a.closest("td"),f=this.getCellInfo(e),g=this.children["row_"+f.rowIndex];if(g)if("cell"===b){if(e.find(C).length>0&&!a.is(C)&&!a.parent().is(C))return;this.children.header.unHighlightColumn(f.cellIndex);var h=(c?1:0)+(d?1:0);this.children.tableDock&&this.children.tableDock.$headerTable.find("th").eq(parseInt(f.cellIndex,10)+h).removeClass("highlighted"),this.children.staticHead&&this.children.staticHead.$headerTable.find("th").eq(parseInt(f.cellIndex,10)+h).removeClass("highlighted"),g.unHighlightCell(a,f.cellIndex)}else g.unHighlightRow()}},handleCellMousedown:function(a,b){this.mouseDownX=b.pageX,this.mouseDownY=b.pageY},handleCellClick:function(a,b){b.preventDefault();var c=b.pageX&&this.mouseDownX?Math.abs(b.pageX-this.mouseDownX):0,d=b.pageY&&this.mouseDownY?Math.abs(b.pageY-this.mouseDownY):0;this.mouseDownX=0,this.mouseDownY=0;var e=2;if(c>e||d>e)return void this.trigger("cellHighlight",a,b);var f=a.closest("td");if(f.hasClass(h.ROW_EXPANSION_CLASSNAME)){var g=f.closest("tr"),i=Number(g.attr(h.ROW_INDEX_ATTR));return void(this.getExpandedRowIndex()!=i?this.expandRow(i):this.collapseRow())}var j=this.model.config.get("drilldown");if("none"!==j){var k=f.find(C).length>0;if("cell"!==j||!k||a.is(C)||a.parent().is(C)){var l=this.getCellInfo(f);k&&(l.mvIndex=this.getMultiValueIndex(a)),this.emitDrilldownEvent(this.generateDrilldownPayload(l,b,j))}}},generateDrilldownPayload:function(a,b,d){if(void 0===a.rowIndex||void 0===a.cellIndex)return null;var e=a.rowIndex,f=a.cellIndex,g=this.dataFields[0],h=this.isTimeField(g),i=this.dataRows[e][0],j={name:g,value:h?m.getEpochTimeFromISO(i):i,type:d,originalEvent:b};if(h){var k=this.getSpanSeriesForTimeField(g);k?j._span=parseFloat(k[e]):j._span=.001}var l=c.isArray(this.dataRows[e][f]);(f>this.options.numRowSplits-1||l)&&(j.name2=this.dataFields[f],j.value2=l?this.dataRows[e][f][a.mvIndex||0]:this.dataRows[e][f]);var n={};return c(this.dataRows[e]).each(function(a,b){n["row."+this.dataFields[b]]=a},this),j.rowContext=n,j.rowIndex=parseInt(e,10),j.cellIndex=parseInt(f,10),j.originalEvent=b,j},emitDrilldownEvent:function(a){a&&this.trigger("cellClick drilldown",a)},insertHeader:function(a,b){this.children.header=new this.options.headerClass(this.generateHeaderViewOptions(b)),this.children.header.render().replaceAll(a.find("thead"))},generateHeaderViewOptions:function(a){return{rowNumbers:m.normalizeBoolean(this.model.config.get("rowNumbers")),rowExpansion:this.getRowExpansionRenderers().length>0,fields:a,columnTypes:this.columnTypes,sortKeyAttribute:i.SORT_KEY_ATTR,sortableFields:this.options.sortableFields}},insertRows:function(b,d,e,f){var g=this.model.config.get("overlay"),i=m.normalizeBoolean(this.model.config.get("rowNumbers")),j=this.getRowExpansionRenderers().length>0;"heatmap"===g?this.updateHeatRanges(f):"highlow"===g&&this.updateExtremes(f),c(this.columnTypes).contains("timestamp")&&this.updateFieldTimestampFormats(d,e,f);var k=this.model.config.get("offset")||0,l=this.model.config.get(this.options.countAttr)||e.length,n=k+l-1,o=b.find("tbody"),p=e instanceof a.Collection?e:c(e);p.each(function(a,b){if(!(b<k||b>n)){var c={table:this,fields:d,values:a,cells:this.generateCellObjects(a,d,g,b),dataOverlay:g,rowIndex:b,numRowSplits:this.options.numRowSplits,rowExpansion:j,splitHighlight:this.options.splitHighlight};i&&(c.rowNumber=b+1);var e=this.children["row_"+b]=new h(c);e.render().appendTo(o)}},this)},generateCellObjects:function(a,b,d,e){return c(a).map(function(a,c){var e=b[c];return{value:a,field:e,dataOverlay:d,columnType:this.columnTypes[e]||"string",heatRange:this.fieldHeatRanges[e],heatOffset:this.fieldHeatOffsets[e],extremes:this.fieldExtremes[e],timestampFormat:this.fieldTimestampFormats[e],sparklineFormat:this.sparklineFormatSettings[e],index:c}},this)},disposeOfChildren:function(){this.collapseRow(),c(this.children).each(function(a,b){"header"!==b&&"row_"!==b.substr(0,4)||(a.stopListening(),delete this.children[b])},this)},resultsAsColumns:function(){var a={},b=this.dataRows||new e;return c(this.getFieldList(this.dataRows)).each(function(d,e){a[d]=c(b).pluck(e)}),a},updateDrilldownClasses:function(){var a=this.model.config.get("drilldown"),b=this.$(".table"),c=b.find("tbody > tr"),d=b.find("tbody > tr > td"),e=d.find(".multivalue-subcell");"none"===a?(b.removeClass("table-drilldown table-drilldown-row table-drilldown-cell"),c.removeAttr("tabindex"),d.removeAttr("tabindex"),e.removeAttr("tabindex")):"cell"===a?(b.addClass("table-drilldown table-drilldown-cell").removeClass("table-drilldown-row"),c.removeAttr("tabindex"),d.attr("tabindex","0"),e.attr("tabindex","0")):(b.addClass("table-drilldown table-drilldown-row").removeClass("table-drilldown-cell"),c.attr("tabindex","0"),d.removeAttr("tabindex"),e.removeAttr("tabindex")),b.find(".row-expansion-toggle").removeAttr("tabindex")},updateFormatSettings:function(){},updateColumnTypes:function(a){this.columnTypes={},c(a).each(function(a,b){this.isDataField(b)&&(this.isTimeField(b)?this.columnTypes[b]="timestamp":this.columnTypes[b]=n.valuesAreNumeric(a)?"number":"string")},this)},updateHeatRanges:function(a){var b=this.getAllNumericValues(a),d=n.getPercentiles(b.sort(function(a,b){return a-b}),.05,.95),e=d.upper-d.lower,f=d.lower;this.fieldHeatRanges={},this.fieldHeatOffsets={},c(a).each(function(a,b){"number"===this.columnTypes[b]&&(this.fieldHeatRanges[b]=e,this.fieldHeatOffsets[b]=f)},this)},updateExtremes:function(a){var b=this.getAllNumericValues(a),d={min:c(b).chain().without(null).min().value(),max:c(b).max()};this.fieldExtremes={},c(a).each(function(a,b){"number"===this.columnTypes[b]&&(this.fieldExtremes[b]=d)},this)},getAllNumericValues:function(a){var b=function(a){return p.strictParseFloat(a)||null};return c(a).chain().filter(function(a,b){return"number"===this.columnTypes[b]},this).flatten().map(b).value()},updateFieldTimestampFormats:function(a,b,d){this.fieldTimestampFormats={},c(a).each(function(a,b){if(this.isTimeField(a)){var c=o.determineLabelGranularity(d[a],this.getSpanSeriesForTimeField(a));this.fieldTimestampFormats[a]=A[c]}},this)},getFieldList:function(a){var b=this.model.config.get("fieldList");if(c.isArray(b))return b;var d=c(a).reduceRight(function(a,b){return c.union(a,c.keys(b))},[]);return c.isFunction(b)?b(d):d},isDataField:function(a){return z.test(a)},isTimeField:function(a){return a in{_time:!0,earliest_time:!0,latest_time:!0}},getSpanSeriesForTimeField:function(a){var b="_span";return this.resultsAsColumns()[b]},getCellInfo:function(a){return{cellIndex:a.attr(h.CELL_INDEX_ATTR),rowIndex:a.closest("tr").attr(h.ROW_INDEX_ATTR)}},getMultiValueIndex:function(a){return a.attr(h.MV_INDEX_ATTR)},template:'            <table class="table table-chrome table-striped <%- wrapResults ? "wrapped-results" : "not-wrapped-results" %> <%- numDataColumns === 1 ? \'single-column-table\' : \'\' %>">                <thead></thead>                <tbody></tbody>            </table>        ',staticHeaderTemplate:'            <div class="header-table-static"></div>            <div class="scroll-table-wrapper"></div>        '})});