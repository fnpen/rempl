var DomEventTransport = require('../../utils/DomEventTransport.js');

module.exports = function createSync(subscriber) {
    new DomEventTransport('rempl-in-page-subscriber', 'rempl-publisher').onInit(subscriber, function() {
        console.log('in-page subscriber connected');
    });

    return subscriber;
};