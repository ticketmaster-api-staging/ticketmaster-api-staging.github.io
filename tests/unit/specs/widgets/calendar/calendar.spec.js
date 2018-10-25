jest.mock('products-and-docs/widgets/helpers/widgets-analytics.js');

const $ = require('jquery');
window.$ = window.jQuery = $;

import TicketmasterCalendarWidget from 'products-and-docs/widgets/calendar/1.0.0/src/classes/TicketmasterCalendarWidget.js';
import TabsControls from 'products-and-docs/widgets/calendar/1.0.0/src/classes/TabsControls.js';
import SelectorControls from 'products-and-docs/widgets/calendar/1.0.0/src/classes/SelectorControls.js';
import WeekScheduler from 'products-and-docs/widgets/calendar/1.0.0/src/classes/WeekScheduler.js';
import MonthScheduler from 'products-and-docs/widgets/calendar/1.0.0/src/classes/MonthScheduler.js';
import YearScheduler from 'products-and-docs/widgets/calendar/1.0.0/src/classes/YearScheduler.js';

describe('CalendarWidget', () => {
	let widget,
		widgetWeek,
		widgetMonth,
		widgetYear,
		tabsControls,
		selectorControls;
  let mockAttrs = {
    'apikey': 'mockTmapikey',
    'latlong': 'mockLatlong',
    'countryCode': 'mockCountrycode',
    'city': 'mockCity',
    'keyword': 'mockKeyword',
    'classificationId': 'mockClassificationid',
    'radius': 'mockRadius',
    'period': 'week123',
  };
	let setFixture = ({apikey='y61xDc5xqUSIOz4ISjgCe5E9Lh0hfUH1', latlong=',', countryCode='US', city='',
											keyword='', classificationId='', radius='', period=''} = {}) => {
		document.body.innerHTML = '<head></head><div w-type="calendar" w-tmapikey="' + apikey + '" w-googleapikey="AIzaSyBQrJ5ECXDaXVlICIdUBOe8impKIGHDzdA" w-postalcodeapi="90015" w-keyword="'+ keyword + '" w-colorscheme="light" w-width="350" w-height="600" w-size="25" w-border="0" w-borderradius="4" w-postalcode="" w-radius="' + radius + '" w-period="' + period + '" w-layout="vertical" w-attractionid="" w-promoterid="" w-venueid="" w-affiliateid="" w-segmentid="" w-proportion="custom" w-titlelink="off" w-countrycode="' + countryCode + '" w-source="" w-latlong="' + latlong + '" w-city="' + city + '" w-classificationId="' + classificationId + '">';

		const calendar = document.querySelector('div[w-type="calendar"]');
    widget = new TicketmasterCalendarWidget(calendar);
    const $month = calendar.querySelector('.monthScheduler');
    widgetWeek = new WeekScheduler($month);
    widgetMonth = new MonthScheduler($month);
    widgetYear = new YearScheduler($month);
    tabsControls = new TabsControls(calendar);
    selectorControls = new SelectorControls();
	};

	beforeAll(() => {
		window.__VERSION__ = 'mockedVersion';
	});

	beforeEach(function() {
    setFixture();
	});

  /* WidgetMonth [START] */

  describe('#widgetMonth', () => {
    it('widgetMonth #apiUrl should be https://app.ticketmaster.com/discovery-widgets/v2/events.json', () => {
      widgetMonth.apiUrl;
      expect(widgetMonth.apiUrl).toBe('https://app.ticketmaster.com/discovery-widgets/v2/events.json');
    });

    it('widgetMonth #eventReqAttrs should be Defined', () => {
      setFixture(mockAttrs);
      let attrs = widgetMonth.eventReqAttrs;

      expect(attrs['apikey']).toBe('mockTmapikey');
      expect(attrs['countryCode']).toBe('mockCountrycode');
      expect(attrs['latlong']).toBe('');
      expect(attrs['city']).toBe('mockCity');
      expect(attrs['keyword']).toBe('mockKeyword');
      expect(attrs['classificationId']).toBe('mockClassificationid');
      expect(attrs['radius']).toBe('mockRadius');
      expect(attrs['size']).toBe('200');
      expect(attrs['page']).toBe(0);
    });

    it('widgetMonth #messageRootContainer should be monthScheduler', () => {
      expect(widgetMonth.messageRootContainer).toBe('monthScheduler');
    });

    it('widgetMonth #hideMessageDelay should be 3000', () => {
      expect(widgetMonth.hideMessageDelay).toBe(3000);
    });

    /* TODO */
    it('widgetMonth #getJsonAsync should be Defined', () => {
      widgetMonth.getJsonAsync('https://app.ticketmaster.com/discovery/v2/events.json?apikey=TQMbqzKDBbcCjAxC9SaKS1lg9D5Eousb&latlong=&keyword=&countryCode=US&city=Los%20Angeles&startDateTime=2017-07-02T00:00:00Z&endDateTime=2017-07-09T23:59:59Z&classificationId=&radius=25&size=500&sort=date,asc');
      expect(typeof(widgetMonth.getJsonAsync)).toBe('function');
    });

    describe('widgetMonth #formatDate', () => {
      it('#formatDate should return empty string', () => {
        const noneResult = widgetMonth.formatDate('date');
        expect(noneResult).toBe('');
      });

      it('#formatDate should return date without time', () => {
        const noneTimeResult = widgetMonth.formatDate({day: '2017-03-17'});
        expect(noneTimeResult).toEqual('Fri, Mar 17, 2017');
      });

      it('#formatDate should return formatted date with PM', () => {
        const mockDate = {
          dateTime: '2017-03-18T00:30:00Z',
          day: '2017-03-17',
          time: '20:30:00',
        };
        expect(widgetMonth.formatDate(mockDate)).toEqual('Fri, Mar 17, 2017 08:30 PM');
      });

      it('#formatDate should return formatted date with AM', () => {
        const mockDate = {
          dateTime: '2017-03-18T00:00:00Z',
          day: '2017-03-17',
          time: '00:00:00',
        };
        expect(widgetMonth.formatDate(mockDate)).toEqual('Fri, Mar 17, 2017 12:00 AM');
      });
    });

    /* TODO */
    it('widgetMonth #addScroll should be Defined', () => {
      widgetMonth.addScroll();
      expect(typeof(widgetMonth.addScroll)).toBe('function');
    });

    /* TODO */
    it('widgetMonth #initMessage should be defined', () => {
      document.querySelector('.event-message__btn').click();
      expect(typeof(widgetMonth.initMessage)).toBe('function');
    });

    it('widgetMonth #showMessage should add new class', () => {
      const addMock = jest.fn();
      const removeMock = jest.fn();
      beforeEach(() => {
        addMock.mockReset();
        removeMock.mockReset();
      });
      const widgetMock = {
        hideMessageWithoutDelay: {},
        messageContent: {},
        messageTimeout: 12,
        messageDialog: {
          classList: {
            add: addMock,
          },
        },
      };

      widgetMonth.showMessage.call(widgetMock, 'message', true);
      expect(addMock).toHaveBeenCalledTimes(1);
      expect(addMock).toHaveBeenCalledWith('event-message_-visible');
      expect(widgetMock.hideMessageWithoutDelay).toEqual(true);
      expect(widgetMock.messageContent.innerHTML).toEqual('message');
    });

    /* TODO */
    it('widgetMonth #hideMessageWithDelay should be defined', () => {
      widgetMonth.hideMessageWithDelay(500);
      expect(typeof(widgetMonth.hideMessageWithDelay)).toBe('function');
      widgetMonth.messageTimeout = function() {return false;};
      widgetMonth.hideMessageWithDelay(500);
      widgetMonth.hideMessageWithDelay.bind({
        messageTimeout: false,
      })();
      expect(typeof(widgetMonth.hideMessageWithDelay)).toBe('function');
    });

    it('widgetMonth #hideMessage should remove class', () => {
      const addMock = jest.fn();
      const removeMock = jest.fn();
      beforeEach(() => {
        addMock.mockReset();
        removeMock.mockReset();
      });
      const widgetMock = {
        messageTimeout: true,
        messageDialog: {
          classList: {
            remove: removeMock,
          },
        },
      };

      widgetMonth.hideMessage.call(widgetMock);
      expect(removeMock).toHaveBeenCalledTimes(1);
      expect(removeMock).toHaveBeenCalledWith('event-message_-visible');
    });

    it('widgetMonth #startMonth should remove class', () => {
      const getJSONMock = jest.fn();
      const removeMock = jest.fn();

      const widgetMock = {
        monthSchedulerRoot: {
          querySelector: jest.fn(() => {return {
            classList: {
              remove: removeMock
            },
          }})
        },
        getJSON: getJSONMock,
        getMonthEventsHandler: () => 'handler',
        apiUrl: 'apiUrl',
        eventReqAttrs: 'eventReqAttrs',
      };

      widgetMonth.startMonth.call(widgetMock);
      expect(removeMock).toHaveBeenCalledWith('hide');
      expect(getJSONMock).toHaveBeenCalledWith('handler', 'apiUrl', 'eventReqAttrs');
    });

    it('widgetMonth #update delLeftselector and delRightselector should be deleted', () => {
      let delLeftselector = widgetMonth.monthSchedulerRoot.parentNode.getElementsByClassName('sliderLeftSelector')[0];
      let delRightselector = widgetMonth.monthSchedulerRoot.parentNode.getElementsByClassName('sliderRightSelector')[0];
      widgetMonth.update();
      expect(delLeftselector.parentElement).toBeFalsy();
      expect(delRightselector.parentElement).toBeFalsy();
    });
  });

  /* WidgetMonth [END] */

  /* Tabs Controls [START] */
  describe('#tabsContorls', () => {
    it('tabsContorls #setActiveTab should define activeTabIndex', () => {
      tabsControls.setActiveTab(3);
      expect(tabsControls.activeTabIndex).toBe(3);

      tabsControls.setActiveTab(1);
      let tab = document.querySelector('.tb:nth-child(4)');
      tab.click();
      expect(tabsControls.activeTabIndex).toBe(3);
      expect(tab.getAttribute('class')).toContain('active');
      expect(document.querySelector('.tb:nth-child(1)').getAttribute('class')).not.toContain('active');
    });

    it('tabsContorls #addEventListenerForTabIndex should addEventListener', () => {
      const addEventListenerMock = jest.fn();
      const widgetMock = {
        tabsElements: [{tab: {addEventListener: addEventListenerMock}}],
      };

      tabsControls.addEventListenerForTabIndex.call(widgetMock, 'eventName', 0, 'listener');
      expect(addEventListenerMock).toHaveBeenCalledTimes(1);
      expect(addEventListenerMock).toHaveBeenCalledWith('eventName', 'listener');
    });
  });
  /* Tabs Controls [END] */

  /* WidgetWeek [START] */

  describe('#widgetWeek', () => {
    it('widgetWeek #apiUrl should be https://app.ticketmaster.com/discovery-widgets/v2/events.json', () => {
      expect(widgetWeek.apiUrl).toBe('https://app.ticketmaster.com/discovery-widgets/v2/events.json');
    });

    it('widgetWeek #eventReqAttrs', () => {
      setFixture(mockAttrs);
      let attrs = widgetWeek.eventReqAttrs;

      expect(attrs['apikey']).toBe('mockTmapikey');
      expect(attrs['countryCode']).toBe('mockCountrycode');
      expect(attrs['latlong']).toBe('');
      expect(attrs['city']).toBe('mockCity');
      expect(attrs['keyword']).toBe('mockKeyword');
      expect(attrs['classificationId']).toBe('mockClassificationid');
      expect(attrs['radius']).toBe('mockRadius');
      expect(attrs['size']).toBe('200');
    });

    it('widgetWeek #messageRootContainer should be weekSсheduler', () => {
      expect(widgetWeek.messageRootContainer).toBe('weekSсheduler');
    });

    it('widgetWeek #hideMessageDelay should be 500', () => {
      expect(widgetWeek.hideMessageDelay).toBe(3000);
    });

    /* TODO */
    it('widgetWeek #addScroll should be defined', () => {
      widgetWeek.addScroll();
      expect(typeof(widgetWeek.addScroll)).toBe('function');
    });

    /* TODO */
    it('widgetWeek #initMessage should be defined', () => {
      document.querySelector('.event-message__btn').click();
      expect(typeof(widgetWeek.initMessage)).toBe('function');
    });

    it('widgetWeek #showMessage should add new class', () => {
      const addMock = jest.fn();
      const removeMock = jest.fn();
      const widgetMock = {
        hideMessageWithoutDelay: {},
        messageContent: {},
        messageTimeout: 12,
        messageDialog: {
          classList: {
            add: addMock,
          },
        },
      };

      widgetWeek.showMessage.call(widgetMock, 'message', true);
      expect(addMock).toHaveBeenCalledTimes(1);
      expect(addMock).toHaveBeenCalledWith('event-message_-visible');
      expect(widgetMock.hideMessageWithoutDelay).toEqual(true);
      expect(widgetMock.messageContent.innerHTML).toEqual('message');
    });

    /* TODO */
    it('widgetWeek #hideMessageWithDelay should be defined', () => {
      widgetWeek.hideMessageWithDelay(500);
      expect(typeof(widgetWeek.hideMessageWithDelay)).toBe('function');
      widgetWeek.messageTimeout = function() {return false;};
      widgetWeek.hideMessageWithDelay(500);
      widgetWeek.hideMessageWithDelay.bind({
        messageTimeout: false,
      })();
      expect(typeof(widgetWeek.hideMessageWithDelay)).toBe('function');
    });

    it('widgetWeek #hideMessage should remove class', () => {
      const addMock = jest.fn();
      const removeMock = jest.fn();
      beforeEach(() => {
        addMock.mockReset();
        removeMock.mockReset();
      });
      const widgetMock = {
        messageTimeout: true,
        messageDialog: {
          classList: {
            remove: removeMock,
          },
        },
      };

      widgetWeek.hideMessage.call(widgetMock);
      expect(removeMock).toHaveBeenCalledTimes(1);
      expect(removeMock).toHaveBeenCalledWith('event-message_-visible');
    });

    /* TODO */
    it('widgetWeek #getJsonAsync should be defined', () => {
      widgetWeek.getJsonAsync('https://app.ticketmaster.com/discovery/v2/events.json?apikey=TQMbqzKDBbcCjAxC9SaKS1lg9D5Eousb&latlong=&keyword=&countryCode=US&city=Los%20Angeles&startDateTime=2017-07-02T00:00:00Z&endDateTime=2017-07-09T23:59:59Z&classificationId=&radius=25&size=500&sort=date,asc');
      expect(typeof(widgetWeek.getJsonAsync)).toBe('function');
    });

    describe('widgetWeek #formatDate', () => {
      it('#formatDate should return empty string', () => {
        const noneResult = widgetWeek.formatDate('date');
        expect(noneResult).toBe('');
      });

      it('#formatDate should return date without time', () => {
        const noneTimeResult = widgetWeek.formatDate({day: '2017-03-17'});
        expect(noneTimeResult).toEqual('Fri, Mar 17, 2017');
      });

      it('#formatDate should return formatted date with PM', () => {
        const mockDate = {
          dateTime: '2017-03-18T00:30:00Z',
          day: '2017-03-17',
          time: '20:30:00',
        };
        expect(widgetWeek.formatDate(mockDate)).toEqual('Fri, Mar 17, 2017 08:30 PM');
      });

      it('#formatDate should return formatted date with AM', () => {
        const mockDate = {
          dateTime: '2017-03-18T00:00:00Z',
          day: '2017-03-17',
          time: '00:00:00',
        };
        expect(widgetWeek.formatDate(mockDate)).toEqual('Fri, Mar 17, 2017 12:00 AM');
      });
    });

    it('widgetWeek #update should be defined', () => {
      const removeChildMock = jest.fn();
      const startMonthMock = jest.fn();
      const appendChildMock = jest.fn();
      const widgetMock = {
        eventsRootContainer: {
          querySelector: () => true,
          removeChild: removeChildMock,
        },
        startMonth: startMonthMock,
        weekSchedulerRoot: {
          appendChild: appendChildMock,
        },
      };
      widgetWeek.update.call(widgetMock);
      expect(startMonthMock).toHaveBeenCalledTimes(1);
      expect(removeChildMock).toHaveBeenCalledTimes(1);
      expect(removeChildMock).toHaveBeenCalledWith(true);
      expect(appendChildMock).toHaveBeenCalledTimes(1);
    });

    it('widgetWeek #startMonth .spinner-container class should be without hide class', () => {
      widgetWeek.startMonth();
      expect(widgetWeek.eventsRootContainer.querySelector('.spinner-container').classList.contains('hide')).toBeFalsy();
    });
  });

  /* WidgetWeek [END] */

  /* WidgetYear [START] */

  describe('#widgetYear', () => {
    it('widgetYear #apiUrl should be https://app.ticketmaster.com/discovery-widgets/v2/events.json', () => {
      expect(widgetYear.apiUrl).toBe('https://app.ticketmaster.com/discovery-widgets/v2/events.json');
    });

    it('widgetYear #eventReqAttrs', () => {
      setFixture({...mockAttrs, 'period': 'mock'});
      let attrs = widgetYear.eventReqAttrs;

      expect(attrs['apikey']).toBe('mockTmapikey');
      expect(attrs['countryCode']).toBe('mockCountrycode');
      expect(attrs['latlong']).toBe('');
      expect(attrs['city']).toBe('mockCity');
      expect(attrs['keyword']).toBe('mockKeyword');
      expect(attrs['classificationId']).toBe('mockClassificationid');
      expect(attrs['radius']).toBe('mockRadius');
      expect(attrs['size']).toBe('1');
    });

    it('widgetYear #messageRootContainer should be yearScheduler', () => {
      expect(widgetYear.messageRootContainer).toBe('yearScheduler');
    });

    it('widgetYear #hideMessageDelay should be 3000', () => {
      expect(widgetYear.hideMessageDelay).toBe(3000);
    });

    describe('widgetYear #formatDate', () => {
      it('#formatDate should return empty string', () => {
        const noneResult = widgetYear.formatDate('date');
        expect(noneResult).toBe('');
      });

      it('#formatDate should return date without time', () => {
        const noneTimeResult = widgetYear.formatDate({day: '2017-03-17'});
        expect(noneTimeResult).toEqual('Fri, Mar 17, 2017');
      });

      it('#formatDate should return formatted date with PM', () => {
        const mockDate = {
          dateTime: '2017-03-18T00:30:00Z',
          day: '2017-03-17',
          time: '20:30:00',
        };
        expect(widgetYear.formatDate(mockDate)).toEqual('Fri, Mar 17, 2017 08:30 PM');
      });

      it('#formatDate should return formatted date with AM', () => {
        const mockDate = {
          dateTime: '2017-03-18T00:00:00Z',
          day: '2017-03-17',
          time: '00:00:00',
        };
        expect(widgetYear.formatDate(mockDate)).toEqual('Fri, Mar 17, 2017 12:00 AM');
      });
    });

    /* TODO */
    it('widgetYear #addScroll should be defined', () => {
      widgetYear.addScroll();
      expect(typeof(widgetYear.addScroll)).toBe('function');
    });

    /* TODO */
    it('widgetYear #initMessage should be defined', () => {
      document.querySelector('.event-message__btn').click();
      expect(typeof(widgetYear.initMessage)).toBe('function');
    });

    it('widgetYear #showMessage should add new class', () => {
      const addMock = jest.fn();
      const widgetMock = {
        hideMessageWithoutDelay: {},
        messageContent: {},
        messageTimeout: 12,
        messageDialog: {
          classList: {
            add: addMock,
          },
        },
      };

      widgetYear.showMessage.call(widgetMock, 'message', true);
      expect(addMock).toHaveBeenCalledTimes(1);
      expect(addMock).toHaveBeenCalledWith('event-message_-visible');
      expect(widgetMock.hideMessageWithoutDelay).toEqual(true);
      expect(widgetMock.messageContent.innerHTML).toEqual('message');
    });

    /* TODO */
    it('widgetYear #hideMessageWithDelay should be defined', () => {
      widgetYear.hideMessageWithDelay(500);
      expect(typeof(widgetYear.hideMessageWithDelay)).toBe('function');
      widgetYear.messageTimeout = function() {return false;};
      widgetYear.hideMessageWithDelay(500);
      widgetYear.hideMessageWithDelay.bind({
        messageTimeout: false,
      })();
      expect(typeof(widgetYear.hideMessageWithDelay)).toBe('function');
    });

    it('widgetYear #hideMessage should remove class', () => {
      const removeMock = jest.fn();
      const widgetMock = {
        messageTimeout: true,
        messageDialog: {
          classList: {
            remove: removeMock,
          },
        },
      };

      widgetYear.hideMessage.call(widgetMock);
      expect(removeMock).toHaveBeenCalledTimes(1);
      expect(removeMock).toHaveBeenCalledWith('event-message_-visible');
    });

    it('widgetYear #getYears', function() {
      let yearNow = new Date().getFullYear();
      let yearNext = yearNow + 1;
      let thisYearEventsSpan = '<span w-period="' + yearNow + '">Events in ' + yearNow + '</span>';
      let nextYearEventsSpan = '<span class="active" w-period="' + yearNext + '">Events in ' + yearNext + '</span>';

      expect(widgetYear.getYears()).toContain(thisYearEventsSpan);
      expect(widgetYear.getYears()).toContain(nextYearEventsSpan);
    });

    it('widgetYear #update should be deleted', () => {
      widgetYear.update();
      expect(widgetYear.yearSchedulerRoot.querySelector('.spinner-container').classList.contains('hide')).toBeFalsy();
    });
  });
  /* WidgetYear [END] */

  /* Widget [START] */

  it('#events should be empty array when widget.events._embedded is falsy', () => {
    widget.events = {};
    expect(widget.events).toEqual([]);
  });

  it('#borderSize should return border from config', () => {
    widget.config = {};
    expect(widget.borderSize).toBe(0);
  });

  it('#widgetContentHeight should be 230', () => {
    widget.widgetConfig = {
      height: 300,
    };
    expect(widget.widgetContentHeight).toBe(230);
  });

  it('#eventUrl should be https://www.ticketmaster.com/event/', () => {
    expect(widget.eventUrl).toBe('http://www.ticketmaster.com/event/');
  });

  describe('#themeUrl', () => {
    it('#themeUrl should be "https://ticketmaster-api-staging.github.io/products-and-docs/widgets/calendar/1.0.0/theme/"', () => {
      expect(widget.themeUrl).toBe('https://ticketmaster-api-staging.github.io/products-and-docs/widgets/calendar/1.0.0/theme/');
    });

    it('#themeUrl should be "https://developer.ticketmaster.com/products-and-docs/widgets/calendar/1.0.0/theme/"', () => {
      Object.defineProperty(window.location, 'host', {
        writable: true,
        value: 'developer.ticketmaster.com',
      });
      expect(widget.themeUrl).toBe('https://developer.ticketmaster.com/products-and-docs/widgets/calendar/1.0.0/theme/');
    });
  });

  describe('#portalUrl', () => {
    it('#portalUrl should be "https://ticketmaster-api-staging.github.io/"', () => {
      Object.defineProperty(window.location, 'host', {
        writable: true,
        value: 'https://ticketmaster-api-staging.github.io',
      });
      expect(widget.portalUrl).toBe('https://ticketmaster-api-staging.github.io/');
    });

    it('#portalUrl should be "https://developer.ticketmaster.com/"', () => {
      Object.defineProperty(window.location, 'host', {
        writable: true,
        value: 'developer.ticketmaster.com',
      });
      expect(widget.portalUrl).toBe('https://developer.ticketmaster.com/');
    });
  });

	it('#legalNoticeUrl should be Defined', () => {
		expect(widget.legalNoticeUrl).toBe('https://developer.ticketmaster.com/support/terms-of-use/');
	});

  it('#updateExceptions should be array and contain elem width', () => {
    expect(widget.updateExceptions).toContain('width');
  });

  it('#sliderDelay should be 5000', () => {
    expect(widget.sliderDelay).toBe(5000);
  });

  it('#sliderRestartDelay should be 5000', () => {
    expect(widget.sliderRestartDelay).toBe(5000);
  });

  it('#hideMessageDelay should be 5000', () => {
    expect(widget.hideMessageDelay).toBe(5000);
  });

  it('widget #countriesWhiteList should be array and contain France', () => {
    expect(widget.countriesWhiteList).toContain('France');
  });

  describe('#isConfigAttrExistAndNotEmpty', () => {
    it('#isConfigAttrExistAndNotEmpty should be true for widget.config.id', () => {
      widget.config.id = 'someID';
      expect(widget.isConfigAttrExistAndNotEmpty('id')).toBe(true);
    });

    it('#isConfigAttrExistAndNotEmpty should be false for widget.config.id', () => {
      widget.config.id = '';
      expect(widget.isConfigAttrExistAndNotEmpty('id')).toBe(false);
    });
  });

  it('#eventReqAttrs should be Defined', () => {
    widget.eventsRootContainer = document.querySelector('.events-root-container');
    expect(widget.eventReqAttrs).toBeDefined();
    widget.widgetConfig = {
      latlong: '34567.87,4589745',
      postalcode: 90015,
      tmapikey: 'test',
      height: 350,
    };
    expect(widget.isConfigAttrExistAndNotEmpty('height')).toBe(true);
    widget.widgetConfig = {
      tmapikey: '',
    };
    expect(widget.eventReqAttrs).toBeDefined();
  });

  it('#eventReqAttrs should return result object', () => {
    widget.eventsRootContainer = document.querySelector('.events-root-container');
    widget.getDateFromPeriod = jest.fn(() => [10, 12]);
    widget.widgetConfig = {
      tmapikey: '',
      latlong: '34567.87,4589745',
      postalcode: 90015,
      height: 350,
      theme: 'simple',
      period: 'week',
    };
    const result = {'postalCode': '', 'latlong': '', 'startDateTime': 10, 'endDateTime': 12};
    expect(widget.isConfigAttrExistAndNotEmpty('latlong')).toBe(true);
    expect(widget.isConfigAttrExistAndNotEmpty('venueid')).toBe(false);
    expect(widget.eventReqAttrs).toEqual(result);
  });

  describe('#parseGoogleGeocodeResponse', () => {
    const responseTextMock = {
      results: [
        {address_components: [{long_name: 'Denmark', short_name: 'DK'}, {long_name: 'Finland', short_name: 'FI'}]},
      ],
      status: 'OK',
    };
    const updateTransitionMock = jest.fn();
    const onLoadCoordinateMock = jest.fn();
    const cbMock = jest.fn();
    beforeEach(() => {
      updateTransitionMock.mockReset();
      onLoadCoordinateMock.mockReset();
      cbMock.mockReset();
    });
    const widgetMock = {
      readyState: XMLHttpRequest.DONE,
      status: 200,
      onLoadCoordinate: onLoadCoordinateMock,
      config: {},
      responseText: JSON.stringify(responseTextMock),
      countriesWhiteList: ['Australia', 'Denmark', 'Finland'],
    };

    it('#parseGoogleGeocodeResponse should onLoadCoordinateMock with generated array', () => {
      const res = [{'address_components': [{'long_name': 'Denmark', 'short_name': 'DK'}, {'long_name': 'Finland', 'short_name': 'FI'}]}];
      widget.parseGoogleGeocodeResponse.call(widgetMock, cbMock);
      expect(onLoadCoordinateMock).toHaveBeenCalledWith(res, 'FI');
      expect(cbMock).toHaveBeenCalledTimes(1);
    });

    it('should resend request if response status is not 200 ', () => {
      const additionalMockParams = {
        ...widgetMock,
        status: 400,
      };
      widget.parseGoogleGeocodeResponse.call(additionalMockParams, cbMock);
      expect(onLoadCoordinateMock).toHaveBeenCalledTimes(1);
      expect(onLoadCoordinateMock).toHaveBeenCalledWith(null, '');
      expect(cbMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('#getCoordinates', () => {
    it('#getCoordinates should call makeRequest', () => {
      widget.makeRequest = jest.fn();
      widget.widgetConfig = {
        postalcode: '90015',
      };
      widget.getCoordinates('param');
      expect(widget.makeRequest).toHaveBeenCalledTimes(1);
    });

    it('#getCoordinates should call cb(widget.config.latlong)', () => {
      let cb = jest.fn();
      expect(widget.config.postalcode).toBeFalsy();
      widget.onLoadCoordinate = () => true;
      widget.getCoordinates(cb);
      expect(cb).toHaveBeenCalledWith('34.0390107,-118.2672801');
    });
  });

  /* TODO */
  it('#initBuyBtn should be defined', () => {
    document.querySelector('.event-buy-btn').click();
    widget.initBuyBtn();
    expect(typeof(widget.initBuyBtn)).toBe('function');
  });

  describe('#setBuyBtnUrl', () => {
    it('should set buy button href from the current event', () => {
      widget.eventsGroups = [[{
        url: 'https://www.universe.com',
      }]];
      widget.buyBtn = {};

      widget.setBuyBtnUrl();
      expect(widget.buyBtn.href).toBe('https://www.universe.com');
    });
  });

  it('#initMessage should create elem messageDialog', () => {
    widget.initMessage();
    document.querySelector('.event-message__btn').click();
    expect(widget.messageDialog.classList).toContain('event-message');
    expect(widget.messageContent.classList).toContain('event-message__content');
  });

  it('#showMessage should add new classes', () => {
    const addMock = jest.fn();
    widget.messageDialog = {
      classList: {
        add: addMock,
      },
    };
    widget.showMessage('message', true);
    expect(addMock).toHaveBeenCalledTimes(1);
    expect(addMock).toHaveBeenCalledWith('event-message-visible');
  });

  /* TODO part*/
  it('#hideMessageWithDelay should define messageTimeout', () => {
    jest.useFakeTimers();
    widget.messageTimeout = 1;
    widget.hideMessageWithDelay(500);
    expect(clearTimeout).toHaveBeenCalledWith(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 500);
  });

  it('#hideMessage should remove class', () => {
    const removeMock = jest.fn();
    widget.messageTimeout = true;
    widget.messageDialog = {
      classList: {
        remove: removeMock,
      },
    };
    widget.hideMessage();
    expect(removeMock).toHaveBeenCalledTimes(1);
    expect(removeMock).toHaveBeenCalledWith('event-message-visible');
  });

  /* TODO */
  it('#AdditionalElements should be defined', () => {
    widget.AdditionalElements();
    expect(typeof(widget.AdditionalElements)).toBe('function');
    widget.AdditionalElements = {
      toolTipHandler: function(e) {},
    };
    let e = new $.Event('click');
    widget.AdditionalElements.toolTipHandler(e);
  });

  it('#hideSliderControls should add class', () => {
    widget.hideSliderControls();
    expect(widget.prevEventX.classList).toContain('events_control-hidden');
    expect(widget.nextEventX.classList).toContain('events_control-hidden');
    expect(widget.prevEventY.classList).toContain('events_control-hidden');
    expect(widget.nextEventY.classList).toContain('events_control-hidden');
  });

  describe('#toggleControlsVisibility method', () => {
    beforeEach(() => {
      widget.eventsGroups = [];
    });
    it('if slideCountX > 1 && currentSlideX == 0 && eventsGroups.length == true #toggleControlsVisibility should delete class and add new', () => {
      widget.slideCountX = 2;
      widget.currentSlideX = 0;
      widget.currentSlideY = 0;
      widget.eventsGroups = [];
      widget.eventsGroups[0] = 'elem1';
      widget.eventsGroups[1] = 'elem2';

      widget.toggleControlsVisibility();
      expect(widget.prevEventY.classList).toContain('events_control-hidden');
      expect(widget.nextEventY.classList).not.toContain('events_control-hidden');
      expect(widget.prevEventX.classList).toContain('events_control-hidden');
      expect(widget.nextEventX.classList).not.toContain('events_control-hidden');
    });

    it('if slideCountX > 1 && currentSlideX === 1 && eventsGroups.length == true #toggleControlsVisibility should delete class and add new', () => {
      widget.slideCountX = 2;
      widget.currentSlideX = 1;
      widget.currentSlideY = 1;
      widget.eventsGroups = [];
      widget.eventsGroups[0] = 'elem1';
      widget.eventsGroups[1] = [1, 2];
      widget.toggleControlsVisibility();
      expect(widget.nextEventX.classList).toContain('events_control-hidden');
      expect(widget.prevEventX.classList).not.toContain('events_control-hidden');
      expect(widget.prevEventY.classList).not.toContain('events_control-hidden');
      expect(widget.nextEventY.classList).toContain('events_control-hidden');
    });

    it('if slideCountX < 1 && eventsGroups.length == true #toggleControlsVisibility should add classes', () => {
      widget.slideCountX = 0;
      widget.currentSlideX = 1;
      widget.toggleControlsVisibility();
      expect(widget.nextEventX.classList).toContain('events_control-hidden');
      expect(widget.prevEventX.classList).toContain('events_control-hidden');
      expect(widget.prevEventY.classList).toContain('events_control-hidden');
      expect(widget.nextEventY.classList).toContain('events_control-hidden');
    });

    it('if eventsGroups.length == true #toggleControlsVisibility should add classes', () => {
      widget.currentSlideX = 1;
      widget.eventsGroups = [];
      widget.eventsGroups[0] = 'elem1';
      widget.eventsGroups[1] = '1';
      widget.toggleControlsVisibility();
      expect(widget.prevEventY.classList).toContain('events_control-hidden');
      expect(widget.nextEventY.classList).toContain('events_control-hidden');
    });
  });

  it('#prevSlideX should call setSlideManually', () => {
    widget.setSlideManually = jest.fn();
    widget.currentSlideX = 5;
    widget.prevSlideX();
    expect(widget.setSlideManually).toHaveBeenCalledWith(4, true);
  });

  it('#nextSlideX should call setSlideManually', () => {
    widget.setSlideManually = jest.fn();
    widget.slideCountX = 5;
    widget.currentSlideX = 2;
    widget.nextSlideX();
    expect(widget.setSlideManually).toHaveBeenCalledWith(3, true);
  });

  it('#prevSlideY should call setSlideManually', () => {
    widget.setSlideManually = jest.fn();
    widget.currentSlideY = 2;
    widget.prevSlideY();
    expect(widget.setSlideManually).toHaveBeenCalledWith(1, false);
  });

  it('#nextSlideY should call setSlideManually', () => {
    widget.setSlideManually = jest.fn();
    widget.currentSlideY = 1;
    widget.currentSlideX = 0;
    widget.eventsGroups = [[1, 2, 3]];
    widget.nextSlideY();
    expect(widget.setSlideManually).toHaveBeenCalledWith(2, false);
  });

  describe('#setSlideManually', () => {
    it('#setSlideManually should call goToSlideX, stopAutoSlideX, runAutoSlideX', () => {
      jest.useFakeTimers();

      widget.stopAutoSlideX = jest.fn();
      widget.runAutoSlideX = jest.fn();
      widget.goToSlideX = jest.fn();
      widget.goToSlideY = jest.fn();

      widget.setSlideManually('index', 1);

      expect(widget.stopAutoSlideX).toHaveBeenCalled();
      expect(setTimeout).toHaveBeenCalled();
      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 5000);
      expect(widget.goToSlideX).toHaveBeenCalledWith('index');

      jest.runOnlyPendingTimers();
      expect(widget.runAutoSlideX).toHaveBeenCalled();
    });

    it('#setSlideManually should call goToSlideY, stopAutoSlideX, runAutoSlideX', () => {
      jest.useFakeTimers();

      widget.stopAutoSlideX = jest.fn();
      widget.runAutoSlideX = jest.fn();
      widget.goToSlideX = jest.fn();
      widget.goToSlideY = jest.fn();

      widget.setSlideManually('index', 0);

      expect(widget.stopAutoSlideX).toHaveBeenCalled();
      expect(setTimeout).toHaveBeenCalled();
      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 5000);
      expect(widget.goToSlideY).toHaveBeenCalledWith('index');

      jest.runOnlyPendingTimers();
      expect(widget.runAutoSlideX).toHaveBeenCalled();
    });
  });

  describe('#goToSlideX', () => {
    it('result should be falsy and call setBuyBtnUrl 0 times', () => {
      widget.setBuyBtnUrl = jest.fn();
      widget.currentSlideX = 1;
      expect(widget.goToSlideX(1)).toBeFalsy();
      expect(widget.setBuyBtnUrl).toHaveBeenCalledTimes(0);
    });

    it('should call setBuyBtnUrl, toggleControlsVisibility and setEventsCounter', () => {
      widget.setBuyBtnUrl = jest.fn();
      widget.toggleControlsVisibility = jest.fn();
      widget.setEventsCounter = jest.fn();
      widget.goToSlideX(3);
      expect(widget.setBuyBtnUrl).toHaveBeenCalledTimes(1);
      expect(widget.setEventsCounter).toHaveBeenCalledTimes(1);
      expect(widget.toggleControlsVisibility).toHaveBeenCalledTimes(1);
    });
  });

  describe('#goToSlideY', () => {
    it('setBuyBtnUrl function should not be called', () => {
      const setBuyBtnUrlMock = jest.fn();
      const toggleControlsVisibilityMock = jest.fn();
      const setEventsCounterMock = jest.fn();
      const widgetMock = {
        currentSlideY: 1,
        currentSlideX: 1,
        widgetContentHeight: 2,
        borderSize: 3,
        setBuyBtnUrl: setBuyBtnUrlMock,
        toggleControlsVisibility: toggleControlsVisibilityMock,
        setEventsCounter: setEventsCounterMock,
        eventsRoot: {
          style: {
            marginLeft: '10',
          },
          getElementsByClassName: function() {return [{style: {marginTop: 1}}, {}];},
        },
      };
      widget.goToSlideY.call(widgetMock, 2);
      expect(setBuyBtnUrlMock.mock.calls.length).toBe(1);
    });

    it('setBuyBtnUrl function should not be called', () => {
      const setBuyBtnUrlMock = jest.fn();
      const widgetMock = {
        currentSlideY: 1,
        setBuyBtnUrl: setBuyBtnUrlMock,
      };
      widget.goToSlideY.call(widgetMock, 1);
      expect(setBuyBtnUrlMock.mock.calls.length).toBe(0);
    });
  });

  it('#runAutoSlideX should call goToSlideX(2', () => {
    jest.useFakeTimers();

    widget.slideCountX = 3;
    widget.currentSlideX = 1;
    widget.goToSlideX = jest.fn();

    widget.runAutoSlideX();
    expect(setInterval).toHaveBeenCalled();
    expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 5000);

    jest.runOnlyPendingTimers();
    expect(widget.goToSlideX).toBeCalledWith(2);
  });

  it('#stopAutoSlideX should clearTimeout, clearInterval', () => {
    jest.useFakeTimers();
    widget.sliderTimeout = 10;
    widget.sliderInterval = 20;

    widget.stopAutoSlideX();
    expect(clearTimeout).toHaveBeenCalledWith(10);
    expect(clearInterval).toHaveBeenCalledWith(20);
  });

  /* TODO */
  it('#initSliderControls should be defined', () => {
    widget.initSliderControls();
    $(widget.eventsRootContainer).trigger('touchstart');
    expect(typeof(widget.initSliderControls)).toBe('function');
  });

  it('#initSlider', () => {
    const runAutoSlideXMock = jest.fn();
    const toggleControlsVisibilityMock = jest.fn();
    const setBuyBtnUrlMock = jest.fn();

    const widgetMock = {
      sliderInterval: true,
      sliderTimeout: true,
      eventsGroups: [1, 2, 3, 4],
      runAutoSlideX: runAutoSlideXMock,
      toggleControlsVisibility: toggleControlsVisibilityMock,
      setBuyBtnUrl: setBuyBtnUrlMock,
      eventsRoot: {
        style: {},
      },
    };

    widget.initSlider.call(widgetMock);
    expect(widgetMock.eventsRoot.style.width).toBe('400%');
    expect(runAutoSlideXMock).toHaveBeenCalledTimes(1);
    expect(toggleControlsVisibilityMock).toHaveBeenCalledTimes(1);
    expect(setBuyBtnUrlMock).toHaveBeenCalledTimes(1);
  });

  describe('#formatDate', () => {
    it('#formatDate should return empty string', () => {
      const noneResult = widget.formatDate('date');
      expect(noneResult).toBe('');
    });

    it('#formatDate should return date without time', () => {
      const noneTimeResult = widget.formatDate({day: '2017-03-17'});
      expect(noneTimeResult).toEqual('Fri, Mar 17, 2017');
    });

    it('#formatDate should return formatted date with PM', () => {
      const mockDate = {
        dateTime: '2017-03-18T00:30:00Z',
        day: '2017-03-17',
        time: '20:30:00',
      };
      expect(widget.formatDate(mockDate)).toEqual('Fri, Mar 17, 2017 08:30 PM');
    });

    it('#formatDate should return formatted date with AM', () => {
      const mockDate = {
        dateTime: '2017-03-18T00:00:00Z',
        day: '2017-03-17',
        time: '00:00:00',
      };
      expect(widget.formatDate(mockDate)).toEqual('Fri, Mar 17, 2017 12:00 AM');
    });
  });

  it('#clearEvents should clear innerHTML', () => {
    widget.clearEvents();
    expect(widget.eventsRoot.innerHTML).toBe('');
  });

  it('#clear should call clearEvents', () => {
    const clearEventsMock = jest.fn();
    const widgetMock = {
      widgetRoot: {
        getElementsByClassName: function() {return[];},
      },
      clearEvents: clearEventsMock,
    };

    widget.clear.call(widgetMock);
    expect(clearEventsMock).toHaveBeenCalledTimes(1);
  });

  it('#update should make request', () => {
    widget.clear = jest.fn();
    widget.makeRequest = jest.fn();
    widget.showMessage = jest.fn();
    widget.initFullWidth = jest.fn();
    widget.update(true);
    expect(widget.widgetRoot.style.height).toBe('600px');
    expect(widget.eventsRootContainer.style.height).toBe('530px');
    expect(widget.eventsRootContainer.style.borderWidth).toBe('0px');
    expect(widget.clear).toHaveBeenCalledTimes(1);
    expect(widget.makeRequest).toHaveBeenCalledTimes(1);
    expect(widget.showMessage).toHaveBeenCalledTimes(0);
  });

  describe('#needToUpdate should be true', () => {
    it('#needToUpdate should be true', () => {
      expect(widget.needToUpdate({'attr1': 1, 'attr2': 1}, '', ['attr1'])).toBeTruthy();
    });

    it('#needToUpdate should be false', () => {
      expect(widget.needToUpdate({'attr1': 1, 'attr2': 1}, {'attr1': 1, 'attr2': 1})).toBeFalsy();
    });
  });

  describe('#loadConfig should be true', () => {
    it('#loadConfig should be true', () => {
      expect(widget.loadConfig({})).toEqual({});
    });

    it('#loadConfig should be {"name": "nameValue"}', () => {
      expect(widget.loadConfig({'attr1': {name: 'w-name', value: 'nameValue'}})).toEqual({'name': 'nameValue'});
    });
  });

  it('#styleLoadingHandler should be true', () => {
    const widgetMock = {
      status: 200,
      readyState: XMLHttpRequest.DONE,
      widget: {
        config: {
          theme: 'mockTheme',
        },
      },
      responseText: 'responseTextMock',
    };

    widget.styleLoadingHandler.call(widgetMock);
    let elem = document.getElementById('widget-theme-mockTheme');
    expect(elem.textContent).toBe('responseTextMock');
  });

  it('#groupEventsByName should define eventsGroups', () => {
    const widgetMock = {
      events: [{'name': 'mockName'}, {'name': 'mockName'}],
    };
    widget.groupEventsByName.call(widgetMock);
    expect(widgetMock.eventsGroups).toEqual([[{'name': 'mockName'}, {'name': 'mockName'}]]);
  });

  it('#initEventCounter should create elem with class events-counter', () => {
    expect(widget.eventsCounter).toBeFalsy();
    widget.widgetRoot = {
      appendChild: () => true,
    };
    widget.initEventCounter();
    expect(widget.eventsCounter.classList).toContain('events-counter');
  });

  describe('#setEventsCounter', () => {
    const updateTransitionMock = jest.fn();
    beforeEach(() => {
      updateTransitionMock.mockReset();
    });
    const widgetMock = {
      eventsGroups: [1, 2, 3],
      currentSlideX: 1,
      currentSlideY: 1,
      eventsCounter: {},
    };

    it('if eventsGroups.length > 1 text should be defined', () => {
      widget.setEventsCounter.call({...widgetMock});
      expect(widgetMock.eventsCounter.innerHTML).toBe('2 of 3 events');
    });

    it('if eventsGroups.length == 1 text should be equal to "1 event"', () => {
      const additionalMockParams = {
        ...widgetMock,
        eventsGroups: [1],
      };
      widget.setEventsCounter.call({...additionalMockParams});
      expect(widgetMock.eventsCounter.innerHTML).toBe('1 event');
    });
  });

  it('#resetReduceParamsOrder should set 0 to this.reduceParamsOrder', () => {
    widget.resetReduceParamsOrder();
    expect(widget.reduceParamsOrder).toBe(0);
  });

  describe('#reduceParamsAndReloadEvents method', () => {
    const showMessageMock = jest.fn();
    const makeRequestMock = jest.fn();
    beforeEach(() => {
      showMessageMock.mockReset();
      makeRequestMock.mockReset();
    });
    const widgetMock = {
      showMessage: showMessageMock,
      eventReqAttrs: [1, 2, 3],
      reduceParamsOrder: 0,
      makeRequest: makeRequestMock,
      hideSliderControls: function() {},
      stopAutoSlideX: function() {},
    };
    it('makeRequest should be called', () => {
      widget.reduceParamsAndReloadEvents.call(widgetMock);
      expect(makeRequestMock).toHaveBeenCalledTimes(1);
    });

    it('showMessage should be called', () => {
      const additionalMockParams = {
        ...widgetMock,
        reduceParamsOrder: 20,
      };
      widget.reduceParamsAndReloadEvents.call(additionalMockParams);
      expect(showMessageMock).toHaveBeenCalledTimes(1);
      expect(showMessageMock).toHaveBeenCalledWith('No results were found.', true);
    });
  });

  /* TODO */
  it('#publishEventsGroup should be defined', () => {
    let group = {
      map: function() {},
    };
    widget.eventsRoot = {
      appendChild: function() {},
    };
    widget.publishEventsGroup(group, 1);
    expect(typeof(widget.publishEventsGroup)).toBe('function');
  });

  it('#publishEvent should add new DOMElement', () => {
    const appendChildMock = jest.fn();
    widget.createDOMItem = jest.fn();
    widget.eventsRoot = {
        appendChild: appendChildMock,
    };
    widget.publishEvent('mockEvent');
    expect(appendChildMock).toHaveBeenCalledTimes(1);
    expect(widget.createDOMItem).toHaveBeenCalledWith('mockEvent');
  });

  it('#getEventByID should return {"id": 1}', () => {
    const widgetMock = {
      events: [{id: 1}, {id: 2}],
    };
    expect(widget.getEventByID.call(widgetMock, 1)).toEqual({'id': 1});
  });

  it('#getImageForEvent should return the first img', () => {
    const images = [
      {width: '100', height: '200', url: 'img-01.bmp'},
      {width: '400', height: '300', url: 'img-02.bmp'},
      {width: '50', height: '50', url: 'img-03.bmp'},
      {width: '10', height: '10', url: 'img-04.bmp'},
    ];
    const widgetMock = {
      config: {
        width: 100,
      },
      widgetContentHeight: 200,
    };
    expect(widget.getImageForEvent.call(widgetMock, images)).toBe('img-01.bmp');
  });

  it('#initPretendedLink should return element', () => {
    const el = {
        setAttribute: ()=> true,
        getAttribute: ()=> false,
        classList: {add: ()=> true},
        addEventListener: (event, fn) => {},
      },
      url = 'img-01.bmp',
      isBlank = true;
    expect(widget.initPretendedLink(el, url, isBlank)).toBe(el);
  });


  it('#makeImageUrl should be url', () => {
    expect(widget.makeImageUrl('test')).toBe('https://app.ticketmaster.com/discovery-widgets/v2/events/test/images.json');
  });

	/* TODO */
	it('#getDateFromPeriod should be defined', () => {
		let period = new Date();
		widget.getDateFromPeriod(period);
		period = 'week';
		widget.getDateFromPeriod(period);
		expect(typeof(widget.getDateFromPeriod)).toBe('function');
	});

	/* TODO */
  it('#createDOMItem should be defined', () => {
    let evt = JSON.parse('{"id":"LvZ184X-QKyIveZvudILo","url":"https://www.universe.com/events/2017-2018-subscription-tickets-F39HZP?ref=ticketmaster","name":"2017/2018 Subscription","date":{"day":"2016-09-25","time":"18:15:00"},"img":"https://s1.ticketm.net/dam/c/8cf/a6653880-7899-4f67-8067-1f95f4d158cf_124761_TABLET_LANDSCAPE_16_9.jpg"}');
    widget.createDOMItem(evt, widget.widgetRoot);
    expect(typeof(widget.createDOMItem)).toBe('function');
    document.querySelector('[w-type="calendar"]').removeAttribute('w-titlelink');
    evt = JSON.parse('{"id":"LvZ184X-QKyIveZvudILo","url":"https://www.universe.com/events/2017-2018-subscription-tickets-F39HZP?ref=ticketmaster","name":"2017/2018 Subscription","address":{"name":"Avenue 5", "line1":"one" ,"line2": "two"},"categories":["music", "games"],"date":{"day":"2016-09-25","time":"18:15:00"},"img":"https://s1.ticketm.net/dam/c/8cf/a6653880-7899-4f67-8067-1f95f4d158cf_124761_TABLET_LANDSCAPE_16_9.jpg"}');
    widget.createDOMItem(evt, widget.widgetRoot);
    evt = JSON.parse('{"id":"LvZ184X-QKyIveZvudILo","url":"https://www.universe.com/events/2017-2018-subscription-tickets-F39HZP?ref=ticketmaster","address":"","name":"2017/2018 Subscription","date":{"day":"2016-09-25","time":"18:15:00"},"img":"https://s1.ticketm.net/dam/c/8cf/a6653880-7899-4f67-8067-1f95f4d158cf_124761_TABLET_LANDSCAPE_16_9.jpg"}');
    widget.createDOMItem(evt, widget.widgetRoot);
  });

	/* Selector Controls [START] */
	/* TODO */
	it('selectorContorls #selActiveTab should be BeDefined', function() {
		let selCont = document.body.querySelector('.selector-content');
		let selTitl = document.body.querySelector('.selector-title');
		$(selCont).click();
		$(selCont).removeClass('selector-content').click();
		$(selTitl).click();
		$(selTitl).addClass('open');
		$(selTitl).click();
		$(selCont).addClass('show');
		$(selCont).click();
		$(selCont).blur();
	});
	/* Selector Controls [END] */
});
