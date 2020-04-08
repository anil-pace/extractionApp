var React = require('react');
var Header = require('./Header');
var allresourceConstants = require('../constants/resourceConstants');

var SystemIdle = React.createClass({
	render:function(){
		return (
				<div className="systemIdle">
					<Header />
					<div className="idleScreen">
						{_(allresourceConstants.SYS_IDLE)}
					</div>
				</div>
			);
	}
});

module.exports = SystemIdle;