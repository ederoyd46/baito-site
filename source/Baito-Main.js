enyo.kind({
  name: "Baito.Main",
  kind: "FittableRows", 
  classes: "enyo-fit", 
  components: [
    {kind: "onyx.Toolbar", components: [
      {content: "Search for Jobs"},
      {kind: "onyx.Button", content: "Go", ontap: "search"},
      {kind: "onyx.InputDecorator", components: [
        {kind: "onyx.Input", name: "searchInput"}
      ]}
    ]},
    {kind: "FittableColumns", fit: true, components: [
      {name: "resultList", kind: "List", fit: true, touch: true, onSetupItem: "setupItem", components: [
        {style: "padding: 10px;", ontap: "openJobItem", components: [
          {name: "distance", tag: "span"},
          {name: "jobTitle", tag: "span"}
        ]}
      ]},
      {kind: "Panels", name: "searchPanels", fit: true, realtimeFit: true, components: [
        {content:0, style:"background:black;", components: [
          {name: "mapView", tag: "div"}
        ]}
      ]}
    ]},
  ],
  search: function(inSender, inEvent) {
    var searchText = this.$.searchInput.getValue().replace(/^\s+|\s+$/g, '');
    if (searchText !== "") {
      var req = new enyo.Ajax({url: "http://baito-dev.co.uk/api/search"});
      req.response(enyo.bind(this, "processSearchResults"));
      req.go({searchTerm: searchText,limit: 100});
    } else {
      this.$.searchInput.setValue(searchText);
    }
  },
  processSearchResults: function(inRequest, inResponse) {
    this.results = inResponse.SearchResultsResponse.results;
    this.$.resultList.setCount(this.results.length);
    this.$.resultList.reset();
  },
  setupItem: function(inSender, inEvent) {
    var i = inEvent.index;
    var item = this.results[i];
    this.$.distance.setContent(item.distance);
    this.$.jobTitle.setContent(item.job.JobSummary.title);
  },
  openJobItem: function(inSender, inEvent) {
    var item = this.results[inEvent.index];
    console.log(item);
  }
});