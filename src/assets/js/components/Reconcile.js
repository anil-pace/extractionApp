var React = require('react');
var Header = require('./Header');
var allresourceConstants = require('../constants/resourceConstants');

var ReconcileStatus = React.createClass({
	render:function(){		
		var server_message = this.props.message.description;
        var navMessagesJson = this.props.navMessagesJson;		
		var message_args  = this.props.message.details.slice(0);
        var errorCode = this.props.message.code
		return (
				<div className="reconcileWrapper">
					<div className="reconcileStatus"> 
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
				</div>
				
					
				
			);
	}
});

module.exports = ReconcileStatus;