import './polyfills/promisePolyfill';

import TicketmasterCalendarWidget from './classes/TicketmasterCalendarWidget';
import TabsControls from './classes/TabsControls';
import WeekScheduler from './classes/WeekScheduler';
import MonthScheduler from './classes/MonthScheduler';
import YearScheduler from './classes/YearScheduler';

import once from './helpers/once';
import widgetAnalytics from '../../../helpers/widgets-analytics';

widgetAnalytics.initialize(widgetAnalytics.EVENT_CATEGORY.CALENDAR_WIDGET);

window.widgetsCalendar = [];
window.weekSchedulers = [];
window.monthSchedulers = [];
window.yearSchedulers = [];

(function () {
    let widgetContainers = document.querySelectorAll("div[w-type='calendar']");
    for (let i = 0; i < widgetContainers.length; ++i) {
        const calendarWidget = new TicketmasterCalendarWidget(widgetContainers[i]);
        const weekScheduler = new WeekScheduler(widgetContainers[i].querySelector('.weekSсheduler'));
        const monthScheduler = new MonthScheduler(widgetContainers[i].querySelector('.monthScheduler'));
        const yearScheduler = new YearScheduler(widgetContainers[i].querySelector('.yearScheduler'));

        const tabControl = new TabsControls(widgetContainers[i]);
        tabControl.addEventListenerForTabIndex('click', 1, once(weekScheduler.update.bind(weekScheduler)));
        tabControl.addEventListenerForTabIndex('click', 2, once(monthScheduler.update.bind(monthScheduler)));
        tabControl.addEventListenerForTabIndex('click', 3, once(yearScheduler.update.bind(yearScheduler)));

        window.widgetsCalendar.push(calendarWidget);
        window.weekSchedulers.push(weekScheduler);
        window.monthSchedulers.push(monthScheduler);
        window.yearSchedulers.push(yearScheduler);
    }

})();
