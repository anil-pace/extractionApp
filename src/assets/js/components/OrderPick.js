var React = require('react')
var mainstore = require('../stores/mainstore')
var Header = require('./Header')
var Navigation = require('./Navigation/Navigation.react')
var Notification = require('./Notification/Notification')
var Button1 = require('./Button/Button')
var appConstants = require('../constants/appConstants')
var Rack = require('./Rack/MsuRack.js')
var Modal = require('./Modal/Modal')
var CommonActions = require('../actions/CommonActions')
var Exception = require('./Exception/Exception')
var SplitPPS = require('./SplitPPS')
var CurrentMtu = require('./CurrentMtu')
var ColorCodeMtu = require("./colorCodeMtu")
var TabularData = require("./TabularData");


function getStateData() {
  var screenData = mainstore.getScreenData()
  var splitPPSData = {
  }

  return Object.assign({}, screenData, splitPPSData)
}

var PickFront = React.createClass({
  _notification: '',
  _component: '',
  _navigation: '',
  getInitialState: function () {
    return getStateData()
  },
  componentWillMount: function () {
    mainstore.addChangeListener(this.onChange)
  },
  componentWillUnmount: function () {
    mainstore.removeChangeListener(this.onChange)
  },
  onChange: function () {
    this.setState(getStateData())
  },

  getNotificationComponent: function () {
    if (this.state.PickFrontNotification != undefined) {
      this._notification = (
        <Notification
          notification={this.state.PickFrontNotification}
          navMessagesJson={this.props.navMessagesJson}
        />
      )
    } else {
      if ($('.modal.notification-error').is(':visible')) {
        setTimeout(function () {
          $('.modal.notification-error').data(
            'bs.modal'
          ).options.backdrop = true
          $('.modal-backdrop').remove()
          $('.modal.notification-error').modal('hide')
          $('.modal').removeClass('notification-error')
        }, 0)

        return null
      } else if ($('.modal.in').is(':visible')) {
        setTimeout(function () {
          if (
            $('.modal.in')
              .find('div')
              .hasClass('modal-footer')
          ) {
            //check when errorcode is true and modal has buttons
            $('.modal.in').data('bs.modal').options.backdrop = 'static'
          } else {
            //check when errorcode is true and modal has NO buttons
            $('.modal.in').data('bs.modal').options.backdrop = true
          }
        }, 0)
        return null
      }
      this._notification = ''
    }
  },
  getExceptionComponent: function () {
    var _rightComponent = ''
    this._navigation = ''
    return (
      <div className='grid-container exception'>
        <Modal />
        <Exception data={this.state.PickFrontExceptionData} action={true} />
        <div className='exception-right' />
        <div className='cancel-scan'>
          <Button1
            disabled={false}
            text={_('Cancel Exception')}
            module={appConstants.ORDER_PICK}
            action={appConstants.CANCEL_EXCEPTION}
            color={'black'}
          />
        </div>
      </div>
    )
  },
  callAPItoGetData: function (data) {
    CommonActions.getOrphanItemData(data)
  },

  getScreenComponent: function (screen_id) {
    switch (screen_id) {
      case appConstants.WAIT_FOR_MTU:
        this._navigation = (
          <Navigation
            navData={this.state.PickFrontNavData}
            serverNavData={this.state.PickFrontServerNavData}
            navMessagesJson={this.props.navMessagesJson}
          />
        )

        this._component = (
          <div style={{ "opacity": "0.2" }} className='grid-container'>
            <div className='main-container'>
              <div style={{ "display": "flex", "flexFlow": "column", "width": "70%" }}>
                <SplitPPS
                  displayBinId={true}
                  groupInfo={this.state.udpBinMapDetails}
                />
                <ColorCodeMtu />
              </div>
            </div>
          </div>
        )
        break;

      case appConstants.SELECT_MTU_POINT:
        this._navigation = (
          <Navigation
            navData={this.state.PickFrontNavData}
            serverNavData={this.state.PickFrontServerNavData}
            navMessagesJson={this.props.navMessagesJson}
          />
        )

        this._component = (
          <div className='grid-container'>
            <div className='main-container'>
              <div style={{ "display": "flex", "flexFlow": "column", "width": "70%" }}>
                <SplitPPS
                  displayBinId={true}
                  groupInfo={this.state.udpBinMapDetails}
                />
                <ColorCodeMtu />
              </div>
            </div>
          </div>
        )
        break;

      case appConstants.REMOVE_ALL_TOTES:
        if (this.state.isToteFlowEnabled) { // for Tote flow
          var removeAllButton = (
            <Button1
              disabled={false}
              text={_('Remove All')}
              module={appConstants.ORDER_PICK}
              action={appConstants.REMOVE_ALL_BUTTON}
              screenId={mainstore.getScreenId()}
              color={'orange'}
            />
          )
        } else { // for Non-Tote Flow
          var removeAllButton = (
            <Button1
              disabled={false}
              text={_('Remove All')}
              module={appConstants.ORDER_PICK}
              action={appConstants.REMOVE_ALL_BUTTON_WITHOUT_TOTE_MODAL}
              screenId={mainstore.getScreenId()}
              color={'orange'}
            />
          )
        }

        this._navigation = (
          <Navigation
            navData={this.state.PickFrontNavData}
            serverNavData={this.state.PickFrontServerNavData}
            navMessagesJson={this.props.navMessagesJson}
          />
        )

        this._component = (
          <div className='grid-container'>
            <Modal />
            {this.state.getCurrentMtu ? <CurrentMtu currentMtu={this.state.getCurrentMtu} /> : " "}
            <div className="splitPps-zoomed-out">
              <SplitPPS
                displayBinId={true}
                groupInfo={this.state.udpBinMapDetails}
              />

            </div>
            <div className='main-container'>
              <Rack
                isDrawer={this.state.isDrawer}
                slotType={this.state.SlotType}
                rackData={this.state.PickFrontRackDetails}
              />
            </div>
            <div className='cancel-scan'>
              <Button1
                disabled={false}
                text={_("Cancel")}
                module={appConstants.ORDER_PICK}
                action={appConstants.CANCEL_SCAN}
                screenId={mainstore.getScreenId()}
                color={"black"} />
            </div>
            {removeAllButton}
          </div>
        )
        break;

      case appConstants.SCAN_EMPTY_TOTE:
        this._navigation = (
          <Navigation
            navData={this.state.PickFrontNavData}
            serverNavData={this.state.PickFrontServerNavData}
            navMessagesJson={this.props.navMessagesJson}
          />
        )

        this._component = (
          <div className='grid-container'>
            {this.state.getCurrentMtu ? <CurrentMtu currentMtu={this.state.getCurrentMtu} /> : " "}
            <div className="splitPps-zoomed-out">
              <SplitPPS
                displayBinId={true}
                groupInfo={this.state.udpBinMapDetails}
              />

            </div>
            <div className='main-container'>
              <Rack
                //isDrawer={this.state.isDrawer}
                slotType={this.state.SlotType}
                rackData={this.state.PickFrontRackDetails}
              />
            </div>
          </div>
        )
        break;

      case appConstants.SCAN_EMPTY_SLOT:
        this._navigation = (
          <Navigation
            navData={this.state.PickFrontNavData}
            serverNavData={this.state.PickFrontServerNavData}
            navMessagesJson={this.props.navMessagesJson}
          />
        )

        this._component = (
          <div className='grid-container'>
            {this.state.getCurrentMtu ? <CurrentMtu currentMtu={this.state.getCurrentMtu} /> : " "}
            <div className="splitPps-zoomed-out">
              <SplitPPS
                displayBinId={true}
                groupInfo={this.state.udpBinMapDetails}
              />

            </div>
            <div className='main-container'>
              <Rack
                //isDrawer={this.state.isDrawer}
                slotType={this.state.SlotType}
                rackData={this.state.PickFrontRackDetails}
              />
            </div>
            <div className='cancel-scan'>
              <Button1
                disabled={false}
                text={_("Cancel")}
                module={appConstants.ORDER_PICK}
                action={appConstants.CANCEL_SCAN}
                screenId={mainstore.getScreenId()}
                color={"black"} />
            </div>
          </div>
        )
        break;
      case appConstants.SCANNER_MANAGEMENT:
        this._navigation = (
          <Navigation
            navData={this.state.PickFrontNavData}
            serverNavData={this.state.PickFrontServerNavData}
            navMessagesJson={this.props.navMessagesJson}
          />
        );
        var _button;
        if (this.state.PickFrontScreenId == appConstants.SCANNER_MANAGEMENT) {
          _button = (
            <div className="staging-action">
              <Button1
                disabled={false}
                text={_("BACK")}
                module={appConstants.PERIPHERAL_MANAGEMENT}
                status={true}
                action={appConstants.CANCEL_ADD_SCANNER}
                color={"black"}
              />
              <Button1
                disabled={false}
                text={_("Add Scanner")}
                module={appConstants.PERIPHERAL_MANAGEMENT}
                status={true}
                action={appConstants.ADD_SCANNER}
                color={"orange"}
              />
            </div>
          );
        } else {
          _button = (
            <div className="staging-action">
              <Button1
                disabled={false}
                text={_("BACK")}
                module={appConstants.PERIPHERAL_MANAGEMENT}
                status={true}
                action={appConstants.CANCEL_PPTL}
                color={"black"}
              />
            </div>
          );
        }
        this._component = (
          <div className="grid-container audit-reconcilation">
            <div className="row scannerHeader">
              <div className="col-md-6">
                <div className="ppsMode">
                  {" "}
                  {/* PPS Mode : {this.state.PickFrontPpsMode.toUpperCase()}{" "} */}
                </div>
              </div>
              <div className="col-md-6">
                <div className="seatType">
                  {" "}
                  {/* Seat Type : {this.state.PickFrontSeatType.toUpperCase()} */}
                </div>
              </div>
            </div>
            <TabularData data={this.state.utility} />
            {_button}
            <Modal />
          </div>
        );
        break;

      default:
        return true
    }
  },

  render: function (data) {
    this.getNotificationComponent()
    this.getScreenComponent(this.state.PickFrontScreenId)

    return (
      <div className='main'>
        <Header />
        {this._navigation}
        {this._component}
        {this._notification}
      </div>
    )
  }
})

module.exports = PickFront
