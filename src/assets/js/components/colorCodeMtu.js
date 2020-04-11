var React = require('react');
var allresourceConstants = require('../constants/resourceConstants');

var CurrentMtu = React.createClass({
    render:function(){  
        return (
            <div className="color-conventions">
                <div className="col1">
                    <span className="colorBox blue">  </span>
                    <span className="colorText"> MTU docked  </span>
                </div>
                <div className="col1">
                    <span className="colorBox orange">  </span>
                    <span className="colorText"> Action overdue </span>
                </div>
               <div className="col1">
                <span className="colorBox green">  </span>
                <span className="colorText"> MTU waiting for bot </span>
               </div>
            </div>
        );
    }
});

module.exports = CurrentMtu;