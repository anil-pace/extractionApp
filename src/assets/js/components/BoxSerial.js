var React = require("react");
var allresourceConstants = require('../constants/resourceConstants');

var BoxSerial = React.createClass({
	render : function(){

		var boxList =this.props.boxData;
		var eachBoxSerial = [];

		eachBoxSerial = boxList.map(function(row,index){
				return(
						<tr>
							<td>
								{(index+1) + ". " + row}
							</td>
						</tr>
					);
		});


		return (
				<div className="boxSerial">
					<table className="table">
						<thead>
							<div className="boxHeader">
								{allresourceConstants.TBL_HEADER}
							</div>
						</thead>
						<tbody>
							{eachBoxSerial}
						</tbody>
					</table>
				</div>
			);
	}
});

module.exports  = BoxSerial;