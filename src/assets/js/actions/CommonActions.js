var AppDispatcher = require('../dispatchers/AppDispatcher');
var appConstants = require('../constants/appConstants');

var commonActions = {
  webSocketConnection: function(data) {
    AppDispatcher.handleAction({
      actionType: appConstants.WEBSOCKET_CONNECT,
      data: data
    });
  },
  listSeats: function(data) {
    AppDispatcher.handleAction({
      actionType: appConstants.LIST_SEATS,
      data: data
    });
  },
  listStations: function(data) {
    AppDispatcher.handleAction({
      actionType: appConstants.LIST_STATIONS,
      data: data
    });
  },
  login: function(data) {
    AppDispatcher.handleAction({
      actionType: appConstants.LOGIN,
      data: data
    });
  },
  operatorSeat: function(data) {
    AppDispatcher.handleAction({
      actionType: appConstants.OPERATOR_SEAT,
      data: data
    });
  },
  loginSeat: function(data) {
    AppDispatcher.handleAction({
      actionType: appConstants.LOGIN_SEAT,
      data: data
    });
  },
  toggleBinSelection: function(bin_id) {
    AppDispatcher.handleAction({
      actionType: appConstants.TOGGLE_BIN_SELECTION,
      bin_id: bin_id
    });
  },

  setPutData: function(data) {
    AppDispatcher.handleAction({
      actionType: appConstants.SET_PUT_DATA,
      data: data
    });
  },

  setCurrentSeat: function(seat) {
    AppDispatcher.handleAction({
      actionType: appConstants.SET_CURRENT_SEAT,
      data: seat
    });
  },
  hideSpinner: function(data) {
    AppDispatcher.handleAction({
      actionType: appConstants.HIDE_SPINNER,
      data: data
    });
  },

  showErrorMessage: function(seat) {
    AppDispatcher.handleAction({
      actionType: appConstants.SHOW_ERROR_MESSAGE,
      data: seat
    });
  },

  postDataToInterface: function(data) {
    AppDispatcher.handleAction({
      actionType: appConstants.POST_DATA_TO_INTERFACE,
      data: data
    });
  },

  postDataToTower: function(data) {
    AppDispatcher.handleAction({
      actionType: appConstants.POST_DATA_TO_TOWER,
      data: data
    });
  },

  setPutBackData: function(data) {
    AppDispatcher.handleAction({
      actionType: appConstants.SET_PUT_BACK_DATA,
      data: data
    });
  },
  setPutFrontData: function(data) {
    AppDispatcher.handleAction({
      actionType: appConstants.SET_PUT_FRONT_DATA,
      data: data
    });
  },
  setSearchData: function(data) {
    AppDispatcher.handleAction({
      actionType: appConstants.SET_SEARCH_DATA,
      data: data
    });
  },

  setPickBackData: function(data) {
    AppDispatcher.handleAction({
      actionType: appConstants.SET_PICK_BACK_DATA,
      data: data
    });
  },

  setAuditData: function(data) {
    AppDispatcher.handleAction({
      actionType: appConstants.SET_AUDIT_DATA,
      data: data
    });
  },

  updatePopupVisible: function(status) {
    AppDispatcher.handleAction({
      actionType: appConstants.POPUP_VISIBLE,
      status: status
    });
  },
  stageAllBins: function() {
    AppDispatcher.handleAction({
      actionType: appConstants.STAGE_ALL
    });
  },
  stageOneBin: function() {
    AppDispatcher.handleAction({
      actionType: appConstants.STAGE_ONE_BIN
    });
  },
  resetNumpadVal: function(data) {
    AppDispatcher.handleAction({
      actionType: appConstants.RESET_NUMPAD,
      data: data
    });
  },
  showModal: function(data) {
    AppDispatcher.handleAction({
      actionType: appConstants.LOAD_MODAL,
      data: data
    });
  },
  pptlPress: function(data) {
    AppDispatcher.handleAction({
      actionType: appConstants.PPTL_PRESS,
      data: data
    });
  },
  setPickFrontData: function(data) {
    AppDispatcher.handleAction({
      actionType: appConstants.SET_PICK_FRONT_DATA,
      data: data
    });
  },
  setServerMessages: function() {
    AppDispatcher.handleAction({
      actionType: appConstants.SET_SERVER_MESSAGES
    });
  },
  changeLanguage: function(data) {
    AppDispatcher.handleAction({
      actionType: appConstants.CHANGE_LANGUAGE,
      data: data
    });
  },
  setLanguage: function(data) {
    AppDispatcher.handleAction({
      actionType: appConstants.SET_LANGUAGE,
      data: data
    });
  },
  logError: function(data) {
    AppDispatcher.handleAction({
      actionType: appConstants.LOG_ERROR,
      data: data
    });
  },
  enableException: function(data) {
    AppDispatcher.handleAction({
      actionType: appConstants.ENABLE_EXCEPTION,
      data: data
    });
  },
  enableSearch: function(data) {
    AppDispatcher.handleAction({
      actionType: appConstants.ENABLE_SEARCH,
      data: data
    });
  },
  logoutSession: function(data) {
    AppDispatcher.handleAction({
      actionType: appConstants.LOGOUT_SESSION,
      data: data
    });
  },
  setActiveException: function(data) {
    AppDispatcher.handleAction({
      actionType: appConstants.SET_ACTIVE_EXCEPTION,
      data: data
    });
  },

  updateKQQuantity: function(data) {
    AppDispatcher.handleAction({
      actionType: appConstants.UPDATE_KQ_QUANTITY,
      data: data
    });
  },
  updateMissingQuantity: function(data) {
    AppDispatcher.handleAction({
      actionType: appConstants.UPDATE_MISSING_QUANTITY,
      data: data
    });
  },
  updateUnscannableQuantity: function(data) {
    AppDispatcher.handleAction({
      actionType: appConstants.UPDATE_UNSCANNABLE_QUANTITY,
      data: data
    });
  },

  updateGoodQuantity: function(data) {
    AppDispatcher.handleAction({
      actionType: appConstants.UPDATE_GOOD_QUANTITY,
      data: data
    });
  },

  updateDamagedQuantity: function(data) {
    AppDispatcher.handleAction({
      actionType: appConstants.UPDATE_DAMAGED_QUANTITY,
      data: data
    });
  },

  changePutFrontExceptionScreen: function(data) {
    AppDispatcher.handleAction({
      actionType: appConstants.CHANGE_PUT_FRONT_EXCEPTION_SCREEN,
      data: data
    });
  },

  changeAuditExceptionScreen: function(data) {
    AppDispatcher.handleAction({
      actionType: appConstants.CHANGE_AUDIT_EXCEPTION_SCREEN,
      data: data
    });
  },

  changePickFrontExceptionScreen: function(data) {
    AppDispatcher.handleAction({
      actionType: appConstants.CHANGE_PICK_FRONT_EXCEPTION_SCREEN,
      data: data
    });
  },

  changePutBackExceptionScreen: function(data) {
    AppDispatcher.handleAction({
      actionType: appConstants.CHANGE_PUT_BACK_EXCEPTION_SCREEN,
      data: data
    });
  },

  validateAndSendDataToServer: function() {
    AppDispatcher.handleAction({
      actionType: appConstants.VALIDATE_AND_SEND_DATA_TO_SERVER
    });
  },
  validateAndSendSpaceUnavailableDataToServer: function() {
    AppDispatcher.handleAction({
      actionType:
        appConstants.VALIDATE_AND_SEND_SPACE_UNAVAILABLE_DATA_TO_SERVER
    });
  },
  validateUnmarkedDamagedData: function() {
    AppDispatcher.handleAction({
      actionType: appConstants.VALIDATE_UNMARKED_DAMAGED_DATA
    });
  },
  getPeriPheralData: function(data) {
    AppDispatcher.handleAction({
      actionType: appConstants.PERIPHERAL_DATA,
      data: data
    });
  },
  getOrphanItemData: function(data) {
    AppDispatcher.handleAction({
      actionType: appConstants.ORPHAN_ITEM_DATA,
      data: data
    });
  },
  getBOIConfig: function() {
    AppDispatcher.handleAction({
      actionType: appConstants.GET_BOI_CONFIG
    });
  },
  updateSeatData: function(data, type, status, method) {
    AppDispatcher.handleAction({
      actionType: appConstants.UPDATE_SEAT_DATA,
      data: data,
      type: type,
      status: status,
      method: method
    });
  },
  convertTextBox: function(data, index) {
    AppDispatcher.handleAction({
      actionType: appConstants.CONVERT_TEXTBOX,
      data: data,
      index: index
    });
  },
  updateData: function(data, method, index) {
    AppDispatcher.handleAction({
      actionType: appConstants.UPDATE_PERIPHERAL,
      data: data,
      method: method,
      index: index
    });
  },
  generateNotification: function(data) {
    AppDispatcher.handleAction({
      actionType: appConstants.GENERATE_NOTIFICATION,
      data: data
    });
  },
  clearNotification: function() {
    AppDispatcher.handleAction({
      actionType: appConstants.CLEAR_NOTIFICATIONS
    });
  },
  setCancelButtonStatus: function(data) {
    AppDispatcher.handleAction({
      actionType: appConstants.SET_CANCEL_BUTTON_STATUS,
      data: data
    });
  }
};

module.exports = commonActions;
