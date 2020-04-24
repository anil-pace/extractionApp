var AppDispatcher = require('../dispatchers/AppDispatcher');
var configConstants = require('../constants/configConstants');
var appConstants = require('../constants/appConstants');
var objectAssign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;
var utils  = require('../utils/utils.js');


var CHANGE_EVENT = 'change';
var flag = false;
var currentSeat = [];
var currentLang = '';
var _errMsg = null;

function getParameterByName(){
    console.log("=====> loginStore.js => getParameterByName ()" );
    var l = document.createElement("a");
    l.href = window.location.href;
    var url_exist = window.location.href.split('=');
    if(url_exist[1] == undefined){
      listPpsSeat(null);
    }else{
      currentSeat.push(url_exist[1]);
      loginstore.emit(CHANGE_EVENT);
    }
}
var retrieved_token = sessionStorage.getItem('store_data');
if(retrieved_token != null){
  var xhrConfig = function(xhr) {
          var authentication_token = JSON.parse(retrieved_token)["auth_token"];
          xhr.setRequestHeader("Authentication-Token", authentication_token)
  }
}

function getCurrentLang(){
  var localeStr = window.sessionStorage.getItem("localeData"),
  localeObj =  (localeStr) ? JSON.parse(localeStr) : {},
  localeLang = (localeObj && localeObj.data) ? localeObj.data.locale : null;
  return localeLang
}


function listPpsSeat(seat){
  console.log("=====> %c  get list of station ids", "color:red" );
    if(seat === null){
      currentSeat.length = 0; 
      $.ajax({
        type: 'GET',
        url:  configConstants.PLATFORM_IP + "/api-gateway/extraction-service/wms-extraction/extraction-app/pps-extraction-stns",
        dataType : "json",
        beforeSend : xhrConfig 
        }).done(function(response) {
          currentSeat = response;
          loginstore.emit(CHANGE_EVENT); 
        }).fail(function(jqXhr) {
        }).success(function(data){
          console.log("list of station ids successful====>");
        });
    }else{
      loginstore.emit(CHANGE_EVENT); 
    }
}

var showBox = function(index){
  flag = true;
}

var loginstore = objectAssign({}, EventEmitter.prototype, {
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function(cb){
    this.on(CHANGE_EVENT, cb);
  },
  removeChangeListener: function(cb){
    this.removeListener(CHANGE_EVENT, cb);
  },
  getFlag : function(){ 
    return flag;
  },
  setFlag:function(val){
    flag = val;
  },
  stationList : function(){ 
    return currentSeat;
  },
  getLang : function(){            //get language
    return currentLang;
  },
  getAuthToken : function(data){
    utils.getAuthToken(data);
  },
  sessionLogout: function(data){
    utils.sessionLogout(data);
  },
  getErrorMessage: function(){    
   return _errMsg; 
  },
  showErrorMessage : function(data){
    _errMsg = data;
  },
  getCurrentLang : function(){
    return getCurrentLang();
  }
});


AppDispatcher.register(function(payload){
  var action = payload.action;
  switch(action.actionType){

    case appConstants.LIST_SEATS:
      getParameterByName();
      break;
    case appConstants.SET_LANGUAGE:             // Register callback for SET_LANGUAGE action
      checkLang();
      break;
    case appConstants.LOGIN:
      loginstore.getAuthToken(action.data);
      loginstore.emit(CHANGE_EVENT);
      break;
    case appConstants.LOGOUT_SESSION:
      loginstore.sessionLogout(action.data);
      loginstore.emit(CHANGE_EVENT);
      break;
    case appConstants.OPERATOR_SEAT: 
      showBox(action.data);
      loginstore.emit(CHANGE_EVENT);
      break;
    case appConstants.LOGIN_SEAT: 
      loginstore.setFlag(action.data);
      loginstore.emit(CHANGE_EVENT);
      break;
    case appConstants.SHOW_ERROR_MESSAGE:
      loginstore.showErrorMessage(action.data);
      loginstore.emitChange(); 
      break; 
    default:
      return true;
  }
});

module.exports = loginstore;