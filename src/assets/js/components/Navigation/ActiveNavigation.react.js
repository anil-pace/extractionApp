var React = require('react');
var appConstants = require('../../constants/appConstants');
var ActiveNavigation = React.createClass({
    render: function() {
        var server_message = this.props.serverNavData.description;
        var navMessagesJson = this.props.navMessagesJson;
        var compData = this.props.data;
        var message_args  = this.props.serverNavData.details ? this.props.serverNavData.details.slice(0) : [];
        var errorCode = this.props.serverNavData.code;
        var navId = this.props.navId;
        var level;
        var exceptionImg=(<img src={compData.image} />);

        if(compData.level == null){
            level ='' ;
        }else{
            level = (<div className="index"><span>{compData.level}</span></div>); 
        }
        return (
            	<div className="active-navigation">
                    {
                        (function(){
                            if(compData.showImage)
                            return (
                                    <div className = "nav-detail">
                                    {level}
                                    {(function(){
                                        if(navId !== appConstants.PUT_BACK_INVALID_TOTE_ITEM &&  navId !== appConstants.PPTL_MANAGEMENT && navId !== appConstants.SCANNER_MANAGEMENT)
                                            return exceptionImg;
                                    })()}
                                    </div>
                                );
                        })()
                    }
            		<div className = "action">
                    {(function(){
                        if(navId == appConstants.PUT_BACK_INVALID_TOTE_ITEM || navId == appConstants.PPTL_MANAGEMENT || navId == appConstants.SCANNER_MANAGEMENT)
                            return (<img className="exceptionImg" src={compData.image} />);
                        })()}
            		{(function(){
                        if(navMessagesJson != undefined){
                            message_args.unshift(navMessagesJson[errorCode]);
                            if(message_args[0] == undefined){
                              return _(server_message);  
                            }else{
                            var header_message = _.apply(null, message_args);
                            return _(header_message);
                            }
                        }
                       
                        }
                    )()}
                    {this.props.subMessage && <div className="sub-message">{_(this.props.subMessage)}</div>}         
            		{this.props.showSpinner}
                    </div>
            	</div>
        );
    },
});

module.exports = ActiveNavigation;