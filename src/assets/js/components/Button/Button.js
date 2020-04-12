var React = require('react');
var ActionCreators = require('../../actions/CommonActions');
var appConstants = require('../../constants/appConstants');
var PickFrontStore = require('../../stores/PickFrontStore');
//var PutBackStore = require('../../stores/PutBackStore');
var mainstore = require('../../stores/mainstore');

function closeModalBox() {
  $('.modal').modal('hide');
}

var Button1 = React.createClass({
  _checklistClass: '',
  removeTextField: function () {
    $('.modal-body')
      .find('input:text')
      .val('');
  },

  performAction: function (module, action) {
    var peripheralId;
    var data = {
      event_name: '',
      event_data: {}
    };
    var peripheralData = {
      peripheral_id: '',
      peripheral_type: ''
    };

    switch (module) {
      case appConstants.ERROR_NOTIFICATION:
        var notification_data = mainstore.getNotificationData();
        var saltParamModule =
          notification_data && notification_data.saltParams
            ? notification_data.saltParams.module
            : null;
        var data = {
          event_name: 'remove_gui_alert',
          event_data: {
            ui_event: mainstore.getScreenEvent()
          },
          source: 'ui'
        };
        if (
          (notification_data &&
            notification_data.type !== appConstants.CLIENT_NOTIFICATION) ||
          (notification_data && saltParamModule === appConstants.BIN_FULL)
        ) {
          if (saltParamModule === appConstants.BIN_FULL) {
            data = {};
            data['event_name'] = appConstants.CANCEL_BIN_FULL_REQUEST;
            data['event_data'] = null;
          }

          ActionCreators.postDataToInterface(data);
        }

        ActionCreators.clearNotification();
        $('.modal.notification-error').data('bs.modal').options.backdrop = true;
        $('.modal-backdrop').remove();
        $('.modal.notification-error').modal('hide');
        $('.modal').removeClass('notification-error');
        break;

      case appConstants.PUT_BACK:
        switch (action) {
          case appConstants.STAGE_ONE_BIN:
            ActionCreators.stageOneBin();
            break;
          case appConstants.STAGE_ALL:
            ActionCreators.stageAllBins();
            break;
          case appConstants.CANCEL_SCAN:
            data['event_name'] = 'cancel_barcode_scan';
            data['event_data']['barcode'] = this.props.barcode;
            ActionCreators.postDataToInterface(data);
            break;
          case appConstants.CANCEL_EXCEPTION:
            ActionCreators.enableException(false);
            break;
          case appConstants.CANCEL_EXCEPTION_TO_SERVER:
            data['event_name'] = 'cancel_exception';
            ActionCreators.postDataToInterface(data);
            break;
          case appConstants.VALIDATE_AND_SEND_DATA_TO_SERVER:
            ActionCreators.validateAndSendDataToServer();
            break;
          case appConstants.SEND_KQ_QTY_1:
            ActionCreators.changePutBackExceptionScreen(
              'extra_quantity_update'
            );
            break;

          case appConstants.PUT_FINISH_EXCEPTION_ENTITY:
            data['event_name'] = 'put_back_exception';
            data['event_data']['action'] = 'finish_exception';
            data['event_data']['event'] = mainstore.getExceptionType();
            ActionCreators.postDataToInterface(data);
            break;
          case appConstants.FINISH_EXCEPTION_ENTITY_DAMAGED:
          case appConstants.FINISH_EXCEPTION_ITEM_OVERSIZED:
          case appConstants.FINISH_EXCEPTION_EXTRA_ITEM:
          case appConstants.EXCESS_ITEM_BIN:
            data['event_name'] = 'put_back_exception';
            data['event_data']['action'] = 'confirm_button_press';
            data['event_data']['event'] = mainstore.getExceptionType();
            ActionCreators.postDataToInterface(data);
            break;

          case appConstants.FINISH_EXCEPTION_ENTITY:
            data['event_name'] = 'put_back_exception';
            data['event_data']['action'] = 'confirm_irt_bin';
            data['event_data']['event'] = mainstore.getExceptionType();
            ActionCreators.postDataToInterface(data);
            break;
          case appConstants.SEND_EXCESS_ITEMS_BIN:
            data['event_name'] = 'put_back_exception';
            data['event_data']['action'] = 'extra_items_bin_select';
            data['event_data']['event'] = mainstore.getExceptionType();
            data['event_data']['bin_id'] = mainstore.getSelectedBin();
            ActionCreators.postDataToInterface(data);
            break;

          case appConstants.CONFIRM_ITEM_PLACE_IN_IRT:
            data['event_name'] = 'put_back_exception';
            data['event_data']['action'] = 'confirm_quantity_update';
            data['event_data']['event'] = mainstore.getExceptionType();
            data['event_data']['quantity'] = mainstore.getkQQuanity();
            ActionCreators.postDataToInterface(data);
            break;

          case appConstants.UNSCANNABLE_TOTE_ENTITY_QUANTITY:
            data['event_name'] = 'put_back_exception';
            data['event_data']['action'] = 'confirm_quantity_update';
            data['event_data']['event'] = mainstore.getExceptionType();
            data['event_data']['quantity'] = mainstore.getDamagedQuantity();
            ActionCreators.postDataToInterface(data);
            break;

          case appConstants.CANCEL_TOTE:
          case appConstants.CLOSE_TOTE:
            data['event_name'] = 'confirm_close_tote';
            data['event_data']['close_value'] = this.props.status;
            data['event_data']['barcode'] = this.props.toteId;
            ActionCreators.postDataToInterface(data);
            break;
          case appConstants.CONFIRM_TOTE_EXCEPTION:
            data['event_name'] = 'put_back_exception';
            (data['event_data']['action'] = 'confirm_invalid_item_in_tote'),
              (data['event_data']['event'] = mainstore.getExceptionType());
            data['event_data']['item_uid'] = mainstore.getItemUid();
            ActionCreators.postDataToInterface(data);
            break;
          case appConstants.EXIT_INVOICE:
            this.showModal(null, appConstants.EXIT_INVOICE);
            break;
          case appConstants.DECLINE_CANCEL_INVOICE:
            closeModalBox();
            break;
          case appConstants.CONFIRM_EXIT_INVOICE:
            data['event_name'] = 'close_invoice';
            data['event_data'][
              'barcode'
            ] = mainstore.getInvoiceStatus().invoiceId;
            ActionCreators.postDataToInterface(data);
            closeModalBox();
            break;
          case appConstants.CANCEL_TOTE_EXCEPTION:
            data['event_name'] = 'put_back_exception';
            (data['event_data']['action'] = 'cancel_invalid_item_in_tote'),
              (data['event_data']['event'] = mainstore.getExceptionType());
            data['event_data']['item_uid'] = mainstore.getItemUid();
            ActionCreators.postDataToInterface(data);

          default:
            return true;
        }
        break;
      case appConstants.PUT_FRONT:
        switch (action) {
          case appConstants.CANCEL_SCAN:
            data['event_name'] = 'cancel_scan_all';
            data['event_data']['barcode'] = this.props.barcode;
            ActionCreators.postDataToInterface(data);
            break;
          case appConstants.CANCEL_SCAN_UDP:
            data['event_name'] = 'cancel_barcode_scan';
            data['event_data']['barcode'] = this.props.barcode;
            ActionCreators.postDataToInterface(data);
            break;
          case appConstants.WAREHOUSEFULL_EXCEPTION:
            data['event_name'] = 'put_front_exception';
            data['event_data']['action'] = 'confirm_quantity_update';
            data['event_data']['event'] = mainstore.getExceptionType();
            ActionCreators.postDataToInterface(data);
            break;
          case appConstants.CANCEL_EXCEPTION:
            ActionCreators.enableException(false);
            break;
          case appConstants.GET_REVISED_QUANTITY:
            ActionCreators.changePutFrontExceptionScreen('revised_quantity');
            break;
          case appConstants.MOVE_TO_DAMAGED_CONFIRM:
            ActionCreators.changePutFrontExceptionScreen(
              'damaged_or_missing_confirm'
            );
            break;
          case appConstants.CANCEL_EXCEPTION_TO_SERVER:
            data['event_name'] = 'cancel_exception';
            ActionCreators.postDataToInterface(data);
            closeModalBox();
            break;
          case appConstants.VALIDATE_AND_SEND_DATA_TO_SERVER:
            ActionCreators.validateAndSendDataToServer();
            break;
          case appConstants.VALIDATE_AND_SEND_SPACE_UNAVAILABLE_DATA_TO_SERVER:
            ActionCreators.validateAndSendSpaceUnavailableDataToServer();
            break;
          case appConstants.SEND_EXCESS_ITEMS_BIN:
            data['event_name'] = 'put_front_exception';
            data['event_data']['action'] = 'finish_exception';
            data['event_data']['event'] = mainstore.getExceptionType();
            ActionCreators.postDataToInterface(data);
            break;
          case appConstants.UNMARKED_DAMAGED:
            ActionCreators.validateUnmarkedDamagedData();
            break;
          case appConstants.CANCEL_EXCEPTION_MODAL:
            this.showModal(appConstants.PUT_FRONT, 'cancel_exception');
            break;
          case appConstants.PUT_FINISH_EXCEPTION_ENTITY:
            data['event_name'] = 'put_front_exception';
            data['event_data']['action'] = 'confirm_irt_bin';
            data['event_data']['event'] = mainstore.getExceptionType();
            ActionCreators.postDataToInterface(data);
            break;

          case appConstants.CLOSE_CANCEL_EXCEPTION:
            closeModalBox();
            break;
          case appConstants.SEND_MSU:
            data['event_name'] = 'send_msu';
            ActionCreators.postDataToInterface(data);
            break;
          case appConstants.CLOSE_UNEXPECTED_SCAN:
            data['event_name'] = 'close_unexpected_scan';
            data['event_data']['close_value'] = this.props.status;
            data['event_data']['barcode'] = this.props.toteId;
            ActionCreators.postDataToInterface(data);
            closeModalBox();
            break;
          case appConstants.CLOSE_TOTE:
            data['event_name'] = 'confirm_close_tote';
            data['event_data']['close_value'] = this.props.status;
            data['event_data']['barcode'] = this.props.toteId;
            ActionCreators.postDataToInterface(data);
            closeModalBox();
            break;
          default:
            return true;
        }
        break;

      case appConstants.SEARCH_PPS_ITEM:
        switch (action) {
          case appConstants.KQ_QTY_CONFIRM:
            data['event_data']['action'] = 'confirm_quantity_update';
            data['event_data']['quantity'] = mainstore.getkQQuanity();
            data['event_name'] = 'search_entity_confirm';
            ActionCreators.postDataToInterface(data);
            break;
          case appConstants.SEARCH_ITEM_CONFIRM:
            data['event_data']['action'] = 'confirm_submit';
            data['event_name'] = 'search_irt_confirm';
            ActionCreators.postDataToInterface(data);
            break;
          default:
            return true;
        }
        break;

      case appConstants.PICK_FRONT:
        switch (action) {
          case appConstants.CANCEL_SCAN:
            data['event_name'] = appConstants.CANCEL_SCAN_ALL;
            ActionCreators.postDataToInterface(data);
            break;

          case appConstants.CANCEL_SCAN_SEND_TO_SERVER_MODAL:
            data['event_name'] = appConstants.CANCEL_SCAN_ALL;
            ActionCreators.postDataToInterface(data);
            closeModalBox();
            break;

          case appConstants.NEW_CARRYING_UNIT:
            data['event_name'] = appConstants.NEW_CARRYING_UNIT;
            ActionCreators.postDataToInterface(data);
            this.showModal(
              appConstants.PICK_FRONT,
              appConstants.NEW_CARRYING_UNIT
            );
            break;

          case appConstants.CONFIRM_TOTE_SEND_TO_SERVER_MODAL:
            data['event_name'] = appConstants.CONFIRM_TOTE;
            ActionCreators.postDataToInterface(data);
            closeModalBox();
            break;

          case appConstants.CANCEL_TOTE_SEND_TO_SERVER_MODAL:
            data['event_name'] = appConstants.CANCEL_TOTE;
            ActionCreators.postDataToInterface(data);
            closeModalBox();
            break;

          case appConstants.SKIP_DOCKING:
            data['event_name'] = appConstants.SKIP_DOCKING;
            ActionCreators.postDataToInterface(data);
            this.showModal(appConstants.PICK_FRONT, appConstants.SKIP_DOCKING);
            break;

          case appConstants.CONFIRM_SKIP_DOCKING_SEND_TO_SERVER_MODAL:
            data['event_name'] = appConstants.CONFIRM_SKIP_DOCKING;
            ActionCreators.postDataToInterface(data);
            closeModalBox();
            break;

          case appConstants.CANCEL_SKIP_DOCKING_SEND_TO_SERVER_MODAL:
            data['event_name'] = appConstants.CANCEL_SKIP_DOCKING;
            ActionCreators.postDataToInterface(data);
            closeModalBox();
            break;

          case appConstants.CANCEL_SCAN_MODAL:
            this.showModal(
              appConstants.PICK_FRONT,
              appConstants.CANCEL_SCAN_ALL
            );
            break;

          case appConstants.CHECKLIST_SUBMIT:
            var checklist_index = this.props.checkListData.checklist_index;
            var checkList = this.props.checkListData;
            if (checklist_index != 'all') {
              checkList.checklist_data[checklist_index - 1].map(function (
                value,
                index
              ) {
                var keyvalue = Object.keys(value);
                if (
                  checkList.checklist_data[checklist_index - 1][index][
                    keyvalue[0]
                  ].Format != 'Integer'
                )
                  checkList.checklist_data[checklist_index - 1][index][
                    keyvalue[0]
                  ].value = document.getElementById(
                    'checklist_field' + index + '-' + (checklist_index - 1)
                  ).value;
                else
                  checkList.checklist_data[checklist_index - 1][index][
                    keyvalue[0]
                  ].value = parseInt(
                    document.getElementById(
                      'checklist_field' + index + '-' + (checklist_index - 1)
                    ).value
                  );
              });
            } else {
              checkList.checklist_data.map(function (value, index) {
                if (index < mainstore.scanDetails()['current_qty'])
                  value.map(function (value1, index1) {
                    var keyvalue = Object.keys(value1);
                    if (
                      checkList.checklist_data[index][index1][keyvalue[0]]
                        .Format != 'Integer'
                    )
                      checkList.checklist_data[index][index1][
                        keyvalue[0]
                      ].value = document.getElementById(
                        'checklist_field' + index1 + '-' + index
                      ).value;
                    else
                      checkList.checklist_data[index][index1][
                        keyvalue[0]
                      ].value = parseInt(
                        document.getElementById(
                          'checklist_field' + index1 + '-' + index
                        ).value
                      );
                  });
              });
            }
            if (
              mainstore.getChecklistCompleteDetails()['checklist_index'] ==
              'all'
            )
              data['event_name'] = 'all_items_pick_checklist_update';
            else data['event_name'] = 'single_item_pick_checklist_update';
            data['event_data']['pick_checklist'] = checkList;
            ActionCreators.postDataToInterface(data);

            break;

          case appConstants.CONFIRM_FROM_USER:
            ActionCreators.changePickFrontExceptionScreen('confirm_from_user');
            break;
          case appConstants.VALIDATE_AND_SEND_DATA_TO_SERVER:
            ActionCreators.validateAndSendDataToServer();
            break;
          case appConstants.SEND_MISSING_BOX_EXCEPTION:
            data['event_name'] = 'pick_front_exception';
            data['event_data'] = {};
            data['event_data']['event'] = mainstore.getExceptionType();
            data['event_data']['quantity'] = {};
            data['event_data']['quantity'][
              'unscannable'
            ] = mainstore.getkQQuanity();

            ActionCreators.postDataToInterface(data);
            break;

          case appConstants.PICK_FINISH_EXCEPTION_ENTITY:
            data['event_name'] = 'pick_front_exception';
            data['event_data']['action'] = 'confirm_irt_bin';
            data['event_data']['event'] = mainstore.getExceptionType();
            ActionCreators.postDataToInterface(data);
            break;
          case appConstants.PICK_FINISH_EXCEPTION_ENTITY:
            data['event_name'] = 'pick_front_exception';
            data['event_data']['action'] = 'confirm_irt_bin';
            data['event_data']['event'] = mainstore.getExceptionType();
            ActionCreators.postDataToInterface(data);
            break;
          case appConstants.EDIT_DETAILS:
            data['event_name'] = 'checklist_edit';
            ActionCreators.postDataToInterface(data);
            break;
          case appConstants.CANCEL_EXCEPTION:
            ActionCreators.enableException(false);
            data['event_name'] = 'cancel_exception';
            ActionCreators.postDataToInterface(data);
            break;
          case appConstants.CANCEL_EXCEPTION_TO_SERVER:
            data['event_name'] = 'cancel_exception';
            ActionCreators.postDataToInterface(data);
            break;
          case appConstants.CHECKLIST_CLEARALL:
            this.removeTextField();
            break;
          case appConstants.BIN_FULL:
            data['event_name'] = appConstants.BIN_FULL_REQUEST;
            data['event_data'] = null;
            ActionCreators.setCancelButtonStatus(false);
            -ActionCreators.postDataToInterface(data);
            this.showModal(null, appConstants.BIN_FULL);
            break;
          case appConstants.BOX_FULL:
            data['event_name'] = appConstants.BOX_FULL_REQUEST;
            data['event_data'] = null;
            ActionCreators.postDataToInterface(data);
            this.showModal(null, appConstants.BOX_FULL);
            break;
          case appConstants.DISCARD_PACKING_BOX:
            data['event_name'] = appConstants.BOX_FULL_REQUEST;
            data['event_data'] = null;
            ActionCreators.postDataToInterface(data);
            this.showModal(null, appConstants.DISCARD_PACKING_BOX);
            break;
          case appConstants.CANCEL_BIN_FULL_REQUEST:
            data['event_name'] = appConstants.CANCEL_BIN_FULL_REQUEST;
            data['event_data'] = null;
            ActionCreators.setCancelButtonStatus(true);
            ActionCreators.postDataToInterface(data);
            closeModalBox();
            break;
          case appConstants.CONFIRM_BIN_FULL_REQUEST:
            ActionCreators.setCancelButtonStatus(true);
            ActionCreators.validateAndSendDataToServer();
            closeModalBox();
            break;
          case appConstants.CANCEL_BOX_FULL:
            data['event_name'] = appConstants.CANCEL_BOX_FULL_REQUEST;
            data['event_data'] = null;
            ActionCreators.postDataToInterface(data);
            closeModalBox();
            break;
          case appConstants.CONFIRM_BOX_FULL:
            data['event_name'] = appConstants.CONFIRM_BOX_FULL;
            data['event_data'] = null;
            ActionCreators.postDataToInterface(data);
            closeModalBox();
            break;
          case appConstants.CONFIRM_LOCATION:
            data['event_name'] = appConstants.CONFIRM_LOCATION_PRESS;
            data['event_data'] = null;
            ActionCreators.postDataToInterface(data);
            break;
          case appConstants.CONFIRM_PHYSICALLY_DAMAGED_ITEMS:
            data['event_name'] = 'pick_front_exception';
            data['event_data']['action'] = 'physically_damaged';
            data['event_data']['event'] = mainstore.getExceptionType();
            ActionCreators.postDataToInterface(data);
            break;

          case appConstants.REPRINT:
            data['event_name'] = 'pick_front';
            data['event_data']['action'] = 'reprint';
            ActionCreators.postDataToInterface(data);
            break;
          case appConstants.PRINT_CONFIRM:
            data['event_name'] = 'pick_front';
            data['event_data']['action'] = 'item_print_done';
            ActionCreators.postDataToInterface(data);
            break;
          case appConstants.PICK_FRONT_REPRINT:
            data['event_name'] = 'pick_front';
            data['event_data']['action'] = 'pick_front_item_reprint';
            ActionCreators.postDataToInterface(data);
            break;
          case appConstants.CLOSE_CANCEL_SCAN:
            closeModalBox();
            break;
          case appConstants.REPRINT_REQUEST:
            data['event_name'] = appConstants.REPRINT_REQUEST;
            data['event_data'] = null;
            ActionCreators.setCancelButtonStatus(false);
            -ActionCreators.postDataToInterface(data);
            this.showModal(null, appConstants.REPRINT_REQUEST);
            break;
          case appConstants.CANCEL_REPRINT_REQUEST:
            data['event_name'] = appConstants.CANCEL_REPRINT_REQUEST;
            data['event_data'] = null;
            ActionCreators.setCancelButtonStatus(true);
            -ActionCreators.postDataToInterface(data);
            closeModalBox();
            break;
          case appConstants.CONFIRM_REPRINT_LAST_REQUEST:
            data['event_name'] = appConstants.CONFIRM_REPRINT_LAST_REQUEST;
            data['event_data'] = null;
            -ActionCreators.postDataToInterface(data);
            closeModalBox();
            break;
          case appConstants.CONFIRM_REPRINT_ALL_REQUEST:
            data['event_name'] = appConstants.CONFIRM_REPRINT_ALL_REQUEST;
            data['event_data'] = null;
            -ActionCreators.postDataToInterface(data);
            closeModalBox();
            break;
            case appConstants.CANCEL_LOGOUT_REQUEST:
            data['event_name'] = appConstants.CANCEL_REPRINT_REQUEST;
            data['event_data'] = null;
            ActionCreators.setCancelButtonStatus(true);
            -ActionCreators.postDataToInterface(data);
            closeModalBox();
            break;
          case appConstants.CONFIRM_LOGOUT_REQUEST:
            data['event_name'] = appConstants.CONFIRM_REPRINT_LAST_REQUEST;
            if (mainstore.getLogoutState() === "false" || mainstore.getLogoutState() === false) {
              return false;
            }else {
              ActionCreators.logoutSession(true);
            }
            break;
          default:
            return true;
        }
        break;
      case appConstants.PICK_BACK:
        switch (action) {
          case appConstants.CANCEL_SCAN:
            data['event_name'] = 'cancel_tote_scan';
            data['event_data']['barcode'] = this.props.barcode;
            ActionCreators.postDataToInterface(data);
            break;
          case appConstants.CANCEL_SCAN_TOTE:
            data['event_name'] = 'cancel_tote_scan';
            data['event_data']['barcode'] = mainstore.getToteDeatils();
            ActionCreators.postDataToInterface(data);
            break;
          case appConstants.CANCEL_EXCEPTION:
            ActionCreators.enableException(false);
            break;
          case appConstants.CANCEL_EXCEPTION_TO_SERVER:
            data['event_name'] = 'cancel_exception';
            ActionCreators.postDataToInterface(data);
            break;
          case appConstants.REPRINT_INVOICE:
            data['event_name'] = 'pick_back_exception';
            data['event_data']['ppsbin_id'] = 'undefined';
            data['event_data']['type'] = mainstore.getExceptionType();
            ActionCreators.postDataToInterface(data);
            break;
          case appConstants.SKIP_PRINTING:
            data['event_name'] = 'pick_back_exception';
            data['event_data']['ppsbin_id'] = mainstore.getSelectedBin();
            data['event_data']['type'] = mainstore.getExceptionType();
            ActionCreators.postDataToInterface(data);
            break;

          case appConstants.DIS_ASSOCIATE_TOTE:
            data['event_name'] = 'pick_back_exception';
            data['event_data']['ppsbin_id'] = mainstore.getSelectedBin();
            data['event_data']['type'] = mainstore.getExceptionType();
            ActionCreators.postDataToInterface(data);
            break;
          case appConstants.OVERRIDE_TOTE:
            data['event_name'] = 'pick_back_exception';
            data['event_data']['ppsbin_id'] = mainstore.getSelectedBin();
            data['event_data']['type'] = mainstore.getExceptionType();
            ActionCreators.postDataToInterface(data);
            break;
          case appConstants.CANCEL_SCAN_ALL:
            data['event_name'] = 'cancel_scan_all';
            ActionCreators.postDataToInterface(data);
            break;
          case appConstants.CONFIRM_BUTTON:
            data['event_name'] = 'pick_back_exception';
            data['event_data']['action'] = 'confirm_button_press';
            ActionCreators.postDataToInterface(data);
            break;
          case appConstants.BACK_BUTTON_PRESS:
            data['event_name'] = 'pick_back_exception';
            data['event_data']['action'] = 'back_button_press';
            ActionCreators.postDataToInterface(data);
            break;
          default:
            return true;
        }
        break;
      case appConstants.AUDIT:
        data['event_name'] = 'audit_actions';
        switch (action) {
          case appConstants.CANCEL_SCAN:
            data['event_data']['type'] = 'cancel_audit';
            ActionCreators.postDataToInterface(data);
            break;
          case appConstants.CLOSE_MODAL:
            closeModalBox();
            break;
          case appConstants.GENERATE_REPORT:
            data['event_data']['type'] = 'generate_report';
            ActionCreators.postDataToInterface(data);
            break;
          case appConstants.CANCEL_FINISH_AUDIT:
            data['event_data']['type'] = 'cancel_finish_audit';
            ActionCreators.postDataToInterface(data);
            break;
          case appConstants.FINISH_CURRENT_AUDIT:
            data['event_data']['type'] = 'finish_current_audit';
            ActionCreators.postDataToInterface(data);
            break;
          case appConstants.AUDIT_NEXT_SCREEN:
            ActionCreators.changeAuditExceptionScreen('second_screen');
            break;
          case appConstants.SEND_KQ_QTY:
            data['event_name'] = 'audit_actions';
            data['event_data']['type'] = 'exception_response';
            data['event_data']['event'] = mainstore.getExceptionType();
            data['event_data']['quantity'] = mainstore.getkQQuanity();
            ActionCreators.postDataToInterface(data);
            break;
          case appConstants.SEND_AUDIT_DAMAGED_ENTITY_DETAILS:
            data['event_name'] = 'audit_actions';
            data['event_data']['type'] = 'exception_response';
            data['event_data']['event'] = 'process_damaged_boxes';
            var damagedQtyCount = mainstore.getDamagedQuantity();
            var damagedBoxDetails = mainstore.getDamagedBoxDetails();
            damagedBoxDetails[0].damaged_qty = damagedQtyCount;
            data['event_data']['damaged_boxes'] = damagedBoxDetails;
            ActionCreators.postDataToInterface(data);
            break;

          case appConstants.SEND_AUDIT_DAMAGED_ENTITY_DETAILS_ON_CONFIRM:
            data['event_name'] = 'audit_actions';
            data['event_data']['type'] = 'exception_response';
            data['event_data']['event'] = mainstore.getExceptionType();
            ActionCreators.postDataToInterface(data);
            break;

          case appConstants.CANCEL_EXCEPTION_TO_SERVER:
            data['event_name'] = 'cancel_exception';
            ActionCreators.postDataToInterface(data);
            break;
          default:
            return true;
        }
        break;
      case appConstants.PERIPHERAL_MANAGEMENT:
        switch (action) {
          case appConstants.ADD_SCANNER:
            this.showModal(null, 'enter_barcode');
            break;

          case appConstants.ADD_SCANNER_DETAILS:
            $('.modal:not(.notification-error)').modal('hide');
            peripheralId = document.getElementById('add_scanner').value;
            peripheralData['peripheral_id'] = peripheralId;
            peripheralData['peripheral_type'] = 'barcode_scanner';
            ActionCreators.updateData(peripheralData, 'POST');
            closeModalBox();
            document.getElementById('add_scanner').value = '';
            break;

          case appConstants.CANCEL_ADD_SCANNER:
            closeModalBox();
            location.reload();
            break;
          case appConstants.CANCEL_CLOSE_SCANNER:
            closeModalBox();
            //location.reload();
            break;
          case appConstants.CANCEL_PPTL:
            location.reload();
            break;
        }

        break;
      case appConstants.SEARCH_MANAGEMENT:
        switch (action) {
          case appConstants.BACK:
            location.reload();
            break;
        }
        break;
      case appConstants.PRE_PUT:
        switch (action) {
          case appConstants.CANCEL_EXCEPTION_MODAL:
            this.showModal(appConstants.PRE_PUT, 'cancel_exception');
            break;
          case appConstants.CANCEL_SCAN:
            data['event_name'] = 'cancel_barcode_scan';
            data['event_data']['barcode'] = this.props.barcode;
            ActionCreators.postDataToInterface(data);
            break;
          case appConstants.RELEASE_MTU:
            data['event_name'] = 'release_mtu';
            ActionCreators.postDataToInterface(data);
            break;
          case appConstants.CANCEL_EXCEPTION_TO_SERVER:
            data['event_name'] = 'cancel_exception';
            ActionCreators.postDataToInterface(data);
            closeModalBox();
            break;
          case appConstants.SEND_EXCESS_ITEMS_BIN:
            data['event_name'] = 'pre_put_exception';
            data['event_data']['action'] = 'finish_exception';
            data['event_data']['event'] = mainstore.getExceptionType();
            ActionCreators.postDataToInterface(data);
            break;
          case appConstants.CANCEL_LAST_SCAN:
            data['event_name'] = 'cancel_last_scan';
            ActionCreators.postDataToInterface(data);
            break;
          case appConstants.CLOSE_CANCEL_EXCEPTION:
            closeModalBox();
            break;
          default:
            return true;
        }
        break;
      default:
        return true;
    }
  },
  showModal: function (data, type) {
    ActionCreators.showModal({
      data: data,
      type: type
    });
    $('.modal').modal();
  },
  render: function () {
    if (this.props.disabled == false)
      return (
        <a
          className={
            this.props.color == 'orange'
              ? 'custom-button orange '
              : 'custom-button black '
          }
          onClick={this.performAction.bind(
            this,
            this.props.module,
            this.props.action
          )}
        >
          {' '}
          {this.props.text}{' '}
        </a>
      );
    else
      return (
        <a
          className={
            this.props.color == 'orange'
              ? 'custom-button disabled orange'
              : 'custom-button disabled black'
          }
        >
          {' '}
          {this.props.text}{' '}
        </a>
      );
  }
});

module.exports = Button1;
