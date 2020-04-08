var React = require("react")
var mainstore = require("../../stores/mainstore")
var KQ = require("./KQ")
var ProductImage = require("../PrdtDetails/ProductImage")
var ProductInfo = require("../PrdtDetails/ProductInfo")
var appConstants = require("../../constants/appConstants")

var PutWrapper = React.createClass({
  getInitialState: function() {
    return {}
  },
  componentWillMount: function() {
    mainstore.addChangeListener(this.onChange)
  },
  componentWillUnmount: function() {
    mainstore.removeChangeListener(this.onChange)
  },
  onChange: function() {},
  displayLocale: function(data, uomConversionFactor = 1, uomDisplayUnit = "") {
    product_info_locale = {}
    image_url = {}
    var language_locale = sessionStorage.getItem("localeData")
    var locale
    if (language_locale == "null" || language_locale == null) {
      locale = "en-US"
    } else {
      locale = JSON.parse(language_locale)["data"]["locale"]
    }
    data.map(function(value, index) {
      var keyValue = ""
      var imageKey
      for (var key in value[0]) {
        if (key === "product_dimensions") {
          var dimension = value[0][key]
          for (var i = 0; i < dimension.length; i++) {
            if (i === 0) {
              keyValue =
                Math.round(dimension[i] * uomConversionFactor * 10) / 10 + ""
            } else {
              keyValue =
                keyValue +
                " X " +
                Math.round(dimension[i] * uomConversionFactor * 10) / 10
            }
          }
          uomDisplayUnit !== ""
            ? (keyValue =
                keyValue + " (" + appConstants.IN + uomDisplayUnit + ")")
            : (keyValue = keyValue)
        } else if (key != "display_data" && key != "product_local_image_url") {
          keyValue = value[0][key] + " "
        } else if (key != "display_data" && key == "product_local_image_url") {
          imageKey = value[0][key]
        }
      }
      value[0].display_data.map(function(data_locale, index1) {
        if (data_locale.locale == locale) {
          if (data_locale.display_name != "product_local_image_url") {
            product_info_locale[data_locale.display_name] = keyValue
          }
        }
        if (data_locale.display_name == "product_local_image_url") {
          if (
            imageKey === "outer_each" ||
            imageKey === "inner_each" ||
            imageKey === "outer_inner"
          ) {
            image_url[data_locale.display_name] =
              "assets/images/" + imageKey + ".gif"
          } else if (imageKey === "outer" || imageKey === "inner") {
            image_url[data_locale.display_name] =
              "assets/images/" + imageKey + ".png"
          } else image_url[data_locale.display_name] = imageKey
        }
      })
    })
  },
  render: function(data) {
    var isUnitConversionAllowed = mainstore.isUnitConversionAllowed()
    var uomConversionFactor, uomDisplayUnit
    if (isUnitConversionAllowed) {
      uomConversionFactor = mainstore.getUOMConversionFactor()
      uomDisplayUnit = mainstore.getUOMDisplayUnit()
      this.displayLocale(
        this.props.productDetails,
        uomConversionFactor,
        uomDisplayUnit
      )
    } else {
      this.displayLocale(this.props.productDetails)
    }

    return (
      <div className="rightContainer">
        <div className="productDetailsContainer">
          <div style={{ width: "auto" }} className="productTableInfo">
            <ProductImage srcURL={image_url.product_local_image_url} />
            <div>
              <div className="productHeader">{_("Details")}</div>
              <ProductInfo
                infoDetails={product_info_locale}
                flag="codeDetails"
              />
            </div>
          </div>
        </div>
        {this.props.scanDetails ? (
          <div className="kqContainer">
            <KQ
              scanDetails={this.props.scanDetails}
              itemUid={this.props.itemUid}
            />
          </div>
        ) : null}
      </div>
    )
  }
})

module.exports = PutWrapper
