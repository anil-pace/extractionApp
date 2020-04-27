var React = require('react')
var mainstore = require('../stores/mainstore')
var Header = require('./Header')
var KQ = require('./ProductDetails/KQ')
var Navigation = require('./Navigation/Navigation.react')
var Spinner = require('./Spinner/LoaderButler')
var Notification = require('./Notification/Notification')
var Bins = require('./Bins/Bins.react')
var BinsFlex = require('./Bins/BinsFlexArrange.react')
var Button1 = require('./Button/Button')
var Wrapper = require('./ProductDetails/Wrapper')
var WrapperSplitRoll = require('./ProductDetails/WrapperSplitRoll')
var appConstants = require('../constants/appConstants')
var Rack = require('./Rack/MsuRack.js')
var BoxSerial = require('./BoxSerial.js')
var Modal = require('./Modal/Modal')
var CurrentSlot = require('./CurrentSlot')
var BinMap = require('./BinMap')
var PrdtDetails = require('./PrdtDetails/ProductDetails.js')
var CommonActions = require('../actions/CommonActions')
var Exception = require('./Exception/Exception')
var TabularData = require('./TabularData')
var OrderDetails = require('./OrderDetails/OrderDetails.js')
var Pallet = require('./Pallet/pallet')
var CheckList = require('./CheckList.js')
var utils = require('../utils/utils.js')
var PackingDetails = require('./PrdtDetails/PackingDetails.js')
var SplitPPS = require('./SplitPPS')
var PreviousDetails = require('./PreviousDetails')
var TextEditor = require('./ProductDetails/textEditor')
var ItemTable = require('./itemTable')
var CurrentMtu = require('./CurrentMtu')
var ColorCodeMtu = require("./colorCodeMtu")

var checkListOpen = false

function getStateData() {
  var screenData = mainstore.getScreenData()
  var splitPPSData = {
    groupInfo: mainstore._getBinMapDetails(),
    groupOrientation: mainstore._getBinMapOrientation()
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
    // if (
    //   this.state.PickFrontScreenId === appConstants.PICK_FRONT_MORE_ITEM_SCAN ||
    //   this.state.PickFrontScreenId === appConstants.PICK_FRONT_PPTL_PRESS ||
    //   this.state.PickFrontScreenId === appConstants.PICK_FRONT_PACKING_BOX
    // ) {
    //   this.showModal(
    //     this.state.PickFrontChecklistDetails,
    //     this.state.PickFrontChecklistIndex
    //   )
    // }
    mainstore.addChangeListener(this.onChange)
  },
  componentWillUnmount: function () {
    mainstore.removeChangeListener(this.onChange)
  },
  onChange: function () {
    this.setState(getStateData())
    // if (
    //   this.state.PickFrontScreenId === appConstants.PICK_FRONT_MORE_ITEM_SCAN ||
    //   this.state.PickFrontScreenId === appConstants.PICK_FRONT_PPTL_PRESS ||
    //   this.state.PickFrontScreenId === appConstants.PICK_FRONT_PACKING_BOX
    // ) {
    //   this.showModal(
    //     this.state.PickFrontChecklistDetails,
    //     this.state.PickFrontChecklistIndex
    //   )
    // }
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
  // showModal: function (data, index, manual) {
  //   if (manual == true) checkListOpen = false
  //   var data = {
  //     checklist_data: data,
  //     checklist_index: index,
  //     product_details: this.state.PickFrontProductDetails
  //   }
  //   console.log(this.state.PickFrontChecklistOverlayStatus, checkListOpen)
  //   if (
  //     this.state.PickFrontChecklistOverlayStatus === true &&
  //     checkListOpen == false
  //   ) {
  //     checkListOpen = true
  //     setTimeout(function () {
  //       CommonActions.showModal({
  //         data: data,
  //         type: 'pick_checklist'
  //       })
  //       $('.modal').modal()
  //       //$('.modal').data('bs.modal').escape(); // reset keyboard
  //       $('.modal').data('bs.modal').options.backdrop = 'static'
  //       return false
  //     }, 0)
  //   } else if (
  //     this.state.PickFrontChecklistOverlayStatus === false &&
  //     checkListOpen == true
  //   ) {
  //     setTimeout(function () {
  //       $('.modal').modal('hide')

  //       $('.modal')
  //         .data('bs.modal')
  //         .escape() // reset keyboard
  //       $('.modal').data('bs.modal').options.backdrop = true
  //       $('button.close', $('.modal')).show()
  //     }, 0)
  //     checkListOpen = false
  //   }
  // },
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
            module={appConstants.PICK_FRONT}
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
          console.log("%c     => wait for mtu =? screen", "color: green")
          this._navigation = (
            <Navigation
              navData={this.state.PickFrontNavData}
              serverNavData={this.state.PickFrontServerNavData}
              navMessagesJson={this.props.navMessagesJson}
            />
          )

          this._component = (
            <div style={{"opacity": "0.2"}} className='grid-container'>
              <div className='main-container'> 
                <div style={{"display": "flex", "flexFlow": "column", "width":"70%"}}>
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
          console.log("%c     => select mtu point =? screen", "color: green")
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
                  <div style={{"display": "flex", "flexFlow": "column", "width":"70%"}}>
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
                  module={appConstants.PICK_FRONT}
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
                  module={appConstants.PICK_FRONT}
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
                 {this.state.getCurrentMtu ? <CurrentMtu currentMtu={this.state.getCurrentMtu} /> :" "}
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
                        module={appConstants.PICK_FRONT} 
                        action={appConstants.CANCEL_ONLY} 
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
                  {this.state.getCurrentMtu ? <CurrentMtu currentMtu={this.state.getCurrentMtu} /> :" "}
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
                  {this.state.getCurrentMtu ? <CurrentMtu currentMtu={this.state.getCurrentMtu} /> :" "}
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

          case appConstants.PUT_TOTE_IN_MTU:
            this._navigation = (
              <Navigation
                navData={this.state.PickFrontNavData}
                serverNavData={this.state.PickFrontServerNavData}
                navMessagesJson={this.props.navMessagesJson}
              />
            )
  
            this._component = (
              <div className='grid-container'>
                  <CurrentMtu />
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
                        module={appConstants.PICK_FRONT} 
                        action={appConstants.CANCEL_SCAN} 
                        screenId={mainstore.getScreenId()}
                        color={"black"} />
                  </div>
                </div>
            )
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
