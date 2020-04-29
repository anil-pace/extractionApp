var configConstants = {
    WEBSOCKET_IP: 'ws://localhost:8080',
    INTERFACE_IP: 'https://localhost',
    PLATFORM_IP: 'http://localhost:8080'
 };
 var BOI_CONFIG =
    configConstants.INTERFACE_IP + '/api/components/get_boi_config';
 configConstants['BOI_CONFIG'] = BOI_CONFIG;
 module.exports = configConstants;
 