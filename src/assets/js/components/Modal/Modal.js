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

function attachDateTime(id, toggleTime) {
  if (toggleTime === 'true' || toggleTime === true) {
    $('#' + id)
      .datetimepicker({ timepicker: toggleTime })
      .datetimepicker('show');
  } else {
    $('#' + id)
      .datetimepicker({ timepicker: toggleTime, format: 'Y/m/d' })
      .datetimepicker('show');
  }
}

function removeTextField() {
  $('.modal-body')
    .find('input:text')
    .val('');
}

function loadComponent(modalType, modalData, ths) {
  switch (modalType) {
    case 'product-detail':
      component = [];
      for (var key in modalData) {
        if (modalData.hasOwnProperty(key)) {
          component.push(
            <div className='row'>
              <div className='col-md-6 key'>{key}</div>
              <div className='col-md-6 value'>{modalData[key]}</div>
            </div>
          );
        }
      }
      title = _('Product Information');
      break;

    case 'bin-info':
      component = [];
      var headerArray = [];
      for (var key in modalData[0]) {
        if (modalData[0].hasOwnProperty(key)) {
          keys = mainstore.getServerMessages();
          key = keys[key];
          //component.push((<div className="col-md-4 heading">{key} </div>));
          headerArray.push(<th>{_(key)}</th>);
        }
      }
      var tr = [];
      modalData.map(function(value, index) {
        var rowData = [];
        var serialNumbers = [];
        for (var key in value) {
          if (value.hasOwnProperty(key)) {
            if (value[key].constructor.name === 'Array') {
              value[key].map(function(val, id) {
                serialNumbers.push(<div>{val}</div>);
              });
            }
            rowData.push(
              <td>
                {value[key].constructor.name === 'Array'
                  ? serialNumbers
                  : value[key]}
              </td>
            );
          }
        }
        tr.push(<tr>{rowData}</tr>);
      });
      component.push(
        <div className='binInfoValue'>
          <table className='table'>
            <thead className='heading'>
              <tr>{headerArray}</tr>
            </thead>
            <tbody>{tr}</tbody>
          </table>
        </div>
      );
      title = _('Bin Info');

      break;

    case 'scan_bin_barcode':
      component = [];
      footer = [];
      component.push(
        <div>
          <div className='modalContent removeBorder'>
            <div className='image1'>
              <img src={allSvgConstants.iconBar} />
            </div>
            <div className='content1'>{_('Scan Bin Barcode')}</div>
            <div className='clearfix' />
          </div>
          <div className='modal-footer removeBorder'>
            <div className='buttonContainer center-block'>
              <Button1
                disabled={false}
                text={_('Cancel')}
                module={appConstants.PICK_BACK}
                action={appConstants.CANCEL_SCAN}
                barcode={modalData.tote_barcode}
                color={'black'}
              />
            </div>
          </div>
        </div>
      );

      title = _('Associate tote with bin');
      break;
    case 'message':
      component = [];
      component.push(
        <div className='col-md-12 value'>{modalData['message']} </div>
      );
      component.push(
        <div className='extraEntity'>
          <Button1
            disabled={false}
            text={_('Confirm')}
            module={appConstants.AUDIT}
            action={appConstants.CLOSE_MODAL}
            color={'orange'}
          />
        </div>
      );
      title = _('Extra Entity Found');
      break;
    case 'pick_checklist':
      component = [];
      footer = [];
      rowData = [];
      title = _('Input Extra Details');
      var modalData = modalData;
      var rowData = modalData.checklist_data.map(function(data, index) {
        serial = index;
        if (
          modalData.checklist_index === index + 1 ||
          (modalData.checklist_index === 'all' &&
            index < mainstore.scanDetails()['current_qty'])
        ) {
          var d = data.map(function(data1, index1) {
            var keyvalue = Object.keys(data1);
            var inputBoxValue = data1[keyvalue]['value'];
            if (
              modalData.checklist_data[index][index1][keyvalue[0]].Format ==
                'Integer' ||
              modalData.checklist_data[index][index1][keyvalue[0]].Format ==
                'Float'
            ) {
              var inputBox = (
                <input
                  className='center-block'
                  type='text'
                  id={'checklist_field' + index1 + '-' + index}
                  value={inputBoxValue}
                  onClick={attachKeyboard.bind(
                    this,
                    'checklist_field' + index1 + '-' + index
                  )}
                />
              );
            } else if (
              modalData.checklist_data[index][index1][keyvalue[0]].Format ==
              'String'
            ) {
              var inputBox = (
                <input
                  className='center-block'
                  type='text'
                  id={'checklist_field' + index1 + '-' + index}
                  value={inputBoxValue}
                  onClick={attachKeyboard.bind(
                    this,
                    'checklist_field' + index1 + '-' + index
                  )}
                />
              );
            } else {
              if (
                modalData.checklist_data[index][index1][keyvalue[0]].Format ==
                'Datetime'
              ) {
                var inputBox = (
                  <input
                    className='center-block'
                    type='text'
                    id={'checklist_field' + index1 + '-' + index}
                    value={inputBoxValue}
                    onClick={attachDateTime.bind(
                      this,
                      'checklist_field' + index1 + '-' + index,
                      true
                    )}
                  />
                );
              } else if (
                modalData.checklist_data[index][index1][keyvalue[0]].Format ==
                'Date'
              ) {
                var inputBox = (
                  <input
                    className='center-block'
                    type='text'
                    id={'checklist_field' + index1 + '-' + index}
                    value={inputBoxValue}
                    onClick={attachDateTime.bind(
                      this,
                      'checklist_field' + index1 + '-' + index,
                      false
                    )}
                  />
                );
              }
            }

            return (
              <div className='col-md-6'>
                <div className='dataCaptureHead removeBorder'>{keyvalue}</div>
                <div className='dataCaptureInput removeBorder'>{inputBox}</div>
              </div>
            );
          });
          return (
            <div className='row item-input'>
              <div className='col-md-12'>
                <div className='col-md-1 serial'>{serial + 1}.</div>
                <div className='col-md-11'>{d}</div>
              </div>
            </div>
          );
        } else {
        }
      });
      return component.push(
        <div>
          <header>{modalData.product_details.product_sku}</header>
          {rowData}
          <div className='modal-footer removeBorder'>
            <div className='buttonContainer center-block chklstButtonContainer'>
              <div className='row removeBorder'>
                <div className='col-md-6'>
                  <Button1
                    disabled={false}
                    text={_('Clear All')}
                    color={'black'}
                    module={appConstants.PICK_FRONT}
                    action={appConstants.CHECKLIST_CLEARALL}
                  />
                </div>
                <div className='col-md-6'>
                  <Button1
                    disabled={false}
                    text={_('Submit')}
                    color={'orange'}
                    buttonChecklist={'checklist'}
                    checkListData={modalData}
                    module={appConstants.PICK_FRONT}
                    action={appConstants.CHECKLIST_SUBMIT}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );

      break;
    case appConstants.BOX_FULL:
      component = [];
      component.push(
        <div>
          <div className='row'>
            <p>
              {_('Last item scan will be cancelled. Do you want to continue?')}
            </p>
          </div>
          <div className='modal-footer removeBorder'>
            <div className='buttonContainer center-block chklstButtonContainer'>
              <div className='row removeBorder'>
                <div className='col-md-6'>
                  <Button1
                    disabled={false}
                    text={_('Cancel')}
                    color={'black'}
                    module={appConstants.PICK_FRONT}
                    action={appConstants.CANCEL_BOX_FULL}
                  />
                </div>
                <div className='col-md-6'>
                  <Button1
                    disabled={false}
                    text={_('Continue')}
                    color={'orange'}
                    module={appConstants.PICK_FRONT}
                    action={appConstants.CONFIRM_BOX_FULL}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      title = _('Box Full');
      break;
    case appConstants.BIN_FULL:
      component = [];
      component.push(
        <div>
          <div className='rowMiddle'>
            <p>{_('Enter items that can fit in the bin')}</p>
          </div>
          <div className='modal-footer removeBorder fixedWidth'>
            <div className='buttonContainer50 center-block fixedHeight'>
              {!ths.props.cancelClicked && (
                <NumericIndicator
                  Formattingclass={'widerComponent'}
                  execType={appConstants.DEFAULT}
                  scanDetails={mainstore.getScanDetails()}
                />
              )}
              <div className='removeBorder fixedBottom'>
                <div className='col-md-6'>
                  <Button1
                    disabled={false}
                    text={_('Cancel')}
                    color={'black'}
                    module={appConstants.PICK_FRONT}
                    action={appConstants.CANCEL_BIN_FULL_REQUEST}
                  />
                </div>
                <div className='col-md-6'>
                  <Button1
                    disabled={false}
                    text={_('Continue')}
                    color={'orange'}
                    module={appConstants.PICK_FRONT}
                    action={appConstants.CONFIRM_BIN_FULL_REQUEST}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      title = _('Bin Full');
      break;
    case appConstants.REPRINT_REQUEST:
      component = [];
      component.push(
        <div>
          <div className='row'>
            <p>{_('Choose how many labels to reprint?')}</p>
          </div>
          <div className='modal-footer removeBorder'>
            <div className='buttonContainer center-block chklstButtonContainer'>
              <div className='row removeBorder'>
                <div className='col-md-4'>
                  <Button1
                    disabled={false}
                    text={_('Cancel')}
                    color={'black'}
                    module={appConstants.PICK_FRONT}
                    action={appConstants.CANCEL_REPRINT_REQUEST}
                  />
                </div>
                <div className='col-md-4'>
                  <Button1
                    disabled={false}
                    text={_('Reprint all')}
                    color={'orange'}
                    module={appConstants.PICK_FRONT}
                    action={appConstants.CONFIRM_REPRINT_ALL_REQUEST}
                  />
                </div>
                <div className='col-md-4'>
                  <Button1
                    disabled={false}
                    text={_('Reprint last')}
                    color={'orange'}
                    module={appConstants.PICK_FRONT}
                    action={appConstants.CONFIRM_REPRINT_LAST_REQUEST}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      title = _('Reprint Label');
      break;
    case appConstants.DISCARD_PACKING_BOX:
      component = [];
      component.push(
        <div>
          <div className='row'>
            <p>
              {_(
                'All item scan will be cancelled. Do you want to discard packing box?'
              )}
            </p>
          </div>
          <div className='modal-footer removeBorder'>
            <div className='buttonContainer center-block chklstButtonContainer'>
              <div className='row removeBorder'>
                <div className='col-md-6'>
                  <Button1
                    disabled={false}
                    text={_('Cancel')}
                    color={'black'}
                    module={appConstants.PICK_FRONT}
                    action={appConstants.CANCEL_BOX_FULL}
                  />
                </div>
                <div className='col-md-6'>
                  <Button1
                    disabled={false}
                    text={_('Continue')}
                    color={'orange'}
                    module={appConstants.PICK_FRONT}
                    action={appConstants.CONFIRM_BOX_FULL}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      title = _('Discard Box');
      break;
    case appConstants.EXIT_INVOICE:
      var invoiceStringArg = [];
      invoiceStringArg[0] = mainstore.getInvoiceStatus()
        ? mainstore.getInvoiceStatus().invoiceId
        : '';
      invoiceStringArg[1] = mainstore.getInvoiceType()
        ? mainstore.getInvoiceType()
        : '';
      component = [];
      component.push(
        <div>
          <div className='row'>
            <p>{utils.frntStringTransform('FRNT.PBIM.01', invoiceStringArg)}</p>
          </div>
          <div className='modal-footer removeBorder'>
            <div className='buttonContainer center-block chklstButtonContainer'>
              <div className='row removeBorder'>
                <div className='col-md-6'>
                  <Button1
                    disabled={false}
                    text={_('Exit')}
                    color={'black'}
                    module={appConstants.PUT_BACK}
                    action={appConstants.CONFIRM_EXIT_INVOICE}
                  />
                </div>
                <div className='col-md-6'>
                  <Button1
                    disabled={false}
                    text={_('Cancel')}
                    color={'orange'}
                    module={appConstants.PUT_BACK}
                    action={appConstants.DECLINE_CANCEL_INVOICE}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      title = _('Exit invoice and stage all bins');
      break;

    case 'enter_barcode':
      component = [];
      component.push(
        <div>
          <div className='row'>
            <div className='col-md-12'>
              <div className='title-textbox'>{_('Enter Scanner Id')}</div>
              <div className='textBox-div'>
                <input
                  className='width95'
                  type='text'
                  id='add_scanner'
                  onClick={attachKeyboard.bind(this, 'add_scanner')}
                />
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
                    module={appConstants.PERIPHERAL_MANAGEMENT}
                    action={appConstants.CANCEL_CLOSE_SCANNER}
                  />
                </div>
                <div className='col-md-6'>
                  <Button1
                    disabled={false}
                    text={_('Submit')}
                    color={'orange'}
                    module={appConstants.PERIPHERAL_MANAGEMENT}
                    action={appConstants.ADD_SCANNER_DETAILS}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );

      title = _('Add Scanner');
      break;
    case 'cancel_exception':
      component = [];
      component.push(
        <div>
          <div className='row'>
            <div className='col-md-12'>
              <div className='title-textbox'>
                {_('Are you sure you want to cancel the exception?')}
              </div>
            </div>
          </div>
          <div className='modal-footer removeBorder'>
            <div className='buttonContainer center-block chklstButtonContainer'>
              <div className='row removeBorder'>
                <div className='col-md-6'>
                  <Button1
                    disabled={false}
                    text={_('Yes')}
                    color={'orange'}
                    module={modalData}
                    action={appConstants.CANCEL_EXCEPTION_TO_SERVER}
                  />
                </div>
                <div className='col-md-6'>
                  <Button1
                    disabled={false}
                    text={_('No')}
                    color={'black'}
                    module={modalData}
                    action={appConstants.CLOSE_CANCEL_EXCEPTION}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      title = _('Cancel Exception');
      break;

    case appConstants.NEW_CARRYING_UNIT:
      component = [];
      component.push(
        <div>
          <div className='row'>
            <div className='col-md-12'>
              <div className='title-textbox'>
                {_('Are you sure you want to request a new carrying unit?')}
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
                    module={modalData}
                    action={appConstants.CANCEL_TOTE_SEND_TO_SERVER_MODAL}
                  />
                </div>
                <div className='col-md-6'>
                  <Button1
                    disabled={false}
                    text={_('Confirm')}
                    color={'orange'}
                    module={modalData}
                    action={appConstants.CONFIRM_TOTE_SEND_TO_SERVER_MODAL}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      title = _('New carrying unit');
      break;
    
      // BSS-14025 confirm logout for pick ara flow
      case appConstants.CONFIRM_LOGOUT:
      component = [];
      component.push(
        <div>
          <div className='row'>
            <p>{_('Are you sure you would like to logout?')}</p>
          </div>
          <div className='modal-footer removeBorder'>
            <div className='buttonContainer center-block chklstButtonContainer'>
              <div className='row removeBorder'>
                <div className='col-md-6'>
                  <Button1
                    disabled={false}
                    text={_('Cancel')}
                    color={'black'}
                    module={appConstants.PICK_FRONT}
                    action={appConstants.CANCEL_LOGOUT_REQUEST}
                  />
                </div>
                <div className='col-md-6'>
                  <Button1
                    disabled={false}
                    text={_('Confirm')}
                    color={'orange'}
                    module={appConstants.PICK_FRONT}
                    action={appConstants.CONFIRM_LOGOUT_REQUEST}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      title = _('Confirm Logout');
      break;

    
    case appConstants.SKIP_DOCKING:
      component = [];
      component.push(
        <div>
          <div className='row'>
            <div className='col-md-12'>
              <div className='title-textbox'>
                {_(
                  'Are you sure you would like to proceed without docking bins?'
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
                    module={modalData}
                    action={
                      appConstants.CANCEL_SKIP_DOCKING_SEND_TO_SERVER_MODAL
                    }
                  />
                </div>
                <div className='col-md-6'>
                  <Button1
                    disabled={false}
                    text={_('Confirm')}
                    color={'orange'}
                    module={modalData}
                    action={
                      appConstants.CONFIRM_SKIP_DOCKING_SEND_TO_SERVER_MODAL
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      title = _('Skip docking');
      break;

      case appConstants.REMOVE_ALL_BUTTON_WITHOUT_TOTE:
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
                      module={appConstants.PICK_FRONT}
                      action={
                        appConstants.CANCEL_BOX_FULL
                      }
                    />
                  </div>
                  <div className='col-md-6'>
                    <Button1
                      disabled={false}
                      text={_('Confirm')}
                      color={'orange'}
                      module={appConstants.PICK_FRONT}
                      action={
                        appConstants.CONFIRM_BOX_FULL
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

    case appConstants.CANCEL_SCAN_ALL:
      component = [];
      component.push(
        <div>
          <div className='row'>
            <div className='col-md-12'>
              <div className='title-textbox'>
                {_('All scan and print will be cancelled. Confirm to cancel?')}
              </div>
            </div>
          </div>
          <div className='modal-footer removeBorder'>
            <div className='buttonContainer center-block chklstButtonContainer'>
              <div className='row removeBorder'>
                <div className='col-md-6'>
                  <Button1
                    disabled={false}
                    text={_('Confirm')}
                    color={'orange'}
                    module={modalData}
                    action={appConstants.CANCEL_SCAN_SEND_TO_SERVER_MODAL}
                  />
                </div>
                <div className='col-md-6'>
                  <Button1
                    disabled={false}
                    text={_('Cancel')}
                    color={'black'}
                    module={modalData}
                    action={appConstants.CLOSE_CANCEL_SCAN}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      title = _('Cancel Scan');
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
