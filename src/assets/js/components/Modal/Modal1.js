var React = require('react');
var mainstore = require('../../stores/mainstore');
var ModalHeader = require('./ModalHeader');
var PickFrontStore = require('../../stores/PickFrontStore');
var ModalFooter = require('./ModalFooter');
var Button1 = require("../Button/Button");
var appConstants = require('../../constants/appConstants');
var allSvgConstants = require('../../constants/svgConstants');
var bootstrap = require('bootstrap');
var jqueryPosition = require('jquery-ui/position');
var virtualkeyboard = require('virtual-keyboard');

var component,title;

function getStateData(){
  var modalType = mainstore.getModalType();
  var modalData = mainstore.getModalContent();
  loadComponent(modalType,modalData);
  return {
      data:modalData,
      type:modalType
    };
}

function attachKeyboard(id){   
    virtualKeyBoard1 = $('#'+id).keyboard({
            layout: 'custom',
            customLayout: {
              'default': ['! @ # $ % ^ & * + _', '1 2 3 4 5 6 7 8 9 0 {b}', 'q w e r t y u i o p', 'a s d f g h j k l', '{shift} z x c v b n m . {shift}', '{a} {c}'],
              'shift':   ['( ) { } [ ] = ~ ` -', '< > | ? / " : ; , \' {b}', 'Q W E R T Y U I O P', 'A S D F G H J K L', '{shift} Z X C V B N M . {shift}', '{a} {c}']
            },
            css: {
              container: "ui-widget-content ui-widget ui-corner-all ui-helper-clearfix custom-keypad"
            },
            reposition: true,
            alwaysOpen: false,
            initialFocus: true,          
            visible : function(e, keypressed, el){
              el.value = '';          
                           
            },
            accepted: function(e, keypressed, el) {

            }
        });
   $('#'+id).data('keyboard').reveal();
}

function attachNumpad(id){
     virtualKeyBoard1 = $('#'+id).keyboard({
            layout: 'custom',
            customLayout: { 'default'  : ['1 2 3', '4 5 6', '7 8 9', '. 0 {b}', '{a} {c}'] },
            reposition   : true,
            alwaysOpen   : false,
            initialFocus : true,          
            accepted: function(e, keypressed, el) {
            },
            visible : function(e, keypressed, el){
              el.value = '';             
            }
      });
   $('#'+id).data('keyboard').reveal();
}

function attachDateTime(id, toggleTime){  
  if(toggleTime === "true" || toggleTime === true){
      $('#'+id).datetimepicker({timepicker:toggleTime}).datetimepicker("show");
  }
  else{
      $('#'+id).datetimepicker({timepicker:toggleTime,format:'Y/m/d'}).datetimepicker("show");
  }   
}

function removeTextField(){
  $('.modal-body').find('input:text').val('');
}

function loadComponent(modalType,modalData){ 
  switch(modalType){
    case "product-detail":
      component = [];
      for (var key in modalData) {
        if (modalData.hasOwnProperty(key)) {          
           component.push((<div className="row"><div className="col-md-6 key">{key}</div><div className="col-md-6 value">{modalData[key]}</div></div>));
        }
      }
      title = _("Product Information");
      break;

    case "bin-info":
      component = [];
      var headerArray = [];
      for (var key in modalData[0]) {
        if (modalData[0].hasOwnProperty(key)) {
           //component.push((<div className="col-md-4 heading">{key} </div>));
           headerArray.push(              
              <th>{_(key)}</th>              
          );
        }
      } 
      var tr = [];    
      modalData.map(function(value,index){
        var rowData = [];
           for (var key in value) {        
            if (value.hasOwnProperty(key)) {
              rowData.push(
                <td>{value[key]}</td>
              )
            }                    
          }
          tr.push(<tr>{rowData}</tr>);
          
      })
       component.push(
              <div className="binInfoValue">
                  <table className="table">  
                    <thead className="heading">
                    <tr>{headerArray}</tr>
                    </thead>               
                    <tbody>{tr}</tbody>
                 </table>
              </div>
          );
      title = _("Bin Info");
      
      break;
      
    case "scan_bin_barcode":
      component = [];
      footer = [];
      component.push((<div>
        <div className="modalContent removeBorder">
            <div className="image1">
                <img src={allSvgConstants.iconBar} />
            </div>
            <div className="content1">{_("Scan Bin Barcode")}</div>
            <div className="clearfix"></div>
        </div>    
            <div className="modal-footer removeBorder">
             <div className="buttonContainer center-block">
                <Button1 disabled = {false} text = {_("Cancel")} module ={appConstants.PICK_BACK} action={appConstants.CANCEL_SCAN} barcode={modalData.tote_barcode} color={"black"}/></div>
             </div>
       </div>
       ));      
      
      title = _("Associate tote with bin");
      break;
    case "message":
      component = [];
      component.push((<div className="col-md-12 value">{modalData["message"]} </div>));
      title = _("Extra Entity Found");
    break;
    case "pick_checklist":
      component = [];
      footer = [];
      rowData =[];
      title = _("Input Extra Details");
        var modalData = modalData;
        var rowData = modalData.checklist_data.map(function(data,index){
            serial = index;
            if((modalData.checklist_index === (index+1)  ) || (modalData.checklist_index === "all" && index < mainstore.scanDetails()["current_qty"])){
              var d = data.map(function(data1,index1){
                    var keyvalue = Object.keys(data1);
                    var inputBoxValue = data1[keyvalue]["value"];
                    if(modalData.checklist_data[index][index1][keyvalue[0]].Format == "Integer" || modalData.checklist_data[index][index1][keyvalue[0]].Format == "Float")
                    {                              
                      var inputBox = (<input className="center-block" type="text" id={"checklist_field"+index1+ "-" + index} value={inputBoxValue} onClick={attachKeyboard.bind(this, 'checklist_field'+index1+ "-" + index)} />)
                      
                    }
                    else if(modalData.checklist_data[index][index1][keyvalue[0]].Format == "String")
                    {                      
                      var inputBox = (<input className="center-block" type="text" id={"checklist_field"+index1+ "-" + index} value={inputBoxValue} onClick={attachKeyboard.bind(this, 'checklist_field'+index1+ "-" + index)} />)
                       
                    }
                     else{
                          if(modalData.checklist_data[index][index1][keyvalue[0]].Format == "Datetime")
                          {                      
                            var inputBox = (<input className="center-block" type="text" id={"checklist_field"+index1+ "-" + index} value={inputBoxValue} onClick={attachDateTime.bind(this, 'checklist_field'+index1+ "-" + index, true)} />)                            
                          }
                          else if(modalData.checklist_data[index][index1][keyvalue[0]].Format == "Date")
                          {                       
                            var inputBox = (<input className="center-block" type="text" id={"checklist_field"+index1+ "-" + index} value={inputBoxValue} onClick={attachDateTime.bind(this, 'checklist_field'+index1+ "-" + index, false)} />)
                          }
                    }                


                      return (<div className="col-md-6">
                                  <div className="dataCaptureHead removeBorder">
                                      {keyvalue}
                                  </div>
                                  <div className="dataCaptureInput removeBorder">
                                      {inputBox}
                                  </div>
                              </div>
                        );
                  })
              return (
                  <div className ="row item-input">
                    <div className="col-md-12">
                        <div className="col-md-1 serial">
                            {serial+1}.
                        </div>
                        <div className="col-md-11">
                            {d}
                        </div>
                    </div>
                  </div>
                );
                  
            }
            else{}
          });
      return (
              component.push((
                <div>
                <header>{modalData.product_details.product_sku}</header>
                  {rowData}
                      <div className="modal-footer removeBorder">
                          <div className="buttonContainer center-block chklstButtonContainer">
                                <div className="row removeBorder">
                                    <div className="col-md-6"><Button1 disabled = {false} text ={_("Clear All")} color={"black"} module ={appConstants.PICK_FRONT} action={appConstants.CHECKLIST_CLEARALL}/></div>
                                    <div className="col-md-6"><Button1 disabled = {false} text ={_("Submit")} color={"orange"} buttonChecklist={"checklist"} checkListData={modalData} module ={appConstants.PICK_FRONT} action={appConstants.CHECKLIST_SUBMIT}/></div>
                                </div>
                          </div>
                     </div>
                </div>
               ))   
               );  
     
      
      break;
    case "enter_barcode":
        component = [];
        component.push((
          <div>
            <div className="row">
              <div className="col-md-12">
                <div className="title-textbox">Enter Scanner Id</div>
                <div className="textBox-div">
                  <input className="width95" type="text" id='add_scanner' onClick={attachKeyboard.bind(this, 'add_scanner')}/>
                </div>
              </div>
            </div>
            <div className="modal-footer removeBorder">
              <div className="buttonContainer center-block chklstButtonContainer">
                <div className="row removeBorder">
                  <div className="col-md-6"><Button1 disabled = {false} text ={_("Cancel")} color={"black"} module ={appConstants.PERIPHERAL_MANAGEMENT} action={appConstants.CANCEL_ADD_SCANNER}/></div>
                  <div className="col-md-6"><Button1 disabled = {false} text ={_("Submit")} color={"orange"} module ={appConstants.PERIPHERAL_MANAGEMENT} action={appConstants.ADD_SCANNER_DETAILS}/></div>
                </div>
              </div>
            </div>
          </div>
          ));
         
      title = _("Add Scanner");
      break;
    case "cancel_exception":
        component = [];
        component.push((
          <div>
            <div className="row">
              <div className="col-md-12">
                <div className="title-textbox">{_("Are you sure you want to cancel the exception?")}</div>
              </div>
            </div>
            <div className="modal-footer removeBorder">
              <div className="buttonContainer center-block chklstButtonContainer">
                <div className="row removeBorder">
                  <div className="col-md-6"><Button1 disabled = {false} text ={_("Yes")} color={"orange"} module ={appConstants.PRE_PUT} action={appConstants.CANCEL_EXCEPTION_TO_SERVER}/></div>
                  <div className="col-md-6"><Button1 disabled = {false} text ={_("No")} color={"black"} module ={appConstants.PRE_PUT} action={appConstants.CLOSE_CANCEL_EXCEPTION}/></div>
                </div>
              </div>
            </div>
          </div>
          ));
      title = _("Cancel Exception");    
      break;

    default:
      component = null;
      title = null;
      return true;
  }
}

var Modal = React.createClass({
  virtualKeyBoard1 : '',
  componentDidMount:function(id){
    /*$(".modal").click(function(e){
      e.stopPropagation();
        return false;
    });*/      
  },
 
  componentWillMount: function(){
    mainstore.addChangeListener(this.onChange);
  },
  componentWillUnmount: function(){
    mainstore.removeChangeListener(this.onChange);
  },
  onChange: function(){
    this.setState(getStateData());
  },
  render: function () {      
    return (<div className="modal1 fade">
        <div className="modal-dialog">
          <div className="modal-content">
            <ModalHeader title={title}/>
             <div className="modal-body">
              {component}
            </div>

          </div>
        </div>
      </div>)
  }
});

module.exports = Modal;