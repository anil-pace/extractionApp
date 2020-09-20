var React = require('react');
var IconButton = require('./Button/IconButton');
var appConstants = require('../constants/appConstants');

var TableHeader = React.createClass({
    _component: [],
    getComponent: function (data) {
        var comp = [];
        data.map(function (value, index) {
            var classes = "table-col ";
            var mode = value.mode == 'peripheral' ? classes = classes + "table-col-peripheral " : "";
            classes = classes + "table-col-peripheral-" + value.management + " ";
            var border = value.border == true ? classes = classes + "border-left " : "";
            var grow = value.grow == true ? classes = classes + "flex-grow " : "";
            var selected = value.selected == true ? classes = classes + "selected " : "";
            var large = value.size == "large" ? classes = classes + "large " : classes = classes + "small ";
            var bold = value.bold == true ? classes = classes + "bold " : "";
            var disabled = value.disabled == true ? classes = classes + "disabled " : "";
            var center = value.centerAlign == true ? classes = classes + "center-align " : "";
            var complete = value.status == "complete" ? classes = classes + "complete " : "";
            var missing = value.status == "missing" ? classes = classes + "missing " : "";
            var extra = value.status == "extra" && value.selected == false ? classes = classes + "extra " : "";
            if ((value.type != undefined && value.type == "button"))
                comp.push((<div className={classes}><IconButton type={value.buttonType} module={appConstants.AUDIT} action={appConstants.FINISH_BOX} /></div>));
            else
                comp.push((<div className={classes} title={value.text}>{value.text}</div>));
        });
        this._component = comp;
    },
    render: function () {
        this.getComponent(this.props.data);
        return (
            <div className="table-header">
                {this._component}
            </div>
        );
    },
});

module.exports = TableHeader;