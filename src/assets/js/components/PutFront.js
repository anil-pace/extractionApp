
var React = require('react');
var PutFrontStore = require('../stores/PutFrontStore');
var Header = require('./Header');
var Navigation = require("./Navigation/Navigation.react");
var Spinner = require("./Spinner/LoaderButler");
var Notification = require("./Notification/Notification");
var Bins = require("./Bins/Bins.react");
var BinsFlex = require("./Bins/BinsFlexArrange.react");
var NumericIndicator = require('./ProductDetails/NumericIndicator');
var Button1 = require("./Button/Button");
var Wrapper = require('./ProductDetails/PutFrontWrapper');
var WrapperSplitRoll = require('./ProductDetails/WrapperSplitRoll');
var appConstants = require('../constants/appConstants');
var allresourceConstants = require('../constants/resourceConstants');
var Rack = require('./Rack/MsuRack.js');
var Modal = require('./Modal/Modal');
var ReactModal = require('./Modal/ReactModal');
var mainstore = require('../stores/mainstore');
var Exception = require('./Exception/Exception');
var ExceptionHeader = require('./ExceptionHeader');
var KQ = require('./ProductDetails/KQ');
var KQExceptionMissing = require('./ProductDetails/KQExceptionMissing');
var KQExceptionDamaged = require('./ProductDetails/KQExceptionDamaged');
var TabularData = require('./TabularData');
var BinMap = require('./BinMap');
var SplitPPS = require('./SplitPPS');
var utils = require('../utils/utils.js');
var PreviousDetails = require('./PreviousDetails');
var ProductDetUDP = require('./ProductDetails/ProductDetUDP');
var ActionCreators = require('../actions/CommonActions');
var PrdtDetails = require('./PrdtDetails/ProductDetails.js');
var CurrentBin = require('./CurrentBin');
var TextEditor = require('./ProductDetails/textEditor');
var ItemTable = require('./itemTable')
var CheckList = require("./CheckList")





var PutFront = React.createClass({
  _notification: '',
  _component: '',
  _navigation: '',
  _modalContent: '',
  getInitialState: function () {
    return this.getStateData();
  },
  componentWillReceiveProps: function () {
    this.setState(this.getStateData());
  },
  getStateData: function () {
    var screenData = mainstore.getScreenData();
    var splitPPSData = {
      BinMapDetails: mainstore._getBinMapDetails(),
      groupOrientation: mainstore._getBinMapOrientation(),
      udpBinMapDetails: mainstore.getUDPMapDetails(),

      PutFrontScreenId: mainstore.getScreenId(),
      PutFrontExceptionStatus: mainstore.getExceptionStatus(),
      PutFrontNavData: mainstore.getNavData(),
      PutFrontServerNavData: mainstore.getServerNavData(),
      MobileFlag: mainstore._getMobileFlag(),
      BinMapGroupDetails: mainstore.getSelectedBinGroup(),
      SplitScreenFlag: mainstore._getSplitScreenFlag(),
      PutFrontScanDetails: mainstore.scanDetails(),
      PutFrontProductDetails: mainstore.productDetails(),
      selectedTotes: mainstore.getSelectedTotes(),
      PutFrontChecklistData: mainstore.getChecklistDockData(),
      PutFrontChecklistIndex: mainstore.getChecklistDockIdx(),
      PutFrontNotification: mainstore.getNotificationData(),
      PreviousDetails: mainstore.getPreviousPutDetails(),
      PutFrontCurrentBin: mainstore.getCurrentSelectedBin(),
      PutFrontCurrentBinCount: mainstore.getPutFrontCurrentBinCount(),
      PutFrontRackDetails: mainstore.getRackDetails(),
      missingItemList: mainstore.getMissingItemList(),
      ToteId: mainstore.getToteId(),
      selectedPPSBin: mainstore._getSelectedPpsBin(),
      PutFrontItemUid: mainstore.getItemUid(),
      PutFrontIsCrossDockEnabled: mainstore.IsCrossDockEnabled()
    }


    return Object.assign({}, screenData, splitPPSData);
  },
  componentWillMount: function () {
    mainstore.addChangeListener(this.onChange);
  },
  componentWillUnmount: function () {
    mainstore.removeChangeListener(this.onChange);
  },
  onChange: function () {
    this.setState(this.getStateData());
  },
  getNotificationComponent: function () {
    if (this.state.PutFrontNotification != undefined) {
      this._notification = <Notification notification={this.state.PutFrontNotification} navMessagesJson={this.props.navMessagesJson} />
    }
    else {
      if ($(".modal.notification-error").is(":visible")) {
        setTimeout((function () {
          $('.modal.notification-error').data('bs.modal').options.backdrop = true
          $(".modal-backdrop").remove()
          $(".modal.notification-error").modal("hide");
          $(".modal").removeClass("notification-error")

        }), 0)

        return null
      }
      else if ($(".modal.in").is(":visible")) {
        setTimeout((function () {
          if ($('.modal.in').find("div").hasClass("modal-footer")) {
            //check when errorcode is true and modal has buttons
            $('.modal.in').data('bs.modal').options.backdrop = 'static';
          }
          else {
            //check when errorcode is true and modal has NO buttons
            $('.modal.in').data('bs.modal').options.backdrop = true;
          }
        }), 0)
        return null
      }
      this._notification = "";
    }

  },

  getExceptionComponent: function () {
    var _rightComponent = '';
    this._navigation = '';
    return (
      <div className='grid-container exception'>
        <Modal />
        <Exception data={this.state.PutFrontExceptionData} action={true} />
        <div className="exception-right"></div>
        <div className='cancel-scan'>
          <Button1 disabled={false} text={_("Cancel Exception")} module={appConstants.PUT_FRONT} action={appConstants.CANCEL_EXCEPTION_MODAL} color={"black"} />
        </div>
      </div>
    );
  },
  callAPItoGetData: function (data) {
    ActionCreators.getOrphanItemData(data);
  },

  getScreenComponent: function (screen_id) {
    switch (screen_id) {
      case appConstants.PUT_FRONT_WAITING_FOR_RACK:
        if (this.state.PutFrontExceptionStatus == false) {
          this._navigation = (<Navigation navData={this.state.PutFrontNavData} serverNavData={this.state.PutFrontServerNavData} navMessagesJson={this.props.navMessagesJson} showSpinner={this.state.MobileFlag} />);
          this._component = (
            <div className='grid-container'>
              <Modal />
              <div className='main-container'>
                {this.state.MobileFlag ? <SplitPPS orientation={this.state.groupOrientation} groupInfo={this.state.BinMapDetails} undockAwaited={this.state.UndockAwaited} docked={this.state.DockedGroup} /> : <Spinner />}
              </div>
            </div>
          );
        } else {
          this._component = this.getExceptionComponent();
        }

        break;
      case appConstants.PUT_FRONT_SCAN:
        if (this.state.PutFrontExceptionStatus == false) {
          if (this.state.OrigBinUse || this.state.PutFrontBinCoordinatePlotting) {
            binComponent = (<div style={{ width: "100%", marginLeft: "0" }} className="binsFlexWrapperContainer">
              <BinsFlex binsData={this.state.PutFrontBinData} screenId={this.state.PutFrontScreenId} seatType={this.state.SeatType} binCoordinatePlotting={true} />
              <Wrapper productDetails={this.state.PutFrontProductDetails} itemUid={this.state.PutFrontItemUid} />
            </div>)
          }
          else {
            binComponent = (<div className='main-container'>
              <Bins binsData={this.state.PutFrontBinData} screenId={this.state.PutFrontScreenId} />
              <Wrapper productDetails={this.state.PutFrontProductDetails} itemUid={this.state.PutFrontItemUid} />
            </div>)
          }
          this._navigation = (<Navigation navData={this.state.PutFrontNavData} serverNavData={this.state.PutFrontServerNavData} navMessagesJson={this.props.navMessagesJson} />);
          this._component = (
            <div className='grid-container'>
              <Modal />
              {this.state.SplitScreenFlag && <BinMap orientation={this.state.groupOrientation} mapDetails={this.state.BinMapDetails} selectedGroup={this.state.BinMapGroupDetails} screenClass='putFrontFlow' />}
              {binComponent}
            </div>
          );
        } else {
          var _rightComponent = '';
          this._navigation = '';
          this._component = (
            <div className='grid-container exception'>
              <Modal />
              <Exception data={this.state.PutFrontExceptionData} action={true} />
              <div className="exception-right"></div>
              <div className='cancel-scan'>
                <Button1 disabled={false} text={_("Cancel Exception")} module={appConstants.PUT_FRONT} action={appConstants.CANCEL_EXCEPTION_TO_SERVER} color={"black"} />
              </div>
            </div>
          );
        }
        break;
      case appConstants.PUT_FRONT_PLACE_ITEMS_IN_RACK:
        if (this.state.PutFrontExceptionStatus == false) {
          this._navigation = (<Navigation navData={this.state.PutFrontNavData} serverNavData={this.state.PutFrontServerNavData} navMessagesJson={this.props.navMessagesJson} />);
          //need to check this case, if we need flexible bins here?
        let isHeavyItem = this.state.PutFrontHeavyItemsFlag;

          this._component = (
            <div className='grid-container'>
              <Modal />
              {this.state.SplitScreenFlag && <BinMap orientation={this.state.groupOrientation} mapDetails={this.state.BinMapDetails} selectedGroup={this.state.BinMapGroupDetails} screenClass='putFrontFlow' />}
              <div className={"single-bin" + (this.state.SplitScreenFlag ? ' gor-fixed-position' : '') + (this.state.SplitScreenFlag ? '' : ' fix-top')}>
                <Bins binsData={this.state.PutFrontCurrentBin} screenId={this.state.PutFrontScreenId} />
                <div className="text">{_("CURRENT BIN")}</div>
              </div>
              <div className='main-container'>
                <Rack isDrawer={this.state.isDrawer} slotType={this.state.SlotType} rackData={this.state.PutFrontRackDetails} putDirection={this.state.PutFrontPutDirection} heavyItemInfo={isHeavyItem}/>
                <Wrapper scanDetails={this.state.PutFrontScanDetails} productDetails={this.state.PutFrontProductDetails} itemUid={this.state.PutFrontItemUid} />
              </div>
              <div className='cancel-scan'>
                <Button1 disabled={false} text={_("Cancel Scan")} module={appConstants.PUT_FRONT} action={appConstants.CANCEL_SCAN} barcode={this.state.PutFrontItemUid} color={"black"} />
              </div>

            </div>
          );
        } else {
          this._component = this.getExceptionComponent();
        }
        break;
      case appConstants.PUT_FRONT_WAITING_UNDOCK:
        if (this.state.PutFrontExceptionStatus == false) {
          this._navigation = (<Navigation navData={this.state.PutFrontNavData} serverNavData={this.state.PutFrontServerNavData} navMessagesJson={this.props.navMessagesJson} subMessage={allresourceConstants.UNDOCK_PUSH} />);
          this._component = (
            <div className='grid-container'>
              <Modal />
              <div className='main-container'>
                <SplitPPS orientation={this.state.groupOrientation} groupInfo={this.state.BinMapDetails} undockAwaited={this.state.UndockAwaited} docked={this.state.DockedGroup} />
              </div>
            </div>
          );
        } else {
          this._component = this.getExceptionComponent();
        }
        break;



      case appConstants.PUT_FRONT_EXCEPTION_WAREHOUSE_FULL:
        var selected_screen;

        this._navigation = (<Navigation navData={this.state.PutFrontNavData} serverNavData={this.state.PutFrontServerNavData} navMessagesJson={this.props.navMessagesJson} />);
        if (!this.state.GetIRTScanStatus) {
          selected_screen = (
            <div>
              <div className="kq-exception">
                <div className="gor-info-text">{_("Empty the rollcage to undock")}</div>
              </div>
              <div className="staging-action">
                <Button1 disabled={this.state.PutFrontExceptionFlag} text={_("Confirm")} module={appConstants.PUT_FRONT} action={appConstants.WAREHOUSEFULL_EXCEPTION} color={"orange"} />
              </div>
            </div>);
        }
        else {
          selected_screen = (
            <div className="kq-exception">
              <div className="gor-info-text">{_("Please put remaining entities in IRT bin and scan the bin")}</div>
            </div>
          );
        }
        this._component = (
          <div className='grid-container'>
            <Modal />
            {this.state.SplitScreenFlag && <BinMap orientation={this.state.groupOrientation} mapDetails={this.state.BinMapDetails} selectedGroup={this.state.BinMapGroupDetails} screenClass='putFrontFlow' />}
            {selected_screen}
          </div>
        );
        break;

      case appConstants.PUT_FRONT_PPTL_PRESS:
        if (this.state.PutFrontExceptionStatus == false) {
          if (this.state.OrigBinUse) {
            binComponent = (<BinsFlex binsData={this.state.PutFrontBinData} screenId={this.state.PutFrontScreenId} seatType={this.state.SeatType} />);
          } else {
            binComponent = (<div className='main-container'>
              <Bins binsData={this.state.PutFrontBinData} screenId={this.state.PutFrontScreenId} />
            </div>)
          }
          this._navigation = (<Navigation navData={this.state.PutFrontNavData} serverNavData={this.state.PutFrontServerNavData} navMessagesJson={this.props.navMessagesJson} />);
          this._component = (
            <div className='grid-container'>
              <Modal />
              {this.state.SplitScreenFlag && <BinMap orientation={this.state.groupOrientation} mapDetails={this.state.BinMapDetails} selectedGroup={this.state.BinMapGroupDetails} screenClass='putFrontFlow' />}
              {binComponent}
            </div>
          );
        } else {
          this._component = this.getExceptionComponent();
        }
        break;

      case appConstants.PUT_FRONT_BIN_WAREHOUSE_FULL:
      case appConstants.PUT_FRONT_WAREHOUSE_FULL_IRT_SCAN:

        if (this.state.PutFrontExceptionStatus == false) {
          if (this.state.OrigBinUse) {
            binComponent = (<BinsFlex binsData={this.state.PutFrontBinData} screenId={this.state.PutFrontScreenId} seatType={this.state.SeatType} />);
          } else {
            binComponent = (<div className='main-container'>
              <Bins binsData={this.state.PutFrontBinData} screenId={this.state.PutFrontScreenId} />
            </div>)
          }
          this._navigation = (<Navigation navData={this.state.PutFrontNavData} serverNavData={this.state.PutFrontServerNavData} navMessagesJson={this.props.navMessagesJson} />);
          this._component = (
            <div className='grid-container'>
              <Modal />
              {this.state.SplitScreenFlag && <BinMap orientation={this.state.groupOrientation} mapDetails={this.state.BinMapDetails} selectedGroup={this.state.BinMapGroupDetails} screenClass='putFrontFlow' />}
              {binComponent}
            </div>
          );
        } else {
          this._component = this.getExceptionComponent();
        }
        break;
      case appConstants.PUT_FRONT_PLACE_UNMARKED_ENTITY_IN_RACK:
        if (this.state.PutFrontExceptionStatus == false) {
          this._navigation = (<Navigation navData={this.state.PutFrontNavData} serverNavData={this.state.PutFrontServerNavData} navMessagesJson={this.props.navMessagesJson} />);
          //need to check this case, if we need flexible bins here?
          this._component = (
            <div className='grid-container'>
              <Modal />
              {this.state.SplitScreenFlag && <BinMap orientation={this.state.groupOrientation} mapDetails={this.state.BinMapDetails} selectedGroup={this.state.BinMapGroupDetails} screenClass='putFrontFlow' />}
              <div className={"single-bin" + (this.state.SplitScreenFlag ? ' gor-fixed-position' : ' fix-top')}>
                <Bins binsData={this.state.PutFrontCurrentBin} screenId={this.state.PutFrontScreenId} />
                <div className="text">{_("CURRENT BIN")}</div>
              </div>
              <div className='main-container'>
                <Rack isDrawer={this.state.isDrawer} slotType={this.state.SlotType} rackData={this.state.PutFrontRackDetails} />
                <Wrapper scanDetails={this.state.PutFrontScanDetails} productDetails={this.state.PutFrontProductDetails} itemUid={this.state.PutFrontItemUid} />
              </div>
            </div>
          );
        } else {
          this._component = this.getExceptionComponent();
        }
        break;
      case appConstants.PUT_FRONT_SCAN_RACK_FOR_UNMARKED_ENTITY:
        if (this.state.PutFrontExceptionStatus == false) {
          this._navigation = (<Navigation navData={this.state.PutFrontNavData} serverNavData={this.state.PutFrontServerNavData} navMessagesJson={this.props.navMessagesJson} />);
          //need to check this case, if we need flexible bins here?
          this._component = (
            <div className='grid-container'>
              <Modal />
              {this.state.SplitScreenFlag && <BinMap orientation={this.state.groupOrientation} mapDetails={this.state.BinMapDetails} selectedGroup={this.state.BinMapGroupDetails} screenClass='putFrontFlow' />}
              <div className={"single-bin" + (this.state.SplitScreenFlag ? '' : ' fix-top')}>
                <Bins binsData={this.state.PutFrontCurrentBin} screenId={this.state.PutFrontScreenId} />
                <div className="text">{_("CURRENT BIN")}</div>
              </div>
              <div className='main-container'>
                <Rack isDrawer={this.state.isDrawer} slotType={this.state.SlotType} rackData={this.state.PutFrontRackDetails} />
                <Wrapper scanDetails={this.state.PutFrontScanDetails} productDetails={this.state.PutFrontProductDetails} itemUid={this.state.PutFrontItemUid} />
              </div>
              <div className='cancel-scan'>
                <Button1 disabled={false} text={_("Cancel")} module={appConstants.PUT_FRONT} action={appConstants.CANCEL_SCAN} barcode={this.state.PutFrontItemUid} color={"black"} />
              </div>

            </div>
          );
        } else {
          this._component = this.getExceptionComponent();
        }
        break;
      case appConstants.PUT_FRONT_EXCEPTION_DAMAGED_ENTITY:
        var _button, isUnmarked = this.state.isUnmarkedContainer, unmarkedContainer, confirmDisabled, kqHeadMessage;
        var remainingEntitiesToBeScanned = this.state.PutFrontServerNavData.details.slice(-1)[0];
        confirmDisabled = this.state.PutFrontDamagedQuantity.current_qty > 0 ? false : true;
        _button = (<div className="staging-action">
          <Button1 disabled={confirmDisabled} text={_("Confirm")} module={appConstants.PUT_FRONT} action={appConstants.UNMARKED_DAMAGED} color={"orange"} />
        </div>);
        if (isUnmarked) {
          unmarkedContainer = (
            <KQExceptionDamaged scanDetailsDamaged={this.state.PutFrontDamagedQuantity} action={"DAMAGED"} />
          )
          kqHeadMessage = _("Damaged Quantity");
        }
        else {
          unmarkedContainer = (<div>
            <TabularData data={this.state.PutFrontDamagedItems} className='limit-height width-extra ' />
          </div>)
          kqHeadMessage = remainingEntitiesToBeScanned !== 0 ? utils.frntStringTransform("PtF.H.022", [remainingEntitiesToBeScanned]) : _("No more entities to be scanned");
        }
        this._component = (
          <div className='grid-container exception'>
            <Modal />
            <Exception data={this.state.PutFrontExceptionData} />
            <div className="exception-right">
              <div className="main-container">
                <div className="kq-exception">
                  <div className="kq-header">{kqHeadMessage}</div>
                  {unmarkedContainer}

                </div>
              </div>
              <div className="finish-damaged-barcode">
                {_button}
              </div>
            </div>
            <div className='cancel-scan'>
              <Button1 disabled={false} text={_("Cancel Exception")} module={appConstants.PUT_FRONT} action={appConstants.CANCEL_EXCEPTION_MODAL} color={"black"} />
            </div>
          </div>
        );
        break;

      case appConstants.PUT_FRONT_WRONG_UNDOCK:
        if (this.state.PutFrontExceptionStatus == false) {
          this._navigation = (<Navigation navData={this.state.PutFrontNavData} serverNavData={this.state.PutFrontServerNavData} navMessagesJson={this.props.navMessagesJson} subMessage={allresourceConstants.WRONG_UNDOCK} />);
          this._component = (
            <div className='grid-container'>
              <Modal />
              <div className='main-container'>
                <SplitPPS orientation={this.state.groupOrientation} groupInfo={this.state.BinMapDetails} wrongUndock={this.state.WrongUndock} />
              </div>
            </div>
          );
        } else {
          this._component = this.getExceptionComponent();
        }
        break;



      case appConstants.PUT_FRONT_MISSING_DAMAGED_UNSCANNABLE_ENTITY:
        var buttonActivateFlag = mainstore.getExeptionQuanity();
        var UnscannableNI;
        if (!this.state.UnmarkedContainer) {
          UnscannableNI = (<div className="gor-NI-wrapper">
            <hr />
            <div className="exception-qty-title">{_("Unscannable Quantity")}</div>
            <NumericIndicator execType={appConstants.UNSCANNABLE_QUANTITY} />
          </div>);
        }
        else {
          UnscannableNI = (<div></div>);
        }
        this._navigation = "";
        this._component = (
          <div className='grid-container exception'>
            <Modal />
            <Exception data={this.state.PutFrontExceptionData} />
            <div className="exception-right">
              <ExceptionHeader data={this.state.PutFrontServerNavData} />

              <div className="main-container exception1 displayBlocked">

                <div className="gor-NI-wrapper">
                  <hr />
                  <div className="exception-qty-title">{_("Good Quantity")}</div>
                  <NumericIndicator execType={appConstants.GOOD_QUANTITY} />
                </div>

                <div className="gor-NI-wrapper">
                  <hr />
                  <div className="exception-qty-title">{_("Missing Quantity")}</div>
                  <NumericIndicator execType={appConstants.MISSING_QUANTITY} />
                </div>

                {UnscannableNI}

                <div className="gor-NI-wrapper">
                  <hr />
                  <div className="exception-qty-title">{_("Damaged Quantity")}</div>
                  <NumericIndicator execType={appConstants.DAMAGED_QUANTITY} />
                  <hr />
                </div>

              </div>
              <div className="finish-damaged-barcode padding">
                <Button1 disabled={buttonActivateFlag} text={_("Validate and Confirm")} color={"orange"} module={appConstants.PUT_FRONT} action={appConstants.VALIDATE_AND_SEND_DATA_TO_SERVER} />

              </div>
            </div>
            <div className='cancel-scan'>
              <Button1 disabled={false} text={_("Cancel Exception")} module={appConstants.PUT_FRONT} action={appConstants.CANCEL_EXCEPTION_MODAL} color={"black"} />
            </div>
          </div>
        );
        break;
      case appConstants.PUT_FRONT_ITEMS_TO_IRT_BIN:
        var selected_screen;
        if (!this.state.GetIRTScanStatus) {
          selected_screen = (
            <div className="exception-right">
              <div className="gor-exception-align">
                <div className="gor-exceptionConfirm-text">{_("Please put exception entities in exception area")}</div>

                <div className="finish-damaged-barcode align-button">
                  <Button1 disabled={false} text={_("Confirm")} color={"orange"} module={appConstants.PUT_FRONT} action={appConstants.PUT_FINISH_EXCEPTION_ENTITY} />
                </div>
              </div>
            </div>
          );
        } else {
          selected_screen = (
            <div className="exception-right">
              <div className="gor-exception-align">
                <div className="gor-exceptionConfirm-text">{_("Please put exception entities in IRT bin and scan the bin")}</div>
              </div>
            </div>
          );
        }

        this._component = (
          <div className='grid-container exception'>
            <Modal />
            <Exception data={this.state.PutFrontExceptionData} />
            {selected_screen}
            <div className='cancel-scan'>
              <Button1 disabled={false} text={_("Cancel Exception")} module={appConstants.PUT_FRONT} action={appConstants.CANCEL_EXCEPTION_MODAL} color={"black"} />
            </div>
          </div>
        );
        break;

      case appConstants.PUT_FRONT_EXCEPTION_SPACE_NOT_AVAILABLE:
        if (this.state.PutFrontExceptionScreen == "take_item_from_bin") {
          this._component = (
            <div className='grid-container exception'>
              <Modal />
              <Exception data={this.state.PutFrontExceptionData} />
              <div className="exception-right">
                <div className="main-container exception2">
                  <div className="kq-exception">
                    <div className="kq-header">{_("Take the Items out from the Slot")}</div>
                  </div>
                </div>
                <div className="finish-damaged-barcode">
                  <Button1 disabled={false} text={_("NEXT")} color={"orange"} module={appConstants.PUT_FRONT} action={appConstants.GET_REVISED_QUANTITY} />
                </div>
              </div>
              <div className='cancel-scan'>
                <Button1 disabled={false} text={_("Cancel Exception")} module={appConstants.PUT_FRONT} action={appConstants.CANCEL_EXCEPTION_TO_SERVER} color={"black"} />
              </div>
            </div>
          );
        } else if (this.state.PutFrontExceptionScreen == "revised_quantity") {
          this._component = (
            <div className='grid-container exception'>
              <Modal />
              <Exception data={this.state.PutFrontExceptionData} />
              <div className="exception-right">
                <div className="main-container">
                  <div className="kq-exception">
                    <div className="kq-header">{_("Space Available For")}</div>
                    <KQ scanDetailsGood={this.state.PutFrontKQQuantity} />
                  </div>
                </div>
                <div className="finish-damaged-barcode">
                  <Button1 disabled={false} text={_("CONFIRM")} color={"orange"} module={appConstants.PUT_FRONT} action={appConstants.VALIDATE_AND_SEND_SPACE_UNAVAILABLE_DATA_TO_SERVER} />
                </div>
              </div>
              <div className='cancel-scan'>
                <Button1 disabled={false} text={_("Cancel Exception")} module={appConstants.PUT_FRONT} action={appConstants.CANCEL_EXCEPTION_TO_SERVER} color={"black"} />
              </div>
            </div>
          );
        }

        break;
      case appConstants.PUT_FRONT_EXCESS_ITEMS_PPSBIN:
        this._component = (
          <div className='grid-container exception'>
            <Modal />
            <Exception data={this.state.PutFrontExceptionData} />
            <div className="exception-right">
              <div className="main-container exception2">
                <div className="kq-exception">
                  <div className="kq-header">{_("Please scan PPTL which has excess item")}</div>
                </div>
              </div>
            </div>
            <div className='cancel-scan'>
              <Button1 disabled={false} text={_("Cancel Exception")} module={appConstants.PUT_FRONT} action={appConstants.CANCEL_EXCEPTION_MODAL} color={"black"} />
            </div>
          </div>
        );
        break;
      case appConstants.PUT_FRONT_EXCEPTION_EXCESS_TOTE:
        this._component = (
          <div className='grid-container exception'>
            <Modal />
            <Exception data={this.state.PutFrontExceptionData} />
            <div className="exception-right">
              <div className="main-container exception2">
                <div className="kq-exception">
                  <div className="kq-header">{_("Please scan tote which has excess item")}</div>
                </div>
              </div>
            </div>
            <div className='cancel-scan'>
              <Button1 disabled={false} text={_("Cancel Exception")} module={appConstants.PUT_FRONT} action={appConstants.CANCEL_EXCEPTION_MODAL} color={"black"} />
            </div>
          </div>
        );
        break;
      case appConstants.PUT_FRONT_EXCEPTION_EXCESS_ITEMS:
        var _button;
        _button = (<div className="staging-action">
          <Button1 disabled={this.state.PutFrontExceptionFlag} text={_("Next")} module={appConstants.PUT_FRONT} action={appConstants.SEND_EXCESS_ITEMS_BIN} color={"orange"} />
        </div>);
        this._component = (
          <div className='grid-container exception'>
            <Modal />
            <Exception data={this.state.PutFrontExceptionData} />
            <div className="exception-right">
              <div className="main-container">
                <div className="kq-exception">
                  <div className="kq-header">{_("Scan excess item quantity")}</div>
                  <TabularData data={this.state.PutFrontExcessItems} className='limit-height width-extra ' />
                  {_button}
                </div>
              </div>
            </div>
            <div className='cancel-scan'>
              <Button1 disabled={false} text={_("Cancel Exception")} module={appConstants.PUT_FRONT} action={appConstants.CANCEL_EXCEPTION_MODAL} color={"black"} />
            </div>
          </div>
        );
        break;
      case appConstants.PPTL_MANAGEMENT:
      case appConstants.SCANNER_MANAGEMENT:
        this._navigation = (<Navigation navData={this.state.PutFrontNavData} serverNavData={this.state.PutFrontServerNavData} navMessagesJson={this.props.navMessagesJson} />)
        var _button;
        if (this.state.PutFrontScreenId == appConstants.SCANNER_MANAGEMENT) {
          _button = (<div className='staging-action' >
            <Button1 disabled={false} text={_("BACK")} module={appConstants.PERIPHERAL_MANAGEMENT} status={true} action={appConstants.CANCEL_ADD_SCANNER} color={"black"} />
            <Button1 disabled={false} text={_("Add Scanner")} module={appConstants.PERIPHERAL_MANAGEMENT} status={true} action={appConstants.ADD_SCANNER} color={"orange"} />
          </div>)
        }
        else {
          _button = (<div className='staging-action' ><Button1 disabled={false} text={_("BACK")} module={appConstants.PERIPHERAL_MANAGEMENT} status={true} action={appConstants.CANCEL_PPTL} color={"black"} /></div>)
        }
        this._component = (
          <div className='grid-container audit-reconcilation'>
            <div className="row scannerHeader">
              <div className="col-md-6">
                <div className="ppsMode"> PPS Mode : {this.state.PutFrontPpsMode.toUpperCase()} </div>
              </div>
              <div className="col-md-6">
                <div className="seatType"> Seat Type : {this.state.PutFrontSeatType.toUpperCase()}</div>
              </div>
            </div>
            <TabularData data={this.state.utility} />
            {_button}
            <Modal />
          </div>
        );
        break;
      case appConstants.ITEM_SEARCH:
        this._navigation = '';
        this._component = (
          <div>
            <div className="outerWrapperItemSearch">
              <div className="subHeaderItemDetails">{_("Item details")}</div>
              <div className="innerWrapperItemSearch">
                <div className="textBoxContainer">
                  <span className="barcode"></span>
                  <TextEditor callAPItoGetData={this.callAPItoGetData.bind(this)} />
                </div>
              </div>
            </div>
            <div className="itemSearchfooter">
              <Button1 disabled={false} text={_("Close")} module={appConstants.SEARCH_MANAGEMENT} status={true} action={appConstants.BACK} color={"black"} />
            </div>
          </div>
        )
        break;
      case appConstants.ITEM_SEARCH_RESULT:
        this._navigation = '';
        this._component = (
          <div>
            <div className="outerWrapperItemSearch">
              <div className="subHeaderItemDetails">{_("Item details")}</div>
              <div className="innerWrapperItemResult">
                {this.state.loaderState ? <div className="spinnerDiv"><Spinner /></div> : <ItemTable data={this.state.ItemSearchData} rowconfig={this.state.rowconfig} />}
              </div>

            </div>
            <div className="itemSearchfooter">
              <Button1 disabled={false} text={_("Close")} module={appConstants.SEARCH_MANAGEMENT} status={true} action={appConstants.BACK} color={"black"} />
            </div>
          </div>
        )
        break;




      case appConstants.UDP_PUT_FRONT_TOTE_SCAN:
        var adjustStyleOnSplitPPS = "";
        this._modalContent = '';
        if (this.state.PutFrontExceptionStatus == false) {
          this._navigation = (<Navigation navData={this.state.PutFrontNavData} serverNavData={this.state.PutFrontServerNavData} navMessagesJson={this.props.navMessagesJson} showSpinner={this.state.MobileFlag} />);
          if (this.state.PutFrontChecklistData) {
            adjustStyleOnSplitPPS = "centerAlignSplitPPS"
          }
          this._component = (
            <div className='grid-container'>
              <Modal />
              <div className='main-container udp-flow'>
                <CheckList checklistData={this.state.PutFrontChecklistData}
                  checklistIndex={this.state.PutFrontChecklistIndex} />
                <SplitPPS orientation={this.state.groupOrientation} displayBinId={true}
                  groupInfo={this.state.udpBinMapDetails} undockAwaited={null} ruleset={'withBorder'}
                  docked={this.state.selectedTotes} customizeClassSplitPPS={adjustStyleOnSplitPPS} />

              </div>
            </div>
          );
        } else {
          this._component = this.getExceptionComponent();
        }
        break;
      case appConstants.UDP_PUT_FRONT_BIN_SCAN:
        var adjustStyleOnSplitPPS = "";
        this._modalContent = '';
        if (this.state.PutFrontExceptionStatus == false) {
          this._navigation = (<Navigation navData={this.state.PutFrontNavData} serverNavData={this.state.PutFrontServerNavData} navMessagesJson={this.props.navMessagesJson} showSpinner={this.state.MobileFlag} />);
          if (this.state.PutFrontChecklistData) {
            adjustStyleOnSplitPPS = "centerAlignSplitPPS"
          }
          this._component = (
            <div className='grid-container'>
              <Modal />
              <div className='main-container udp-flow'>
                <CheckList checklistData={this.state.PutFrontChecklistData}
                  checklistIndex={this.state.PutFrontChecklistIndex} />

                <SplitPPS orientation={this.state.groupOrientation} displayBinId={true}
                  groupInfo={this.state.udpBinMapDetails} undockAwaited={null}
                  docked={this.state.selectedTotes} ruleset={'withBorder'} customizeClassSplitPPS={adjustStyleOnSplitPPS} />

              </div>
              <div className='cancel-scan'>
                <Button1 disabled={false} text={_("Cancel Scan")} module={appConstants.PUT_FRONT} action={appConstants.CANCEL_SCAN_UDP} barcode={this.state.PutFrontItemUid} color={"black"} />
              </div>
            </div>
          );
        } else {
          this._component = this.getExceptionComponent();
        }
        break;

      case appConstants.UDP_PUT_FRONT_ENTITY_SCAN:
        this._modalContent = '';
        this._component = '';
        this._subComponent = '';
        if (this.state.PutFrontIsCrossDockEnabled === true) {
          this._subComponent = (
            <PreviousDetails previousDetails={this.state.PreviousDetails} customizeClass={'customize_WaitingForMsu'} type="put" />)
        }
        else {
          this._subComponent = (
            <div className="single-bin udp-flow">
              <BinMap orientation={this.state.groupOrientation} mapDetails={this.state.udpBinMapDetails} selectedGroup={this.state.selectedPPSBin} screenClass='putFrontFlow' />
              <CurrentBin details={this.state.PutFrontCurrentBinCount} />
              <PreviousDetails previousDetails={this.state.PreviousDetails} />
            </div>
          )
        }
        if (this.state.PutFrontExceptionStatus == false) {
          this._navigation = (<Navigation navData={this.state.PutFrontNavData} serverNavData={this.state.PutFrontServerNavData} navMessagesJson={this.props.navMessagesJson} showSpinner={this.state.MobileFlag} />);
          this._component = (
            <div className='grid-container udp-flow'>
              <Modal />
              {this._subComponent}
              <div className='main-container'>
                <Rack hideSlotDetails={true} isDrawer={false} slotType={null} rackData={this.state.PutFrontRackDetails} putDirection={this.state.PutFrontPutDirection} />
                <div className="product-details-container extraHandling">
                  <PrdtDetails productInfo={this.state.PutFrontProductDetails} />
                </div>
                <div className="msu-send-container">
                  <div style={{"marginLeft": "10%"}} className="msu-send-button">
                    <Button1 disabled={false} text={_("Send MSU")} module={appConstants.PUT_FRONT} action={appConstants.SEND_MSU} color={"orange"} />
                  </div>
                </div>
              </div>
            </div>
          );
        } else {
          this._component = this.getExceptionComponent();
        }
        break;
      case appConstants.UDP_PUT_FRONT_MISSING:
      case appConstants.UDP_PUT_FRONT_UNEXPECTED:
      case appConstants.UDP_PUT_FRONT_PLACE_ITEMS_IN_RACK:
        this._modalContent = '';
        this._component = '';
        this._subComponent = '';
        if (this.state.PutFrontExceptionStatus == false) {
          this._navigation = (<Navigation navData={this.state.PutFrontNavData} serverNavData={this.state.PutFrontServerNavData} navMessagesJson={this.props.navMessagesJson} showSpinner={this.state.MobileFlag} />);
          if (this.state.PutFrontScreenId === appConstants.UDP_PUT_FRONT_MISSING) {
            this._modalContent = (
              <ReactModal title={_("Close Cart")}>
                <div>
                  <div className="row">
                    <div className="col-md-12" >
                      <p>{_("Are you sure that all the items in the cart were scanned?")}</p>
                      <p>{(_("The following {0} items were found missing")).replace("{0}", this.state.missingItemList.length)}</p>
                      <div className="missing-list">
                        <section className="list-head">
                          <span className="list-head-cell">
                            {_("Product SKU")}
                          </span>
                          <span className="list-head-cell">
                            {_("Barcode")}
                          </span>
                        </section>
                        <div className="list-content">
                          {this.state.missingItemList.map(function (tuple, idx) {
                            return (<section key={tuple.product_sku + idx} className="tuple-row">
                              <span className="tuple-row-cell">{tuple.product_sku}</span>
                              <span className="tuple-row-cell">{tuple.product_barcode}</span>
                            </section>)
                          })}
                        </div>
                      </div>

                    </div>
                  </div>
                  <div className="modal-footer removeBorder">
                    <div className="buttonContainer center-block chklstButtonContainer">
                      <div className="row removeBorder">
                        <div className="col-md-6"><Button1 disabled={false} text={_("Confirm")} color={"orange"} status={true} toteId={this.state.ToteId} module={appConstants.PUT_FRONT} action={appConstants.CLOSE_TOTE} /></div>
                        <div className="col-md-6"><Button1 disabled={false} text={_("Cancel")} color={"black"} status={false} toteId={this.state.ToteId} module={appConstants.PUT_FRONT} action={appConstants.CLOSE_TOTE} /></div>
                      </div>
                    </div>
                  </div>
                </div>

              </ReactModal>)
          }
          else if (this.state.PutFrontScreenId === appConstants.UDP_PUT_FRONT_UNEXPECTED) {
            this._modalContent = (
              <ReactModal title={_("Unexpected Item")}>
                <div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="title-textbox">{_("Unexpected item found. Put item in IRT bin and confirm")}</div>
                    </div>
                  </div>
                  <div className="modal-footer removeBorder">
                    <div className="buttonContainer center-block chklstButtonContainer">
                      <div className="row removeBorder">
                        <div className="unex-close-text col-md-4 col-md-offset-3"><Button1 disabled={false} text={_("Close")} color={"black"} module={appConstants.PUT_FRONT} action={appConstants.CLOSE_UNEXPECTED_SCAN} /></div>
                      </div>
                    </div>
                  </div>
                </div>
              </ReactModal>)
          }
          if (this.state.PutFrontIsCrossDockEnabled === true) {
            this._subComponent = (
              <PreviousDetails previousDetails={this.state.PreviousDetails} customizeClass={'customize_WaitingForMsu'} type="put" />)
          }
          else {
            this._subComponent = (
              <div className="single-bin udp-flow">
                <BinMap orientation={this.state.groupOrientation} mapDetails={this.state.udpBinMapDetails} selectedGroup={this.state.selectedPPSBin} screenClass='putFrontFlow' />
                <CurrentBin selected={true} details={this.state.PutFrontCurrentBinCount} />
                <PreviousDetails previousDetails={this.state.PreviousDetails} />
              </div>
            )
          }
          this._component = (
            <div className='grid-container'>
              <Modal toteId={this.state.ToteId} />
              {this._subComponent}
              <div className='main-container udp-flow'>
                <Rack hideSlotDetails={true} isDrawer={false} slotType={null} rackData={this.state.PutFrontRackDetails} putDirection={this.state.PutFrontPutDirection} />
                <div className="product-details-container">
                  <PrdtDetails productInfo={this.state.PutFrontProductDetails} />
                </div>
                <div className="msu-send-container">
                  <div className="msu-send-button">
                    <Button1 disabled={true} text={_("Send MSU")} module={appConstants.PUT_FRONT} action={appConstants.SEND_MSU} color={"orange"} />
                  </div>
                </div>
              </div>
              <div className='cancel-scan'>
                <Button1 disabled={false} text={_("Cancel Scan")} module={appConstants.PUT_FRONT} action={appConstants.CANCEL_SCAN_UDP} barcode={this.state.PutFrontItemUid} color={"black"} />
              </div>
            </div>
          );

        } else {
          this._component = this.getExceptionComponent();
        }
        break;
      case appConstants.UDP_PUT_FRONT_WAITING_FOR_RACK:
        this._modalContent = '';
        this._component = '';
        this._subComponent = '';
        if (this.state.PutFrontExceptionStatus == false) {
          if (this.state.PutFrontIsCrossDockEnabled === true) {
            this._subComponent = (
              <PreviousDetails previousDetails={this.state.PreviousDetails} customizeClass={'customize_WaitingForMsu'} type="put" />)
          }
          this._navigation = (<Navigation navData={this.state.PutFrontNavData} serverNavData={this.state.PutFrontServerNavData} navMessagesJson={this.props.navMessagesJson} showSpinner={this.state.MobileFlag} />);
          this._component = (
            <div className='grid-container'>
              <Modal />
              {this._subComponent}
              <div className='main-container'>
                <Spinner />
              </div>
            </div>
          );
        } else {
          this._component = this.getExceptionComponent();
        }

        break;

      default:
        return true;
    }
  },

  render: function (data) {

    this.getNotificationComponent();
    this.getScreenComponent(this.state.PutFrontScreenId);
    return (
      <div className="main">
        <Header />
        {this._navigation}
        {this._component}
        {this._modalContent}
        {this._notification}
      </div>

    );
  }

});

module.exports = PutFront;