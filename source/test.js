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

