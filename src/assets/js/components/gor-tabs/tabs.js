var React = require('react');
var Tab = require('./tabContent');

var GorTabs = React.createClass({
    getInitialState: function(){
        return {
            activeTabIndex: this.props.defaultActiveTabIndex,
            disabledTabIndex:this.props.disabledTabIndex
        }
    },
    handleTabClick: function(tabIndex){
        var activeTabIndex = tabIndex === this.state.activeTabIndex ? this.props.defaultActiveTabIndex : tabIndex
        this.setState({
            activeTabIndex
        });
        if(this.props.onTabClick){
            this.props.onTabClick(activeTabIndex);
        }
    },
    renderChildrenWithTabsApiAsProps(){
        var _this = this;
        return React.Children.map(_this.props.children, function(child, index) {
            return React.cloneElement(child, {
                onClick : _this.handleTabClick,
                tabIndex: index,
                isActive: index === _this.state.activeTabIndex,
                disabled: index === _this.state.disabledTabIndex
            });
        });
    },
    renderActiveTabContent: function(){
        var children = this.props.children;
        var activeTabIndex = this.state.activeTabIndex;
        if(children[activeTabIndex]) {
            return children[activeTabIndex].props.children;
        }
    },
    componentWillReceiveProps: function(nextProps){
        this.setState({
            activeTabIndex: nextProps.defaultActiveTabIndex,
            disabledTabIndex:nextProps.disabledTabIndex
        })
    },
    render: function() {
        return (
            <div className={"tabs"}>
                <ul className={"tabs-nav nav navbar-nav navbar-left "+this.props.tabClass}>
                    {this.renderChildrenWithTabsApiAsProps()}
                </ul>
                <div className="tabs-active-content">
                    {this.renderActiveTabContent()}
                </div>
            </div>
        );
    } 
})

module.exports = GorTabs;

