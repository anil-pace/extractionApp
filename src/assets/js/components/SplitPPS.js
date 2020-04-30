var React = require('react');
var allresourceConstants = require('../constants/resourceConstants');
var mainstore = require("../stores/mainstore")
var CommonActions = require("../actions/CommonActions")

var SplitPPS = React.createClass({


	onMtuSelect: function(mtuId){
		var currentStationId = mainstore.getCurrentStationId();
		var data = {
            "name": "scanned",
            "data": mtuId,
            "screen_id": mainstore.getScreenId()
          }
          CommonActions.postDataToInterface(data, currentStationId)
	},

	processData: function () {
		let groupInfo = this.props.groupInfo && this.props.groupInfo.ppsBinIds ? this.props.groupInfo.ppsBinIds : this.props.groupInfo;
		var data = Object.assign({}, (groupInfo || {}));
		var binColors = Object.assign({}, (this.props.groupInfo.ppsBinIdColors || {}));
		var leftCol = [],
			rightCol = [], centerCol = [], maxBlockCount = 0, maxLeftCount = 0, maxRightCount = 0, maxBlockHeight = 0, maxCenterCount = 0, style = null, maxWidth = 0;
		for (var key in data) {
			if (data[key] === allresourceConstants.BIN_GROUP_LEFT) {
				maxLeftCount++;
			}
			else if (data[key] === allresourceConstants.BIN_GROUP_RIGHT) {
				maxRightCount++;
			}
			else if (data[key] === allresourceConstants.BIN_GROUP_CENTER || data[key] === allresourceConstants.BIN_GROUP_CENTER_TOP) {
				maxCenterCount++;
			}
		}

		maxBlockCount = maxCenterCount > 0 ? maxCenterCount : (maxLeftCount > maxRightCount) ? maxLeftCount : maxRightCount;

		maxBlockHeight = maxCenterCount > 0 ? 75 / maxBlockCount : 50 / maxBlockCount;
		maxWidth = ((maxBlockHeight / 100) * 360).toFixed(3);

		style = {
			height: (maxBlockHeight >= 50 ? 25 : maxBlockHeight) + "%",
			width: (maxWidth <= 100 ? maxWidth : 100) + 'px'
		}
		if (this.props.displayBinId) {
			fontSize = maxCenterCount > 0 ? ((70 / 28) * maxBlockHeight) + 'px' : ((50 / 28) * maxBlockHeight) + 'px';
			padding = "0%";

			/* Start =>special condition for pick_front_slot_scan to limit font size when only one bin is there */
			if (parseInt(fontSize, 10) > parseInt("88px", 10)) { fontSize = 62.5 + 'px', padding = 0 + '%'; }
			/* End */

			style = Object.assign({}, style, {
				color: '#fff',
				'fontSize': fontSize,
				'padding': padding
			})
		}

		for (var k in data) {
			if (data.hasOwnProperty(k)) {
				if (data[k] === allresourceConstants.BIN_GROUP_CENTER || data[k] === allresourceConstants.BIN_GROUP_CENTER_TOP) {
					centerCol.push(<li key={k} onClick={this.onMtuSelect.bind(this, k)} style={{"backgroundColor": binColors[k], ...style}}><span>{this.props.displayBinId ? k : null}</span></li>);
				}
			}
		}
		
		return {
			leftCol: leftCol,
			rightCol: rightCol,
			centerCol: centerCol
		}
	},

	render: function () {
		var mapStructure = this.processData();
		var orientation = Number(this.props.orientation || 0);
		var transformStyle = {
			transform: 'rotate(' + ((orientation + 'deg)'))
		}
		var textTransform = {
			transform: 'rotate(' + (((orientation > 90 ? 180 : 0) + 'deg)'))
		}

		console.log("========= SplitPPS => seatType => else");
		return (
			<div className="splitPPSWrapper">
				<div className="mapCont">
					<div className={"col4 three"}>
						{(mapStructure.centerCol).length >= 1 ?
							<ul>
								{mapStructure.centerCol}
							</ul> : ""
						}
					</div>
					<div className="msuSpace" style={textTransform}>&nbsp;</div>
					<div className={"col1 three"}>
						{(mapStructure.leftCol).length >= 1 ?
							<ul className={this.props.ruleset === 'withBorder' ? 'withBorderLeft' : ''}>
								{mapStructure.leftCol}
							</ul> : ""
						}
					</div>
					<div className="col2 spriteIcons"></div>
					<div className={"col3 three"}>
						{(mapStructure.rightCol).length >= 1 ?
							<ul className={this.props.ruleset === 'withBorder' ? 'withBorder' : ''}>
								{mapStructure.rightCol}
							</ul> : ""
						}
					</div>
				</div>
			</div>
		);
	}
});

module.exports = SplitPPS;