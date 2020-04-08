var React = require('react');

var ProductDetUDP = function (props) {
  return (<div className="pr-det-udp">
    <div className="pr-img-wrap">
    <img className="img-responsive" height="140" width="200" src={"./assets/images/product.png"}  />
    </div>
    <div className="pr-details-wrap">
    <div className="pr-head">
    {_("Details")}
    </div>
    <div className="pr-details">
        <section className="pr-tuple pr-barcode">
        <span className="det-name">{_("Barcode")}</span>
        <span>{props.details.barcode || "--"}</span>
        </section>
        <section className="pr-tuple pr-color">
        <span className="det-name">{_("Barcode")}</span>
        <span>{props.details.barcode || "--"}</span>
        </section>
    </div>
    </div>
  </div>);
};

module.exports = ProductDetUDP