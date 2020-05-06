var objectAssign = require("react/lib/Object.assign")
var EventEmitter = require("events").EventEmitter
var configConstants = require("../constants/configConstants")
var appConstants = require("../constants/appConstants")
var CommonActions = require("../actions/CommonActions")
var serverMessages = require("../serverMessages/server_messages")
var ws, self

var utils = objectAssign({}, EventEmitter.prototype, {
  enableKeyboard: function() {
    virtualKeyBoard_login = $("#username, #password").keyboard({
      layout: "custom",
      customLayout: {
        default: [
          "! @ # $ % ^ & * + _",
          "1 2 3 4 5 6 7 8 9 0 {b}",
          "q w e r t y u i o p",
          "a s d f g h j k l",
          "{shift} z x c v b n m . {shift}",
          "{space}",
          "{a} {c}"
        ],
        shift: [
          "( ) { } [ ] = ~ ` -",
          "< > | ? / \" : ; , ' {b}",
          "Q W E R T Y U I O P",
          "A S D F G H J K L",
          "{shift} Z X C V B N M . {shift}",
          "{space}",
          "{a} {c}"
        ]
      },
      css: {
        container:
          "ui-widget-content ui-widget ui-corner-all ui-helper-clearfix custom-keypad"
      },
      reposition: true,
      alwaysOpen: false,
      initialFocus: true,
      visible: function(e, keypressed, el) {
        el.value = ""
        //$(".authNotify").css("display","none");
      },

      accepted: function(e, keypressed, el) {
        var usernameValue = document.getElementById("username").value
        var passwordValue = document.getElementById("password").value
        if (
          usernameValue != null &&
          usernameValue != "" &&
          passwordValue != null &&
          passwordValue != ""
        ) {
          $("#loginBtn").prop("disabled", false)
        } else {
          $("#loginBtn").prop("disabled", true)
        }
      }
    })
  },
  

  connectToWebSocket: function(data) {
    var stationId = data;
    //sessionStorage.setItem("stationId", stationId);
    console.log("=======> utils.js -> connectToWebSocket()");
    
    var url = configConstants.WEBSOCKET_IP + "/wms-process/extraction-app-ws?ppsStn=" + stationId
    console.log(url);
    self = this
    ws = new WebSocket(url);
    if ("WebSocket" in window) {
      ws.onopen = function() {
        $("#username, #password").prop("disabled", false)
        console.log("=====================> websocket connected established...OPENED")
        
        utils.checkSessionStorage()
        clearTimeout(utils.connectToWebSocket)
      }
      ws.onmessage = function(evt) {
        console.log("=====================> onMessage");
        if (
          evt.data == "CLIENTCODE_409" ||
          evt.data == "CLIENTCODE_412" ||
          evt.data == "CLIENTCODE_401" ||
          evt.data == "CLIENTCODE_400" ||
          evt.data == "CLIENTCODE_503" ||
          evt.data == "CLIENTCODE_403"){
              var msgCode = evt.data;

              CommonActions.showErrorMessage(serverMessages[msgCode])
              sessionStorage.setItem("sessionData", null);

              CommonActions.loginSeat(false)
              utils.enableKeyboard()
          }
        else {
          var received_msg = evt.data
          var data
          try {
            data = JSON.parse(evt.data)
            if (data.hasOwnProperty("data")) {
              if (data.data == "disconnect") {
                utils.sessionLogout()
                return false
              }
            }
            readStateData(data)
            CommonActions.setCurrentSeat(data)
            //CommonActions.setCurrentSeat(data.state_data)
          } catch (err) {
            //intentionally left blank
          }

          CommonActions.setServerMessages()
        }
      }
      ws.onclose = function(event) {
        //serverMessages.CLIENTCODE_003;
        /* alert(JSON.stringify(evt));
                 if(evt == "CLIENTCODE_409" || evt == "CLIENTCODE_503"){
                     var msgCode = evt;
                     console.log(serverMessages[msgCode]);
                     CommonActions.showErrorMessage(serverMessages[msgCode]);
                     CommonActions.logoutSession(true);
                 }*/
        //$("#username, #password").prop('disabled', true);
        console.log("Connection is closed...");
        var stationId = sessionStorage.getItem("stationId");
        
        
       // setTimeout(utils.connectToWebSocket(stationId), 2000);// try reconnecting post 2 seconds
      }
      ws.onerror = function (event){
        CommonActions.showErrorMessage(serverMessages[event.type]);
        $("#loginBtn").hide();
      }
    } else {
      alert("WebSocket NOT supported by your Browser!")
    }
  },

  getCurrentLang: function() {
    var localeStr = window.sessionStorage.getItem("localeData"),
      localeObj = localeStr ? JSON.parse(localeStr) : {},
      localeLang = localeObj && localeObj.data ? localeObj.data.locale : null
    return localeLang
  },

  get3dotTrailedText: function(){},
  displayData: function() {},


  checkSessionStorage: function() {
    var sessionData = JSON.parse(sessionStorage.getItem("sessionData"))
    if (sessionData === null) {
    } else {
      var webSocketData = {
        data_type: "auth",
        data: {
          "auth-token": sessionData.data["auth-token"],
          stationId: sessionData.data.stationId,
          userName: sessionData.data.userName
        }
      }
      utils.sendLoginConfirmation(webSocketData);
    }
  },
  
  storeSession: function(data) {
    console.log(" ===>  utils.js ===> storeSession ()");
    // Put the object into storage
    sessionStorage.setItem("sessionData", JSON.stringify(data))
  },

  sendLoginConfirmation: function(data){
    console.log("=== >%c login Confirmation ()", "color:red")
    var stationId = data.data.stationId;
    var username= data.data.userName;
    console.log("station Id is " + data.data.stationId);
    console.log("username is " + data.data.userName);

    $.ajax({
      type: "POST",
      url:  configConstants.PLATFORM_IP + "/api-gateway/process-service/wms-process/extraction-app/login?ppsStn="+stationId,
      data: JSON.stringify({
        userName: username
      }),
     // dataType: "json",
      headers: {
        "content-type": "application/json",
        accept: "application/json"
      }
    })
    .done(function(response) {
      setTimeout(CommonActions.operatorSeat, 0, true)
    })
    .fail(function(data, jqXHR, textStatus, errorThrown) {
      CommonActions.showErrorMessage(data)
    })
  },

  

  postDataToWebsockets: function(data) {
    console.log(JSON.stringify(data))
    ws.send(JSON.stringify(data))
    setTimeout(CommonActions.operatorSeat, 0, true)
  },

  getAuthToken: function(data) {
    sessionStorage.setItem("sessionData", null)
      var loginData = {
        username: data.data.username,
        password: data.data.password,
        grant_type: "password",
        role: ["ROLE_PICK"],
        action: "LOGIN",
        context: {
          entity_id: "1",
          app_name: "boi_ui"
        }
      }
      $.ajax({
        type: "POST",
        url: configConstants.INTERFACE_IP + "/api/auth/token",
        data: JSON.stringify(loginData),
        dataType: "json",
        headers: {
          "content-type": "application/json",
          accept: "application/json"
        }
      })
      .done(function(response) {
        var webSocketData = {
          data_type: "auth",
          data: {
            "auth-token": response.auth_token,
            userName: data.data.username,
            stationId: data.data.seat_name  //"1"
          }
        }
        utils.storeSession(webSocketData)
        //utils.postDataToWebsockets(webSocketData)
        utils.sendLoginConfirmation(webSocketData);
      })
      .fail(function(data, jqXHR, textStatus, errorThrown) {
        CommonActions.showErrorMessage(data.responseJSON.error)
      })
  },

  sendLogoutConfirmation: function(){
    
    $.ajax({
      type: "GET",
      url:
        configConstants.INTERFACE_IP +
        appConstants.API +
        appConstants.AUTH +
        appConstants.LOGOUT,
      dataType: "json",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        "Authentication-Token": JSON.parse(
          sessionStorage.getItem("sessionData")
        )["data"]["auth-token"]
      }
    })
      .done(function(response) {
        sessionStorage.setItem("sessionData", null)
        location.reload()
      })
      .fail(function(data, jqXHR, textStatus, errorThrown) {
        alert("Logout Failed")
      })
  },

  sessionLogout: function(data) {
    /* sending LOGOUT confirmation to Backend first */
    var sessionData = JSON.parse(sessionStorage.getItem("sessionData"));
    var stationId = sessionData.data.stationId;
    var userName = sessionData.data.userName;

    $.ajax({
      type: "POST",
      url: configConstants.PLATFORM_IP + "/api-gateway/process-service/wms-process/extraction-app/logout?ppsStn="+stationId,
      data: JSON.stringify({
        userName: userName
      }),
      headers: {
        "content-type": "application/json",
        accept: "application/json"
      }
    })
    .done(function(response) {
      utils.sendLogoutConfirmation(stationId, userName);
      sessionStorage.setItem("sessionData", null)
      location.reload()
      setTimeout(CommonActions.operatorSeat, 0, true)
    })
    .fail(function(data, jqXHR, textStatus, errorThrown) {
      CommonActions.showErrorMessage(data)
    })
  },

  postDataToTower: function(data) {
    var retrieved_token = sessionStorage.getItem("sessionData")
    var authentication_token = JSON.parse(retrieved_token)["data"]["auth-token"]
    $.ajax({
      type: "POST",
      url: configConstants.INTERFACE_IP + "/tower/api/v1/mle/pps-call",
      data: JSON.stringify(data),
      dataType: "json",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        "Authentication-Token": authentication_token
      }
    })
      .done(function(response) {
        alert("Your call ticket was submitted successfully")
        CommonActions.hideSpinner()
      })
      .fail(function(jqXhr) {
        console.log(jqXhr)
        alert("There was a problem in submitting your call ticket.")
        CommonActions.hideSpinner()
      })
  },

  postDataToInterface: function(data, stationId) {
    console.log(" %c utils.js ===> postDataToInterface()", "color:red");
    console.log("====================> station id" + stationId);
    var retrieved_token = sessionStorage.getItem("sessionData")
    var authentication_token = JSON.parse(retrieved_token)["data"]["auth-token"]
    if(!stationId){
      stationId = sessionStorage.getItem("stationId");
    }
    $.ajax({
      type: "POST",
      url:  configConstants.PLATFORM_IP + "/api-gateway/process-service/wms-process/extraction-app/ui-event?ppsStn=" + stationId,
      data: JSON.stringify(data),
      dataType: "json",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        "Authentication-Token": authentication_token
      }
    })
      .done(function(response) {
        CommonActions.hideSpinner()
      })
      .fail(function(jqXhr) {
        console.log(jqXhr)
        CommonActions.hideSpinner()
        if (jqXhr.status == 401 || jqXhr.status == 403) {
          var msgCode =
            jqXhr.status == 401 ? "CLIENTCODE_401" : "CLIENTCODE_403"
          CommonActions.showErrorMessage(serverMessages[msgCode])
          sessionStorage.setItem("sessionData", null)
          CommonActions.loginSeat(false)
          utils.enableKeyboard()
        }
      })
  },

  generateSessionId: function(data) {
    var text = ""
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    for (var i = 0; i < 50; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    localStorage.setItem("session", text)
    //localStorage.setItem("stationId", data.data.seat_name)
  },

  getPeripheralData: function(type, seat_name, status, method) {
    console.log("===== > utils.js ===> getPeripheralData()");
    var retrieved_token = sessionStorage.getItem("sessionData")
    var authentication_token = JSON.parse(retrieved_token)["data"]["auth-token"]
    $.ajax({
      type: "GET",
      url:
        configConstants.INTERFACE_IP +
        appConstants.API +
        appConstants.PPS_SEATS +
        seat_name +
        "/" +
        appConstants.PERIPHERALS +
        "?type=" +
        type,
      dataType: "json",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        "Authentication-Token": authentication_token
      }
    })
      .done(function(response) {
        CommonActions.updateSeatData(response.data, type, status, method)
      })
      .fail(function(jqXhr) {})
  },
  ///itemsearch
  getOrphanItemData: function(data, seat_name) {
    var dataToSent = "?" + "barcode=" + data + "&" + "ppsId=" + seat_name
    var retrieved_token = sessionStorage.getItem("sessionData")
    var authentication_token = JSON.parse(retrieved_token)["data"]["auth-token"]
    $.ajax({
      type: "GET",
      url:
        configConstants.INTERFACE_IP +
        appConstants.API +
        appConstants.API_GATEWAY +
        appConstants.SR_SERVICE +
        appConstants.PLATFORM_SRMS +
        appConstants.SERVICE_REQUEST +
        appConstants.SEARCH_ITEM +
        dataToSent,
      dataType: "json",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        "Authentication-Token": authentication_token
      }
    })
      .done(function(response) {
        CommonActions.updateSeatData(response.data, "orphanSearch")
      })
      .fail(function(jqXhr) {
        CommonActions.updateSeatData([], "orphanSearch")
      })
  },
  getBOIConfig: function() {
    $.ajax({
      type: "GET",
      url: configConstants.BOI_CONFIG
    })
      .done(function(response) {
        CommonActions.updateSeatData(response, "BOI_CONFIG")
      })
      .fail(function(jqXhr) {
        CommonActions.updateSeatData(null, "BOI_CONFIG")
      })
  },
  updatePeripherals: function(data, method, seat_name) {
    console.log("===== > utils.js ===> updatePeripherals()");
    var retrieved_token = sessionStorage.getItem("sessionData")
    var authentication_token = JSON.parse(retrieved_token)["data"]["auth-token"]
    var url
    var method = method
    if (method == "POST") {
      url =
        configConstants.INTERFACE_IP +
        appConstants.API +
        appConstants.PPS_SEATS +
        seat_name +
        "/" +
        appConstants.PERIPHERALS +
        appConstants.ADD
    } else {
      url =
        configConstants.INTERFACE_IP +
        appConstants.API +
        appConstants.PPS_SEATS +
        appConstants.PERIPHERALS +
        "/" +
        data.peripheral_type +
        "/" +
        encodeURIComponent(data.peripheral_id) /*.replace(/\//g, "%2F")*/
    }
    $.ajax({
      type: method,
      url: url,
      data: JSON.stringify(data),
      dataType: "json",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        "Authentication-Token": authentication_token
      }
      /*complete:function(xhr,textStatus) {
                if(xhr.status == 409)
                    utils.getPeripheralData(data.peripheral_type, seat_name , '409', method)

            //utils.getPeripheralData(data.peripheral_type, seat_name , 'success', method)
           // CommonActions.updateSeatData(response.data, data.peripheral_type); 
       }*/
    })
      .done(function(response, statusText, xhr) {
        utils.getPeripheralData(
          data.peripheral_type,
          seat_name,
          "success",
          method
        )
        // CommonActions.updateSeatData(response.data, data.peripheral_type);
      })
      .fail(function(jqXhr) {
        if (jqXhr.status == 409)
          utils.getPeripheralData(
            data.peripheral_type,
            seat_name,
            "409",
            method
          )
        else if (jqXhr.status == 400)
          utils.getPeripheralData(
            data.peripheral_type,
            seat_name,
            "400",
            method
          )
        else
          utils.getPeripheralData(
            data.peripheral_type,
            seat_name,
            "fail",
            method
          )
      })
  },
  createLogData: function(message, type) {
    var data = {}
    data["message"] = message
    data["type"] = type
    data["session"] = localStorage.getItem("session")
    return data
  },

  frntStringTransform: function(messgCode, stringArg, arg) {
    var message_args = []
    if (stringArg.length < 1 || arg === appConstants.INVOICE_REQUIRED) {
      message_args = stringArg ? stringArg : []
    } else {
      message_args = stringArg ? ["STN", 20] : [] // 20 is max length...fixed from backend
    }
    message_args.unshift(
      serverMessages[messgCode] ? serverMessages[messgCode] : ""
    )
    return _.apply(null, message_args)
  },
  logError: function(data) {
    $.ajax({
      type: "POST",
      url: "http://192.168.3.93:300/api/log",
      data: data,
      dataType: "json"
    }).success(function(response) {
      console.log("Error logged Successfully")
      console.log("Log Details :")
      console.log(JSON.stringify(data))
    })
  }
})

var readStateData = function(data) {
  console.log("=======> UTitls.js -> readStateData()");
  console.log(data)
  CommonActions.setPickFrontData(data)
  //CommonActions.setPickFrontData(data.state_data);
}

module.exports = utils
