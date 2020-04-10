var React = require('react');
var allresourceConstants = require('../constants/resourceConstants');

var CurrentMtu = React.createClass({
    render:function(){  
        return (
            <div className="splitPPSWrapper">
                <div className="color-conventions">
                    <span className="colorBox blue">  </span>
                    <span className="colorText"> MTU docked  </span>
                    <span className="colorBox orange">  </span>
                    <span className="colorText"> Action overdue </span>
                    <span className="colorBox green">  </span>
                    <span className="colorText"> MTU waiting for bot </span>
                </div>
            </div>
        );
    }
});

module.exports = CurrentMtu;