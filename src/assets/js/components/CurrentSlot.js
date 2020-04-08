var React = require('react');
var Header = require('./Header');
var allresourceConstants = require('../constants/resourceConstants');

var CurrentSlot = React.createClass({
	render:function(){	
		var range='';
		var slotArr=this.props.slotDetails ||[];
		finalArray=[],finalString='';
		if(slotArr.length){
			slotArr.forEach( function (arrayItem)
				{
					var arrdata=arrayItem.split('.');
					var splitData=arrdata[arrdata.length-2]+'.'+arrdata[arrdata.length-1];
					finalArray.push(splitData);
				});
		range=finalArray.join(',');
		}		
		return (
				<div className="currentSlotWrapper">
					<div className="slotRange">{range}</div>
					<div className="slotFooter"> {_(allresourceConstants.CURR_SLOT)} </div>
				</div>
						
					
				
			);
	}
});

module.exports = CurrentSlot;