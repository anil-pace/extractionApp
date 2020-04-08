var React = require('react');
var CommonActions = require('../../actions/CommonActions');
var mainstore = require('../../stores/mainstore');

function getState(){
  return {
      navMessages : mainstore.getServerMessages()
  }
}

var ExceptionListItem = React.createClass({ 
	_component:[],
  getInitialState: function(){
    return getState();
  },
	setCurrentException:function(data){
     var data1 = {
        "event_name": "",
        "event_data": {},
        "source": "ui"
    };
    data1["event_name"] = "exception";
    data1["event_data"]["event"] = data["event"];
    CommonActions.postDataToInterface(data1);
		CommonActions.setActiveException(data.text);
	},

  /**
   * gets the header message for the list item.
   * @return {String} Text message to be displayed for the exception item
   * */
  _getHeaderMessage: function (){
     var server_message = this.props.data.text;
      var navMessagesJson = this.state.navMessages;
      var errorCode = this.props.data.exception_id;
      var message_args  = this.props.data.details.slice(0);
   if(navMessagesJson != undefined){
    message_args.unshift(navMessagesJson[errorCode]);
    if(message_args[0] == undefined){
      return server_message;  
                            }else{
                            var header_message = _.apply(null, message_args);
                            return header_message;
                            }
                        }
  },
 /**
  * creates the div needed for the exception list item and returns it
  * @return {<div>} div which is needed to be displayed
  */
  _getExceptionItemDiv: function (){

    var clickHandler = null;
    if(this.props.action!=undefined && this.props.action == true){
      clickHandler = this.setCurrentException.bind(this,this.props.data);
    }

    return(
        <div className={this.props.data.selected==true?"exception-list-item selected":
          (this.props.data.disabled === true?"exception-list-item disabled":"exception-list-item")} 
             onClick= {clickHandler}>{
               this._getHeaderMessage()
                }
        </div>);
    
  },

  render: function() {
    var exceptionItemDiv = this._getExceptionItemDiv();
    
    return  exceptionItemDiv;
    },
});

module.exports = ExceptionListItem;