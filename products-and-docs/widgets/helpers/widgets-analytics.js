const service = {
  initialize,
  sendEvent,
  getStringEventHandler,
};
export default service;

export const TM_TRACKER_ID = 'UA-78315612-1';

export const DEVPORT_TRACKER_ID = 'UA-114077619-1';
export const DEVPORT_TRACKER_ALIAS = 'tmOpenPlatform';

export const EVENT_CATEGORY = {
  MAP_WIDGET: 'MapWidget',
  CALENDAR_WIDGET: 'CalendarWidget',
  COUNTDOWN_WIDGET: 'CountdownWidget',
  EVENT_DISCOVERY_WIDGET: 'EventDiscoveryWidget',
};

export const EVENT_NAME = {
  RENDERED: 'rendered',
  LOAD: 'load',
  BUY_BUTTON_CLICK: 'buyButtonClick',
  EVENT_NAME_CLICK: 'eventNameClick',
};

export const CUSTOM_DIMENSIONS = {
  API_KEY: 'dimension1',
};

function sendEvent(eventOptions) {
  ga(`${DEVPORT_TRACKER_ALIAS}.send`, 'event', eventOptions);
};

function initialize(widgetCategory) {
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', TM_TRACKER_ID, 'auto');
  ga('create', DEVPORT_TRACKER_ID, 'auto', DEVPORT_TRACKER_ALIAS);

  ga('send', 'pageview');
  service.sendEvent({
    eventCategory: widgetCategory,
    eventAction: EVENT_NAME.LOAD,
  })
};

function getStringEventHandler(eventOptions) {
  return `ga('${DEVPORT_TRACKER_ALIAS}.send', 'event', ${JSON.stringify(eventOptions).replace(/"/g, `'`)});`
};
