enyo.kind({
  name: "App",
  kind: "FittableRows",
  classes: "enyo-fit",
  INITIAL_VIEW: 0,
  SEARCH_VIEW: 1,
  MYACCOUNT_VIEW: 2,
  MAPS_VIEW: 0,
  JOB_DETAILS: 1,
  components: [
    {kind: "onyx.MoreToolbar", classes: "baito-toolbar", layoutKind: "FittableColumnsLayout", components: [
      {content: "BETA VERSION", style: "float: left;color: black; margin:0px"},
      {classes: "baito-toolbar-logo", ontap: "switchToHomePage"},
      {classes: "search-input-container", components: [
        {kind: "onyx.InputDecorator", classes: "search-input-decorator", components: [
          {kind: "onyx.Input", name: "searchInput", classes: "search-input", placeholder: "Search for jobs in...(e.g. 'Penzance' or 'TR18 2NF')", onkeypress: "inputChange"},
          {kind: "Image", src: "/assets/search-input-search.png", style: "width: 20px; height: 20px;", onclick: "search"}
        ]},
      ]},
      {kind: "ActionMenu", name: "actionMenu", classes: "baito-toolbar-actions", onMenuActionPerformed: "refreshSpacer", onMyAccount: "switchToMyAccount", onLogout: "switchToHomePage", onCreateJob: "createJob"},
    ]},
    {kind: "Panels", name: "pageContentPanels", draggable:false, animate: true, fit: true, components: [
      {name: "steps", classes: "steps", components: [
        {name: "step1", classes: "step1", components: [
          {classes: "step1-img"},
          {classes: "step1-txt", content: "Registration is free, no cv required"}
        ]},
        {name: "step2", classes: "step2", components: [
          {classes: "step2-img"},
          {classes: "step2-txt", content: "Search for a variety of jobs in your area"}
        ]},
        {name: "step3", classes: "step3", components: [
          {classes: "step3-img"},
          {classes: "step3-txt", content: "Applying is quick and easy"}
        ]},
      ]},
      {kind: "FittableColumns", fit: true, components: [
        {name: "resultList", rowsPerPage: 10000, touch: true, kind: "SearchList", classes: "search-result-list", onSearchCompleted: "loadMaps", onAdditionSearchCompleted: "additionLoadMaps", onJobClicked: "resultsListClick", onJobLongPress: "resultsListLongPress", onNoResultsFound: "noSearchResultsFound"},
        {kind: "Panels", name: "contentPanels", draggable:false, animate: true, fit: true, components: [
          {name: "mapContainer", kind: "MapView", onJobClicked: "openJobItem"},
          {name: "jobview", kind: "JobDetails", onBack: "switchToMapView"}
        ]}
      ]},
      {kind: "MyAccountContainer", name: "myAccountContainer"},
    ]},
    {name: "noResultsFound", kind: "onyx.Popup", style: "padding: 10px", floating: true, centered: true, scrim: true, scrimWhenModal: false, components:[
      {content: "No Results Found..."}
    ]},
  ],
  refreshSpacer: function(inSender, inEvent) {
    this.resized();
    return true;
  },
  inputChange: function(inSender, inEvent) {
    if (inEvent.keyCode == 13) {
      this.search(inSender, inEvent);
    }
  },  
  switchToHomePage: function(inSender, inEvent) {
    this.$.pageContentPanels.setIndex(this.INITIAL_VIEW);
  },
  switchToMyAccount: function(inSender, inEvent) {
    this.$.pageContentPanels.setIndex(this.MYACCOUNT_VIEW);
  },
  search: function(inSender, inEvent) {
    this.$.pageContentPanels.setIndex(this.SEARCH_VIEW);
    this.$.resultList.search(this.$.searchInput.getValue());
    return true;
  },
  noSearchResultsFound: function(inSender, inEvent) {
    this.$.noResultsFound.show();
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
    this.$.mapContainer.loadMap(false);
    return true;
  },
  resultsListClick: function(inSender, inEvent) {
    var item = this.$.resultList.results[inEvent.index];
    var jobId = item.job.JobSummary.uuid;
    
    if (this.$.contentPanels.index == this.MAPS_VIEW) {
      this.$.mapContainer.panToJob(jobId);
    } else {
      if (this.$.jobview.getJobId() != jobId) {
        this.$.jobview.setJobId(jobId);
        this.$.jobview.loadJob();
      }
    }
    return true;
  },
  resultsListLongPress: function(inSender, inEvent) {
    var item = this.$.resultList.results[inEvent.index];
    var jobId = item.job.JobSummary.uuid;

    if (this.$.jobview.getJobId() != jobId) {
      this.$.jobview.setJobId(jobId);
      this.$.jobview.loadJob();
    }
    
    if (this.$.contentPanels.index != this.JOB_DETAILS) {
      this.$.contentPanels.setIndex(this.JOB_DETAILS);
    }

    return true;
  },
  switchToMapView: function(inSender, inEvent) {
    this.$.contentPanels.setIndex(this.MAPS_VIEW);
    this.$.mapContainer.triggerResize();
    return true;
  },
  openJobItem: function(inSender, inEvent) {
    this.$.jobview.setJobId(inEvent.uuid);
    this.$.jobview.loadJob();
    this.$.contentPanels.setIndex(this.JOB_DETAILS);
    return true;
  },
  createJob: function(inSender, inEvent) {
    this.$.pageContentPanels.setIndex(this.MYACCOUNT_VIEW);
    this.$.myAccountContainer.createJob();
  }
});