jest.mock('products-and-docs/widgets/helpers/widgets-analytics.js');

import TicketmasterCountdownWidget from 'products-and-docs/widgets/countdown/1.0.0/src/classes/TicketmasterCountdownWidget.js';
import eventUrlCountdownClock from 'products-and-docs/widgets/countdown/1.0.0/src/classes/CountdownClock.js';

describe('CDWidget', () => {
	let widget,
    widgetClock,
    $countDown;
	let setFixture = () => {
		document.body.innerHTML = '<div w-type="countdown"></div>';
	};
	beforeAll(() => {
		window.__VERSION__ = 'mockedVersion';
	});

	beforeEach(() => {
    setFixture();
    $countDown = document.querySelector('div[w-type="countdown"]');
    widget = new TicketmasterCountdownWidget($countDown);
    widgetClock = new eventUrlCountdownClock($countDown);
	});

	/* CountdownClock */

  describe('getters and setters', () => {
    it('#endTime should be 2018', () => {
      widgetClock.endTime = 2018;
      expect(widgetClock.endTime).toBe(2018);
    });

    it('#interval should be 100', () => {
      widgetClock.interval = 100;
      expect(widgetClock.interval).toBe(100);
    });

    it('#onChange should be func', () => {
      widgetClock.onChange = 'func';
      expect(widgetClock.onChange).toBe('func');
    });
  });

  it('#initInterval should define timeInterval', () => {
    widgetClock.initInterval();
    expect(widgetClock.timeinterval).toBe(14);
  });

  it('#update should define endTime', () => {
    widgetClock.updateClock = jest.fn();
    widgetClock.initInterval = jest.fn();
    widgetClock.update(2020);
    expect(widgetClock.endTime).toBe(2020);
    expect(widgetClock.updateClock).toHaveBeenCalledTimes(1);
    expect(widgetClock.initInterval).toHaveBeenCalledTimes(1);
  });

  it('#updateClock should define onChange function', () => {
    widgetClock.getTimeRemaining = jest.fn(() => ({total: 1}));
    widgetClock.onChange = jest.fn();
    widgetClock.timeinterval = 1;
    widgetClock.updateClock();
    expect(widgetClock.onChange).toHaveBeenCalledWith({total: 1});
  });

  it('#getTimeRemaining should return object with 0 value', () => {
    const res = {'total': 0, 'monthLeft': 0, 'days': 0, 'hours': 0, 'minutes': 0, 'seconds': 0};
    expect(widgetClock.getTimeRemaining()).toEqual(res);
  });

  /* CountDownWidget */

  describe('getters and setters', () => {
    it('#event should be false if widget.event.id is falsy', () => {
      widget.event = {};
      expect(widget.event).toBe(false);
    });

    it('#borderSize should return border from config', () => {
      widget.config.border = 10;
      expect(widget.borderSize).toBe(10);
    });

    it('#eventUrl should be "http://www.ticketmaster.com/event/"', () => {
      expect(widget.eventUrl).toBe('http://www.ticketmaster.com/event/');
    });

    describe('#apiUrl', () => {
      it('#apiUrl should be "https://app.ticketmaster.com/discovery-widgets/v2/events/1"', () => {
        widget.config.id = 1;
        expect(widget.apiUrl).toBe('https://app.ticketmaster.com/discovery-widgets/v2/events/1');
      });

      it('#apiUrl should be "https://app.ticketmaster.com/discovery-widgets/v2/events/2"', () => {
        widget.eventId = 2;
        expect(widget.apiUrl).toBe('https://app.ticketmaster.com/discovery-widgets/v2/events/2');
      });
    });

    describe('#themeUrl', () => {
      it('#themeUrl should be "https://ticketmaster-api-staging.github.io/products-and-docs/widgets/countdown/1.0.0/theme/"', () => {
        expect(widget.themeUrl).toBe('https://ticketmaster-api-staging.github.io/products-and-docs/widgets/countdown/1.0.0/theme/');
      });

      it('#themeUrl should be "https://developer.ticketmaster.com/products-and-docs/widgets/countdown/1.0.0/theme/"', () => {
        Object.defineProperty(window.location, 'host', {
          writable: true,
          value: 'developer.ticketmaster.com',
        });
        expect(widget.themeUrl).toBe('https://developer.ticketmaster.com/products-and-docs/widgets/countdown/1.0.0/theme/');
      });
    });

    it('#isFullWidth should be true', () => {
      widget.config.proportion = 'fullwidth';
      expect(widget.isFullWidth).toBeTruthy();
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

    it('#logoUrl should be "https://www.ticketmaster.com/"', () => {
      expect(widget.logoUrl).toBe('https://www.ticketmaster.com/');
    });

    it('#legalNoticeUrl should be "http://developer.ticketmaster.com/support/terms-of-use/"', () => {
      expect(widget.legalNoticeUrl).toBe('http://developer.ticketmaster.com/support/terms-of-use/');
    });

    it('#widgetVersion should be ${__VERSION__}', () => {
      expect(widget.widgetVersion).toBe(`${__VERSION__}`);
    });

    it('#questionUrl should be "http://developer.ticketmaster.com/support/faq/"', () => {
      expect(widget.questionUrl).toBe('http://developer.ticketmaster.com/support/faq/');
    });

    it('#updateExceptions should contain width in array', () => {
      expect(widget.updateExceptions).toContain('width');
    });

    it('#hideMessageDelay should be 5000', () => {
      expect(widget.hideMessageDelay).toBe(5000);
    });

    it('#tmWidgetWhiteList should contain 2200504BAD4C848F in array', () => {
      expect(widget.tmWidgetWhiteList).toContain('2200504BAD4C848F');
    });

    it('#eventReqAttrs should define apikey', () => {
      widget.widgetConfig = {
        tmapikey: 'test',
      };
      expect(widget.isConfigAttrExistAndNotEmpty('tmapikey')).toBe(true);
      expect(widget.isConfigAttrExistAndNotEmpty('venueid')).toBe(false);
      expect(widget.eventReqAttrs).toEqual({'apikey': 'test'});
    });
  });

  describe('#isConfigAttrExistAndNotEmpty', () => {
    it('#isConfigAttrExistAndNotEmpty should be true for id', () => {
      widget.config.id = 'someID';
      expect(widget.isConfigAttrExistAndNotEmpty('id')).toBe(true);
    });

    it('#isConfigAttrExistAndNotEmpty should be false for id', () => {
      widget.config.id = '';
      expect(widget.isConfigAttrExistAndNotEmpty('id')).toBe(false);
    });
  });

  describe('#getNormalizedDateValue', () => {
    it('#getNormalizedDateValue should be 10', () => {
      expect(widget.getNormalizedDateValue(10)).toBe('10');
    });

    it('#getNormalizedDateValue should be 02', () => {
      expect(widget.getNormalizedDateValue(2)).toBe('02');
    });
  });

  /* TODO does not work */
  describe('#toggleSecondsVisibility', () => {
    const addMock = jest.fn();
    const removeMock = jest.fn();
    beforeEach(() => {
      widget.countDownWrapper = {
        classList: {
          add: addMock,
          remove: removeMock,
        },
      };
      removeMock.mockReset();
      addMock.mockReset();
    });

    it('#toggleSecondsVisibility should add class hide-seconds and remove two classes', () => {
      widget.countDownMonth.innerHTML = 2;

      widget.toggleSecondsVisibility();
      expect(addMock).toHaveBeenCalledWith('hide-seconds');
      expect(removeMock).toHaveBeenCalledTimes(2);
      expect(removeMock).toHaveBeenCalledWith('hide-month');
      expect(removeMock).toHaveBeenCalledWith('hide-days');
    });

    it('#toggleSecondsVisibility should  remove class hide-seconds and add two classes', () => {
      widget.countDownMonth.innerHTML = 0;
      widget.countDownDays.innerHTML = 0;

      widget.toggleSecondsVisibility();
      expect(removeMock).toHaveBeenCalledWith('hide-seconds');
      expect(addMock).toHaveBeenCalledTimes(2);
      expect(addMock).toHaveBeenCalledWith('hide-month');
      expect(addMock).toHaveBeenCalledWith('hide-days');
    });

    it('#toggleSecondsVisibility should add class hide-month and remove two classes', () => {
      widget.countDownMonth.innerHTML = 0;
      widget.countDownDays.innerHTML = 1;

      widget.toggleSecondsVisibility();
      expect(addMock).toHaveBeenCalledWith('hide-month');
      expect(removeMock).toHaveBeenCalledTimes(2);
      expect(removeMock).toHaveBeenCalledWith('hide-days');
      expect(removeMock).toHaveBeenCalledWith('hide-seconds');
    });
  });

  it('#showStatusMessage should show event status message', () => {
    widget.showMessage = jest.fn();
    widget.eventResponce = {
      date: {
        dateTime: 'Tue Apr 11 2017 15:48:06 GMT+0300 (FLE Daylight Time)',
        dateTimeEnd: 'Tue Apr 11 2099 15:48:06 GMT+0300 (FLE Daylight Time)',
      },
    };
    widget.showStatusMessage();
    expect(widget.showMessage).toHaveBeenCalledWith('Event is in progress', false, 'event-message-started');

    widget.eventResponce = {
      date: {
        dateTime: 'not valid',
        dateTimeEnd: 'not valid',
      },
    };
    widget.showStatusMessage();
    expect(widget.showMessage).toHaveBeenCalledWith('This event has taken place', false, 'event-message-started');
  });

  describe('#onCountdownChange', () => {
    const getNormalizedDateValueMock = jest.fn(() => 0);
    const addMock = jest.fn();
    const removeMock = jest.fn();
    const showStatusMessageMock = jest.fn();
    let widgetMock = {
      getNormalizedDateValue: getNormalizedDateValueMock,
      countDownWrapper: {
        classList: {
          add: addMock,
          remove: removeMock,
        },
      },
      eventId: 10,
      event: {
        date: {},
      },
      showStatusMessage: showStatusMessageMock,
    };

    beforeEach(() => {
      removeMock.mockReset();
      addMock.mockReset();
      showStatusMessageMock.mockReset();
    });

    it('#onCountdownChange should return false if event has taken place', () => {
      expect(widget.onCountdownChange.call(widgetMock, {})).toBe(false);
      expect(addMock).toHaveBeenCalledTimes(1);
    });

    it('#onCountdownChange should return false and remove class .hide-countDownBox', () => {
      const getNormalizedDateValueMock = jest.fn(() => 1);
      const showMessageMock = jest.fn();
      const additionalMockParams = {
        ...widgetMock,
        showMessage: showMessageMock,
        getNormalizedDateValue: getNormalizedDateValueMock,
      };
      const arg = {
        monthLeft: 100,
        days: 1,
        hours: 2,
      };

      widget.onCountdownChange.call(additionalMockParams, arg);
      expect(removeMock).toHaveBeenCalledTimes(1);
      expect(widget.onCountdownChange.call(additionalMockParams, arg)).toBeFalsy();
    });

    it('#onCountdownChange should add innerHTML', () => {
      widget.getNormalizedDateValue = jest.fn(() => 1);
      widget.toggleSecondsVisibility = jest.fn();
      const arg = {
        monthLeft: 1,
        days: 1,
        hours: 2,
        minutes: 25,
        seconds: 15,
      };
      widget.onCountdownChange(arg);
      expect(widget.getNormalizedDateValue).toHaveBeenCalledTimes(6);
      expect(widget.toggleSecondsVisibility).toHaveBeenCalledTimes(1);
    });
  });

  /* TODO */
  it('#buildCountdown should create element', () => {
    const addMock = jest.fn();
    const appendChildMock = jest.fn();
    const widgetMock = {
      eventsRootContainer: {
        appendChild: appendChildMock,
      },
      countDownWrapper: {
        appendChild: appendChildMock,
      },
      countDownMonth: {
        classList: {
          add: addMock,
        },
      },
      countDownDays: {
        classList: {
          add: addMock,
        },
      },
      countDownHours: {
        classList: {
          add: addMock,
        },
      },
      countDownMinute: {
        classList: {
          add: addMock,
        },
      },
      countDownSecond: {
        classList: {
          add: addMock,
        },
      },
    };

    widget.buildCountdown.call(widgetMock);
    expect(appendChildMock).toHaveBeenCalledTimes(1);
  });

  it('#updateTransition should manage class appear', () => {
    widget.clearEvents = () => this.eventsRoot.innerHTML = '';
    let elem = document.querySelector('.event-logo.centered-logo');
    widget.updateTransition('url');
    expect(elem.classList).toContain('event-logo');
    widget.updateTransition('');
    expect(elem.classList).toContain('centered-logo');
    expect(widget.updateTransition(false)).toBe(undefined);
  });

  describe('#setBuyBtnUrl', () => {
    const updateTransitionMock = jest.fn();
    beforeEach(() => {
      updateTransitionMock.mockReset();
    });
    const widgetMock = {
      buyBtn: {},
      event: {
        url: 'https://www.universe.com',
      },
      isUniversePluginInitialized: true,
      isUniverseUrl: function() {return true;},
      updateTransition: updateTransitionMock,
    };

    it('should call updateTransition with url', () => {
      widget.setBuyBtnUrl.call(widgetMock);
      expect(updateTransitionMock).toHaveBeenCalledTimes(1);
      expect(updateTransitionMock).toHaveBeenCalledWith('https://www.universe.com');
      expect(widgetMock.buyBtn.href).toEqual('https://www.universe.com');
    });

    it('this.buyBtn.href should be empty', () => {
      const additionalMockParams = {
        ...widgetMock,
        event: {},
      };
      widget.setBuyBtnUrl.call(additionalMockParams);
      expect(widgetMock.buyBtn.href).toEqual('');
    });
  });

  it('#isUniverseUrl should match to regexp', () => {
    expect(widget.isUniverseUrl('universe.com')[0]).toBe('universe.com');
    expect(widget.isUniverseUrl('uniiverse.com')[0]).toBe('uniiverse.com');
  });

  it('#embedUniversePlugin should create elem', () => {
    widget.embedUniversePlugin();
    let elem = document.getElementById('id_universe_widget');
    expect(elem.src).toBe('https://www.universe.com/embed.js');
    expect(widget.isUniversePluginInitialized).toBe(true);
  });

  describe('#showMessage', () => {
    const addMock = jest.fn();
    const removeMock = jest.fn();
    beforeEach(() => {
      addMock.mockReset();
      removeMock.mockReset();
    });
    const widgetMock = {
      hideMessageWithoutDelay: {},
      messageContent: {},
      messageDialog: {
        className: null,
        classList: {
          add: addMock,
          remove: removeMock,
        },
      },
    };

    it('should add new classes', () => {
      widget.showMessage.call(widgetMock, 'message', true, 'className');
      expect(addMock).toHaveBeenCalledTimes(3);
      expect(widgetMock.hideMessageWithoutDelay).toEqual(true);
      expect(widgetMock.messageContent.innerHTML).toEqual('message');
      expect(widgetMock.messageDialog.className).toEqual('');
    });

    it('should remove class', () => {
      widget.showMessage.call(widgetMock, '');
      expect(addMock).toHaveBeenCalledTimes(1);
      expect(removeMock).toHaveBeenCalledTimes(1);
      expect(addMock).toHaveBeenCalledWith('event-message-visible');
      expect(removeMock).toHaveBeenCalledWith(undefined);
    });
  });

  it('#hideMessage should remove class', () => {
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

    widget.hideMessage.call(widgetMock);
    expect(removeMock).toHaveBeenCalledTimes(1);
    expect(removeMock).toHaveBeenCalledWith('event-message-visible');
  });

  describe('#formatDate', () => {
    it('#formatDate should return empty string', () => {
      let noneResult = widget.formatDate('date');
      expect(noneResult).toBe('');
    });

    it('#formatDate should return date without time', () => {
      let noneTimeResult = widget.formatDate({day: '2017-03-17'});
      expect(noneTimeResult).toEqual('Fri, Mar 17, 2017');
    });

    it('#formatDate should return formatted date with PM', () => {
      let mockDate = {
        dateTime: '2017-03-18T00:30:00Z',
        day: '2017-03-17',
        time: '20:30:00',
      };
      let okResult = widget.formatDate(mockDate);
      expect(okResult).toEqual('Fri, Mar 17, 2017 08:30 PM');
    });

    it('#formatDate should return formatted date with AM', () => {
      let mockDate = {
        dateTime: '2017-03-18T00:30:00Z',
        day: '2017-03-17',
        time: '00:30:00',
      };
      let okResult = widget.formatDate(mockDate);
      expect(okResult).toEqual('Fri, Mar 17, 2017 12:30 AM');
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
        getElementsByClassName: () => [],
      },
      clearEvents: clearEventsMock,
    };

    widget.clear.call(widgetMock);
    expect(clearEventsMock).toHaveBeenCalledTimes(1);
  });

  it('#update should set style and make request', () => {
    widget.clear = jest.fn();
    widget.makeRequest = jest.fn();
    widget.showMessage = jest.fn();
    widget.initFullWidth = jest.fn();
    widget.update(true);
    expect(widget.widgetRoot.style.height).toBe('700px');
    expect(widget.eventsRootContainer.style.height).toBe('700px');
    expect(widget.eventsRootContainer.style.borderWidth).toBe('0px');
    expect(widget.clear).toHaveBeenCalledTimes(1);
    expect(widget.makeRequest).toHaveBeenCalledTimes(1);
    expect(widget.showMessage).toHaveBeenCalledTimes(1);
  });

  describe('#needToUpdate', () => {
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

  describe('#onEventLoadError', () => {
    const changeDefaultIdMock = jest.fn();
    const showMessageMock = jest.fn();

    beforeEach(() => {
      changeDefaultIdMock.mockReset();
      showMessageMock.mockReset();
    });

    const widgetMock = {
      event: true,
      changeDefaultId: changeDefaultIdMock,
      showMessage: showMessageMock,
    };

    it('#onEventLoadError should call changeDefaultId', () => {
      widget.onEventLoadError.call(widgetMock, '');
      expect(widgetMock.event).toBe(false);
      expect(showMessageMock).toHaveBeenCalledTimes(1);
      expect(changeDefaultIdMock).toHaveBeenCalledTimes(1);
    });

    it('#onEventLoadError should not call changeDefaultId', () => {
      widget.onEventLoadError.call(widgetMock, '', true);
      expect(widgetMock.event).toBe(false);
      expect(showMessageMock).toHaveBeenCalledTimes(1);
      expect(changeDefaultIdMock).toHaveBeenCalledTimes(0);
    });
  });

  describe('#eventsLoadingHandler', () => {
    const clearEventsMock = jest.fn();
    const publishEventMock = jest.fn();
    const hideMessageMock = jest.fn();
    const onEventLoadErrorMock = jest.fn();
    const updateMock = jest.fn();
    const setBuyBtnUrlMock = jest.fn();

    beforeEach(() => {
      clearEventsMock.mockReset();
      publishEventMock.mockReset();
      hideMessageMock.mockReset();
      onEventLoadErrorMock.mockReset();
      updateMock.mockReset();
      setBuyBtnUrlMock.mockReset();
    });

    const responseTxt = [{name: '1'}, {name: '2'}];
    const widgetMock = {
      readyState: XMLHttpRequest.DONE,
      status: 200,
      responseText: JSON.stringify(responseTxt),
      widget: {
        clearEvents: clearEventsMock,
        publishEvent: publishEventMock,
        hideMessage: hideMessageMock,
        onEventLoadError: onEventLoadErrorMock,
        countdownClock: {
          update: updateMock,
        },
        setBuyBtnUrl: setBuyBtnUrlMock,
      },
    };

    it('should call publishEvent and hideMessage', () => {
      widget.eventsLoadingHandler.call(widgetMock);
      expect(clearEventsMock).toHaveBeenCalledTimes(1);
      expect(publishEventMock).toHaveBeenCalledTimes(1);
      expect(hideMessageMock).toHaveBeenCalledTimes(1);
      expect(setBuyBtnUrlMock).toHaveBeenCalledTimes(1);
      expect(publishEventMock).toHaveBeenCalledWith([{name: '1'}, {name: '2'}]);
    });

    it('should call onEventLoadError with status 400', () => {
      let additionalMockParams = {
        ...widgetMock,
        status: 400,
      };
      widget.eventsLoadingHandler.call(additionalMockParams);
      expect(onEventLoadErrorMock).toHaveBeenCalledTimes(1);
      expect(onEventLoadErrorMock).toHaveBeenCalledWith(400);
    });

    it('should call onEventLoadError with status null', () => {
      let additionalMockParams = {
        ...widgetMock,
        status: null,
      };
      widget.eventsLoadingHandler.call(additionalMockParams);
      expect(onEventLoadErrorMock).toHaveBeenCalledTimes(1);
      expect(onEventLoadErrorMock).toHaveBeenCalledWith(null);
    });
  });

  it('#publishEvent should add new DOMElement', () => {
    const appendChildMock = jest.fn();
    const createDOMItemMock = jest.fn();
    const widgetMock = {
      eventsRoot: {
        appendChild: appendChildMock,
      },
      createDOMItem: createDOMItemMock,
    };
    widget.publishEvent.call(widgetMock, 'mockEvent');
    expect(appendChildMock).toHaveBeenCalledTimes(1);
    expect(createDOMItemMock).toHaveBeenCalledTimes(1);
    expect(createDOMItemMock).toHaveBeenCalledWith('mockEvent');
  });

  describe('#getImageForEvent', () => {
    const images = [
      {width: '100', height: '200', url: 'img-01.bmp'},
      {width: '400', height: '300', url: 'img-02.bmp'},
      {width: '50', height: '50', url: 'img-03.bmp'},
      {width: '10', height: '10', url: 'img-04.bmp'},
    ];
    it('#getImageForEvent should return the first img', () => {
      widget.config.width = '100';
      widget.config.height = '200';
      expect(widget.getImageForEvent(images)).toBe('img-01.bmp');
    });

    it('#getImageForEvent should return the second smallest img', () => {
      widget.config.width = '100%';
      expect(widget.getImageForEvent(images)).toBe('img-03.bmp');
      expect(widget.config.width).toBe('100%');
    });
  });

  describe('#parseEvent', () => {
    let eventSet = {
      id: '1',
      url: 'https://developer.ticketmaster.com',
      name: 'mockName',
      address: {name: ''},
      images: [
        {width: '100', height: '200', url: 'img-01.bmp'},
        {width: '400', height: '300', url: 'img-02.bmp'},
        {width: '50', height: '50', url: 'img-03.bmp'},
        {width: '10', height: '10', url: 'img-04.bmp'},
      ],
      dates: {
        start: {
          localDate: '23.09.83',
          localTime: '12:00',
          dateTime: '11:00',
        },
        end: {
          localDate: '23.09.99',
          localTime: '19:00',
          dateTime: '18:00',
        },
      },
      _embedded: {
        venues: [
          {
            name: 'one address',
          },
        ],
      },
    };
    it('#parseEvent should return currentEvent', () => {
      let result = {
        address: {'name': 'one address'},
        date: {
          'dateTime': '11:00',
          'dateTimeEnd': '18:00',
          'day': '23.09.83',
          'dayEnd': '23.09.99',
          'time': '12:00',
          'timeEnd': '19:00',
        },
        id: '1',
        img: 'img-03.bmp',
        name: 'mockName',
        url: 'https://developer.ticketmaster.com',
      };
      expect(widget.parseEvent(eventSet)).toEqual(result);
    });

    it('#parseEvent should return currentEvent without venues name', () => {
      let result = {
        id: '1',
        url: 'https://developer.ticketmaster.com',
        name: 'mockName',
        date: {
          day: '23.09.83',
          time: '12:00',
          dateTime: '11:00',
          dayEnd: '23.09.99',
          timeEnd: '19:00',
          dateTimeEnd: '18:00',
        },
        address: 'one address',
        img: 'img-03.bmp',
      };
      eventSet._embedded.venues[0] = {address: 'one address'};
      expect(widget.parseEvent(eventSet)).toEqual(result);
    });
  });

  it('#changeDefaultId should call makeRequest with new ID', () => {
    widget.makeRequest = jest.fn();
    widget.changeDefaultId();
    expect(widget.makeRequest).toHaveBeenCalledTimes(1);
  });

  describe('#changeDefaultIdHandler', () => {
    Date.prototype.addDays = function(days) {
      this.setDate(this.getDate() + parseInt(days));
      return this;
    };

    const clearEventsMock = jest.fn();
    const makeRequestMock = jest.fn();
    const onEventLoadErrorMock = jest.fn();
    const updateMock = jest.fn();
    const setBuyBtnUrlMock = jest.fn();

    beforeEach(() => {
      clearEventsMock.mockReset();
      makeRequestMock.mockReset();
      onEventLoadErrorMock.mockReset();
      updateMock.mockReset();
      setBuyBtnUrlMock.mockReset();
    });

    const responseTxt = {
      _embedded: {
        events: {
          dates: {
            start: {
              dateTime: new Date().addDays(40),
            },
          },
        },
      },
    };

    const widgetMock = {
      readyState: XMLHttpRequest.DONE,
      status: 200,
      responseText: JSON.stringify(responseTxt),
      widget: {
        clearEvents: clearEventsMock,
        onEventLoadError: onEventLoadErrorMock,
        countdownClock: {
          update: updateMock,
        },
        setBuyBtnUrl: setBuyBtnUrlMock,
        makeRequest: makeRequestMock,
      },
    };

    it('should make request ', () => {
      widget.changeDefaultIdHandler.call(widgetMock);
      expect(clearEventsMock).toHaveBeenCalledTimes(1);
      expect(setBuyBtnUrlMock).toHaveBeenCalledTimes(1);
      expect(makeRequestMock).toHaveBeenCalledTimes(1);
    });

    it('should call onEventLoadError with status 400', () => {
      let additionalMockParams = {
        ...widgetMock,
        status: 400,
      };
      widget.changeDefaultIdHandler.call(additionalMockParams);
      expect(onEventLoadErrorMock).toHaveBeenCalledTimes(1);
      expect(onEventLoadErrorMock).toHaveBeenCalledWith(400, true);
    });

    it('should call onEventLoadError with status null', () => {
      let additionalMockParams = {
        ...widgetMock,
        status: null,
      };
      widget.changeDefaultIdHandler.call(additionalMockParams);
      expect(onEventLoadErrorMock).toHaveBeenCalledTimes(1);
      expect(onEventLoadErrorMock).toHaveBeenCalledWith(null, true);
    });
  });

	it('#initPretendedLink should return element', () => {
		const el = {
				setAttribute: ()=>{ true;},
				getAttribute: ()=>{ false;},
				classList: {add: ()=>{ true;}},
				addEventListener: (event, fn)=>{},
			},
			url = 'img-01.bmp',
			isBlank = true;
		expect(widget.initPretendedLink(el, url, isBlank)).toBe(el);
	});

	it('#initFullWidth should return set width=100%', () => {
		const config = {
				width: '100%',
				height: 700,
			},
			widgetRoot ={
				style: {
					width: '100%',
					height: '700px',
					display: 'block',
				},
			},
			eventsRootContainer ={
				style: {
					width: '100%',
					height: '700px',
				},
			};

		widget.widgetContentHeight = 700;
		widget.initFullWidth();
		expect(widget.config.width).toBe(config.width);
		expect(widget.config.height ).toBe(config.height );
		expect(widget.widgetRoot.style.width).toBe(widgetRoot.style.width);
		expect(widget.widgetRoot.style.height).toBe(widgetRoot.style.height);
		expect(widget.widgetRoot.style.display).toBe(widgetRoot.style.display);
		expect(widget.eventsRootContainer.style.width ).toBe(eventsRootContainer.style.width);
		expect(widget.eventsRootContainer.style.height ).toBe(eventsRootContainer.style.height);
	});

	it('#createDOMItem should create element', () => {
		const itemConfig = {
      name: 'some mock text',
      address: {
        name: 'vinnica',
        line1: '700',
        line2: '700',
      },
      date: 'Wed Oct 23 2013 00:00:00 GMT+0300 (FLE Daylight Time)',
      categories: ['boo', 'foo'],
    };
		const domElement = widget.createDOMItem(itemConfig);

		expect(domElement.localName).toEqual('li');
		expect(domElement.children[0].nodeName).toEqual('SPAN');
		expect(domElement.children[0].className).toEqual('bg-cover');
		expect(domElement.children[1].className).toEqual('event-content-wraper');
		expect(domElement.children[1].children.length).toEqual(4);
		expect(domElement.children[1].children[0].localName).toEqual('span');
		expect(domElement.children[1].children[0].className).toContain('event-name');
		expect(domElement.children[1].children[0].textContent).toEqual('some mock text');
		expect(domElement.children[1].children[1].className).toContain('event-date-wraper');
		expect(domElement.children[1].children[2].className).toContain('address-wrapper');
		expect(domElement.children[1].children[3].className).toContain('category-wrapper');
	});
});
