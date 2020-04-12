var React = require("react")
//var AuditStore = require("../stores/AuditStore")
var mainstore = require("../stores/mainstore")
var Header = require("./Header")
var Navigation = require("./Navigation/Navigation.react")
var Exception = require("./Exception/Exception")
var SystemIdle = require("./SystemIdle")
var Notification = require("./Notification/Notification")
var Button1 = require("./Button/Button")
var appConstants = require("../constants/appConstants")
var Modal = require("./Modal/Modal")
var TabularData = require("./TabularData")
var Button1 = require("./Button/Button.js")
var Img = require("./PrdtDetails/ProductImage.js")
var Rack = require("./Rack/MsuRack.js")
var Spinner = require("./Spinner/LoaderButler")
//var Reconcile = require("./Reconcile")
var utils = require("../utils/utils.js")
var ActionCreators = require("../actions/CommonActions")
var KQ = require("./ProductDetails/KQ.js")
var CurrentSlot = require("./CurrentSlot")
var Modal = require("./Modal/Modal")
var ExceptionHeader = require("./ExceptionHeader")
var Pallet = require("./Pallet/pallet")
var GorTabs = require("./gor-tabs/tabs")
var Tab = require("./gor-tabs/tabContent")
var ReactModal = require("./Modal/ReactModal")
var GorSelect = require("./gor-select/gor-select")
var TextEditor = require("./ProductDetails/textEditor")
var ItemTable = require("./itemTable")

var Audit = React.createClass({
  _component: "",
  _notification: "",
  _cancelStatus: "",
  _boxSerial: "",
  _currentBox: "",
  _looseItems: "",
  _navigation: "",
  showModal: function() {
    if (
      this.state.AuditScreenId != appConstants.AUDIT_RECONCILE &&
      this.state.AuditScreenId !=
        appConstants.AUDIT_EXCEPTION_BOX_DAMAGED_BARCODE &&
      this.state.AuditScreenId !=
        appConstants.AUDIT_EXCEPTION_LOOSE_ITEMS_DAMAGED_EXCEPTION &&
      this.state.AuditScreenId !=
        appConstants.AUDIT_EXCEPTION_ITEM_IN_BOX_EXCEPTION &&
      this.state.AuditScreenId !=
        appConstants.AUDIT_SUB_PACK_UNSCANNABLE_EXCEPTION &&
      this.state.AuditScreenId !=
        appConstants.AUDIT_PACK_UNSCANNABLE_EXCEPTION &&
      this.state.AuditScreenId != appConstants.AUDIT_DAMAGED_ENTITY_EXCEPTION &&
      this.state.AuditScreenId !==
        appConstants.AUDIT_EACH_UNSCANNABLE_EXCEPTION &&
      this.state.AuditScreenId !== appConstants.AUDIT_FRONT_IRT_BIN_CONFIRM
    ) {
      if (
        this.state.AuditShowModal["showModal"] != undefined &&
        this.state.AuditShowModal["showModal"] ==
          true /*&& !$('.modal').hasClass('in')*/
      ) {
        var self = this
        this.state.AuditShowModal["showModal"] = false
        var r = self.state.AuditShowModal.message
        setTimeout(function() {
          ActionCreators.showModal({
            data: {
              message: r
            },
            type: "message"
          })
          $(".modal").modal("show")
          //return false;
        }, 0)
      }
    }
  },
  getInitialState: function() {
    return this.getStateData()
  },
  getStateData: function() {
    var screenData = mainstore.getScreenData()
    var localState = {
      allInfoModalStatus: this.state ? this.state.allInfoModalStatus : false,
      selectedTab: this.state ? this.state.selectedTab : 0,
      infoButtonData: mainstore.getInfoButtonData(),
      customContainerNames: mainstore.getCustomContainerNames(),
      isAddlInfoPresent: mainstore.isAddlInfoPresent(),
      selectedUOM: mainstore.getSelectedUOM() || null,
      isChangeUOMApplicable: mainstore.isChangeUOMApplicable(),
      kQstatus: mainstore.kQstatus()
    }
    return Object.assign({}, screenData, localState)
  },
  componentWillMount: function() {
    //this.showModal();
    mainstore.addChangeListener(this.onChange)
  },
  componentWillUnmount: function() {
    mainstore.removeChangeListener(this.onChange)
  },
  componentDidMount: function() {
    this.showModal()
    AuditStore.addChangeListener(this.onChange)
  },
  onChange: function() {
    this.setState(this.getStateData())
    this.showModal()
  },
  getExceptionComponent: function() {
    var _rightComponent = ""
    this._navigation = ""
    return (
      <div className="grid-container exception">
        <Modal />
        <Exception data={this.state.AuditExceptionData} action={true} />
        <div className="exception-right" />
        <div className="cancel-scan">
          <Button1
            disabled={false}
            text={_("Cancel Exception")}
            module={appConstants.PICK_FRONT}
            action={appConstants.CANCEL_EXCEPTION}
            color={"black"}
          />
        </div>
      </div>
    )
  },
  callAPItoGetData: function(data) {
    ActionCreators.getOrphanItemData(data)
  },
  _onTabClick: function(selectedIndex) {
    this.setState({
      selectedTab: selectedIndex
    })
  },
  _openAddlInfoModal: function(status) {
    this.setState({
      allInfoModalStatus: status
    })
  },
  _onSelect: function(val, txt) {
    var data = {
      event_name: "audit_change_uom",
      event_data: {
        container_level: val
      }
    }
    ActionCreators.postDataToInterface(data)
  },
  getUOMDropdownValues: function() {
    var customContainerNames = this.state.customContainerNames,
      options = []
    for (var k in customContainerNames) {
      options.push({
        value: k,
        text: customContainerNames[k]
      })
    }
    return options
  },
  getAddlInfoData: function() {
    var AuditAddlInfoData = {}
    var infoButtonData = this.state.infoButtonData,
      customContainerNames = this.state.customContainerNames,
      header = [
        new mainstore.tableCol(
          _("SKU"),
          "header",
          false,
          "small",
          false,
          true,
          true,
          false
        ),
        new mainstore.tableCol(
          _("Serial"),
          "header",
          false,
          "small",
          false,
          true,
          true,
          false
        ),
        new mainstore.tableCol(
          _("Quantity"),
          "header",
          false,
          "small",
          false,
          true,
          true,
          false
        )
      ]
    for (var k in infoButtonData) {
      var rowData = infoButtonData[k],
        name = customContainerNames ? customContainerNames[k] : k
      AuditAddlInfoData[name] = {}
      AuditAddlInfoData[name]["header"] = header
      AuditAddlInfoData[name]["tableRows"] = []
      for (var i = 0, len = rowData.length; i < len; i++) {
        AuditAddlInfoData[name]["tableRows"].push([])
        AuditAddlInfoData[name]["tableRows"][i].push(
          new mainstore.tableCol(
            rowData[i].sku,
            "enabled",
            false,
            "small",
            false,
            true,
            false,
            false
          )
        )
        AuditAddlInfoData[name]["tableRows"][i].push(
          new mainstore.tableCol(
            rowData[i].serial,
            "enabled",
            false,
            "small",
            false,
            true,
            false,
            false
          )
        )
        AuditAddlInfoData[name]["tableRows"][i].push(
          new mainstore.tableCol(
            rowData[i].quantity,
            "enabled",
            false,
            "small",
            false,
            true,
            false,
            false
          )
        )
      }
      AuditAddlInfoData[name]["footer"] = [
        new mainstore.tableCol(
          _(""),
          "header",
          false,
          "small",
          false,
          true,
          true,
          false
        )
      ]
    }

    return AuditAddlInfoData
  },
  getLooseItemsData: function() {
    var KDeepLooseItemsData = this.state.AuditKDeepLooseItemsData
    if (KDeepLooseItemsData) {
      var looseItemsData = {}
      var header = [
        new mainstore.tableCol(
          _("Each"),
          "header",
          false,
          "small",
          false,
          true,
          true,
          false
        ),
        new mainstore.tableCol(
          _("Actual"),
          "header",
          false,
          "small",
          false,
          true,
          true,
          false
        )
      ]
      looseItemsData["header"] = header
      looseItemsData["tableRows"] = []
      for (var i = 0; i < KDeepLooseItemsData.length; i++) {
        looseItemsData["tableRows"].push([])
        looseItemsData["tableRows"][i].push(
          new mainstore.tableCol(
            KDeepLooseItemsData[i].Sku,
            "enabled",
            false,
            "small",
            false,
            true,
            false,
            false
          )
        )
        looseItemsData["tableRows"][i].push(
          new mainstore.tableCol(
            KDeepLooseItemsData[i].Actual_qty,
            "enabled",
            false,
            "small",
            false,
            true,
            false,
            false
          )
        )
      }
      looseItemsData["footer"] = [
        new mainstore.tableCol(
          _(""),
          "header",
          false,
          "small",
          false,
          true,
          true,
          false
        )
      ]
      return looseItemsData["tableRows"].length > 0 ? looseItemsData : null
    }
    return null
  },
  getScreenComponent: function(screen_id) {
    switch (screen_id) {
      case appConstants.AUDIT_WAITING_FOR_MSU:
        if (this.state.AuditExceptionStatus == false) {
          this._navigation = (
            <Navigation
              navData={this.state.AuditNavData}
              serverNavData={this.state.AuditServerNavData}
              navMessagesJson={this.props.navMessagesJson}
            />
          )
          this._component = (
            <div className="grid-container">
              <Modal />
              <div className="main-container">
                <Spinner />
              </div>
            </div>
          )
        } else {
          this._component = this.getExceptionComponent()
        }
        break

      case appConstants.AUDIT_LOCATION_SCAN:
        var rackType = ""
        if (this.state.AuditRackTypeMPU) {
          rackType = <Pallet />
        } else {
          rackType = (
            <Rack
              isDrawer={this.state.isDrawer}
              slotType={this.state.SlotType}
              rackData={this.state.AuditRackDetails}
              putDirection={this.state.AuditPickDirection}
            />
          )
        }
        if (this.state.AuditSRStatus) {
          this._navigation = (
            <Navigation
              navData={this.state.AuditNavData}
              serverNavData={this.state.AuditServerNavData}
              navMessagesJson={this.props.navMessagesJson}
            />
          )
          this._component = (
            <div className="grid-container">
              <Modal />
              <div className="main-container">{rackType}</div>
            </div>
          )
        } else {
          if (this.state.AuditExceptionStatus == false) {
            this._navigation = (
              <Navigation
                navData={this.state.AuditNavData}
                serverNavData={this.state.AuditServerNavData}
                navMessagesJson={this.props.navMessagesJson}
              />
            )
            this._component = (
              <div className="grid-container">
                <Modal />
                <div className="main-container">{rackType}</div>
              </div>
            )
          } else {
            this._component = this.getExceptionComponent()
          }
        }

        break

      case appConstants.AUDIT_SCAN:
        if (this.state.AuditExceptionStatus == false) {
          this._navigation = (
            <Navigation
              navData={this.state.AuditNavData}
              serverNavData={this.state.AuditServerNavData}
              navMessagesJson={this.props.navMessagesJson}
            />
          )
          if (this.state.AuditCancelScanStatus == true) {
            this._cancelStatus = (
              <div className="cancel-scan">
                <Button1
                  disabled={false}
                  text={_("Cancel Scan")}
                  module={appConstants.AUDIT}
                  action={appConstants.CANCEL_SCAN}
                  color={"black"}
                />
              </div>
            )
          } else {
            this._cancelStatus = ""
          }
          if (this.state.AuditBoxSerialData["tableRows"].length > 0) {
            this._boxSerial = (
              <TabularData data={this.state.AuditBoxSerialData} />
            )
          } else {
            this._boxSerial = ""
          }
          if (this.state.AuditLooseItemsData["tableRows"].length > 0) {
            this._looseItems = (
              <TabularData data={this.state.AuditLooseItemsData} />
            )
          } else {
            this._looseItems = ""
          }

          this._component = (
            <div className="grid-container">
              <Modal />
              <CurrentSlot slotDetails={this.state.AuditSlotDetails} />
              <div className="main-container space-left">
                <div className="audit-scan-left">
                  {this._boxSerial}
                  {this._looseItems}
                </div>
                <div className="audit-scan-middle">
                  <Img srcURL={this.state.AuditItemDetailsData.image_url} />
                  <TabularData data={this.state.AuditItemDetailsData} />
                </div>
                <div className="audit-scan-right">
                  <KQ scanDetailsGood={this.state.AuditKQQuantity} />
                  <div className="finish-scan">
                    <Button1
                      disabled={!this.state.AuditFinishFlag}
                      text={_("Finish")}
                      module={appConstants.AUDIT}
                      action={appConstants.GENERATE_REPORT}
                      color={"orange"}
                    />
                  </div>
                </div>
              </div>
              {this._cancelStatus}
            </div>
          )
        } else {
          this._component = this.getExceptionComponent()
        }

        break
      //SR Audit

      case appConstants.AUDIT_SCAN_SR:
        if (this.state.AuditExceptionStatus == false) {
          var uomOptions = this.getUOMDropdownValues()
          var looseItemsData = this.getLooseItemsData()
          var isAddlInfoPresent = this.state.isAddlInfoPresent
          var kqDisabled = !this.state.kQstatus
          if (isAddlInfoPresent) {
            var AuditAddlInfoData = this.getAddlInfoData()
          }
          this._navigation = (
            <Navigation
              navData={this.state.AuditNavData}
              serverNavData={this.state.AuditServerNavData}
              navMessagesJson={this.props.navMessagesJson}
            />
          )
          if (this.state.AuditCancelScanStatus == true) {
            this._cancelStatus = (
              <div className="cancel-scan">
                <Button1
                  disabled={false}
                  text={_("Cancel Scan")}
                  module={appConstants.AUDIT}
                  action={appConstants.CANCEL_SCAN}
                  color={"black"}
                />
              </div>
            )
          } else {
            this._cancelStatus = ""
          }
          if (this.state.AuditPackData["tableRows"].length > 0) {
            this._packData = (
              <div className="audit-wrapper">
                {isAddlInfoPresent &&
                  this.state.infoButtonData.container_level_2 && (
                    <p className="a-info-wrap">
                      <span
                        className="audit-uom-info-icon"
                        onClick={function() {
                          this._openAddlInfoModal(true)
                        }.bind(this)}
                      >
                        <i>i</i>
                      </span>
                    </p>
                  )}
                <TabularData
                  data={this.state.AuditPackData}
                  className="audit_scan"
                />
              </div>
            )
          } else {
            this._packData = ""
          }
          if (this.state.AuditSubPackData["tableRows"].length > 0) {
            this._subPackData = (
              <div className="audit-wrapper">
                {isAddlInfoPresent &&
                  this.state.infoButtonData.container_level_1 && (
                    <p className="a-info-wrap">
                      <span
                        className="audit-uom-info-icon"
                        onClick={function() {
                          this._openAddlInfoModal(true)
                        }.bind(this)}
                      >
                        <i>i</i>
                      </span>
                    </p>
                  )}
                <TabularData
                  data={this.state.AuditSubPackData}
                  className="audit_scan"
                />
              </div>
            )
          } else {
            this._subPackData = ""
          }
          if (looseItemsData) {
            this._looseItemData = (
              <div className="audit-wrapper">
                {isAddlInfoPresent && (
                  <p className="a-info-wrap">
                    <span
                      className="audit-uom-info-icon"
                      onClick={function() {
                        this._openAddlInfoModal(true)
                      }.bind(this)}
                    >
                      <i>i</i>
                    </span>
                  </p>
                )}
                <TabularData data={looseItemsData} className="audit_scan" />
              </div>
            )
          } else {
            this._looseItemData = ""
          }
          if (this.state.AuditLooseItemsData["tableRows"].length > 0) {
            this._looseItems = (
              <div className="audit-wrapper">
                {isAddlInfoPresent &&
                  this.state.infoButtonData.container_level_0 && (
                    <p className="a-info-wrap">
                      <span
                        className="audit-uom-info-icon"
                        onClick={function() {
                          this._openAddlInfoModal(true)
                        }.bind(this)}
                      >
                        <i>i</i>
                      </span>
                    </p>
                  )}
                <TabularData
                  data={this.state.AuditLooseItemsData}
                  className="audit_scan"
                />
              </div>
            )
          } else {
            this._looseItems = ""
          }

          this._component = (
            <div className="grid-container">
              <Modal />

              <div className="main-container space-left">
                <div className="audit-scan-left">
                  {this._looseItemData}
                  {this._packData}
                  {this._subPackData}
                  {this._looseItems}
                </div>
                {this.state.allInfoModalStatus && isAddlInfoPresent && (
                  <ReactModal
                    title={_("Additional Information")}
                    customClassNames="audit-uom-info"
                  >
                    <GorTabs
                      onTabClick={this._onTabClick}
                      defaultActiveTabIndex={this.state.selectedTab}
                      tabClass={"tabs-audit"}
                    >
                      {Object.keys(AuditAddlInfoData).map(function(
                        value,
                        index
                      ) {
                        return (
                          <Tab
                            tabName={value}
                            iconClassName={"icon-class-0"}
                            linkClassName={"link-class-0"}
                          >
                            <div className="audit-table-wrap">
                              <TabularData data={AuditAddlInfoData[value]} />
                            </div>
                          </Tab>
                        )
                      })}
                    </GorTabs>
                    <div className="modal-footer removeBorder">
                      <div className="buttonContainer center-block chklstButtonContainer">
                        <div className="row removeBorder">
                          <div className="col-md-1 pull-right">
                            <button
                              className={"close-info custom-button black"}
                              onClick={function() {
                                this._openAddlInfoModal(false)
                              }.bind(this)}
                            >
                              {_("Close")}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ReactModal>
                )}
                <div className="audit-scan-middle">
                  {this.state.isChangeUOMApplicable && (
                    <div className="uom-selection">
                      <GorSelect
                        options={uomOptions}
                        customData={true}
                        selectedOption={this.state.selectedUOM}
                        placeholderPrefix={_("Selected UOM: ")}
                        onSelectHandler={this._onSelect}
                        placeholder={
                          this.state.customContainerNames[
                            this.state.selectedUOM
                          ] || _("Select Value")
                        }
                      >
                        {function(_this) {
                          var options = []
                          uomOptions.map(function(el, idx) {
                            options.push(
                              <span
                                className="gor-dropdown-option"
                                key={el.value}
                                onClick={function() {
                                  _this._onSelect(el.value, el.text)
                                }}
                              >
                                <section>
                                  <span className="icon-cont">
                                    <img
                                      src={
                                        "./assets/images/" + el.value + ".png"
                                      }
                                      height={80}
                                      width={80}
                                    />
                                  </span>
                                  <span className="text-cont">{el.text}</span>
                                  <span
                                    className={
                                      _this.state.selectedValue === el.value
                                        ? "selected-green sel-icon-cont"
                                        : "sel-icon-cont"
                                    }
                                  />
                                </section>
                              </span>
                            )
                          })
                          return options
                        }}
                      </GorSelect>
                    </div>
                  )}
                  <Img srcURL={this.state.AuditItemDetailsData.image_url} />
                  <TabularData data={this.state.AuditItemDetailsData} />
                </div>
                <div className="audit-scan-right">
                  {console.log("Sudivya", this.state.AuditSRKQQuantity)}
                  <KQ scanDetailsGood={this.state.AuditSRKQQuantity} />

                  <div className="finish-scan">
                    <Button1
                      disabled={!this.state.AuditFinishFlag}
                      text={_("Finish")}
                      module={appConstants.AUDIT}
                      action={appConstants.GENERATE_REPORT}
                      color={"orange"}
                    />
                  </div>
                </div>
              </div>
              {this._cancelStatus}
            </div>
          )
        } else {
          this._component = this.getExceptionComponent()
        }

        break
      case appConstants.AUDIT_RECONCILE:
        if (this.state.AuditExceptionStatus == false) {
          this._navigation = (
            <Navigation
              navData={this.state.AuditNavData}
              serverNavData={this.state.AuditServerNavData}
              navMessagesJson={this.props.navMessagesJson}
            />
          )
          var subComponent = ""
          var messageType = "large"
          var BoxSerialData = ""
          var ItemInBoxData = ""
          var LooseItemsData = ""
          var AuditMessage = ""
          var PackData = ""
          var SubPackData = ""
          var DamageData = ""
          var FinalDamageData = ""
          var Slot = ""
          var displayStyle
          var auditPossibleContainerNames = this.state
            .AuditPossibleContainerNames
          var mm = {
            details: [],
            code: "Audit.A.012",
            description: "No Items To Reconcile",
            level: "info"
          }

          var SRmessage = {
            details: [],
            code: "AdF.B.004",
            description: "No entities to reconcile",
            level: "info"
          }
          if (
            this.state.AuditReconcileBoxSerialData["tableRows"].length == 0 &&
            this.state.AuditReconcileItemInBoxData["tableRows"].length == 0 &&
            this.state.AuditReconcileLooseItemsData["tableRows"].length == 0 &&
            !this.state.AuditSRStatus
          )
            AuditMessage = (
              <Reconcile
                navMessagesJson={this.props.navMessagesJson}
                message={mm}
              />
            )
          if (
            this.state.AuditReconcilePackData["tableRows"].length == 0 &&
            this.state.AuditReconcileSubPackData["tableRows"].length == 0 &&
            this.state.DamageReconcileData["tableRows"].length == 0 &&
            this.state.AuditSRStatus
          )
            AuditMessage = (
              <Reconcile
                navMessagesJson={this.props.navMessagesJson}
                message={SRmessage}
              />
            )
          if (this.state.AuditReconcileBoxSerialData["tableRows"].length != 0)
            BoxSerialData = (
              <TabularData data={this.state.AuditReconcileBoxSerialData} />
            )
          if (this.state.AuditReconcileItemInBoxData["tableRows"].length != 0)
            ItemInBoxData = (
              <TabularData data={this.state.AuditReconcileItemInBoxData} />
            )
          if (this.state.AuditReconcileLooseItemsData["tableRows"].length != 0)
            LooseItemsData = (
              <TabularData data={this.state.AuditReconcileLooseItemsData} />
            )
          if (this.state.AuditReconcilePackData["tableRows"].length != 0)
            PackData = (
              <TabularData
                className="srTable"
                data={this.state.AuditReconcilePackData}
              />
            )
          if (this.state.AuditReconcileSubPackData["tableRows"].length != 0)
            SubPackData = (
              <TabularData
                className="srTable"
                data={this.state.AuditReconcileSubPackData}
              />
            )
          if (this.state.DamageReconcileData["tableRows"].length != 0)
            DamageData = (
              <TabularData
                className="srTable"
                data={this.state.DamageReconcileData}
              />
            )
          if (this.state.FinalDamageReconcileData["tableRows"].length != 0)
            FinalDamageData = (
              <TabularData
                className="srTable"
                data={this.state.FinalDamageReconcileData}
              />
            )
          if (!this.state.AuditSRStatus)
            Slot = <CurrentSlot slotDetails={this.state.AuditSlotDetails} />
          subComponent = (
            <div className="main-container">
              <div className="audit-reconcile-left">
                {AuditMessage}
                {BoxSerialData}
                {ItemInBoxData}
                {LooseItemsData}
                {PackData}
                {SubPackData}
                {DamageData}
                {FinalDamageData}
              </div>
            </div>
          )
          messageType = "small"
          this._component = (
            <div
              className={
                this.state.AuditSRStatus
                  ? "grid-container audit-reconcilation-sr"
                  : "grid-container audit-reconcilation"
              }
            >
              <Modal />
              {Slot}
              {subComponent}
              <div className="staging-action">
                <Button1
                  disabled={false}
                  text={_("Back")}
                  module={appConstants.AUDIT}
                  action={appConstants.CANCEL_FINISH_AUDIT}
                  color={"black"}
                />
                <Button1
                  disabled={false}
                  text={_("OK")}
                  module={appConstants.AUDIT}
                  action={appConstants.FINISH_CURRENT_AUDIT}
                  color={"orange"}
                />
              </div>
            </div>
          )
        } else {
          this._component = this.getExceptionComponent()
        }
        break

      case appConstants.AUDIT_DAMAGED_ENTITY_EXCEPTION:
        this._navigation = ""
        for (
          var i = 0;
          i < this.state.AuditDamagedItems.tableRows.length;
          i++
        ) {
          mainstore.setDamagedQuanity(
            this.state.AuditDamagedItems.tableRows[i][3].text
          )
          var staticCountFlag = this.state.AuditDamagedItems.tableRows[i][3]
            .buttonStatus
          if (staticCountFlag === true) {
            var dynamicCount = mainstore.getDamagedQuantity()
            if (dynamicCount <= 0) {
              var dynamicCountFlag = false
            } else {
              var dynamicCountFlag = true
            }
            this._disableNext = !(staticCountFlag && dynamicCountFlag)
          } else {
            this._disableNext = !staticCountFlag
          }
          // Serialised flow specific sceanrio
          let isDamagedQuantityOne =
            this.state.AuditDamagedCount.length &&
            this.state.AuditDamagedCount[0].damaged_qty === 1
              ? true
              : false
          let isKQDisabled = this.state.AuditDamagedCount.length
            ? !this.state.AuditDamagedCount[0].enable_kq_row
            : false
          if (isDamagedQuantityOne && isKQDisabled) {
            this._disableNext = false
          }
        }

        this._component = (
          <div className="grid-container exception">
            <Modal />
            <Exception data={this.state.AuditExceptionData} />
            <div className="exception-right">
              <ExceptionHeader data={this.state.AuditServerNavData} />
              <TabularData
                data={this.state.AuditDamagedItems}
                className="limit-height width-extra "
              />
              <div className="finish-damaged-barcode">
                <Button1
                  disabled={this._disableNext}
                  text={_("NEXT")}
                  color={"orange"}
                  module={appConstants.AUDIT}
                  action={appConstants.SEND_AUDIT_DAMAGED_ENTITY_DETAILS}
                />
              </div>
            </div>
            <div className="cancel-scan">
              <Button1
                disabled={false}
                text={_("Cancel Exception")}
                module={appConstants.AUDIT}
                action={appConstants.CANCEL_EXCEPTION_TO_SERVER}
                color={"black"}
              />
            </div>
          </div>
        )

        break

      case appConstants.AUDIT_FRONT_IRT_BIN_CONFIRM:
        var selected_screen
        if (!this.state.GetIRTScanStatus) {
          selected_screen = (
            <div className="gor-exception-align">
              <div className="gor-exceptionConfirm-text">
                {_("Please put exception entities in exception area")}
              </div>
              <div className="finish-damaged-barcode align-button">
                <Button1
                  disabled={false}
                  text={_("Confirm")}
                  color={"orange"}
                  module={appConstants.AUDIT}
                  action={
                    appConstants.SEND_AUDIT_DAMAGED_ENTITY_DETAILS_ON_CONFIRM
                  }
                />
              </div>
            </div>
          )
        } else {
          selected_screen = (
            <div className="gor-exception-align">
              <div className="gor-exceptionConfirm-text">
                {_("Please put exception entities in IRT bin and scan the bin")}
              </div>
            </div>
          )
        }
        this._component = (
          <div className="grid-container exception">
            <Modal />
            <Exception data={this.state.AuditExceptionData} />
            <div className="exception-right">{selected_screen}</div>
            <div className="cancel-scan">
              <Button1
                disabled={false}
                text={_("Cancel Exception")}
                module={appConstants.AUDIT}
                action={appConstants.CANCEL_EXCEPTION_TO_SERVER}
                color={"black"}
              />
            </div>
          </div>
        )
        break

      case appConstants.AUDIT_EXCEPTION_BOX_DAMAGED_BARCODE:
      case appConstants.AUDIT_EXCEPTION_LOOSE_ITEMS_DAMAGED_EXCEPTION:
      case appConstants.AUDIT_EXCEPTION_ITEM_IN_BOX_EXCEPTION:
      case appConstants.AUDIT_PACK_UNSCANNABLE_EXCEPTION:
      case appConstants.AUDIT_SUB_PACK_UNSCANNABLE_EXCEPTION:
      case appConstants.AUDIT_EACH_UNSCANNABLE_EXCEPTION:
        this._navigation = ""
        if (this.state.AuditExceptionScreen == "first_screen") {
          /**
           * T2803: Next button disable issue in Audit
           */
          this._disableNext = this.state.AuditKQDetails.current_qty
            ? false
            : true
          this._component = (
            <div className="grid-container exception">
              <Modal />
              <Exception data={this.state.AuditExceptionData} />
              <div className="exception-right">
                <ExceptionHeader data={this.state.AuditServerNavData} />
                <KQ scanDetailsGood={this.state.AuditKQDetails} />
                <div className="finish-damaged-barcode">
                  <Button1
                    disabled={this._disableNext}
                    text={_("NEXT")}
                    color={"orange"}
                    module={appConstants.AUDIT}
                    action={appConstants.AUDIT_NEXT_SCREEN}
                  />
                </div>
              </div>
              <div className="cancel-scan">
                <Button1
                  disabled={false}
                  text={_("Cancel Exception")}
                  module={appConstants.AUDIT}
                  action={appConstants.CANCEL_EXCEPTION_TO_SERVER}
                  color={"black"}
                />
              </div>
            </div>
          )
        } else if (this.state.AuditExceptionScreen == "second_screen") {
          this._component = (
            <div className="grid-container exception">
              <Modal />
              <Exception data={this.state.AuditExceptionData} />
              <div className="exception-right">
                <div className="main-container exception2">
                  <div className="kq-exception">
                    <div className="kq-header">
                      {_("Please put entities in exception area and confirm")}
                    </div>
                  </div>
                </div>
                <div className="finish-damaged-barcode">
                  <Button1
                    disabled={false}
                    text={_("FINISH")}
                    color={"orange"}
                    module={appConstants.AUDIT}
                    action={appConstants.SEND_KQ_QTY}
                  />
                </div>
              </div>
              <div className="cancel-scan">
                <Button1
                  disabled={false}
                  text={_("Cancel Exception")}
                  module={appConstants.AUDIT}
                  action={appConstants.CANCEL_EXCEPTION_TO_SERVER}
                  color={"black"}
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
            navData={this.state.AuditNavData}
            serverNavData={this.state.AuditServerNavData}
            navMessagesJson={this.props.navMessagesJson}
          />
        )
        var _button
        if (this.state.AuditScreenId == appConstants.SCANNER_MANAGEMENT) {
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
          )
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
          )
        }
        this._component = (
          <div className="grid-container audit-reconcilation">
            <Modal />
            <div className="row scannerHeader">
              <div className="col-md-6">
                <div className="ppsMode">
                  {" "}
                  PPS Mode : {this.state.AuditPpsMode.toUpperCase()}{" "}
                </div>
              </div>
              <div className="col-md-6">
                <div className="seatType">
                  {" "}
                  Seat Type : {this.state.AuditSeatType.toUpperCase()}
                </div>
              </div>
            </div>
            <TabularData data={this.state.utility} />
            {_button}
          </div>
        )
        break
      case appConstants.ITEM_SEARCH:
        this._navigation = ""
        this._component = (
          <div>
            <div className="outerWrapperItemSearch">
              <div className="subHeaderItemDetails">{_("Item details")}</div>
              <div className="innerWrapperItemSearch">
                <div className="textBoxContainer">
                  <span className="barcode" />
                  <TextEditor
                    callAPItoGetData={this.callAPItoGetData.bind(this)}
                  />
                </div>
              </div>
            </div>
            <div className="itemSearchfooter">
              <Button1
                disabled={false}
                text={_("Close")}
                module={appConstants.SEARCH_MANAGEMENT}
                status={true}
                action={appConstants.BACK}
                color={"black"}
              />
            </div>
          </div>
        )
        break
      case appConstants.ITEM_SEARCH_RESULT:
        this._navigation = ""
        this._component = (
          <div>
            <div className="outerWrapperItemSearch">
              <div className="subHeaderItemDetails">{_("Item details")}</div>
              <div className="innerWrapperItemResult">
                {this.state.loaderState ? (
                  <div className="spinnerDiv">
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
            <div className="itemSearchfooter">
              <Button1
                disabled={false}
                text={_("Close")}
                module={appConstants.SEARCH_MANAGEMENT}
                status={true}
                action={appConstants.BACK}
                color={"black"}
              />
            </div>
          </div>
        )
        break

      default:
        return true
    }
  },
  getNotificationComponent: function() {
    if (this.state.AuditNotification != undefined) {
      this._notification = (
        <Notification
          notification={this.state.AuditNotification}
          navMessagesJson={this.props.navMessagesJson}
        />
      )
    } else {
      if ($(".modal.notification-error").is(":visible")) {
        setTimeout(function() {
          $(".modal.notification-error").data(
            "bs.modal"
          ).options.backdrop = true
          $(".modal-backdrop").remove()
          $(".modal.notification-error").modal("hide")
          $(".modal").removeClass("notification-error")
        }, 0)

        return null
      } else if ($(".modal.in").is(":visible")) {
        setTimeout(function() {
          if (
            $(".modal.in")
              .find("div")
              .hasClass("modal-footer")
          ) {
            //check when errorcode is true and modal has buttons
            $(".modal.in").data("bs.modal").options.backdrop = "static"
          } else {
            //check when errorcode is true and modal has NO buttons
            $(".modal.in").data("bs.modal").options.backdrop = true
          }
        }, 0)
        return null
      }
      this._notification = ""
    }
  },
  render: function(data) {
    this.getNotificationComponent()
    this.getScreenComponent(this.state.AuditScreenId)
    return (
      <div className="main">
        <Header />
        {this._navigation}
        {this._component}
        {this._notification}
      </div>
    )
  }
})

module.exports = Audit
