enyo.kind({
  name: "JobDetailPanel",
  classes: "enyo-fit",
  layoutKind: "FittableRowsLayout",
  components: [
    {name: "job", kind: "JobDetails", onJobLoaded: "mattTest1"},
  ],
  mattTest1: function(inSender, inEvent) {
    console.log("Event thrown");
    console.log(inSender);
    console.log(inEvent);
    if (this.$.job.getJobId() != "TEST-51753") {
      this.$.job.setJobId("TEST-51753");
      this.$.job.loadJob();
    }
  }
});

enyo.kind({
  name: "JobDetails",
  kind: "Control",
  published: {
      jobId: "TEST-26387",
  },
  events: {
    onJobLoaded: ""
  },
  components: [
    {kind: "onyx.Groupbox", components: [
      {kind: "onyx.GroupboxHeader", content: "Title"},
      {name: "title", style: "padding: 8px;"}
    ]},
    {kind: "onyx.Groupbox", components: [
      {kind: "onyx.GroupboxHeader", content: "Description"},
      {name: "description", style: "padding: 8px;"}
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
      {name: "address", style: "padding: 8px;"}
    ]},
    {kind: "onyx.Groupbox", components: [
      {kind: "onyx.GroupboxHeader", content: "Post Code"},
      {name: "postCode", style: "padding: 8px;"}
    ]}
  ],
  create: function() {
    this.inherited(arguments);
    this.loadJob();
  },
  destroy: function() {
    this.inherited(arguments);
  },
  loadJob: function() {
    var req = new enyo.Ajax({url: "http://baito-dev.co.uk/api/job/view"});
    req.response(enyo.bind(this, "processLoadedJob"));
    req.go({jobid: this.jobId});
    
  },
  processLoadedJob: function(inRequest, inResponse) {
    console.log(inResponse);
    if (!inResponse.JobResponse) {
      console.log("Wrong object in response");
      return;
    }
    
    if (!inResponse.JobResponse.success) {
      console.log("Job does not exist");
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