var React = require('react');
var PopUp = React.createClass({ 
  
  componentWillMount: function(){
  },
  componentWillUnmount: function(){
  },
  onChange: function(){ 
  },


  render: function(data){ 
      var productInfo=  this.props.popupData;
      var details = [];
      for (var key in productInfo) {
        if (productInfo.hasOwnProperty(key)) {
           details.push((<div><div className="col-md-6">{key} </div><div className="col-md-6">{productInfo[key]}</div></div>));
            
        }
      }
      return (
          <div className={"container1 " + (this.props.popupVisible ? 'active' : '')}>
            <div className="modal fade" id="myModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" data-keyboard="false">
              <div className="modal-dialog" role="document">
                <div className="modal-content"> 
                  <div className="modal-header">        
                    <h4 className="modal-title">Product Details</h4>
                  </div>             
                  <div className="modal-body">
                    <table>
                      <tbody>
                        {details}
                      </tbody>
                    </table>
                  </div>              
                </div>
              </div>
            </div>
        </div> 
      )
  }
});

module.exports = PopUp;