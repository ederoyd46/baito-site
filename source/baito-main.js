enyo.kind({
  name: "App",
  kind: "FittableRows",
  classes: "enyo-fit",
  components: [
    {kind: "onyx.MoreToolbar", layoutKind: "FittableColumnsLayout", components: [
      {kind: "onyx.Button", content: "Go", ontap: "search"},
      {kind: "onyx.InputDecorator", components: [
        {kind: "onyx.Input", name: "searchInput", value: "Leeds", classes: "search-input", placeholder: "search for jobs in..."}
      ]},
      { fit: true },
      {kind: "onyx.MenuDecorator", classes: "action-menu", name: "actionMenu", components: [
          {content: "Actions"},
          {kind: "onyx.Menu", components: [
              {content: "Login"},
              {content: "Login via Facebook"},
              {content: "My Account"},
              {classes: "onyx-menu-divider"},
              {content: "Logout"},
          ]}
      ]},
    ]},
    {kind: "FittableColumns", fit: true, components: [
      {name: "resultList", touch: true, kind: "SearchList", classes: "search-result-list", onSearchCompleted: "loadMaps", onJobClicked: "openJobItem"},
      {kind: "Panels", name: "contentPanels", draggable:false, animate: true, fit: true, components: [
        {name: "mapContainer", kind: "MapView"},
        {name: "jobContainer", kind: "Scroller", touch: true, components: [
          {name: "jobview", kind: "JobDetails"}
        ]}
      ]}
    ]},
  ],
  search: function(inSender, inEvent) {
    this.$.resultList.search(this.$.searchInput.getValue());
    // this.$.searchInput.getValue();
    // this.$.contentPanels.setIndex(0);
    
    // this.$.mapContainer.setMapData(inResponse);
    //     this.$.mapContainer.centerMap();
    //     
  },
  loadMaps: function(inSender, inEvent) {
    var response = this.$.resultList.lastSearchResponse;
    
    this.$.mapContainer.setMapData(response);
    this.$.mapContainer.centerMap();
  },
  openJobItem: function(inSender, inEvent) {
    var item = this.$.resultList.results[inEvent.index];
    jobId = item.job.JobSummary.uuid;
    this.$.jobview.setJobId(jobId);
    this.$.jobview.loadJob();
    this.$.contentPanels.setIndex(1);
  }

});