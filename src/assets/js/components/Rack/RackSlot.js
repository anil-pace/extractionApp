var React = require('react');
var SingleSlot = require('./SingleSlot');


var RackSlot = React.createClass({
	render : function(){
		var rackRange = this.props.rackRange;
		var slotIndexArrays = this.props.slotIndexArrays;
		var totalRackHeight = this.props.totalRackHeight;
		var noOfRows = this.props.noOfRows;
		var calculateWidth = (this.props.slotWidthDataLength*100/this.props.rowTotalWidth)
		var type = this.props.type;
		var slotType = this.props.slotType;
		//var calculateHeight = this.props.slotHeightData;
		var slotWidth = {
				width : calculateWidth + '%',
				//height : calculateHeight/4 + "vh",
			};
		
		
		var singleSlot = this.props.slotWidthData.map(function(singSlot,index){
			//if(slotIndexArrays!==undefined && slotIndexArrays.indexOf(singSlot%10) >= 0)
				if(slotIndexArrays!==undefined && slotIndexArrays.indexOf(parseInt(singSlot.replace(/^0+/, ''))) >= 0)
				return(
						<SingleSlot selected={true} key={singSlot} rackRange={rackRange} index={singSlot.replace(/^0+/, '')} type={type} slotType={slotType} />
					);
				else
				return(
						<SingleSlot key={index} rackRange={rackRange} type={type} slotType={slotType} />
					);
			
		});

		return (
			<div className="rackSlot" style={slotWidth} >
				{singleSlot}
			</div>
			);
	}
});

module.exports = RackSlot ;