
var React = require('react');
var PickBackStore = require('../stores/PickBackStore');
var mainstore = require('../stores/mainstore');
var Header = require('./Header');
var Navigation = require("./Navigation/Navigation.react");
var Notification = require("./Notification/Notification");
var Bins = require("./Bins/Bins.react");
var BinsFlex = require("./Bins/BinsFlexArrange.react");
var Button1 = require("./Button/Button");
var appConstants = require('../constants/appConstants');
var Modal = require('./Modal/Modal');
var SystemIdle = require('./SystemIdle');
var CommonActions = require('../actions/CommonActions');
var Exception = require('./Exception/Exception');
var ExceptionHeader = require('./ExceptionHeader');
var TabularData = require('./TabularData');
var TextEditor = require('./ProductDetails/textEditor');
var ItemTable = require('./itemTable')
var Spinner = require("./Spinner/LoaderButler");
var BinMap = require('./BinMap');
var PackingDetails = require('./PrdtDetails/PackingDetails.js');
var utils = require("../utils/utils");
var CheckList = require("./CheckList.js");
var SplitPPS = require('./SplitPPS.js');

function getStateData() {
  return mainstore.getScreenData();
}

var PickBack = React.createClass({
  _component: '',
  _notification: '',
  _navigation: '',
  _exceptionAction: '',
  getInitialState: function () {
    return getStateData();
  },
  componentWillMount: function () {
    if (this.state.PickBackToteDetails != null) {
      this.showModal(this.state.PickBackToteDetails)
    }
    mainstore.addChangeListener(this.onChange);
  },
  componentWillUnmount: function () {
    mainstore.removeChangeListener(this.onChange);
  },
  onChange: function () {
    this.setState(getStateData());
    if (this.state.PickBackToteDetails != null) {
      this.showModal(this.state.PickBackToteDetails)
    }
  },
  getExceptionComponent: function () {
    var _rightComponent = '';
    this._navigation = '';
    return (
      <div className='grid-container exception'>
        <Modal />
        <Exception data={this.state.PickBackExceptionData} action={true} />
        <div className="exception-right"></div>
        <div className='cancel-scan'>
          <Button1 disabled={false} text={_("Cancel Exception")} module={appConstants.PICK_BACK} action={appConstants.CANCEL_EXCEPTION} color={"black"} />
        </div>
      </div>
    );
  },
  callAPItoGetData: function (data) {
    CommonActions.getOrphanItemData(data);
  },
  getExceptionAction: function (screen_id) {
    switch (screen_id) {
      case appConstants.PICK_BACK_EXCEPTION_REPRINT:
        this._exceptionAction = (<Button1 disabled={false} text={_("Print")} color={"orange"} module={appConstants.PICK_BACK} action={appConstants.REPRINT_INVOICE} />);
        break;
      case appConstants.PICK_BACK_EXCEPTION_SKIP_PRINTING:
        this._exceptionAction = (<Button1 disabled={this.state.PickBackSelectedBin == null} text={_("Skip Printing")} color={"orange"} module={appConstants.PICK_BACK} action={appConstants.SKIP_PRINTING} />);
        break;
      case appConstants.PICK_BACK_EXCEPTION_DIS_ASSOCIATE_TOTE:
        var toteDisplayName = this.getToteDisplayName() || "Tote"
        this._exceptionAction = (<Button1 disabled={this.state.PickBackSelectedBin == null} text={_("Dis-associate") + " " + toteDisplayName} color={"orange"} module={appConstants.PICK_BACK} action={appConstants.DIS_ASSOCIATE_TOTE} />);
        break;
      case appConstants.PICK_BACK_EXCEPTION_OVERRIDE_TOTE:
        this._exceptionAction = (<Button1 disabled={this.state.PickBackSelectedBin == null} text={_("Override")} color={"orange"} module={appConstants.PICK_BACK} action={appConstants.OVERRIDE_TOTE} />);
        break;
      default:
        return true;
    }
  },
  getToteDisplayName: function () {
    var exceptionDetail = null;
    for (var i = 0, len = this.state.PickBackExceptionData.list.length; i < len; i++) {
      var exception = this.state.PickBackExceptionData.list[i];
      if (exception.exception_id === "PkB007") {
        exceptionDetail = exception;
        break;
      }
    }
    return exceptionDetail ? exceptionDetail.details[0] : "Tote";

  },
  getScreenComponent: function (screen_id) {
    switch (screen_id) {
      case appConstants.PICK_BACK_BIN:
        var cancelScanFlag = this.state.pickBackCancelButtonData;
        var cancelButton;
        if (cancelScanFlag) {
          cancelButton = (
            <div >
              <div className='cancel-scan'>
                <Button1 disabled={false} text={_("Cancel Scan")} module={appConstants.PICK_BACK} action={appConstants.CANCEL_SCAN_TOTE} color={"black"} />
              </div>
            </div>);
        }
        else {
          cancelButton = (<div ></div>);
        }
        if (this.state.PickBackExceptionStatus == false) {
          this._navigation = (<Navigation navData={this.state.PickBackNavData} serverNavData={this.state.PickBackServerNavData} navMessagesJson={this.props.navMessagesJson} />);
          var binComponent = "";
          if (this.state.OrigBinUse) {
            binComponent = (<BinsFlex binsData={this.state.PickBackBinData} screenId={this.state.PickBackScreenId} seatType={this.state.SeatType} />)
          } else {
            binComponent = (
              <div className='main-container'>
                <Bins binsData={this.state.PickBackBinData} screenId={this.state.PickBackScreenId} />
              </div>
            )
          }
          this._component = (
            <div className='grid-container'>
              <Modal />
              {binComponent}
              {cancelButton}
            </div>
          );
        } else {
          this._component = this.getExceptionComponent();
        }
        break;
      case appConstants.PICK_BACK_SCAN:
      case appConstants.PICK_BACK_NO_SCAN:
        if (this.state.PickBackExceptionStatus == false) {
          this._navigation = (<Navigation navData={this.state.PickBackNavData} serverNavData={this.state.PickBackServerNavData} navMessagesJson={this.props.navMessagesJson} />);
          var binComponent = "";
          if (this.state.OrigBinUse) {
            binComponent = (<BinsFlex binsData={this.state.PickBackBinData} screenId={this.state.PickBackScreenId} seatType={this.state.SeatType} />);
          } else {
            binComponent = (<div className='main-container'>
              <Bins binsData={this.state.PickBackBinData} screenId={this.state.PickBackScreenId} />
            </div>);
          }
          this._component = (
            <div className='grid-container'>
              <Modal />
              {binComponent}
            </div>
          );
        } else {
          this._component = this.getExceptionComponent();
        }
        break;

      case appConstants.PICK_REPRINT_PACKLIST:
        this._navigation = '';
        this._component = (
          <div className='grid-container exception'>
            <Modal />
            <Exception data={this.state.PickBackExceptionData} />
            <div className="exception-right">
              <ExceptionHeader data={this.state.PickBackServerNavData} />
            </div>
            <div className='cancel-scan'>
              <Button1 disabled={false} text={_("Cancel Exception")} module={appConstants.PUT_FRONT} action={appConstants.CANCEL_EXCEPTION_MODAL} color={"black"} />
            </div>
          </div>
        );
        break;

      case appConstants.UNIVERSAL_DOCK_UNDOCK:
        if (this.state.PickBackExceptionStatus == false) {
          this._navigation = (<Navigation navData={this.state.PickBackNavData} serverNavData={this.state.PickBackServerNavData} navMessagesJson={this.props.navMessagesJson} />);
          var binComponent = "";
          var cancelScanFlag = this.state.pickBackCancelButtonData;
          var cancelButton, reprintButton;
          if (cancelScanFlag) {
            cancelButton = (
              <div >
                <div className='cancel-scan'>
                  <Button1 disabled={false} text={_("Cancel Scan")} module={appConstants.PICK_BACK} action={appConstants.CANCEL_SCAN_ALL} color={"black"} />
                </div>
              </div>);
          }
          else {
            cancelButton = (<div></div>);
          }
          binComponent = (
            <div className='main-container'>
              <div className="dock-undock-container">
                {this.state.dockChecklistData ?
                  (<CheckList
                    checklistHeader={this.state.dockHeader}
                    checklistData={this.state.dockChecklistData}
                    checklistIndex={this.state.dockChecklistIndex}
                  />) : <div style={{ "display": "none" }} />}

                <CheckList
                  checklistHeader={this.state.undockHeader}
                  checklistData={this.state.undockChecklistData}
                  checklistIndex={this.state.undockChecklistIndex}
                />
              </div>

              <SplitPPS
                displayBinId={true}
                groupInfo={this.state.udpBinMapDetails}
                docked={this.state.DockedGroup}
                printReady={this.state.PrintReady}
                wrongUndock={this.state.WrongUndock}
                undockAwaited={this.state.UndockAwaited}
              />
            </div>
          )

          var reprintIconStyle = {
            top: "31%",
            borderColor: "4px solid #FFC003"
          };

          this._component = (
            <div className='grid-container'>
              {this.state.isPrinterVisible &&
                (<div style={{ position: "fixed", top: reprintIconStyle.top, left: 0, border: reprintIconStyle.borderColor }}>
                  < img
                    src={'./assets/images/Printer.gif'}
                    height='158px'
                    width='158px'
                  />
                </div>)
              }
              <Modal />
              {binComponent}
              <div className='actions'>
                {cancelButton}
              </div>
            </div >
          );
        } else {
          this._component = this.getExceptionComponent();
        }
        break;


      case appConstants.PICK_BACK_PACKING_BOX:
        if (this.state.PickBackExceptionStatus == false) {
          this._navigation = (<Navigation navData={this.state.PickBackNavData}
            serverNavData={this.state.PickBackServerNavData}
            navMessagesJson={this.props.navMessagesJson} />);
          var binComponent = "";
          var cancelScanFlag = this.state.pickBackCancelButtonData;
          var cancelButton;
          if (cancelScanFlag) {
            cancelButton = (
              <div >
                <div className='cancel-scan'>
                  <Button1 disabled={false} text={_("Cancel Scan")} module={appConstants.PICK_BACK} action={appConstants.CANCEL_SCAN_ALL} color={"black"} />
                </div>
              </div>);
          }
          else {
            cancelButton = (<div ></div>);
          }
          if (this.state.OrigBinUse) {
            binComponent = (<div className="binsFlexWrapperContainer" style={{ "display": "flex" }}>
              <BinsFlex binsData={this.state.PickBackBinData}
                screenId={screen_id} seatType={this.state.SeatType} />
              <PackingDetails boxTypeInfo={this.state.PickBackPackingBoxType} />
            </div>)
          } else {
            binComponent = (<div className='main-container adjust-main-container'>
              <Bins binsData={this.state.PickBackBinData}
                screenId={screen_id} />
              <PackingDetails boxTypeInfo={this.state.PickBackPackingBoxType} />
            </div>);
          }

          this._component = (
            <div className='grid-container'>
              <Modal />
              <BinMap orientation={this.state.groupOrientation}
                mapDetails={this.state.BinMapDetails}
                selectedGroup={this.state.BinMapGroupDetails}
                screenClass='backFLowPackingBox' />
              {binComponent}
              {cancelButton}
            </div>
          );
        } else {
          this._component = this.getExceptionComponent();
        }
        break;

      case appConstants.PICK_BACK_CHANGE_PBOX_BIN:
        this._navigation = '';
        if (this.state.OrigBinUse) {
          binComponent = (
            <div className="exception1">
              <BinsFlex
                dataToDisassociateTote={this.state.PickBackToteDisAssociationData}
                binsData={this.state.PickBackBinData}
                screenId={this.state.PickBackScreenId}
                seatType={this.state.SeatType} />
            </div>
          )
        } else {
          binComponent = (
            <div className="main-container exception1">
              <Bins binsData={this.state.PickBackBinData}
                dataToDisassociateTote={this.state.PickBackToteDisAssociationData}
                screenId={this.state.PickBackScreenId}
                seatType={this.state.SeatType} />
            </div>
          );
        }

        this._component = (
          <div className='grid-container exception'>
            <Modal />
            <Exception data={this.state.PickBackExceptionData} />
            <div className="exception-right">
              <ExceptionHeader data={this.state.PickBackServerNavData} />
              {binComponent}
            </div>
            <div className='cancel-scan'>
              <Button1 disabled={false} text={_("Cancel Exception")} module={appConstants.PICK_BACK} action={appConstants.CANCEL_EXCEPTION_TO_SERVER} color={"black"} />
            </div>
          </div>
        );
        break;

      case appConstants.PICK_BACK_CHANGE_PBOX_SCAN:
        this._component = (
          <div className='grid-container exception'>
            <Modal />
            <Exception data={this.state.PickBackExceptionData} />
            <div className="exception-right">
              <ExceptionHeader data={this.state.PickBackServerNavData} />

              <div className="packing-Data">
                <div className="packingData-Text">
                  <div className="textLine1"><span className="header">{_("Current Box Barcode")}:</span><span className="textValue">{this.state.BoxBarcode.CurrentBoxBarcode ? utils.get3dotTrailedText(this.state.BoxBarcode.CurrentBoxBarcode, 5, 5, 15) : "--"}</span></div>
                  <div className="textLine2"><span className="header">{_("New Box Barcode")}:</span><span className="textValue">{this.state.BoxBarcode.NewBoxBarcode ? utils.get3dotTrailedText(this.state.BoxBarcode.NewBoxBarcode, 5, 5, 15) : "--"}</span></div>
                </div>
                <div className="packingData-Button">
                  <Button1 disabled={false} text={_("Back")} module={appConstants.PICK_BACK} action={appConstants.BACK_BUTTON_PRESS} color={"black"} />
                  <Button1 disabled={!this.state.ConfirmEnabled} text={_("Confirm")} module={appConstants.PICK_BACK} action={appConstants.CONFIRM_BUTTON} color={"orange"} />
                </div>
              </div>
            </div>

            <div className='cancel-scan'>
              <Button1 disabled={false} text={_("Cancel Exception")} module={appConstants.PICK_BACK} action={appConstants.CANCEL_EXCEPTION_TO_SERVER} color={"black"} />
            </div>
          </div>
        );
        break;

      case appConstants.PICK_BACK_EXCEPTION_REPRINT:
      case appConstants.PICK_BACK_EXCEPTION_SKIP_PRINTING:
      case appConstants.PICK_BACK_EXCEPTION_DIS_ASSOCIATE_TOTE:
      case appConstants.PICK_BACK_EXCEPTION_OVERRIDE_TOTE:
        this.getExceptionAction(screen_id);
        this._navigation = '';
        if (this.state.OrigBinUse) {
          binComponent = (<div className="exception1">
            <BinsFlex dataToDisassociateTote={this.state.PickBackToteDisAssociationData}
              binsData={this.state.PickBackBinData}
              screenId={this.state.PickBackScreenId}
              seatType={this.state.SeatType} />
          </div>);
        } else {
          binComponent = (<div className="main-container exception1">
            <Bins dataToDisassociateTote={this.state.PickBackToteDisAssociationData} binsData={this.state.PickBackBinData} screenId={this.state.PickBackScreenId} />
          </div>);
        }
        this._component = (
          <div className='grid-container exception'>
            <Modal />
            <Exception data={this.state.PickBackExceptionData} />
            <div className="exception-right">
              <ExceptionHeader data={this.state.PickBackServerNavData} />
              {binComponent}
              <div className="finish-damaged-barcode">
                {this._exceptionAction}
              </div>
            </div>
            <div className='cancel-scan'>
              <Button1 disabled={false} text={_("Cancel Exception")} module={appConstants.PICK_BACK} action={appConstants.CANCEL_EXCEPTION_TO_SERVER} color={"black"} />
            </div>
          </div>
        );
        break;

      case appConstants.PICK_BACK_REPRINT_TOTE:
        this.getExceptionAction(screen_id);
        this._navigation = '';
        this._component = (
          <div className='grid-container exception'>
            <Modal />
            <Exception data={this.state.PickBackExceptionData} />
            <div className="exception-right">
              <ExceptionHeader data={this.state.PickBackServerNavData} />
            </div>
            <div className='cancel-scan'>
              <Button1 disabled={false} text={_("Cancel Exception")} module={appConstants.PICK_BACK} action={appConstants.CANCEL_EXCEPTION_TO_SERVER} color={"black"} />
            </div>
          </div>
        );
        break;

      case appConstants.PPTL_MANAGEMENT:
      case appConstants.SCANNER_MANAGEMENT:
        this._navigation = (<Navigation navData={this.state.PickBackNavData} serverNavData={this.state.PickBackServerNavData} navMessagesJson={this.props.navMessagesJson} />)
        var _button;
        if (this.state.PickBackScreenId == appConstants.SCANNER_MANAGEMENT) {
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
                <div className="ppsMode"> PPS Mode : {this.state.PickBackPpsMode.toUpperCase()} </div>
              </div>
              <div className="col-md-6">
                <div className="seatType"> Seat Type : {this.state.PickBackSeatType.toUpperCase()}</div>
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

      default:
        return true;
    }
  },
  showModal: function (data) {

    if (data.tote_status === true && !$('.modal').hasClass('in')) {
      setTimeout((function () {
        CommonActions.showModal({
          data: data,
          type: 'scan_bin_barcode'
        });
        $('.modal').modal();
        return false;
      }), 0)
    } else if (data.tote_status === false && $('.modal').hasClass('in')) {
      $('.modal').modal('hide');
    }
  },
  getNotificationComponent: function () {
    if (this.state.PickBackNotification != undefined) {
      this._notification = <Notification notification={this.state.PickBackNotification} navMessagesJson={this.props.navMessagesJson} />
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
  render: function (data) {
    this.getNotificationComponent();
    this.getScreenComponent(this.state.PickBackScreenId);
    return (
      <div className="main">
        <Header />
        {this._navigation}
        {this._component}
        {this._notification}
      </div>

    )
  }
});

module.exports = PickBack;