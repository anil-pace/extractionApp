var AppDispatcher = require('../dispatchers/AppDispatcher');
var AppConstants = require('../constants/appConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var ActionTypes = AppConstants;
var CHANGE_EVENT = 'change';
var navConfig = require('../config/navConfig');
var utils = require('../utils/utils');

var _PickFrontData, _NavData, _NotificationData,_serverNavData;


var PickFrontStore = assign({}, EventEmitter.prototype, {

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
        if (_PickFrontData.screen_id === AppConstants.PICK_FRONT_WAITING_FOR_MSU) {
            _NavData = navConfig.pickFront[0];
            _NavData[0].type = 'active';
        }
        
        else {
            _NavData = navConfig.pickFront[1];
            _NavData.map(function(data, index) {
                if(data.screen_id instanceof Array){
                    if( data.screen_id.indexOf(_PickFrontData.screen_id) != -1 ){
                         _NavData[index].type = 'active';
                    }else{
                        _NavData[index].type = 'passive';
                    }
                }
                else if (_PickFrontData.screen_id === data.screen_id) {
                    _NavData[index].type = 'active';
                } else {
                    _NavData[index].type = 'passive';
                }
            });
        }
        return _NavData;
    },
    getNotificationData: function() {
        if (_PickFrontData["notification_list"] != undefined)
            return _PickFrontData.notification_list[0];
        else
            return null;
    },
    setPickFrontData: function(data) {
        _PickFrontData = data;
        console.log("%c  ===> PIckFrontStore.js => setPickFrontData ()", "color:red" + data)
    },

    getStateData: function() {
        return _PickFrontData;
    },

    getScreenId: function() {
        if (_PickFrontData["screen_id"] != undefined)
            return _PickFrontData.screen_id;
        else
            return null;
    },
    getServerNavData : function(){ 
        if(_PickFrontData.header_msge_list.length > 0){
            _serverNavData = _PickFrontData.header_msge_list[0];
            return _serverNavData;
        }
        else{
            return null;   
        } 
    },
    getBinData: function() {
        var binData = {};
        binData["structure"] = _PickFrontData["structure"];
        binData["ppsbin_list"] = _PickFrontData["ppsbin_list"];
        return binData;
    },

    scanDetails: function() {
        console.log(_PickFrontData);
        _scanDetails = _PickFrontData.scan_details;
        return _scanDetails;
    },
    productDetails: function() {
        console.log(_PickFrontData);
        _prodDetails = _PickFrontData.product_info;
        return _prodDetails;
    },

    getRackDetails: function() {
        return _PickFrontData.rack_details;
    },

    getBoxDetails: function() {
        return _PickFrontData.box_serials;
    },

     getChecklistDetails:function(){
        if(_PickFrontData.hasOwnProperty('checklist_details')){ 
            console.log(_PickFrontData.checklist_details.pick_checklist.length + "jindal");
            if(_PickFrontData.checklist_details.pick_checklist.length > 0){
                return _PickFrontData.checklist_details.pick_checklist;
            }
            else{
                return [];
            }     
            
        }else{
            return [];
        }
    },
    getChecklistIndex:function(){
        if(_PickFrontData.hasOwnProperty('checklist_details')){ 
            if(_PickFrontData.checklist_details.checklist_index!= null){
                return _PickFrontData.checklist_details.checklist_index;
            } 
            else{
                return null;
            }    
            
        }else{
            return null;
        }
    },
    getChecklistOverlayStatus:function(){
        if(_PickFrontData.hasOwnProperty('checklist_details')){ 
            return _PickFrontData.checklist_details.display_checklist_overlay;
          }else{
            return null;
        }
    },

    getCurrentSelectedBin: function() {
        if (_PickFrontData["ppsbin_list"] != undefined) {
            var binData = {};
            binData["structure"] = [1, 1];
            binData["ppsbin_list"] = [];
            _PickFrontData.ppsbin_list.map(function(value, index) {
                if (value.selected_state == true){
                    binData["ppsbin_list"].push(value);
                }
            });
            binData["ppsbin_list"]["coordinate"] = [1,1];
            return binData;
        } else
            return null;
    },
    getItemUid : function(){
        return _PickFrontData.item_uid;
    },
    getCurrentSlot : function(){        
        if(_PickFrontData.hasOwnProperty('rack_details')){       
            return _PickFrontData.rack_details.slot_barcodes;
        }else{
            return null;
        }
    }

});

PickFrontStore.dispatchToken = AppDispatcher.register(function(action) {
    switch (action.action.actionType) {
        case ActionTypes.SET_PICK_FRONT_DATA:
        PickFrontStore.setPickFrontData(action.action.data);
        PickFrontStore.emitChange();
            break;
        default:
            return true;
    }
});

module.exports = PickFrontStore;
