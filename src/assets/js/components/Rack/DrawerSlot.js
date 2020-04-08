var React = require('react');

/**
 * React component to plot a single drawer
 */

var DrawerSlot = React.createClass({
	render : function(){
		
		var slotWidth = {
				width : 100 + '%'
			};
		var slotHTML;
		if(this.props.selectedSlot){
			slotHTML = (<div className={"singleslot " + (this.props.selectedSlot ? 'activeSlot' : '')}   >
				{this.props.selectedDrawerSlot}
			</div>)
		}
		else{
			slotHTML = (<div className={"singleslot " + (this.props.selectedSlot ? 'activeSlot' : '')}   >
				
			</div>)
		}

		return (
			<div className="rackSlot" style={slotWidth} >
				{slotHTML}
			</div>
			
			);
	}
});
DrawerSlot.propTypes = {
  "selectedSlot": React.PropTypes.bool,
  "selectedDrawerSlot":React.PropTypes.string
};
module.exports = DrawerSlot ;