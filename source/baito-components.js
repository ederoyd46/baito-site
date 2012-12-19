enyo.kind({
  name: "JobDetails",
  kind: "Control",
  published: {
      jobId: "",
  },
  events: {
    onJobLoaded: "",
    onJobDoesNotExist: "",
    onJobResponseError: "",
    onBack: ""
  },
  components: [
    {name: "jobContainer", kind: "Scroller", touch: true, classes: "job-container", components: [
      {kind: "onyx.Groupbox", components: [
        {kind: "onyx.GroupboxHeader", content: "Title"},
        {name: "title", style: "padding: 8px;"}
      ]},
      {kind: "onyx.Groupbox", components: [
        {kind: "onyx.GroupboxHeader", content: "Description"},
        {name: "description", style: "padding: 8px;", classes: "wrap"}
      ]},
      {kind: "onyx.Groupbox", components: [
        {kind: "onyx.GroupboxHeader", content: "Wage (per hour)"},
        {name: "wage", style: "padding: 8px;"}
      ]},
      {kind: "onyx.Groupbox", components: [
        {kind: "onyx.GroupboxHeader", content: "Hours (per week)"},
        {name: "hours", style: "padding: 8px;"}
      ]},
      {kind: "onyx.Groupbox", components: [
        {kind: "onyx.GroupboxHeader", content: "Company"},
        {name: "company", style: "padding: 8px;"}
      ]},
      {kind: "onyx.Groupbox", components: [
        {kind: "onyx.GroupboxHeader", content: "Contact Name"},
        {name: "contactName", style: "padding: 8px;"}
      ]},
      {kind: "onyx.Groupbox", components: [
        {kind: "onyx.GroupboxHeader", content: "Contact Email"},
        {name: "contactEmail", style: "padding: 8px;"}
      ]},
      {kind: "onyx.Groupbox", components: [
        {kind: "onyx.GroupboxHeader", content: "Contact Telephone"},
        {name: "contactTelephone", style: "padding: 8px;"}
      ]},
      {kind: "onyx.Groupbox", components: [
        {kind: "onyx.GroupboxHeader", content: "Address"},
        {name: "address", style: "padding: 8px;", classes: "wrap"}
      ]},
      {kind: "onyx.Groupbox", components: [
        {kind: "onyx.GroupboxHeader", content: "Post Code"},
        {name: "postCode", style: "padding: 8px;"}
      ]},
      {style: "height: 60px"} //Spacer
    ]},
    {kind: "onyx.MoreToolbar", layoutKind: "FittableColumnsLayout", classes: "job-toolbar", components: [
      {kind: "onyx.Button", content: "Back", ontap:"backButtonTap"},
      {kind: "FavouriteButton", name: "favourite"},
      {kind: "ApplyButton", name: "apply"},
    ]},
  ],
  backButtonTap: function(inSender, inEvent) {
    this.doBack();
  },
  create: function() {
    this.inherited(arguments);
  },
  destroy: function() {
    this.inherited(arguments);
  },
  loadJob: function() {
    var req = new enyo.Ajax({url: "/api/job/view"});
    req.response(enyo.bind(this, "processLoadedJob"));
    req.go({jobid: this.jobId});
  },
  processLoadedJob: function(inRequest, inResponse) {
    this.$.jobContainer.scrollToTop();
    if (!inResponse.JobResponse) {
      console.log("Wrong object in response");
      this.doJobResponseError();
      return;
    }
    
    if (!inResponse.JobResponse.success) {
      console.log("Job does not exist");
      this.doJobDoesNotExist();
      return;
    }
    
    var job = inResponse.JobResponse.job.Job;
    this.$.title.setContent(job.title);
    this.$.description.setContent(job.description);
    this.$.wage.setContent(job.wage);
    this.$.hours.setContent(job.hours);
    this.$.company.setContent(job.company);
    this.$.contactName.setContent(job.contactName);
    this.$.contactEmail.setContent(job.contactEmail);
    this.$.contactTelephone.setContent(job.contactTelephone);
    this.$.address.setContent(job.address);
    this.$.postCode.setContent(job.postalCode);
    this.$.favourite.setJobId(job.uuid);
    this.$.favourite.refreshContent();
    this.$.apply.setJobId(job.uuid);
    this.$.apply.refreshContent();
    this.doJobLoaded();
  }
});


enyo.kind({
  name: "FavouriteButton",
  kind: "onyx.Button",
  content: "",
  published: {
    jobId: undefined,
  },
  handlers: {
    ontap: "toggleFavourite",
  },
  components: [
    {kind: "Signals", onAuthenticationChange: "refreshContent"}
  ],
  toggleFavourite: function(inSender, inEvent) {
    var req;
    if (this.getContent() == "Favourite") {
      req = new enyo.Ajax({url: "/api/user/favourite"});
    } else {
      req = new enyo.Ajax({url: "/api/user/unfavourite"});
    }
    
    req.response(enyo.bind(this, "processToggleFavourite"));
    req.go({jobid: this.jobId});
    return true;
  },
  processToggleFavourite: function(inRequest, inResponse) {
    this.refreshContent();
  },
  create: function() {
    this.inherited(arguments);
    this.refreshContent();
  },
  destroy: function() {
    this.inherited(arguments);
  },
  refreshContent: function() {
    if (!this.jobId) {
      this.hide();
      return;
    }
    var req = new enyo.Ajax({url: "/api/user/view/favourites"});
    req.response(enyo.bind(this, "processRefreshContent"));
    req.go();
  },
  processRefreshContent: function(inRequest,inResponse) {
    if (inResponse.JobsResponse.success) {
      this.show();
      for (i=0; i<inResponse.JobsResponse.jobs.length; i++) {
        var job = inResponse.JobsResponse.jobs[i];
        if (job.JobSummary.uuid == this.jobId) {
          this.setContent("Unfavourite");
          return;
        }
      }
      this.setContent("Favourite");
    } else {
      this.hide();
    }
  }
});


enyo.kind({
  name: "ApplyButton",
  kind: "onyx.Button",
  content: "Apply",
  published: {
    jobId: undefined,
  },
  handlers: {
    ontap: "applyForJob",
  },
  components: [
    {kind: "Signals", onAuthenticationChange: "refreshContent"}
  ],
  applyForJob: function(inSender, inEvent) {
    // var req;
    // if (this.getContent() == "Favourite") {
    //   req = new enyo.Ajax({url: "/api/user/favourite"});
    // } else {
    //   req = new enyo.Ajax({url: "/api/user/unfavourite"});
    // }
    // 
    // req.response(enyo.bind(this, "processToggleFavourite"));
    // req.go({jobid: this.jobId});
    return true;
  },
  processApplyForJob: function(inRequest, inResponse) {
    this.refreshContent();
  },
  create: function() {
    this.inherited(arguments);
    this.refreshContent();
  },
  destroy: function() {
    this.inherited(arguments);
  },
  refreshContent: function() {
    if (!this.jobId) {
      this.hide();
      return;
    }
    var req = new enyo.Ajax({url: "/api/user/view/applications"});
    req.response(enyo.bind(this, "processRefreshContent"));
    req.go();
  },
  processRefreshContent: function(inRequest,inResponse) {
    if (inResponse.JobApplicationsResponse.success) {
      this.show();
      for (i=0; i<inResponse.JobApplicationsResponse.jobApplications.length; i++) {
        var job = inResponse.JobApplicationsResponse.jobApplications[i];
        if (job.ViewJobApplication.jobId == this.jobId) {
          this.setDisabled(true);
          return;
        }
      }
      this.setDisabled(false);
    } else {
      this.hide();
    }
  }
});

enyo.kind({
  name: "AppyContainer",
  kind: "onyx.Popup",
  classes: "register-container",
  events: {
    onRegisterComplete: ""
  },
  components: [
    {name: "registerErrors", classes: "errors"},
    {kind: "onyx.InputDecorator", classes: "register-input-decorator", components: [
      {name: "registerUsername", kind: "onyx.Input", placeholder: "Username", classes: "register-input", onkeypress: "inputChange"}
    ]},
    {kind: "onyx.InputDecorator", classes: "register-input-decorator", components: [
      {name: "registerPassword", kind: "onyx.Input", placeholder: "Password", type: "password", classes: "register-input", onkeypress: "inputChange"}
    ]},
    {kind: "onyx.InputDecorator", classes: "register-input-decorator", components: [
      {name: "registerName", kind: "onyx.Input", placeholder: "Name", classes: "register-input", onkeypress: "inputChange"}
    ]},
    {kind: "onyx.InputDecorator", classes: "register-input-decorator", components: [
      {name: "registerEmail", kind: "onyx.Input", placeholder: "Email", type: "email", classes: "register-input", onkeypress: "inputChange"}
    ]},
    {kind: "onyx.InputDecorator", classes: "register-input-decorator", components: [
      {name: "registerTelephone", kind: "onyx.Input", placeholder: "Phone Number", classes: "register-input", onkeypress: "inputChange"}
    ]},
    {name: "registerDateOfBirth", kind: "germboy.DateScroller", minYear: 1900, rangeYears: 114},
    {kind: "onyx.Button", content: "Register", classes: "register-button", ontap: "register"}
  ],
  create: function() {
    this.inherited(arguments);
  },
  ignoreHideEvent: function(inSender, inEvent) {
    return true;
  },
  destroy: function() {
    this.inherited(arguments);
  },
  padDate: function(value) {
    if (value < 10) {
      return "0" + value
    } else {
      return value;
    }
  },
  inputChange: function(inSender, inEvent) {
    if (inEvent.keyCode == 13) {
      this.register(inSender, inEvent);
    }
  },
  register: function(inSender, inEvent) {
    this.$.registerErrors.destroyComponents();
    var dob = this.$.registerDateOfBirth.getDateObj();
    var dobStr = dob.getFullYear() + "-" + this.padDate((dob.getMonth()+1)) + "-" + this.padDate(dob.getDate());
    var userReqObj = "";
    if (this.$.registerUsername.getValue().length > 0) {
      userReqObj += "username=" + this.$.registerUsername.getValue();
    }
    if (this.$.registerPassword.getValue().length > 0 ) {
      userReqObj += "&password=" + Crypto.SHA256(this.$.registerPassword.getValue());
    }
    if (this.$.registerName.getValue().length > 0 ) {
      userReqObj += "&name=" + this.$.registerName.getValue();
    }
    if (this.$.registerEmail.getValue().length > 0 ) {
      userReqObj += "&email=" + this.$.registerEmail.getValue();
    }
    if (this.$.registerTelephone.getValue().length > 0 ) {
      userReqObj += "&phone=" + this.$.registerTelephone.getValue();
    }
    
    userReqObj += "&birthDate=" + dobStr;
                 
    var req = new enyo.Ajax({url: "/api/user/create", method: "POST", postBody: userReqObj, sync: true});
    req.response(enyo.bind(this, "processRegisterUser"));
    req.go();
  },
  processRegisterUser: function(inRequest, inResponse) {
    if (!inResponse.UserResponse.success) {
      var errorContainer = this.$.registerErrors.createComponent({tag: "ul"});
      errorContainer.render();
      var validationErrors = inResponse.UserResponse.errors;
      validationErrors.forEach(function(e) {
        errorContainer.createComponent({content: e.message, tag: "li", classes: "error"}).render();
      });
      return;
    }
    enyo.Signals.send("onAuthenticationChange");
    this.doRegisterComplete();
  }
});




enyo.kind({
  name: "SearchList",
  kind: "List",
  events: {
    onJobClicked: "",
    onJobLongPress: "",
    onSearchCompleted: "",
    onAdditionSearchCompleted: "",
  },
  published: {
    lastSearchResponse: "",
    results: [],
  },
  handlers: {
    onScroll: "scrolling",
    onSetupItem: "setupItem",    
  },
  searchText: "",
  searchInProgress: false,
  endOfResults: false,
  components: [
    {kind: "onyx.Item", tapHighlight: true, classes: "search-result-entry", ontap: "itemClicked", onhold: "itemLongPress", components: [
      {name: "jobTitle", tag: "span"}
    ]}
  ],
  create: function() {
    this.inherited(arguments);
  },
  destroy: function() {
    this.inherited(arguments);
  },
  search: function(rawSearchText) {
    this.resetSearch();
    this.searchInProgress = true;
    var searchText = rawSearchText.replace(/^\s+|\s+$/g, '');
    if (searchText !== "") {
      this.searchText = searchText;
      var req = new enyo.Ajax({url: "/api/search"});
      req.response(enyo.bind(this, "processSearchResults"));
      req.go({searchTerm: searchText,limit: 50});
    } else {
      this.searchInProgress = false;
    }
  },
  processSearchResults: function(inRequest, inResponse) {
    this.lastSearchResponse = inResponse;
    this.results = inResponse.SearchResultsResponse.results;
    this.setCount(this.results.length);
    this.reset();
    this.searchInProgress = false;
    this.doSearchCompleted();
  },
  additionSearch: function(searchText) {
    if (this.searchInProgress || this.endOfResults) {
      return;
    }
    
    this.searchInProgress = true;
    var req = new enyo.Ajax({url: "/api/search"});
    req.response(enyo.bind(this, "processAdditionSearchResults"));
    req.go({searchTerm: searchText,limit: 50, skip: this.results.length});
  },
  processAdditionSearchResults: function(inRequest, inResponse) {
    this.lastSearchResponse = inResponse;
    var resultCount = inResponse.SearchResultsResponse.results.length;
    if (resultCount == 0) {
      this.endOfResults = true;
      return;
    }
    
    this.results.push.apply(this.results,inResponse.SearchResultsResponse.results);
    this.setCount(this.results.length);
    this.refresh();
    this.searchInProgress = false;
    this.doAdditionSearchCompleted();
  },
  scrolling: function(inSender, inEvent) {
    var boundary = inEvent.originator.bottomBoundary;
    if (boundary && boundary != 0) {
      var y = inEvent.originator.y;
      var percentage = (Math.round(y) / Math.round(boundary))*100;
      if (percentage > 90) {
        this.additionSearch(this.searchText);
      }
    }
  },
  setupItem: function(inSender, inEvent) {
    var i = inEvent.index;
    var item = this.results[i];
    var entry = item.job.JobSummary.title + " (" + item.distance + " miles away)";
    this.$.jobTitle.setContent(entry);
  },
  itemClicked: function(inSender, inEvent) {
    var i = inEvent.index;
    this.doJobClicked({index: i});
  },
  itemLongPress: function(inSender, inEvent) {
    var i = inEvent.index;
    this.doJobLongPress({index: i});
  },  
  resetSearch: function() {
    this.searchInProgress = false;
    this.results = [];
    this.endOfResults = false;
    this.searchResults = "";
  }
});

enyo.kind({
  name: "MapView",
  kind: "Control",
  map: null,
  markerCreated: [],
  events: {
    onJobClicked: "",
  },
  published: {
      mapData: "",
  },
  components: [
    {name: "mapview", tag: "div", classes: "map-view"}
  ],
  create: function() {
    this.inherited(arguments);
  },
  destroy: function() {
    this.inherited(arguments);
  },  
  loadMap: function(moveMap) {
    var data = this.mapData;

    if (!data.SearchResultsResponse) {
      console.log("Not expected response");
      return;
    }

    var response = data.SearchResultsResponse;
    var mapLatLng = new google.maps.LatLng(response.searchLocation.latitude, response.searchLocation.longitude);
    if (!this.map) {
      if (this.$.mapview.hasNode()) {
        this.map = new google.maps.Map(this.$.mapview.node, {
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          center: mapLatLng,
          streetViewControl: true
        });
      }
    } else {
      if (moveMap) {
        this.map.panTo(mapLatLng);
      }
    }
    var bounds = new google.maps.LatLngBounds();
      
    var results = response.results;
    var map = this.map;
    var markerCreated = this.markerCreated;
    window.infowindow = !window.infowindow ? new google.maps.InfoWindow({content: "", size: new google.maps.Size(50,50)}) : infowindow;
    window.mapObject = this;
    results.forEach(function(r) {
      var summary = r.job.JobSummary;
      var point = new google.maps.LatLng(summary.location.latitude, summary.location.longitude);
      bounds.extend(point);
      if (!window.mapObject.isMarkerCreated(summary.uuid)) {
        var marker = new google.maps.Marker({
          position: point,
          title: summary.title,
          visible: true,
          map: map
        });
        
        markerCreated.push({uuid: summary.uuid, marker: marker});
        google.maps.event.addListener(marker, 'click', function(event) {
          var contentStr = summary.title 
                           + "<br><br>"
                           + "<table border='1'><th>hours</th><th>wage</th>"
                           + "<tr><td>" + summary.hours + "</td><td>£" + summary.wage + "</td></tr>"
                           + "</table><br>"
                           + "<a href=\"#\" onclick=\"window.mapObject.doJobClicked({uuid: '" + summary.uuid + "'});\">more</a>";
          window.infowindow.content = contentStr;
          window.infowindow.open(map, marker);
        });
      }
    });
    if (moveMap) {
      this.map.fitBounds(bounds);
    }
  },
  isMarkerCreated: function(uuid) {
    for (i=0;i<this.markerCreated.length; i++) {
      if(this.markerCreated[i].uuid == uuid) {
        return true;
      };
    }
    return false;
  },
  panToJob: function(uuid) {
    for (i=0;i<this.markerCreated.length; i++) {
      if(this.markerCreated[i].uuid == uuid) {
        google.maps.event.trigger(this.markerCreated[i].marker, 'click');
        return;
      };
    }
  }
});