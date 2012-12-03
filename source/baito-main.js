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
        {name: "mapContainer", tag: "div", components: [
          {name: "mapview", tag: "div", classes: "map-view"}
        ]},
        {name: "jobContainer", tag: "div", components: [
          {name: "job", kind: "JobDetails"}
        ]}
      ]}
    ]},
  ],
  search: function(inSender, inEvent) {
    console.log("searching");
    var searchText = this.$.searchInput.getValue().replace(/^\s+|\s+$/g, '');
    if (searchText !== "") {
      var req = new enyo.Ajax({url: "http://baito-dev.co.uk/api/search"});
      req.response(enyo.bind(this, "processSearchResults"));
      req.go({searchTerm: searchText,limit: 25});
    } else {
      this.$.searchInput.setValue(searchText);
    }
  },
  processSearchResults: function(inRequest, inResponse) {
    this.results = inResponse.SearchResultsResponse.results;
    this.$.resultList.setCount(this.results.length);
    this.$.resultList.reset();
    this.centerMap(inResponse);
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
    var req = new enyo.Ajax({url: "http://baito-dev.co.uk/api/job/view"});
    req.response(enyo.bind(this, "processViewJob"));
    req.go({jobid: jobId});
    
    // if (this.$.contentPanels.getActive().name == "mapContainer") {
    //   this.$.contentPanels.setIndex(1);
    // } else {
    //   this.$.contentPanels.setIndex(0);
    // }
  },
  processViewJob: function(inRequest, inResponse) {
    console.log(inResponse);
    this.$.contentPanels.setIndex(1);
    
  },
  centerMap: function(data) {
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
           console.log(this.map);
      }
    } else {
      this.map.panTo(mapLatLng);
    }

    var currentMap = this.map;
     var bounds = new google.maps.LatLngBounds();
     if (response.count > 0) {
       var results = response.results;
       var infowindow = new google.maps.InfoWindow();
     
      results.forEach(function(r) {
         var summary = r.job.JobSummary;
         var fromUrl = "http://baito-dev.co.uk";
         var linkString = "<a href='/viewjob.html?jobid=" + summary.uuid + "&fromUrl=" + fromUrl + "'>" + summary.title + "</a>";
         var point = new google.maps.LatLng(summary.location.latitude, summary.location.longitude)
         var marker = new google.maps.Marker({
           position: point,
           title: summary.title,
           visible: true,
           map: currentMap
         });
     
         bounds.extend(point);
         google.maps.event.addListener(marker, 'click', function() {
           infowindow.content = linkString;
           infowindow.open(currentMap, marker);
         });
       });
       this.map.fitBounds(bounds);
     }
  }
});