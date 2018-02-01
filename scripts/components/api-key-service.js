// Global service object
let apiKeyService = {};

(function() {
  let LIVE_KEYS = {
    apiExplore: '7elxdku9GGG5k8j0Xm8KWdANDgecHMV0',
    widgets: '5QGCEXAsJowiCI4n1uAwMlCGAcSNAEmG',
  };

  let STAGING_KEYS = {
    apiExplore: '2Qa4W67WwEiu8ZNXpMbmVX2IGvTMJtIG',
    widgets: 'y61xDc5xqUSIOz4ISjgCe5E9Lh0hfUH1',
  };

  let LOCAL_KEYS = {
    apiExplore: 'B0JQHemR4Q569W9GcjHfhygRBRU3RvrL',
    widgets: 'TQMbqzKDBbcCjAxC9SaKS1lg9D5Eousb',
  };

  let stagingPattern = /(ticketmaster-api-staging.github.io)+/ig;
  let livePattern = /(developer.ticketmaster.com)+/ig;
  let host = window.location.host;
  let tmApiKeys = LOCAL_KEYS;

  if (livePattern.test(host)) {
    tmApiKeys = LIVE_KEYS;
  } else if (stagingPattern.test(host)) {
    tmApiKeys = STAGING_KEYS;
  }

  apiKeyService.getApiKeys = function() {
    return tmApiKeys;
  };

  apiKeyService.getApiExploreKey = function() {
    return tmApiKeys.apiExplore;
  };

  apiKeyService.getApiWidgetsKey = function() {
    return tmApiKeys.widgets;
  };

  apiKeyService.checkApiKeyCookie = function() {
    let key = getCookie('tk-api-key');
    if (!key) {
      return;
    }

    let userApiKey;
    let apiKeys = JSON.parse('[' + window.atob(key) + ']'); // decode and convert string to array
    if (apiKeys && apiKeys.length && apiKeys[0].length) {
      userApiKey = apiKeys[0][apiKeys[0].length - 1];
    }
    return userApiKey;
  };

  apiKeyService.getApiKeysCookie = function(coockieName) {
    let key = getCookie(coockieName);// "tk-api-apps"
    if (!key) {
      return;
    }

    let userApiKey;
    let apiKeys = JSON.parse('[' + window.atob(key) + ']'); // decode and convert string to array
    if (apiKeys && apiKeys.length && apiKeys[0].length) {
      userApiKey = apiKeys[0];
    }
    return userApiKey;
  };

  // get Cookie by name
  function getCookie(cname) {
    let name = cname + '=';
    let ca = document.cookie.split(';');
    for (let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0)==' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

  // CommonJS exports
  if (typeof module !== 'undefined') {
    module.exports = apiKeyService;
  }
}());

