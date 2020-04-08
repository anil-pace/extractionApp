var React = require("react");
var allresourceConstants = require('../../constants/resourceConstants');
var appConstants = require('../../constants/appConstants');
var OrderRow = require('./OrderRow');

var OrderDetails = React.createClass({
	render : function(){

		var orderData =this.props.orderData;
		var orderRowArr = [];
		var orderValue ;
		var volumeUnit = appConstants.VOLUME_UNIT;

		for(var k in orderData){
			if(k === volumeUnit){
				continue;
			}
			if(k === appConstants.VOLUME){
				orderValue = orderData[k] + " "+(orderData[volumeUnit] || "");
			}
			else{
				orderValue = orderData[k]
			}
			orderRowArr.push((<OrderRow orderKey={k} orderValue={orderValue} />))
		}
		return (
				<div className="orderDetailsWrapper">
					{orderRowArr}
				</div>
			);
	}
});

module.exports  = OrderDetails;