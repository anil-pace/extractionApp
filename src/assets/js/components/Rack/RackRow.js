var React = require('react');
var RackSlot = require('./RackSlot');


var RackRow = React.createClass({
	render: function(){
		
		var rackRange = this.props.rackRange;
		var slotIndexArray = this.props.slotIndexArray;
		var slotData = this.props.slots;
		var totalRackHeight= this.props.totalRackHeight;
		var noOfRows = this.props.noOfRows;	
		var eachRowHeight = this.props.eachRowHeight;
		var slotType = this.props.slotType;
		var eachSlot =[];	
		var type = this.props.type;
		var rowTotalWidth=this.props.rowTotalWidth
        /*var calculateHeight = (eachRowHeight/totalRackHeight)*100;
        var rackRowHeight = {
				
				height : calculateHeight + "%",
			};*/
			var rackRowHeight;
		eachSlot = slotData.map(function(slot,index){
			var x = Math.round((slot[2]/totalRackHeight)*100);
			rackRowHeight = {
				
				flexGrow : x.toString()
			};
			if(slotIndexArray!==undefined  && slotIndexArray.indexOf(index+1) >= 0)
			return(
					<RackSlot rowTotalWidth={+rowTotalWidth} totalRackHeight={totalRackHeight} noOfRows={noOfRows} selectedSlot={true} slotHeightData={slot[2]} slotWidthData={slot[0]} noOfSlotsInRow={slotData.length} slotWidthDataLength={+slot[1]} key={index} slotIndexArrays={slotIndexArray} rackRange={rackRange} type={type} slotType={slotType} />
					
				);
			else
				return(
					<RackSlot rowTotalWidth={+rowTotalWidth} totalRackHeight={totalRackHeight} noOfRows={noOfRows} slotHeightData={slot[2]} slotWidthData={slot[0]} noOfSlotsInRow={slotData.length} slotWidthDataLength={+slot[1]} slotIndexArrays={slotIndexArray} key={index} rackRange={rackRange} type={type} slotType={slotType} />
					);
		});
		return (
				<div className="rackRow" style={rackRowHeight} >
					{eachSlot}
				</div>
			);
	}
});

module.exports = RackRow;