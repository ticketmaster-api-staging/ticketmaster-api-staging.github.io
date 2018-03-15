const TM_TRACKER_ID = 'UA-78315612-1';

const DEVPORT_TRACKER_ID = 'UA-114077619-1';
const DEVPORT_TRACKER_ALIAS = 'tmOpenPlatform';

const EVENT_CATEGORY = {
  MAP_WIDGET: 'MapWidget',
  CALENDAR_WIDGET: 'CalendarWidget',
  COUNTDOWN_WIDGET: 'CountdownWidget',
  EVENT_DISCOVERY_WIDGET: 'EventDiscoveryWidget',
};

const EVENT_NAME = {
  RENDERED: 'rendered',
  LOAD: 'load',
};

const sendEvent = (widgetCategory, widgetEvent) => {
  ga('send', 'event', widgetCategory, widgetEvent);
  ga(`${DEVPORT_TRACKER_ALIAS}.send`, 'event', widgetCategory, widgetEvent);
};

const initialize = (widgetCategory) => {
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', TM_TRACKER_ID, 'auto');
  ga('create', DEVPORT_TRACKER_ID, 'auto', DEVPORT_TRACKER_ALIAS);

  ga('send', 'pageview');
  ga(`${DEVPORT_TRACKER_ALIAS}.send`, 'event', widgetCategory, EVENT_NAME.LOAD);
};

export default {
  EVENT_CATEGORY,
  EVENT_NAME,
  initialize,
  sendEvent,
};
