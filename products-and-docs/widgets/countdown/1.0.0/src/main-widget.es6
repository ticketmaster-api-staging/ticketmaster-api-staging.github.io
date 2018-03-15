import CountdownClock from './classes/CountdownClock';
import TicketmasterCountdownWidget from './classes/TicketmasterCountdownWidget';

import widgetAnalytics from '../../../helpers/widgets-analytics';

widgetAnalytics.initialize(widgetAnalytics.EVENT_CATEGORY.COUNTDOWN_WIDGET);

let widgetsCountdown = [];
(function () {
  let widgetContainers = document.querySelectorAll("div[w-type='countdown']");
  for (let i = 0; i < widgetContainers.length; ++i) {
    widgetsCountdown.push(new TicketmasterCountdownWidget(widgetContainers[i]));
  }

})();

if(typeof module !== "undefined") {
    module.exports = { CountdownClock , TicketmasterCountdownWidget , widgetsCountdown };
}
