var AppDispatcher = require('../dispatchers/AppDispatcher');
var AppConstants = require('../constants/appConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var ActionTypes = AppConstants;
var CHANGE_EVENT = 'change';
var navConfig = require('../config/navConfig');
var utils = require('../utils/utils');
var resourceConstants = require('../constants/resourceConstants');

var _AuditData, _NavData, _NotificationData, modalContent, _serverNavData, _finishAuditFlag = true;


var AuditStore = assign({}, EventEmitter.prototype, {

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
        if (_AuditData.screen_id === AppConstants.AUDIT_WAITING_FOR_MSU) {
            _NavData = navConfig.audit[0];
            _NavData[0].type = 'active';
        } else {
            _NavData = navConfig.audit[1];
            _NavData.map(function(data, index) {
                if (_AuditData.screen_id === data.screen_id) {
                    console.log(_AuditData);
                    _NavData[index].type = 'active';
                } else {
                    _NavData[index].type = 'passive';
                }
            });
        }
        return _NavData;
    },

    getScanDetails: function() {
        var data = {
            "scan_details": {
                "current_qty": _AuditData.Current_box_details.length > 0 ? _AuditData.Current_box_details[0]["Actual_qty"] : "0",
                "total_qty": "0",
                "kq_allowed": _AuditData["enable_kq"] != undefined ? _AuditData["enable_kq"] : false
            }
        };
        if (_AuditData.scan_details != undefined)
            return _AuditData.scan_details;
        else
            return data.scan_details;
    },

    getServerNavData: function() {
        if (_AuditData.header_msge_list.length > 0) {
            _serverNavData = _AuditData.header_msge_list[0];
            return _serverNavData;
        } else {
            return null;
        }
    },


    tableCol: function(text, status, selected, size, border, grow, bold, disabled, centerAlign, type, buttonType, buttonStatus) {
        this.text = text;
        this.status = status;
        this.selected = selected;
        this.size = size;
        this.border = border;
        this.grow = grow;
        this.bold = bold;
        this.disabled = disabled;
        this.centerAlign = centerAlign;
        this.type = type;
        this.buttonType = buttonType;
        this.buttonStatus = buttonStatus;
    },

    getModalStatus:function(){
        var data = {};
        data["showModal"] = "";
        //data["message"] = "";
        if(_AuditData.Current_box_details.length >0 && _AuditData.Current_box_details[0].Box_serial == null && (_AuditData.Current_box_details[0].Actual_qty > _AuditData.Current_box_details[0].Expected_qty)){
            return {
                "showModal":true,
                "message":"Place extra " + (_AuditData.Current_box_details[0].Actual_qty - _AuditData.Current_box_details[0].Expected_qty) + " items in Exception area ."
            }
        }else
        return data;
    },

    getBoxSerialData: function() {
        var data = {};
        data["header"] = [];
        data["tableRows"] = [];
        var self = this;
        data["header"].push(new this.tableCol("Box Serial Numbers", "header", false, "small", false, true, true, false));
        if (_AuditData["show_expected_qty"] != undefined && _AuditData["show_expected_qty"] == true)
            data["header"].push(new this.tableCol("Expected", "header", false, "small", false, false, true, false, true));
        data["header"].push(new this.tableCol("Actual", "header", false, "small", false, false, true, false, true));
        data["header"].push(new this.tableCol("Finish", "header", false, "small", false, false, true, false, true));
        _finishAuditFlag = true;
        var d = [];
        _AuditData.Box_qty_list.map(function(value, index) {
            d = [];
            if (value.Scan_status != "close") {
                d.push(new self.tableCol(value.Box_serial, "enabled", false, "large", false, true, false, false));
                if (_AuditData["show_expected_qty"] != undefined && _AuditData["show_expected_qty"] == true)
                    d.push(new self.tableCol(value.Expected_qty, "enabled", false, "large", true, false, false, false, true));
                d.push(new self.tableCol(value.Actual_qty, "enabled", value.Scan_status == "open", "large", true, false, false, false, true));
                d.push(new self.tableCol("0", "enabled", false, "large", true, false, false, false, true, "button", "finish", value.Scan_status == "open"));
                data["tableRows"].push(d);
            } else {
                d.push(new self.tableCol(value.Box_serial, "complete", false, "large", false, true, false, false));
                if (_AuditData["show_expected_qty"] != undefined && _AuditData["show_expected_qty"] == true)
                    d.push(new self.tableCol(value.Expected_qty, "complete", false, "large", true, false, false, false, true));
                d.push(new self.tableCol(value.Actual_qty, "complete", false, "large", true, false, false, false, true));
                d.push(new self.tableCol("0", "complete", false, "large", true, false, false, false, true, "button", "finish", value.Scan_status == "open"));
                data["tableRows"].push(d);
            }

            if (value.Scan_status == "open") {
                _finishAuditFlag = false;
            }
        });

        _AuditData.Extra_box_list.map(function(value, index) {
            d = [];
            d.push(new self.tableCol(value.Box_serial, "extra", false, "large", false, true, false, false));
            if (_AuditData["show_expected_qty"] != undefined && _AuditData["show_expected_qty"] == true)
                d.push(new self.tableCol(value.Expected_qty, "enabled", false, "large", true, false, false, false, true));
            d.push(new self.tableCol(value.Actual_qty, "enabled", value.Scan_status == "open", "large", true, false, false, false, true));
            d.push(new self.tableCol("0", "enabled", false, "large", true, false, false, false, true, "button", "finish", value.Scan_status == "open"));
            data["tableRows"].push(d);
            if (value.Scan_status == "open") {
                _finishAuditFlag = false;
            }
        });

        return data;

    },

    getCurrentBoxSerialData: function() {
        return _AuditData.Current_box_details;
    },

    getCancelScanStatus: function() {
        return _AuditData.Cancel_scan;
    },


    getReconcileBoxSerialData: function() {
        var data = {};
        data["header"] = [];
        data["tableRows"] = [];
        var self = this;
        data["header"].push(new this.tableCol("Box Serial Numbers", "header", false, "small", false, true, true, false));
        data["header"].push(new this.tableCol("Missing", "header", false, "small", false, false, true, false, true));
        data["header"].push(new this.tableCol("Extra", "header", false, "small", false, false, true, false, true));

        _AuditData.Box_qty_list.map(function(value, index) {
            if (value.Scan_status != "no_scan")
                data["tableRows"].push([new self.tableCol(value.Box_serial, "enabled", false, "large", false, true, false, false),
                    new self.tableCol(Math.max(value.Expected_qty - value.Actual_qty, 0), "enabled", false, "large", true, false, false, false, true),
                    new self.tableCol(Math.max(value.Actual_qty - value.Expected_qty, 0), "enabled", false, "large", true, false, false, false, true)
                    ]);
            else
                data["tableRows"].push([new self.tableCol(value.Box_serial, "enabled", false, "large", false, true, false, false),
                    new self.tableCol("Missing Box", "missing", false, "large", false, false, false, false, true)
                    ]);

        });
        _AuditData.Extra_box_list.map(function(value, index) {
            data["tableRows"].push([new self.tableCol(value.Box_serial, "enabled", false, "large", false, true, false, false),
                new self.tableCol("Extra ( " + value.Actual_qty + "/" + value.Expected_qty + " )", "extra", false, "large", false, false, false, false, true)
                ]);
        });

        return data;
    },

    getReconcileLooseItemsData: function() {
        var data = {};
        data["header"] = [];
        data["tableRows"] = [];
        data["header"].push(new this.tableCol("Loose Items SKU", "header", false, "small", false, true, true, false));
        data["header"].push(new this.tableCol("Missing", "header", false, "small", false, false, true, false, true));
        data["header"].push(new this.tableCol("Extra", "header", false, "small", false, false, true, false, true));
        var self = this;

        _AuditData.Loose_sku_list.map(function(value, index) {
            if (value.Scan_status != "no_scan")
                data["tableRows"].push([new self.tableCol(value.Sku, "enabled", false, "large", false, true, false, false), new self.tableCol(Math.max(value.Expected_qty - value.Actual_qty, 0), "enabled", false, "large", true, false, false, false, true), new self.tableCol(Math.max(value.Actual_qty - value.Expected_qty, 0), "enabled", false, "large", true, false, false, false, true)]);
            else
                data["tableRows"].push([new self.tableCol(value.Sku, "missing", false, "large", false, true, false, false), new self.tableCol("Missing", "missing", false, "large", false, false, false, false, true)]);

        });
        return data;
    },

    getLooseItemsData: function() {
        var data = {};
        var disabledStatus;
        //if (_AuditData.Current_box_details.length > 0) {
            disabledStatus = false;
        //}
        data["header"] = [];
        data["header"].push(new this.tableCol("Loose Items", "header", false, "small", false, true, true, false));
        if (_AuditData["show_expected_qty"] != undefined && _AuditData["show_expected_qty"] == true)
            data["header"].push(new this.tableCol("Expected", "header", false, "small", false, false, true, false, true));
        data["header"].push(new this.tableCol("Actual", "header", false, "small", false, false, true, false, true));
        data["tableRows"] = [];
        var self = this;
        var d = [];
        _AuditData.Loose_sku_list.map(function(value, index) {
            d= [];
            d.push(new self.tableCol(value.Sku, "enabled", false, "large", false, true, false, disabledStatus));
            if (_AuditData["show_expected_qty"] != undefined && _AuditData["show_expected_qty"] == true)
                d.push(new self.tableCol(value.Expected_qty, "enabled", false, "large", true, false, false, disabledStatus, true));
            d.push(new self.tableCol(value.Actual_qty, "enabled", (_AuditData.Current_box_details.length > 0 && _AuditData.Current_box_details[0]["Box_serial"] == null) ? _AuditData.Current_box_details[0]["Sku"] == value.Sku : false, "large", true, false, false, disabledStatus, true));
            console.log("jkkkk");
            console.log(d);
            data["tableRows"].push(d);

           /* data["tableRows"].push([new self.tableCol(value.Sku, "enabled", false, "large", false, true, false, disabledStatus), (function() {
                    if (_AuditData["show_expected_qty"] != undefined && _AuditData["show_expected_qty"] == true)
                        new self.tableCol(value.Expected_qty, "enabled", false, "large", true, false, false, disabledStatus, true);
                })(),
                new self.tableCol(value.Actual_qty, "enabled", (_AuditData.Current_box_details.length > 0 && _AuditData.Current_box_details[0]["Box_serial"] == null) ? _AuditData.Current_box_details[0]["Sku"] == value.Sku : false, "large", true, false, false, disabledStatus, true)
                ]);*/
            });
        return data;
    },


    getFinishAuditFlag: function() {
        return _finishAuditFlag;
    },

    getItemDetailsData: function() {
        var data = {};
        data["header"] = [];
        data["header"].push(new this.tableCol("Product Details", "header", false, "small", false, true, true, false));
        data["tableRows"] = [];
        var self = this;
        if (_AuditData.product_info != undefined && Object.keys(_AuditData.product_info).length > 0) {
            for (var key in _AuditData.product_info) {
                if (_AuditData.product_info.hasOwnProperty(key)) {
                    data["tableRows"].push([new self.tableCol(key, "enabled", false, "small", false, true, false, false), new self.tableCol(_AuditData.product_info[key], "enabled", false, "small", false, true, false, false)]);
                }
            }
        } else {
            data["tableRows"].push([new self.tableCol("Product Name", "enabled", false, "small", false, true, false, false),
                new self.tableCol("--", "enabled", false, "small", false, true, false, false)
                ]);
            data["tableRows"].push([new self.tableCol("Product Desc", "enabled", false, "small", false, true, false, false),
                new self.tableCol("--", "enabled", false, "small", false, true, false, false)
                ]);
            data["tableRows"].push([new self.tableCol("Product SKU", "enabled", false, "small", false, true, false, false),
                new self.tableCol("--", "enabled", false, "small", false, true, false, false)
                ]);
            data["tableRows"].push([new self.tableCol("Product Type", "enabled", false, "small", false, true, false, false),
                new self.tableCol("--", "enabled", false, "small", false, true, false, false)
                ]);
        }

        return data;
    },

    getRackDetails: function() {
        console.log(_AuditData.rack_details);
        return _AuditData.rack_details;
    },

    getNotificationData: function() {
        return _AuditData.notification_list[0];
    },

    setAuditData: function(data) {
        _AuditData = data;
    },

    getStateData: function() {
        return _AuditData;
    },

    getBinData: function() {
        var binData = {};
        binData["structure"] = _AuditData.structure;
        binData["ppsbin_list"] = _AuditData.ppsbin_list;
        return binData;
    },

    getScreenId: function() {
        return _AuditData.screen_id;
    },

    getCurrentSlot: function() {
        if (_AuditData.hasOwnProperty('rack_details')) {
            return _AuditData.rack_details.slot_barcodes;
        } else {
            return null;
        }
    }



});

AuditStore.dispatchToken = AppDispatcher.register(function(action) {
    switch (action.action.actionType) {

        case ActionTypes.SET_AUDIT_DATA:
        AuditStore.setAuditData(action.action.data);
        AuditStore.emitChange();
        break;

        default:
            // do nothing
        }

    });

module.exports = AuditStore;