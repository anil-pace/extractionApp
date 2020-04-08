
var React = require('react');
var mainstore = require('../stores/mainstore');
var Header = require('./Header');
var Navigation = require("./Navigation/Navigation.react");
var Notification = require("./Notification/Notification");
var Bins = require("./Bins/Bins.react");
var BinsFlex = require("./Bins/BinsFlexArrange.react");
var Button = require("./Button/Button");
var appConstants = require('../constants/appConstants');
var Modal = require('./Modal/Modal');
var Exception = require('./Exception/Exception');
var ExceptionHeader = require('./ExceptionHeader');
var Reconcile = require("./Reconcile");
var MtuNavigation = require("./mtuNavigation")
var TabularData = require('./TabularData');

function getStateData(){
    return mainstore.getScreenData();

}
var PrePut = React.createClass({
  _component:'',
  _notification:'',
  _exception:'',
  _navigation:'',
  getInitialState: function(){
    return getStateData();
  },
  componentWillMount: function(){
    mainstore.addChangeListener(this.onChange);
  },
  componentWillUnmount: function(){
    mainstore.removeChangeListener(this.onChange);
  },
  onChange: function(){ 
     if(this.refs.prePut){
      this.setState(getStateData());
    }
  },
  getExceptionComponent:function(){
      var _rightComponent = '';
      this._navigation = '';
      return (
              <div className='grid-container exception'>
                <Modal />
                <Exception data={this.state.PrePutExceptionData} action={true}/>
                <div className="exception-right"></div>
                <div className = 'cancel-scan'>
                   <Button disabled = {false} text = {_("Cancel Exception")} module ={appConstants.PRE_PUT} action={appConstants.CANCEL_EXCEPTION_MODAL}  color={"black"}/>
                </div>
              </div>
            );
  },
  getScreenComponent : function(screen_id){
    switch(screen_id){
      case appConstants.ITEM_SEARCH:
      this._navigation = '';
      this._component=(
          <div>
          <div className="outerWrapperItemSearch">
              <div className="subHeaderItemDetails">{_("Item details")}</div>
              <div className="innerWrapperItemSearch">
              <div className="textBoxContainer">
               <span className="barcode"></span>
               <TextEditor callAPItoGetData={this.callAPItoGetData.bind(this)}/>
              </div>
              </div>
          </div>
          <div className="itemSearchfooter">
          <Button1 disabled={false} text={_("Close")} module ={appConstants.SEARCH_MANAGEMENT} status={true} action={appConstants.BACK}color={"black"}/>
          </div> 
          </div>
      )
      break;
      case appConstants.ITEM_SEARCH_RESULT:
      this._navigation = '';
      this._component=(
          <div>
          <div className="outerWrapperItemSearch">
              <div className="subHeaderItemDetails">{_("Item details")}</div>
              <div className="innerWrapperItemResult">
              {this.state.loaderState?<div className="spinnerDiv"><Spinner /></div>:<ItemTable data={this.state.ItemSearchData} rowconfig={this.state.rowconfig}/>}
              </div>
          </div>
          <div className="itemSearchfooter">
          <Button1 disabled={false} text={_("Close")} module ={appConstants.SEARCH_MANAGEMENT} status={true} action={appConstants.BACK}color={"black"}/>
          </div> 
            </div>   
      )
      break;


      case appConstants.PRE_PUT_STAGE:
         if(this.state.PrePutExceptionStatus == false){
          this._navigation = (<Navigation navData ={this.state.PrePutNavData} serverNavData={this.state.PrePutServerNavData} navMessagesJson={this.props.navMessagesJson}/>);
          var binComponent ="";
          if (this.state.OrigBinUse){
            binComponent =(  <BinsFlex binsData={this.state.PrePutBinData} screenId = {this.state.PrePutScreenId} seatType = {this.state.SeatType}/>);
          }else{
              binComponent = ( <div className='main-container'>
                    <Bins binsData={this.state.PrePutBinData} screenId = {this.state.PrePutScreenId} />
                </div>);
          }    
          this._component = (
              <div className='grid-container'>
               <MtuNavigation data={this.state.MtuDetails}/>
                <Modal />
               {binComponent}
                <div className = 'staging-action' >
                  <Button disabled = {!this.state.ReleaseActive} text = {_("Release MTU")} module ={appConstants.PRE_PUT} action={appConstants.RELEASE_MTU} color={"orange"}/>
                </div>
              </div>
            );
          }else{
          this._component = this.getExceptionComponent();
        }

        break;
      case appConstants.PRE_PUT_SCAN:
          if(this.state.PrePutExceptionStatus == false){
          var binComponent = "";
          if (this.state.OrigBinUse){
            binComponent =(  <BinsFlex binsData={this.state.PrePutBinData} screenId = {this.state.PrePutScreenId} seatType = {this.state.SeatType}/>);
          }else{
              binComponent = ( <div className='main-container'>
                    <Bins binsData={this.state.PrePutBinData} screenId = {this.state.PrePutScreenId} />
                </div>);
          }    
          this._navigation = (<Navigation navData ={this.state.PrePutNavData} serverNavData={this.state.PrePutServerNavData} navMessagesJson={this.props.navMessagesJson}/>);
          this._component = (
              <div className='grid-container'>
                <MtuNavigation data={this.state.MtuDetails}/>
                <Modal />
                {binComponent}
                <div className = 'staging-action' >
                  <Button disabled = {!this.state.ReleaseActive} text = {_("Release MTU")} module ={appConstants.PRE_PUT} action={appConstants.RELEASE_MTU} color={"orange"}/>
                </div>                
                <div className = 'cancel-scan'>
                   <Button disabled = {false} text = {_("Cancel Scan")} module ={appConstants.PRE_PUT} action={appConstants.CANCEL_SCAN} barcode={this.state.PrePutToteid} color={"black"}/>
                </div>
              </div>
            );
        }else{
          this._component = this.getExceptionComponent();
        }
        break;
      case appConstants.PRE_PUT_RELEASE:
          if(this.state.PrePutExceptionStatus == false){
          var binComponent = "";
          if (this.state.OrigBinUse){
            binComponent =(  <BinsFlex binsData={this.state.PrePutBinData} screenId = {this.state.PrePutScreenId} seatType = {this.state.SeatType}/>)
          }else{
              binComponent = ( <div className='main-container'>
                    <Bins binsData={this.state.PrePutBinData} screenId = {this.state.PrePutScreenId} />
                </div>)
          }    
          this._navigation = (<Navigation navData ={this.state.PrePutNavData} serverNavData={this.state.PrePutServerNavData} navMessagesJson={this.props.navMessagesJson}/>);
          this._component = (
              <div className='grid-container'>
                <MtuNavigation data={this.state.MtuDetails}/>            
                <Modal />
                {binComponent}
                <div className = 'staging-action' >
                  <Button disabled = {false} text = {_("Release MTU")} module ={appConstants.PRE_PUT} action={appConstants.RELEASE_MTU} color={"orange"}/>
                </div>                
              </div>
            );
        }else{
          this._component = this.getExceptionComponent();
        }
        break; 
      case appConstants.PRE_PUT_EXCEPTION_EXCESS_TOTE:
          this._component = (
              <div className='grid-container exception'>
                <Modal /> 
                <Exception data={this.state.PrePutExceptionData}/>
                <div className="exception-right">
                  <div className="main-container exception2">
                    <div className = "kq-exception">
                      <div className="kq-header">{_("Please scan tote which has excess item")}</div>
                    </div>
                  </div>
                </div>
                 <div className = 'cancel-scan'>
                   <Button disabled = {false} text = {_("Cancel Exception")} module ={appConstants.PRE_PUT} action={appConstants.CANCEL_EXCEPTION_MODAL} color={"black"}/>
                </div>
              </div>
          );      
        break; 
      case appConstants.PRE_PUT_EXCEPTION_EXCESS_ITEMS:
          var _button;
          _button = (<div className = "staging-action">                          
                          <Button disabled = {this.state.PrePutExceptionFlag} text = {_("Confirm")} module ={appConstants.PRE_PUT} action={appConstants.SEND_EXCESS_ITEMS_BIN} color={"orange"} />
                    </div>);
          this._component = (
              <div className='grid-container exception'>
                <Modal /> 
                <Exception data={this.state.PrePutExceptionData}/>
                <div className="exception-right">
                  <div className="main-container">
                    <div className = "kq-exception">
                      <div className="kq-header">{_("Scan excess item quantity")}</div>
                      <TabularData data={this.state.PrePutExcessItems}  className='limit-height width-extra ' />
                      {_button}
                    </div>
                  </div>
                </div>
                 <div className = 'cancel-scan'>
                   <Button disabled = {false} text = {_("Cancel Exception")} module ={appConstants.PRE_PUT} action={appConstants.CANCEL_EXCEPTION_MODAL} color={"black"}/>
                </div>
              </div>
          );      
        break; 
      case appConstants.PPTL_MANAGEMENT:
      case appConstants.SCANNER_MANAGEMENT:
          console.log(this.state.PrePutNavData,this.state.PrePutServerNavData);
          this._navigation = (<Navigation navData ={this.state.PrePutNavData} serverNavData={this.state.PrePutServerNavData} navMessagesJson={this.props.navMessagesJson}/>)
          var _button;
          if(this.state.PrePutScreenId == appConstants.SCANNER_MANAGEMENT){
          _button = (<div className = 'staging-action' >                          
                          <Button disabled = {false} text = {_("BACK")} module ={appConstants.PERIPHERAL_MANAGEMENT} status={true} action={appConstants.CANCEL_ADD_SCANNER} color={"black"} />
                          <Button disabled = {false} text = {_("Add Scanner")} module ={appConstants.PERIPHERAL_MANAGEMENT} status={true} action={appConstants.ADD_SCANNER} color={"orange"} />
                      </div>)
          }
          else{
            _button = (<div className = 'staging-action' ><Button disabled = {false} text = {_("BACK")} module ={appConstants.PERIPHERAL_MANAGEMENT} status={true} action={appConstants.CANCEL_PPTL} color={"black"} /></div>)
          }
          this._component = (
              <div className='grid-container audit-reconcilation'>
                  <div className="row scannerHeader">
                    <div className="col-md-6">
                      <div className="ppsMode"> PPS Mode : {this.state.PrePutPpsMode.toUpperCase()} </div>
                    </div>
                    <div className="col-md-6">
                      <div className="seatType"> Seat Type : {this.state.PrePutSeatType.toUpperCase()}</div>
                    </div>
                  </div>
                  <TabularData data = {this.state.utility}/>
                  {_button}
                  <Modal /> 
              </div>
            );
        break;              
      default:
        return true; 
    }
  },

  getNotificationComponent:function(){
    if(this.state.PrePutNotification != undefined){
      this._notification = <Notification notification={this.state.PrePutNotification} navMessagesJson={this.props.navMessagesJson}/>
    }
    else{
        if($(".modal.notification-error").is(":visible")){
            setTimeout((function(){
                $('.modal.notification-error').data('bs.modal').options.backdrop=true
                $(".modal-backdrop").remove()
                $(".modal.notification-error").modal("hide");
                $(".modal").removeClass("notification-error")

            }),0)

            return null
        }
        else if($(".modal.in").is(":visible")){
          setTimeout((function(){
              if($('.modal.in').find("div").hasClass("modal-footer")){
                  //check when errorcode is true and modal has buttons
                  $('.modal.in').data('bs.modal').options.backdrop='static';
              }
              else{
                  //check when errorcode is true and modal has NO buttons
                  $('.modal.in').data('bs.modal').options.backdrop=true;
              }
          }),0)
          return null
        }
        this._notification = "";
    }
  },
  render: function(data){ 
    this.getNotificationComponent();
    this.getScreenComponent(this.state.PrePutScreenId);
      return (
        <div ref="prePut" className="main">
          <Header />
          {this._navigation}
          {this._component}
          {this._notification}
        </div> 
       
      )
  }
});

module.exports = PrePut;