var React = require('react');
var mainstore = require('../stores/mainstore');

function getState(){
  return {
      navMessages : mainstore.getServerMessages()
  }
}
var ExceptionHeader = React.createClass({ 
	_component:[],
	getInitialState: function(){
    	return getState();
  	},
    render: function() {

    	  var server_message = this.props.data.description;
      	var navMessagesJson = this.state.navMessages;
      	var errorCode = this.props.data.code;
      	var message_args  = this.props.data.details.slice(0);
        return (
            <div className="exception-head">
              		{(function(){
                        if(navMessagesJson != undefined){
                            message_args.unshift(navMessagesJson[errorCode]);
                            if(message_args[0] == undefined){
                              return server_message;  
                            }else{
                            var header_message = _.apply(null, message_args);
                            return header_message;
                            }
                        }
                       
                        }
                    )()}
      		</div>
        );
    },
});

module.exports = ExceptionHeader;