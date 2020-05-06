var configConstants = {
   WEBSOCKET_IP: 'wss://localhost',
   INTERFACE_IP: 'https://localhost',
   PLATFORM_IP: 'https://localhost/api'
};
var BOI_CONFIG =
   configConstants.INTERFACE_IP + '/api/components/get_boi_config';
configConstants['BOI_CONFIG'] = BOI_CONFIG;
module.exports = configConstants;
