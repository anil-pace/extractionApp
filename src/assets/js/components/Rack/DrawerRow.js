var React = require('react');
var DrawerSlot = require('./DrawerSlot');

/**
 * React component to plot a single drawer row
 */
var DrawerRow = React.createClass({
	
	_processData:function(){
		var drawerSlotData = this.props.drawerSlotData
		var totalDrawerHeight= this.props.totalDrawerHeight;
		var selectedSlot= this.props.selectedSlot;
		var eachSlot;
		var isSelected = false;
		var rackRowHeight;
		eachSlot = drawerSlotData.map(function(slot,index){
		var x = Math.round((slot[3]/totalDrawerHeight)*100);
		isSelected = slot[0][0] === selectedSlot ? true :false;
		rackRowHeight = {
			
			flexGrow : x.toString()
		};
		
		return(
				<div className="rackRow" style={rackRowHeight} >
				<DrawerSlot  selectedSlot={isSelected}  selectedDrawerSlot = {selectedSlot} key={index}  />
				</div>
			);
		
	});
		return eachSlot
	},
	render: function(){
		
	var html = this._processData();	
		
	return (<div className="drawers drawRack" id="drSlot">
			{html.reverse()}
		</div>)
				
				
		
	}
});
DrawerRow.propTypes = {
  "drawerSlotData": React.PropTypes.array,
  "totalDrawerHeight":React.PropTypes.number,
  "selectedSlot":React.PropTypes.string
};
module.exports = DrawerRow;