var React = require('react');

var PassiveNavigation = React.createClass({
    render: function() {
        return (
            	<div className="passive-navigation">
                    <div className = "nav-detail">
                        <div className="index"><span>{this.props.data.level}</span></div>
                        <div className="image">
                        <img src={this.props.data.image} />
                        </div>
                        <div className = "info">{_(this.props.data.message)}</div>
                    </div>
                </div>
        );
    },
});

module.exports = PassiveNavigation;