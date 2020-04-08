var React = require('react');
var ExceptionListItem = require('./ExceptionListItem');

var ExceptionList = React.createClass({ 
    _exceptionListItems:[],
    getExceptionListItems:function(){
    	var comp =[];
        var self = this;
    	this.props.data.map(function(value,index){
    		comp.push((<ExceptionListItem data={value} action={self.props.action} />));
    	})
    	this._exceptionListItems = comp;
    },
    render: function() {
    	this.getExceptionListItems();
        return (
            <div className="exception-list">
              { this._exceptionListItems}
            </div>
        );
    },
});

module.exports = ExceptionList;