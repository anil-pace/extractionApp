var React = require('react');
var fontSize = {
	"font-size":"2rem"};

var SingleSlot = React.createClass({
	render : function(){
		var rackRange = this.props.rackRange;
		var slotId = this.props.index;
		var slotText = rackRange+slotId;
		var slotContent;
		var hangerIcon = (<span className='slot-icon hanger-icon'></span>);
		if(this.props.slotType === "hanger"){
			slotContent = (<span className='slot-text'>{slotText}</span>);
		}
		else{
			slotContent = slotText;
		}
		return (
			<div className={"singleslot " + (this.props.selected ? 'activeSlot' : '')} style={this.props.type=="small"?fontSize:{}}  >
				{this.props.selected && slotContent}
				{this.props.selected && this.props.slotType === "hanger" && hangerIcon}
			</div>
			);
	}
});

module.exports = SingleSlot ;