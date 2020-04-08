var React = require('react');

var PreviousDetails = React.createClass({
  getInitialState: function () {
    return {
      product_info_locale: null
    }
  },
  displayLocale: function (data) {
    var product_info_locale = {}
    var image_url = {};
    var language_locale = sessionStorage.getItem('localeData');
    var locale;
    if (language_locale == 'null' || language_locale == null) {
      locale = 'en-US';
    } else {
      locale = JSON.parse(language_locale)["data"]["locale"];
    }
    data.map(function (value, index) {
      var keyValue = "";
      var imageKey;
      for (var key in value[0]) {
        if (key === "product_dimensions") {
          var dimension = value[0][key];
          for (var i = 0; i < dimension.length; i++) {
            if (i === 0) {
              keyValue = dimension[i] + "";
            }
            else {
              keyValue = keyValue + " X " + dimension[i]
            }
          }
        }
        else if (key != 'display_data' && key != 'product_local_image_url') {
          keyValue = value[0][key] + ' ';
        } else if (key != 'display_data' && key == 'product_local_image_url') {
          imageKey = value[0][key];
        }
      }
      value[0].display_data.map(
        function (data_locale, index1) {
          if (data_locale.locale == locale) {
            if (data_locale.display_name != 'product_local_image_url') {
              product_info_locale[data_locale.display_name] = keyValue;
            }
          }
          if (data_locale.display_name == 'product_local_image_url') {
            image_url[data_locale.display_name] = imageKey;
          }
        }
      )
    });
    return product_info_locale;
  },
  render: function () {
    var type = this.props.type || "";
    var typeToShow = (type === "pick") ? _("Previous Pick Details") : _("Previous Put Details")
    var customizeClass = this.props.customizeClass;
    var previousDetails = this.displayLocale(this.props.previousDetails);
    var showPrevLocation = false;
    return (
      <div className={customizeClass ? "p-put-details " + customizeClass : "p-put-details"}>
        <div className="p-put-head">
          {typeToShow.toUpperCase()}
        </div>
        <div className="p-put-content">
          {Object.keys(previousDetails).map(function (key, idx) {
            if (idx === 0) {
              var str = previousDetails[key].trim();
              if (str) {
                var txtToDisplay = [];
                var frmStart = (<span className="p-put-value">{str.substring(0, str.length - 3)}</span>);
                var frmLast = (<span className="p-put-value-extra">{str.substring(str.length - 3, str.length)}</span>);
                txtToDisplay.push(frmStart, frmLast);
              }
              return (<section key={key + idx} className="p-put-row">
                <p className="p-put-key">{_(key) + " :"}</p>
                <p style={{ "display": "flex", "flexFlow": "row", "alignItems": "center" }}>
                  {str ? txtToDisplay : "--"}
                </p>
              </section>)
            }
            else if (idx === 1) {
              return (<section key={key + idx} className="p-put-row">
                <p className="p-put-key">{_(key) + " :"}</p>
                <p className="p-put-value">{(previousDetails[key]).trim() || "--"}</p>
              </section>)
            }
            else if (idx === 2) {
              showPrevLocation = true;
            }
          })}
        </div>
        {showPrevLocation === true ?
          (<div>
            <div className="p-put-head">
              {_("PREVIOUS LOCATION").toUpperCase()}
            </div>
            <div className="p-put-content">
              {Object.keys(previousDetails).map(function (key, idx) {
                if (idx === 2) { // comparing with idx & not key as key is client configurable
                  var str = previousDetails[key].trim();
                  return (<section key={key + idx} className="p-put-row">
                    {str ?
                      <p className="p-put-value-location">{str}</p> : "--"
                    }
                  </section>)
                }
              })}
            </div>
          </div>)
          : (null)
        }
      </div>
    );
  }
});
module.exports = PreviousDetails