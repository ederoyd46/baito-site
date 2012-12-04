enyo.kind({
  name: "JobDetails",
  kind: "Control",
  published: {
      jobId: "",
  },
  events: {
    onJobLoaded: "",
    onJobDoesNotExist: "",
    onJobResponseError: ""
  },
  components: [
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
    ]}
  ],
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
    console.log(inResponse);
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
    this.doJobLoaded();
  }
});




enyo.kind({
  name: "MapView",
  kind: "Control",
  map: null,
  markerCreated: [],
  published: {
      mapData: "",
  },
  // events: {
  //   // onJobLoaded: "",
  //   // onJobDoesNotExist: "",
  //   // onJobResponseError: ""
  // },
  components: [
    {name: "mapview", tag: "div", classes: "map-view"}
  ],
  create: function() {
    this.inherited(arguments);
  },
  destroy: function() {
    this.inherited(arguments);
  },  
  centerMap: function() {
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
      this.map.panTo(mapLatLng);
    }
    var bounds = new google.maps.LatLngBounds();
      
    var results = response.results;
    var map = this.map;
    var markerCreated = this.markerCreated;
    var infowindow = new google.maps.InfoWindow({content: "", size: new google.maps.Size(50,50)});
    results.forEach(function(r) {
      var summary = r.job.JobSummary;
      var point = new google.maps.LatLng(summary.location.latitude, summary.location.longitude);
      bounds.extend(point);
      if (markerCreated.indexOf(summary.uuid) == -1) {
        var marker = new google.maps.Marker({
          position: point,
          title: summary.title,
          visible: true,
          map: map
        });
          
        markerCreated.push(summary.uuid);
        google.maps.event.addListener(marker, 'click', function(event) {
          map.panTo(event.latLng);
          map.setZoom(20);
          infowindow.content = summary.title;
          infowindow.open(map, marker);
        });
      }
    });
    this.map.fitBounds(bounds);
  }
});