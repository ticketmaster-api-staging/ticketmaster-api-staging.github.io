import CountdownClock from './classes/CountdownClock';
import TicketmasterCountdownWidget from './classes/TicketmasterCountdownWidget';

let widgetsCountdown = [];
(function () {
  let widgetContainers = document.querySelectorAll("div[w-type='countdown']");
  for (let i = 0; i < widgetContainers.length; ++i) {
    widgetsCountdown.push(new TicketmasterCountdownWidget(widgetContainers[i]));
  }

})();

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-78317809-1', 'auto');
ga('send', 'pageview');

ga('create', 'UA-114077619-1', 'auto', 'tmOpenPlatform');
ga('tmOpenPlatform.send', 'event', 'CountdownWidget', 'load');

if(typeof module !== "undefined") {
    module.exports = { CountdownClock , TicketmasterCountdownWidget , widgetsCountdown };
}
