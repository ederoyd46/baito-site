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
      {name: "resultList", kind: "List", classes: "search-result-list", touch: true, onSetupItem: "setupItem", components: [
        {classes: "search-result-entry", ontap: "openJobItem", tag: "div", components: [
          {name: "jobTitle", tag: "span"},
          {content: " (", tag: "span"},
          {name: "distance", tag: "span"},
          {content: " miles away)", tag: "span"}
        ]}
      ]},
      {kind: "Panels", name: "contentPanels", draggable:false, animate: true, fit: true, components: [
        {name: "mapContainer", kind: "MapView"},
        {name: "jobContainer", kind: "Scroller", touch: true, components: [
          {name: "jobview", kind: "JobDetails"}
        ]}
      ]}
    ]},
  ],
  search: function(inSender, inEvent) {
    console.log("searching");
    var searchText = this.$.searchInput.getValue().replace(/^\s+|\s+$/g, '');
    if (searchText !== "") {
      var req = new enyo.Ajax({url: "/api/search"});
      req.response(enyo.bind(this, "processSearchResults"));
      req.go({searchTerm: searchText,limit: 50});
    } else {
      this.$.searchInput.setValue(searchText);
    }
  },
  processSearchResults: function(inRequest, inResponse) {
    this.$.contentPanels.setIndex(0);
    this.results = inResponse.SearchResultsResponse.results;
    this.$.resultList.setCount(this.results.length);
    this.$.resultList.reset();
    this.$.mapContainer.setMapData(inResponse);
    this.$.mapContainer.centerMap();
  },
  setupItem: function(inSender, inEvent) {
    var i = inEvent.index;
    var item = this.results[i];
    this.$.distance.setContent(item.distance);
    this.$.jobTitle.setContent(item.job.JobSummary.title);
  },
  openJobItem: function(inSender, inEvent) {
    var item = this.results[inEvent.index];
    jobId = item.job.JobSummary.uuid;
    this.$.jobview.setJobId(jobId);
    this.$.jobview.loadJob();
    console.log(this.$.jobview);
    this.$.contentPanels.setIndex(1);
  }

});