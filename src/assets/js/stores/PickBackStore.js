
var AppDispatcher = require('../dispatchers/AppDispatcher');
var AppConstants = require('../constants/appConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var ActionTypes = AppConstants;
var CHANGE_EVENT = 'change';
var navConfig = require('../config/navConfig');
var utils = require('../utils/utils');
var resourceConstants = require('../constants/resourceConstants');

var _PickBackData, _NavData, _NotificationData , modalContent, _serverNavData;


var PickBackStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

 
  getNavData : function () {
    _NavData = navConfig.pickBack;
    navConfig.pickBack.map(function(data,index){
       if(_PickBackData.screen_id === data.screen_id ){
          _NavData[index].type = 'active'; 
          _NavData[index].showImage = true; 
        }else{
          _NavData[index].type = 'passive';
          _NavData[index].showImage = false; 
        }
    });
    return _NavData;
  },


  getServerNavData : function(){
    if(_PickBackData.header_msge_list.length > 0){
      _serverNavData = _PickBackData.header_msge_list[0];
      return _serverNavData;
    }else{
      return null;
    }
  },


  getNotificationData : function() { 
      return _PickBackData.notification_list[0];
  },


  setPickBackData:function(data){
    _PickBackData = data;
  },

  getStateData:function(){
    return _PickBackData;
  },

  getBinData:function(){
    var binData = {};
    binData["structure"] = _PickBackData.structure;
    binData["ppsbin_list"] = _PickBackData.ppsbin_list;
    return binData;
  },

  getScreenId:function(){
    return _PickBackData.screen_id;
  },
  getToteDetails: function(){
    if(_PickBackData.hasOwnProperty('tote_details')){
      return _PickBackData.tote_details
    }else{
      return null;
    }
  }


  
});

PickBackStore.dispatchToken = AppDispatcher.register(function(action) {
  switch(action.action.actionType) {

     case ActionTypes.SET_PICK_BACK_DATA:
      PickBackStore.setPickBackData(action.action.data);
      PickBackStore.emitChange();
      break;
    
    default:
      // do nothing
  }

});

module.exports = PickBackStore;
