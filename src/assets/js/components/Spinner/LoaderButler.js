var React = require('react');
var SpinnerButler = require('./SpinnerButler');

var LoaderButler = React.createClass({
	render:function(){
		return (

			<div className="loaderButler">
				<SpinnerButler />
			</div>
			);
	}
});

module.exports = LoaderButler;