var React = require('react');

var ReactModal = React.createClass({
  render: function(data){
      return (
        <div className={"modal-open react-modal "+(this.props.customClassNames || "")}>
                          <div className="modal-backdrop react-modal-backdrop in"></div>
                          <div className="modal in">
        <div className={"modal-dialog"}>
        <div className={"react-modal-body modal-content"}>
        <div className={"react-modal-head modal-header"}>
        <div className="modal-title">
        {this.props.title}
        </div>
        </div>
       {this.props.children}
       </div>
       </div>
       </div>
       </div>  
      )
  }
});

module.exports = ReactModal;