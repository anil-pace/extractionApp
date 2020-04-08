var React = require('react');
var CommonActions = require('../../actions/CommonActions');
var mainstore = require('../../stores/mainstore');
var appConstants = require('../../constants/appConstants');
var resourceConstants = require('../../constants/resourceConstants');
var  _updatedQtyDamaged = 0, _scanDetails = {};

var KQ = React.createClass({
    _appendClassDown : '',
    _appendClassUp : '',
    _qtyComponent : null,
    _appendClassDown: '',
    _appendClassUp: '',
    virtualKeyboard: null, 
    _id : 'keyboard',
    changeValueIncrement : function(){
        if( parseInt(_updatedQtyDamaged ) >= parseInt(_scanDetails.total_qty) && (parseInt(_scanDetails.total_qty) != 0 || _scanDetails.total_qty != "0") )
        {
            return false;
        }
        _updatedQtyDamaged ++;
        this.handleIncrement();             
       // $("#"+this._id).val(_updatedQty);
    },
    incrementValue: function(event){
       var self = this;
       var interval;
        if (_scanDetails.kq_allowed === true) {  
           if( event.type == "mousedown"){
                interval = setInterval(this.changeValueIncrement, 300);           
            }
            else if(event.type == 'click'){
                _updatedQtyDamaged ++;
            }
            
            $('.topArrow').mouseup(function() {
                clearInterval(interval);
            });
            $('.topArrow').mouseout(function(event) {
                clearInterval(interval);
            });
         
            if(mainstore.getScreenId() == appConstants.PUT_BACK_EXCEPTION_DAMAGED_BARCODE || mainstore.getScreenId() == appConstants.AUDIT_EXCEPTION_BOX_DAMAGED_BARCODE 
                || mainstore.getScreenId() == appConstants.PUT_BACK_EXCEPTION_EXTRA_ITEM_QUANTITY_UPDATE || mainstore.getScreenId() ==appConstants.AUDIT_EXCEPTION_LOOSE_ITEMS_DAMAGED_EXCEPTION
                || mainstore.getScreenId() == appConstants.PUT_FRONT_EXCEPTION_SPACE_NOT_AVAILABLE || mainstore.getScreenId() == appConstants.AUDIT_EXCEPTION_ITEM_IN_BOX_EXCEPTION ){
          
               
            }
            else if(parseInt(_updatedQtyDamaged ) > parseInt(_scanDetails.total_qty) && (parseInt(_scanDetails.total_qty) != 0 || _scanDetails.total_qty != "0" )) {
               _updatedQtyDamaged  = _updatedQtyDamaged  - 1; 
            }
            self.handleIncrement();
        }
                                  
    },  
    changeValueDecrement : function(){

        if(_updatedQtyDamaged  <= 0 ){
            _updatedQtyDamaged  = 0;
        }else{
            _updatedQtyDamaged --;
        }
        if((_updatedQtyDamaged  === 0) && (mainstore.getScreenId() == appConstants.PUT_BACK_SCAN || 
                mainstore.getScreenId() == appConstants.PICK_FRONT_MORE_ITEM_SCAN ||
                mainstore.getScreenId() == appConstants.PUT_FRONT_PLACE_ITEMS_IN_RACK)){
            _updatedQtyDamaged  = 1;
        }
        this.handleDecrement();        
       // $("#"+this._id).val(_updatedQty);
    },
    decrementValue: function(event){
        var self = this;
        var interval;
        if (_scanDetails.kq_allowed === true) { 
    
            if( event.type == "mousedown" ){     
                interval = setInterval(this.changeValueDecrement, 300);                
            
            }else if(event.type == 'click') {
               if(_updatedQtyDamaged  <= 0){
                _updatedQtyDamaged  = 0;
                }else{
                _updatedQtyDamaged --;
                }
    
            }
            $('.downArrow').mouseup(function() {
                clearInterval(interval);
            });

            $('.downArrow').mouseout(function(event) {
                clearInterval(interval);
            });
             if((_updatedQtyDamaged  === 0) && (mainstore.getScreenId() == appConstants.PUT_BACK_SCAN || 
                mainstore.getScreenId() == appConstants.PICK_FRONT_MORE_ITEM_SCAN ||
                mainstore.getScreenId() == appConstants.PUT_FRONT_PLACE_ITEMS_IN_RACK)){
                _updatedQtyDamaged  = 1;
            }

          
            self.handleDecrement();
        }
                          
    },                    
    
    handleIncrement: function(event, qty) { 
        if (_scanDetails.kq_allowed === true ) {           
          if((parseInt(_updatedQtyDamaged ) >= parseInt(_scanDetails.total_qty)) && (parseInt(_scanDetails.total_qty) != 0 || _scanDetails.total_qty != "0")){
          }          
                      
            var data = {};
            if( mainstore.getScreenId() == appConstants.AUDIT_EXCEPTION_BOX_DAMAGED_BARCODE || mainstore.getScreenId() == appConstants.AUDIT_EXCEPTION_LOOSE_ITEMS_DAMAGED_EXCEPTION || mainstore.getScreenId() == appConstants.PUT_BACK_EXCEPTION_EXTRA_ITEM_QUANTITY_UPDATE || mainstore.getScreenId() == appConstants.PUT_FRONT_EXCEPTION_SPACE_NOT_AVAILABLE || mainstore.getScreenId() == appConstants.AUDIT_EXCEPTION_ITEM_IN_BOX_EXCEPTION || mainstore.getScreenId() === appConstants.PICK_FRONT_EXCEPTION_MISSING_BOX){
                CommonActions.updateKQQuantity(parseInt(_updatedQtyDamaged ));
                return true;
            }
            if(mainstore.getScreenId() == appConstants.PUT_FRONT_EXCEPTION_DAMAGED_ENTITY ){
                if(this.props.action != undefined){
                    switch(this.props.action){
                        case "GOOD":
                            CommonActions.updateGoodQuantity(parseInt(_updatedQtyDamaged ));
                        break;
                        case "MISSING":
                            CommonActions.updateMissingQuantity(parseInt(_updatedQtyDamaged ));
                        break;
                        case "DAMAGED":
                            CommonActions.updateDamagedQuantity(parseInt(_updatedQtyDamaged ));
                        break;

                        default:
                    }
                }
                return true;
            }

            if (mainstore.getCurrentSeat() == "audit_front") {

                data = {
                    "event_name": "audit_actions",
                    "event_data": {
                        "type": "change_qty",
                        "quantity": parseInt(_updatedQtyDamaged )
                    }
                };
            } 
            else if (mainstore.getScreenId() == appConstants.PUT_BACK_EXCEPTION_OVERSIZED_ITEMS) {
                data = {
                    "event_name": "put_back_exception",
                    "event_data": {
                        "action": "confirm_quantity_update",
                        "quantity": parseInt(_updatedQtyDamaged ),
                        "event":mainstore.getExceptionType()
                    }
                };
            }  
            else {
                data = {
                    "event_name": "quantity_update_from_gui",
                    "event_data": {
                        "item_uid": this.props.itemUid,
                        "quantity_updated": parseInt(_updatedQtyDamaged )
                    },
                    "source": "ui"
                };
            }
            mainstore.setShowModal(false);
            CommonActions.postDataToInterface(data);
        }
    },
    handleDecrement: function(event) {
        if (_scanDetails.kq_allowed === true ) {
            if (parseInt(_updatedQtyDamaged ) >= 0 ) {
                var data = {};
                 if(mainstore.getScreenId() == appConstants.PUT_BACK_EXCEPTION_DAMAGED_BARCODE || mainstore.getScreenId() == appConstants.AUDIT_EXCEPTION_BOX_DAMAGED_BARCODE || mainstore.getScreenId() == appConstants.PUT_BACK_EXCEPTION_EXTRA_ITEM_QUANTITY_UPDATE || mainstore.getScreenId() ==appConstants.AUDIT_EXCEPTION_LOOSE_ITEMS_DAMAGED_EXCEPTION || mainstore.getScreenId() == appConstants.PUT_FRONT_EXCEPTION_SPACE_NOT_AVAILABLE || mainstore.getScreenId() == appConstants.AUDIT_EXCEPTION_ITEM_IN_BOX_EXCEPTION || mainstore.getScreenId() === appConstants.PICK_FRONT_EXCEPTION_MISSING_BOX){
                    CommonActions.updateKQQuantity(parseInt(_updatedQtyDamaged ) );
                     return true;
                }
                if(mainstore.getScreenId() == appConstants.PUT_FRONT_EXCEPTION_DAMAGED_ENTITY ){
                if(this.props.action != undefined){
                    switch(this.props.action){
                        case "GOOD":
                            CommonActions.updateGoodQuantity(parseInt(_updatedQtyDamaged ) );
                        break;
                        case "MISSING":
                            CommonActions.updateMissingQuantity(parseInt(_updatedQtyDamaged ) );
                        break;
                        case "DAMAGED":
                            CommonActions.updateDamagedQuantity(parseInt(_updatedQtyDamaged ) );
                        break;
                        default:
                    }
                }
                return true;
                }
                if (mainstore.getCurrentSeat() == "audit_front") {
                    data = {
                        "event_name": "audit_actions",
                        "event_data": {
                            "type": "change_qty",
                            "quantity": parseInt(_updatedQtyDamaged )
                        }
                    };
                }
                else if (mainstore.getScreenId() == appConstants.PUT_BACK_EXCEPTION_OVERSIZED_ITEMS) {
                data = {
                    "event_name": "put_back_exception",
                    "event_data": {
                        "action": "confirm_quantity_update",
                        "quantity": parseInt(_updatedQtyDamaged ),
                        "event":mainstore.getExceptionType()
                    }
                };
                }   
                else {
                    data = {
                        "event_name": "quantity_update_from_gui",
                        "event_data": {
                            "item_uid": this.props.itemUid,
                            "quantity_updated": parseInt(_updatedQtyDamaged )
                        },
                        "source": "ui"
                    };
                }
                CommonActions.postDataToInterface(data);
            }
        }
    },
  componentDidMount: function() {
    mainstore.removeChangeListener(this.onChange);    

  },
  componentWillMount: function(){
    mainstore.removeChangeListener(this.onChange);
  },
  openNumpad : function(id){
    var action = this.props.action;
    if (_scanDetails.kq_allowed === true) {
        var qty = _scanDetails.current_qty;
        var itemUid = this.props.itemUid;
        /**
         * { T2766- Removed disabled attribute when true }
         */
        $('#'+id).removeAttr("disabled");
          setTimeout(function(){ $('#'+id).keyboard({
            layout: 'custom',
            customLayout: {
                'default': ['1 2 3', '4 5 6', '7 8 9', '. 0 {b}', '{a} {c}']
            },
            reposition: true,
            alwaysOpen: false,          
            initialFocus: true,
            visible: function(e, keypressed, el) {
                $(".ui-keyboard-button.ui-keyboard-46").prop('disabled', true);
                $(".ui-keyboard-button.ui-keyboard-46").css('opacity', "0.6");
                $(".ui-keyboard").css("width","230px");
                $(".ui-keyboard-preview-wrapper .ui-keyboard-preview").css("font-size","30px");
                $(".ui-keyboard-button").css("width","74px");
                $(".ui-keyboard-accept,.ui-keyboard-cancel").css("width","110px");
                //$(".current-quantity").val("");
                $("#"+id).val("");
                $("input.ui-keyboard-preview:visible").val("");
            },
            change : function(e, keypressed, el){
                var data ={};
               if(_scanDetails.kq_allowed == false){
                    $('.ui-keyboard-preview').val("");
                    data["code"] = resourceConstants.CLIENTCODE_013;
                    data["level"] = 'error'
                    CommonActions.generateNotification(data);
                }
                else if(parseInt(keypressed.last.val) > 9999){
                    data["code"] = resourceConstants.CLIENTCODE_008;
                    data["level"] = 'error';
                    CommonActions.generateNotification(data);
                    $('.ui-keyboard-preview').val(9999);
               }else if((parseInt(keypressed.last.val) <= 0) &&  (mainstore.getScreenId() != appConstants.AUDIT_SCAN && mainstore.getScreenId() != appConstants.AUDIT_EXCEPTION_BOX_DAMAGED_BARCODE &&  
                    mainstore.getScreenId() != appConstants.PUT_BACK_EXCEPTION_DAMAGED_BARCODE && mainstore.getScreenId() != appConstants.AUDIT_EXCEPTION_LOOSE_ITEMS_DAMAGED_EXCEPTION &&
                     mainstore.getScreenId() != appConstants.PUT_BACK_EXCEPTION_EXTRA_ITEM_QUANTITY_UPDATE && mainstore.getScreenId() != appConstants.PUT_FRONT_EXCEPTION_SPACE_NOT_AVAILABLE &&
                      mainstore.getScreenId() != appConstants.AUDIT_EXCEPTION_ITEM_IN_BOX_EXCEPTION ) ){
                    data["code"] = resourceConstants.CLIENTCODE_009;
                    data["level"] = 'error'
                    CommonActions.generateNotification(data);
                    $('.ui-keyboard-preview').val(_updatedQtyDamaged );
                }else{
                    data["code"] = null;
                    data["level"] = 'error'
                    CommonActions.generateNotification(data);
                    if(mainstore.getScreenId()=== appConstants.PICK_FRONT_EXCEPTION_MISSING_BOX)
                    {
                    $('.ui-keyboard-preview').val(parseInt(keypressed.last.val));
                    }
                }
                
            },
            accepted: function(e, keypressed, el) {
                if (e.target.value === '' ) {
                    CommonActions.resetNumpadVal(parseInt(_updatedQtyDamaged ));
                } else  {  
                    var data = {};
                     if( mainstore.getScreenId() == appConstants.AUDIT_EXCEPTION_BOX_DAMAGED_BARCODE ||  mainstore.getScreenId() == appConstants.PUT_BACK_EXCEPTION_DAMAGED_BARCODE || mainstore.getScreenId() == appConstants.AUDIT_EXCEPTION_LOOSE_ITEMS_DAMAGED_EXCEPTION || mainstore.getScreenId() == appConstants.PUT_BACK_EXCEPTION_EXTRA_ITEM_QUANTITY_UPDATE || mainstore.getScreenId() == appConstants.PUT_FRONT_EXCEPTION_SPACE_NOT_AVAILABLE || mainstore.getScreenId() == appConstants.AUDIT_EXCEPTION_ITEM_IN_BOX_EXCEPTION ){
                        CommonActions.updateKQQuantity(parseInt(e.target.value));                         
                         return true;
                    }else if(mainstore.getScreenId() === appConstants.PICK_FRONT_EXCEPTION_MISSING_BOX)
                    {
                        _updatedQtyDamaged=parseInt(e.target.value);
                        CommonActions.updateKQQuantity(parseInt(e.target.value));        
                        return true;
                    }
                    if(mainstore.getScreenId() == appConstants.PUT_FRONT_EXCEPTION_DAMAGED_ENTITY ){

                       if(action != undefined){
                            switch(action){
                                case "GOOD":
                                    CommonActions.updateGoodQuantity(parseInt(e.target.value));
                                break;
                                case "MISSING":
                                    CommonActions.updateMissingQuantity(parseInt(e.target.value));
                                break;
                                case "DAMAGED":
                                    CommonActions.updateDamagedQuantity(parseInt(e.target.value));
                                break;
                              
                                default:
                            }
                        }
                        return true;
                    }
                    if (mainstore.getCurrentSeat() == "audit_front") {
                        data = {
                            "event_name": "audit_actions",
                            "event_data": {
                                "type": "change_qty",
                                "quantity": parseInt(e.target.value)
                            }
                        };
                    }
                    else if (mainstore.getScreenId() == appConstants.PUT_BACK_EXCEPTION_OVERSIZED_ITEMS) {
                         data = {
                            "event_name": "put_back_exception",
                            "event_data": {
                                "action": "confirm_quantity_update",
                                "quantity": parseInt(e.target.value),
                                "event":mainstore.getExceptionType()
                            }
                        };
                    }   
                    else {
                        data = {
                            "event_name": "quantity_update_from_gui",
                           "event_data": {
                                "item_uid": itemUid,
                                "quantity_updated": parseInt(e.target.value)
                            },
                            "source" : "ui"
                        };
                    }
                    CommonActions.postDataToInterface(data);
                }
            }
        }); }, 0)
    }

  },
  componentWillUnmount: function(){    
    mainstore.removeChangeListener(this.onChange);
    /*
    if(this.virtualKeyboard != null){
      virtualKeyboard.getkeyboard().close();
    }
    */
  },
  onChange: function(){ 
  },
  checkKqAllowed : function(){    
    if(_scanDetails.kq_allowed === true){        
      if((parseInt(_updatedQtyDamaged ) >= parseInt(_scanDetails.total_qty)) && (parseInt(_scanDetails.total_qty) != 0 || _scanDetails.total_qty != "0") ){          
          
          this._appendClassUp = 'topArrow disable';
          this._appendClassDown = 'downArrow enable';          
      }
      else{
          this._appendClassUp = 'topArrow enable';
          if (mainstore.getCurrentSeat() == "audit_front"){
               if(_updatedQtyDamaged == 0){
                  this._appendClassDown = 'downArrow disable';
                }else{
                  this._appendClassDown = 'downArrow enable';
                } 
            }else if(mainstore.getScreenId() == appConstants.PUT_BACK_EXCEPTION_DAMAGED_BARCODE || mainstore.getScreenId() == appConstants.PUT_BACK_EXCEPTION_OVERSIZED_ITEMS || mainstore.getScreenId() == appConstants.AUDIT_EXCEPTION_BOX_DAMAGED_BARCODE || mainstore.getScreenId() == appConstants.PUT_BACK_EXCEPTION_EXTRA_ITEM_QUANTITY_UPDATE || mainstore.getScreenId() ==appConstants.AUDIT_EXCEPTION_LOOSE_ITEMS_DAMAGED_EXCEPTION || mainstore.getScreenId() == appConstants.PUT_FRONT_EXCEPTION_SPACE_NOT_AVAILABLE || mainstore.getScreenId() == appConstants.AUDIT_EXCEPTION_ITEM_IN_BOX_EXCEPTION || mainstore.getScreenId() === appConstants.PICK_FRONT_EXCEPTION_MISSING_BOX){

                if(_updatedQtyDamaged  == 0){
                  this._appendClassDown = 'downArrow disable';
                }else{
                  this._appendClassDown = 'downArrow enable';
                }   
            }
            else{
                if(_updatedQtyDamaged  == 1){
                  this._appendClassDown = 'downArrow disable';
                }else{
                  this._appendClassDown = 'downArrow enable';
                }
            }
      }
    }
    else{
        this._appendClassUp = 'topArrow disable';
        this._appendClassDown = 'downArrow disable';
    }    
  },
  handleTotalQty : function(){
 
    if(_scanDetails.total_qty != 0 ){
        this._qtyComponent = (
          <div id='textbox'>
            <input id="damaged_keyboard" className="current-quantity"  value={_updatedQtyDamaged } onClick={this.openNumpad.call(null,"damaged_keyboard")}/>
            <span className="separator">/</span>
            <span className="total-quantity">{parseInt(_scanDetails.total_qty)}</span> 
          </div>
        );
    }else{
        this._qtyComponent = (
          <div id='textbox'>
            <input id="damaged_keyboard"  value={_updatedQtyDamaged } onClick={this.openNumpad.call(null,"damaged_keyboard")}/> 
          </div>
        );
    }

    },
    render: function(data) {
        var typeValue="";
        typeValue=this.props.type;
         _updatedQtyDamaged = typeValue === appConstants.UNSCANNABLE?mainstore.getkQQuanity():parseInt(this.props.scanDetailsDamaged.current_qty);
        _scanDetails = this.props.scanDetailsDamaged;
        console.log(_updatedQtyDamaged);
        this.checkKqAllowed();
        this.handleTotalQty();
     
        
        return ( <div className = "kq-wrapper" >
            <a href = "#" className = {this._appendClassUp} action={this.props.action} onClick={this.incrementValue} onMouseDown = {this.incrementValue} >
            <span className = "glyphicon glyphicon-menu-up" > </span> </a> {this._qtyComponent} 
            <a href = "#" className = {this._appendClassDown} action={this.props.action} onClick={this.decrementValue}  onMouseDown = {this.decrementValue} >
            <span className = "glyphicon glyphicon-menu-down" > </span> </a> 
            </div>
        )

    }
});

module.exports = KQ;