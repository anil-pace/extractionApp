var React = require("react")
var CommonActions = require("../../actions/CommonActions")
var mainstore = require("../../stores/mainstore")
var appConstants = require("../../constants/appConstants")
var resourceConstants = require("../../constants/resourceConstants")
var _scanDetails = {},
  _keypress = false

var NumericIndicator = React.createClass({
  _appendClassUp: "gor-plus-sign enable",
  _qtyComponent: null,
  _appendClassDown: "gor-minus-sign enable",
  virtualKeyboard: null,
  _id: "keyboard",
  _enableIncrement: true,
  _enableDecrement: true,
  _updatedQtyGood: 0,
  _updatedQtyDamaged: 0,
  _updatedQtyUnscannble: 0,
  _updatedQtyMissing: 0,
  _qty: 0,
  getInitialState: function() {
    if (this.props.damagedQty !== undefined) {
      this._updatedQtyDamaged = this.props.damagedQty
      this._qty =
        this.props.execType === appConstants.DAMAGED_QUANTITY
          ? this.props.damagedQty
          : 0
    } else {
      this._qty =
        this.props.execType === appConstants.DEFAULT
          ? this.props.scanDetails.current_qty
          : 0
    }
    return {
      goodQuantity: mainstore.getGoodQuantity(),
      value: this._qty
    }
  },
  self: this,
  generateExcessNotification: function() {
    var data = {}
    data["code"] = resourceConstants.CLIENTCODE_008
    data["level"] = "error"
    CommonActions.generateNotification(data)
    return
  },

  changeValueIncrement: function(event) {
    if (
      this.props.execType === appConstants.GOOD_QUANTITY ||
      this.props.execType === appConstants.GOOD_PACK ||
      this.props.execType === appConstants.GOOD_SUB_PACK
    ) {
      this._updatedQtyGood++
      this.setState({
        value: this._updatedQtyGood
      })
    } else if (
      this.props.execType === appConstants.MISSING_QUANTITY ||
      this.props.execType === appConstants.PACK_MISSING ||
      this.props.execType === appConstants.SUB_PACK_MISSING
    ) {
      this._updatedQtyMissing++

      this.setState({
        value: this._updatedQtyMissing
      })
    } else if (
      this.props.execType === appConstants.UNSCANNABLE_QUANTITY ||
      this.props.execType === appConstants.BAD_BARCODE_PACK ||
      this.props.execType === appConstants.BAD_BARCODE_SUB_PACK
    ) {
      this._updatedQtyUnscannble++

      this.setState({
        value: this._updatedQtyUnscannble
      })
    } else if (
      this.props.execType === appConstants.DAMAGED_QUANTITY ||
      this.props.execType === appConstants.DAMAGED_PACK ||
      this.props.execType === appConstants.DAMAGED_SUB_PACK
    ) {
      this._updatedQtyDamaged++

      this.setState({
        value: this._updatedQtyDamaged
      })
    } else {
      this._qty++
      this.setState({
        value: this._qty
      })
    }
  },

  changeValueDecrement: function(event) {
    if (
      this.props.execType === appConstants.GOOD_QUANTITY ||
      this.props.execType === appConstants.GOOD_PACK ||
      this.props.execType === appConstants.GOOD_SUB_PACK
    ) {
      this._updatedQtyGood--
      this.setState({
        value: this._updatedQtyGood
      })
    } else if (
      this.props.execType === appConstants.MISSING_QUANTITY ||
      this.props.execType === appConstants.PACK_MISSING ||
      this.props.execType === appConstants.SUB_PACK_MISSING
    ) {
      this._updatedQtyMissing--

      this.setState({
        value: this._updatedQtyMissing
      })
    } else if (
      this.props.execType === appConstants.UNSCANNABLE_QUANTITY ||
      this.props.execType === appConstants.BAD_BARCODE_PACK ||
      this.props.execType === appConstants.BAD_BARCODE_SUB_PACK
    ) {
      this._updatedQtyUnscannble--

      this.setState({
        value: this._updatedQtyUnscannble
      })
    } else if (
      this.props.execType === appConstants.DAMAGED_QUANTITY ||
      this.props.execType === appConstants.DAMAGED_PACK ||
      this.props.execType === appConstants.DAMAGED_SUB_PACK
    ) {
      this._updatedQtyDamaged--

      this.setState({
        value: this._updatedQtyDamaged
      })
    } else {
      this._qty--
      this.setState({
        value: this._qty
      })
    }
  },

  updateStore: function(event, qty) {
    var total_entered =
      this._updatedQtyGood +
      this._updatedQtyMissing +
      this._updatedQtyDamaged +
      this._updatedQtyUnscannble
    if (this._enableIncrement === true && _keypress === true) {
      var data = {}
      switch (this.props.execType) {
        case appConstants.GOOD_QUANTITY:
        case appConstants.GOOD_PACK:
        case appConstants.GOOD_SUB_PACK:
          CommonActions.updateGoodQuantity(parseInt(this._updatedQtyGood))
          break
        case appConstants.MISSING_QUANTITY:
        case appConstants.PACK_MISSING:
        case appConstants.SUB_PACK_MISSING:
          CommonActions.updateMissingQuantity(parseInt(this._updatedQtyMissing))
          break
        case appConstants.DAMAGED_QUANTITY:
        case appConstants.DAMAGED_PACK:
        case appConstants.DAMAGED_SUB_PACK:
          CommonActions.updateDamagedQuantity(parseInt(this._updatedQtyDamaged))
          break
        case appConstants.UNSCANNABLE_QUANTITY:
        case appConstants.BAD_BARCODE_PACK:
        case appConstants.BAD_BARCODE_SUB_PACK:
          CommonActions.updateUnscannableQuantity(
            parseInt(this._updatedQtyUnscannble)
          )
          break
        default:
          CommonActions.updateKQQuantity(parseInt(this._qty))
      }
      return true
    }
  },
  incrementValue: function(event) {
    var total_entered =
      parseInt(this._updatedQtyGood) +
      parseInt(this._updatedQtyMissing) +
      parseInt(this._updatedQtyDamaged) +
      parseInt(this._updatedQtyUnscannble)
    if (parseInt(total_entered, 10) > 9999) {
      this.generateExcessNotification()
    } else {
      var self = this
      if (this._enableIncrement) {
        _keypress = true
        if (event.type === "mousedown") {
          this.changeValueIncrement(event)
        }
      }
      self.updateStore()
    }
  },

  checkKqAllowed: function() {
    if (this.state.value <= 0) {
      this._appendClassDown = "gor-minus-sign disable"
      this._enableDecrement = false
    } else {
      this._appendClassDown = "gor-minus-sign enable"
      this._enableDecrement = true
    }

    if (this.state.value >= 9999) {
      this._appendClassUp = "gor-plus-sign disable"
      this._enableIncrement = false
    } else {
      this._appendClassUp = "gor-plus-sign enable"
      this._enableIncrement = true
    }
  },

  checkKqAllowedForAuditDamagedQuantity: function(isKQEnabled) {
    if (isKQEnabled) {
      if (this.state.value >= 1) {
        this._appendClassUp = "gor-plus-sign enable"
        this._appendClassDown = "gor-minus-sign enable"
        this._enableIncrement = true
        this._enableDecrement = true
      } else {
        this._appendClassDown = "gor-minus-sign disable"
        this._appendClassUp = "gor-plus-sign enabled"
        this._enableIncrement = true
        this._enableDecrement = false
      }
    } else {
      // case for serialised flow => increment should be disabled and decrement is possible till 0
      if (this.state.value === 0) {
        this._appendClassDown = "gor-minus-sign disable"
        this._enableDecrement = false
      }
      this._appendClassUp = "gor-plus-sign disable"
      this._enableIncrement = false
    }
  },

  decrementValue: function(event) {
    var self = this
    if (this._enableDecrement) {
      _keypress = true
      if (event.type === "mousedown") {
        this.changeValueDecrement(event)
      }

      self.updateStore()
    }
  },

  componentDidMount() {
    ;(function(self) {
      $(".gor_" + self.props.execType).keyboard({
        layout: "custom",
        customLayout: {
          default: ["1 2 3", "4 5 6", "7 8 9", ". 0 {b}", "{a} {c}"]
        },
        reposition: true,
        alwaysOpen: false,
        initialFocus: true,
        visible: function(e, keypressed, el) {
          $(".ui-keyboard-button.ui-keyboard-46").prop("disabled", true)
          $(".ui-keyboard-button.ui-keyboard-46").css("opacity", "0.6")
          $(".ui-keyboard").css("width", "230px")
          $(".ui-keyboard-preview-wrapper .ui-keyboard-preview").css(
            "font-size",
            "30px"
          )
          $(".ui-keyboard-button").css("width", "74px")
          $(".ui-keyboard-accept,.ui-keyboard-cancel").css("width", "110px")
          $("input.ui-keyboard-preview:visible").val("")
        },
        change: function(e, keypressed, el) {
          var data = {}
          if (_scanDetails.kq_allowed === false) {
            $(".ui-keyboard-preview").val("")
            data["code"] = resourceConstants.CLIENTCODE_013
            data["level"] = "error"
            CommonActions.generateNotification(data)
          } else if (parseInt(keypressed.last.val) > 9999) {
            self.generateExcessNotification()
            $(".ui-keyboard-preview").val(9999)
          } else {
            data["code"] = null
            data["level"] = "error"
            CommonActions.generateNotification(data)
          }
        },
        accepted: function(e, keypressed, el) {
          let txtBoxVal = isNaN(parseInt(e.target.value, 10))
            ? 0
            : Math.abs(parseInt(e.target.value, 10))
          if (
            self.props.execType === appConstants.GOOD_QUANTITY ||
            self.props.execType === appConstants.GOOD_PACK ||
            self.props.execType === appConstants.GOOD_SUB_PACK
          ) {
            self._updatedQtyGood = txtBoxVal
            CommonActions.updateGoodQuantity(parseInt(self._updatedQtyGood))
            self.setState({
              value: self._updatedQtyGood
            })
          } else if (
            self.props.execType === appConstants.MISSING_QUANTITY ||
            self.props.execType === appConstants.PACK_MISSING ||
            self.props.execType === appConstants.SUB_PACK_MISSING
          ) {
            self._updatedQtyMissing = txtBoxVal
            CommonActions.updateMissingQuantity(
              parseInt(self._updatedQtyMissing)
            )
            self.setState({
              value: self._updatedQtyMissing
            })
          } else if (
            self.props.execType === appConstants.UNSCANNABLE_QUANTITY ||
            self.props.execType === appConstants.BAD_BARCODE_PACK ||
            self.props.execType === appConstants.BAD_BARCODE_SUB_PACK
          ) {
            self._updatedQtyUnscannble = txtBoxVal
            CommonActions.updateUnscannableQuantity(
              parseInt(self._updatedQtyUnscannble)
            )
            self.setState({
              value: self._updatedQtyUnscannble
            })
          } else if (
            self.props.execType === appConstants.DAMAGED_QUANTITY ||
            self.props.execType === appConstants.DAMAGED_PACK ||
            self.props.execType === appConstants.DAMAGED_SUB_PACK
          ) {
            self._updatedQtyDamaged = txtBoxVal
            CommonActions.updateDamagedQuantity(
              parseInt(self._updatedQtyDamaged)
            )
            self.setState({
              value: self._updatedQtyDamaged
            })
          } else {
            self._qty = txtBoxVal
            CommonActions.updateKQQuantity(parseInt(self._qty))
            self.setState({
              value: self._qty
            })
          }
        }
      })
    })(this)
  },
  callBackForAuditDamagedException: function() {
    //update damaged Quantity in store.
    mainstore.setDamagedQuanity(this._updatedQtyDamaged)
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.btnValue !== this.props.btnValue) {
      this._updatedQtyDamaged = nextProps.btnValue
      this.setState(
        {
          value: nextProps.btnValue
        },
        this.callBackForAuditDamagedException()
      )
    }
  },
  componentWillMount: function() {
    var self = this
    /*Using settimeout to overcome the flux issue of Invariant Violation 
        when there are two simultaneous dispatches*/
    setTimeout(function() {
      CommonActions.updateKQQuantity(
        parseInt(
          self.props.execType === appConstants.GOOD_QUANTITY
            ? self.state.goodQuantity
            : self.state.value
        )
      )
    }, 0)
  },
  render: function(data) {
    var inputType = this.props.inputType ? this.props.inputType : "text"
    if (this.props.execType === appConstants.GOOD_QUANTITY) {
      return (
        <div
          className={
            this.props.Formattingclass
              ? "indicator-wrapper " + this.props.Formattingclass
              : "indicator-wrapper"
          }
        >
          <div>
            <span
              className={this._appendClassDown + " hideMe"}
              action={this.props.action}
              onClick={this.decrementValue}
              onMouseDown={this.decrementValue}
            ></span>
            <input
              disabled
              id="keyboard"
              value={this.state.goodQuantity}
              type={inputType}
              name="quantity"
              className={"gor-quantity-text gor_" + this.props.execType}
            />
            <span
              className={this._appendClassUp + " hideMe"}
              action={this.props.action}
              onClick={this.incrementValue}
              onMouseDown={this.incrementValue}
            ></span>
          </div>
        </div>
      )
    } else {
      if (
        this.props.isKQEnabled !== undefined &&
        this.props.execType === appConstants.DAMAGED_QUANTITY
      ) {
        this.checkKqAllowedForAuditDamagedQuantity(this.props.isKQEnabled)
        return (
          <div
            className={
              this.props.Formattingclass
                ? "indicator-wrapper " + this.props.Formattingclass
                : "indicator-wrapper"
            }
          >
            <div>
              <span
                className={this._appendClassDown}
                action={this.props.action}
                onClick={this.decrementValue}
                onMouseDown={this.decrementValue}
              ></span>
              <input
                disabled
                id="keyboard"
                value={this.state.value}
                type={inputType}
                name="quantity"
                className={"gor-quantity-text gor_" + this.props.execType}
              />
              <span
                className={this._appendClassUp}
                action={this.props.action}
                onClick={this.incrementValue}
                onMouseDown={this.incrementValue}
              ></span>
            </div>
          </div>
        )
      } else {
        this.checkKqAllowed()
        return (
          <div
            className={
              this.props.Formattingclass
                ? "indicator-wrapper " + this.props.Formattingclass
                : "indicator-wrapper"
            }
          >
            <div>
              <span
                className={this._appendClassDown}
                action={this.props.action}
                onClick={this.decrementValue}
                onMouseDown={this.decrementValue}
              ></span>
              <input
                id="keyboard"
                value={this.state.value}
                type={inputType}
                name="quantity"
                className={"gor-quantity-text gor_" + this.props.execType}
              />
              <span
                className={this._appendClassUp}
                action={this.props.action}
                onClick={this.incrementValue}
                onMouseDown={this.incrementValue}
              ></span>
            </div>
          </div>
        )
      }
    }
  }
})

module.exports = NumericIndicator
