var React = require('react');
var ActionCreators = require('../../actions/CommonActions');
var appConstants = require('../../constants/appConstants');
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

      case appConstants.PICK_FRONT:
        switch (action) {
          case appConstants.CANCEL_SCAN:
            alert("cancel scan button clickecd");
            data['event_name'] = appConstants.CANCEL_SCAN;
            ActionCreators.postDataToInterface(data);
            break;


          case appConstants.NEW_CARRYING_UNIT:
            data['event_name'] = appConstants.NEW_CARRYING_UNIT;
            ActionCreators.postDataToInterface(data);
            this.showModal(
              appConstants.PICK_FRONT,
              appConstants.NEW_CARRYING_UNIT
            );
            break;

          case appConstants.CANCEL_SCAN_MODAL:
            this.showModal(
              appConstants.PICK_FRONT,
              appConstants.CANCEL_SCAN_ALL
            );
            break;

          case appConstants.CONFIRM_FROM_USER:
            ActionCreators.changePickFrontExceptionScreen('confirm_from_user');
            break;

          case appConstants.VALIDATE_AND_SEND_DATA_TO_SERVER:
            ActionCreators.validateAndSendDataToServer();
            break;

          case appConstants.REMOVE_ALL_BUTTON:
            alert("Remove all buttons clicked");
            data['event_name'] = 'remove_all_totes';
            ActionCreators.postDataToInterface(data);
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
