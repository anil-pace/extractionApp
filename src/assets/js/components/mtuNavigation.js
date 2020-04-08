var React = require('react');
var allresourceConstants = require('../constants/resourceConstants');

var MtuNavigation = React.createClass({
	

	processData: function(){
		var data =  this.props.data, navData=[];
		for (var i = 0; i < data.length; i++) {
			if(data[i] === true) {
				navData.push(<div className={"gor-single-mtu-wrap"} key={i}>
								<div className={"gor-mtu-block-sel"}/>
							 </div>)
			}

			else {
				navData.push(<div className={"gor-single-mtu-wrap"} key={i}>
								<div className={"gor-mtu-block-not-sel"}/>
							 </div>)
			}
		}
		

		return navData;
	},
	
	render:function(){		
		var mapStructure = this.processData();
		return (
				<div className={"mtuWrapper"}>
					{mapStructure}
				</div>
			);
	}
});

module.exports = MtuNavigation;