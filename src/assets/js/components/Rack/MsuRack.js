var React = require('react');
var RackRow = require('./RackRow');
var DrawerRow = require('./DrawerRow');
var MsuRackFlex = require('./MsuRackFlex');

var MsuRack = React.createClass({

    render: function(){
		return (
				<div className="drawRackWrapper">
                    <MsuRackFlex hideSlotDetails={this.props.hideSlotDetails} 
                    			 rackDetails={this.props.rackData.rack_type_rec} 
                    			 slotBarcodes={this.props.rackData.slot_barcodes} 
                    			 rackWidth={this.props.rackData.rack_width} 
                    			 putDirectionFlex={this.props.putDirection} 
                    			 QLCodeDetails={this.props.QLCodeDetails}
                    			 screenId={this.props.screenId}
                    			 PickFrontProductDetails={this.props.PickFrontProductDetails}
								 HeavyItemFlag={this.props.heavyItemInfo}/>
                </div>
			);
	}
});

module.exports = MsuRack;