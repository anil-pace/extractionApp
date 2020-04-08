var React = require('react');
var mainstore = require('../stores/mainstore');
var SystemIdleHeader = require('./SystemIdleHeader');
var SplitPPS = require('./SplitPPS');
function getState() {
    return {
        dockedGroup: mainstore._getDockedGroup(),
        undockAwaited: mainstore._getUndockAwaitedGroup(),
        wrongUndock: mainstore._getWrongUndockGroup(),
        groupInfo: mainstore._getBinMapDetails(),
        groupOrientation: mainstore._getBinMapOrientation()
    }
}

var MobileSystemIdle = React.createClass({
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
  		if(this.refs.myRef){
   			this.setState(getState());
  		}
  	},
	render: function(){
		return (
			<div ref="myRef">
					<SystemIdleHeader />
					<SplitPPS orientation={this.state.groupOrientation} groupInfo = {this.state.groupInfo} wrongUndock={this.state.wrongUndock} undockAwaited = {this.state.undockAwaited} docked = {this.state.dockedGroup}/>
			</div>
		)
	}
});
module.exports = MobileSystemIdle;
