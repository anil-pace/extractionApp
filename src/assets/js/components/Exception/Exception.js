var React = require('react');[]
var ExceptionHeader = require('./ExceptionHeader');
var ExceptionList = require('./ExceptionList');

var Exception = React.createClass({ 
    render: function() {
        return (
            <div className="exception">
                <ExceptionHeader data = {_("EXCEPTION")} />
                <ExceptionList data = {this.props.data.list} action = {this.props.action} />
            </div>
        );
    },
});

module.exports = Exception;