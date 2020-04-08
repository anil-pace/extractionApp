var React = require('react')
var mainstore = require('../stores/mainstore')
var utils = require('../utils/utils.js')
var CommonActions = require('../actions/CommonActions')

function getStateData() {
  return {}
}
var STNInput = React.createClass({
  componentWillMount: function() {
    mainstore.addChangeListener(this.onChange)
  },
  componentWillUnmount: function() {
    mainstore.addChangeListener(this.onChange)
  },
  onChange: function() {
    this.setState(getStateData())
  },
  openKeyboard: function() {
    $('#actionMenu').hide()
    $('.form-control').blur()
    virtualKeyBoard_header = $('#invoiceNumber').keyboard({
      layout: 'custom',
      customLayout: {
        default: [
          '! @ # $ % ^ & * + _',
          '1 2 3 4 5 6 7 8 9 0 {b}',
          'q w e r t y u i o p',
          'a s d f g h j k l',
          '{shift} z x c v b n m . {shift}',
          '{space}',
          '{a} {c}'
        ],
        shift: [
          '( ) { } [ ] = ~ ` -',
          '< > | ? / " : ; , \' {b}',
          'Q W E R T Y U I O P',
          'A S D F G H J K L',
          '{shift} Z X C V B N M . {shift}',
          '{space}',
          '{a} {c}'
        ]
      },
      css: {
        container:
          'ui-widget-content ui-widget ui-corner-all ui-helper-clearfix custom-keypad'
      },
      reposition: true,
      alwaysOpen: false,
      initialFocus: true,
      visible: function(e, keypressed, el) {
        el.value = ''
      },
      accepted: function(e, keypressed, el) {
        if (e.target.value.trim() === '') {
        } else {
          var data = {
            event_name: 'process_barcode',
            event_data: {
              barcode: e.target.value.trim()
            },
            source: 'ui'
          }
          CommonActions.postDataToInterface(data)
        }
      }
    })
    $('#invoiceNumber')
      .data('keyboard')
      .reveal()
  },

  render: function(data) {
    var applyClassName,
      showErrorMsg,
      invoiceStringArg = []
    if (
      this.props.invoiceType.constructor === String &&
      this.props.invoiceType.length > 0
    ) {
      invoiceStringArg = this.props.invoiceType
    } else if (this.props.errorFound) {
      invoiceStringArg = this.props.errorFound.details
    }
    var errorCode = this.props.errorFound ? this.props.errorFound.code : ''
    var errorMsg = utils.frntStringTransform(errorCode, invoiceStringArg)
    if (
      this.props.errorFound && this.props.errorFound.level === 'error'
        ? ((applyClassName = 'inputWrapper showError'),
          (showErrorMsg = errorMsg))
        : ((applyClassName = 'inputWrapper noError'), (showErrorMsg = ''))
    );

    return (
      <div className='gor-invoice-input-keyboard-wrap'>
        <div className={applyClassName}>
          <span className='barcode' />
          <input
            type='text'
            className='form-control gor-invoice-input-box-wrap'
            id='invoiceNumber'
            placeholder={this.props.inputPlaceHolder}
            ref='invoiceNumber'
            onClick={this.openKeyboard}
          />
        </div>
        <span className='ErrorMessage'>{showErrorMsg}</span>
      </div>
    )
  }
})

module.exports = STNInput
