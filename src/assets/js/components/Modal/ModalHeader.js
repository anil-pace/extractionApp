var React = require('react');
var ModalHeader = React.createClass({
  render: function () {
    return (
      <div className="modal-header">
      	<div className="modal-title">
        {this.props.title}
        </div>
      </div>
    )
  }
});

module.exports = ModalHeader;