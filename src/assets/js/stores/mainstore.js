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

  getServerNavData: function() {
    if (_seatData.header_msge_list.length > 0) {
      _serverNavData = _seatData.header_msge_list[0]
      return _serverNavData
    } else {
      return null
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

  clearNotifications: function() {
    _clearNotification = true
  },
  getRackDetails: function() {
    if (_seatData.hasOwnProperty("rack_details")) {
      return _seatData.rack_details
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
    _currentSeat = "order_pick";
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
 
  getModalType: function() {
    return modalContent.type
  },
  setModalContent: function(data) {
    modalContent = data
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
  
  postDataToInterface: function(data) {
    showModal = false
    //utils.postDataToInterface(data, _seatName)
    utils.postDataToInterface(data, _currentStationId)
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
  getHeaderMessg: function(data) {
    if (_seatData && _seatData.header_msge_list) {
      return _seatData.header_msge_list[0]
    }
  },

  getCurrentMtu: function(){
    if (_seatData.hasOwnProperty("selected_dock_station_label"))
      return _seatData.selected_dock_station_label
  },

  isToteFlowEnabled: function(){
    if (_seatData.hasOwnProperty("is_flow_scan_totes"))
      return _seatData.is_flow_scan_totes
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
  
  getScreenData: function() {
    var data = {}

    //since OrigBinUse Flag is needed in all the screens.
    data["SeatType"] = this.getSeatType()
    data["ppsMode"] = this.getPpsMode()
    data["username"] = this.getUsername()

    switch (_screenId) {
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
          data["isToteFlowEnabled"]  = this.isToteFlowEnabled()
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

AppDispatcher.register(function(payload) {
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
    case appConstants.CLEAR_NOTIFICATIONS:
      mainstore.clearNotifications()
      mainstore.emitChange()
    default:
      return true
  }
})

module.exports = mainstore
