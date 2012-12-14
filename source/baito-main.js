enyo.kind({
  name: "App",
  kind: "FittableRows",
  classes: "enyo-fit",
  SEARCH_VIEW: 0,
  LOGIN_VIEW: 1,
  components: [
    {kind: "onyx.MoreToolbar", layoutKind: "FittableColumnsLayout", components: [
      {kind: "onyx.Button", content: "Go", ontap: "search"},
      {kind: "onyx.InputDecorator", components: [
        {kind: "onyx.Input", name: "searchInput", value: "Leeds", classes: "search-input", placeholder: "search for jobs in..."}
      ]},
      { fit: true },
      {kind: "onyx.MenuDecorator", classes: "action-menu", name: "actionMenu", components: [
          {name: "menuActions", content: "Actions"},
          {kind: "onyx.Menu", components: [
              {content: "Login", ontap: "login"},
              {content: "Register", ontap: "register"},
              {content: "My Account"},
              {classes: "onyx-menu-divider"},
              {content: "Logout"},
          ]}
      ]},
    ]},
    {kind: "Panels", arrangerKind: "LeftRightArranger", margin: 0, name: "pageContentPanels", draggable:false, animate: true, fit: true, components: [
      {kind: "FittableColumns", fit: true, components: [
        {name: "resultList", rowsPerPage: 10000, touch: true, kind: "SearchList", classes: "search-result-list", onSearchCompleted: "loadMaps", onJobClicked: "openJobItem"},
        {kind: "Panels", name: "contentPanels", draggable:false, animate: true, fit: true, components: [
          {name: "mapContainer", kind: "MapView", onJobClicked: "mapJobClicked"},
          {name: "jobContainer", kind: "Scroller", touch: true, components: [
            {name: "jobview", kind: "JobDetails"}
          ]}
        ]}
      ]},
      {name: "registerContainer", kind: "RegisterContainer"},
    ]},
    {name: "loginContainer", kind: "LoginContainer", floating: true, centered: true, onLoginComplete: "loginComplete", scrim: true, scrimWhenModal: false}
  ],
  login: function(inSender, inEvent) {
    this.$.loginContainer.show();
  },
  loginComplete: function(inSender, inEvent) {
    this.$.menuActions.setContent(inEvent.name);
    this.$.loginContainer.hide();
    // this.$.pageContentPanels.setIndex(this.SEARCH_VIEW);
  },
  register: function(inSender, inEvent) {
    this.$.pageContentPanels.setIndex(this.LOGIN_VIEW);
  },
  search: function(inSender, inEvent) {
    this.$.pageContentPanels.setIndex(this.SEARCH_VIEW);
    this.$.resultList.search(this.$.searchInput.getValue());
  },
  loadMaps: function(inSender, inEvent) {
    var response = this.$.resultList.lastSearchResponse;
    this.$.mapContainer.setMapData(response);
    this.$.contentPanels.setIndex(0);
    this.$.mapContainer.centerMap();
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