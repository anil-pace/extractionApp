var React = require('react');

var ExceptionHeader = React.createClass({ 
    
    render: function() {
        return (
            <div className="exception-header">
               {this.props.data}
      		</div>
        );
    },
});

module.exports = ExceptionHeader;