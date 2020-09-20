var AppDispatcher = require("../dispatchers/AppDispatcher")
var appConstants = require("../constants/appConstants")
var objectAssign = require("react/lib/Object.assign")
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
var CommonActions = require("../actions/CommonActions")
var resourceConstants = require("../constants/resourceConstants")
var CHANGE_EVENT = "change"
var _seatData,
  _currentSeat,
  _currentStationId,
  _peripheralScreen = false,
  _seatMode,
  _username,
  _seatType,
  _seatName,
  _messageJson,
  _screenId,
  popupVisible = false,
  _showSpinner = true,
  showModal = false,
  _scanAllowed = true,
  _clearNotification = false,
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
var idleLogout = (function () {
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
  emitChange: function () {
    this.emit(CHANGE_EVENT)
  },
  addChangeListener: function (cb) {
    this.on(CHANGE_EVENT, cb)
  },
  removeChangeListener: function (cb) {
    this.removeListener(CHANGE_EVENT, cb)
  },
  getPopUpVisible: function (data) {
    return popupVisible
  },
  showSpinner: function () {
    _showSpinner = true
  },
  setLogoutState: function () {
    _logoutStatus = _seatData.logout_allowed
  },
  getSpinnerState: function () {
    return _showSpinner
  },

  getLogoutState: function () {
    if (_seatData && _seatData.hasOwnProperty("logout_allowed"))
      return _seatData.logout_allowed
  },
  getScanAllowedStatus: function () {
    if (_seatData.hasOwnProperty("scan_allowed")) {
      _scanAllowed = _seatData.scan_allowed
      return _scanAllowed
    } else {
      _scanAllowed = true
      return _scanAllowed
    }
  },
  tableCol: function (
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
      ; (this.mode = mode),
        (this.text_decoration = text_decoration),
        (this.color = color),
        (this.actionButton = actionButton),
        (this.textbox = textbox),
        (this.id = id),
        (this.management = management),
        (this.totalWidth = totalWidth)
  },

  getErrorPopupDisabledStatus: function () {
    if (_seatData.hasOwnProperty("error_popup_disabled")) {
      _errorPopupDisabled = _seatData.error_popup_disabled
    }
    return _errorPopupDisabled
  },

  setShowModal: function (data) {
    showModal = false
  },
  getNavData: function () {
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
      _NavData.map(function (data, index) {
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
        case appConstants.ORDER_PICK:
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
          ) {
            _NavData = navConfig.pickFront[0]
          } else {
            //_NavData = navConfig.pickFront[1]
            _NavData = navConfig.utility[1]
            _seatData.header_msge_list[0].code =
              resourceConstants.CLIENTCODE_005
          }
          break
        default:
        //return true;
      }
      _NavData.map(function (data, index) {
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
  getPptlData: function () {
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
        _seatData.utility.map(function (value, index) {
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
              value.pps_bin_id === "0" ? "Master PPTL" : value.pps_bin_id,
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
            ),
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
        _seatData.utility.map(function (value, index) {
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
            ),
          ])
        })
      }
      return data
    }
  },

  getModalStatus: function () {
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

  getServerNavData: function () {
    if (_seatData.header_msge_list.length > 0) {
      _serverNavData = _seatData.header_msge_list[0]
      return _serverNavData
    } else {
      return null
    }
  },

  getNotificationData: function () {
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

  clearNotifications: function () {
    _clearNotification = true
  },
  getRackDetails: function () {
    if (_seatData.hasOwnProperty("rack_details")) {
      return _seatData.rack_details
    }
  },



  hideSpinner: function () {
    _showSpinner = false
  },
  setCurrentStationId: function (data) {
    _currentStationId = data;
  },
  setCurrentSeat: function (data) {
    _seatData = data
    _currentSeat = "order_pick";
    _screenId = data.screen_id
  },
  getModalContent: function () {
    return modalContent.data
  },
  getSystemIdleState: function () {
    if (_seatData != undefined && _peripheralScreen == false) {
      return _seatData.is_idle
    } else if (_seatData != undefined && _peripheralScreen == true) {
      return false
    } else {
      return null
    }
  },

  getModalType: function () {
    return modalContent.type
  },
  setModalContent: function (data) {
    modalContent = data
  },

  getCurrentSeat: function () {
    return _currentSeat
  },
  getCurrentStationId: function () {
    return _currentStationId
  },
  setServerMessages: function (data) {
    _messageJson = serverMessages
  },
  getServerMessages: function () {
    return _messageJson
  },
  changeLanguage: function (data) {
    var locale_data = {
      data: {
        locale: data,
      },
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

  postDataToInterface: function (data) {
    showModal = false
    //utils.postDataToInterface(data, _seatName)
    utils.postDataToInterface(data, _currentStationId)
  },
  update_peripheral: function (data, method, index) {
    utils.updatePeripherals(data, method, _seatName)
  },

  getScreenId: function () {
    return _screenId
  },
  getPpsMode: function () {
    return _seatMode
  },
  getUsername: function () {
    return _username
  },
  getSeatType: function () {
    return _seatType
  },
  getSeatName: function () {
    return _seatName
  },
  getHeaderMessg: function (data) {
    if (_seatData && _seatData.header_msge_list) {
      return _seatData.header_msge_list[0]
    }
  },

  getCurrentMtu: function () {
    if (_seatData.hasOwnProperty("selected_dock_station_label"))
      return _seatData.selected_dock_station_label
  },

  isToteFlowEnabled: function () {
    if (_seatData.hasOwnProperty("is_flow_scan_totes"))
      return _seatData.is_flow_scan_totes
  },
  getPeripheralData: function (data) {
    _seatData.scan_allowed = false
    utils.getPeripheralData(data, _seatData.seat_name)
  },


  getDockStationList: function () {
    var ppsBinIds = {}
    var ppsBinIdColors = {}
    var leftBins = []
    var rightBins = []
    var centerBins = []
    var centerTopBins = []
    if (_seatData["dock_station_list"]) {
      _seatData["dock_station_list"].forEach(function (bin) {
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
      leftBins.forEach(function (bin) {
        ppsBinIds[bin["dock_station_label"]] = bin["direction"]
      })
      leftBins.forEach(function (bin) {
        ppsBinIdColors[bin["dock_station_label"]] = bin["ppsbin_light_color"]
      })
    }
    return {
      ppsBinIds: ppsBinIds,
      ppsBinIdColors: ppsBinIdColors
    }
  },

  updateSeatData: function (data, type, status, method) {
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
      if (data.uph_thresholds) {
        this.setUPHActive(data.uph_active)
        this.setPickUPHThreshold(data.uph_thresholds)
        this.setPutUPHThreshold(data.uph_thresholds)
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

  getScreenData: function () {
    var data = {}

    //since OrigBinUse Flag is needed in all the screens.
    data["SeatType"] = this.getSeatType()
    data["ppsMode"] = this.getPpsMode()
    data["username"] = this.getUsername()

    switch (_screenId) {
      case appConstants.SCANNER_MANAGEMENT:
        //case appConstants.WAIT_FOR_MTU:
        console.log("wait for mtu");
        data["utility"] = this.getPptlData()
        data["PickFrontScreenId"] = this.getScreenId()
        data["PickFrontNavData"] = this.getNavData()
        data["PickFrontServerNavData"] = this.getServerNavData()
        data["PickFrontNotification"] = this.getNotificationData()
        data["udpBinMapDetails"] = this.getDockStationList()
        break;

      case appConstants.WAIT_FOR_MTU:
      case appConstants.SELECT_MTU_POINT:
        data["PickFrontNavData"] = this.getNavData()
        data["PickFrontServerNavData"] = this.getServerNavData()
        data["PickFrontNotification"] = this.getNotificationData()
        data["PickFrontScreenId"] = this.getScreenId()
        data["udpBinMapDetails"] = this.getDockStationList()
        break;

      case appConstants.REMOVE_ALL_TOTES:
        data["PickFrontNavData"] = this.getNavData()
        data["PickFrontServerNavData"] = this.getServerNavData()
        data["PickFrontScreenId"] = this.getScreenId()
        data["PickFrontRackDetails"] = this.getRackDetails()
        data["udpBinMapDetails"] = this.getDockStationList()
        data["getCurrentMtu"] = this.getCurrentMtu()
        data["isToteFlowEnabled"] = this.isToteFlowEnabled()
        break;

      case appConstants.SCAN_EMPTY_TOTE:
        data["PickFrontNavData"] = this.getNavData()
        data["PickFrontServerNavData"] = this.getServerNavData()
        data["PickFrontScreenId"] = this.getScreenId()
        //data["SlotType"] = this.getSlotType()
        data["PickFrontRackDetails"] = this.getRackDetails()
        data["udpBinMapDetails"] = this.getDockStationList()
        data["getCurrentMtu"] = this.getCurrentMtu()
        data["PickFrontNotification"] = this.getNotificationData()
        break;

      case appConstants.SCAN_EMPTY_SLOT:
        data["PickFrontNavData"] = this.getNavData()
        data["PickFrontServerNavData"] = this.getServerNavData()
        data["PickFrontScreenId"] = this.getScreenId()
        //data["SlotType"] = this.getSlotType()
        data["PickFrontRackDetails"] = this.getRackDetails()
        data["udpBinMapDetails"] = this.getDockStationList()
        data["getCurrentMtu"] = this.getCurrentMtu()
        data["PickFrontNotification"] = this.getNotificationData()
        break;

      default:
    }
    return data
  }
})

AppDispatcher.register(function (payload) {
  var action = payload.action
  switch (action.actionType) {
    case appConstants.WEBSOCKET_CONNECT:
      utils.connectToWebSocket(action.data)
      mainstore.emit(CHANGE_EVENT)
      break
    case appConstants.SET_CURRENT_SEAT:
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
    case appConstants.LOAD_MODAL:
      mainstore.setModalContent(action.data)
      mainstore.emit(CHANGE_EVENT)
      break
    case appConstants.SET_CURRENT_SEAT:
      mainstore.setCurrentSeat(action.data)
      mainstore.emit(CHANGE_EVENT)
      break
    case appConstants.SET_SERVER_MESSAGES:
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
    case appConstants.GENERATE_NOTIFICATION:
      mainstore.generateNotification(action.data)
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
    case appConstants.UPDATE_PERIPHERAL:
      mainstore.showSpinner()
      mainstore.update_peripheral(action.data, action.method, action.index)
      mainstore.emitChange()
      break
    case appConstants.CLEAR_NOTIFICATIONS:
      mainstore.clearNotifications()
      mainstore.emitChange()
    case appConstants.PERIPHERAL_DATA:
      mainstore.getPeripheralData(action.data)
      mainstore.emitChange()
      break
    default:
      return true
  }
})

module.exports = mainstore
