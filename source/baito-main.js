enyo.kind({
  name: "App",
  kind: "Panels", 
  classes: "enyo-fit", 
  arrangerKind: "CollapsingArranger",
  components: [
    {layoutKind: "FittableRowsLayout", components: [
      {kind: "onyx.Toolbar", components: [
        {content: "Search for Jobs"},
        {kind: "onyx.Button", content: "Go", ontap: "search"},
        {kind: "onyx.InputDecorator", components: [
          {kind: "onyx.Input", name: "searchInput"}
        ]}
      ]},
      {name: "resultList", kind: "List", fit: true, touch: true, onSetupItem: "setupItem", components: [
        {style: "padding: 10px;", ontap: "openJobItem", components: [
          {name: "distance", tag: "span"},
          {name: "jobTitle", tag: "span"}
        ]}
      ]},
    ]},
    {name: "mapContainer", fit: true, classes: "enyo-fit", style: "background: black;", components: [
      {name: "mapview", tag: "div", classes: "enyo-fit"}
    ]}
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
    console.log(item);
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