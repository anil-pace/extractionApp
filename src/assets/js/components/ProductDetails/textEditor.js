var React = require('react');
var CommonActions = require('../../actions/CommonActions');
var mainstore = require('../../stores/mainstore');
var appConstants = require('../../constants/appConstants');
var resourceConstants = require('../../constants/resourceConstants');
var virtualKeyBoard_login; 
function getState(){
    return {
       username : ''
   }
 }
var TextEditor = React.createClass({
    getInitialState: function(){
        return getState();
      },
    
    componentDidMount: function(){
        // mainstore.addChangeListener(this.onChange);
        // loginstore.addChangeListener(this.onChange);
      var self=this;
        virtualKeyBoard_login = $('#username').keyboard({
          layout: 'custom',
          customLayout: {
            'default': ['! @ # $ % ^ & * + _', '1 2 3 4 5 6 7 8 9 0 {b}', 'q w e r t y u i o p', 'a s d f g h j k l', '{shift} z x c v b n m . {shift}','{space}', '{a} {c}'],
            'shift':   ['( ) { } [ ] = ~ ` -', '< > | ? / " : ; , \' {b}', 'Q W E R T Y U I O P', 'A S D F G H J K L', '{shift} Z X C V B N M . {shift}','{space}', '{a} {c}']
          },
          css: {
            container: "ui-widget-content ui-widget ui-corner-all ui-helper-clearfix custom-keypad"
          },
          reposition: true,
          alwaysOpen: false,
          initialFocus: true,      
          visible : function(e, keypressed, el){
            el.value = '';
            //$(".authNotify").css("display","none"); 
          },
          
          accepted: function(e, keypressed, el) {
            var usernameValue = document.getElementById('username').value; 
            CommonActions.updateSeatData(true, "orphanSearchStart"); 
            self.props.callAPItoGetData(usernameValue)  ;
          }
        }); 
      },
      componentWillUnmount: function(){
        $('#username_keyboard').remove();
       // mainstore.removeChangeListener(this.onChange);
      },
       componentWillMount:function(){
        virtualKeyBoard_login = $('#username').keyboard({
          layout: 'custom',
          customLayout: {
            'default': ['! @ # $ % ^ & * + _', '1 2 3 4 5 6 7 8 9 0 {b}', 'q w e r t y u i o p', 'a s d f g h j k l', '{shift} z x c v b n m . {shift}','{space}', '{a} {c}'],
            'shift':   ['( ) { } [ ] = ~ ` -', '< > | ? / " : ; , \' {b}', 'Q W E R T Y U I O P', 'A S D F G H J K L', '{shift} Z X C V B N M . {shift}','{space}', '{a} {c}']
          },
          css: {
            container: "ui-widget-content ui-widget ui-corner-all ui-helper-clearfix custom-keypad"
          },
          reposition: true,
          alwaysOpen: false,
          initialFocus: true,      
          visible : function(e, keypressed, el){
            el.value = '';
            //$(".authNotify").css("display","none"); 
          },
          
          accepted: function(e, keypressed, el) {
            var usernameValue = document.getElementById('username').value;  

          }
        });
       },
  onChange: function(){
  },

    render: function(data) {
    
    return ( 
        <input type="text" className="form-control" id="username" placeholder={_('Scan item or enter barcode details')} ref='username'/>
        )

    }

});
TextEditor.defaultProps = { disable: false };

module.exports = TextEditor;
