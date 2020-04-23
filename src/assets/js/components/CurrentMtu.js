var React = require('react');
var allresourceConstants = require('../constants/resourceConstants');

var CurrentMtu = React.createClass({
    render:function(){  
        return (
                <div className="current-mtu-wrapper">
                    <div className="current-mtu-index"> {this.props.CurrentMtu} </div>
                    <div className="current-mtu-text"> {_(allresourceConstants.CURRENT_MTU)} </div>
                </div>
            );
    }
});

module.exports = CurrentMtu;