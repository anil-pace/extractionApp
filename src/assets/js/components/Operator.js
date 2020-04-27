var React = require('react');
var mainstore = require('../stores/mainstore');
var PickFront = require('./PickFront');

function getState(){
  return {
      currentSeat: mainstore.getCurrentSeat(),
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
    this._currentSeat = <PickFront navMessagesJson={this.state.navMessages}/>;
  },

  render: function(data){ 
     //if(this.state.currentSeat){
       this.getSeatType(this.state.currentSeat);
       return (
        <div>
          {this._currentSeat}
        </div> 

      )
    //}
    //  else{
    //   return (
    //     <div>
    //       <Spinner />
    //     </div> 

    //   )
    //  }
     
     
      
     
  }
});

module.exports = Operator;