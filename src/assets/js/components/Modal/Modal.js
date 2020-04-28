var React = require('react');
var mainstore = require('../../stores/mainstore');
var ModalHeader = require('./ModalHeader');
var PickFrontStore = require('../../stores/PickFrontStore');
var ModalFooter = require('./ModalFooter');
var Button1 = require('../Button/Button');
var appConstants = require('../../constants/appConstants');
var allSvgConstants = require('../../constants/svgConstants');
var NumericIndicator = require('../ProductDetails/NumericIndicator');
var bootstrap = require('bootstrap');
var jqueryPosition = require('jquery-ui/position');
var virtualkeyboard = require('virtual-keyboard');
var utils = require('../../utils/utils.js');
var component, title;

function getStateData(ths) {
  var modalType = mainstore.getModalType();
  var modalData = mainstore.getModalContent();
  //var ToteId= mainstore.getToteId()
  if (modalData) {
    for (let i = 0; i < modalData.length; i++) {
      if (
        modalData[i].type !== undefined &&
        modalData[i].product_sku !== undefined &&
        modalData[i].serial !== undefined &&
        modalData[i].quantity !== undefined
      ) {
        modalData[i] = {
          type: modalData[i].type,
          product_sku: modalData[i].product_sku,
          serial: modalData[i].serial,
          quantity: modalData[i].quantity
        };
        if (modalData[i].serial.length === 0) {
          modalData[i].serial = '--';
        } else {
          for (let j = 0; j < modalData[i].serial.length; j++) {
            if (modalData[i].serial[j].length > 10) {
              modalData[i].serial[j] =
                modalData[i].serial[j].slice(0, 5) +
                '...' +
                modalData[i].serial[j].slice(-5);
            }
          }
        }
      }
    }
  }
  loadComponent(modalType, modalData, ths);
  return {
    data: modalData,
    type: modalType
  };
}

function attachKeyboard(id) {
  virtualKeyBoard1 = $('#' + id).keyboard({
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
      el.value = '';
    },
    accepted: function(e, keypressed, el) {}
  });
  $('#' + id)
    .data('keyboard')
    .reveal();
}

function attachNumpad(id) {
  virtualKeyBoard1 = $('#' + id).keyboard({
    layout: 'custom',
    customLayout: {
      default: ['1 2 3', '4 5 6', '7 8 9', '. 0 {b}', '{a} {c}']
    },
    reposition: true,
    alwaysOpen: false,
    initialFocus: true,
    accepted: function(e, keypressed, el) {},
    visible: function(e, keypressed, el) {
      el.value = '';
    }
  });
  $('#' + id)
    .data('keyboard')
    .reveal();
}

function loadComponent(modalType, modalData, ths) {
  switch (modalType) {
      case appConstants.REMOVE_ALL_BUTTON_CONFIRMATION:
        component = [];
        component.push(
          <div>
            <div className='row'>
              <div className='col-md-12'>
                <div className='title-textbox'>
                  {_(
                    'Are you sure all Entities are removed from the MTU? MTU will auto undock after confirmation'
                  )}
                </div>
              </div>
            </div>
            <div className='modal-footer removeBorder'>
              <div className='buttonContainer center-block chklstButtonContainer'>
                <div className='row removeBorder'>
                  <div className='col-md-6'>
                    <Button1
                      disabled={false}
                      text={_('Cancel')}
                      color={'black'}
                      module={appConstants.ORDER_PICK}
                      action={
                        appConstants.CANCEL_REMOVE_ALL_ENTITIES
                      }
                    />
                  </div>
                  <div className='col-md-6'>
                    <Button1
                      disabled={false}
                      text={_('Confirm')}
                      color={'orange'}
                      module={appConstants.ORDER_PICK}
                      action={
                        appConstants.REMOVE_ALL_BUTTON
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        title = _('All Entities removed');
        break;

    case appConstants.ERROR_NOTIFICATION:
      component = [];
      component.push(
        <div>
          <div className='row'>
            <div className='col-md-12'>
              <div className='title-textbox'>{modalData}</div>
            </div>
          </div>
          <div className='modal-footer removeBorder'>
            <div className='buttonContainer center-block chklstButtonContainer'>
              <div className='row removeBorder'>
                <div className='col-md-4 col-md-offset-4'>
                  <Button1
                    disabled={false}
                    text={_('OK')}
                    color={'orange'}
                    module={appConstants.ERROR_NOTIFICATION}
                    action={appConstants.HIDE_ERROR_NOTIFICATION}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      title = (
        <span>
          <span className='glyphicon glyphicon-exclamation-sign' />
          {_('Error')}
        </span>
      );
      break;
    default:
      component = null;
      title = null;
      return true;
  }
}

var Modal = React.createClass({
  virtualKeyBoard1: '',
  componentDidMount: function(id) {
    /*$(".modal").click(function(e){
      e.stopPropagation();
        return false;
    });*/
  },

  componentWillMount: function() {
    mainstore.addChangeListener(this.onChange);
  },
  componentWillUnmount: function() {
    mainstore.removeChangeListener(this.onChange);
  },
  onChange: function() {
    this.setState(getStateData(this));
  },
  render: function() {
    return (
      <div className='modal'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <ModalHeader title={title} />
            <div className='modal-body'>{component}</div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Modal;
