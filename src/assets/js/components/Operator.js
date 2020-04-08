var React = require('react');
var mainstore = require('../stores/mainstore');
var PutBack = require('./PutBack');
var PutFront = require('./PutFront');
var PickBack = require('./PickBack');
var PickFront = require('./PickFront');
var Search = require('./Search');
var Audit = require('./Audit');
var PrePut = require('./PrePut');
var appConstants = require('../constants/appConstants');
var Spinner = require('./Spinner/Overlay');
var SystemIdle = require('./SystemIdle');
var MobileSystemIdle = require('./MobileSystemIdle');


function getState(){
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
     switch(seat){
      case appConstants.PUT_BACK:
          this._currentSeat = <PutBack navMessagesJson={this.state.navMessages}/>;
        break;
      case appConstants.PUT_FRONT:
          this._currentSeat = <PutFront navMessagesJson={this.state.navMessages}/>;
        break;
      case appConstants.PICK_BACK:
          this._currentSeat = <PickBack navMessagesJson={this.state.navMessages}/>;
        break;
      case appConstants.PICK_FRONT:
          this._currentSeat = <PickFront navMessagesJson={this.state.navMessages}/>;
        break;
      case appConstants.AUDIT:
          this._currentSeat = <Audit navMessagesJson={this.state.navMessages}/>;
        break;
      case appConstants.PRE_PUT:
          this._currentSeat = <PrePut navMessagesJson={this.state.navMessages}/>;   
          break;
          case appConstants.SEARCH:
          this._currentSeat = <Search navMessagesJson={this.state.navMessages}/>;   
          break;             
      default:
        return true; 
      }
  },

  render: function(data){ 
     this.getSeatType(this.state.currentSeat);
      if(this.state.spinner === true){
       this._spinner = <Spinner />
      }else{
        this._spinner ='';
      }
       if(this.state.systemIsIdle === true){
          return (
            <div className="main">
              {this.state.isMobile?<MobileSystemIdle/>:<SystemIdle />}
            </div> 
          )
        }else{
          return (
            <div>
              {this._spinner}
              {this._currentSeat}
            </div> 

          )
       }
      
     
  }
});

module.exports = Operator;