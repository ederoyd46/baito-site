enyo.kind({
  name: "App",
  classes: "enyo-fit",
  layoutKind: "FittableRowsLayout",
  components: [
    {kind: "onyx.MoreToolbar", layoutKind: "FittableColumnsLayout", components: [
      {kind: "onyx.Button", content: "Go", ontap: "search"},
      {kind: "onyx.InputDecorator", components: [
        {kind: "onyx.Input", name: "searchInput", classes: "search-input", placeholder: "search for jobs in..."}
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
    {layoutKind: "FittableColumnsLayout", components: [
      {name: "resultList", kind: "List", touch: true, onSetupItem: "setupItem", components: [
        {classes: "search-result-entry", ontap: "openJobItem", components: [
          {name: "distance", tag: "span"},
          {name: "jobTitle", tag: "span"}
        ]}
      ]},
      {name: "mapContainer", style: "background: black;", components: [
        {name: "mapview", tag: "div"}
      ]},
      {name: "detailContainer", style: "background: yellow;", components: [
        {name: "detailView", tag: "div"}
      ]}
    ]}
    // {name: "mapContainer", classes: "enyo-fit", style: "background: black;", components: [
    //   {name: "mapview", tag: "div", classes: "enyo-fit"}
    // ]},
    // {name: "detailContainer", classes: "enyo-fit", style: "background: yellow;", components: [
    //   {name: "detailView", tag: "div", classes: "enyo-fit"}
    // ]}
  ],
});