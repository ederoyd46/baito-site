enyo.kind({
  name: "MyAccountContainer",
  kind: "FittableColumns",
  FAVOURITES_OPTION: 0,
  FAVOURITES_VIEW: 1,
  APPLICATIONS_OPTION: 1,
  APPLICATIONS_VIEW: 2,
  CREATED_OPTION: 2,
  CREATED_VIEW: 3,
  MYDETAILS_OPTION: 3,
  MYDETAILS_VIEW: 4,
  JOB_DETAILS_VIEW: 4,
  JOB_APPLICANTS_VIEW: 5,
  components: [
      {name: "myAccountOptionList", touch: true, onSetupItem: "setupItem", classes: "search-result-list", kind: "List", components: [
        {kind: "onyx.Item", tapHighlight: true, classes: "search-result-entry", ontap: "itemClicked", components: [
          {name: "myAccountOptionTitle", tag: "span"}
        ]}
      ]},
      {kind: "Panels", name: "myAccountPanels", classes: "my-account-panels", draggable:false, components: [
        {content: "My Account"},
        {name: "favouritesList", kind: "FavouritesList", touch: true, onFavouriteClicked: "openFavouriteJobItem"},
        {name: "applicationsList", kind: "UserApplicationsList", touch: true},
        {name: "createdList", kind: "CreatedList", touch: true, onCreatedClicked: "openCreatedJobItem"},
        {name: "jobDetails", kind: "JobDetails"},
      ]},
  ],
  create: function() {
    this.inherited(arguments);
    this.refreshMenuItems();
  },
  destroy: function() {
    this.inherited(arguments);
  },
  menuOptions: [{name: "Favourite Jobs"}, {name: "Applications"}, {name: "Created Jobs"}, {name: "My Details"}],
  refreshMenuItems: function() {
    this.$.myAccountOptionList.setCount(this.menuOptions.length);
  },
  setupItem: function(inSender, inEvent) {
    var item = this.menuOptions[inEvent.index];
    var entry = item.name;
    this.$.myAccountOptionTitle.setContent(entry);
  },
  itemClicked: function(inSender, inEvent) {
    if (this.FAVOURITES_OPTION == inEvent.index) {
      this.openFavouritesList();
    }

    if (this.APPLICATIONS_OPTION == inEvent.index) {
      this.openApplicationsList();
    }

    if (this.CREATED_OPTION == inEvent.index) {
      this.openCreatedList();
    }
    return true;
  },
  openFavouritesList: function() {
    this.$.favouritesList.refreshItems();
    this.$.myAccountPanels.setIndex(this.FAVOURITES_VIEW);
  },
  openFavouriteJobItem: function(inSender, inEvent) {
    var item = this.$.favouritesList.results[inEvent.index];
    var jobId = item.JobSummary.uuid;

    this.$.jobDetails.setJobId(jobId);
    this.$.jobDetails.loadJob();
    this.$.jobDetails.onBack = "openFavouritesList";
    this.$.myAccountPanels.setIndex(this.JOB_DETAILS_VIEW);
  },
  openApplicationsList: function() {
    this.$.applicationsList.refreshItems();
    this.$.myAccountPanels.setIndex(this.APPLICATIONS_VIEW);
  },
  openCreatedList: function() {
    this.$.createdList.refreshItems();
    this.$.myAccountPanels.setIndex(this.CREATED_VIEW);
  },
  openCreatedJobItem: function(inSender, inEvent) {
    var item = this.$.createdList.results[inEvent.index];
    var jobId = item.JobSummary.uuid;

    this.$.jobDetails.setJobId(jobId);
    this.$.jobDetails.loadJob();
    this.$.jobDetails.onBack = "openCreatedList";
    this.$.myAccountPanels.setIndex(this.JOB_DETAILS_VIEW);
  },
  createJob: function() {
    this.$.jobDetails.onBack = "openCreatedList";
    this.$.jobDetails.newJob();
    this.$.myAccountPanels.setIndex(this.JOB_DETAILS_VIEW);
  }
});

enyo.kind({
  name: "FavouritesList",
  kind: "List",
  classes: "favourites-result-list",
  events: {
    onFavouriteClicked: "",
  },
  results: [],
  components: [
    {kind: "onyx.Item", tapHighlight: true, classes: "search-result-entry", ontap: "itemClicked", components: [
      {name: "myFavouriteTitle", tag: "span"}
    ]}
  ],
  handlers: {
    onSetupItem: "setupItem", 
  },
  create: function() {
    this.inherited(arguments);
  },
  destroy: function() {
    this.inherited(arguments);
  },
  refreshItems: function() {
    var req = new enyo.Ajax({url: "/api/user/view/favourites", method: "GET", sync: true});
    req.response(enyo.bind(this, "processRefreshItems"));
    req.go();
  },
  processRefreshItems: function(inRequest, inResponse) {
    if (!inResponse.JobsResponse.success) {
      enyo.Signals.send("onAuthenticationChange");
      return;
    }
    this.results = inResponse.JobsResponse.jobs;
    this.setCount(this.results.length);
    this.reset();
  },
  itemClicked: function(inSender, inEvent) {
    this.bubble("onFavouriteClicked", inEvent, inSender);
  },
  setupItem: function(inSender, inEvent) {
    var item = this.results[inEvent.index];
    var entry = item.JobSummary.title;
    this.$.myFavouriteTitle.setContent(entry);
  },
});

enyo.kind({
  name: "UserApplicationsList",
  kind: "List",
  classes: "applications-result-list",
  results: [],
  components: [
    {kind: "onyx.Item", tapHighlight: true, classes: "search-result-entry", ontap: "itemClicked", components: [
      {name: "myApplicationTitle", tag: "span"}
    ]}
  ],
  handlers: {
    onSetupItem: "setupItem", 
  },
  create: function() {
    this.inherited(arguments);
  },
  destroy: function() {
    this.inherited(arguments);
  },
  refreshItems: function() {
    var req = new enyo.Ajax({url: "/api/user/view/applications", method: "GET", sync: true});
    req.response(enyo.bind(this, "processRefreshItems"));
    req.go();
  },
  processRefreshItems: function(inRequest, inResponse) {
    if (!inResponse.JobApplicationsResponse.success) {
      enyo.Signals.send("onAuthenticationChange");
      return;
    }
    this.results = inResponse.JobApplicationsResponse.jobApplications;
    this.setCount(this.results.length);
    this.reset();
  },
  setupItem: function(inSender, inEvent) {
    var item = this.results[inEvent.index];
    var entry = item.ViewJobApplication.jobTitle;
    this.$.myApplicationTitle.setContent(entry);
  },
});

enyo.kind({
  name: "CreatedList",
  kind: "List",
  classes: "created-result-list",
  events: {
    onCreatedClicked: ""
  },
  results: [],
  components: [
    {kind: "onyx.Item", tapHighlight: true, classes: "search-result-entry", ontap: "itemClicked", components: [
      {name: "myCreatedTitle", tag: "span"},
      // {name: "myCreatedApplicants", kind: "onyx.Button", onclick: "loadApplicants"}
    ]}
  ],
  handlers: {
    onSetupItem: "setupItem", 
  },
  create: function() {
    this.inherited(arguments);
  },
  destroy: function() {
    this.inherited(arguments);
  },
  refreshItems: function() {
    var req = new enyo.Ajax({url: "/api/user/view/created", method: "GET", sync: true});
    req.response(enyo.bind(this, "processRefreshItems"));
    req.go();
  },
  processRefreshItems: function(inRequest, inResponse) {
    if (!inResponse.JobsResponse.success) {
      enyo.Signals.send("onAuthenticationChange");
      return;
    }
    this.results = inResponse.JobsResponse.jobs;
    this.setCount(this.results.length);
    this.reset();
  },
  itemClicked: function(inSender, inEvent) {
    this.bubble("onCreatedClicked", inEvent, inSender);
  },
  setupItem: function(inSender, inEvent) {
    var item = this.results[inEvent.index];
    var entry = item.JobSummary.title;
    this.$.myCreatedTitle.setContent(entry);
  },
  loadApplicants: function(inSender, inEvent) {
    console.log("here");
  }
});

enyo.kind({
  name: "ActionMenu",
  kind: "Control",
  events: {
    onMenuActionPerformed: "",
    onMyAccount: "",
    onLogout: "",
    onCreateJob: ""
  },
  components: [
    {name: "welcomeItem", content: "", classes: "welcome-item"},
    {kind: "onyx.MenuDecorator", classes: "action-menu", components: [
      {name: "menuActions", content: "Actions"},
      {kind: "onyx.Menu", components: [
          {name: "loginItem", content: "Login", ontap: "login"},
          {name: "myaccountItem", content: "My Account", ontap: "myAccountClick"},
          {name: "createJobItem", content: "Create Job", ontap: "createJobClick"},
          {name: "dividerItem", classes: "onyx-menu-divider"},
          {name: "registerItem", content: "Register", ontap: "register"},
          {name: "logoutItem", content: "Logout", ontap: "logout"},
      ]},
    ]},
    {kind: "Signals", onAuthenticationChange: "refreshMenuItems"}
  ],
  create: function() {
    this.inherited(arguments);
    this.refreshMenuItems();
  },
  destroy: function() {
    this.inherited(arguments);
  },
  myAccountClick: function(inSender, inEvent) {
    this.bubble("onMyAccount");
  },
  createJobClick: function(inSender, inEvent) {
    this.bubble("onCreateJob");
  },
  refreshMenuItems: function() {
    var req = new enyo.Ajax({url: "/api/user/whoami", method: "GET", sync: true});
    req.response(enyo.bind(this, "processRefreshMenuItems"));
    req.go();
  },
  processRefreshMenuItems: function(inRequest, inResponse) {
    if (inResponse.UserResponse.success) {
      this.$.loginItem.hide();
      this.$.registerItem.hide();
      this.$.myaccountItem.show();
      this.$.createJobItem.show();
      this.$.logoutItem.show();
      this.$.welcomeItem.setContent(inResponse.UserResponse.user.name)
      this.$.welcomeItem.show();
    } else {
      this.$.loginItem.show();
      this.$.registerItem.show();
      this.$.myaccountItem.hide();
      this.$.createJobItem.hide();
      this.$.logoutItem.hide();
      this.$.welcomeItem.setContent("")
      this.$.welcomeItem.hide();
    }
    
    this.doMenuActionPerformed();
  },
  login: function(inSender, inEvent) {
    this.createComponent({name: "loginContainer", kind: "LoginContainer", floating: true, centered: true, onLoginComplete: "loginComplete", onHide: "destroyLogin", scrim: true, scrimWhenModal: false});
    this.$.loginContainer.show();
    return true;
  },
  destroyLogin: function(inSender, inEvent) {
    this.$.loginContainer.destroy();
    return true;
  },
  loginComplete: function(inSender, inEvent) {
    this.$.loginContainer.hide();
    return true;
  },
  logout: function(inSender, inEvent) {
    var req = new enyo.Ajax({url: "/api/user/logout", method: "GET", sync: true});
    req.response(enyo.bind(this, "processLogout"));
    req.go();
    this.bubble("onLogout");
    return true;
  },
  processLogout: function(inRequest, inResponse) {
    enyo.Signals.send("onAuthenticationChange");
  },
  register: function(inSender, inEvent) {
    this.createComponent({name: "registerContainer", kind: "RegisterContainer", floating: true, centered: true, onRegisterComplete: "registerComplete", onHide: "destroyRegister", scrim: true, scrimWhenModal: false});
    this.$.registerContainer.show();
    return true;
  },
  destroyRegister: function(inSender, inEvent) {
    this.$.registerContainer.destroy();
    return true;
  },
  registerComplete: function(inSender, inEvent) {
    this.refreshMenuItems();
    this.$.registerContainer.hide();
    return true;
  },
});

enyo.kind({
  name: "LoginContainer",
  classes: "login-container",
  kind: "onyx.Popup",
  events: {
    onLoginComplete: ""
  },
  handlers: {
    onShow: "setFocus"
  },
  components: [
      {name: "loginErrors", classes: "errors"},
      {kind: "onyx.InputDecorator", classes: "login-inputs", components: [
        {name: "username", kind: "onyx.Input", placeholder: "Enter your username", onkeypress: "inputChange", defaultFocus: true}
      ]},
      {kind: "onyx.InputDecorator", classes: "login-inputs", components: [
        {name: "password", kind: "onyx.Input", placeholder: "Enter your password", onkeypress: "inputChange", type: "password"}
      ]},
      {tag:"br"},
      {classes: "login-button", components: [
        {name: "login", kind: "onyx.Button", content: "Login", onclick: "login"}
      ]}
  ],
  setFocus: function(inSender, inEvent) {
    this.$.username.focus();
  },
  inputChange: function(inSender, inEvent) {
    if (inEvent.keyCode == 13) {
      this.login(inSender, inEvent);
    }
  },
  create: function() {
    this.inherited(arguments);
  },
  destroy: function() {
    this.inherited(arguments);
  },
  login: function(inSender,inEvent) {
    this.$.loginErrors.destroyComponents();
    this.$.username.getValue();
    this.$.password.getValue();
    var userObj = "";
    if (this.$.username.getValue().length > 0) {
       userObj += "username=" + this.$.username.getValue();
    }
    if (this.$.password.getValue().length > 0) {
       userObj += "&password=" + Crypto.SHA256(this.$.password.getValue());
    }
    var req = new enyo.Ajax({url: "/api/user/login", method: "POST", postBody: userObj, sync: true});
    req.response(enyo.bind(this, "processLoginUser"));
    req.go();
  },
  processLoginUser: function(inRequest, inResponse) {
    if (!inResponse.UserResponse.success) {
      var errorContainer = this.$.loginErrors.createComponent({tag: "ul"});
      errorContainer.render();
      var validationErrors = inResponse.UserResponse.errors;
      validationErrors.forEach(function(e) {
        errorContainer.createComponent({content: e.message, tag: "li", classes: "error"}).render();
      });
      return true;
    }
    
    enyo.Signals.send("onAuthenticationChange");
    this.doLoginComplete({name: inResponse.UserResponse.user.name});
  }
});


enyo.kind({
  name: "RegisterContainer",
  kind: "onyx.Popup",
  classes: "register-container",
  events: {
    onRegisterComplete: ""
  },
  handlers: {
    onShow: "setFocus"
  },
  components: [
    {name: "registerErrors", classes: "errors"},
    {kind: "onyx.InputDecorator", classes: "register-input-decorator", components: [
      {name: "registerUsername", kind: "onyx.Input", placeholder: "Username", classes: "register-input", onkeypress: "inputChange", defaultFocus: true}
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
    {kind: "onyx.Button", content: "Register", classes: "register-button", onclick: "register"}
  ],
  setFocus: function(inSender, inEvent) {
    this.$.registerUsername.focus();
  },
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
  name: "FavouriteButton",
  kind: "onyx.Button",
  content: "",
  published: {
    jobId: undefined,
  },
  handlers: {
    onclick: "toggleFavourite",
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
    if (inResponse.UserResponse.success) {
      this.refreshContent();
    } else {
      enyo.Signals.send("onAuthenticationChange");
    }
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
          this.setContent("Un-favourite");
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
    jobTitle: undefined,
  },
  handlers: {
    onclick: "applyForJob",
  },
  components: [
    {kind: "Signals", onAuthenticationChange: "refreshContent"}
  ],
  applyForJob: function(inSender, inEvent) {
    if (inSender.kind == 'ApplyButton') {
      this.createComponent({name: "applyContainer", kind: "ApplyContainer", floating: true, centered: true, onHide: "destroyApply", scrim: true, scrimWhenModal: false, onApplyComplete: "applyCompleted"}).render();
      this.$.applyContainer.setJobId(this.jobId);
      this.$.applyContainer.setJobTitle(this.jobTitle);
      this.$.applyContainer.show();
    }
    return true;
  },
  destroyApply: function(inSender, inEvent) {
    this.$.applyContainer.destroyComponents(); //otherwise the reference isn't gc'd for some reason
    this.$.applyContainer.destroy();
    return true;
  },
  applyCompleted: function(inSender, inEvent) {
    this.$.applyContainer.hide();
    this.refreshContent();
    return true;    
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
  name: "ApplyContainer",
  kind: "onyx.Popup",
  classes: "apply-container",
  published: {
    jobId: undefined,
    jobTitle: undefined,
    birthDate: undefined,
  },
  events: {
    onApplyComplete: ""
  },
  components: [
    {name: "applyErrors", classes: "errors"},
    {kind: "onyx.InputDecorator", classes: "register-input-decorator", components: [
      {name: "applyName", kind: "onyx.Input", placeholder: "Name", classes: "apply-input", onkeypress: "inputChange"}
    ]},
    {kind: "onyx.InputDecorator", classes: "register-input-decorator", components: [
      {name: "applyEmail", kind: "onyx.Input", placeholder: "Email", type: "email", classes: "apply-input", onkeypress: "inputChange"}
    ]},
    {kind: "onyx.InputDecorator", classes: "register-input-decorator", components: [
      {name: "applyTelephone", kind: "onyx.Input", placeholder: "Phone Number", classes: "apply-input", onkeypress: "inputChange"}
    ]},
    {kind: "onyx.InputDecorator", classes: "register-input-decorator", components: [
        {name: "applyAdditional", kind: "onyx.TextArea", placeholder: "Tell us about yourself...",  classes: "apply-input", onkeypress: "inputChange"}
    ]},
    {tag: "br"},
    {kind: "onyx.Button", content: "Submit Application", onclick: "apply"}
  ],
  create: function() {
    this.inherited(arguments);
    this.prepopulateUser();
  },
  destroy: function() {
    this.inherited(arguments);
  },
  prepopulateUser: function() {
    var req = new enyo.Ajax({url: "/api/user/whoami", method: "GET"});
    req.response(enyo.bind(this, "processPrepopulateUser"));
    req.go();
  },
  processPrepopulateUser: function(inRequest, inResponse) {
    if (inResponse.UserResponse.success) {
      var user = inResponse.UserResponse.user;
      this.$.applyName.setValue(user.name);
      this.$.applyEmail.setValue(user.email);
      this.$.applyTelephone.setValue(user.phone);
      this.setBirthDate(user.birthDate.match(/[0-9]+-[0-9]+-[0-9]+/));
    } else {
      enyo.Signals.send("onAuthenticationChange");
    }
  },
  inputChange: function(inSender, inEvent) {
    if (inEvent.keyCode == 13) {
      this.apply(inSender, inEvent);
    }
  },
  apply: function(inSender, inEvent) {
    this.$.applyErrors.destroyComponents();
    
    var jaReqObj = "";
    
    if (this.$.applyName.getValue().length > 0 ) {
      jaReqObj += "&name=" + this.$.applyName.getValue();
    }
    if (this.$.applyEmail.getValue().length > 0 ) {
      jaReqObj += "&email=" + this.$.applyEmail.getValue();
    }
    if (this.$.applyTelephone.getValue().length > 0 ) {
      jaReqObj += "&phone=" + this.$.applyTelephone.getValue();
    }
    if (this.$.applyAdditional.getValue().length > 0 ) {
      jaReqObj += "&additional=" + this.$.applyAdditional.getValue();
    }
    
    jaReqObj += "&birthDate=" + this.birthDate;
    jaReqObj += "&jobid=" + this.jobId;
    jaReqObj += "&jobtitle=" + this.jobTitle;
    
    var req = new enyo.Ajax({url: "/api/job/apply", method: "POST", postBody: jaReqObj, sync: true});
    req.response(enyo.bind(this, "processApply"));
    req.go();
  },
  processApply: function(inRequest, inResponse) {
    if (!inResponse.JobApplicationResponse.success) {
      var errorContainer = this.$.applyErrors.createComponent({tag: "ul"});
      errorContainer.render();
      var validationErrors = inResponse.JobApplicationResponse.errors;
      validationErrors.forEach(function(e) {
        errorContainer.createComponent({content: e.message, tag: "li", classes: "error"}).render();
      });
      return;
    }
    this.doApplyComplete();
  }
});
