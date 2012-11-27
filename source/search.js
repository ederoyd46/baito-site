enyo.kind({
  name: "Search",
  classes: "enyo-unselectable enyo-fit onyx",
  kind: "FittableRows",
  arrangerKind: "CollapsingArranger",
  components: [
    {kind: "onyx.Toolbar", components: [
      {kind: "onyx.InputDecorator", components: [
        {name: "searchInput", kind: "onyx.Input", value: "leeds", placeholder: "Enter seach term"}
      ]},
      {kind: "onyx.Button", content: "search", ontap: "search"}
    ]},
    {name: "list", kind: "List", classes: "list-sample-pulldown-list", fit: true, onSetupItem: "setupItem", touch: true, components: [
      {style: "padding: 10px;", classes: "list-sample-pulldown-item enyo-border-box", ontap: "itemTap", components: [
        {name: "distance", tag: "span", style: "font-weight: bold; margin-right:10px;"},
        {name: "jobTitle", tag: "span", style: "color: lightgrey;"}
      ]}
    ]}
  ],
  rendered: function() {
    this.inherited(arguments);
    this.search();
  },
  itemTap: function(inSender, inEvent) {
    var item = this.results[inEvent.index];
    console.log(item);
  },
  search: function() {
    // Capture searchText and strip any whitespace
    var searchText = this.$.searchInput.getValue().replace(/^\s+|\s+$/g, '');

    if (searchText !== "") {
      var req = new enyo.Ajax({
        url: "http://baito-dev.co.uk/api/search"
      });
      req.response(enyo.bind(this, "processSearchResults"));
      req.go({searchTerm: searchText,limit: 100});
    } else {
      // For whitespace searches, set new content value in order to display placeholder
      this.$.searchInput.setValue(searchText);
    }
  },
  processSearchResults: function(inRequest, inResponse) {
    this.results = inResponse.SearchResultsResponse.results;
    this.$.list.setCount(this.results.length);
    if (this.pulled) {
      this.$.list.completePull();
    } else {
      this.$.list.reset();
    }
  },
  setupItem: function(inSender, inEvent) {
    var i = inEvent.index;
    var item = this.results[i];
    this.$.distance.setContent(item.distance);
    this.$.jobTitle.setContent(item.job.JobSummary.title);
  }
});