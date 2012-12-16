enyo.kind({
  name: "App",
  kind: "FittableRows",
  classes: "enyo-fit",
  SEARCH_VIEW: 0,
  components: [
    {kind: "onyx.MoreToolbar", layoutKind: "FittableColumnsLayout", components: [
      {kind: "onyx.Button", content: "Go", ontap: "search"},
      {kind: "onyx.InputDecorator", components: [
        {kind: "onyx.Input", name: "searchInput", value: "Leeds", classes: "search-input", placeholder: "search for jobs in..."}
      ]},
      { name: "menuSpacer", fit: true },
      {kind: "ActionMenu", name: "actionMenu", onMenuActionPerformed: "refreshSpacer"},
    ]},
    {kind: "Panels", arrangerKind: "LeftRightArranger", margin: 0, name: "pageContentPanels", draggable:false, animate: true, fit: true, components: [
      {kind: "FittableColumns", fit: true, components: [
        {name: "resultList", rowsPerPage: 10000, touch: true, kind: "SearchList", classes: "search-result-list", onSearchCompleted: "loadMaps", onAdditionSearchCompleted: "additionLoadMaps", onJobClicked: "openJobItem"},
        {kind: "Panels", name: "contentPanels", draggable:false, animate: true, fit: true, components: [
          {name: "mapContainer", kind: "MapView", onJobClicked: "mapJobClicked"},
          {name: "jobContainer", kind: "Scroller", touch: true, components: [
            {name: "jobview", kind: "JobDetails"}
          ]}
        ]}
      ]},
    ]},
  ],
  refreshSpacer: function(inSender, inEvent) {
    this.resized();
  },
  search: function(inSender, inEvent) {
    this.$.pageContentPanels.setIndex(this.SEARCH_VIEW);
    this.$.resultList.search(this.$.searchInput.getValue());
  },
  loadMaps: function(inSender, inEvent) {
    var response = this.$.resultList.lastSearchResponse;
    this.$.mapContainer.setMapData(response);
    this.$.contentPanels.setIndex(0);
    this.$.mapContainer.loadMap(true);
  },
  additionLoadMaps: function(inSender, inEvent) {
    var response = this.$.resultList.lastSearchResponse;
    this.$.mapContainer.setMapData(response);
    this.$.contentPanels.setIndex(0);
    this.$.mapContainer.loadMap(false);
  },
  openJobItem: function(inSender, inEvent) {
    var item = this.$.resultList.results[inEvent.index];
    jobId = item.job.JobSummary.uuid;
    this.$.jobview.setJobId(jobId);
    this.$.jobview.loadJob();
    this.$.contentPanels.setIndex(1);
  },
  mapJobClicked: function(inSender, inEvent) {
    this.$.jobview.setJobId(inEvent.uuid);
    this.$.jobview.loadJob();
    this.$.contentPanels.setIndex(1);
  }

});