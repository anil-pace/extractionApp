var React = require('react');
var Header = require('./Header');
var allresourceConstants = require('../constants/resourceConstants');

var CurrentBin = React.createClass({
    render:function(){  
        return (
                <div className="current-bin-wrapper">
                <div className={"p-put-details current-bin "+(this.props.selected ? "selected":"")}>
                    <div className="tote"><span style={{"top":"6px"}} className={this.props.details.count ? "bin-icon tote-icon": ""}></span></div>
                    <div className="item-count-wrap">
                    <p className="item-count">{this.props.details.count || "--"}</p>
                    <p className="item-count-text">{_("Items in Bin")}</p>
                    </div>
                    <div className="p-put-head"> {this.props.details.currBin || "--"} </div>
                   
                </div>
                 <div className="bin-text"> {_(allresourceConstants.CURR_BIN)} </div>
                </div>
                        
                    
                
            );
    }
});

module.exports = CurrentBin;