var React = require('react');

var ProductInfo = React.createClass({
    render: function() {
        var infoDetails = this.props.infoDetails;
        var arr1 = [];
        $.each(infoDetails, function(key, value) {
            return arr1.push(
                <tr>
	  				<td className="key"> {key} </td>
	  				<td className="value">{value} </td>
  				</tr>

            );
        });

        return (
            <div className="table-wrapper">
				<table className="table">									
					<tbody>
						{arr1}
					</tbody>
				</table>
			</div>
        );
    }
});

module.exports = ProductInfo;
