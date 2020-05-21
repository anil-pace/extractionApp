var React = require('react');
var LinkedStateMixin = require('react-addons-linked-state-mixin');
var mainstore = require('../../stores/mainstore');
var loginstore = require('../../stores/loginstore');
var CommonActions = require('../../actions/CommonActions');
var Operator = require('../Operator');
var allSvgConstants = require('../../constants/svgConstants');
var resourceConstants = require('../../constants/resourceConstants');
var utils = require('../../utils/utils.js');
var appConstants = require('../../constants/appConstants');


var _seat_name = null;
var _mode = null;

function getState() {
  return {
    flag: loginstore.getFlag(),
    stationList: loginstore.stationList(),
    username: '',
    password: '',
    showError: loginstore.getErrorMessage(),
    getLang: loginstore.getLang(),
    getCurrentLang: loginstore.getCurrentLang(),
    scannerStatus: loginstore.scannerStatus()
  };
}

var LoginPage = React.createClass({
  mixins: [LinkedStateMixin],
  getInitialState: function() {
    return getState();
  },

  componentWillMount: function() {
    virtualKeyBoard_login = $('#username, #password').keyboard({
      layout: 'custom',
      customLayout: {
        default: [
          '! @ # $ % ^ & * + _',
          '1 2 3 4 5 6 7 8 9 0 {b}',
          'q w e r t y u i o p',
          'a s d f g h j k l',
          '{shift} z x c v b n m . {shift}',
          '{space}',
          '{a} {c}'
        ],
        shift: [
          '( ) { } [ ] = ~ ` -',
          '< > | ? / " : ; , \' {b}',
          'Q W E R T Y U I O P',
          'A S D F G H J K L',
          '{shift} Z X C V B N M . {shift}',
          '{space}',
          '{a} {c}'
        ]
      },
      css: {
        container:
          'ui-widget-content ui-widget ui-corner-all ui-helper-clearfix custom-keypad'
      },
      reposition: true,
      alwaysOpen: false,
      initialFocus: true,
      visible: function(e, keypressed, el) {
        el.value = '';
      },

      accepted: function(e, keypressed, el) {
        var usernameValue = document.getElementById('username').value;
        var passwordValue = document.getElementById('password').value;
        // if (
        //   usernameValue != null &&
        //   usernameValue != '' &&
        //   passwordValue != null &&
        //   passwordValue != ''
        // ) {
        //   $('#loginBtn').prop('disabled', false);
        // } else {
        //   $('#loginBtn').prop('disabled', true);
        //}
      }
    });
  },

  componentDidMount: function() {

    /* if enter key is hit from keyboard, do NOT call the API and vice-versa */
    $('body').on('keypress', function(e) {
      if (e.which === 13) {
        var hiddenTextValue = document.getElementById('hiddenText').value;
        if (hiddenTextValue.trim()) {
          self.handleLogin();
          document.getElementById('hiddenText').value = ''; // empty the previous scanned value
        }
      }
    });

    /* Shifting focus to hiddenText if user clicks/taps on any other place other than input selectors */
    $('body').on('click', function(e) {
      var currentFocusedElement = document.activeElement.tagName;
      if (currentFocusedElement === 'BODY') {
        if (self.refs.hiddenText) {
          self.refs.hiddenText.focus();
        }
      }
    });

    mainstore.addChangeListener(this.onChange);
    loginstore.addChangeListener(this.onChange);


    /* if user tries to log in by specifying any extraction_point */ 

    //var currentUrl = "https://192.168.8.50/ext_ui/?blahblah=1";
    var sessionData = JSON.parse(sessionStorage.getItem("sessionData"));
    var currentUrl = window.location.href;
    if(currentUrl.includes("extraction_point")){
      console.log("========> On direct login to specific station point ====>");
      var parseUrl = currentUrl.split("?")[1];
      var stationId = parseUrl.split("=")[1];
      _seat_name = stationId;
      console.log("====================> getId");
      console.log(stationId);
      CommonActions.setCurrentStationId(stationId);
      CommonActions.webSocketConnection(stationId);
      $("#loginBtn").prop("disabled", false);
      //$("#loginBtn").show();
    }
    else if(sessionData != null){
      console.log("========> On page Refresh do auto login ====>");
        var stationId = sessionData.data.stationId;
        CommonActions.listSeats();
        CommonActions.getScannerStatus();
        CommonActions.setCurrentStationId(stationId);
        CommonActions.webSocketConnection(stationId);
        CommonActions.changeLanguage(this.state.getCurrentLang);
    }
    else{
      console.log("========> fresh login ====>");
      $("#loginBtn").prop("disabled", true);
      // get list of Station Ids
      CommonActions.listSeats();
      CommonActions.getScannerStatus();
      if (this.state.getLang) {
        CommonActions.changeLanguage(this.state.getLang);
      } else if (this.state.getCurrentLang) {
        CommonActions.changeLanguage(this.state.getCurrentLang);
      }
    }
    

    // <START> 
    /*  condition to Auto login on page REFRESH, before session expiration */ 
    // if(stationId){
    //   CommonActions.webSocketConnection(stationId)
    // }
    // <END>

     // get list of Station Ids
     //CommonActions.listSeats(); 

    var self = this;
    virtualKeyBoard_login = $('#username, #password').keyboard({
      layout: 'custom',
      customLayout: {
        default: [
          '! @ # $ % ^ & * + _',
          '1 2 3 4 5 6 7 8 9 0 {b}',
          'q w e r t y u i o p',
          'a s d f g h j k l',
          '{shift} z x c v b n m . {shift}',
          '{space}',
          '{a} {c}'
        ],
        shift: [
          '( ) { } [ ] = ~ ` -',
          '< > | ? / " : ; , \' {b}',
          'Q W E R T Y U I O P',
          'A S D F G H J K L',
          '{shift} Z X C V B N M . {shift} ',
          '{space}',
          '{a} {c}'
        ]
      },
      css: {
        container:
          'ui-widget-content ui-widget ui-corner-all ui-helper-clearfix custom-keypad'
      },
      reposition: true,
      alwaysOpen: false,
      initialFocus: true,

      visible: function(e, keypressed, el) {
        el.value = '';
      },

      accepted: function(e, keypressed, el) {
        var usernameValue = document.getElementById('username').value;
        var passwordValue = document.getElementById('password').value;
        // if (
        //   usernameValue != null &&
        //   usernameValue != '' &&
        //   passwordValue != null &&
        //   passwordValue != ''
        // ) {
        //   $('#loginBtn').prop('disabled', false);
        // } else {
        //   $('#loginBtn').prop('disabled', true);
        // }
      }
    });
  },
  
  onChange: function() {
    this.setState(getState());
  },

  componentDidUpdate: function() {
    if (this.refs.hiddenText) {
      this.refs.hiddenText.focus();
    }
  },

  componentWillUnmount: function() {
    mainstore.removeChangeListener(this.onChange);
    loginstore.removeChangeListener(this.onChange);
  },

  handleLogin: function() {
    var _self = this;
    if (_seat_name == null) {
      _seat_name = this.refs.seat_name.value;
    }
    var data = {
      data_type: 'auth',
      data: {
        username: _self.refs.username.value,
        password: _self.refs.password.value,
        seat_name: _seat_name,
        //role: _role
      }
    };
      utils.generateSessionId(data);
      CommonActions.login(data);
  },

  disableLoginButton: function() {
    $('#loginBtn').prop('disabled', true);
  },
  changeLanguage: function() {
    CommonActions.changeLanguage(this.refs.language.value);
    //this.disableLoginButton();
  },
  removeNotify: function() {
    $('.errorNotify').css('display', 'none');
  },

  onStationIdChange: function(){
    if(this.refs.seat_name.value !== "0"){
      //$("#loginBtn").show();
      $("#loginBtn").prop("disabled", false);
      CommonActions.webSocketConnection(this.state.stationId);
    }
    else{
      //$("#loginBtn").hide();
      $("#loginBtn").prop("disabled", true);
    }
    

    //save the current station id
    CommonActions.setCurrentStationId(this.state.stationId);
  },

  ChangeStationId: function(e){
    this.setState({stationId: e.target.value}, this.onStationIdChange);
  },

  render: function() {
    var isScannerLoginEnabled = (this.state.scannerStatus === 'true');
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    if (this.state.stationList.length > 0) {
      var parseSeatID, ppsOption, showTiltButton;
      
      /******** list of stations **********/
          seatData = this.state.stationList.map(function(eachItem, index){
            return(
              <option key={'station' + index} value={eachItem}>
              Station Id {eachItem}
            </option>
            );
          })
          seatData.unshift(<option key={'station'} value={0}>{_('Select Station Id')}</option>);
       /***********************/

      // if (parseSeatID != null) {
      //   // ppsOption = (
      //   //   <span style={{ 'font-size': '24px', 'font-weight': '400' }}>
      //   //     {"fuckoff"}
      //   //   </span>
      //   // );
      //   // showTiltButton = '';
      // } else {
        _seat_name = null;
        ppsOption = (
          <select
            value={_seat_name}
            onChange={this.ChangeStationId}
            className={false ? 'selectPPS error' : 'selectPPS'}
            ref='seat_name'
          >
            {seatData}
          </select>
        );
        showTiltButton = <span className='tiltButton' />;
      // }
    } else {
      ppsOption = (
        <span style={{ 'font-size': '24px', 'font-weight': '400' }}>
          {"Extraction Point : " + _seat_name}
        </span>
      );
      showTiltButton = '';
    }

    var _languageDropDown = (
      <div className='selectWrapper'>
        <select
          className='selectLang'
          value={this.state.getCurrentLang}
          ref='language'
          onChange={this.changeLanguage}
        >
          <option value='en-US'>{'English (United States)'}</option>
          <option value='ja-JP'>{'日本語'}</option>
          <option value='de-DE'>{'Deutsche'}</option>
          <option value='he-IL'>{'עברי'}</option>
          <option value='zh-ZH'>{'中文'}</option>
          <option value='fr-FR'>{'Français'}</option>
          <option value='es-ES'>{'Español'}</option>
          <option value='nl'>{'Dutch'}</option>
        </select>
        <span className='tiltButton' />
      </div>
    );

    var _dividerWrapper = (
      <div className='divider'>
        <span className='dividerUpper' />
        <div className='dividerText'>OR</div>
        <span className='dividerBelow' />
      </div>
    );

    if (this.state.flag === false) {
      if (this.state.showError != null) {
        if (_mode === appConstants.SCANNER) {
          scannerErrorClass = 'scannerErrorMsg showErr';
          rightUpper = 'rightUpper showErr';
          leftUpper = 'leftUpper showErr';
          rightBelow = 'rightBelow showErr';
          leftBelow = 'leftBelow showErr';
          plusIconClass = 'plusIcon showErr';
          errorClass = 'ErrorMsg';
        } else {
          errorClass = 'ErrorMsg showErr';
          scannerErrorClass = 'scannerErrorMsg';
          rightUpper = 'rightUpper';
          leftUpper = 'leftUpper';
          rightBelow = 'rightBelow';
          leftBelow = 'leftBelow';
          plusIconClass = 'plusIcon';
        }
        this.disableLoginButton();
      } else {
        // when user lands on the login page, don't show any error kind of error
        errorClass = 'ErrorMsg';
        scannerErrorClass = 'scannerErrorMsg';
        rightUpper = 'rightUpper';
        leftUpper = 'leftUpper';
        rightBelow = 'rightBelow';
        leftBelow = 'leftBelow';
        plusIconClass = 'plusIcon';
      }

      console.log("=======================>");
      console.log(isScannerLoginEnabled);

      if (isScannerLoginEnabled) {
        console.log("1");
        var keyboardLoginClass = 'keyboardLogin'; // show keyboard login + scanner login
      } else {
        console.log("2");
        var keyboardLoginClass = 'keyboardLogin alignCenter'; // show keyboard login only
      }

      return (
        <div className='containerLogin'>
          <header className='heading'>
            <div className='logo'>
              <img className='imgLogo' src={allSvgConstants.logo} />
            </div>
            <div className='languageDropDown'>
              <span className='langText'>{_(appConstants.LANGUAGE)}</span>
              {this.state.getLang ? '' : _languageDropDown}
            </div>
          </header>
          <div className='subHeading'>
            <div className='langText'>
              {_(appConstants.LOGINTO) + ' ' + appConstants.EXTRACTION_UI}
            </div>
            <div className='selectWrapper'>
              {ppsOption}
              {showTiltButton}
            </div>
          </div>

          <main>
            <div className={keyboardLoginClass}>
              <div className='unameContainer'>
                <label className='usernmeText'>
                  {_(resourceConstants.USERNAME)}
                </label>
                <div
                  className={
                    this.state.showError && _mode === appConstants.KEYBOARD
                      ? 'textboxContainer error'
                      : 'textboxContainer'
                  }
                >
                  <span className='iconPlace' />
                  <input
                    type='text'
                    className='form-control'
                    id='username'
                    placeholder={_('Enter username')}
                    ref='username'
                    valueLink={this.linkState('username')}
                  />
                </div>
              </div>

              <div className='passContainer'>
                <label className='usernmeText'>
                  {_(resourceConstants.PASSWORD)}
                </label>
                <div
                  className={
                    this.state.showError && _mode === appConstants.KEYBOARD
                      ? 'textboxContainer error'
                      : 'textboxContainer'
                  }
                >
                  <span className='iconPlace' />
                  <input
                    type='password'
                    className='form-control'
                    id='password'
                    placeholder={_('Enter password')}
                    ref='password'
                    valueLink={this.linkState('password')}
                  />
                </div>
                <div className={errorClass}>
                  <span>{_(this.state.showError)}</span>
                </div>
              </div>

              <div className='buttonContainer'>
                <input
                  type='button'
                  className='loginButton'
                  id='loginBtn'
                  onClick={this.handleLogin}
                  value={_('LOGIN')}
                />
              </div>
            </div>
            {isScannerLoginEnabled ? _dividerWrapper : ''}

            {isScannerLoginEnabled ? (
              <div className='scanIdLogin'>
                <div className='outerDiv'>
                  <div className={rightUpper} />
                  <div className={leftUpper} />
                  <div className={rightBelow} />
                  <div className={leftBelow} />
                  <div className='scanLogo' />
                  <span className={plusIconClass}>&#43;</span>
                  <div style={{ fontSize: '2vh' }}>
                    {' '}
                    {_('Scan ID card to login.')}
                  </div>
                  <div className={scannerErrorClass}>
                    <span>{_(this.state.showError)}</span>
                  </div>
                </div>
              </div>
            ) : (
              ''
            )}
            <input
              type='text'
              id='hiddenText'
              ref='hiddenText'
              style={{ width: '2px', opacity: '0' }}
            />

          </main>
          <footer>Copyright &copy; {currentYear} GreyOrange Pte Ltd</footer>
        </div>
      );
    } else {
      return (
        <div className='main'>
          <Operator />
        </div>
      );
    }
  }
});

module.exports = LoginPage;
