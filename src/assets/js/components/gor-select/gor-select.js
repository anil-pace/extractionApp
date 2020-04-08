var React = require('react');
var ReactDOM = require('react-dom');
var List = require('./List');

var GorSelect = React.createClass({
    getInitialState: function(){
        return{
          dropDownVisible:false,
          placeholder:this.props.placeholder,
          defaultPlaceHolder:this.props.placeholder,
          selectedValue:this.props.selectedOption || null
        }
    },
    componentWillReceiveProps: function(nextProps){
        if ((nextProps.placeholder && nextProps.placeholder !== this.state.placeholder) ||
          (nextProps.selectedOption !== nextProps.selectedOption)) {
            this.setState({
                placeholder: nextProps.placeholder,
                defaultPlaceHolder: nextProps.placeholder
            })
        }
    },
    _toggleDropdown(){
        var currentVisibility = this.state.dropDownVisible;
        currentVisibility = !currentVisibility;
        this.setState({dropDownVisible:currentVisibility});
    },
    _onSelect: function(value,text){
      if(!value){
          return
      }

    this.setState({
      dropDownVisible: !this.state.dropDownVisible,
      placeholder:text || this.state.defaultPlaceHolder,
      selectedValue: value
    },function(){
          this.props.onSelectHandler(value);
    })
    
  },
  _handleDocumentClick: function() {
     if (!ReactDOM.findDOMNode(this).contains(event.target)) {
       this.setState({dropDownVisible: false});
     }
    },
    componentDidMount: function(){
      document.addEventListener('click',this._handleDocumentClick,false);
  },

  componentWillUnmount: function() {
      document.removeEventListener("click", this._handleDocumentClick,false)
  },
    render: function(){
        return (
            <div className="gor-dropdown-wrapper" onClick={!this.props.disabled ? this._toggleDropdown : null}>
            <span className={this.props.disabled?'gor-dropdown':'gor-dropdown gor-enabled'}><span>{!this.props.resetOnSelect ? ((this.props.placeholderPrefix || '')+this.state.placeholder) : this.state.defaultPlaceHolder}</span></span>
            <span className={this.state.dropDownVisible ? "gor-dropdown-arrow up" : "gor-dropdown-arrow"}></span>
            {!this.props.customData ? <List data={this.props.options} selectedOption={this.props.selectedOption} optionAction={this._onSelect}
              dropDownVisible={this.state.dropDownVisible} />: <span className={"gor-option-wrapper"}
                       style={this.state.dropDownVisible?{display:'block'}:{display:'none'}} >
                      {this.props.children(this)}</span>}
            
          </div>
            )
    }
})

module.exports = GorSelect;


