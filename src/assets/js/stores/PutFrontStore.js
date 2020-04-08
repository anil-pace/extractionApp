var AppDispatcher = require('../dispatchers/AppDispatcher');
var AppConstants = require('../constants/appConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var ActionTypes = AppConstants;
var CHANGE_EVENT = 'change';
var navConfig = require('../config/navConfig');
var utils = require('../utils/utils');

var _PutFrontData, _NavData, _NotificationData;


var PutFrontStore = assign({}, EventEmitter.prototype, {

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    getNavData: function() {
        if (_PutFrontData.screen_id === AppConstants.PUT_FRONT_WAITING_FOR_RACK) {
            _NavData = navConfig.putFront[0];
            _NavData[0].type = 'active';
        } else {
            _NavData = navConfig.putFront[1];
            _NavData.map(function(data, index) { 
                if (_PutFrontData.screen_id === data.screen_id) {console.log(_PutFrontData);
                    _NavData[index].type = 'active';
                }else{
                     _NavData[index].type = 'passive';
                }
            });
        }
        return _NavData;
    },
    getServerNavData : function(){ 
        if(_PutFrontData.header_msge_list.length > 0){
            _serverNavData = _PutFrontData.header_msge_list[0];
            return _serverNavData;
        }
        else{
            return null;   
        } 
    },
    getNotificationData: function() {
        return _PutFrontData.notification_list[0];
    },
    setPutFrontData: function(data) {
        _PutFrontData = data;
    },

    getStateData: function() {
        return _PutFrontData;
    },

    getScreenId: function() {
        return _PutFrontData.screen_id;
    },

    getBinData: function() {
        var binData = {};
        binData["structure"] = _PutFrontData.structure;
        binData["ppsbin_list"] = _PutFrontData.ppsbin_list;
        return binData;
    },

    scanDetails: function() {
        console.log(_PutFrontData);
        _scanDetails = _PutFrontData.scan_details;
        return _scanDetails;
    },
    productDetails: function() {
        console.log(_PutFrontData);
        _prodDetails = _PutFrontData.product_info;
        return _prodDetails;
    },

    getRackDetails: function() {
        return _PutFrontData.rack_details;
    },

    getCurrentSelectedBin:function(){
       var binData = {};
        binData["structure"] = [1,1];
        binData["ppsbin_list"] = [];
        _PutFrontData.ppsbin_list.map(function(value,index){
          if(value.selected_state == true)
              binData["ppsbin_list"].push(value);
        })
        return binData;
    },
    getItemUid : function(){
        return _PutFrontData.item_uid;
    }

});

PutFrontStore.dispatchToken = AppDispatcher.register(function(action) {
    switch (action.action.actionType) {
        case ActionTypes.SET_PUT_FRONT_DATA:
            PutFrontStore.setPutFrontData(action.action.data);
            PutFrontStore.emitChange();
            break;
        default:
           return true;
    }
});

module.exports = PutFrontStore;
