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
    this.createComponent({name: "loginContainer", kind: "LoginContainer", floating: true, centered: true, onLoginComplete: "loginComplete", onHide: "destroyLogin", scrim: true, scrimWhenModal: false});
    this.$.loginContainer.show();
    return true;
  },
  destroyLogin: function(inSender, inEvent) {
    this.$.loginContainer.destroy();
    return true;
  },
  loginComplete: function(inSender, inEvent) {
    this.refreshMenuItems();
    this.$.loginContainer.hide();
    return true;
  },
  logout: function(inSender, inEvent) {
    var req = new enyo.Ajax({url: "/api/user/logout", method: "GET", sync: true});
    req.response(enyo.bind(this, "processLogout"));
    req.go();
    return true;
  },
  processLogout: function(inRequest, inResponse) {
    this.refreshMenuItems();
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
  components: [
      {name: "loginErrors", classes: "errors"},
      {kind: "onyx.InputDecorator", classes: "login-inputs", components: [
        {name: "username", kind: "onyx.Input", placeholder: "Enter your username", onkeypress: "inputChange"}
      ]},
      {kind: "onyx.InputDecorator", classes: "login-inputs", components: [
        {name: "password", kind: "onyx.Input", placeholder: "Enter your password", onkeypress: "inputChange"}
      ]},
      {tag:"br"},
      {classes: "login-button", components: [
        {name: "login", kind: "onyx.Button", content: "Login", ontap: "login"}
      ]}
  ],
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
  components: [
    {name: "registerErrors", classes: "errors"},
    {kind: "onyx.InputDecorator", classes: "register-input-decorator", components: [
      {name: "registerUsername", kind: "onyx.Input", placeholder: "Username", classes: "register-input", onkeypress: "inputChange"}
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
    {name: "registerDateOfBirth", kind: "germboy.DateScroller", onDateSelected: "dateSelected", minYear: 1900, rangeYears: 114, yearValue: 2012},
    {kind: "onyx.Button", content: "Register", classes: "register-button", ontap: "register"}
  ],
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
    var dob = this.$.registerDateOfBirth.getValue()
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
    this.doRegisterComplete();
  }
});