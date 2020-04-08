var React = require('react');
var Header = require('./Header');
var allresourceConstants = require('../constants/resourceConstants');

var SystemIdleHeader = React.createClass({
	render: function(){
		return (
		<div >
          <Header />
          <div className="systemIdleHeader">
            {_(allresourceConstants.SYS_IDLE)}
          </div>
		</div>
		)
	}
});
module.exports = SystemIdleHeader;
