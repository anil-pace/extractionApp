var React = require("react");
var resourceConstants = require('../../constants/resourceConstants');

var OrderRow = React.createClass({
	render : function(){
		
		return (
				<ul className="orderDetails">
				<li className="orderParam">
				{_(resourceConstants[this.props.orderKey])}{":"}
				</li>
				<li className="orderValue">
					{this.props.orderValue}
				</li>
				</ul>
					
			);
	}
});

module.exports  = OrderRow;