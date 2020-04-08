var React = require('react');
var utils = require('../../utils/utils');
var allSvgConstants = require('../../constants/svgConstants');
var mainstore = require('../../stores/mainstore');

var ProductInfoDetails = React.createClass({
  render: function() {
    var isUnitConversionAllowed = mainstore.isUnitConversionAllowed();
    var uomConversionFactor, uomDisplayUnit, infoDetails;
    if (isUnitConversionAllowed) {
      uomConversionFactor = mainstore.getUOMConversionFactor();
      uomDisplayUnit = mainstore.getUOMDisplayUnit();
      infoDetails = utils.displayData(
        this.props.productInfo,
        this.props.serial,
        uomConversionFactor,
        uomDisplayUnit
      );
    } else {
      infoDetails = utils.displayData(
        this.props.productInfo,
        this.props.serial
      );
    }

    var arr1 = [],
      arr2 = [];
    $.each(infoDetails, function(key, value) {
      if (key !== 'product_local_image_url') {
        return arr1.push(
          <tr>
            <td className='sub-header'> {key} </td>
            <td className='value'>{value} </td>
          </tr>
        );
      } else {
        return arr2.push(value);
      }
    });

    return (
      <div className='table-wrapper'>
        <div className='imageContiner'>
          <img className='imageElem' src={arr2[0]} />
        </div>
        <table className='table'>
          <tbody>{arr1}</tbody>
        </table>
      </div>
    );
  }
});

module.exports = ProductInfoDetails;
