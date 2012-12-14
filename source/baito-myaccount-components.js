enyo.kind({
  name: "ActionMenu",
  kind: "Control",
  events: {
    onMenuActionPerformed: ""
  },
  components: [
    {name: "welcomeItem", content: "", classes: "welcome-item"},
    {kind: "onyx.MenuDecorator", classes: "action-menu", components: [
      {name: "menuActions", content: "Actions"},
      {kind: "onyx.Menu", components: [
          {name: "loginItem", content: "Login", ontap: "login"},
          {name: "myaccountItem", content: "My Account"},
          {name: "dividerItem", classes: "onyx-menu-divider"},
          {name: "registerItem", content: "Register", ontap: "register"},
          {name: "logoutItem", content: "Logout", ontap: "logout"},
      ]},
    ]},
    {name: "loginContainer", kind: "LoginContainer", floating: true, centered: true, onLoginComplete: "loginComplete", scrim: true, scrimWhenModal: false},
    {name: "registerContainer", kind: "RegisterContainer", floating: true, centered: true, onRegisterComplete: "registerComplete", scrim: true, scrimWhenModal: false}
  ],
  create: function() {
    this.inherited(arguments);
    this.refreshMenuItems();
  },
  destroy: function() {
    this.inherited(arguments);
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
      this.$.logoutItem.show();
      this.$.welcomeItem.setContent(inResponse.UserResponse.user.name)
      this.$.welcomeItem.show();
    } else {
      this.$.loginItem.show();
      this.$.registerItem.show();
      this.$.myaccountItem.hide();
      this.$.logoutItem.hide();
      this.$.welcomeItem.setContent("")
      this.$.welcomeItem.hide();
    }
    
    this.doMenuActionPerformed();
  },
  login: function(inSender, inEvent) {
    this.$.loginContainer.show();
  },
  loginComplete: function(inSender, inEvent) {
    this.refreshMenuItems();
    this.$.loginContainer.hide();
  },
  logout: function(inSender, inEvent) {
    var req = new enyo.Ajax({url: "/api/user/logout", method: "GET", sync: true});
    req.response(enyo.bind(this, "processLogout"));
    req.go();
  },
  processLogout: function(inRequest, inResponse) {
    this.refreshMenuItems();
    console.log(inResponse);
  },
  register: function(inSender, inEvent) {
    this.$.registerContainer.show();
  },
  registerComplete: function(inSender, inEvent) {
    this.refreshMenuItems();
    this.$.registerContainer.hide();
  },
});

enyo.kind({
  name: "LoginContainer",
  classes: "login-container",
  kind: "onyx.Popup",
  events: {
    onLoginComplete: ""
  },
  components: [
      {kind: "onyx.InputDecorator", classes: "login-inputs", components: [
        {name: "username", kind: "onyx.Input", placeholder: "Enter your username"}
      ]},
      {kind: "onyx.InputDecorator", classes: "login-inputs", components: [
        {name: "password", kind: "onyx.Input", placeholder: "Enter your password"}
      ]},
      {tag:"br"},
      {classes: "login-button", components: [
        {name: "login", kind: "onyx.Button", content: "Login", ontap: "login"}
      ]}
  ],
  create: function() {
    this.inherited(arguments);
  },
  destroy: function() {
    this.inherited(arguments);
  },
  login: function(inSender,inEvent) {
    this.$.username.getValue();
    this.$.password.getValue();
    var userObj = "username=" + this.$.username.getValue()
                + "&password=" + Crypto.SHA256(this.$.password.getValue());
    var req = new enyo.Ajax({url: "/api/user/login", method: "POST", postBody: userObj, sync: true});
    req.response(enyo.bind(this, "processLoginUser"));
    req.go();
  },
  processLoginUser: function(inSender, inEvent) {
    if (!inEvent.UserResponse) {
      console.log("Not expected response");
      return;
    }
    
    if (!inEvent.UserResponse.success) {
      var errors = inEvent.UserResponse.errors;
      errors.forEach(function(e) {
        console.log(e);
      });
      
      return;
    }
    this.doLoginComplete({name: inEvent.UserResponse.user.name});
  }
  
});


enyo.kind({
  name: "RegisterContainer",
  kind: "onyx.Popup",
  classes: "register-container",
  events: {
    onRegisterComplete: ""
  },
  components: [
    {kind: "onyx.InputDecorator", classes: "register-input", components: [
      {name: "registerUsername", kind: "onyx.Input", placeholder: "Username"}
    ]},
    {kind: "onyx.InputDecorator", classes: "register-input", components: [
      {name: "registerPassword", kind: "onyx.Input", placeholder: "Password"}
    ]},
    {kind: "onyx.InputDecorator", classes: "register-input", components: [
      {name: "registerName", kind: "onyx.Input", placeholder: "Name"}
    ]},
    {kind: "onyx.InputDecorator", classes: "register-input", components: [
      {name: "registerEmail", kind: "onyx.Input", placeholder: "Email"}
    ]},
    {kind: "onyx.InputDecorator", classes: "register-input", components: [
      {name: "registerTelephone", kind: "onyx.Input", placeholder: "Phone Number"}
    ]},
    {name: "registerDateOfBirth", kind: "onyx.DatePicker", locale: "en_gb", maxYear: 2012},
    {kind: "onyx.Button", content: "Register", classes: "register-button", ontap: "register"}
  ],
  create: function() {
    this.inherited(arguments);
  },
  destroy: function() {
    this.inherited(arguments);
  },  
  register: function(inSender, inEvent) {
    var dob = this.$.registerDateOfBirth.getValue()
    var dobStr = dob.getFullYear() + "-" + (dob.getMonth()+1) + "-" + dob.getDate();
    var userReqObj = "username=" + this.$.registerUsername.getValue()
                   + "&password=" + Crypto.SHA256(this.$.registerPassword.getValue())
                   + "&name=" + this.$.registerName.getValue()
                   + "&email=" + this.$.registerEmail.getValue()
                   + "&phone=" + this.$.registerTelephone.getValue()
                   + "&birthDate=" + dobStr;
                 
    var req = new enyo.Ajax({url: "/api/user/create", method: "POST", postBody: userReqObj, sync: true});
    req.response(enyo.bind(this, "processRegisterUser"));
    req.go();
  },
  processRegisterUser: function(inRequest, inResponse) {
    if (!inResponse.UserResponse.success) {
      console.log("Validation errors");
      console.log(inResponse);
      
      var validationErrors = inResponse.UserResponse.errors;
      validationErrors.forEach(function(e) {
        console.log(e);
      });
      return;
    }
    this.doRegisterComplete();
  }
});