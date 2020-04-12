var React = require('react');
var mainstore = require('../stores/mainstore');
var PickFront = require('./PickFront');
var appConstants = require('../constants/appConstants');
var Spinner = require('./Spinner/Overlay');
var SystemIdle = require('./SystemIdle');
var MobileSystemIdle = require('./MobileSystemIdle');
var MtuSubsystem = require('./MtuSubsystem');

function getState(){
  console.log("=======> operator.js -> getState()");
  return {
      currentSeat: mainstore.getCurrentSeat(),
      isMobile:mainstore._getMobileFlag(),
      spinner : mainstore.getSpinnerState(),
      systemIsIdle : mainstore.getSystemIdleState(),
      navMessages : mainstore.getServerMessages()
  }
}
var Operator = React.createClass({
  _spinner : null,
  _currentSeat:'',
  getInitialState: function(){
    return getState();
  },
  componentDidMount: function(){
    mainstore.addChangeListener(this.onChange);
  },
  componentWillMount: function(){
     mainstore.addChangeListener(this.onChange);
  },
  componentWillUnmount: function(){
    mainstore.removeChangeListener(this.onChange);
  },
  onChange: function(){ 
   this.setState(getState());
  },
  getSeatType:function(seat){
  console.log("....seat" + seat);
  console.log("=======> operator.js -> getSeatType ()");
     //switch(seat){
      //case appConstants.PICK_FRONT:
          this._currentSeat = <PickFront navMessagesJson={this.state.navMessages}/>;
       // break;
      //case appConstants.MTU_SUBSYSTEM:
            //this._currentSeat = <MtuSubsystem navMessagesJson={this.state.navMessages}/>;   
        //    break;            
      //default:
        //return true; 
      //}
  },

  render: function(data){ 
    console.log("=======> operator.js -> render ()");
     if(this.state.currentSeat){
       this.getSeatType(this.state.currentSeat);
       return (
        <div>
          {this._currentSeat}
        </div> 

      )
     }
     else{
      return (
        <div>
          <Spinner />
        </div> 

      )
     }
     
      // if(this.state.spinner === true){
      //  this._spinner = <Spinner />
      // }else{
      //   this._spinner ='';
      // }
      //  if(this.state.systemIsIdle === true){
      //     return (
      //       <div className="main">
      //         {this.state.isMobile?<MobileSystemIdle/>:<SystemIdle />}
      //       </div> 
      //     )
      //   }else{
      //     return (
      //       <div>
      //         {this._spinner}
      //         {this._currentSeat}
      //       </div> 

      //     )
      //  }
      
     
  }
});

module.exports = Operator;