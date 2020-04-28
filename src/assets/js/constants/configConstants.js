var configConstants = {
   WEBSOCKET_IP: 'ws://192.168.8.193:8080',
   INTERFACE_IP: 'https://192.168.8.193',
   PLATFORM_IP: 'http://192.168.8.193:8080'
};
var BOI_CONFIG =
   configConstants.INTERFACE_IP + '/api/components/get_boi_config';
configConstants['BOI_CONFIG'] = BOI_CONFIG;
module.exports = configConstants;
