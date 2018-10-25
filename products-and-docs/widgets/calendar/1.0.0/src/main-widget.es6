import './polyfills/promisePolyfill';
import lodashOnce from 'lodash/once';

import TicketmasterCalendarWidget from './classes/TicketmasterCalendarWidget';
import TabsControls from './classes/TabsControls';
import WeekScheduler from './classes/WeekScheduler';
import MonthScheduler from './classes/MonthScheduler';
import YearScheduler from './classes/YearScheduler';

import widgetAnalytics, { EVENT_CATEGORY } from 'helpers/widgets-analytics';

widgetAnalytics.initialize(EVENT_CATEGORY.CALENDAR_WIDGET);

window.widgetsCalendar = [];
window.weekSchedulers = [];
window.monthSchedulers = [];
window.yearSchedulers = [];

(function () {
    let widgetContainers = document.querySelectorAll("div[w-type='calendar']");
    for (let i = 0; i < widgetContainers.length; ++i) {
        const calendarWidget = new TicketmasterCalendarWidget(widgetContainers[i]);
        const weekScheduler = new WeekScheduler(widgetContainers[i].querySelector('.weekSсheduler'), calendarWidget);
        const monthScheduler = new MonthScheduler(widgetContainers[i].querySelector('.monthScheduler'), calendarWidget);
        const yearScheduler = new YearScheduler(widgetContainers[i].querySelector('.yearScheduler'));

        const tabControl = new TabsControls(widgetContainers[i]);
        tabControl.addEventListenerForTabIndex('click', 1, lodashOnce(weekScheduler.update.bind(weekScheduler)));
        tabControl.addEventListenerForTabIndex('click', 2, lodashOnce(monthScheduler.update.bind(monthScheduler)));
        tabControl.addEventListenerForTabIndex('click', 3, lodashOnce(yearScheduler.update.bind(yearScheduler)));

        window.widgetsCalendar.push(calendarWidget);
        window.weekSchedulers.push(weekScheduler);
        window.monthSchedulers.push(monthScheduler);
        window.yearSchedulers.push(yearScheduler);
    }

})();
