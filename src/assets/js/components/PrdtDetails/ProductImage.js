var React = require('react');

var ProductImage = React.createClass({
	render:function(){
		var srcURL = this.props.srcURL;
		var details = this.props.details;
		if(srcURL !=undefined)
		return(
			<div className="productImage">
				<img className="img-responsive" src={srcURL} />
			</div>
			);
		else
			return(
				<div className="productImage holder">
					 <span className="glyphicon glyphicon-picture"></span>
				</div>
			);
	}
});

module.exports = ProductImage;