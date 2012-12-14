enyo.kind({
  name: "LoginContainer",
  classes: "enyo-fit",
  layoutKind: "FittableRowsLayout",
  components: [
    {kind: "onyx.Groupbox", components: [
      {kind: "onyx.GroupboxHeader", content: "Login"},
      {kind: "onyx.InputDecorator", components: [
        {kind: "onyx.Input", placeholder: "Enter a username"}
      ]},
      {kind: "onyx.InputDecorator", components: [
        {kind: "onyx.Input", placeholder: "Enter a password"}
      ]},
      {kind: "onyx.Button", content: "Login"}
    ]},
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
      {name: "infoPopupContent", content: "Popup..."}
    ]}
    
  ],
  register: function(inSender, inEvent) {
    // this.$.dateOfBirthPicker.setLocale("en_gb");
    var dob = this.$.registerDateOfBirth.getValue()
    var dobStr = dob.getFullYear() + "-" + (dob.getMonth()+1) + "-" + dob.getDate();
    var userReqObj = "username=" + this.$.registerUsername.getValue()
                   + "&password=" + Crypto.SHA256(this.$.registerPassword.getValue())
                   + "&name=" + this.$.registerName.getValue()
                   + "&email=" + this.$.registerEmail.getValue()
                   + "&phone=" + this.$.registerTelephone.getValue()
                   + "&birthDate=" + dobStr;
                 
    var req = new enyo.Ajax({url: "http://baito-dev.co.uk/api/user/create", method: "POST", postBody: userReqObj, sync: true});
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

    var username = inResponse.UserResponse.username;

    this.$.infoPopupContent.setContent("User " + username + "Registered Successfully");
    this.$.infoPopup.show();
  }
});

