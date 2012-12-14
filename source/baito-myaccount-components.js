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
          {name: "registerItem", content: "Register", ontap: "register"},
          {name: "myaccountItem", content: "My Account"},
          {name: "dividerItem", classes: "onyx-menu-divider"},
          {name: "logoutItem", content: "Logout", ontap: "logout"},
      ]},
    ]},
    {name: "loginContainer", kind: "LoginContainer", floating: true, centered: true, onLoginComplete: "loginComplete", scrim: true, scrimWhenModal: false}
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
      this.$.dividerItem.show();
      this.$.logoutItem.show();
      this.$.welcomeItem.setContent(inResponse.UserResponse.user.name)
      this.$.welcomeItem.show();
    } else {
      this.$.loginItem.show();
      this.$.registerItem.show();
      this.$.myaccountItem.hide();
      this.$.dividerItem.hide();
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
  }
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
  classes: "enyo-fit",
  layoutKind: "FittableRowsLayout",
  components: [
    {kind: "onyx.Groupbox", components: [
      {kind: "onyx.GroupboxHeader", content: "Register"},
      {kind: "onyx.InputDecorator", components: [
        {name: "registerUsername", kind: "onyx.Input", placeholder: "Enter a username"}
      ]},
      {kind: "onyx.InputDecorator", components: [
        {name: "registerPassword", kind: "onyx.Input", placeholder: "Enter a password"}
      ]},
      {kind: "onyx.InputDecorator", components: [
        {name: "registerName", kind: "onyx.Input", placeholder: "Enter your name"}
      ]},
      {kind: "onyx.InputDecorator", components: [
        {name: "registerEmail", kind: "onyx.Input", placeholder: "Enter your email"}
      ]},
      {kind: "onyx.InputDecorator", components: [
        {name: "registerTelephone", kind: "onyx.Input", placeholder: "Enter your phone number"}
      ]},
      {name: "registerDateOfBirth", kind: "onyx.DatePicker", locale: "en_gb", maxYear: 2012},
      {kind: "onyx.Button", content: "Register", ontap: "register"}
    ]},
    {name: "infoPopup", kind: "onyx.Popup", floating: true, centered: true, style: "padding: 10px", onHide: "popupHidden", scrim: true, scrimWhenModal: false, components: [
      {name: "infoPopupContent", content: "..."},
      {name: "infoPopupContentButton", kind: "onyx.Button", content: "OK", classes: "info-popup-content-button", ontap: ""}
    ]}
    
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
    if (!inResponse.UserResponse) {
      console.log("Incorrect response");
      console.log(inResponse);
      return;
    }
    
    if (!inResponse.UserResponse.success) {
      console.log("Validation errors");
      console.log(inResponse);
      
      var validationErrors = inResponse.UserResponse.errors;
      validationErrors.forEach(function(e) {
        console.log(e);
      });
      return;
    }

    var username = inResponse.UserResponse.user.username;
    this.$.infoPopupContent.setContent("User <b>" + username + "</b> Registered Successfully");
    this.$.infoPopup.show();
  }
});