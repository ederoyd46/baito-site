enyo.kind({
  name: "Test",
  classes: "enyo-fit",
  layoutKind: "FittableRowsLayout",
  components: [
    {kind: "germboy.DateScroller", onDateSelected: "dateSelected", minYear: 1900, rangeYears: 114, yearValue: 2013},
  ],
});

