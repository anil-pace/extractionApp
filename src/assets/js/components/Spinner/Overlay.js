var React = require('react');
var LoaderButler = require('./LoaderButler');
var SpinnerButler = require('./SpinnerButler');

var Overlay = React.createClass({
	render:function(){
		return (

			<div className="overlay">
				<LoaderButler />
			</div>
			);
	}
});

module.exports = Overlay;