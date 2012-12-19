enyo.kind({
  name: "App",
  kind: "FittableRows",
  classes: "enyo-fit",
  SEARCH_VIEW: 0,
  MAPS_VIEW: 0,
  JOB_DETAILS: 1,
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
        {name: "resultList", rowsPerPage: 10000, touch: true, kind: "SearchList", classes: "search-result-list", onSearchCompleted: "loadMaps", onAdditionSearchCompleted: "additionLoadMaps", onJobClicked: "resultsListClick"},
        {kind: "Panels", name: "contentPanels", draggable:false, animate: true, fit: true, components: [
          {name: "mapContainer", kind: "MapView", onJobClicked: "openJobItem"},
          {name: "jobview", kind: "JobDetails", onBack: "switchToMapView"}
        ]}
      ]},
    ]},
  ],
  refreshSpacer: function(inSender, inEvent) {
    this.resized();
    return true;
  },
  search: function(inSender, inEvent) {
    this.$.pageContentPanels.setIndex(this.SEARCH_VIEW);
    this.$.resultList.search(this.$.searchInput.getValue());
    return true;
  },
  loadMaps: function(inSender, inEvent) {
    var response = this.$.resultList.lastSearchResponse;
    this.$.mapContainer.setMapData(response);
    this.$.contentPanels.setIndex(this.MAPS_VIEW);
    this.$.mapContainer.loadMap(true);
    return true;
  },
  additionLoadMaps: function(inSender, inEvent) {
    var response = this.$.resultList.lastSearchResponse;
    this.$.mapContainer.setMapData(response);
    // this.$.contentPanels.setIndex(0);
    this.$.mapContainer.loadMap(false);
    return true;
  },
  resultsListClick: function(inSender, inEvent) {
    var item = this.$.resultList.results[inEvent.index];
    var jobId = item.job.JobSummary.uuid;
    
    if (this.$.contentPanels.index == this.MAPS_VIEW) {
      this.$.mapContainer.panToJob(jobId);
    } else {
      this.$.jobview.setJobId(jobId);
      this.$.jobview.loadJob();
    }
    return true;
  },
  switchToMapView: function(inSender, inEvent) {
    this.$.contentPanels.setIndex(this.MAPS_VIEW);
    return true;
  },
  openJobItem: function(inSender, inEvent) {
    this.$.jobview.setJobId(inEvent.uuid);
    this.$.jobview.loadJob();
    this.$.contentPanels.setIndex(this.JOB_DETAILS);
    return true;
  }

});