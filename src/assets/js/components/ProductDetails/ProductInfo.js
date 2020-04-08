var React = require('react');
var CommonActions = require('../../actions/CommonActions');
var PopUp = require('./PopUp');
var Modal = require('../Modal/Modal');
var mainstore = require('../../stores/mainstore');
var allresourceConstants = require('../../constants/resourceConstants');


function getPopUpState(){
  return {        
        popupVisible : mainstore.getPopUpVisible()
  };
}
var product_info_locale = {};
var image_url = {};
var ProductInfo = React.createClass({
  getInitialState: function(){
    return getPopUpState();
  },
  showModal: function(data,type) {
         CommonActions.showModal({
            data:data,
            type:type
         });
         $('.modal').modal();
  },
  showPopUp: function(){
    if(this.state.popupVisible === false){
        CommonActions.updateCardVisible(true);
    }
    else 
      CommonActions.updateCardVisible(false);

  },
  componentWillMount: function(){
    mainstore.addChangeListener(this.onChange);
  },
  componentWillUnmount: function(){
    mainstore.removeChangeListener(this.onChange);
  },
  onChange: function(){ 
    this.setState(getPopUpState());
  },
   showPopUp: function(){
    if(this.state.popupVisible === false)
        CommonActions.updatePopupVisible(true);
    else 
      CommonActions.updatePopupVisible(false);
    
  },
  displayLocale : function(data){
    product_info_locale = {};
    image_url = {};
    var language_locale = sessionStorage.getItem('localeData');
    var locale;
    if(language_locale == 'null' || language_locale == null){
      locale = 'en-US';
    }else{
      locale = JSON.parse(language_locale)["data"]["locale"]; 
    } 
    data.map(function(value, index){
      var keyValue;
      var imageKey
      for (var key in value[0]) { 
        if(key != 'display_data' && key != 'product_local_image_url' ){
          keyValue = value[0][key] + ' ';
         }else if(key != 'display_data' && key == 'product_local_image_url' ){
            imageKey = value[0][key];
         }
      }
      value[0].display_data.map(
        function(data_locale, index1){
         if(data_locale.locale == locale){
            if(data_locale.display_name != 'product_local_image_url' ){
              product_info_locale[data_locale.display_name] = keyValue;
            }
          }
          if(data_locale.display_name == 'product_local_image_url' ){
              if(imageKey === "outer_each" || imageKey === "inner_each" || imageKey === "outer_inner"){
                image_url[data_locale.display_name] = "assets/images/" + imageKey + ".gif";
              }
              else if(imageKey === "outer" || imageKey === "inner"){
                image_url[data_locale.display_name] = "assets/images/" + imageKey + ".png";
              }
              else
                image_url[data_locale.display_name] = imageKey;
          }
        
        }

      )
      
    });
  },
  render: function(data){ 
    this.displayLocale(this.props.productDetails);
    return (       
            <div className="product-details-wrapper">
              <div className="img-container">
                  <img className="img-responsive" src={image_url.product_local_image_url}  />
              </div>
              <div className="view-more-link" data-toggle="modal" data-target="#myModal" onClick={this.showModal.bind(this,product_info_locale,"product-detail")}>
                <span> {_(allresourceConstants.VIEW_MORE)} </span>                
                <i className="glyphicon glyphicon-info-sign"></i>
              </div>              
            </div>
    )
  }
});

module.exports = ProductInfo;