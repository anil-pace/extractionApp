var React = require('react');
var RackRow = require('./RackRow');
var DrawerRow = require('./DrawerRow');
var MsuRackFlex = require('./MsuRackFlex');

var MsuRack = React.createClass({

    render: function(){
		return (
				<div className="drawRackWrapper">
					<MsuRackFlex 
						rackDetails={this.props.rackData.rack_type_rec} 
						slotBarcodes={this.props.rackData.slot_barcodes}
						toteStatus = { this.props.rackData.tote_status} 
						rackWidth={this.props.rackData.rack_width} 
						screenId={this.props.screenId}
						PickFrontProductDetails={this.props.PickFrontProductDetails}
					/>
                </div>
			);
	}
});

module.exports = MsuRack;