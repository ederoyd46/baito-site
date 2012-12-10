enyo.kind({
  name: "App",
  kind: "FittableRows",
  classes: "enyo-fit",
  searchText: "",
  results: [],
  searchInProgress: false,
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
      {name: "resultList", kind: "List", classes: "search-result-list", touch: true, onSetupItem: "setupItem", onScroll: "scrolling", components: [
        {classes: "search-result-entry", ontap: "openJobItem", tag: "div", components: [
          {name: "jobTitle", tag: "span"}
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
    if (this.searchInProgress) {
      return;
    }
    
    this.searchInProgress = true;
    var searchText = this.$.searchInput.getValue().replace(/^\s+|\s+$/g, '');
    if (searchText !== "") {
      var req = new enyo.Ajax({url: "/api/search"});
      req.response(enyo.bind(this, "processSearchResults"));

      if (this.searchText == searchText) {
        req.go({searchTerm: searchText,limit: 50, skip: this.results.length});
      } else {
        this.searchText = searchText;
        this.results = [];
        req.go({searchTerm: searchText,limit: 50});
      }
    } else {
      this.$.searchInput.setValue(searchText);
      this.searchInProgress = false;
    }
  },
  scrolling: function(inSender, inEvent) {
    var boundary = inEvent.originator.bottomBoundary;
    if (boundary && boundary != 0) {
      var y = inEvent.originator.y;
      var percentage = (Math.round(y) / Math.round(boundary))*100;
      console.log("Boundary: " + boundary + " Current: " + y + " remainder: " + (Math.round(boundary) - Math.round(y)) + " Percent: " + ((Math.round(y) / Math.round(boundary))*100));
      
      if (percentage > 95) {
        console.log("Fire search");
        this.search(inSender, inEvent);
      }
      
    }
  },
  processSearchResults: function(inRequest, inResponse) {
    this.$.contentPanels.setIndex(0);
    if (this.results.length == 0) {
      this.results = inResponse.SearchResultsResponse.results;
      this.$.resultList.setCount(this.results.length);
      this.$.resultList.reset();
    } else {
      this.results.push.apply(this.results,inResponse.SearchResultsResponse.results);
      this.$.resultList.setCount(this.results.length);
      this.$.resultList.refresh();
    }
     
    this.$.mapContainer.setMapData(inResponse);
    this.$.mapContainer.centerMap();
    this.searchInProgress = false;
  },
  setupItem: function(inSender, inEvent) {
    var i = inEvent.index;
    var item = this.results[i];
    var entry = item.job.JobSummary.title + " (" + item.distance + " miles away)";
    this.$.jobTitle.setContent(entry);
  },
  openJobItem: function(inSender, inEvent) {
    var item = this.results[inEvent.index];
    jobId = item.job.JobSummary.uuid;
    this.$.jobview.setJobId(jobId);
    this.$.jobview.loadJob();
    this.$.contentPanels.setIndex(1);
  }

});