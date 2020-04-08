var React = require('react');
var ActiveNavigation = require('./ActiveNavigation.react');
var PassiveNavigation = require('./PassiveNavigation.react');

var Navigation = React.createClass({ 
    
    render: function() {
        return (
            <div className="navigation">
                {this.props.navData.map(function(value,index){
                    if(value.type == "active"){
                        return (
                                <ActiveNavigation key={index} navId={this.props.navData[0].screen_id} 
                                                  data={value} serverNavData={this.props.serverNavData} 
                                                  navMessagesJson={this.props.navMessagesJson} 
                                                  subMessage={this.props.subMessage} 
                                                  showSpinner={this.props.showSpinner} />
                            );
                    }
                    else{
                        return (
                                <PassiveNavigation key={index} data={value} />
                            );
                    }
                },this)}
      		</div>
        );
    },
});

module.exports = Navigation;