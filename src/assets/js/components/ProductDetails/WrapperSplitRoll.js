var React = require('react');
var mainstore = require('../../stores/mainstore');
var KQ = require('./KQ');
var ProductInfo = require('./ProductInfo');
var PopUp = require('./PopUp');

var Wrapper = React.createClass({
  getInitialState: function(){
    return {
       
    }
  },
  componentWillMount: function(){
    mainstore.addChangeListener(this.onChange);
  },
  componentWillUnmount: function(){
    mainstore.removeChangeListener(this.onChange);
  },
  onChange: function(){ 
  },
  render: function(data){
      return (
        <div className='wrapper-flexible'>
            {this.props.productDetails && this.props.productDetails.length?(<ProductInfo productDetails={this.props.productDetails}/>):(<div className='product-details-empty'></div>)}
            <KQ scanDetails={this.props.scanDetails} itemUid={this.props.itemUid} />
        </div>    
      )
  }
});

module.exports = Wrapper;