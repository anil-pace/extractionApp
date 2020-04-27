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

  performAction: function (module, action, screenId) {
    var peripheralId;
    var data = {
      // event_name: '',
      // event_data: {}
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

      case appConstants.ORDER_PICK:
        switch (action) {
          case appConstants.CANCEL_SCAN:
            data["name"] = "cancel_clicked";
            data["data"] = null;
            data["screen_id"] = screenId;
            ActionCreators.postDataToInterface(data, mainstore.getCurrentStationId());
            break;
          
          case appConstants.CANCEL_SCAN:
            data["name"] = "cancel_clicked";
            data["data"] = null;
            data["screen_id"] = screenId;
            ActionCreators.postDataToInterface(data, mainstore.getCurrentStationId());
            break;
          
          case appConstants.REMOVE_ALL_BUTTON:
            data['name'] = 'all_totes_removed';
            data["data"] = null;
            data["screen_id"] = screenId;
            ActionCreators.postDataToInterface(data);
            break;
          
          case appConstants.REMOVE_ALL_BUTTON_WITHOUT_TOTE_MODAL:
              this.showModal(
                appConstants.PICK_FRONT,
                appConstants.REMOVE_ALL_BUTTON_CONFIRMATION
              );
              break;
        
          case appConstants.CANCEL_REMOVE_ALL_ENTITIES:
            closeModalBox();
            break;

          case appConstants.CONFIRM_REMOVE_ALL_ENTITIES:
            data["name"] = "confirm_clicked";
            data["data"] = null;
            data["screen_id"] = screenId;
            ActionCreators.postDataToInterface(data, mainstore.getCurrentStationId());
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
            this.props.action,
            this.props.screenId
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
