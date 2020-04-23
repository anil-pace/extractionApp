var React = require('react')
var PickFrontStore = require('../stores/PickFrontStore')
var mainstore = require('../stores/mainstore')
var Header = require('./Header')
var KQ = require('./ProductDetails/KQ')
var ExceptionHeader = require('./ExceptionHeader')
var KQExceptionMissing = require('./ProductDetails/KQExceptionMissing')
var KQExceptionDamaged = require('./ProductDetails/KQExceptionDamaged')
var NumericIndicator = require('./ProductDetails/NumericIndicator')
var allresourceConstants = require('../constants/resourceConstants')
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
      case appConstants.ARA_PICK_FRONT:
      this._navigation = (
        <Navigation
          navData={this.state.PickFrontNavData}
          serverNavData={this.state.PickFrontServerNavData}
          navMessagesJson={this.props.navMessagesJson}
        />
      )
      var loader = <Spinner />
      this._component = (
        <div className='grid-container'>
          <div className='main-container ara-pick-loader'>{loader}</div>
        </div>
      )
        break
      case appConstants.PICK_FRONT_WAITING_FOR_MSU:
        var previousPickDetails = ''
        var loader = <Spinner />
        if (this.state.PreviousDetails) {
          previousPickDetails = (
            <PreviousDetails
              previousDetails={this.state.PreviousDetails}
              customizeClass={'customize_WaitingForMsu'}
              type='pick'
            />
          );
        }
        if (this.state.BinMapDetails && this.state.rollCageStatus) {
          loader = (
            <SplitPPS
              orientation={this.state.groupOrientation}
              groupInfo={this.state.BinMapDetails}
              undockAwaited={this.state.UndockAwaited}
              docked={this.state.DockedGroup}
            />
          )
        }
        if (this.state.PickFrontExceptionStatus == false) {
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
              {previousPickDetails}
              <div className='main-container'>{loader}</div>
            </div>
          )
        } else {
          this._component = this.getExceptionComponent()
        }
        break
      
      case appConstants.PICK_FRONT_LOCATION_CONFIRM:
      case appConstants.PICK_FRONT_LOCATION_SCAN:
        var locationBtnEnable = this.state.PickFrontLocationButtonEnable
          ? false
          : true
        var locationButton = (
          <Button1
            disabled={locationBtnEnable}
            text={_('Confirm')}
            module={appConstants.PICK_FRONT}
            action={appConstants.CONFIRM_LOCATION}
            color={'orange'}
          />
        )
        if (this.state.PickFrontExceptionStatus == false) {
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
              <div className='main-container'>
                <Rack
                  isDrawer={this.state.isDrawer}
                  slotType={this.state.SlotType}
                  rackData={this.state.PickFrontRackDetails}
                />
              </div>
              {locationButton}
            </div>
          )
        } else {
          this._component = this.getExceptionComponent()
        }
        break
      case appConstants.PICK_FRONT_CONTAINER_BREAK:
      case appConstants.PICK_FRONT_ITEM_SCAN:
        var cancelScanFlag = this.state.PickFrontCancelScan
        var cancelButton
        var rackType = ''
        let isHeavyItem = this.state.PickFrontHeavyItemsFlag
        if (cancelScanFlag) {
          cancelButton = (
            <div>
              <Button1
                disabled={false}
                text={_('Cancel Scan')}
                module={appConstants.PICK_FRONT}
                action={appConstants.CANCEL_SCAN}
                color={'black'}
              />
            </div>
          )
        } else {
          cancelButton = <div />
        }

        if (this.state.PickFrontExceptionStatus == false) {
          this._navigation = (
            <Navigation
              navData={this.state.PickFrontNavData}
              serverNavData={this.state.PickFrontServerNavData}
              navMessagesJson={this.props.navMessagesJson}
            />
          )

          if (this.state.PickFrontRackTypeMPU) {
            rackType = <Pallet />
          } else {
            rackType = (
              <Rack
                isDrawer={this.state.isDrawer}
                slotType={this.state.SlotType}
                rackData={this.state.PickFrontRackDetails}
                putDirection={this.state.PickFrontPickDirection}
                heavyItemInfo={isHeavyItem}
              />
            )
          }

          this._component = (
            <div className='grid-container'>
              <Modal />
              <div className='main-container'>
                {rackType}
                <PrdtDetails productInfo={this.state.PickFrontProductDetails} />
              </div>
              
              <div className='actions'>{cancelButton}</div>
            </div>
          )
        } else {
          this._component = this.getExceptionComponent()
        }
        break

      case appConstants.PICK_FRONT_CHECKLIST:
        var cancelScanFlag = this.state.PickFrontCancelScan
        var cancelButton
        if (cancelScanFlag) {
          cancelButton = (
            <div>
              <Button1
                disabled={false}
                text={_('Cancel Scan')}
                module={appConstants.PICK_FRONT}
                action={appConstants.CANCEL_SCAN}
                color={'black'}
              />
            </div>
          )
        } else {
          cancelButton = <div />
        }
        var checklistData = ''
        if (this.state.PickFrontExceptionStatus == false) {
          this._navigation = (
            <Navigation
              navData={this.state.PickFrontNavData}
              serverNavData={this.state.PickFrontServerNavData}
              navMessagesJson={this.props.navMessagesJson}
            />
          )

          checklistData = (
            <CheckList
              checklistData={this.state.PickFrontChecklistData}
              checklistIndex={this.state.PickFrontChecklistIndex}
            />
          )

          this._component = (
            <div className='grid-container'>
              <Modal />
              <div className='main-container'>
                {checklistData}
                <PrdtDetails productInfo={this.state.PickFrontProductDetails} />
              </div>
              <div className='actions'>{cancelButton}</div>
            </div>
          )
        } else {
          this._component = this.getExceptionComponent()
        }
        break

      case appConstants.PICK_FRONT_CONTAINER_SCAN:
        if (this.state.PickFrontExceptionStatus == false) {
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
              <div className='main-container'>
                <BoxSerial boxData={this.state.PickFrontBoxDetails} />
                <Rack
                  rackData={this.state.PickFrontRackDetails}
                  slotType={this.state.SlotType}
                />
              </div>
            </div>
          )
        } else {
          this._component = this.getExceptionComponent()
        }
        break

      case appConstants.PER_ITEM_PRINT:
        if (this.state.PickFrontExceptionStatus == false) {
          var cancelScanFlag = this.state.PrintCancelScan
          var cancelScanDisabled =
            cancelScanFlag || cancelScanFlag === undefined ? false : true
          var binComponent
          this._navigation = (
            <Navigation
              navData={this.state.PickFrontNavData}
              serverNavData={this.state.PickFrontServerNavData}
              navMessagesJson={this.props.navMessagesJson}
            />
          )
          binComponent = (
            <div className='main-container'>
              <div className='printImage' />
              <KQ
                scanDetails={this.state.PrintScanDetails}
                hideCounters={true}
              />
            </div>
          )
          this._component = (
            <div className='grid-container'>
              <Modal />
              {this.state.SplitScreenFlag && (
                <BinMap
                  orientation={this.state.groupOrientation}
                  mapDetails={this.state.BinMapDetails}
                  selectedGroup={this.state.BinMapGroupDetails}
                  screenClass='putFrontFlow'
                />
              )}

              <div
                className={
                  'single-bin ' +
                  (this.state.SplitScreenFlag
                    ? ' gor-fixed-position'
                    : 'fix-top')
                }
              >
                <Bins
                  binsData={this.state.PickCurrentBin}
                  screenId={this.state.PickFrontScreenId}
                />
                <div className='text'>{_('CURRENT BIN')}</div>
              </div>
              {binComponent}
              <Button1
                text={_('Confirm')}
                disabled={false}
                module={appConstants.PICK_FRONT}
                action={appConstants.PRINT_CONFIRM}
                color={'orange'}
              />
              <div className='actions'>
                <Button1
                  disabled={cancelScanDisabled}
                  text={_('Cancel Scan')}
                  module={appConstants.PICK_FRONT}
                  action={appConstants.CANCEL_SCAN_MODAL}
                  color={'black'}
                />
              </div>
            </div>
          )
        } else {
          this._component = this.getExceptionComponent()
        }

        break

      case appConstants.PICK_FRONT_MORE_ITEM_SCAN:
      case appConstants.PICK_FRONT_WORKING_TABLE:
        var cancelScanFlag = this.state.PickFrontCancelScan
        var cancelClicked = mainstore.getCancelButtonStatus()
        var { PickFrontReprintEnabled } = this.state
        var cancelScanDisabled =
          cancelScanFlag || cancelScanFlag === undefined ? false : true
        if (this.state.PickFrontExceptionStatus == false) {
          this._navigation = (
            <Navigation
              navData={this.state.PickFrontNavData}
              serverNavData={this.state.PickFrontServerNavData}
              navMessagesJson={this.props.navMessagesJson}
            />
          )
          if (
            this.state.PickFrontScanDetails.current_qty > 0 &&
            this.state.PickFrontChecklistDetails.length > 0
          ) {
            var editButton = (
              <Button1
                disabled={false}
                text={_('Edit Details')}
                module={appConstants.PICK_FRONT}
                action={appConstants.EDIT_DETAILS}
                color={'orange'}
              />
            )
          } else {
            var editButton = ''
          }
          var BinFull = (
            <Button1
              disabled={false}
              text={_('Bin full')}
              module={appConstants.PICK_FRONT}
              action={appConstants.BIN_FULL}
              color={'black'}
            />
          )
          // Pick Front Flow Customer Trolley Support Print Enhancements
          var reprintButton = ''
          reprintButton = PickFrontReprintEnabled ? (
            <Button1
              disabled={false}
              text={_('Reprint')}
              module={appConstants.PICK_FRONT}
              action={appConstants.REPRINT_REQUEST}
              color={'black'}
            />
          ) : (
              ''
            )
          var binComponent = ''

          if (screen_id == appConstants.PICK_FRONT_WORKING_TABLE) {
            if (this.state.OrigBinUse) {
              binComponent = (
                <div className='binsFlexWrapperContainer'>
                  <div className='workingTableFlex' />
                  <WrapperSplitRoll
                    scanDetails={this.state.PickFrontScanDetails}
                    productDetails={this.state.PickFrontProductDetails}
                    itemUid={this.state.PickFrontItemUid}
                  />
                </div>
              )
            } else {
              binComponent = (
                <div className='main-container'>
                  <div className='workingTable' />
                  <Wrapper
                    scanDetails={this.state.PickFrontScanDetails}
                    productDetails={this.state.PickFrontProductDetails}
                    itemUid={this.state.PickFrontItemUid}
                  />
                </div>
              )
            }
          } else {
            if (this.state.OrigBinUse) {
              binComponent = (
                <div className='binsFlexWrapperContainer'>
                  <BinsFlex
                    binsData={this.state.PickFrontBinData}
                    screenId={screen_id}
                    seatType={this.state.SeatType}
                  />
                  <WrapperSplitRoll
                    scanDetails={this.state.PickFrontScanDetails}
                    productDetails={this.state.PickFrontProductDetails}
                    itemUid={this.state.PickFrontItemUid}
                  />
                </div>
              )
            } else {
              binComponent = (
                <div className='main-container'>
                  <Bins
                    binsData={this.state.PickFrontBinData}
                    screenId={screen_id}
                  />
                  <Wrapper
                    scanDetails={this.state.PickFrontScanDetails}
                    productDetails={this.state.PickFrontProductDetails}
                    itemUid={this.state.PickFrontItemUid}
                  />
                </div>
              )
            }
          }
          var topPosition = this.state.SplitScreenFlag ? '320px' : '140px'

          let printer_visible = false
          let printer_border_color = 'yellow'
          if (this.state.printerInfo) {
            printer_visible = this.state.printerInfo.printer_visible
            printer_border_color = this.state.printerInfo.printer_border_color
          }

          var reprintIconStyle = {
            top: topPosition,
            borderColor: appConstants.BIN_LIGHT_COLOR[printer_border_color]
          }
          this._component = (
            <div className='grid-container'>
              <Modal cancelClicked={cancelClicked} />

              <CurrentSlot slotDetails={this.state.PickFrontSlotDetails} />

              {this.state.SplitScreenFlag && (
                <BinMap
                  orientation={this.state.groupOrientation}
                  mapDetails={this.state.BinMapDetails}
                  selectedGroup={this.state.BinMapGroupDetails}
                  screenClass='frontFlow'
                />
              )}
              {printer_visible && (
                <div className='reprintIcon' style={reprintIconStyle}>
                  <img
                    src={'./assets/images/Printer.gif'}
                    height='140px'
                    width='140px'
                  />
                </div>
              )}
              {binComponent}
              <div className='actions'>
                <Button1
                  disabled={cancelScanDisabled}
                  text={_('Cancel Scan')}
                  module={appConstants.PICK_FRONT}
                  action={appConstants.CANCEL_SCAN}
                  color={'black'}
                />
                {editButton}
                {reprintButton}

                {this.state.PickFrontScreenId !==
                  appConstants.PICK_FRONT_WORKING_TABLE &&
                  this.state.PickFrontButtonStatus == true &&
                  this.state.PickFrontButtonType == 'bin_full'
                  ? BinFull
                  : ''}
              </div>
            </div>
          )
        } else {
          this._component = this.getExceptionComponent()
        }
        break

      case appConstants.PICK_FRONT_PACKING_BOX:
        if (this.state.PickFrontExceptionStatus == false) {
          this._navigation = (
            <Navigation
              navData={this.state.PickFrontNavData}
              serverNavData={this.state.PickFrontServerNavData}
              navMessagesJson={this.props.navMessagesJson}
            />
          )
          var binComponent = ''

          if (screen_id == appConstants.PICK_FRONT_WORKING_TABLE) {
            if (this.state.OrigBinUse) {
              binComponent = (
                <div className='binsFlexWrapperContainer'>
                  <div className='workingTableFlex' />
                  <WrapperSplitRoll
                    scanDetails={this.state.PickFrontScanDetails}
                    productDetails={this.state.PickFrontProductDetails}
                    itemUid={this.state.PickFrontItemUid}
                  />
                </div>
              )
            } else {
              binComponent = (
                <div className='main-container adjust-main-container'>
                  <div className='workingTable' />
                  <Wrapper
                    scanDetails={this.state.PickFrontScanDetails}
                    productDetails={this.state.PickFrontProductDetails}
                    itemUid={this.state.PickFrontItemUid}
                  />
                </div>
              )
            }
          } else {
            if (this.state.OrigBinUse) {
              binComponent = (
                <div
                  className='binsFlexWrapperContainer'
                  style={{ display: 'flex' }}
                >
                  <BinsFlex
                    binsData={this.state.PickFrontBinData}
                    screenId={screen_id}
                    seatType={this.state.SeatType}
                  />
                  <PackingDetails
                    boxTypeInfo={this.state.PickFrontPackingBoxType}
                  />
                </div>
              )
            } else {
              binComponent = (
                <div className='main-container adjust-main-container'>
                  <Bins
                    binsData={this.state.PickFrontBinData}
                    screenId={screen_id}
                  />
                  <PackingDetails
                    boxTypeInfo={this.state.PickFrontPackingBoxType}
                  />
                </div>
              )
            }
          }
          this._component = (
            <div className='grid-container'>
              <Modal cancelClicked={cancelClicked} />
              {this.state.SplitScreenFlag && (
                <BinMap
                  orientation={this.state.groupOrientation}
                  mapDetails={this.state.BinMapDetails}
                  selectedGroup={this.state.BinMapGroupDetails}
                  screenClass='frontFLowPackingBox'
                />
              )}
              {binComponent}
            </div>
          )
        } else {
          this._component = this.getExceptionComponent()
        }
        break

      case appConstants.ITEM_SEARCH:
        this._navigation = ''
        this._component = (
          <div>
            <div className='outerWrapperItemSearch'>
              <div className='subHeaderItemDetails'>{_('Item details')}</div>
              <div className='innerWrapperItemSearch'>
                <div className='textBoxContainer'>
                  <span className='barcode' />
                  <TextEditor
                    callAPItoGetData={this.callAPItoGetData.bind(this)}
                  />
                </div>
              </div>
            </div>
            <div className='itemSearchfooter'>
              <Button1
                disabled={false}
                text={_('Close')}
                module={appConstants.SEARCH_MANAGEMENT}
                status={true}
                action={appConstants.BACK}
                color={'black'}
              />
            </div>
          </div>
        )
        break
      case appConstants.ITEM_SEARCH_RESULT:
        this._navigation = ''
        this._component = (
          <div>
            <div className='outerWrapperItemSearch'>
              <div className='subHeaderItemDetails'>{_('Item details')}</div>
              <div className='innerWrapperItemResult'>
                {this.state.loaderState ? (
                  <div className='spinnerDiv'>
                    <Spinner />
                  </div>
                ) : (
                    <ItemTable
                      data={this.state.ItemSearchData}
                      rowconfig={this.state.rowconfig}
                    />
                  )}
              </div>
            </div>
            <div className='itemSearchfooter'>
              <Button1
                disabled={false}
                text={_('Close')}
                module={appConstants.SEARCH_MANAGEMENT}
                status={true}
                action={appConstants.BACK}
                color={'black'}
              />
            </div>
          </div>
        )
        break

      case appConstants.PICK_FRONT_PPTL_PRESS:
        var cancelScanFlag = this.state.PickFrontCancelScan
        var cancelScanDisabled =
          cancelScanFlag || cancelScanFlag === undefined ? false : true
        var cancelButton
        var cancelClicked = mainstore.getCancelButtonStatus()
        var { PickFrontReprintEnabled } = this.state
        var BinFull = (
          <Button1
            disabled={false}
            text={_('Bin full')}
            module={appConstants.PICK_FRONT}
            action={appConstants.BIN_FULL}
            color={'black'}
          />
        )
        let printer_visible = false
        let printer_border_color = 'yellow'
        if (this.state.printerInfo) {
          printer_visible = this.state.printerInfo.printer_visible
          printer_border_color = this.state.printerInfo.printer_border_color
        }
        var topPosition = this.state.SplitScreenFlag ? '320px' : '140px'
        var reprintIconStyle = {
          top: topPosition,
          borderColor: appConstants.BIN_LIGHT_COLOR[printer_border_color]
        }

        if (this.state.PickFrontExceptionStatus == false) {
          this._navigation = (
            <Navigation
              navData={this.state.PickFrontNavData}
              serverNavData={this.state.PickFrontServerNavData}
              navMessagesJson={this.props.navMessagesJson}
            />
          )
          if (
            this.state.PickFrontScanDetails.current_qty > 0 &&
            this.state.PickFrontChecklistDetails.length > 0
          ) {
            var editButton = (
              <Button1
                disabled={false}
                text={_('Edit Details')}
                module={appConstants.PICK_FRONT}
                action={appConstants.EDIT_DETAILS}
                color={'orange'}
              />
            )
          } else {
            var editButton = ''
          }
          if (!cancelScanDisabled) {
            cancelButton = (
              <div>
                <Button1
                  disabled={false}
                  text={_('Cancel Scan')}
                  module={appConstants.PICK_FRONT}
                  action={appConstants.CANCEL_SCAN}
                  color={'black'}
                />{' '}
                {editButton}
              </div>
            )
          } else {
            cancelButton = <div />
          }
          // Pick Front Flow Customer Trolley Support Print Enhancements
          var reprintButton = ''
          reprintButton = PickFrontReprintEnabled ? (
            <Button1
              disabled={false}
              text={_('Reprint')}
              module={appConstants.PICK_FRONT}
              action={appConstants.REPRINT_REQUEST}
              color={'black'}
            />
          ) : (
              ''
            )
          var binComponent = ''
          if (this.state.OrigBinUse) {
            binComponent = (
              <BinsFlex
                binsData={this.state.PickFrontBinData}
                screenId={appConstants.PICK_FRONT_PPTL_PRESS}
                seatType={this.state.SeatType}
              />
            )
          } else {
            binComponent = (
              <div className='main-container'>
                <Bins
                  binsData={this.state.PickFrontBinData}
                  screenId={appConstants.PICK_FRONT_PPTL_PRESS}
                />
              </div>
            )
          }
          this._component = (
            <div className='grid-container'>
              <Modal cancelClicked={cancelClicked} />

              <CurrentSlot slotDetails={this.state.PickFrontSlotDetails} />
              {this.state.SplitScreenFlag && (
                <BinMap
                  orientation={this.state.groupOrientation}
                  mapDetails={this.state.BinMapDetails}
                  selectedGroup={this.state.BinMapGroupDetails}
                  screenClass='frontFlow'
                />
              )}
              {printer_visible && (
                <div className='reprintIcon' style={reprintIconStyle}>
                  <img
                    height='140px'
                    width='140px'
                    src={'./assets/images/Printer.gif'}
                  />
                </div>
              )}
              {binComponent}
              <div className='actions'>
                {cancelButton}
                {reprintButton}
                {this.state.PickFrontButtonStatus == true &&
                  this.state.PickFrontButtonType == 'bin_full'
                  ? BinFull
                  : ''}
              </div>
            </div>
          )
        } else {
          this._component = this.getExceptionComponent()
        }
        break

      case appConstants.PICK_FRONT_SKIP_BIN:
      case appConstants.PICK_FRONT_NO_FREE_BIN:
        var skipDockingButton
        var skipDockingBtnEnable = this.state.PickFrontSkipDockingBtnEnable
        if (skipDockingBtnEnable) {
          skipDockingButton = (
            <Button1
              disabled={!skipDockingBtnEnable}
              text={_('Skip docking')}
              module={appConstants.PICK_FRONT}
              action={appConstants.SKIP_DOCKING}
              color={'black'}
            />
          )
        } else {
          skipDockingButton = ''
        }
        if (this.state.PickFrontExceptionStatus == false) {
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
              <div className='main-container'>
                {this.state.BinMapDetails && this.state.rollCageStatus ?
                  <SplitPPS
                    orientation={this.state.groupOrientation}
                    groupInfo={this.state.BinMapDetails}
                    undockAwaited={this.state.UndockAwaited}
                    docked={this.state.DockedGroup}
                    displayBinId={true}
                  /> : <Spinner />
                }
              </div>
              <div className='btn-actions-skip-docking'>
                {skipDockingButton}
              </div>
            </div>
          )
        } else {
          this._component = this.getExceptionComponent()
        }
        break

      case appConstants.PICK_FRONT_EXCEPTION_DAMAGED_ENTITY:
        var _button
        var headerDataToShow = this.state.PickFrontServerNavData.code || ''
        var remainingEntitiesToBeScanned = this.state.PickFrontServerNavData.details.slice(
          -1
        )[0]

        if (!this.state.GetIRTScanStatus) {
          _button = (
            <div className='staging-action'>
              <Button1
                disabled={this.state.PickFrontExceptionFlag}
                text={_('Confirm')}
                module={appConstants.PICK_FRONT}
                action={appConstants.CONFIRM_PHYSICALLY_DAMAGED_ITEMS}
                color={'orange'}
              />
            </div>
          )
        } else {
          _button = (
            <div className='staging-action'>
              <Button1
                disabled={this.state.PickFrontExceptionFlag}
                text={_('Next')}
                module={appConstants.PICK_FRONT}
                action={appConstants.CONFIRM_PHYSICALLY_DAMAGED_ITEMS}
                color={'orange'}
              />
            </div>
          )
        }

        this._component = (
          <div className='grid-container exception'>
            <Modal />
            <Exception data={this.state.PickFrontExceptionData} />
            <div className='exception-right'>
              <div className='main-container'>
                <div className='kq-exception'>
                  <div className='kq-header'>
                    {remainingEntitiesToBeScanned !== 0
                      ? utils.frntStringTransform(headerDataToShow, [
                        remainingEntitiesToBeScanned
                      ])
                      : _('No more entities to be scanned')}
                  </div>
                  <TabularData
                    data={this.state.PickFrontDamagedItems}
                    className='limit-height width-extra '
                  />
                  {_button}
                </div>
              </div>
            </div>
            <div className='cancel-scan'>
              <Button1
                disabled={false}
                text={_('Cancel Exception')}
                module={appConstants.PUT_FRONT}
                action={appConstants.CANCEL_EXCEPTION_MODAL}
                color={'black'}
              />
            </div>
          </div>
        )
        break
      case appConstants.PICK_FRONT_MISSING_DAMAGED_UNSCANNABLE_ENTITY:
        var buttonActivateFlag = mainstore.getExeptionQuanity()
        this._component = (
          <div className='grid-container exception'>
            <Modal />
            <Exception data={this.state.PickFrontExceptionData} />
            <div className='exception-right'>
              <ExceptionHeader data={this.state.PickFrontServerNavData} />

              <div className='main-container exception1 displayBlocked'>
                <div className='gor-NI-wrapper'>
                  <hr />
                  <div className='exception-qty-title'>
                    {_('Good Quantity')}
                  </div>
                  <NumericIndicator execType={appConstants.GOOD_QUANTITY} />
                </div>

                <div className='gor-NI-wrapper'>
                  <hr />
                  <div className='exception-qty-title'>
                    {_('Missing Quantity')}
                  </div>
                  <NumericIndicator execType={appConstants.MISSING_QUANTITY} />
                </div>

                <div className='gor-NI-wrapper'>
                  <hr />
                  <div className='exception-qty-title'>
                    {_('Unscannable Quantity')}
                  </div>
                  <NumericIndicator
                    execType={appConstants.UNSCANNABLE_QUANTITY}
                  />
                </div>

                <div className='gor-NI-wrapper'>
                  <hr />
                  <div className='exception-qty-title'>
                    {_('Damaged Quantity')}
                  </div>
                  <NumericIndicator execType={appConstants.DAMAGED_QUANTITY} />
                  <hr />
                </div>
              </div>
              <div className='finish-damaged-barcode padding'>
                <Button1
                  disabled={buttonActivateFlag}
                  text={_('Validate and Confirm')}
                  color={'orange'}
                  module={appConstants.PICK_FRONT}
                  action={appConstants.VALIDATE_AND_SEND_DATA_TO_SERVER}
                />
              </div>
            </div>
            <div className='cancel-scan'>
              <Button1
                disabled={false}
                text={_('Cancel Exception')}
                module={appConstants.PUT_FRONT}
                action={appConstants.CANCEL_EXCEPTION_MODAL}
                color={'black'}
              />
            </div>
          </div>
        )

        break

      case appConstants.PICK_FRONT_MISSING_OR_UNSCANNABLE_DAMAGED_PACK:
        var buttonActivateFlag = mainstore.getExeptionQuanity()
        this._component = (
          <div className='grid-container exception'>
            <Modal />
            <Exception data={this.state.PickFrontExceptionData} />
            <div className='exception-right'>
              <ExceptionHeader data={this.state.PickFrontServerNavData} />

              <div className='main-container exception1 displayBlocked'>
                <div className='gor-NI-wrapper'>
                  <hr />
                  <div className='exception-qty-title'>
                    {_('Bad barcode on pack')}
                  </div>
                  <NumericIndicator execType={appConstants.BAD_BARCODE_PACK} />
                </div>

                <div className='gor-NI-wrapper'>
                  <hr />
                  <div className='exception-qty-title'>{_('Pack missing')}</div>
                  <NumericIndicator execType={appConstants.PACK_MISSING} />
                </div>

                <div className='gor-NI-wrapper'>
                  <hr />
                  <div className='exception-qty-title'>{_('Damaged pack')}</div>
                  <NumericIndicator execType={appConstants.DAMAGED_PACK} />
                </div>
                <div className='gor-NI-wrapper'>
                  <hr />
                  <div className='exception-qty-title'>{_('Good pack')}</div>
                  <NumericIndicator execType={appConstants.GOOD_PACK} />
                  <hr />
                </div>
              </div>
              <div className='finish-damaged-barcode padding'>
                <Button1
                  disabled={buttonActivateFlag}
                  text={_('Validate and Confirm')}
                  color={'orange'}
                  module={appConstants.PICK_FRONT}
                  action={appConstants.VALIDATE_AND_SEND_DATA_TO_SERVER}
                />
              </div>
            </div>
            <div className='cancel-scan'>
              <Button1
                disabled={false}
                text={_('Cancel Exception')}
                module={appConstants.PUT_FRONT}
                action={appConstants.CANCEL_EXCEPTION_MODAL}
                color={'black'}
              />
            </div>
          </div>
        )

        break
      case appConstants.PICK_FRONT_MISSING_OR_UNSCANNABLE_DAMAGED_SUBPACK:
        var buttonActivateFlag = mainstore.getExeptionQuanity()
        this._component = (
          <div className='grid-container exception'>
            <Modal />
            <Exception data={this.state.PickFrontExceptionData} />
            <div className='exception-right'>
              <ExceptionHeader data={this.state.PickFrontServerNavData} />

              <div className='main-container exception1 displayBlocked'>
                <div className='gor-NI-wrapper'>
                  <hr />
                  <div className='exception-qty-title'>
                    {_('Bad barcode on sub pack')}
                  </div>
                  <NumericIndicator
                    execType={appConstants.BAD_BARCODE_SUB_PACK}
                  />
                </div>

                <div className='gor-NI-wrapper'>
                  <hr />
                  <div className='exception-qty-title'>
                    {_('Sub pack missing')}
                  </div>
                  <NumericIndicator execType={appConstants.SUB_PACK_MISSING} />
                </div>

                <div className='gor-NI-wrapper'>
                  <hr />
                  <div className='exception-qty-title'>
                    {_('Damaged sub pack')}
                  </div>
                  <NumericIndicator execType={appConstants.DAMAGED_SUB_PACK} />
                  <hr />
                </div>
                <div className='gor-NI-wrapper'>
                  <hr />
                  <div className='exception-qty-title'>
                    {_('Good sub pack')}
                  </div>
                  <NumericIndicator execType={appConstants.GOOD_SUB_PACK} />
                </div>
              </div>
              <div className='finish-damaged-barcode padding'>
                <Button1
                  disabled={buttonActivateFlag}
                  text={_('Validate and Confirm')}
                  color={'orange'}
                  module={appConstants.PICK_FRONT}
                  action={appConstants.VALIDATE_AND_SEND_DATA_TO_SERVER}
                />
              </div>
            </div>
            <div className='cancel-scan'>
              <Button1
                disabled={false}
                text={_('Cancel Exception')}
                module={appConstants.PUT_FRONT}
                action={appConstants.CANCEL_EXCEPTION_MODAL}
                color={'black'}
              />
            </div>
          </div>
        )

        break

      case appConstants.PICK_FRONT_IRT_BIN_CONFIRM:
        var selected_screen
        if (!this.state.GetIRTScanStatus) {
          selected_screen = (
            <div className='gor-exception-align'>
              <div className='gor-exceptionConfirm-text'>
                {_('Please put exception entities in exception area')}
              </div>
              <div className='finish-damaged-barcode align-button'>
                <Button1
                  disabled={false}
                  text={_('Confirm')}
                  color={'orange'}
                  module={appConstants.PICK_FRONT}
                  action={appConstants.PICK_FINISH_EXCEPTION_ENTITY}
                />
              </div>
            </div>
          )
        } else {
          selected_screen = (
            <div className='gor-exception-align'>
              <div className='gor-exceptionConfirm-text'>
                {_('Please put exception entities in IRT bin and scan the bin')}
              </div>
            </div>
          )
        }
        this._component = (
          <div className='grid-container exception'>
            <Modal />
            <Exception data={this.state.PickFrontExceptionData} />
            <div className='exception-right'>{selected_screen}</div>
            <div className='cancel-scan'>
              <Button1
                disabled={false}
                text={_('Cancel Exception')}
                module={appConstants.PUT_FRONT}
                action={appConstants.CANCEL_EXCEPTION_MODAL}
                color={'black'}
              />
            </div>
          </div>
        )
        break

      case appConstants.PICK_FRONT_REPRINT_EXCEPTION:
        var selected_screen

        selected_screen = (
          <div className='gor-exception-align'>
            <div className='gor-exceptionConfirm-text'>
              {_('Press print button to reprint label for current item')}
            </div>
            <div className='finish-damaged-barcode align-button'>
              <Button1
                disabled={false}
                text={_('Reprint')}
                color={'orange'}
                module={appConstants.PICK_FRONT}
                action={appConstants.PICK_FRONT_REPRINT}
              />
            </div>
          </div>
        )

        this._component = (
          <div className='grid-container exception'>
            <Modal />
            <Exception data={this.state.PickFrontExceptionData} />
            <div className='exception-right'>{selected_screen}</div>
            <div className='cancel-scan'>
              <Button1
                disabled={false}
                text={_('Cancel Exception')}
                module={appConstants.PICK_FRONT}
                action={appConstants.CANCEL_EXCEPTION_MODAL}
                color={'black'}
              />
            </div>
          </div>
        )
        break

      case appConstants.PICK_FRONT_EXCEPTION_MISSING_BOX:
        this._navigation = ''
        if (this.state.PickFrontExceptionScreen == 'box_serial') {
          this._component = (
            <div className='grid-container exception'>
              <Modal />
              <Exception data={this.state.PickFrontExceptionData} />
              <div className='exception-right'>
                <div className='main-container'>
                  <div className='kq-exception'>
                    <div className='kq-header'>{_('Missing Boxes')}</div>
                    <BoxSerial boxData={this.state.PickFrontBoxDetails} />
                  </div>
                  <div className='kq-exception'>
                    <div className='kq-header'>{_('Unscannable Boxes')}</div>
                    <KQExceptionDamaged
                      scanDetailsDamaged={this.state.PickFrontDamagedQuantity}
                      type={appConstants.UNSCANNABLE}
                      action={appConstants.UNSCANNABLE}
                    />
                  </div>
                </div>
                <div className='finish-damaged-barcode'>
                  <Button1
                    disabled={false}
                    text={_('NEXT')}
                    color={'orange'}
                    module={appConstants.PICK_FRONT}
                    action={appConstants.CONFIRM_FROM_USER}
                  />
                </div>
              </div>
              <div className='cancel-scan'>
                <Button1
                  disabled={false}
                  text={_('Cancel Exception')}
                  module={appConstants.PICK_FRONT}
                  action={appConstants.CANCEL_EXCEPTION_TO_SERVER}
                  color={'black'}
                />
              </div>
            </div>
          )
        } else if (this.state.PickFrontExceptionScreen == 'confirm_from_user') {
          this._component = (
            <div className='grid-container exception'>
              <Modal />
              <Exception data={this.state.PickFrontExceptionData} />
              <div className='exception-right'>
                <div className='main-container exception2'>
                  <div className='kq-exception'>
                    <div className='kq-header'>
                      {'Are You sure Given Boxes are not present in Slot ? '}
                    </div>
                  </div>
                </div>
                <div className='finish-damaged-barcode'>
                  <Button1
                    disabled={false}
                    text={_('CONFIRM')}
                    color={'orange'}
                    module={appConstants.PICK_FRONT}
                    action={appConstants.SEND_MISSING_BOX_EXCEPTION}
                  />
                </div>
              </div>
              <div className='cancel-scan'>
                <Button1
                  disabled={false}
                  text={_('Cancel Exception')}
                  module={appConstants.PICK_FRONT}
                  action={appConstants.CANCEL_EXCEPTION_TO_SERVER}
                  color={'black'}
                />
              </div>
            </div>
          )
        }
        break

      case appConstants.PPTL_MANAGEMENT:
      case appConstants.SCANNER_MANAGEMENT:
        this._navigation = (
          <Navigation
            navData={this.state.PickFrontNavData}
            serverNavData={this.state.PickFrontServerNavData}
            navMessagesJson={this.props.navMessagesJson}
          />
        )
        var _button
        if (this.state.PickFrontScreenId == appConstants.SCANNER_MANAGEMENT) {
          _button = (
            <div className='staging-action'>
              <Button1
                disabled={false}
                text={_('BACK')}
                module={appConstants.PERIPHERAL_MANAGEMENT}
                status={true}
                action={appConstants.CANCEL_ADD_SCANNER}
                color={'black'}
              />
              <Button1
                disabled={false}
                text={_('Add Scanner')}
                module={appConstants.PERIPHERAL_MANAGEMENT}
                status={true}
                action={appConstants.ADD_SCANNER}
                color={'orange'}
              />
            </div>
          )
        } else {
          _button = (
            <div className='staging-action'>
              <Button1
                disabled={false}
                text={_('BACK')}
                module={appConstants.PERIPHERAL_MANAGEMENT}
                status={true}
                action={appConstants.CANCEL_PPTL}
                color={'black'}
              />
            </div>
          )
        }
        this._component = (
          <div className='grid-container audit-reconcilation'>
            <div className='row scannerHeader'>
              <div className='col-md-6'>
                <div className='ppsMode'>
                  {' '}
                  PPS Mode : {this.state.PickFrontPpsMode.toUpperCase()}{' '}
                </div>
              </div>
              <div className='col-md-6'>
                <div className='seatType'>
                  {' '}
                  Seat Type : {this.state.PickFrontSeatType.toUpperCase()}
                </div>
              </div>
            </div>
            <TabularData data={this.state.utility} />
            {_button}
            <Modal />
          </div>
        )
        break

      case appConstants.PICK_FRONT_PACKING_CONTAINER_SCAN:
        if (this.state.PickFrontExceptionStatus == false) {
          this._navigation = (
            <Navigation
              navData={this.state.PickFrontNavData}
              serverNavData={this.state.PickFrontServerNavData}
              navMessagesJson={this.props.navMessagesJson}
            />
          )
          var _button = (
            <div className='staging-action'>
              <Button1
                disabled={false}
                text={_('BACK')}
                module={appConstants.PICK_FRONT}
                status={true}
                action={appConstants.CANCEL_BOX_FULL}
                color={'black'}
              />
              <Button1
                disabled={false}
                text={_('Box Full')}
                module={appConstants.PICK_FRONT}
                status={true}
                action={appConstants.BOX_FULL}
                color={'black'}
              />
            </div>
          )
          this._component = (
            <div className='grid-container'>
              <Modal />

              <div className='main-container'>
                <Rack
                  isDrawer={this.state.isDrawer}
                  slotType={this.state.SlotType}
                  rackData={this.state.PickFrontRackDetails}
                />
                <BoxSerial boxData={this.state.PickFrontBoxDetails} />
                <OrderDetails orderData={this.state.PickFrontBoxOrderDetails} />
              </div>
            </div>
          )
        } else {
          this._component = this.getExceptionComponent()
        }
        break
      case appConstants.PICK_FRONT_PACKING_ITEM_SCAN:
        var cancelClicked = mainstore.getCancelButtonStatus()
        if (this.state.PickFrontExceptionStatus == false) {
          this._navigation = (
            <Navigation
              navData={this.state.PickFrontNavData}
              serverNavData={this.state.PickFrontServerNavData}
              navMessagesJson={this.props.navMessagesJson}
            />
          )
          if (
            this.state.PickFrontScanDetails.current_qty > 0 &&
            this.state.PickFrontChecklistDetails.length > 0
          ) {
            var editButton = (
              <Button1
                disabled={false}
                text={_('Edit Details')}
                module={appConstants.PICK_FRONT}
                action={appConstants.EDIT_DETAILS}
                color={'orange'}
              />
            )
          } else {
            var editButton = ''
          }
          var BinFull = (
            <Button1
              disabled={false}
              text={_('Bin full')}
              module={appConstants.PICK_FRONT}
              action={appConstants.BIN_FULL}
              color={'black'}
            />
          )
          var binComponent = ''
          if (this.state.OrigBinUse) {
            binComponent = (
              <div className='binsFlexWrapperContainer'>
                <BinsFlex
                  binsData={this.state.PickFrontBinData}
                  screenId={appConstants.PICK_FRONT_MORE_ITEM_SCAN}
                  seatType={this.state.SeatType}
                />
                <WrapperSplitRoll
                  scanDetails={this.state.PickFrontScanDetails}
                  productDetails={this.state.PickFrontProductDetails}
                  itemUid={this.state.PickFrontItemUid}
                />
              </div>
            )
          } else {
            binComponent = (
              <div className='main-container'>
                <Bins
                  binsData={this.state.PickFrontBinData}
                  screenId={appConstants.PICK_FRONT_MORE_ITEM_SCAN}
                />
                <Wrapper
                  scanDetails={this.state.PickFrontScanDetails}
                  productDetails={this.state.PickFrontProductDetails}
                  itemUid={this.state.PickFrontItemUid}
                />
              </div>
            )
          }
          var btnId = this.state.PickFrontPackingButtonType,
            btnName,
            actionBtn,
            action,
            actionBtnStatus,
            cancelButton = '',
            cancelButtonStatus = this.state.PickFrontPackingCancelStatus
          if (btnId) {
            btnName = btnId === 'box_discard' ? _('Box Full') : _('Box Full')
            action =
              btnId === 'box_discard'
                ? appConstants.DISCARD_PACKING_BOX
                : appConstants.BOX_FULL
            actionBtnStatus = this.state.PickFrontPackingButtonDisable
              ? false
              : true
            actionBtn = (
              <Button1
                disabled={actionBtnStatus}
                text={btnName}
                module={appConstants.PICK_FRONT}
                action={action}
                color={'black'}
              />
            )
          }
          if (cancelButtonStatus) {
            cancelButton = (
              <Button1
                disabled={false}
                text={_('Cancel Scan')}
                module={appConstants.PICK_FRONT}
                action={appConstants.CANCEL_SCAN}
                color={'black'}
              />
            )
          }
          this._component = (
            <div className='grid-container gor-pck-itm-scn'>
              <Modal cancelClicked={cancelClicked} />

              <CurrentSlot slotDetails={this.state.PickFrontSlotDetails} />
              <OrderDetails orderData={this.state.PickFrontBoxOrderDetails} />
              {this.state.SplitScreenFlag && (
                <BinMap
                  orientation={this.state.groupOrientation}
                  mapDetails={this.state.BinMapDetails}
                  selectedGroup={this.state.BinMapGroupDetails}
                  screenClass='frontFlow'
                />
              )}
              {binComponent}
              <div className='actions'>
                {cancelButton}
                {actionBtn}
                {editButton}
                {this.state.PickFrontBinFullStatus && BinFull}
              </div>
            </div>
          )
        } else {
          this._component = this.getExceptionComponent()
        }
        break
      case appConstants.PICK_FRONT_PACKING_PPTL_PRESS:
        var cancelScanFlag = this.state.PickFrontCancelScan
        var cancelScanDisabled =
          cancelScanFlag || cancelScanFlag === undefined ? false : true
        var cancelButton

        if (this.state.PickFrontExceptionStatus == false) {
          this._navigation = (
            <Navigation
              navData={this.state.PickFrontNavData}
              serverNavData={this.state.PickFrontServerNavData}
              navMessagesJson={this.props.navMessagesJson}
            />
          )
          if (
            this.state.PickFrontScanDetails.current_qty > 0 &&
            this.state.PickFrontChecklistDetails.length > 0
          ) {
            var editButton = (
              <Button1
                disabled={false}
                text={_('Edit Details')}
                module={appConstants.PICK_FRONT}
                action={appConstants.EDIT_DETAILS}
                color={'orange'}
              />
            )
          } else {
            var editButton = ''
          }
          if (!cancelScanDisabled) {
            cancelButton = (
              <div className='cancel-scan'>
                <Button1
                  disabled={false}
                  text={_('Cancel Scan')}
                  module={appConstants.PICK_FRONT}
                  action={appConstants.CANCEL_SCAN}
                  color={'black'}
                />{' '}
                {editButton}
              </div>
            )
          } else {
            cancelButton = <div className='cancel-scan' />
          }
          var binComponent = ''
          if (this.state.OrigBinUse) {
            binComponent = (
              <BinsFlex
                binsData={this.state.PickFrontBinData}
                screenId={appConstants.PICK_FRONT_PPTL_PRESS}
                seatType={this.state.SeatType}
              />
            )
          } else {
            binComponent = (
              <div className='main-container'>
                <Bins
                  binsData={this.state.PickFrontBinData}
                  screenId={appConstants.PICK_FRONT_PPTL_PRESS}
                />
              </div>
            )
          }
          var btnId = this.state.PickFrontPackingButtonType,
            btnName,
            actionBtn,
            action,
            actionBtnStatus
          if (btnId) {
            btnName = btnId === 'box_discard' ? _('Box Full') : _('Box Full')
            action =
              btnId === 'box_discard'
                ? appConstants.DISCARD_PACKING_BOX
                : appConstants.BOX_FULL
            actionBtnStatus = this.state.PickFrontPackingButtonDisable
              ? false
              : true
            actionBtn = (
              <Button1
                disabled={actionBtnStatus}
                text={btnName}
                module={appConstants.PICK_FRONT}
                action={action}
                color={'black'}
              />
            )
          }
          this._component = (
            <div className='grid-container'>
              <Modal />

              <CurrentSlot slotDetails={this.state.PickFrontSlotDetails} />
              {this.state.SplitScreenFlag && (
                <BinMap
                  orientation={this.state.groupOrientation}
                  mapDetails={this.state.BinMapDetails}
                  selectedGroup={this.state.BinMapGroupDetails}
                  screenClass='frontFlow'
                />
              )}
              {binComponent}

              {cancelButton}
              {actionBtn}
            </div>
          )
        } else {
          this._component = this.getExceptionComponent()
        }
        break
      case appConstants.PICK_FRONT_BIN_PRINTOUT:
      case appConstants.PICK_FRONT_ROLLCAGE_PRINTOUT:
        var reprintButton = ''
        if (!this.state.PickFrontExceptionStatus) {
          if (this.state.OrigBinUse) {
            binComponent = (
              <BinsFlex
                binsData={this.state.PickFrontBinData}
                screenId={screen_id}
                seatType={this.state.SeatType}
              />
            )
          } else {
            binComponent = (
              <div className='main-container'>
                <Bins
                  binsData={this.state.PickFrontBinData}
                  screenId={screen_id}
                />
              </div>
            )
          }
          reprintButton =
            this.state.PickFrontScreenId ===
              appConstants.PICK_FRONT_ROLLCAGE_PRINTOUT ? (
                <Button1
                  disabled={false}
                  text={_('Reprint')}
                  module={appConstants.PICK_FRONT}
                  action={appConstants.REPRINT}
                  color={'black'}
                />
              ) : (
                ''
              )

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
              {this.state.SplitScreenFlag && (
                <BinMap
                  orientation={this.state.groupOrientation}
                  mapDetails={this.state.BinMapDetails}
                  selectedGroup={this.state.BinMapGroupDetails}
                  screenClass='putFrontFlow'
                />
              )}
              {binComponent}
              {reprintButton}
            </div>
          )
        } else {
          this._component = this.getExceptionComponent()
        }
        break

      case appConstants.PICK_FRONT_DOCK_TOTE:
      case appConstants.PICK_FRONT_SKIP_TOTE:
        var rackType = ''
        var adjustStyleOnSplitPPS = ''
        var cancelScanDisabled = this.state.PickFrontCancelScan ? true : false
        var cancelButton
        if (cancelScanDisabled) {
          cancelButton = (
            <div className='cancel-scan'>
              <Button1
                disabled={false}
                text={_('Cancel Scan')}
                module={appConstants.PICK_FRONT}
                action={appConstants.CANCEL_SCAN}
                color={'black'}
              />
            </div>
          )
        } else {
          cancelButton = ''
        }

        if (!this.state.PickFrontExceptionStatus) {
          this._navigation = (
            <Navigation
              navData={this.state.PickFrontNavData}
              serverNavData={this.state.PickFrontServerNavData}
              navMessagesJson={this.props.navMessagesJson}
            />
          )
          if (this.state.PickFrontChecklistData) {
            adjustStyleOnSplitPPS = 'centerAlignSplitPPS'
          }
          this._component = (
            <div className='grid-container'>
              <Modal />
              <div className='main-container'>
                <CheckList
                  checklistData={this.state.PickFrontChecklistData}
                  checklistIndex={this.state.PickFrontChecklistIndex}
                  skipDockingBtnStatus={
                    this.state.PickFrontSkipDockingBtnEnable
                  }
                />
                <SplitPPS
                  orientation={this.state.groupOrientation}
                  displayBinId={true}
                  groupInfo={this.state.udpBinMapDetails}
                  undockAwaited={null}
                  customizeClassSplitPPS={adjustStyleOnSplitPPS}
                  docked={this.state.selectedTotes}
                  ruleset={'withBorder'}
                  selectedbin={this.state.PickCurrentBin}
                />
              </div>
              <div className='actions'>{cancelButton}</div>
            </div>
          )
        } else {
          this._component = this.getExceptionComponent()
        }
        break

      case appConstants.PICK_FRONT_SLOT_SCAN:
      case appConstants.PICK_FRONT_TOTE_CONFIRM:
        if (this.state.PickFrontExceptionStatus == false) {
          var carryingUnitBtnEnable = this.state.PickFrontCarryingUnitBtnEnable
            ? false
            : true
          var carryingUnitButton = (
            <Button1
              disabled={carryingUnitBtnEnable}
              text={_('New carrying unit')}
              module={appConstants.PICK_FRONT}
              action={appConstants.NEW_CARRYING_UNIT}
              color={'black'}
            />
          )
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
              <div className='main-container'>
                <Rack
                  isDrawer={this.state.isDrawer}
                  slotType={this.state.SlotType}
                  rackData={this.state.PickFrontRackDetails}
                />
              </div>
              <div className='actions'>{carryingUnitButton}</div>
            </div>
          )
        } else {
          this._component = this.getExceptionComponent()
        }
        break

        

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
            if (true) {
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
            } else {
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
                        action={appConstants.CANCEL_SCAN} 
                        screenId={mainstore.getScreenId()}
                        color={"black"} />
                  </div>
                  {removeAllButton}
                  {/* <Button1
                      disabled={false}
                      text={_('Remove All')}
                      module={appConstants.PICK_FRONT}
                      action={appConstants.REMOVE_ALL_BUTTON}
                      screenId={mainstore.getScreenId()}
                      color={'orange'}
                  /> */}
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
                      isDrawer={this.state.isDrawer}
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


      case appConstants.PICK_FRONT_ONE_STEP_SCAN:
        var rackType = ''
        if (!this.state.PickFrontExceptionStatus) {
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
              <PreviousDetails
                previousDetails={this.state.PreviousDetails}
                customizeClass={'customize_WaitingForMsu'}
                type='pick'
              />
              <div className='main-container leftJustify'>
                <Rack
                  isDrawer={this.state.isDrawer}
                  slotType={this.state.SlotType}
                  PickFrontProductDetails={this.state.PickFrontProductDetails}
                  rackData={this.state.PickFrontRackDetails}
                  QLCodeDetails={true}
                />
                <SplitPPS
                  orientation={this.state.groupOrientation}
                  customizeClassSplitPPS='rightAligned'
                  displayBinId={true}
                  groupInfo={this.state.udpBinMapDetails}
                  undockAwaited={null}
                  docked={this.state.selectedTotes}
                  ruleset={'withBorder'}
                  selectedbin={this.state.PickCurrentBin}
                />
              </div>
            </div>
          )
        } else {
          this._component = this.getExceptionComponent()
        }
        break

      case appConstants.PICK_FRONT_UNDOCK_TOTE:
        if (!this.state.PickFrontExceptionStatus) {
          var subMessage = this.state.PickFrontServerNavData.details
            ? this.state.PickFrontServerNavData.details[0]
            : ''
          this._navigation = (
            <Navigation
              navData={this.state.PickFrontNavData}
              serverNavData={this.state.PickFrontServerNavData}
              subMessage={'Scan ' + subMessage + ' and gently push it away'}
              navMessagesJson={this.props.navMessagesJson}
            />
          )

          this._component = (
            <div className='grid-container'>
              <Modal />

              <SplitPPS
                orientation={this.state.groupOrientation}
                displayBinId={true}
                groupInfo={this.state.udpBinMapDetails}
                undockAwaited={this.state.undockAwaited}
                docked={this.state.selectedTotes}
                ruleset={'withBorder'}
                selectedbin={this.state.PickCurrentBin}
              />
            </div>
          )
        } else {
          this._component = this.getExceptionComponent()
        }
        break

      case appConstants.PICK_FRONT_SCAN_PACKS:
        var rackType = ''
        if (!this.state.PickFrontExceptionStatus) {
          this._navigation = (
            <Navigation
              navData={this.state.PickFrontNavData}
              serverNavData={this.state.PickFrontServerNavData}
              navMessagesJson={this.props.navMessagesJson}
            />
          )
          if (this.state.PickFrontRackTypeMPU) {
            rackType = <Pallet />
          } else {
            rackType = (
              <Rack
                isDrawer={this.state.isDrawer}
                slotType={this.state.SlotType}
                rackData={this.state.PickFrontRackDetails}
              />
            )
          }
          this._component = (
            <div className='grid-container'>
              <Modal />
              <div className='main-container'>
                {rackType}
                <PrdtDetails productInfo={this.state.PickFrontProductDetails} />
              </div>
            </div>
          )
        } else {
          this._component = this.getExceptionComponent()
        }
        break

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
