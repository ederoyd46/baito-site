enyo.kind({
  name: "JobDetails",
  kind: "Control",
  published: {
      jobId: undefined,
  },
  events: {
    onJobLoaded: "",
    onJobDoesNotExist: "",
    onJobResponseError: "",
    onBack: ""
  },
  handlers: {
    onJobLoaded: "loadEditButton",
  },
  loadedJobId: undefined,
  latitude: undefined,
  longitude: undefined,
  components: [
    {name: "jobContainer", kind: "Scroller", touch: true, classes: "job-container", components: [
      {kind: "onyx.Groupbox", components: [
        {kind: "onyx.GroupboxHeader", content: "Title"},
        {name: "title", style: "padding: 8px;"},
        {name: "titleDecorator", kind: "onyx.InputDecorator", classes: "job-inputs", components: [
          {name: "inputTitle", kind: "onyx.Input", placeholder: "Enter Title", classes: "job-input", onkeypress: "inputChange"}
        ]},
      ]},
      {kind: "onyx.Groupbox", components: [
        {kind: "onyx.GroupboxHeader", content: "Description"},
        {name: "description", style: "padding: 8px;", classes: "wrap"},
        {name: "descriptionDecorator", kind: "onyx.InputDecorator", classes: "job-inputs", components: [
          {name: "inputDescription", kind: "onyx.TextArea", placeholder: "Enter Description", classes: "job-input", onkeypress: "inputChange"}
        ]},
      ]},
      {kind: "onyx.Groupbox", components: [
        {kind: "onyx.GroupboxHeader", content: "Wage (per hour)"},
        {name: "wage", style: "padding: 8px;"},
        {name: "wageDecorator", kind: "onyx.InputDecorator", classes: "job-inputs", components: [
          {name: "inputWage", kind: "onyx.Input", placeholder: "Enter Wage", classes: "job-input", onkeypress: "inputChange"}
        ]},
      ]},
      {kind: "onyx.Groupbox", components: [
        {kind: "onyx.GroupboxHeader", content: "Hours (per week)"},
        {name: "hours", style: "padding: 8px;"},
        {name: "hoursDecorator", kind: "onyx.InputDecorator", classes: "job-inputs", components: [
          {name: "inputHours", kind: "onyx.Input", placeholder: "Enter Hours", classes: "job-input", onkeypress: "inputChange"}
        ]},
      ]},
      {kind: "onyx.Groupbox", components: [
        {kind: "onyx.GroupboxHeader", content: "Company"},
        {name: "company", style: "padding: 8px;"},
        {name: "companyDecorator", kind: "onyx.InputDecorator", components: [
          {name: "inputCompany", kind: "onyx.Input", placeholder: "Enter Company", classes: "job-input", onkeypress: "inputChange"}
        ]},
      ]},
      {kind: "onyx.Groupbox", components: [
        {kind: "onyx.GroupboxHeader", content: "Contact Name"},
        {name: "contactName", style: "padding: 8px;"},
        {name: "contactNameDecorator", kind: "onyx.InputDecorator", classes: "job-inputs", components: [
          {name: "inputContactName", kind: "onyx.Input", placeholder: "Enter Contact Name", classes: "job-input", onkeypress: "inputChange"}
        ]},
      ]},
      {kind: "onyx.Groupbox", components: [
        {kind: "onyx.GroupboxHeader", content: "Contact Email"},
        {name: "contactEmail", style: "padding: 8px;"},
        {name: "contactEmailDecorator", kind: "onyx.InputDecorator", classes: "job-inputs", components: [
          {name: "inputContactEmail", kind: "onyx.Input", placeholder: "Enter Contact Email", classes: "job-input", onkeypress: "inputChange"}
        ]},        
      ]},
      {kind: "onyx.Groupbox", components: [
        {kind: "onyx.GroupboxHeader", content: "Contact Telephone"},
        {name: "contactTelephone", style: "padding: 8px;"},
        {name: "contactTelephoneDecorator", kind: "onyx.InputDecorator", classes: "job-inputs", components: [
          {name: "inputContactTelephone", kind: "onyx.Input", placeholder: "Enter Contact Telephone Number", classes: "job-input", onkeypress: "inputChange"}
        ]},        
      ]},
      {kind: "onyx.Groupbox", components: [
        {kind: "onyx.GroupboxHeader", content: "Address"},
        {name: "address", style: "padding: 8px;", classes: "wrap"},
        {name: "addressDecorator", kind: "onyx.InputDecorator", classes: "job-inputs", components: [
          {name: "inputAddress", kind: "onyx.TextArea", placeholder: "Enter Description", classes: "job-input", onkeypress: "inputChange"}
        ]},
      ]},
      {kind: "onyx.Groupbox", components: [
        {kind: "onyx.GroupboxHeader", content: "Post Code"},
        {name: "postCode", style: "padding: 8px;"},
        {name: "postCodeDecorator", kind: "onyx.InputDecorator", classes: "job-inputs", components: [
          {name: "inputPostCode", kind: "onyx.Input", placeholder: "Enter Post Code", classes: "job-input", onkeypress: "inputChange", onblur: "validatePostCode"}
        ]},
      ]},
      {style: "height: 60px"} //Spacer
    ]},
    {kind: "onyx.MoreToolbar", layoutKind: "FittableColumnsLayout", classes: "job-toolbar", components: [
      {kind: "onyx.Button", content: "Back", onclick:"backButtonClick"},
      {kind: "FavouriteButton", name: "favourite"},
      {kind: "ApplyButton", name: "apply"},
      {kind: "onyx.Button", name: "edit", content: "Edit", onclick: "editButtonClick"},
    ]},
    {name: "jobPopup", kind: "onyx.Popup", style: "padding: 10px", floating: true, centered: true, scrim: true, scrimWhenModal: false, components:[
      {name: "jobErrors", classes: "errors"},
    ]},
    {kind: "Signals", onAuthenticationChange: "loadEditButton"},
  ],
  editButtonClick: function(inSender, inEvent) {
    if (this.$.edit.getContent() == "Edit") {
      this.switchToEditMode();
    } else {
      this.saveJob();
      this.switchToViewMode();
    }
  },
  saveJob: function() {
    var jobReqObj = "";
    
    if (this.loadedJobId && this.loadedJobId == this.jobId) {
      jobReqObj += "uuid=" + encodeURIComponent(this.loadedJobId);
    }

    if (this.latitude != undefined) {
      jobReqObj += "&location[latitude]=" + encodeURIComponent(this.latitude);
    }

    if (this.longitude != undefined) {
      jobReqObj += "&location[longitude]=" + encodeURIComponent(this.longitude);
    }
    
    if (this.$.inputTitle.getValue().length > 0) {
      jobReqObj += "&title=" + encodeURIComponent(this.$.inputTitle.getValue());
    }

    if (this.$.inputDescription.getValue().length > 0) {
      jobReqObj += "&description=" + encodeURIComponent(this.$.inputDescription.getValue());
    }

    if (this.$.inputWage.getValue().length > 0) {
      jobReqObj += "&wage=" + encodeURIComponent(this.$.inputWage.getValue());
    }

    if (this.$.inputHours.getValue().length > 0) {
      jobReqObj += "&hours=" + encodeURIComponent(this.$.inputHours.getValue());
    }
    
    if (this.$.inputCompany.getValue().length > 0) {
      jobReqObj += "&company=" + encodeURIComponent(this.$.inputCompany.getValue());
    }

    if (this.$.inputContactName.getValue().length > 0) {
      jobReqObj += "&contactName=" + encodeURIComponent(this.$.inputContactName.getValue());
    }

    if (this.$.inputContactEmail.getValue().length > 0) {
      jobReqObj += "&contactEmail=" + encodeURIComponent(this.$.inputContactEmail.getValue());
    }

    if (this.$.inputContactTelephone.getValue().length > 0) {
      jobReqObj += "&contactTelephone=" + encodeURIComponent(this.$.inputContactTelephone.getValue());
    }

    if (this.$.inputAddress.getValue().length > 0) {
      jobReqObj += "&address=" + encodeURIComponent(this.$.inputAddress.getValue());
    }
    
    if (this.$.inputPostCode.getValue().length > 0) {
      jobReqObj += "&postalCode=" + encodeURIComponent(this.$.inputPostCode.getValue());
    }
    
    jobReqObj += "&published=" + true;
    
    var req = new enyo.Ajax({url: "/api/job/create", method: "POST", postBody: jobReqObj, sync: true});
    req.response(enyo.bind(this, "processSaveJob"));
    req.go();
  },
  processSaveJob: function(inRequest, inResponse) {
    if (!inResponse.JobResponse.success) {
      this.$.jobErrors.destroyComponents();
      var errorContainer = this.$.jobErrors.createComponent({tag: "ul"}).render();
      var validationErrors = inResponse.JobResponse.errors;
      validationErrors.forEach(function(e) {
        errorContainer.createComponent({content: e.message, tag: "li", classes: "error"}).render();
      });
      this.$.jobPopup.show();      
    }
    this.loadJob(true);
  },
  validatePostCode: function(inSender, inEvent) {
    var req = new enyo.Ajax({url: "/api/location/geolocationcode", method: "GET", sync: true});
    req.response(enyo.bind(this, "processValidatePostCode"));
    req.go({searchTerm: this.$.inputPostCode.getValue()});
  },
  processValidatePostCode: function(inRequest, inResponse) {
    if (!inResponse.LocationResponse.success) {
      this.latitude = undefined;
      this.longitude = undefined;
      this.$.jobErrors.destroyComponents();
      var errorContainer = this.$.jobErrors.createComponent({tag: "ul"}).render();
      errorContainer.createComponent({content: inResponse.LocationResponse.message, tag: "li", classes: "error"}).render();
      this.$.jobPopup.show();
      return;
    }
    
    var location = inResponse.LocationResponse.location;
    this.latitude = location.latitude;
    this.longitude = location.longitude;
  },
  backButtonClick: function(inSender, inEvent) {
    this.bubble("onBack");
    return true;
  },
  create: function() {
    this.inherited(arguments);
  },
  destroy: function() {
    this.inherited(arguments);
  },
  loadJob: function(force) {
    if (!force && this.jobId && this.loadedJobId && this.jobId == this.loadedJobId) {
      return;
    }
    this.$.edit.hide();
    this.switchToViewMode();
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
    this.$.inputTitle.setValue(job.title);
    this.$.description.setContent(job.description);
    this.$.inputDescription.setValue(job.description);
    this.$.wage.setContent(job.wage);
    this.$.inputWage.setValue(job.wage);
    this.$.hours.setContent(job.hours);
    this.$.inputHours.setValue(job.hours);
    this.$.company.setContent(job.company);
    this.$.inputCompany.setValue(job.company);
    this.$.contactName.setContent(job.contactName);
    this.$.inputContactName.setValue(job.contactName);
    this.$.contactEmail.setContent(job.contactEmail);
    this.$.inputContactEmail.setValue(job.contactEmail);
    this.$.contactTelephone.setContent(job.contactTelephone);
    this.$.inputContactTelephone.setValue(job.contactTelephone);
    this.$.address.setContent(job.address);
    this.$.inputAddress.setValue(job.address);
    this.$.postCode.setContent(job.postalCode);
    this.$.inputPostCode.setValue(job.postalCode);
    this.$.favourite.setJobId(job.uuid);
    this.$.favourite.refreshContent();
    this.latitude = job.location.latitude;
    this.longitude = job.location.longitude;
    
    this.$.apply.setJobId(job.uuid);
    this.$.apply.setJobTitle(job.title);
    this.$.apply.refreshContent();
    this.loadedJobId = this.jobId;
    this.doJobLoaded();
  },
  switchToEditMode: function() {
    this.$.title.hide();
    this.$.titleDecorator.show();
    this.$.description.hide();
    this.$.descriptionDecorator.show();
    this.$.wage.hide();
    this.$.wageDecorator.show();
    this.$.hours.hide();
    this.$.hoursDecorator.show();
    this.$.company.hide();
    this.$.companyDecorator.show();
    this.$.contactName.hide();
    this.$.contactNameDecorator.show();
    this.$.contactEmail.hide();
    this.$.contactEmailDecorator.show();
    this.$.contactTelephone.hide();
    this.$.contactTelephoneDecorator.show();
    this.$.address.hide();
    this.$.addressDecorator.show();
    this.$.postCode.hide();
    this.$.postCodeDecorator.show();
    this.$.edit.setContent("Save");
  },
  switchToViewMode: function() {
    this.$.title.show();
    this.$.titleDecorator.hide();
    this.$.description.show();
    this.$.descriptionDecorator.hide();
    this.$.wage.show();
    this.$.wageDecorator.hide();
    this.$.hours.show();
    this.$.hoursDecorator.hide();
    this.$.company.show();
    this.$.companyDecorator.hide();
    this.$.contactName.show();
    this.$.contactNameDecorator.hide();
    this.$.contactEmail.show();
    this.$.contactEmailDecorator.hide();
    this.$.contactTelephone.show();
    this.$.contactTelephoneDecorator.hide();
    this.$.address.show();
    this.$.addressDecorator.hide();
    this.$.postCode.show();
    this.$.postCodeDecorator.hide();
    this.$.edit.setContent("Edit");
  },  
  loadEditButton: function() {
    var req = new enyo.Ajax({url: "/api/user/view/created", method: "GET", sync: true});
    req.response(enyo.bind(this, "processLoadEditButton"));
    req.go();
  },
  processLoadEditButton: function(inRequest, inResponse) {
    if (!inResponse.JobsResponse.success) {
      return;
    }
    var results = inResponse.JobsResponse.jobs;
    for (i=0;i<results.length;i++) {
      if (results[i].JobSummary.uuid == this.jobId) {
        this.$.edit.show();
        break;
      } else {
        this.$.edit.hide();
      }
    }
    return true;
  }
});

enyo.kind({
  name: "SearchList",
  kind: "List",
  events: {
    onJobClicked: "",
    onJobLongPress: "",
    onSearchCompleted: "",
    onNoResultsFound: "",
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
    if (!inResponse.SearchResultsResponse.success) {
      this.doNoResultsFound();
      return;
    }
    
    this.results = inResponse.SearchResultsResponse.results;
    
    if (this.results.length == 0) {
      this.doNoResultsFound();
      return;
    }
    
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
    this.bubble("onJobClicked", inEvent, inSender);
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
  handlers: {
    onBack: "fakeOnBack",
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
  fakeOnBack: function(inSender, inEvent) {
    return true;
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
        this.triggerResize();
      }
    } else {
      if (moveMap) {
        google.maps.event.trigger(this.map, 'resize');
        this.triggerResize();
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
      this.triggerResize();
      this.map.fitBounds(bounds);
    }
  },
  triggerResize: function() {
    google.maps.event.trigger(this.map, 'resize');
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