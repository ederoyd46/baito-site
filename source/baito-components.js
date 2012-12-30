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
      {kind: "onyx.Button", content: "Back", onclick:"backButtonClick"},
      {kind: "FavouriteButton", name: "favourite"},
      {kind: "ApplyButton", name: "apply"},
      {kind: "onyx.Button", name: "edit", content: "Edit"},
    ]},
  ],
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
  loadJob: function() {
    if (this.jobId && this.loadedJobId && this.jobId == this.loadedJobId) {
      return;
    }
    this.$.edit.hide();
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
    this.$.apply.setJobTitle(job.title);
    this.$.apply.refreshContent();
    this.loadedJobId = this.jobId;
    this.doJobLoaded();
  },
  loadEditButton: function() {
    console.log("here");
    var req = new enyo.Ajax({url: "/api/user/view/created", method: "GET", sync: true});
    req.response(enyo.bind(this, "processLoadEditButton"));
    req.go();
  },
  processLoadEditButton: function(inRequest, inResponse) {
    if (!inResponse.JobsResponse.success) {
      enyo.Signals.send("onAuthenticationChange");
      return;
    }
    var results = inResponse.JobsResponse.jobs;
    var currentJob = this.jobId;
    var editButton = this.$.edit;
    results.forEach(function(job) {
      if (job.JobSummary.uuid == currentJob) {
        editButton.show();
      } else {
        editButton.hide();
      }
    });
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