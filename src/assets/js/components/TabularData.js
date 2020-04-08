var React = require('react');
var TableRow = require('./TableRow');
var TableHeader = require('./TableHeader');
var TableFooter = require('./TableFooter');

var TabularData = React.createClass({
    _tableRows: [],
    getTableRows: function () {
        var comp = [];
        this.props.data.tableRows.map(function (value, index) {
            comp.push((<TableRow data={value} />));
        })
        this._tableRows = comp;
    },
    render: function () {
        this.getTableRows();
        var classes = "tabular-data ";

        classes += this.props.className ? this.props.className : '';

        var size = this.props.size == "double" ? classes = classes + "double " : "";
        var size = this.props.size == "triple" ? classes = classes + "triple " : "";
        var tbodyClassName = this.props.tbodyClassName ? "customHeight" : "overflow " + (this.props.data.footer ? 'negate-flex' : '');
        return (
            <div className={classes}>
                <TableHeader data={this.props.data.header} />
                <div className={tbodyClassName} >
                    {this._tableRows}
                </div>
                {this.props.data.footer && <TableFooter data={this.props.data.footer} />}
            </div>
        );
    },
});

module.exports = TabularData;