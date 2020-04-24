var AppDispatcher = require("../dispatchers/AppDispatcher")
var appConstants = require("../constants/appConstants")
var objectAssign = require("react/lib/Object.assign")
var SVGConstants = require("../constants/svgConstants")
var EventEmitter = require("events").EventEmitter
var utils = require("../utils/utils")
var serverMessages = require("../serverMessages/server_messages")
var chinese = require("../serverMessages/chinese")
var english = require("../serverMessages/english")
var hebrew = require("../serverMessages/hebrew")
var japanese = require("../serverMessages/japanese")
var german = require("../serverMessages/german")
var french = require("../serverMessages/french")
var spanish = require("../serverMessages/spanish")
var dutch = require("../serverMessages/dutch")
var navConfig = require("../config/navConfig")
var resourceConstants = require("../constants/resourceConstants")
var CommonActions = require("../actions/CommonActions")
var CHANGE_EVENT = "change"
var _seatData,
  _currentSeat,
  _currentStationId,
  _peripheralScreen = false,
  _seatMode,
  _username,
  _seatType,
  _seatName,
  _utility,
  _pptlEvent,
  _binId,
  _cancelEvent,
  _messageJson,
  _screenId,
  _itemUid,
  _exceptionType,
  _action,
  _KQQty = 0,
  _logoutStatus,
  _activeException = null,
  _enableException = false,
  _enableSearch = false,
  popupVisible = false,
  _showSpinner = true,
  _goodQuantity = 0,
  _damagedQuantity = 0,
  _putFrontExceptionScreen = "good",
  _pickFrontExceptionScreen = "good",
  _missingQuantity = 0,
  _unscannableQuantity = 0,
  showModal = false,
  _scanAllowed = true,
  _clearNotification = false,
  _enableButton = true,
  _putBackExceptionScreen,
  _finishAuditFlag = true
_errorPopupDisabled = false
_cancelButtonClicked = false
_auditModalStatus = false
_boiConfig = null
_itemSearchEnabled = false
_scannerLoginEnabled = false
_unitConversionAllowed = false
_uomConversionFactor = 1
_uomDisplayUnit = ""

var modalContent = {
  data: "",
  type: ""
}

/*
 * This function enables the logout due to inactivity feature - Krishna.
 */
var idleLogout = (function() {
  var t
  window.addEventListener("load", resetTimer, false)
  window.addEventListener("mousemove", resetTimer, false)
  window.addEventListener("mousedown", resetTimer, false)
  window.addEventListener("onclick", resetTimer, false)
  window.addEventListener("scroll", resetTimer, false)
  window.addEventListener("keypress", resetTimer, false)

  function logout() {
    if (mainstore.getLogoutState()) {
      console.log(
        "Logging out since user has been idle past the time threshold"
      )
      CommonActions.logoutSession(true)
    }
  }

  function resetTimer() {
    clearTimeout(t)
    t = setTimeout(logout, appConstants.IDLE_LOGOUT_TIME)
    // time is in milliseconds
  }
})()

function setPopUpVisible(status) {
  popupVisible = status
  mainstore.emit(CHANGE_EVENT)
}
var mainstore = objectAssign({}, EventEmitter.prototype, {
  emitChange: function() {
    this.emit(CHANGE_EVENT)
  },
  addChangeListener: function(cb) {
    this.on(CHANGE_EVENT, cb)
  },
  removeChangeListener: function(cb) {
    this.removeListener(CHANGE_EVENT, cb)
  },
  getPopUpVisible: function(data) {
    return popupVisible
  },
  showSpinner: function() {
    _showSpinner = true
  },
  setLogoutState: function() {
    _logoutStatus = _seatData.logout_allowed
  },
  getSpinnerState: function() {
    return _showSpinner
  },

  getLogoutState: function() {
    if (_seatData && _seatData.hasOwnProperty("logout_allowed"))
      return _seatData.logout_allowed
  },
  getScanAllowedStatus: function() {
    if (_seatData.hasOwnProperty("scan_allowed")) {
      _scanAllowed = _seatData.scan_allowed
      return _scanAllowed
    } else {
      _scanAllowed = true
      return _scanAllowed
    }
  },

  toggleBinSelection: function(bin_id) {
    var flag = false
    _seatData["ppsbin_list"].map(function(value, index) {
      if (value.ppsbin_id == bin_id) {
        if (value["selected_for_staging"] != undefined) {
          flag = !value["selected_for_staging"]
          value["selected_for_staging"] = !value["selected_for_staging"]
          _enableButton = !_enableButton
        } else {
          value["selected_for_staging"] = true
          flag = true
          _enableButton = false
        }
      } else if (value["selected_for_staging"] != undefined) {
        value["selected_for_staging"] = false
      }
    })
    if (_seatData.notification_list.length != 0) {
      _seatData.notification_list[0].code = flag
        ? resourceConstants.CLIENTCODE_001
        : resourceConstants.CLIENTCODE_002
      _seatData.notification_list[0].type = appConstants.CLIENT_NOTIFICATION
      if (flag == true) {
        _enableButton = false
      } else {
        _enableButton = true
      }
      _seatData.notification_list[0].details[0] = bin_id
      _seatData.notification_list[0].level = "info"
      _seatData.notification_list[0].type = appConstants.CLIENT_NOTIFICATION
      //_seatData.notification_list[0].description = (flag) ? resourceConstants.BIN + ' ' + bin_id + ' ' + resourceConstants.SELECTED : resourceConstants.BIN + ' ' + bin_id + ' ' + resourceConstants.UNSELECTED;
    } else {
      var notification_list = {
        code: flag
          ? resourceConstants.CLIENTCODE_001
          : resourceConstants.CLIENTCODE_002,
        level: "info",
        details: [bin_id],
        description: "",
        type: appConstants.CLIENT_NOTIFICATION
      }
      _seatData.notification_list[0] = notification_list
    }
  },

  getEnableButton: function() {
    return _enableButton
  },

  setEnableButtonIntialState: function() {
    _enableButton = true
  },

  enableButton: function() {
    var currentState = this.getEnableButton()
    this.setEnableButtonIntialState()
    return currentState
  },

  getScreenEvent: function() {
    return _seatData.event
  },

  IsCrossDockEnabled: function() {
    if (_seatData && _seatData.hasOwnProperty("is_ud_without_staging"))
      return _seatData.is_ud_without_staging
  },

  getBoxBarcode: function() {
    let BoxBarcode = {}
    if (
      _seatData.exception_details &&
      _seatData.exception_details.current_packing_box
    ) {
      BoxBarcode.CurrentBoxBarcode =
        _seatData.exception_details.current_packing_box
    }
    if (
      _seatData.exception_details &&
      _seatData.exception_details.new_packing_box
    ) {
      BoxBarcode.NewBoxBarcode = _seatData.exception_details.new_packing_box
    }
    return BoxBarcode
  },

  getConfirmState: function() {
    return _seatData.exception_details
      ? _seatData.exception_details.confirm_enabled
      : false
  },

  getStageActiveStatus: function() {
    if (_seatData.hasOwnProperty("ppsbin_list")) {
      var flag = false
      _seatData["ppsbin_list"].map(function(value, index) {
        if (
          value["selected_for_staging"] != undefined &&
          value["selected_for_staging"] == true
        )
          flag = true
      })
      return flag
    }
  },

  getStageAllActiveStatus: function() {
    if (_seatData.hasOwnProperty("ppsbin_list")) {
      var flag = false
      _seatData["ppsbin_list"].map(function(value, index) {
        if (value.ppsbin_count > 0 && value.ppsbin_state != "staged")
          flag = true
      })
      return flag
    }
  },

  getPutQuantity: function() {
    if (_seatData.hasOwnProperty("put_quantity")) return _seatData.put_quantity
  },
  getGoodQuantity: function() {
    if (_seatData.hasOwnProperty("good_quantity")) {
      _goodQuantity = _seatData.good_quantity
      return _goodQuantity
    }
  },

  getErrorPopupDisabledStatus: function() {
    if (_seatData.hasOwnProperty("error_popup_disabled")) {
      _errorPopupDisabled = _seatData.error_popup_disabled
    }
    return _errorPopupDisabled
  },

  setShowModal: function(data) {
    showModal = false
  },
  getNavData: function() {
    /* dynamic header navigation implementation */
    if (_seatData.header_steps) {
      var headerSteps = _seatData.header_steps
      navConfig.header = []
      for (var i = 0; i < headerSteps.length; i++) {
        navConfig.header.push({
          screen_id: serverMessages[headerSteps[i]]["screen_id"],
          code: null,
          message: serverMessages[headerSteps[i]]["textToDisplay"],
          showImage: true,
          level: null,
          type: "passive"
        })
      }
      _NavData = navConfig.header
      _NavData.map(function(data, index) {
        if (data.screen_id.constructor === Array && data.screen_id.length > 0) {
          if (data.screen_id.indexOf(_seatData.screen_id) != -1) {
            _NavData[index].type = "active"
          } else {
            _NavData[index].type = "passive"
          }
        } else if (_seatData.screen_id == data.screen_id) {
          _NavData[index].type = "active"
        } else {
          _NavData[index].type = "passive"
        }
        /* condition to NOT show indexing when there is one active item in header_steps */
        if (headerSteps.length > 1) {
          _NavData[index].level = index + 1 //appending level no. at run time
        }
      })
      return _NavData
    } else {
      switch (_currentSeat) {
        case appConstants.PICK_FRONT:
          if (
            _seatData.screen_id === appConstants.PICK_FRONT_WAITING_FOR_MSU ||
            _seatData.screen_id === appConstants.PICK_FRONT_ONE_STEP_SCAN ||
            _seatData.screen_id === appConstants.WAIT_FOR_MTU ||
            _seatData.screen_id === appConstants.SELECT_MTU_POINT ||
            _seatData.screen_id === appConstants.REMOVE_ALL_TOTES ||
            _seatData.screen_id === appConstants.SCAN_EMPTY_TOTE ||
            _seatData.screen_id === appConstants.SCAN_EMPTY_SLOT ||
            _seatData.screen_id === appConstants.PICK_FRONT_DOCK_TOTE ||
            _seatData.screen_id === appConstants.PICK_FRONT_UNDOCK_TOTE ||
            _seatData.screen_id === appConstants.PICK_FRONT_SLOT_SCAN
          ){
            _NavData = navConfig.pickFront[0]
          } else{
             _NavData = navConfig.pickFront[1]
          }
          break
        default:
        //return true;
      }
      _NavData.map(function(data, index) {
        if (data.screen_id instanceof Array) {
          if (data.screen_id.indexOf(_seatData.screen_id) != -1) {
            _NavData[index].type = "active"
          } else {
            _NavData[index].type = "passive"
          }
        } else if (_seatData.screen_id == data.screen_id) {
          _NavData[index].type = "active"
        } else {
          _NavData[index].type = "passive"
        }
      })
      return _NavData
    }
  },

  getModalStatus: function() {
    var data = {}
    data["showModal"] = ""
    data["message"] = ""
    if (
      _seatData.screen_id != appConstants.AUDIT_RECONCILE &&
      showModal &&
      _seatData["Current_box_details"].length > 0 &&
      _seatData["Current_box_details"][0]["Box_serial"] == null &&
      _seatData["Current_box_details"][0]["Actual_qty"] >
        _seatData["Current_box_details"][0]["Expected_qty"]
    ) {
      showModal = false
      return {
        showModal: true,
        message: _("Place extra entity in Exception area.")
      }
    } else if (
      _seatData.screen_id != appConstants.AUDIT_RECONCILE &&
      showModal &&
      _seatData.k_deep_audit &&
      _seatData["Current_box_details"][0]["Box_Actual_Qty"] >
        _seatData["Current_box_details"][0]["Box_Expected_Qty"]
    ) {
      showModal = false
      return {
        showModal: true,
        message: _("Place extra entity in Exception area.")
      }
    } else if (
      _seatData.screen_id != appConstants.AUDIT_RECONCILE &&
      showModal &&
      _seatData["last_finished_box"].length > 0 &&
      _seatData["last_finished_box"][0]["Actual_qty"] >
        _seatData["last_finished_box"][0]["Expected_qty"]
    ) {
      showModal = false
      console.log(
        _seatData.last_finished_box[0]["Actual_qty"] -
          _seatData.last_finished_box[0]["Expected_qty"]
      )
      return {
        showModal: true,
        message: _("Place extra entity in Exception area.")
      }
    } else {
      return data
    }
  },

  getBoxSerialData: function() {
    var data = {}
    data["header"] = []
    data["tableRows"] = []
    var self = this
    if (!_seatData.k_deep_audit) {
      data["header"].push(
        new this.tableCol(
          _("Box Serial Numbers"),
          "header",
          false,
          "small",
          false,
          true,
          true,
          false
        )
      )
      if (
        _seatData["show_expected_qty"] != undefined &&
        _seatData["show_expected_qty"] == true
      )
        data["header"].push(
          new this.tableCol(
            _("Expected"),
            "header",
            false,
            "small",
            false,
            false,
            true,
            false,
            true
          )
        )
      data["header"].push(
        new this.tableCol(
          _("Actual"),
          "header",
          false,
          "small",
          false,
          false,
          true,
          false,
          true
        )
      )
      data["header"].push(
        new this.tableCol(
          _("Actions"),
          "header",
          false,
          "small",
          false,
          false,
          true,
          false,
          true
        )
      )
      _finishAuditFlag = true
      var d = []

      _seatData.Box_qty_list.map(function(value, index) {
        d = []
        if (value.Scan_status != "close") {
          d.push(
            new self.tableCol(
              value.Box_serial,
              "enabled",
              false,
              "large",
              false,
              true,
              false,
              false
            )
          )
          if (
            _seatData["show_expected_qty"] != undefined &&
            _seatData["show_expected_qty"] == true
          )
            d.push(
              new self.tableCol(
                value.Expected_qty,
                "enabled",
                false,
                "large",
                true,
                false,
                false,
                false,
                true
              )
            )
          d.push(
            new self.tableCol(
              value.Actual_qty,
              "enabled",
              value.Scan_status == "open",
              "large",
              true,
              false,
              false,
              false,
              true
            )
          )
          d.push(
            new self.tableCol(
              "0",
              "enabled",
              false,
              "large",
              true,
              false,
              false,
              false,
              true,
              "button",
              "action",
              value.Scan_status == "open"
            )
          )
          data["tableRows"].push(d)
        } else {
          d.push(
            new self.tableCol(
              value.Box_serial,
              "complete",
              false,
              "large",
              false,
              true,
              false,
              false
            )
          )
          if (
            _seatData["show_expected_qty"] != undefined &&
            _seatData["show_expected_qty"] == true
          )
            d.push(
              new self.tableCol(
                value.Expected_qty,
                "complete",
                false,
                "large",
                true,
                false,
                false,
                false,
                true
              )
            )
          d.push(
            new self.tableCol(
              value.Actual_qty,
              "complete",
              false,
              "large",
              true,
              false,
              false,
              false,
              true
            )
          )
          d.push(
            new self.tableCol(
              "0",
              "complete",
              false,
              "large",
              true,
              false,
              false,
              false,
              true,
              "button",
              "action",
              value.Scan_status == "open"
            )
          )
          data["tableRows"].push(d)
        }

        if (value.Scan_status == "open") {
          _finishAuditFlag = false
        }
      })

      _seatData.Extra_box_list.map(function(value, index) {
        d = []
        d.push(
          new self.tableCol(
            value.Box_serial,
            "extra",
            false,
            "large",
            false,
            true,
            false,
            false
          )
        )
        if (
          _seatData["show_expected_qty"] != undefined &&
          _seatData["show_expected_qty"] == true
        )
          // d.push(new self.tableCol(value.Expected_qty, "enabled", false, "large", true, false, false, false, true));
          d.push(
            new self.tableCol(
              value.Actual_qty,
              "enabled",
              value.Scan_status == "open",
              "large",
              true,
              false,
              false,
              false,
              true
            )
          )
        d.push(
          new self.tableCol(
            "0",
            "enabled",
            false,
            "large",
            true,
            false,
            false,
            false,
            true,
            "button",
            "action",
            value.Scan_status == "open"
          )
        )
        data["tableRows"].push(d)
        if (value.Scan_status == "open") {
          _finishAuditFlag = false
        }
      })
    }
    return data
  },

  //SR pack-subpack
  getPackData: function() {
    var data = {}
    data["header"] = []
    data["tableRows"] = []
    var self = this
    data["header"].push(
      new this.tableCol(
        _(_seatData.Possible_Container_Names.container_level_2),
        "header",
        false,
        "small",
        false,
        true,
        true,
        false
      )
    )
    if (
      _seatData["show_expected_qty"] != undefined &&
      _seatData["show_expected_qty"] == true
    ) {
      data["header"].push(
        new this.tableCol(
          _("Expected"),
          "header",
          false,
          "small",
          false,
          false,
          true,
          false,
          true
        )
      )
    }
    data["header"].push(
      new this.tableCol(
        _("Actual"),
        "header",
        false,
        "small",
        false,
        false,
        true,
        false,
        true
      )
    )
    var d = []
    _seatData.Box_qty_list.map(function(value, index) {
      d = []
      if (value.Type === appConstants.OUTER_PACK) {
        d.push(
          new self.tableCol(
            value.Box_serial,
            "complete",
            false,
            "large",
            false,
            true,
            false,
            false
          )
        )
        if (
          _seatData["show_expected_qty"] != undefined &&
          _seatData["show_expected_qty"] == true
        )
          d.push(
            new self.tableCol(
              value.Box_Expected_Qty,
              "complete",
              false,
              "large",
              true,
              false,
              false,
              false,
              true
            )
          )
        d.push(
          new self.tableCol(
            value.Box_Actual_Qty,
            "complete",
            _seatData.Current_box_details.length > 0
              ? _seatData.Current_box_details[0]["Box_serial"] ==
                value.Box_serial
              : false,
            "large",
            true,
            false,
            false,
            false,
            true
          )
        )
        data["tableRows"].push(d)
      }
    })
    _seatData.Extra_box_list.map(function(value, index) {
      d = []
      if (value.Type === appConstants.OUTER_PACK) {
        d.push(
          new self.tableCol(
            value.Box_serial,
            "extraqt",
            false,
            "large",
            false,
            true,
            false,
            false
          )
        )
        if (
          _seatData["show_expected_qty"] != undefined &&
          _seatData["show_expected_qty"] == true
        )
          d.push(
            new self.tableCol(
              value.Box_Expected_Qty,
              "extraqt",
              false,
              "large",
              true,
              false,
              false,
              false,
              true
            )
          )
        d.push(
          new self.tableCol(
            value.Box_Actual_Qty,
            "extraqt",
            _seatData.Current_box_details.length > 0
              ? _seatData.Current_box_details[0]["Box_serial"] ==
                value.Box_serial
              : false,
            "large",
            true,
            false,
            false,
            false,
            true
          )
        )
        data["tableRows"].push(d)
      }
    })

    return data
  },

  getSubPackData: function() {
    var data = {}
    data["header"] = []
    data["tableRows"] = []
    var self = this

    data["header"].push(
      new this.tableCol(
        _(_seatData.Possible_Container_Names.container_level_1),
        "header",
        false,
        "small",
        false,
        true,
        true,
        false
      )
    )
    if (
      _seatData["show_expected_qty"] != undefined &&
      _seatData["show_expected_qty"] == true
    ) {
      data["header"].push(
        new this.tableCol(
          _("Expected"),
          "header",
          false,
          "small",
          false,
          false,
          true,
          false,
          true
        )
      )
    }
    data["header"].push(
      new this.tableCol(
        _("Actual"),
        "header",
        false,
        "small",
        false,
        false,
        true,
        false,
        true
      )
    )

    var d = []
    _seatData.Box_qty_list.map(function(value, index) {
      d = []
      if (value.Type === appConstants.INNER_SUBPACK) {
        d.push(
          new self.tableCol(
            value.Box_serial,
            "complete",
            false,
            "large",
            false,
            true,
            false,
            false
          )
        )
        if (
          _seatData["show_expected_qty"] != undefined &&
          _seatData["show_expected_qty"] == true
        )
          d.push(
            new self.tableCol(
              value.Box_Expected_Qty,
              "complete",
              false,
              "large",
              true,
              false,
              false,
              false,
              true
            )
          )
        d.push(
          new self.tableCol(
            value.Box_Actual_Qty,
            "complete",
            _seatData.Current_box_details.length > 0
              ? _seatData.Current_box_details[0]["Box_serial"] ==
                value.Box_serial
              : false,
            "large",
            true,
            false,
            false,
            false,
            true
          )
        )
        data["tableRows"].push(d)
      }
    })
    _seatData.Extra_box_list.map(function(value, index) {
      d = []
      if (value.Type === appConstants.INNER_SUBPACK) {
        d.push(
          new self.tableCol(
            value.Box_serial,
            "extraqt",
            false,
            "large",
            false,
            true,
            false,
            false
          )
        )
        if (
          _seatData["show_expected_qty"] != undefined &&
          _seatData["show_expected_qty"] == true
        )
          d.push(
            new self.tableCol(
              value.Box_Expected_Qty,
              "extraqt",
              false,
              "large",
              true,
              false,
              false,
              false,
              true
            )
          )
        d.push(
          new self.tableCol(
            value.Box_Actual_Qty,
            "extraqt",
            _seatData.Current_box_details.length > 0
              ? _seatData.Current_box_details[0]["Box_serial"] ==
                value.Box_serial
              : false,
            "large",
            true,
            false,
            false,
            false,
            true
          )
        )
        data["tableRows"].push(d)
      }
    })

    return data
  },

  getBoxDetails: function() {
    if (_seatData.hasOwnProperty("box_serials")) return _seatData.box_serials
  },
  getIRTScanStatus: function() {
    if (_seatData.hasOwnProperty("irt_scan_enabled"))
      return _seatData.irt_scan_enabled
  },
  getExceptionType: function() {
    if (_seatData.hasOwnProperty("exception_type")) p
    return _seatData.exception_type
  },
  getToteDeatils: function() {
    if (_seatData.hasOwnProperty("tote_details"))
      return _seatData.tote_details.tote_barcode
  },
  getPrinterInfo: function() {
    if (_seatData.hasOwnProperty("printer_info")) return _seatData.printer_info
  },
  getPrinterVisibility: function() {
    if (_seatData.hasOwnProperty("printer_info")) {
      if (_seatData.printer_info.hasOwnProperty("printer_visible")) {
        return _seatData.printer_info.printer_visible
      } else {
        return false
      }
    }
  },
  getOrderDetails: function() {
    var orderDetailsinOrder = {}
    var orderDetails = _seatData["order_details"]
    /*Performing this action to reorder the object*/
    if (orderDetails) {
      if (orderDetails.order_id) {
        orderDetailsinOrder.order_id = orderDetails.order_id
      }
      if (orderDetails.rem_qty) {
        orderDetailsinOrder.rem_qty = orderDetails.rem_qty
      }
      if (orderDetails.volume) {
        orderDetailsinOrder.volume = orderDetails.volume
      }
      if (orderDetails.vol_unit) {
        orderDetailsinOrder.vol_unit = orderDetails.vol_unit
      }
    }
    return orderDetailsinOrder
  },
  getOrderID: function() {
    if (_seatData.hasOwnProperty("order_details"))
      return {
        order_id: _seatData.order_details.order_id || ""
      }
  },

  getChecklistDetails: function() {
    if (_seatData.hasOwnProperty("checklist_details")) {
      if (_seatData.checklist_details.pick_checklist.length > 0) {
        return _seatData.checklist_details.pick_checklist
      } else {
        return []
      }
    } else {
      return []
    }
  },

  getChecklistCompleteDetails: function() {
    if (_seatData.hasOwnProperty("checklist_details")) {
      return _seatData.checklist_details
    }
  },

  getChecklistIndex: function() {
    if (_seatData.hasOwnProperty("checklist_details")) {
      if (_seatData.checklist_details.checklist_index != null) {
        return _seatData.checklist_details.checklist_index
      } else {
        return null
      }
    } else {
      return null
    }
  },

  getChecklistOverlayStatus: function() {
    if (_seatData.hasOwnProperty("checklist_details")) {
      return _seatData.checklist_details.display_checklist_overlay
    } else {
      return null
    }
  },

  getServerNavData: function() {
    if (_seatData.header_msge_list.length > 0) {
      _serverNavData = _seatData.header_msge_list[0]
      return _serverNavData
    } else {
      return null
    }
  },

  getChecklistData: function() {
    if (
      Array.isArray(_seatData.checklist_data) &&
      _seatData.hasOwnProperty("checklist_data")
    ) {
      return _seatData.checklist_data
    } else {
      console.log("Empty CheckList")
      return []
    }
  },

  getChecklistIdx: function() {
    if (_seatData.hasOwnProperty("checklist_index")) {
      return _seatData.checklist_index
    }
  },

  getPackingBoxType: function() {
    return _seatData.packing_box_type || null
  },
  getChecklistDockData: function() {
    if (_seatData.hasOwnProperty("dock_actions")) {
      var dockActionsArray = []
      Array.isArray(_seatData.dock_actions) &&
        _seatData.dock_actions.map(function(value, key) {
          var dataToReplace = value.details
          var data = serverMessages[value.code]
          data = data.replace(/{\w+}/g, function(everyPlaceholder) {
            var placeHolder = everyPlaceholder.match(/\d+/g)
            return dataToReplace[placeHolder]
          })

          var eachData = { action_results: { value: data, key: " " } }
          dockActionsArray.push(eachData)
        })
      return dockActionsArray
    }
  },

  getChecklistDockIdx: function() {
    if (_seatData.hasOwnProperty("dock_index")) {
      return _seatData.dock_index
    }
  },
  manipulateMessage: function(value) {
    var dataToReplace = value.details
    var data = serverMessages[value.code]
    data = data.replace(/{\w+}/g, function(everyPlaceholder) {
      var placeHolder = everyPlaceholder.match(/\d+/g)
      return dataToReplace[placeHolder]
    })
    var eachData = { action_results: { value: data, key: " " } }
    return eachData
  },

  getChecklistDockUndockData: function(arg) {
    if (arg === "dock_actions" && _seatData.hasOwnProperty("dock_actions")) {
      var dockActionsArray = []
      Array.isArray(_seatData.dock_actions) &&
        _seatData.dock_actions.map(function(value, key) {
          messageData = mainstore.manipulateMessage(value)
          dockActionsArray.push(messageData)
        })
      return dockActionsArray
    } else if (
      arg === "undock_actions" &&
      _seatData.hasOwnProperty("undock_actions")
    ) {
      var undockActionsArray = []
      Array.isArray(_seatData.undock_actions) &&
        _seatData.undock_actions.map(function(value, key) {
          messageData = mainstore.manipulateMessage(value)
          undockActionsArray.push(messageData)
        })
      return undockActionsArray
    }
  },

  getDockHeader: function() {
    if (_seatData.hasOwnProperty("dock_header")) {
      messageData = mainstore.manipulateMessage(_seatData.dock_header)
      return messageData.action_results.value
    } else {
      return null
    }
  },

  getUnDockHeader: function() {
    if (_seatData.hasOwnProperty("undock_header")) {
      messageData = mainstore.manipulateMessage(_seatData.undock_header)
      return messageData.action_results.value
    } else {
      return null
    }
  },

  getChecklistDockUndockIndex: function(arg) {
    if (arg === "dock_index" && _seatData.hasOwnProperty("dock_index")) {
      return _seatData.dock_index
    } else if (
      arg === "undock_index" &&
      _seatData.hasOwnProperty("undock_index")
    ) {
      return _seatData.undock_index
    }
  },

  getNotificationData: function() {
    if (
      _clearNotification == true &&
      _seatData.hasOwnProperty("notification_list")
    ) {
      var notification_list = [
        {
          details: [],
          code: null,
          description: "",
          level: "info"
        }
      ]
      _seatData.notification_list = notification_list
      _clearNotification = false
    }
    return _seatData.notification_list[0]
  },
  getLocationButtonStatus: function() {
    return _seatData.button_press_allowed
  },

  getButtonStatus: function() {
    if (
      _seatData.button_press_id === "dock_tote" ||
      _seatData.button_press_id === "skip_bin"
    ) {
      return _seatData.button_press_allowed
    } else {
      return null
    }
  },

  clearNotifications: function() {
    _clearNotification = true
  },
  getBinData: function() {
    var binData = {}
    binData["structure"] = _seatData.structure
    binData["ppsbin_list"] = _seatData.ppsbin_list
    return binData
  },
  getPickFrontButtonType: function() {
    return _seatData.button_press_id || null
  },
  getPickFrontButtonStatus: function() {
    return _seatData.button_press_allowed
  },
  getPickFrontPackingCancelStatus: function() {
    return _seatData.cancel_scan_allowed
  },

  stageOneBin: function() {
    if (_seatData.hasOwnProperty("ppsbin_list")) {
      var data = {}
      _seatData.ppsbin_list.map(function(value, index) {
        if (
          value["selected_for_staging"] != undefined &&
          value["selected_for_staging"] == true
        ) {
          data["event_name"] = "stage_ppsbin"
          data["event_data"] = {}
          data["event_data"]["ppsbin_id"] = value.ppsbin_id
          data["source"] = "ui"
        }
      })

      utils.postDataToInterface(data, _seatData.seat_name)
    }
  },

  getSelectedBin: function() {
    if (_seatData.hasOwnProperty("ppsbin_list")) {
      var data = null
      _seatData.ppsbin_list.map(function(value, index) {
        if (
          value["selected_for_staging"] != undefined &&
          value["selected_for_staging"] == true
        ) {
          data = value.ppsbin_id
        }
      })

      return data
    } else return null
  },

  getDataToDisAssociateTote: function() {
    if (_seatData.hasOwnProperty("tote_disassociation_data")) {
      return _seatData["tote_disassociation_data"]
    } else return null
  },

  getCurrentState: function() {
    if (_seatData.hasOwnProperty("ppsbin_list")) {
      var data = null
      _seatData.ppsbin_list.map(function(value, index) {
        if (
          value["selected_for_staging"] != undefined &&
          value["selected_for_staging"] == true
        ) {
          data = value.ppsbin_state
        }
      })

      return data
    } else return null
  },

  stageAllBin: function() {
    var data = {}
    data["event_name"] = "stage_all"
    data["event_data"] = ""
    data["source"] = "ui"
    utils.postDataToInterface(data, _seatData.seat_name)
  },

  getExceptionData: function() {
    var data = {}
    data["activeException"] = this.getActiveException()
    data["list"] = []
    data["header"] = "Exceptions"
    var bSelected = false
    var bDisabled = false
    _seatData.exception_allowed.map(function(value, index) {
      //all exception items should be enabled and unselected first hence putting disabled = false
      bDisabled = false
      bSelected = false
      if (
        (_seatData["exception_type"] != undefined &&
          value.event == _seatData["exception_type"]) ||
        value.exception_name === data["activeException"]
      ) {
        bSelected = true
      }

      if (_seatData["exception_type"] != undefined && !bSelected) {
        bDisabled = true
      }

      data["list"].push({
        text: value.exception_name,
        selected: bSelected,
        exception_id: value.exception_id,
        details: value.details || [],
        disabled: bDisabled,
        event: value["event"] != undefined ? value["event"] : ""
      })
    })
    return data
  },
  getExceptionAllowed: function() {
    return _seatData.exception_allowed
  },
  setOrphanSearchAllowed: function(data) {
    _itemSearchEnabled = data
  },
  setLoginScannerAllowed: function(data) {
    _scannerLoginEnabled = data
  },
  setUnitConversionAllowed: function(data) {
    _unitConversionAllowed = data
  },
  setUOMConversionFactor: function(data) {
    _uomConversionFactor = data
  },
  setUOMDisplayUnit: function(data) {
    _uomDisplayUnit = data
  },
  loginScannerAllowed: function() {
    return _scannerLoginEnabled
  },
  isUnitConversionAllowed: function() {
    return _unitConversionAllowed
  },
  getUOMConversionFactor: function() {
    return _uomConversionFactor
  },
  getUOMDisplayUnit: function() {
    return _uomDisplayUnit
  },
  setBOIConfig: function(data) {
    _boiConfig = data
  },
  orphanSearchAllowed: function() {
    return _itemSearchEnabled
  },
  scanDetails: function() {
    _scanDetails = _seatData.scan_details
    return _scanDetails
  },
  cancelScanDetails: function() {
    return _seatData.cancel_scan_enabled
  },
  isReprintEnabled: function() {
    return _seatData.reprint_button_enabled
  },
  isReprintPopUpEnabled: function() {
    return _seatData.reprint_popup_enabled
  },
  getHeavyItemsFlag: function() {
    return _seatData.is_heavy ? _seatData.is_heavy : false
  },
  productDetails: function() {
    _prodDetails = _seatData.product_info
    return _prodDetails
  },

  getItemUid: function() {
    return _seatData.item_uid
  },

  getRackDetails: function() {
    if (_seatData.hasOwnProperty("rack_details")) {
      return _seatData.rack_details
    }
  },
  getRackType: function() {
    if (_seatData.hasOwnProperty("rack_details")) {
      if (_seatData.rack_details.rack_type === "mpsu") {
        return true
      }
    }
  },
  getDirectionDetails: function() {
    return _seatData.special_handling
  },

  getCurrentSelectedBin: function() {
    var binData = {}
    binData["structure"] = [1, 1]
    binData["ppsbin_list"] = []
    if (_seatData.ppsbin_list) {
      _seatData.ppsbin_list.map(function(value, index) {
        if (value.selected_state == true) binData["ppsbin_list"].push(value)
      })
    }
    return binData
  },
  getPutFrontCurrentBinCount: function() {
    var itemCount = null
    var currBin = null
    if (_seatData.ppsbin_list) {
      _seatData.ppsbin_list.map(function(value, index) {
        if (value.selected_state == true) {
          itemCount = parseInt(value.ppsbin_count || 0)
          currBin = value.ppsbin_id || "--"
          return true
        }
      })
    }
    return {
      count: itemCount,
      currBin: currBin
    }
  },
  tableCol: function(
    text,
    status,
    selected,
    size,
    border,
    grow,
    bold,
    disabled,
    centerAlign,
    type,
    buttonType,
    buttonStatus,
    mode,
    text_decoration,
    color,
    actionButton,
    borderBottom,
    textbox,
    totalWidth,
    id,
    management
  ) {
    this.text = text
    this.status = status
    this.selected = selected
    this.size = size
    this.border = border
    this.grow = grow
    this.bold = bold
    this.disabled = disabled
    this.centerAlign = centerAlign
    this.type = type
    this.buttonType = buttonType
    this.buttonStatus = buttonStatus
    this.borderBottom = borderBottom
    ;(this.mode = mode),
      (this.text_decoration = text_decoration),
      (this.color = color),
      (this.actionButton = actionButton),
      (this.textbox = textbox),
      (this.id = id),
      (this.management = management),
      (this.totalWidth = totalWidth)
  },
  getPptlData: function() {
    if (_seatData.hasOwnProperty("utility")) {
      var data = {}
      data["header"] = []
      if (appConstants.PPTL_MANAGEMENT == _seatData.screen_id) {
        data["header"].push(
          new this.tableCol(
            _("Bin ID"),
            "header",
            false,
            "small",
            false,
            true,
            true,
            false,
            false,
            true,
            true,
            false,
            "peripheral"
          )
        )
        data["header"].push(
          new this.tableCol(
            _("Barcode"),
            "header",
            false,
            "small",
            false,
            true,
            true,
            false,
            false,
            true,
            true,
            false,
            "peripheral"
          )
        )
        data["header"].push(
          new this.tableCol(
            _("Peripheral ID"),
            "header",
            false,
            "small",
            false,
            true,
            true,
            false,
            false,
            true,
            true,
            false,
            "peripheral"
          )
        )
        data["header"].push(
          new this.tableCol(
            _("Actions"),
            "header",
            false,
            "small",
            false,
            true,
            true,
            false,
            true,
            true,
            true,
            false,
            "peripheral"
          )
        )
        data["tableRows"] = []
        var self = this
        _seatData.utility.map(function(value, index) {
          var barcode = ""
          var peripheralId = ""
          if (value.hasOwnProperty("barcode")) {
            barcode = value.barcode
          }
          if (value.hasOwnProperty("peripheral_id")) {
            peripheralId = value.peripheral_id
          }
          var buttonText = _("Update")
          var deletButton = "Delete"
          if (barcode == "" && peripheralId == "") {
            buttonText = _("Add")
            deletButton = ""
          }
          var textBox = false
          if (
            (_action == _("Update") || _action == _("Add")) &&
            _binId == value.pps_bin_id
          ) {
            textBox = true
            buttonText = _("Finish")
          }
          data["tableRows"].push([
            new self.tableCol(
              value.pps_bin_id,
              "enabled",
              false,
              "small",
              false,
              false,
              false,
              false,
              false,
              true,
              true,
              false,
              "peripheral"
            ),
            new self.tableCol(
              barcode,
              "enabled",
              false,
              "small",
              true,
              false,
              false,
              false,
              false,
              "barcodePptl",
              true,
              false,
              "peripheral",
              false,
              null,
              false,
              true,
              textBox,
              true,
              value.pps_bin_id
            ),
            new self.tableCol(
              peripheralId,
              "enabled",
              false,
              "small",
              true,
              false,
              false,
              false,
              false,
              "peripheralId",
              true,
              false,
              "peripheral",
              false,
              null,
              false,
              true,
              textBox,
              true,
              value.pps_bin_id
            ),
            new self.tableCol(
              buttonText,
              "enabled",
              false,
              "small",
              true,
              false,
              false,
              false,
              true,
              true,
              true,
              false,
              "peripheral",
              true,
              "blue",
              true,
              true,
              false,
              true,
              value.pps_bin_id
            )
          ])
        })
      } else {
        data["header"].push(
          new this.tableCol(
            _("Scanner ID"),
            "header",
            false,
            "small",
            false,
            true,
            true,
            false,
            false,
            true,
            true,
            false,
            "peripheral",
            false,
            null,
            false,
            "",
            false,
            null,
            "scanner-id"
          )
        )
        data["header"].push(
          new this.tableCol(
            _("Actions"),
            "header",
            false,
            "small",
            false,
            false,
            true,
            false,
            true,
            true,
            true,
            false,
            "peripheral",
            false,
            null,
            false,
            "",
            false,
            null,
            "scanner-action"
          )
        )
        data["tableRows"] = []
        var self = this
        _seatData.utility.map(function(value, index) {
          data["tableRows"].push([
            new self.tableCol(
              value.peripheral_id,
              "enabled",
              false,
              "small",
              false,
              false,
              false,
              false,
              false,
              true,
              true,
              false,
              "peripheral",
              false,
              null,
              false,
              true,
              false,
              null,
              null,
              "scanner-id"
            ),
            new self.tableCol(
              _("Delete"),
              "enabled",
              false,
              "small",
              true,
              false,
              false,
              false,
              true,
              true,
              true,
              false,
              "peripheral",
              true,
              "blue",
              true,
              true,
              false,
              null,
              value.peripheral_id,
              "scanner-action"
            )
          ])
        })
      }
      return data
    }
  },
  getReconcileData: function() {
    if (_seatData.hasOwnProperty("reconciliation")) {
      var data = {}
      data["header"] = []
      data["header"].push(
        new this.tableCol(
          _("Tote Details"),
          "header",
          false,
          "small",
          false,
          true,
          true,
          false
        )
      )
      data["tableRows"] = []
      var self = this
      data["tableRows"].push([
        new this.tableCol(
          _("Product SKU"),
          "enabled",
          false,
          "small",
          false,
          true,
          true,
          false
        ),
        new this.tableCol(
          _("Expected Quantity"),
          "enabled",
          false,
          "small",
          true,
          false,
          true,
          false,
          true
        ),
        new this.tableCol(
          _("Actual Quantity"),
          "enabled",
          false,
          "small",
          true,
          false,
          true,
          false,
          true
        )
      ])
      _seatData.reconciliation.map(function(value, index) {
        data["tableRows"].push([
          new self.tableCol(
            value.product_sku,
            "enabled",
            false,
            "large",
            false,
            true,
            false,
            false
          ),
          new self.tableCol(
            value.expected_quantity,
            "enabled",
            false,
            "large",
            true,
            false,
            false,
            false,
            true
          ),
          new self.tableCol(
            value.actual_quantity,
            "enabled",
            false,
            "large",
            true,
            false,
            false,
            false,
            true
          )
        ])
      })
      return data
    }
  },

  getCurrentBoxSerialData: function() {
    return _seatData.Current_box_details
  },

  getCancelScanStatus: function() {
    return _seatData.Cancel_scan
  },
  getInfoButtonData: function() {
    return _seatData.info_button_data || null
  },
  getCustomContainerNames: function() {
    return _seatData.Possible_Container_Names || null
  },
  isAddlInfoPresent: function() {
    return _seatData.info_button_data &&
      Object.keys(_seatData.info_button_data).length
      ? true
      : false
  },
  isChangeUOMApplicable: function() {
    return _seatData.change_uom_applicable
  },
  getReconcileBoxSerialData: function() {
    var data = {}
    data["header"] = []
    data["tableRows"] = []
    var self = this
    var noScanMissing = 0
    var missingDamagedBoxSerials = ""
    var extraBoxSerials = ""
    var countMissingDamagedBoxSerials = 0
    if (!_seatData.k_deep_audit) {
      _seatData.Box_qty_list.map(function(value, index) {
        if (value.Scan_status == "no_scan") {
          missingDamagedBoxSerials =
            missingDamagedBoxSerials + value.Box_serial + " , "
          countMissingDamagedBoxSerials =
            value.Box_Expected_Qty -
            value.Box_Actual_Qty -
            value.Box_Damaged_Qty
        }
      })
      countMissingDamagedBoxSerials =
        countMissingDamagedBoxSerials < 0 ? 0 : countMissingDamagedBoxSerials
      missingDamagedBoxSerials = missingDamagedBoxSerials.replace(
        /,([^,]*)$/,
        "$1"
      )
      _seatData.Extra_box_list.map(function(value, index) {
        extraBoxSerials = extraBoxSerials + value.Box_serial + " "
      })
      if (
        missingDamagedBoxSerials != 0 ||
        _seatData.Extra_box_list.length != 0 ||
        _seatData["box_barcode_damage"] > 0
      ) {
        data["header"].push(
          new this.tableCol(
            _("Box Serial Numbers"),
            "header",
            false,
            "small",
            false,
            true,
            true,
            false
          )
        )
        data["header"].push(
          new this.tableCol(
            _("Missing"),
            "header",
            false,
            "small",
            false,
            false,
            true,
            false,
            true
          )
        )
        data["header"].push(
          new this.tableCol(
            _("Extra"),
            "header",
            false,
            "small",
            false,
            false,
            true,
            false,
            true
          )
        )
        data["header"].push(
          new this.tableCol(
            _("Unscannable"),
            "header",
            false,
            "small",
            false,
            false,
            true,
            false,
            true
          )
        )
      }
      if (missingDamagedBoxSerials != 0)
        data["tableRows"].push([
          new self.tableCol(
            missingDamagedBoxSerials,
            "enabled",
            false,
            "large",
            false,
            true,
            false,
            false
          ),
          new self.tableCol(
            Math.max(
              countMissingDamagedBoxSerials - _seatData["box_barcode_damage"],
              0
            ),
            "enabled",
            false,
            "large",
            true,
            false,
            false,
            false,
            true
          ),
          new self.tableCol(
            0,
            "enabled",
            false,
            "large",
            true,
            false,
            false,
            false,
            true
          ),
          new self.tableCol(
            _seatData["box_barcode_damage"],
            "enabled",
            false,
            "large",
            true,
            false,
            false,
            false,
            true
          )
        ])
      else if (
        _seatData["box_barcode_damage"] != undefined &&
        _seatData["box_barcode_damage"] >
          0 /*&& _seatData.Box_qty_list.length == 0*/
      ) {
        data["tableRows"].push([
          new self.tableCol(
            missingDamagedBoxSerials,
            "enabled",
            false,
            "large",
            false,
            true,
            false,
            false
          ),
          new self.tableCol(
            0,
            "enabled",
            false,
            "large",
            true,
            false,
            false,
            false,
            true
          ),
          new self.tableCol(
            0,
            "enabled",
            false,
            "large",
            true,
            false,
            false,
            false,
            true
          ),
          new self.tableCol(
            _seatData["box_barcode_damage"],
            "enabled",
            false,
            "large",
            true,
            false,
            false,
            false,
            true
          )
        ])
      }
      if (_seatData.Extra_box_list.length != 0)
        data["tableRows"].push([
          new self.tableCol(
            extraBoxSerials,
            "enabled",
            false,
            "large",
            false,
            true,
            false,
            false
          ),
          new self.tableCol(
            0,
            "enabled",
            false,
            "large",
            true,
            false,
            false,
            false,
            true
          ),
          new self.tableCol(
            _seatData.Extra_box_list.length,
            "enabled",
            false,
            "large",
            true,
            false,
            false,
            false,
            true
          ),
          new self.tableCol(
            0,
            "enabled",
            false,
            "large",
            true,
            false,
            false,
            false,
            true
          )
        ])
    }
    return data
  },

  getDamageReconcileData: function() {
    var data = {}
    data["header"] = []
    data["tableRows"] = []
    var self = this
    var packBarcodeDamagedQty = 0
    var subPackBarcodeDamagedQty = 0
    var eachBarcodeDamagedQty = 0
    var tableRows = []
    if (_seatData.k_deep_audit) {
      _seatData.box_barcode_damage.map(function(val, ind) {
        if (val.type === appConstants.OUTER_PACK)
          packBarcodeDamagedQty += val.damage_count
        else {
          subPackBarcodeDamagedQty += val.damage_count
        }
      })
      if (_seatData.loose_item_barcode_damage) {
        eachBarcodeDamagedQty = _seatData.loose_item_barcode_damage
      }
      if (
        _seatData.box_barcode_damage.length != 0 ||
        _seatData.loose_item_barcode_damage != 0
      ) {
        tableRows.push(
          new self.tableCol(
            _("Quantity"),
            "enabled",
            false,
            "large",
            false,
            true,
            false,
            false
          )
        )
        if (packBarcodeDamagedQty) {
          tableRows.push(
            new self.tableCol(
              packBarcodeDamagedQty,
              "enabled",
              false,
              "large",
              true,
              false,
              false,
              false,
              true
            )
          )
        }
        if (subPackBarcodeDamagedQty) {
          tableRows.push(
            new self.tableCol(
              subPackBarcodeDamagedQty,
              "enabled",
              false,
              "large",
              true,
              false,
              false,
              false,
              true
            )
          )
        }
        if (eachBarcodeDamagedQty) {
          tableRows.push(
            new self.tableCol(
              eachBarcodeDamagedQty,
              "enabled",
              false,
              "large",
              true,
              false,
              false,
              false,
              true
            )
          )
        }
        data["tableRows"].push(tableRows)
      }
      if (data["tableRows"].length > 0) {
        data["header"].push(
          new this.tableCol(
            _("Damage Barcode"),
            "header",
            false,
            "small",
            false,
            true,
            true,
            false
          )
        )
        if (packBarcodeDamagedQty) {
          data["header"].push(
            new this.tableCol(
              !_seatData.k_deep_audit
                ? _("Packs")
                : _seatData.Possible_Container_Names.container_level_2,
              "header",
              false,
              "small",
              false,
              false,
              true,
              false,
              true
            )
          )
        }
        if (subPackBarcodeDamagedQty) {
          data["header"].push(
            new this.tableCol(
              !_seatData.k_deep_audit
                ? _("Sub-Packs")
                : _seatData.Possible_Container_Names.container_level_1,
              "header",
              false,
              "small",
              false,
              false,
              true,
              false,
              true
            )
          )
        }
        if (eachBarcodeDamagedQty) {
          data["header"].push(
            new this.tableCol(
              !_seatData.k_deep_audit
                ? _("Eaches")
                : _seatData.Possible_Container_Names.container_level_0,
              "header",
              false,
              "small",
              false,
              false,
              true,
              false,
              true
            )
          )
        }
      }
    }
    return data
  },

  getFinalDamageReconcileData: function() {
    var data = {}
    data["header"] = []
    data["tableRows"] = []
    var self = this
    var packBarcodeDamagedQty = 0
    var subPackBarcodeDamagedQty = 0
    var eachBarcodeDamagedQty = 0
    var tableRows = []
    if (_seatData.k_deep_audit) {
      _seatData.final_damaged_boxes.map(function(val, ind) {
        if (val.uom_level === appConstants.OUTER_PACK)
          packBarcodeDamagedQty += val.damaged_qty
        else if (val.uom_level === appConstants.INNER_SUBPACK) {
          subPackBarcodeDamagedQty += val.damaged_qty
        } else {
          eachBarcodeDamagedQty += val.damaged_qty
        }
      })
      if (_seatData.final_damaged_boxes.length != 0) {
        tableRows.push(
          new self.tableCol(
            _("Quantity"),
            "enabled",
            false,
            "large",
            false,
            true,
            false,
            false
          )
        )
        if (packBarcodeDamagedQty) {
          tableRows.push(
            new self.tableCol(
              packBarcodeDamagedQty,
              "enabled",
              false,
              "large",
              true,
              false,
              false,
              false,
              true
            )
          )
        }
        if (subPackBarcodeDamagedQty) {
          tableRows.push(
            new self.tableCol(
              subPackBarcodeDamagedQty,
              "enabled",
              false,
              "large",
              true,
              false,
              false,
              false,
              true
            )
          )
        }
        if (eachBarcodeDamagedQty) {
          tableRows.push(
            new self.tableCol(
              eachBarcodeDamagedQty,
              "enabled",
              false,
              "large",
              true,
              false,
              false,
              false,
              true
            )
          )
        }
        data["tableRows"].push(tableRows)
      }
      if (data["tableRows"].length > 0) {
        data["header"].push(
          new this.tableCol(
            _("Entity Damaged"),
            "header",
            false,
            "small",
            false,
            true,
            true,
            false
          )
        )
        if (packBarcodeDamagedQty) {
          data["header"].push(
            new this.tableCol(
              !_seatData.k_deep_audit
                ? _("Packs")
                : _seatData.Possible_Container_Names.container_level_2,
              "header",
              false,
              "small",
              false,
              false,
              true,
              false,
              true
            )
          )
        }
        if (subPackBarcodeDamagedQty) {
          data["header"].push(
            new this.tableCol(
              !_seatData.k_deep_audit
                ? _("Sub-Packs")
                : _seatData.Possible_Container_Names.container_level_1,
              "header",
              false,
              "small",
              false,
              false,
              true,
              false,
              true
            )
          )
        }
        if (eachBarcodeDamagedQty) {
          data["header"].push(
            new this.tableCol(
              !_seatData.k_deep_audit
                ? _("Eaches")
                : _seatData.Possible_Container_Names.container_level_0,
              "header",
              false,
              "small",
              false,
              false,
              true,
              false,
              true
            )
          )
        }
      }
    }
    return data
  },

  getPackReconcileData: function() {
    var data = {}
    data["header"] = []
    data["tableRows"] = []
    var missingPackSerials = ""
    var extraPackSerials = ""
    var extraPackCounts = 0
    var self = this

    if (_seatData.k_deep_audit) {
      _seatData.Extra_box_list.map(function(value, index) {
        if (value.Type === appConstants.OUTER_PACK) {
          extraPackSerials = extraPackSerials + value.Box_serial + " "
          extraPackCounts = value.Box_Actual_Qty + extraPackCounts
        }
      })

      _seatData.Box_qty_list.map(function(value, index) {
        if (
          Math.max(
            value.Box_Expected_Qty -
              value.Box_Actual_Qty -
              value.Box_Damaged_Qty,
            0
          ) != 0 ||
          Math.max(value.Box_Actual_Qty - value.Box_Expected_Qty, 0) != 0
        ) {
          if (value.Type === appConstants.OUTER_PACK) {
            data["tableRows"].push([
              new self.tableCol(
                value.Type === appConstants.OUTER_PACK ? value.Box_serial : "-",
                "enabled",
                false,
                "large",
                false,
                true,
                false,
                false
              ),
              new self.tableCol(
                value.Type === appConstants.OUTER_PACK
                  ? Math.max(
                      value.Box_Expected_Qty -
                        value.Box_Actual_Qty -
                        value.Box_Damaged_Qty,
                      0
                    )
                  : 0,
                "enabled",
                false,
                "large",
                true,
                false,
                false,
                false,
                true
              ),
              new self.tableCol(
                value.Type === appConstants.OUTER_PACK
                  ? Math.max(value.Box_Actual_Qty - value.Box_Expected_Qty, 0)
                  : 0,
                "enabled",
                false,
                "large",
                true,
                false,
                false,
                false,
                true
              )
            ])
          }
        }
      })
      if (_seatData.Extra_box_list.length != 0)
        if (extraPackSerials != "") {
          data["tableRows"].push([
            new self.tableCol(
              extraPackSerials,
              "enabled",
              false,
              "large",
              false,
              true,
              false,
              false
            ),
            new self.tableCol(
              0,
              "enabled",
              false,
              "large",
              true,
              false,
              false,
              false,
              true
            ),
            new self.tableCol(
              extraPackCounts,
              "enabled",
              false,
              "large",
              true,
              false,
              false,
              false,
              true
            )
          ])
        }

      if (data["tableRows"].length > 0) {
        data["header"].push(
          new this.tableCol(
            _(_seatData.Possible_Container_Names.container_level_2),
            "header",
            false,
            "small",
            false,
            true,
            true,
            false
          )
        )
        data["header"].push(
          new this.tableCol(
            _("Missing"),
            "header",
            false,
            "small",
            false,
            false,
            true,
            false,
            true
          )
        )
        data["header"].push(
          new this.tableCol(
            _("Extra"),
            "header",
            false,
            "small",
            false,
            false,
            true,
            false,
            true
          )
        )
      }
    }
    return data
  },

  getSubPackReconcileData: function() {
    var data = {}
    data["header"] = []
    data["tableRows"] = []
    var missingPackSerials = ""
    var extraSubPackSerials = ""
    var extraSubPackCounts = 0
    var self = this

    if (_seatData.k_deep_audit) {
      _seatData.Extra_box_list.map(function(value, index) {
        if (value.Type === appConstants.INNER_SUBPACK) {
          extraSubPackSerials = extraSubPackSerials + value.Box_serial + " "
          extraSubPackCounts = value.Box_Actual_Qty + extraSubPackCounts
        }
      })

      _seatData.Box_qty_list.map(function(value, index) {
        if (
          Math.max(
            value.Box_Expected_Qty -
              value.Box_Actual_Qty -
              value.Box_Damaged_Qty,
            0
          ) != 0 ||
          Math.max(value.Box_Actual_Qty - value.Box_Expected_Qty, 0) != 0
        )
          if (value.Type === appConstants.INNER_SUBPACK) {
            data["tableRows"].push([
              new self.tableCol(
                value.Type === appConstants.INNER_SUBPACK
                  ? value.Box_serial
                  : "-",
                "enabled",
                false,
                "large",
                false,
                true,
                false,
                false
              ),
              new self.tableCol(
                value.Type === appConstants.INNER_SUBPACK
                  ? Math.max(
                      value.Box_Expected_Qty -
                        value.Box_Actual_Qty -
                        value.Box_Damaged_Qty,
                      0
                    )
                  : 0,
                "enabled",
                false,
                "large",
                true,
                false,
                false,
                false,
                true
              ),
              new self.tableCol(
                value.Type === appConstants.INNER_SUBPACK
                  ? Math.max(value.Box_Actual_Qty - value.Box_Expected_Qty, 0)
                  : 0,
                "enabled",
                false,
                "large",
                true,
                false,
                false,
                false,
                true
              )
            ])
          }
      })

      if (_seatData.Extra_box_list.length != 0)
        if (extraSubPackSerials) {
          data["tableRows"].push([
            new self.tableCol(
              extraSubPackSerials,
              "enabled",
              false,
              "large",
              false,
              true,
              false,
              false
            ),
            new self.tableCol(
              0,
              "enabled",
              false,
              "large",
              true,
              false,
              false,
              false,
              true
            ),
            new self.tableCol(
              extraSubPackCounts,
              "enabled",
              false,
              "large",
              true,
              false,
              false,
              false,
              true
            )
          ])
        }

      if (data["tableRows"].length > 0) {
        data["header"].push(
          new this.tableCol(
            _(_seatData.Possible_Container_Names.container_level_1),
            "header",
            false,
            "small",
            false,
            true,
            true,
            false
          )
        )
        data["header"].push(
          new this.tableCol(
            _("Missing"),
            "header",
            false,
            "small",
            false,
            false,
            true,
            false,
            true
          )
        )
        data["header"].push(
          new this.tableCol(
            _("Extra"),
            "header",
            false,
            "small",
            false,
            false,
            true,
            false,
            true
          )
        )
      }
    }
    return data
  },
  getItemInBoxReconcileData: function() {
    var data = {}
    data["header"] = []
    data["tableRows"] = []
    var self = this
    if (!_seatData.k_deep_audit) {
      _seatData.Box_qty_list.map(function(value, index) {
        if (value.Scan_status == "close") {
          var barcodeDamagedQty = 0
          _seatData.item_in_box_barcode_damage.map(function(val, ind) {
            if (value.Box_serial == val.Box_serial)
              barcodeDamagedQty = val.Damage_qty
          })
          if (
            Math.max(value.Expected_qty - value.Actual_qty, 0) != 0 ||
            Math.max(value.Actual_qty - value.Expected_qty, 0) != 0 ||
            barcodeDamagedQty != 0
          )
            data["tableRows"].push([
              new self.tableCol(
                value.Box_serial,
                "enabled",
                false,
                "large",
                false,
                true,
                false,
                false
              ),
              new self.tableCol(
                Math.max(
                  value.Expected_qty - value.Actual_qty - barcodeDamagedQty,
                  0
                ),
                "enabled",
                false,
                "large",
                true,
                false,
                false,
                false,
                true
              ),
              new self.tableCol(
                Math.max(value.Actual_qty - value.Expected_qty, 0),
                "enabled",
                false,
                "large",
                true,
                false,
                false,
                false,
                true
              ),
              new self.tableCol(
                barcodeDamagedQty,
                "enabled",
                false,
                "large",
                true,
                false,
                false,
                false,
                true
              )
            ])
        }
      })
      if (data["tableRows"].length > 0) {
        data["header"].push(
          new this.tableCol(
            _("Item in Box Serial Numbers"),
            "header",
            false,
            "small",
            false,
            true,
            true,
            false
          )
        )
        data["header"].push(
          new this.tableCol(
            _("Missing"),
            "header",
            false,
            "small",
            false,
            false,
            true,
            false,
            true
          )
        )
        data["header"].push(
          new this.tableCol(
            _("Extra"),
            "header",
            false,
            "small",
            false,
            false,
            true,
            false,
            true
          )
        )
        data["header"].push(
          new this.tableCol(
            _("Barcode Damage"),
            "header",
            false,
            "small",
            false,
            false,
            true,
            false,
            true
          )
        )
      }
    }
    return data
  },

  getLooseItemsData: function() {
    var data = {}
    var disabledStatus
    var containerNames = this.getContainerNames()
    disabledStatus = false
    data["header"] = []

    data["header"].push(
      new this.tableCol(
        !_seatData.k_deep_audit
          ? _("Loose Items")
          : containerNames["container_level_0"],
        "header",
        false,
        "small",
        false,
        true,
        true,
        false
      )
    )

    if (
      _seatData["show_expected_qty"] != undefined &&
      _seatData["show_expected_qty"] == true
    )
      data["header"].push(
        new this.tableCol(
          _("Expected"),
          "header",
          false,
          "small",
          false,
          false,
          true,
          false,
          true
        )
      )
    data["header"].push(
      new this.tableCol(
        _("Actual"),
        "header",
        false,
        "small",
        false,
        false,
        true,
        false,
        true
      )
    )
    data["tableRows"] = []
    var self = this
    var d = []
    if (_seatData.Sku_Item_List) {
      _seatData.Sku_Item_List.map(function(value, index) {
        d = []
        var itemExpectedQty = []
        var itemActualQty = []
        var itemList = value.Item_Qty_List
        if (itemList) {
          for (var i = 0, listLen = itemList.length; i < listLen; i++) {
            itemExpectedQty.push(itemList[i].Expected_qty)
            itemActualQty.push(itemList[i].Actual_Qty)
          }
        }
        d.push(
          new self.tableCol(
            value.Sku,
            "enabled",
            false,
            "large",
            false,
            true,
            false,
            disabledStatus
          )
        )
        if (
          _seatData["show_expected_qty"] != undefined &&
          _seatData["show_expected_qty"] == true
        )
          d.push(
            new self.tableCol(
              itemExpectedQty.toString(),
              "enabled",
              false,
              "large",
              true,
              false,
              false,
              disabledStatus,
              true
            )
          )
        d.push(
          new self.tableCol(
            itemActualQty.toString(),
            "enabled",
            _seatData.Current_box_details.length > 0 &&
            _seatData.Current_box_details[0]["Box_serial"] == null
              ? _seatData.Current_box_details[0]["Sku"] == value.Sku
              : false,
            "large",
            true,
            false,
            false,
            disabledStatus,
            true
          )
        )
        data["tableRows"].push(d)
      })
    }
    _seatData.extra_loose_sku_item_list.map(function(value, index) {
      d = []
      d.push(
        new self.tableCol(
          value.Sku,
          "extra",
          false,
          "large",
          false,
          true,
          false,
          false
        )
      )
      if (
        _seatData["show_expected_qty"] != undefined &&
        _seatData["show_expected_qty"] == true
      )
        d.push(
          new self.tableCol(
            value.Expected_qty,
            "enabled",
            false,
            "large",
            true,
            false,
            false,
            false,
            true
          )
        )
      d.push(
        new self.tableCol(
          value.Actual_qty,
          "actualqty",
          _seatData.Current_box_details.length > 0 &&
          _seatData.Current_box_details[0]["Box_serial"] == null
            ? _seatData.Current_box_details[0]["Sku"] == value.Sku
            : false,
          "large",
          true,
          false,
          false,
          false,
          true
        )
      )
      data["tableRows"].push(d)
    })

    return data
  },

  getFinishAuditFlag: function() {
    return _finishAuditFlag
  },
  getKDeepLooseItemsData: function() {
    return _seatData.Loose_sku_list || null
  },
  getSelectedUOM: function() {
    return _seatData.selected_uom || null
  },

  getReconcileLooseItemsData: function() {
    var data = {}
    data["header"] = []
    data["tableRows"] = []
    var self = this
    var totalLooseItemsMissing = 0
    var extraLooseItemsMissing = 0
    var c = 0
    var looseItemScreenName = _("Loose Items Serial Numbers")

    _seatData.Loose_sku_list.map(function(value, index) {
      if (
        Math.max(
          value.Expected_qty - value.Actual_qty - value.Damaged_qty,
          0
        ) != 0 ||
        Math.max(value.Actual_qty - value.Expected_qty, 0) != 0 ||
        _seatData.loose_item_barcode_damage != 0
      )
        c = c + 1
      if (_seatData.k_deep_audit) {
        looseItemScreenName = _seatData.Possible_Container_Names[value.Type]
      }
    })
    _seatData.extra_loose_sku_item_list.map(function(value, index) {
      if (
        Math.max(value.Expected_qty - value.Actual_qty, 0) != 0 ||
        Math.max(value.Actual_qty - value.Expected_qty, 0) != 0 ||
        _seatData.loose_item_barcode_damage != 0
      )
        c = c + 1
      if (_seatData.k_deep_audit) {
        looseItemScreenName = _seatData.Possible_Container_Names[value.Type]
      }
    })

    _seatData.Loose_sku_list.concat(_seatData.extra_loose_sku_item_list).map(
      function(value, index) {
        if (
          Math.max(
            value.Expected_qty - value.Actual_qty - value.Damaged_qty,
            0
          ) != 0 ||
          Math.max(value.Actual_qty - value.Expected_qty, 0) != 0
        ) {
          var tableRows = [
            new self.tableCol(
              value.Sku,
              "enabled",
              false,
              "large",
              false,
              true,
              false,
              false
            ),
            new self.tableCol(
              Math.max(
                value.Expected_qty - value.Actual_qty - value.Damaged_qty,
                0
              ),
              "enabled",
              false,
              "large",
              true,
              false,
              false,
              false,
              true
            ),
            new self.tableCol(
              Math.max(value.Actual_qty - value.Expected_qty, 0),
              "enabled",
              false,
              "large",
              true,
              false,
              false,
              false,
              true
            )
          ]
          if (!_seatData.k_deep_audit) {
            tableRows.push(
              new self.tableCol(
                index == (c % 2 == 0 ? c / 2 : (c + 1) / 2) - 1
                  ? _seatData.loose_item_barcode_damage
                  : "",
                "enabled",
                false,
                "large",
                true,
                false,
                false,
                false,
                true,
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                false
              )
            )
          }
          data["tableRows"].push(tableRows)
        }
      }
    )

    if (data["tableRows"].length > 0) {
      data["header"].push(
        new this.tableCol(
          looseItemScreenName,
          "header",
          false,
          "small",
          false,
          true,
          true,
          false
        )
      )
      data["header"].push(
        new this.tableCol(
          _("Missing"),
          "header",
          false,
          "small",
          false,
          false,
          true,
          false,
          true
        )
      )
      data["header"].push(
        new this.tableCol(
          _("Extra"),
          "header",
          false,
          "small",
          false,
          false,
          true,
          false,
          true
        )
      )
      if (!_seatData.k_deep_audit) {
        data["header"].push(
          new this.tableCol(
            _("Unscannable"),
            "header",
            false,
            "small",
            false,
            false,
            true,
            false,
            true
          )
        )
      }
    }

    return data
  },

  getToteId: function() {
    if (_seatData.hasOwnProperty("tote_id")) {
      return _seatData.tote_id
    } else {
      return null
    }
  },

  getItemDetailsData: function() {
    var data = {}
    data["header"] = []
    data["header"].push(
      new this.tableCol(
        _("Product Details"),
        "header",
        false,
        "small",
        false,
        true,
        true,
        false
      )
    )
    data["tableRows"] = []
    data["image_url"] = null
    var self = this
    if (
      _seatData.product_info != undefined &&
      Object.keys(_seatData.product_info).length > 0
    ) {
      var product_info_locale = {}
      var language_locale = sessionStorage.getItem("localeData")
      var locale
      if (language_locale == "null" || language_locale == null) {
        locale = "en-US"
      } else {
        locale = JSON.parse(language_locale)["data"]["locale"]
      }
      _seatData.product_info.map(function(value, index) {
        var keyValue

        for (var key in value[0]) {
          if (key != "display_data" && key != "product_local_image_url") {
            keyValue = value[0][key] + " "
          } else if (
            key != "display_data" &&
            key == "product_local_image_url"
          ) {
            data["image_url"] = value[0][key]
          }
        }
        value[0].display_data.map(function(data_locale, index1) {
          if (data_locale.locale == locale) {
            if (data_locale.display_name != "product_local_image_url") {
              product_info_locale[data_locale.display_name] = keyValue
            }
          }
        })
      })
      for (var key in product_info_locale) {
        if (product_info_locale.hasOwnProperty(key)) {
          data["tableRows"].push([
            new self.tableCol(
              key,
              "enabled",
              false,
              "small",
              false,
              true,
              false,
              false
            ),
            new self.tableCol(
              product_info_locale[key],
              "enabled",
              false,
              "small",
              false,
              true,
              false,
              false
            )
          ])
        }
      }
    } else {
      data["tableRows"].push([
        new self.tableCol(
          _("Product Name"),
          "enabled",
          false,
          "small",
          false,
          true,
          false,
          false
        ),
        new self.tableCol(
          "--",
          "enabled",
          false,
          "small",
          false,
          true,
          false,
          false
        )
      ])
      data["tableRows"].push([
        new self.tableCol(
          _("Product Desc"),
          "enabled",
          false,
          "small",
          false,
          true,
          false,
          false
        ),
        new self.tableCol(
          "--",
          "enabled",
          false,
          "small",
          false,
          true,
          false,
          false
        )
      ])
      data["tableRows"].push([
        new self.tableCol(
          _("Product SKU"),
          "enabled",
          false,
          "small",
          false,
          true,
          false,
          false
        ),
        new self.tableCol(
          "--",
          "enabled",
          false,
          "small",
          false,
          true,
          false,
          false
        )
      ])
      data["tableRows"].push([
        new self.tableCol(
          _("Product Type"),
          "enabled",
          false,
          "small",
          false,
          true,
          false,
          false
        ),
        new self.tableCol(
          "--",
          "enabled",
          false,
          "small",
          false,
          true,
          false,
          false
        )
      ])
    }

    return data
  },

  getScanDetails: function() {
    if (_seatData["scan_details"] == undefined) {
      var data = {
        scan_details: {
          current_qty: this.getkQQuanity(),
          total_qty: 0,
          kq_allowed: this.kQstatus()
        }
      }
      return data.scan_details
    } else {
      return _seatData["scan_details"]
    }
  },

  getDamagedBoxDetails: function() {
    if (_seatData["damaged_boxes"] !== undefined) {
      return _seatData["damaged_boxes"]
    }
  },

  setCancelButtonStatus: function(status) {
    _cancelButtonClicked = status
  },
  getCancelButtonStatus: function() {
    return _cancelButtonClicked
  },
  /*setAuditModalStatus: function(status){
        _cancelButtonClicked = status;
    },
    setAuditModalStatus: function(){
        _auditModalStatus = status;
    },*/

  getQuantityDetails: function() {
    var data = {
      scan_details: {
        current_qty: _seatData.per_item_print.print_done,
        kq_allowed: _seatData.enable_kq === true ? true : false,
        total_qty: _seatData.per_item_print.print_required
      }
    }
    return data.scan_details
  },
  kQstatus: function() {
    if (_seatData.hasOwnProperty("enable_kq")) {
      return _seatData.enable_kq
    } else {
      return true
    }
  },
  getGoodScanDetails: function() {
    if (_seatData["scan_details"] == undefined) {
      var data = {
        scan_details: {
          current_qty: _goodQuantity,
          total_qty: 0,
          kq_allowed: _seatData.enable_kq === true ? true : false
        }
      }
      return data.scan_details
    } else {
      return _seatData["scan_details"]
    }
  },

  getMissingScanDetails: function() {
    if (_seatData["scan_details"] == undefined) {
      var data = {
        scan_details: {
          current_qty: _missingQuantity,
          total_qty: 0,
          kq_allowed: _seatData.enable_kq === true ? true : false
        }
      }
      return data.scan_details
    } else {
      return _seatData["scan_details"]
    }
  },

  getDamagedScanDetails: function() {
    if (_seatData["scan_details"] == undefined) {
      var data = {
        scan_details: {
          current_qty: _damagedQuantity,
          total_qty: 0,
          kq_allowed: _seatData.enable_kq === true ? true : false
        }
      }
      return data.scan_details
    } else {
      return _seatData["scan_details"]
    }
  },
  getAuditDamagedCount: function() {
    if (_seatData.hasOwnProperty("damaged_boxes")) {
      return _seatData.damaged_boxes
    } else {
      return null
    }
  },
  getPhysicallyDamagedScanDetails: function() {
    if (_seatData["scan_details"] == undefined) {
      var data = {
        scan_details: {
          current_qty: _seatData["unmarked_container"]
            ? _damagedQuantity
            : _seatData["physically_damaged_items"].length,
          total_qty: 0,
          kq_allowed: _seatData.enable_kq === true ? true : false
        }
      }
      return data.scan_details
    } else {
      return _seatData["scan_details"]
    }
  },
  hideSpinner: function() {
    _showSpinner = false
  },
  setCurrentStationId: function(data){
    _currentStationId = data;
  },
  setCurrentSeat: function(data) {
    _seatData = data
    _currentSeat = "pick_front";
    _screenId = data.screen_id
  },
  getModalContent: function() {
    return modalContent.data
  },
  getSystemIdleState: function() {
    if (_seatData != undefined && _peripheralScreen == false) {
      return _seatData.is_idle
    } else if (_seatData != undefined && _peripheralScreen == true) {
      return false
    } else {
      return null
    }
  },

  getItemUid: function() {
    return _itemUid
  },
  getExceptionType: function() {
    return _exceptionType
  },
  getModalType: function() {
    return modalContent.type
  },
  setModalContent: function(data) {
    modalContent = data
  },

  getPPTLEvent: function() {
    switch (_currentSeat) {
      case appConstants.PUT_BACK:
        _pptlEvent = "secondary_button_press"
        break
      case appConstants.PUT_FRONT:
        _pptlEvent = "primary_button_press"
        break
      case appConstants.PICK_BACK:
        _pptlEvent = "secondary_button_press"
        break
      case appConstants.PICK_FRONT:
        _pptlEvent = "primary_button_press"
        break
      default:
      //return true;
    }
    return _pptlEvent
  },
  getCurrentSeat: function() {
    return _currentSeat
  },
  getCurrentStationId: function() {
    return _currentStationId
  },
  setServerMessages: function(data) {
    _messageJson = serverMessages
  },
  getServerMessages: function() {
    return _messageJson
  },
  changeLanguage: function(data) {
    var locale_data = {
      data: {
        locale: data
      }
    }
    switch (data) {
      case "ja-JP":
        _.setTranslation(japanese)
        break
      case "zh-ZH":
        _.setTranslation(chinese)
        break
      case "en-US":
        _.setTranslation(english)
        break
      case "he-IL":
        _.setTranslation(hebrew)
        break
      case "de-DE":
        _.setTranslation(german)
        break
      case "fr-FR":
        _.setTranslation(french)
        break
      case "es-ES":
        _.setTranslation(spanish)
        break
      case "nl":
        _.setTranslation(dutch)
        break
      default:
        return true
    }
    sessionStorage.setItem("localeData", JSON.stringify(locale_data))
  },
  postDataToInterface: function(data) {
    showModal = false
    //utils.postDataToInterface(data, _seatName)
    utils.postDataToInterface(data, _currentStationId)
  },
  postDataToTower: function(data) {
    showModal = false
    utils.postDataToTower(data, _seatName)
  },
  logError: function(data) {
    utils.logError(data)
  },
  getScreenId: function() {
    return _screenId
  },
  getPpsMode: function() {
    return _seatMode
  },
  getUsername: function() {
    return _username
  },
  getSeatType: function() {
    return _seatType
  },
  getSeatName: function() {
    return _seatName
  },
  enableException: function(data) {
    _KQQty = 0
    _activeException = null
    if (data == true) {
      _seatData["scan_allowed"] = false
    } else {
      _seatData["scan_allowed"] = true
    }

    _enableException = data
  },
  enableSearch: function(data) {
    _enableSearch = data
  },
  getExceptionStatus: function() {
    return _enableException
  },
  getItemSearchWindow: function() {
    return _enableSearch
  },

  setActiveException: function(data) {
    if (!data) {
      _activeException = null
    } else {
      _activeException = data
    }
  },
  getActiveException: function() {
    if (!_activeException) {
      return null
    } else {
      return _activeException
    }
  },
  setKQQuanity: function(data) {
    _KQQty = data
  },
  getDamagedQuantity: function() {
    return _damagedQuantity
  },
  setGoodQuanity: function(data) {
    _goodQuantity = data
  },
  setMissingQuanity: function(data) {
    _missingQuantity = data
  },
  setUnscannableQuanity: function(data) {
    _unscannableQuantity = data
  },
  setDamagedQuanity: function(data) {
    _damagedQuantity = data
  },
  getExeptionQuanity: function() {
    var data =
      _goodQuantity !== 0 ||
      _missingQuantity !== 0 ||
      _damagedQuantity !== 0 ||
      _unscannableQuantity !== 0
        ? false
        : true
    return data
  },
  getkQQuanity: function() {
    if (_seatData.hasOwnProperty("Current_box_details")) {
      if (_seatData.Current_box_details.length > 0) {
        _KQQty = _seatData.Current_box_details[0].Actual_qty
      }
      return _KQQty
    } else {
      return _KQQty
    }
  },

  getToteDetails: function() {
    if (_seatData.hasOwnProperty("tote_details")) {
      return _seatData.tote_details
    } else {
      return null
    }
  },

  setPutFrontExceptionScreen: function(data) {
    _putFrontExceptionScreen = data
    _seatData["notification_list"] = [
      {
        details: [],
        code: null,
        description: "",
        level: "info"
      }
    ]
  },

  setPutBackExceptionScreen: function(data) {
    _seatData.scan_allowed = false
    _putBackExceptionScreen = data
    _seatData["notification_list"] = [
      {
        details: [],
        code: null,
        description: "",
        level: "info"
      }
    ]
  },

  getPutBackExceptionScreen: function(data) {
    return _putBackExceptionScreen
  },
  getUnmarkedContainerFlag: function() {
    return _unmarkedContainer
  },
  setAuditExceptionScreen: function(data) {
    _seatData.scan_allowed = false
    _auditExceptionScreen = data
    _seatData["notification_list"] = [
      {
        details: [],
        code: null,
        description: "",
        level: "info"
      }
    ]
  },

  getAuditExceptionScreen: function(data) {
    return _auditExceptionScreen
  },
  getIRTFlagStatus: function(data) {
    return _seatData.irt_scan_enabled
  },
  getSearchExcessQty: function(data) {
    return _seatData.excess_quantity
  },

  setPickFrontExceptionScreen: function(data) {
    _seatData["notification_list"] = [
      {
        details: [],
        code: null,
        description: "",
        level: "info"
      }
    ]
    if (data == "pick_front_quantity") {
      if (_goodQuantity + _missingQuantity != _seatData["pick_quantity"]) {
        if (_seatData.notification_list.length == 0) {
          var data = {}
          data["code"] = resourceConstants.CLIENTCODE_011
          data["level"] = "error"
          data["type"] = appConstants.CLIENT_NOTIFICATION
          data["details"] = [_seatData["pick_quantity"]]
          _seatData.notification_list[0] = data
        } else {
          _seatData.notification_list[0].code = resourceConstants.CLIENTCODE_011
          _seatData.notification_list[0].details = [_seatData["pick_quantity"]]
          _seatData.notification_list[0].level = "error"
          _seatData.notification_list[0].type = appConstants.CLIENT_NOTIFICATION
        }
        _goodQuantity = 0
        _damagedQuantity = 0
        _missingQuantity = 0

        _pickFrontExceptionScreen = "good"
      } else {
        _pickFrontExceptionScreen = data
      }
    } else if (data == "damaged_or_missing") {
      if (_goodQuantity === _seatData["pick_quantity"]) {
        if (_seatData.notification_list.length == 0) {
          var data = {}
          data["code"] = resourceConstants.CLIENTCODE_017
          data["level"] = "error"
          data["type"] = appConstants.CLIENT_NOTIFICATION
          data["details"] = [_seatData["pick_quantity"]]
          _seatData.notification_list[0] = data
        } else {
          _seatData.notification_list[0].code = resourceConstants.CLIENTCODE_017
          _seatData.notification_list[0].details = [_seatData["pick_quantity"]]
          _seatData.notification_list[0].level = "error"
          _seatData.notification_list[0].type = appConstants.CLIENT_NOTIFICATION
        }
        _goodQuantity = 0
        _damagedQuantity = 0
        _missingQuantity = 0

        _pickFrontExceptionScreen = "good"
      } else if (
        _goodQuantity + _missingQuantity !=
        _seatData["pick_quantity"]
      ) {
        if (_seatData.notification_list.length == 0) {
          var data = {}
          data["code"] = resourceConstants.CLIENTCODE_011
          data["level"] = "error"
          data["type"] = appConstants.CLIENT_NOTIFICATION
          data["details"] = [_seatData["pick_quantity"]]
          _seatData.notification_list[0] = data
        } else {
          _seatData.notification_list[0].code = resourceConstants.CLIENTCODE_011
          _seatData.notification_list[0].details = [_seatData["pick_quantity"]]
          _seatData.notification_list[0].level = "error"
          _seatData.notification_list[0].type = appConstants.CLIENT_NOTIFICATION
        }
        _goodQuantity = 0
        _damagedQuantity = 0
        _missingQuantity = 0

        _pickFrontExceptionScreen = "good"
      } else {
        _pickFrontExceptionScreen = data
      }
    } else {
      _pickFrontExceptionScreen = data
    }
  },

  getPutFrontExceptionScreen: function() {
    return _putFrontExceptionScreen
  },

  getPickFrontExceptionScreen: function() {
    return _pickFrontExceptionScreen
  },

  getSRStatus: function() {
    return _seatData.k_deep_audit
  },
  getCurrentSlot: function() {
    if (_seatData.hasOwnProperty("rack_details")) {
      return _seatData.rack_details.slot_barcodes
    } else {
      return null
    }
  },
  getContainerNames: function() {
    if (_seatData.hasOwnProperty("rack_details")) {
      return _seatData.Possible_Container_Names
    } else {
      return null
    }
  },
  _getBinMapDetails: function() {
    return _seatData ? _seatData.group_info : null
  },
  _getBinMapOrientation: function() {
    return _seatData ? _seatData.operator_orientation || 0 : null
  },

  _getMtuDetails: function() {
    var nSlots, mtuList, currentSlotId, selectedSlotId
    nSlots = 0
    selectedSlotId = 0
    mtuList = []
    if (_seatData && _seatData.group_info) {
      nSlots = Object.keys(_seatData.group_info).length
    }
    if (_seatData && _seatData.active_group) {
      selectedSlotId = _seatData.active_group - 1
    }
    for (currentSlotId = 0; currentSlotId < nSlots; currentSlotId++) {
      mtuList.push(currentSlotId === selectedSlotId ? true : false)
    }
    return mtuList
  },
  _getSplitScreenFlag: function() {
    if (_seatData.hasOwnProperty("group_info")) {
      var navData = _seatData.group_info || {}
      for (var key in navData) {
        if (navData[key] != resourceConstants.BIN_GROUP_CENTER) {
          return true
        }
      }
    }
    return false
  },
  _getMobileFlag: function() {
    var bIsMobile = false
    if (_seatData) {
      bIsMobile =
        _seatData.roll_cage_flow && _currentSeat == appConstants.PUT_FRONT
    }
    return bIsMobile
  },

  _getDockedGroup: function() {
    return _seatData && _seatData.docked ? Object.keys(_seatData.docked) : []
  },
  _getUndockAwaitedGroup: function() {
    return _seatData && _seatData.undock_awaited
      ? Object.keys(_seatData.undock_awaited)
      : []
  },
  _getWrongUndockGroup: function() {
    return _seatData && _seatData.wrong_undock
      ? Object.keys(_seatData.wrong_undock)
      : []
  },
  _getOrigBinUse: function() {
    return _seatData && _seatData.bin_coordinate_plotting ? true : false
  },
  _getReleaseActiveStatus: function() {
    return _seatData && _seatData.release_mtu ? true : false
  },
  _getDamagedItemsData: function() {
    var data = {}
    data["header"] = []
    data["footer"] = []
    data["header"].push(
      new this.tableCol(
        _("Type"),
        "header",
        false,
        "small",
        false,
        true,
        true,
        false
      )
    )
    data["header"].push(
      new this.tableCol(
        _("SKU"),
        "header",
        false,
        "small",
        false,
        true,
        true,
        false
      )
    )
    data["header"].push(
      new this.tableCol(
        _("Serial"),
        "header",
        false,
        "small",
        false,
        true,
        true,
        false
      )
    )
    data["header"].push(
      new this.tableCol(
        _("Quantity"),
        "header",
        false,
        "small",
        false,
        true,
        true,
        false
      )
    )

    data["footer"].push(
      new this.tableCol(
        _(""),
        "header",
        false,
        "small",
        false,
        true,
        true,
        false
      )
    )
    data["tableRows"] = []
    data["image_url"] = null
    var self = this

    if (
      _seatData.physically_damaged_items &&
      _seatData.physically_damaged_items.length > 0
    ) {
      type = _seatData.physically_damaged_items[0].type
      serial = _seatData.physically_damaged_items[0].serial
      if (serial.length === 0) {
        serial = "-"
      } else {
        for (let j = 0; j < serial.length; j++) {
          if (serial[j].length > 10) {
            serial[j] = serial[j].slice(0, 5) + "..." + serial[j].slice(-5)
          }
        }
      }

      var product_details,
        product_sku,
        type,
        serial,
        quantity,
        total_damaged = 0
      _seatData.physically_damaged_items.map(function(value, index) {
        value.product_info.map(function(product_details, index) {
          if (product_details[0].product_sku) {
            product_sku = product_details[0].product_sku
            quantity = value.qty
            total_damaged += quantity
            serial = value.serial
            data["tableRows"].push([
              new self.tableCol(
                type,
                "enabled",
                false,
                "small",
                false,
                true,
                false,
                false
              ),
              new self.tableCol(
                product_sku,
                "enabled",
                false,
                "small",
                false,
                true,
                false,
                false
              ),
              new self.tableCol(
                serial,
                "enabled",
                false,
                "small",
                false,
                true,
                false,
                false
              ),
              new self.tableCol(
                quantity,
                "enabled",
                false,
                "small",
                false,
                true,
                false,
                false
              )
            ])
          }
        })
      })
      data["footer"].push(
        new this.tableCol(
          _("Total: ") + total_damaged + _(" items"),
          "header",
          false,
          "small",
          false,
          true,
          true,
          false
        )
      )
    } else {
      data["tableRows"].push([
        new self.tableCol(
          _("-"),
          "enabled",
          false,
          "small",
          false,
          true,
          false,
          false
        ),
        new self.tableCol(
          "-",
          "enabled",
          false,
          "small",
          false,
          true,
          false,
          false
        ),
        new self.tableCol(
          "-",
          "enabled",
          false,
          "small",
          false,
          true,
          false,
          false
        ),
        new self.tableCol(
          "-",
          "enabled",
          false,
          "small",
          false,
          true,
          false,
          false
        )
      ])
      data["footer"].push(
        new this.tableCol(
          _("Total: "),
          "header",
          false,
          "small",
          false,
          true,
          true,
          false
        )
      )
    }
    return data
  },
  _getExcessItemsData: function() {
    var data = {}
    data["header"] = []
    data["footer"] = []
    data["header"].push(
      new this.tableCol(
        _("Product SKU"),
        "header",
        false,
        "small",
        false,
        true,
        true,
        false
      )
    )
    data["header"].push(
      new this.tableCol(
        _("Excess Quantity"),
        "header",
        false,
        "small",
        false,
        true,
        true,
        false
      )
    )
    data["footer"].push(
      new this.tableCol(
        _(""),
        "header",
        false,
        "small",
        false,
        true,
        true,
        false
      )
    )
    data["tableRows"] = []
    data["image_url"] = null
    var self = this
    if (
      _seatData.excess_items &&
      Object.keys(_seatData.excess_items).length > 0
    ) {
      var product_details,
        product_sku,
        quantity,
        total_excess = 0
      _seatData.excess_items.map(function(value, index) {
        value.product_info.map(function(product_details, index) {
          if (product_details[0].product_sku) {
            product_sku = product_details[0].product_sku
            quantity = value.qty
            total_excess += quantity
            data["tableRows"].push([
              new self.tableCol(
                product_sku,
                "enabled",
                false,
                "small",
                false,
                true,
                false,
                false
              ),
              new self.tableCol(
                quantity,
                "enabled",
                false,
                "small",
                false,
                true,
                false,
                false
              )
            ])
          }
        })
      })
      data["footer"].push(
        new this.tableCol(
          _("Total: ") + total_excess + _(" items"),
          "header",
          false,
          "small",
          false,
          true,
          true,
          false
        )
      )
    } else {
      data["tableRows"].push([
        new self.tableCol(
          _("--"),
          "enabled",
          false,
          "small",
          false,
          true,
          false,
          false
        ),
        new self.tableCol(
          "-",
          "enabled",
          false,
          "small",
          false,
          true,
          false,
          false
        )
      ])
      data["footer"].push(
        new this.tableCol(
          _("Total: "),
          "header",
          false,
          "small",
          false,
          true,
          true,
          false
        )
      )
    }
    return data
  },
  _getDamagedItemsDataForAudit: function() {
    var _damagedQuantity = 0
    var data = {}
    data["header"] = []
    data["footer"] = []
    data["header"].push(
      new this.tableCol(
        _("Type"),
        "header",
        false,
        "small",
        false,
        true,
        true,
        false,
        true
      )
    )
    data["header"].push(
      new this.tableCol(
        _("SKU"),
        "header",
        false,
        "small",
        false,
        true,
        true,
        false,
        true
      )
    )
    data["header"].push(
      new this.tableCol(
        _("Serial"),
        "header",
        false,
        "small",
        false,
        true,
        true,
        false,
        true
      )
    )
    data["header"].push(
      new this.tableCol(
        _("Quantity"),
        "header",
        false,
        "small",
        false,
        true,
        true,
        false,
        true
      )
    )
    data["footer"].push(
      new this.tableCol(
        _(""),
        "header",
        false,
        "small",
        false,
        true,
        true,
        false
      )
    )
    data["footer"].push(
      new this.tableCol(
        _(""),
        "header",
        false,
        "small",
        false,
        true,
        true,
        false
      )
    )
    data["footer"].push(
      new this.tableCol(
        _(""),
        "header",
        false,
        "small",
        false,
        true,
        true,
        false
      )
    )
    data["tableRows"] = []
    data["image_url"] = null
    var self = this
    if (_seatData.damaged_boxes && _seatData.damaged_boxes.length > 0) {
      var isKQEnabled,
        product_details,
        product_sku,
        type,
        serial,
        quantity,
        total_damaged = 0
      _seatData.damaged_boxes.map(function(value, index) {
        type = value.uom_level
        product_sku = value.sku
        serial = value.serial === "undefined" ? "--" : value.serial
        quantity = value.damaged_qty //value.qty;
        isKQEnabled = value.enable_kq_row
        total_damaged = mainstore.getDamagedQuantity()

        data["tableRows"].push([
          new self.tableCol(
            type,
            "enabled",
            false,
            "small",
            false,
            true,
            false,
            false,
            true,
            true,
            "shoshowUOMDropDownwUOM",
            false,
            "verticalAlign"
          ),
          new self.tableCol(
            product_sku,
            "enabled",
            false,
            "small",
            false,
            true,
            false,
            false,
            true,
            true,
            true,
            true,
            "verticalAlign"
          ),
          new self.tableCol(
            serial,
            "enabled",
            false,
            "small",
            false,
            true,
            false,
            false,
            true,
            true,
            true,
            true,
            "verticalAlign"
          ),
          new self.tableCol(
            quantity,
            "enabled",
            false,
            "small",
            false,
            true,
            false,
            false,
            true,
            true,
            "showKQRow",
            isKQEnabled,
            "verticalAlign"
          )
        ])
        //text, status, selected, size, border, grow, bold, disabled, centerAlign, type, buttonType, buttonStatus, mode, text_decoration, color, actionButton, borderBottom, textbox, totalWidth, id, management
      })
      data["footer"].push(
        new this.tableCol(
          _("Total: ") + total_damaged + _(" entities"),
          "header",
          false,
          "small",
          false,
          true,
          true,
          false
        )
      )
    } else {
      var isKQEnabled = false
      data["tableRows"].push([
        new self.tableCol(
          _("--"),
          "enabled",
          false,
          "small",
          false,
          true,
          false,
          false,
          true,
          true,
          "shoshowUOMDropDownwUOM",
          false,
          "verticalAlign"
        ),
        new self.tableCol(
          "--",
          "enabled",
          false,
          "small",
          false,
          true,
          false,
          false,
          true,
          true,
          true,
          true,
          "verticalAlign"
        ),
        new self.tableCol(
          "--",
          "enabled",
          false,
          "small",
          false,
          true,
          false,
          false,
          true,
          true,
          true,
          true,
          "verticalAlign"
        ),
        new self.tableCol(
          "--",
          "enabled",
          false,
          "small",
          false,
          true,
          false,
          false,
          true,
          true,
          "showKQRow",
          isKQEnabled,
          "verticalAlign"
        )
      ])
      data["footer"].push(
        new this.tableCol(
          _("Total: ") + _(" 0 entities"),
          "header",
          false,
          "small",
          false,
          true,
          true,
          false
        )
      )
    }
    return data
  },
  _getExcessExceptionFlag: function() {
    if (
      _seatData.excess_items != undefined &&
      Object.keys(_seatData.excess_items).length > 0
    ) {
      return false
    }
    return true
  },
  _getWareHouseExceptionFlag: function() {
    if (_seatData.exception_type === "warehousefull_exception") {
      return false
    }
    return true
  },
  _getDamagedExceptionFlag: function() {
    if (
      _seatData.physically_damaged_items != undefined &&
      _seatData.physically_damaged_items.length !== 0
    ) {
      return false
    }
    return true
  },
  _getUnmarkedContainerFlag: function() {
    return _seatData.unmarked_container
  },
  _getBinFullStatus: function() {
    return _seatData && _seatData.bin_full_allowed ? true : false
  },
  _getSelectedPpsBin: function() {
    var ppsbin_list =
      _seatData && _seatData.ppsbin_list ? _seatData.ppsbin_list : []
    var bId = null
    ppsbin_list.forEach(function(bin) {
      if (bin["selected_state"]) {
        bId = bin["ppsbin_id"]
      }
    })
    return bId
  },
  getProductSerial: function() {
    var serial_data = _seatData.serial
    return serial_data.length > 0
      ? utils.get3dotTrailedText(serial_data[0], 4, 4, 10)
      : null
  },
  getSelectedBinGroup: function() {
    var ppsbin_list =
      _seatData && _seatData.ppsbin_list ? _seatData.ppsbin_list : []
    var groupId = null
    ppsbin_list.forEach(function(el) {
      if (el["selected_state"]) {
        groupId = el["group_id"]
        return false
      }
    })
    return groupId
  },
  validateAndSendDataToServer: function() {
    var flag = false,
      type = false,
      binFullQty = false
    var details
    if (
      _seatData.screen_id ==
        appConstants.PICK_FRONT_MISSING_DAMAGED_UNSCANNABLE_ENTITY ||
      _seatData.screen_id ==
        appConstants.PICK_FRONT_MISSING_OR_UNSCANNABLE_DAMAGED_PACK ||
      _seatData.screen_id ==
        appConstants.PICK_FRONT_MISSING_OR_UNSCANNABLE_DAMAGED_SUBPACK
    ) {
      if (
        _goodQuantity === _seatData.pick_quantity &&
        _unscannableQuantity === 0
      ) {
        flag = type = true
      } else {
        flag =
          _goodQuantity + _missingQuantity + _damagedQuantity !=
          _seatData.pick_quantity
        details = _seatData.pick_quantity
      }
    } else if (
      _seatData.screen_id ==
      appConstants.PUT_FRONT_MISSING_DAMAGED_UNSCANNABLE_ENTITY
    ) {
      if (_goodQuantity == _seatData.put_quantity) {
        flag = type = true
      } else {
        flag =
          _goodQuantity +
            _missingQuantity +
            _damagedQuantity +
            _unscannableQuantity !=
          _seatData.put_quantity
        details = _seatData.put_quantity
      }
    } else if (
      _seatData.screen_id == appConstants.PICK_FRONT_MORE_ITEM_SCAN ||
      _seatData.screen_id == appConstants.PICK_FRONT_PPTL_PRESS ||
      _seatData.screen_id == appConstants.PICK_FRONT_PACKING_ITEM_SCAN
    ) {
      if (_KQQty > _seatData.scan_details.total_qty) {
        flag = binFullQty = true
        details = _seatData.scan_details.total_qty
      }
    } else {
      flag =
        _goodQuantity + _missingQuantity + _damagedQuantity !=
        _seatData.put_quantity
      details = _seatData.put_quantity
    }
    if (flag) {
      if (_seatData.notification_list.length == 0) {
        var data = {}
        data["code"] = binFullQty
          ? resourceConstants.CLIENTCODE_012
          : type
          ? resourceConstants.CLIENTCODE_017
          : _seatData.screen_id ===
            appConstants.PICK_FRONT_MISSING_DAMAGED_UNSCANNABLE_ENTITY
          ? resourceConstants.CLIENTCODE_018
          : resourceConstants.CLIENTCODE_010
        data["level"] = "error"
        data["type"] = appConstants.CLIENT_NOTIFICATION
        data["details"] = [details]
        _seatData.notification_list[0] = data
      } else {
        _seatData.notification_list[0].code = binFullQty
          ? resourceConstants.CLIENTCODE_012
          : type
          ? resourceConstants.CLIENTCODE_017
          : _seatData.screen_id ===
            appConstants.PICK_FRONT_MISSING_DAMAGED_UNSCANNABLE_ENTITY
          ? resourceConstants.CLIENTCODE_018
          : resourceConstants.CLIENTCODE_010
        _seatData.notification_list[0].details = [details]
        _seatData.notification_list[0].level = "error"
        _seatData.notification_list[0].type = appConstants.CLIENT_NOTIFICATION
        _seatData.notification_list[0].saltParams = {
          module: binFullQty ? appConstants.BIN_FULL : _seatData.screen_id
        }
      }
      if (
        _seatData.screen_id !=
          appConstants.PICK_FRONT_MISSING_DAMAGED_UNSCANNABLE_ENTITY &&
        _seatData.screen_id !=
          appConstants.PUT_FRONT_MISSING_DAMAGED_UNSCANNABLE_ENTITY &&
        _seatData.screen_id !=
          appConstants.PICK_FRONT_MISSING_OR_UNSCANNABLE_DAMAGED_PACK &&
        _seatData.screen_id !=
          appConstants.PICK_FRONT_MISSING_OR_UNSCANNABLE_DAMAGED_SUBPACK
      ) {
        _putFrontExceptionScreen = "good"
        _damagedQuantity = 0
        _missingQuantity = 0
      }
    } else {
      var data = {}
      if (
        _seatData.screen_id ==
          appConstants.PICK_FRONT_MISSING_DAMAGED_UNSCANNABLE_ENTITY ||
        _seatData.screen_id ==
          appConstants.PUT_FRONT_MISSING_DAMAGED_UNSCANNABLE_ENTITY ||
        _seatData.screen_id ==
          appConstants.PICK_FRONT_MISSING_OR_UNSCANNABLE_DAMAGED_PACK ||
        _seatData.screen_id ==
          appConstants.PICK_FRONT_MISSING_OR_UNSCANNABLE_DAMAGED_SUBPACK
      ) {
        data["event_name"] =
          _seatData.screen_id ===
            appConstants.PICK_FRONT_MISSING_DAMAGED_UNSCANNABLE_ENTITY ||
          _seatData.screen_id ===
            appConstants.PICK_FRONT_MISSING_OR_UNSCANNABLE_DAMAGED_PACK ||
          _seatData.screen_id ===
            appConstants.PICK_FRONT_MISSING_OR_UNSCANNABLE_DAMAGED_SUBPACK
            ? "pick_front_exception"
            : "put_front_exception"
        data["event_data"] = {}
        data["event_data"]["action"] = "confirm_quantity_update"
        data["event_data"]["event"] = _seatData.exception_type
        data["event_data"]["quantity"] = {}
        data["event_data"]["quantity"]["good"] = _goodQuantity
        data["event_data"]["quantity"]["unscannable"] = _unscannableQuantity
        data["event_data"]["quantity"]["missing"] = _missingQuantity
        data["event_data"]["quantity"]["damaged"] = _damagedQuantity
        data["source"] = "ui"
        _damagedQuantity = 0
        _missingQuantity = 0
        _unscannableQuantity = 0
        this.showSpinner()
        utils.postDataToInterface(data, _seatData.seat_name)
      } else {
        data["event_name"] = appConstants.CONFIRM_BIN_FULL_REQUEST
        data["event_data"] = {}
        data["event_data"]["quantity"] = mainstore.getkQQuanity()
        data["source"] = "ui"
        utils.postDataToInterface(data, _seatData.seat_name)
      }
    }
  },

  validateAndSendSpaceUnavailableDataToServer: function() {
    var _allowedQuantity
    _allowedQuantity =
      _seatData.put_quantity > 0 ? _seatData.put_quantity - 1 : 0
    if (_KQQty === _seatData.put_quantity) {
      var data = {}
      data["code"] = resourceConstants.CLIENTCODE_012
      data["level"] = "error"
      data["type"] = appConstants.CLIENT_NOTIFICATION
      data["details"] = [_allowedQuantity]
      _seatData.notification_list[0] = data
    } else if (_KQQty > _allowedQuantity) {
      if (_seatData.notification_list.length == 0) {
        var data = {}
        data["code"] = resourceConstants.SERVERMSGCODE_007
        data["level"] = "error"
        data["type"] = appConstants.CLIENT_NOTIFICATION
        data["details"] = [_allowedQuantity]
        _seatData.notification_list[0] = data
      } else {
        _seatData.notification_list[0].code =
          resourceConstants.SERVERMSGCODE_007
        _seatData.notification_list[0].details = [_allowedQuantity]
        _seatData.notification_list[0].level = "error"
        _seatData.notification_list[0].type = appConstants.CLIENT_NOTIFICATION
      }
      _goodQuantity = 0
    } else {
      var data = {}
      data["event_name"] = "put_front_exception"
      data["event_data"] = {}
      data["event_data"]["action"] = "confirm_quantity_update"
      data["event_data"]["event"] = _seatData.exception_type
      data["event_data"]["quantity"] = _KQQty
      data["source"] = "ui"
      this.showSpinner()
      utils.postDataToInterface(data, _seatData.seat_name)
    }
  },
  validateUnmarkedDamagedData: function() {
    var _allowedQuantity
    _allowedQuantity = _seatData.put_quantity ? _seatData.put_quantity : 0
    if (_damagedQuantity > _allowedQuantity) {
      if (_seatData.notification_list.length == 0) {
        var data = {}
        data["code"] = resourceConstants.CLIENTCODE_012
        data["level"] = "error"
        data["type"] = appConstants.CLIENT_NOTIFICATION
        data["details"] = [_allowedQuantity]
        _seatData.notification_list[0] = data
      } else {
        _seatData.notification_list[0].code = resourceConstants.CLIENTCODE_012
        _seatData.notification_list[0].details = [_allowedQuantity]
        _seatData.notification_list[0].level = "error"
        _seatData.notification_list[0].type = appConstants.CLIENT_NOTIFICATION
      }
      _damagedQuantity = 0
    } else {
      var data = {}
      if (_seatData.unmarked_container) {
        data["event_name"] = "put_front_exception"
        data["event_data"] = {}
        data["event_data"]["action"] = "confirm_quantity_update"
        data["event_data"]["event"] = _seatData.exception_type
        data["event_data"]["quantity"] = _damagedQuantity
        data["source"] = "ui"
      } else {
        data["event_name"] = "put_front_exception"
        data["event_data"] = {}
        data["event_data"]["action"] = "finish_exception"
        data["event_data"]["event"] = _seatData.exception_type
        data["source"] = "ui"
      }

      this.showSpinner()
      utils.postDataToInterface(data, _seatData.seat_name)
    }
  },

  getToteException: function() {
    if (_seatData.hasOwnProperty("exception_msg")) {
      return _seatData.exception_msg[0]
    } else {
      return null
    }
  },
  getDrawerFlag: function() {
    if (_seatData.rack_details) {
      return _seatData.rack_details.slot_type === "drawer" ? true : false
    }
  },
  getSRKQQuantity: function() {
    if (_seatData["scan_details"] == undefined) {
      var data = {
        scan_details: {
          current_qty: _seatData.Current_box_details[0]
            ? _seatData.Current_box_details[0].Box_Actual_Qty
            : 0,
          total_qty: 0,
          kq_allowed:
            _seatData.enable_kq === true ? true : false /* BSS-10640 */
        }
      }
      return data.scan_details
    } else {
      return _seatData["scan_details"]
    }
  },
  getSlotType: function() {
    if (_seatData.rack_details) {
      return _seatData.rack_details.slot_type
        ? _seatData.rack_details.slot_type
        : "none"
    }
  },
  getPeripheralData: function(data) {
    _seatData.scan_allowed = false
    utils.getPeripheralData(data, _seatData.seat_name)
  },
  getOrphanItemData: function(data) {
    _seatData.scan_allowed = true
    utils.getOrphanItemData(data, _seatData.seat_name)
  },
  getBOIConfigData: function(data) {
    utils.getBOIConfig()
  },
  getItemData: function() {
    if (_seatData.utility) return _seatData.utility
  },
  getLoaderStatus: function() {
    if (_seatData.loader) return _seatData.loader
  },
  getDynamicColumnWidth: function() {
    var rowconfig = []
    if (_seatData.utility.length) {
      var noOfCol = Object.keys(_seatData.utility[_seatData.utility.length - 1])

      if (noOfCol.length == 5)
        rowconfig = [
          { width: "10%" },
          { width: "25%" },
          { width: "15%" },
          {
            width: "40%",
            "justify-content": "flex-start",
            "padding-left": "50px"
          },
          { width: "10%" }
        ]
      else
        rowconfig = [
          { width: "15%" },
          { width: "25%" },
          { width: "15%" },
          {
            width: "45%",
            "justify-content": "flex-start",
            "padding-left": "50px"
          }
        ]
    }
    return rowconfig
  },
  updateSeatData: function(data, type, status, method) {
    var dataNotification = {}

    if (type === "pptl") {
      _seatData["screen_id"] = appConstants.PPTL_MANAGEMENT
      if (_seatData["header_steps"]) {
        _seatData["header_steps"] = undefined
      }
      _peripheralScreen = true
    } else if (type === "barcode_scanner") {
      _seatData["screen_id"] = appConstants.SCANNER_MANAGEMENT
      if (_seatData["header_steps"]) {
        _seatData["header_steps"] = undefined
      }
      _peripheralScreen = true
    } else if (type === "orphanSearch" || type === "orphanSearchStart") {
      _seatData["screen_id"] = appConstants.ITEM_SEARCH_RESULT
      _peripheralScreen = true
    } else if (type === "BOI_CONFIG") {
      if (data.enable_conversion) {
        this.setUnitConversionAllowed(data.enable_conversion)
        this.setUOMConversionFactor(data.dims_conversion_factor)
        this.setUOMDisplayUnit(data.dims_display_uom)
      }
      this.setBOIConfig(data || null)
      this.updateSeatData(
        (data && data.item_search_enabled) || false,
        "ITEM_SEARCH_CONFIG"
      )
      this.updateSeatData(
        (data && data.login_scanner_enabled) || false,
        "LOGIN_SCANNER_CONFIG"
      )
      this.updateSeatData(
        (data && data.enable_conversion) || false,
        "ENABLE_UNIT_CONVERSION"
      )
    } else if (type === "ITEM_SEARCH_CONFIG") {
      this.setOrphanSearchAllowed(data)
    } else if (type === "LOGIN_SCANNER_CONFIG") {
      this.setLoginScannerAllowed(data)
    } else if (type == "itemSearch") {
      _seatData["screen_id"] = appConstants.ITEM_SEARCH
      _peripheralScreen = true
    }

    if (status == "success") {
      if (method == "POST")
        dataNotification["code"] = resourceConstants.CLIENTCODE_006
      else dataNotification["code"] = resourceConstants.CLIENTCODE_015
      dataNotification["level"] = "info"
      this.generateNotification(dataNotification)
    } else if (status == "fail") {
      if (method == "POST")
        dataNotification["code"] = resourceConstants.CLIENTCODE_007
      else dataNotification["code"] = resourceConstants.CLIENTCODE_016
      dataNotification["level"] = "error"
      this.generateNotification(dataNotification)
    } else if (status == "409") {
      dataNotification["code"] = resourceConstants.CLIENTCODE_409_PERIPHERAL
      dataNotification["level"] = "error"
      this.generateNotification(dataNotification)
    } else if (status == "400") {
      dataNotification["code"] = resourceConstants.CLIENTCODE_400
      dataNotification["level"] = "error"
      this.generateNotification(dataNotification)
    } else {
      if (_seatData && _seatData.notification_list.length > 0) {
        _seatData.notification_list[0]["code"] = null
        _seatData.notification_list[0].description = ""
      }
    }
    if (_seatData) {
      _seatData["utility"] = data
      _seatData["loader"] = data === true ? true : false
      this.setCurrentSeat(_seatData)
    }
    console.log(_seatData)
  },

  getUtility: function() {
    return _utility
  },
  convert_textbox: function(action, index) {
    _action = action
    _binId = index
  },
  update_peripheral: function(data, method, index) {
    utils.updatePeripherals(data, method, _seatName)
  },
  generateNotification: function(data) {
    if (_seatData.notification_list.length > 0) {
      _seatData.notification_list[0]["code"] = data.code
      _seatData.notification_list[0].level = data.level
      _seatData.notification_list[0].type = appConstants.CLIENT_NOTIFICATION
    } else {
      var notification_list = {
        code: data.code,
        level: data.level,
        details: [],
        description: "",
        type: appConstants.CLIENT_NOTIFICATION
      }
      _seatData.notification_list[0] = notification_list
    }
  },
  getHeaderMessg: function(data) {
    if (_seatData && _seatData.header_msge_list) {
      return _seatData.header_msge_list[0]
    }
  },

  getInvoiceStatus: function(data) {
    if (_seatData.invoice_required) {
      var invoiceData = { invoiceFlag: true, invoiceId: _seatData.invoice_id }
      return invoiceData
    } else {
      return null
    }
  },

  getInvoiceType: function(data) {
    if (_seatData.invoice_type) {
      return _seatData.invoice_type
    }
  },

  getKQQuantity: function() {
    if (_seatData["scan_details"] == undefined) {
      var data = {
        scan_details: {
          current_qty: _seatData.Current_box_details[0]
            ? _seatData.Current_box_details[0].Actual_qty
            : 0,
          total_qty: 0,
          kq_allowed: _seatData.enable_kq === true ? true : false
        }
      }
      return data.scan_details
    } else {
      return _seatData["scan_details"]
    }
  },
  getBinCoordinatePlotting: function() {
    if (_seatData.hasOwnProperty("bin_coordinate_plotting"))
      return _seatData.bin_coordinate_plotting
  },

  getCurrentMtu: function(){
    if (_seatData.hasOwnProperty("selected_dock_station_label"))
      return _seatData.selected_dock_station_label
  },

  isToteFlowEnabled: function(){
    if (_seatData.hasOwnProperty("is_flow_scan_totes"))
      return _seatData.is_flow_scan_totes
  },

  getStageButtonHideStatus: function() {
    if (_seatData.hasOwnProperty("auto_stage")) return _seatData.auto_stage
  },
  getUDPMapDetails: function() {
    var ppsBinIds = {}
    var ppsBinIdColors = {}
    var leftBins = []
    var rightBins = []
    var centerBins = []
    if (_seatData["ppsbin_list"]) {
      _seatData["ppsbin_list"].forEach(function(bin) {
        if (bin["direction"] === "left") {
          leftBins.push(bin)
        } else if (bin["direction"] === "right") {
          rightBins.push(bin)
        } else if (bin["direction"] === "center") {
          centerBins.push(bin)
        }
      })
      leftBins.sort(function(a, b) {
        return (
          (a["orig_coordinate"] || a["coordinate"])[1] -
          (b["orig_coordinate"] || b["coordinate"])[1]
        )
      })
      rightBins.sort(function(a, b) {
        return (
          (a["orig_coordinate"] || a["coordinate"])[1] -
          (b["orig_coordinate"] || b["coordinate"])[1]
        )
      })
      centerBins.sort(function(a, b) {
        return (
          (a["orig_coordinate"] || a["coordinate"])[1] -
          (b["orig_coordinate"] || b["coordinate"])[1]
        )
      })

      leftBins = leftBins.concat(rightBins, centerBins)
      leftBins.forEach(function(bin) {
        ppsBinIds[bin["ppsbin_id"]] = bin["direction"]
      })
      leftBins.forEach(function(bin) {
        ppsBinIdColors[bin["ppsbin_id"]] = bin["ppsbin_light_color"]
      })
    }
    return {
      ppsBinIds: ppsBinIds,
      ppsBinIdColors: ppsBinIdColors
    }
  },

  getDockStationList: function() {
    var ppsBinIds = {}
    var ppsBinIdColors = {}
    var leftBins = []
    var rightBins = []
    var centerBins = []
    var centerTopBins = []
    if (_seatData["dock_station_list"]) {
      _seatData["dock_station_list"].forEach(function(bin) {
        if (bin["direction"] === "left") {
          leftBins.push(bin)
        } else if (bin["direction"] === "right") {
          rightBins.push(bin)
        } else if (bin["direction"] === "center") {
          centerBins.push(bin)
        } else if (bin["direction"] === "top") {
          centerTopBins.push(bin)
        }
      })
      leftBins = leftBins.concat(rightBins, centerBins, centerTopBins)
      leftBins.forEach(function(bin) {
        ppsBinIds[bin["dock_station_label"]] = bin["direction"]
      })
      leftBins.forEach(function(bin) {
        ppsBinIdColors[bin["dock_station_label"]] = bin["ppsbin_light_color"]
      })
    }
    return {
      ppsBinIds: ppsBinIds,
      ppsBinIdColors: ppsBinIdColors
    }
  },

  getDockedList: function() {
    var dockedGroup = []
    if (_seatData["dock_station_list"]) {
      _seatData["dock_station_list"].forEach(function(bin) {
        if (bin["status"] === "docked") {
          dockedGroup.push(bin["dock_station_label"])
        }
      })
    }
    return dockedGroup
  },
  getUndockAwaitedList: function() {
    var undockAwaited = []
    if (_seatData["dock_station_list"]) {
      _seatData["dock_station_list"].forEach(function(bin) {
        if (bin["status"] === "undock_awaited") {
          undockAwaited.push(bin["dock_station_label"])
        }
      })
    }
    return undockAwaited
  },

  getPrintReadyList: function() {
    var printReady = []
    if (_seatData["dock_station_list"]) {
      _seatData["dock_station_list"].forEach(function(bin) {
        if (bin["status"] === "print_ready") {
          printReady.push(bin["dock_station_label"])
        }
      })
    }
    return printReady
  },

  getWrongUndockList: function() {
    var wrongUndockList = []
    if (_seatData["dock_station_list"]) {
      _seatData["dock_station_list"].forEach(function(bin) {
        if (bin["status"] === "wrong_undock") {
          wrongUndockList.push(bin["dock_station_label"])
        }
      })
    }
    return wrongUndockList
  },

  getMissingItemList: function() {
    return _seatData["missing_items"] || []
  },
  getPreviousPutDetails: function() {
    return _seatData.previous_put_details || []
  },
  getPreviousPickDetails: function() {
    return _seatData.previous_pick_details
  },
  getSelectedTotes: function() {
    var selectedTotes = []
    if (_seatData["ppsbin_list"]) {
      _seatData["ppsbin_list"].forEach(function(bin) {
        if (bin.totes_associated === "true") {
          selectedTotes.push(bin["ppsbin_id"])
        }
      })
    }
    return selectedTotes
  },
  _getSelectedBinID: function() {
    var selectedBin = []
    if (_seatData["ppsbin_list"]) {
      _seatData["ppsbin_list"].forEach(function(bin) {
        if (bin.selected_state) {
          selectedBin.push(bin["ppsbin_id"])
        }
      })
    }
    return selectedBin
  },

  _getRollCageStatus: function() {
    var rollCageStatus = false
    if (_seatData) {
      rollCageStatus =
        _seatData.roll_cage_flow && _currentSeat == appConstants.PICK_FRONT
    }
    return rollCageStatus
  },

  getScreenData: function() {
    var data = {}

    //since OrigBinUse Flag is needed in all the screens.
    data["OrigBinUse"] = this._getOrigBinUse()
    data["SeatType"] = this.getSeatType()
    data["ppsMode"] = this.getPpsMode()
    data["username"] = this.getUsername()

    switch (_screenId) {
      case appConstants.PICK_FRONT_WAITING_FOR_MSU:
        data["PickFrontNavData"] = this.getNavData()
        data["PickFrontServerNavData"] = this.getServerNavData()
        data["PickFrontScreenId"] = this.getScreenId()
        data["PickFrontExceptionData"] = this.getExceptionData()
        data["PickFrontNotification"] = this.getNotificationData()
        data["PickFrontExceptionStatus"] = this.getExceptionStatus()
        data[
          "PickFrontChecklistOverlayStatus"
        ] = this.getChecklistOverlayStatus()
        data["PreviousDetails"] = this.getPreviousPickDetails()
        data["rollCageStatus"] = this._getRollCageStatus()
        data["groupOrientation"] = this._getBinMapOrientation()
        data["BinMapDetails"] = this._getBinMapDetails()
        data["UndockAwaited"] = this._getUndockAwaitedGroup()
        data["DockedGroup"] = this._getDockedGroup()
        break

      case appConstants.PICK_FRONT_SKIP_TOTE:
      case appConstants.PICK_FRONT_DOCK_TOTE:
        data["PickFrontNavData"] = this.getNavData()
        data["PickFrontServerNavData"] = this.getServerNavData()
        data["PickFrontScreenId"] = this.getScreenId()
        data["PickFrontExceptionData"] = this.getExceptionData()
        data["PickFrontNotification"] = this.getNotificationData()
        data["PickFrontExceptionStatus"] = this.getExceptionStatus()
        ;(data["udpBinMapDetails"] = this.getUDPMapDetails()),
          (data["groupOrientation"] = this._getBinMapOrientation()),
          (data["selectedTotes"] = this.getSelectedTotes())
        data["PickCurrentBin"] = this._getSelectedBinID()
        data["PickFrontChecklistData"] = this.getChecklistDockData()
        data["PickFrontChecklistIndex"] = this.getChecklistDockIdx()
        data["PickFrontCancelScan"] = this.cancelScanDetails()
        data["PickFrontSkipDockingBtnEnable"] = this.getButtonStatus()
        break

      case appConstants.UNIVERSAL_DOCK_UNDOCK:
        data["PickBackNavData"] = this.getNavData()
        data["PickBackNotification"] = this.getNotificationData()
        data["PickBackScreenId"] = this.getScreenId()
        data["PickBackServerNavData"] = this.getServerNavData()
        data["PickBackExceptionStatus"] = this.getExceptionStatus()
        data["PickBackExceptionData"] = this.getExceptionData()
        data["pickBackCancelButtonData"] = this.cancelScanDetails()
        data["SplitScreenFlag"] = this._getSplitScreenFlag()
        data["isPrinterVisible"] = this.getPrinterVisibility()
        data["printerInfo"] = this.getPrinterInfo()
        data["dockHeader"] = this.getDockHeader()
        data["dockChecklistData"] = this.getChecklistDockUndockData(
          "dock_actions"
        )
        data["dockChecklistIndex"] = this.getChecklistDockUndockIndex(
          "dock_index"
        )

        data["undockHeader"] = this.getUnDockHeader()
        data["undockChecklistData"] = this.getChecklistDockUndockData(
          "undock_actions"
        )
        data["undockChecklistIndex"] = this.getChecklistDockUndockIndex(
          "undock_index"
        )

        data["udpBinMapDetails"] = this.getDockStationList()
        data["DockedGroup"] = this.getDockedList()
        data["UndockAwaited"] = this.getUndockAwaitedList()
        data["PrintReady"] = this.getPrintReadyList()
        data["WrongUndock"] = this.getWrongUndockList()
        break

        case appConstants.WAIT_FOR_MTU:
        case appConstants.SELECT_MTU_POINT:
       // data["PickFrontExceptionData"] = this.getExceptionData()
       // data["PickFrontExceptionStatus"] = this.getExceptionStatus()
        data["PickFrontNavData"] = this.getNavData()
        data["PickFrontServerNavData"] = this.getServerNavData()
        //data["PickFrontNotification"] = this.getNotificationData()
        data["PickFrontScreenId"] = this.getScreenId()
        //data["groupOrientation"] = this._getBinMapOrientation()

        data["udpBinMapDetails"] = this.getDockStationList()
        // data["DockedGroup"] = this.getDockedList()
        // data["UndockAwaited"] = this.getUndockAwaitedList()
        // data["PrintReady"] = this.getPrintReadyList()
        // data["WrongUndock"] = this.getWrongUndockList()
        // data["selectedTotes"] = this.getSelectedTotes()
        // data["PickCurrentBin"] = this._getSelectedBinID()
        // data["PreviousDetails"] = this.getPreviousPickDetails()
        // data["SlotType"] = this.getSlotType()
        // data["isDrawer"] = this.getDrawerFlag()
        // data["PickFrontRackDetails"] = this.getRackDetails()
        // data["PickFrontProductDetails"] = this.productDetails()
        // data["undockAwaited"] = this._getUndockAwaitedGroup()
        break;
        
      case appConstants.REMOVE_ALL_TOTES:
          data["PickFrontNavData"] = this.getNavData()
          data["PickFrontServerNavData"] = this.getServerNavData()
          data["PickFrontScreenId"] = this.getScreenId()
          data["PickFrontRackDetails"] = this.getRackDetails()
          data["udpBinMapDetails"] = this.getDockStationList()
          data["getCurrentMtu"] = this.getCurrentMtu()
          data["isToteFlowEnabled"]  = this.isToteFlowEnabled()
          // data["PickFrontNotification"] = this.getNotificationData()
          break;

        case appConstants.SCAN_EMPTY_TOTE:
            data["PickFrontNavData"] = this.getNavData()
            data["PickFrontServerNavData"] = this.getServerNavData()
            data["PickFrontScreenId"] = this.getScreenId()
            data["SlotType"] = this.getSlotType()
            data["PickFrontRackDetails"] = this.getRackDetails()
            data["udpBinMapDetails"] = this.getDockStationList()
            data["getCurrentMtu"] = this.getCurrentMtu()
            data["PickFrontNotification"] = this.getNotificationData()
            break;

      case appConstants.SCAN_EMPTY_SLOT:
        data["PickFrontNavData"] = this.getNavData()
        data["PickFrontServerNavData"] = this.getServerNavData()
        data["PickFrontScreenId"] = this.getScreenId()
        data["SlotType"] = this.getSlotType()
        data["PickFrontRackDetails"] = this.getRackDetails()
        data["udpBinMapDetails"] = this.getDockStationList()
        data["getCurrentMtu"] = this.getCurrentMtu()
        data["PickFrontNotification"] = this.getNotificationData()
        break;
        
      case appConstants.PICK_FRONT_SLOT_SCAN:
        data["PickFrontNavData"] = this.getNavData()
        data["PickFrontServerNavData"] = this.getServerNavData()
        data["PickFrontScreenId"] = this.getScreenId()
        data["PickFrontRackDetails"] = this.getRackDetails()
        data["SlotType"] = this.getSlotType()
        data["PickFrontExceptionData"] = this.getExceptionData()
        data["PickFrontNotification"] = this.getNotificationData()
        data["PickFrontExceptionStatus"] = this.getExceptionStatus()
        data["PickFrontCarryingUnitBtnEnable"] = this.getButtonStatus()
        break

      case appConstants.PICK_FRONT_UNDOCK_TOTE:
        data["PickFrontExceptionData"] = this.getExceptionData()
        data["PickFrontExceptionStatus"] = this.getExceptionStatus()
        data["PickFrontNotification"] = this.getNotificationData()
        data["PickFrontNavData"] = this.getNavData()
        data["PickFrontServerNavData"] = this.getServerNavData()
        data["PickFrontScreenId"] = this.getScreenId()
        data["groupOrientation"] = this._getBinMapOrientation()
        data["udpBinMapDetails"] = this.getUDPMapDetails()
        data["selectedTotes"] = this.getSelectedTotes()
        data["PickCurrentBin"] = this._getSelectedBinID()
        data["undockAwaited"] = this._getUndockAwaitedGroup()

        break

      case appConstants.PICK_FRONT_PACKING_CONTAINER_SCAN:
        data["PickFrontBoxOrderDetails"] = this.getOrderDetails()
        data["PickFrontNotification"] = this.getNotificationData()

      case appConstants.PICK_FRONT_CONTAINER_SCAN:
        data["PickFrontNavData"] = this.getNavData()
        data["PickFrontServerNavData"] = this.getServerNavData()
        data["PickFrontScreenId"] = this.getScreenId()
        data["PickFrontBoxDetails"] = this.getBoxDetails()
        data["PickFrontRackDetails"] = this.getRackDetails()
        data["SlotType"] = this.getSlotType()
        data["PickFrontExceptionData"] = this.getExceptionData()
        data["PickFrontNotification"] = this.getNotificationData()
        data["PickFrontExceptionStatus"] = this.getExceptionStatus()
        data[
          "PickFrontChecklistOverlayStatus"
        ] = this.getChecklistOverlayStatus()
        break
      case appConstants.PICK_FRONT_PACKING_ITEM_SCAN:
        data["PickFrontPackingButtonType"] = this.getPickFrontButtonType()
        data["PickFrontPackingButtonDisable"] = this.getPickFrontButtonStatus()
        data[
          "PickFrontPackingCancelStatus"
        ] = this.getPickFrontPackingCancelStatus()
        data["PickFrontBoxOrderDetails"] = this.getOrderID()
        data["PickFrontNotification"] = this.getNotificationData()

      case appConstants.PICK_FRONT_MORE_ITEM_SCAN:
      case appConstants.PICK_FRONT_WORKING_TABLE:
        data["PickFrontNavData"] = this.getNavData()
        data["PickFrontServerNavData"] = this.getServerNavData()
        data["PickFrontScreenId"] = this.getScreenId()
        data["PickFrontScanDetails"] = this.scanDetails()
        data["PickFrontChecklistDetails"] = this.getChecklistDetails()
        data["PickFrontChecklistIndex"] = this.getChecklistIndex()
        data["PickFrontSlotDetails"] = this.getCurrentSlot()
        data["SplitScreenFlag"] = this._getSplitScreenFlag()
        data["printerInfo"] = this.getPrinterInfo()
        data["isPrinterVisible"] = this.getPrinterVisibility()
        data["BinMapDetails"] = this._getBinMapDetails()
        data["BinMapGroupDetails"] = this.getSelectedBinGroup()
        data["PickFrontBinData"] = this.getBinData()
        data["PickFrontScanDetails"] = this.scanDetails()
        data["PickFrontProductDetails"] = this.productDetails()
        data["PickFrontItemUid"] = this.getItemUid()
        data["PickFrontExceptionData"] = this.getExceptionData()
        data["PickFrontNotification"] = this.getNotificationData()
        data["PickFrontExceptionStatus"] = this.getExceptionStatus()
        data[
          "PickFrontChecklistOverlayStatus"
        ] = this.getChecklistOverlayStatus()
        data["SplitScreenFlag"] = this._getSplitScreenFlag()
        data["PickFrontButtonType"] = this.getPickFrontButtonType()
        data["PickFrontButtonStatus"] = this.getPickFrontButtonStatus()
        data["PickFrontCancelScan"] = this.cancelScanDetails()
        data["PickFrontReprintEnabled"] = this.isReprintEnabled()
        data["PickFrontReprintPopUp"] = this.isReprintPopUpEnabled()
        break

      case appConstants.PICK_FRONT_PACKING_BOX:
        data["PickFrontNavData"] = this.getNavData()
        data["PickFrontServerNavData"] = this.getServerNavData()
        data["PickFrontScreenId"] = this.getScreenId()
        data["PickFrontScanDetails"] = this.scanDetails()
        data["PickFrontChecklistDetails"] = this.getChecklistDetails()
        data["PickFrontChecklistIndex"] = this.getChecklistIndex()
        data["PickFrontSlotDetails"] = this.getCurrentSlot()
        data["BinMapDetails"] = this._getBinMapDetails()
        data["BinMapGroupDetails"] = this.getSelectedBinGroup()
        data["PickFrontBinData"] = this.getBinData()
        data["PickFrontScanDetails"] = this.scanDetails()
        data["PickFrontProductDetails"] = this.productDetails()
        data["PickFrontItemUid"] = this.getItemUid()
        data["PickFrontExceptionData"] = this.getExceptionData()
        data["PickFrontNotification"] = this.getNotificationData()
        data["PickFrontExceptionStatus"] = this.getExceptionStatus()
        data[
          "PickFrontChecklistOverlayStatus"
        ] = this.getChecklistOverlayStatus()
        data["SplitScreenFlag"] = this._getSplitScreenFlag()
        data["PickFrontButtonType"] = this.getPickFrontButtonType()
        data["PickFrontButtonStatus"] = this.getPickFrontButtonStatus()
        data["PickFrontCancelScan"] = this.cancelScanDetails()
        data["PickFrontPackingBoxType"] = this.getPackingBoxType()
        break

      case appConstants.PER_ITEM_PRINT:
        data["PickFrontNavData"] = this.getNavData()
        data["PickFrontServerNavData"] = this.getServerNavData()
        data["PickFrontScreenId"] = this.getScreenId()
        data["BinMapDetails"] = this._getBinMapDetails()
        data["PickFrontExceptionData"] = this.getExceptionData()
        data["BinMapGroupDetails"] = this.getSelectedBinGroup()
        data["PrintScanDetails"] = this.getQuantityDetails()
        data["PickCurrentBin"] = this.getCurrentSelectedBin()
        data["SplitScreenFlag"] = this._getSplitScreenFlag()
        data["PrintCancelScan"] = this.cancelScanDetails()
        data["PickFrontExceptionStatus"] = this.getExceptionStatus()
        data["PickFrontNotification"] = this.getNotificationData()
        break

      case appConstants.PICK_FRONT_REPRINT_EXCEPTION:
        data["PickFrontNavData"] = this.getNavData()
        data["PickFrontServerNavData"] = this.getServerNavData()
        data["PickFrontScreenId"] = this.getScreenId()
        data["PickFrontExceptionData"] = this.getExceptionData()
        data["PickFrontNotification"] = this.getNotificationData()
        break

      case appConstants.PICK_FRONT_SCAN_PACKS:
        data["PickFrontNavData"] = this.getNavData()
        data["PickFrontServerNavData"] = this.getServerNavData()
        data["PickFrontScreenId"] = this.getScreenId()
        data["PickFrontExceptionData"] = this.getExceptionData()
        data["PickFrontBoxOrderDetails"] = this.getOrderDetails()
        data["PickFrontBinData"] = this.getBinData()
        data["BinMapDetails"] = this._getBinMapDetails()
        data["BinMapGroupDetails"] = this.getSelectedBinGroup()
        data["PickFrontScanDetails"] = this.scanDetails()
        data["PickFrontProductDetails"] = this.productDetails()
        data["PickFrontItemUid"] = this.getItemUid()
        data["SplitScreenFlag"] = this._getSplitScreenFlag()
        data["PickFrontNotification"] = this.getNotificationData()
        data["PickFrontExceptionStatus"] = this.getExceptionStatus()
        data["PickFrontRackDetails"] = this.getRackDetails()
        data["PickFrontProductDetails"] = this.productDetails()
        data["PickFrontRackTypeMPU"] = this.getRackType()
        break
      case appConstants.PICK_FRONT_PACKING_PPTL_PRESS:
        data["PickFrontPackingButtonType"] = this.getPickFrontButtonType()
        data["PickFrontPackingButtonDisable"] = this.getPickFrontButtonStatus()
        data["PickFrontNotification"] = this.getNotificationData()

      case appConstants.PICK_FRONT_PPTL_PRESS:
        data["PickFrontNavData"] = this.getNavData()
        data["PickFrontServerNavData"] = this.getServerNavData()
        data["PickFrontScreenId"] = this.getScreenId()
        data["PickFrontScanDetails"] = this.scanDetails()
        data["PickFrontProductDetails"] = this.productDetails()
        data["PickFrontCancelScan"] = this.cancelScanDetails()
        data["PickFrontChecklistDetails"] = this.getChecklistDetails()
        data["PickFrontChecklistIndex"] = this.getChecklistIndex()
        data["PickFrontSlotDetails"] = this.getCurrentSlot()
        data["PickFrontBinData"] = this.getBinData()
        data["PickFrontExceptionData"] = this.getExceptionData()
        data["PickFrontNotification"] = this.getNotificationData()
        data["PickFrontExceptionStatus"] = this.getExceptionStatus()
        data["PickFrontSearchStatus"] = this.getItemSearchWindow()
        data[
          "PickFrontChecklistOverlayStatus"
        ] = this.getChecklistOverlayStatus()
        data["BinMapDetails"] = this._getBinMapDetails()
        data["PickFrontButtonType"] = this.getPickFrontButtonType()
        data["PickFrontButtonStatus"] = this.getPickFrontButtonStatus()
        data["SplitScreenFlag"] = this._getSplitScreenFlag()
        data["BinMapGroupDetails"] = this.getSelectedBinGroup()
        data["PickFrontItemUid"] = this.getItemUid()
        data["PickFrontReprintEnabled"] = this.isReprintEnabled()
        data["PickFrontReprintPopUp"] = this.isReprintPopUpEnabled()
        data["printerInfo"] = this.getPrinterInfo()
        data["isPrinterVisible"] = this.getPrinterVisibility()
        break
      case appConstants.ITEM_SEARCH:
        data["PickFrontScreenId"] = this.getScreenId()
        data["PutBackScreenId"] = this.getScreenId()
        data["PutFrontScreenId"] = this.getScreenId()
        data["PickBackScreenId"] = this.getScreenId()
        data["AuditScreenId"] = this.getScreenId()
        data["PrePutScreenId"] = this.getScreenId()

        break
      case appConstants.ITEM_SEARCH_RESULT:
        data["PickFrontScreenId"] = this.getScreenId()
        data["PutBackScreenId"] = this.getScreenId()
        data["PutFrontScreenId"] = this.getScreenId()
        data["PickBackScreenId"] = this.getScreenId()
        data["AuditScreenId"] = this.getScreenId()
        data["PrePutScreenId"] = this.getScreenId()
        data["ItemSearchData"] = this.getItemData()
        data["rowconfig"] = this.getDynamicColumnWidth()
        data["loaderState"] = this.getLoaderStatus()
        break

      default:
    }
    return data
  }
})

AppDispatcher.register(function(payload) {
  var action = payload.action
  switch (action.actionType) {
    case appConstants.OPEN_AUDIT_MODAL:
      mainstore.setAuditModalStatus(action.data)
      break
    case appConstants.SET_CANCEL_BUTTON_STATUS:
      mainstore.setCancelButtonStatus(action.data)
      break
    case appConstants.TOGGLE_BIN_SELECTION:
      mainstore.toggleBinSelection(action.bin_id)
      mainstore.emitChange()
      break
    case appConstants.STAGE_ONE_BIN:
      mainstore.showSpinner()
      mainstore.stageOneBin()
      mainstore.emitChange()
      break

    case appConstants.STAGE_ALL:
      mainstore.showSpinner()
      mainstore.stageAllBin()
      mainstore.emitChange()
      break
    case appConstants.WEBSOCKET_CONNECT:
      utils.connectToWebSocket(action.data)
      mainstore.emit(CHANGE_EVENT)
      break
    case appConstants.SET_CURRENT_SEAT:
      console.log("=======> mainstore.js -> case appConstants.SET_CURRENT_SEAT");
      mainstore.setCurrentSeat(action.data)
      mainstore.emit(CHANGE_EVENT)
      break
    case appConstants.SET_CURRENT_STATION_ID:
      mainstore.setCurrentStationId(action.data)
      mainstore.emit(CHANGE_EVENT)
      break
    case appConstants.POPUP_VISIBLE:
      setPopUpVisible(action.status)
      break
    case appConstants.HIDE_SPINNER:
      mainstore.hideSpinner()
      mainstore.emit(CHANGE_EVENT)
      break
    case appConstants.POST_DATA_TO_TOWER:
      mainstore.postDataToTower(action.data)
      mainstore.emit(CHANGE_EVENT)
      break
    case appConstants.POST_DATA_TO_INTERFACE:
      mainstore.showSpinner()
      mainstore.postDataToInterface(action.data)
      if (
        payload.action.data.event_name === appConstants.BIN_FULL_REQUEST ||
        payload.action.data.event_name === appConstants.BOX_FULL_REQUEST ||
        payload.action.data.event_name === appConstants.BOX_FULL_REQUEST
      )
       mainstore.hideSpinner()
      mainstore.emit(CHANGE_EVENT)
      break
    case appConstants.RESET_NUMPAD:
      mainstore.emit(CHANGE_EVENT)
      break
    case appConstants.LOAD_MODAL:
      mainstore.setModalContent(action.data)
      mainstore.emit(CHANGE_EVENT)
      break
    case appConstants.SET_SERVER_MESSAGES:
      console.log("=======> mainstore.js -> case appConstants.SET_SERVER_MESSAGES");
      mainstore.setServerMessages()
      mainstore.emit(CHANGE_EVENT)
      break
    case appConstants.CHANGE_LANGUAGE:
      mainstore.changeLanguage(action.data)
      mainstore.emit(CHANGE_EVENT)
      break
    case appConstants.SET_LANGUAGE:
      mainstore.emit(CHANGE_EVENT)
      break
    case appConstants.LOG_ERROR:
      mainstore.logError(action.data)
      break
    case appConstants.ENABLE_EXCEPTION:
      mainstore.enableException(action.data)
      mainstore.emitChange()
      break
    case appConstants.ENABLE_SEARCH:
      mainstore.enableSearch(action.data)
      mainstore.emitChange()
      break
    case appConstants.SET_ACTIVE_EXCEPTION:
      mainstore.setActiveException(action.data)
      mainstore.emitChange()
      break
    case appConstants.UPDATE_KQ_QUANTITY:
      mainstore.setKQQuanity(action.data)
      mainstore.emitChange()
      break
    case appConstants.UPDATE_GOOD_QUANTITY:
      mainstore.setGoodQuanity(action.data)
      mainstore.emitChange()
      break
    case appConstants.UPDATE_DAMAGED_QUANTITY:
      mainstore.setDamagedQuanity(action.data)
      mainstore.emitChange()
      break
    case appConstants.UPDATE_MISSING_QUANTITY:
      mainstore.setMissingQuanity(action.data)
      mainstore.emitChange()
      break
    case appConstants.UPDATE_UNSCANNABLE_QUANTITY:
      mainstore.setUnscannableQuanity(action.data)
      mainstore.emitChange()
      break
    case appConstants.CHANGE_PUT_FRONT_EXCEPTION_SCREEN:
      mainstore.setPutFrontExceptionScreen(action.data)
      mainstore.emitChange()
      break
    case appConstants.VALIDATE_UNMARKED_DAMAGED_DATA:
      mainstore.validateUnmarkedDamagedData()
      mainstore.emitChange()
      break
    case appConstants.CHANGE_PUT_BACK_EXCEPTION_SCREEN:
      mainstore.setPutBackExceptionScreen(action.data)
      mainstore.emitChange()
      break
    case appConstants.CHANGE_AUDIT_EXCEPTION_SCREEN:
      mainstore.setAuditExceptionScreen(action.data)
      mainstore.emitChange()
      break
    case appConstants.CHANGE_PICK_FRONT_EXCEPTION_SCREEN:
      mainstore.setPickFrontExceptionScreen(action.data)
      mainstore.emitChange()
      break
    case appConstants.VALIDATE_AND_SEND_DATA_TO_SERVER:
      mainstore.validateAndSendDataToServer()
      mainstore.emitChange()
      break
    case appConstants.VALIDATE_AND_SEND_SPACE_UNAVAILABLE_DATA_TO_SERVER:
      mainstore.validateAndSendSpaceUnavailableDataToServer()
      mainstore.emitChange()
      break
    case appConstants.PERIPHERAL_DATA:
      mainstore.getPeripheralData(action.data)
      mainstore.emitChange()
      break
    case appConstants.ORPHAN_ITEM_DATA:
      mainstore.getOrphanItemData(action.data)
      mainstore.emitChange()
      break
    case appConstants.GET_BOI_CONFIG:
      mainstore.getBOIConfigData()
      mainstore.emitChange()
      break
    case appConstants.UPDATE_SEAT_DATA:
      mainstore.showSpinner()
      mainstore.updateSeatData(
        action.data,
        action.type,
        action.status,
        action.method
      )
      mainstore.emitChange()
      break

    case appConstants.CONVERT_TEXTBOX:
      mainstore.convert_textbox(action.data, action.index)
      mainstore.emitChange()
      break
    case appConstants.UPDATE_PERIPHERAL:
      mainstore.showSpinner()
      mainstore.update_peripheral(action.data, action.method, action.index)
      mainstore.emitChange()
      break
    case appConstants.GENERATE_NOTIFICATION:
      mainstore.generateNotification(action.data)
      mainstore.emitChange()
      break
    case appConstants.CLEAR_NOTIFICATIONS:
      mainstore.clearNotifications()
      mainstore.emitChange()
    default:
      return true
  }
})

module.exports = mainstore
