jest.mock('products-and-docs/widgets/helpers/widgets-analytics.js');

describe('MapWidget', () => {
  let widget,
    module;
  let setFixture = () => {
    document.body.innerHTML = '<head></head><div w-type="map" w-latlong=","></div>';
  };

  beforeAll(() => {
    window.__VERSION__ = 'mockedVersion';
    setFixture();
    module = require('products-and-docs/widgets/map/1.0.0/src/main-widget.es6');
    global.apiKeyService = {
      checkApiKeyCookie: () => true,
      getApiWidgetsKey: () => true,
    };
  });

  beforeEach(() => {
    setFixture();
    widget = new module.TicketmasterMapWidget(document.querySelector('div[w-type="map"]'));
  });

  describe('getters and setters', () => {
    it('#events should be empty array when widget.events._embedded is falsy', () => {
      widget.events = {};
      expect(widget.events).toEqual([]);
    });

    it('#isSimpleProportionM should be False when widget.config.proportion === m', () => {
      expect(widget.isSimpleProportionM).toBe(false);
    });

    it('#eventUrl should be "https://www.ticketmaster.com/event/"', () => {
      expect(widget.eventUrl).toBe('https://www.ticketmaster.com/event/');
    });

    it('#updateExceptions should be array and contain elem width', () => {
      expect(widget.updateExceptions).toContain('width');
    });

    it('#controlHiddenClass should be events_control-hidden', () => {
      expect(widget.controlHiddenClass).toBe('events_control-hidden');
    });

    it('widget #countriesWhiteList should be array and contain France', () => {
      expect(widget.countriesWhiteList).toContain('France');
    });

    describe('#themeUrl', () => {
      it('#themeUrl should be "https://ticketmaster-api-staging.github.io/products-and-docs/widgets/map/1.0.0/theme/"', () => {
        expect(widget.themeUrl).toBe('https://ticketmaster-api-staging.github.io/products-and-docs/widgets/map/1.0.0/theme/');
      });

      it('#themeUrl should be "https://developer.ticketmaster.com/products-and-docs/widgets/map/1.0.0/theme/"', () => {
        Object.defineProperty(window.location, 'host', {
          writable: true,
          value: 'developer.ticketmaster.com',
        });
        expect(widget.themeUrl).toBe('https://developer.ticketmaster.com/products-and-docs/widgets/map/1.0.0/theme/');
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

    it('#geocodeUrl should be "https://maps.googleapis.com/maps/api/geocode/json"', () => {
      expect(widget.geocodeUrl).toBe('https://maps.googleapis.com/maps/api/geocode/json');
    });

    it('#hideMessageDelay should be 5000', () => {
      expect(widget.hideMessageDelay).toBe(5000);
    });
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

  describe('#eventReqAttrs', () => {
    it('#eventReqAttrs should return result with apiKeyService.checkApiKeyCookie', () => {
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
      const result = {'apikey': true, 'postalCode': 90015, 'postalcode': 90015, 'startDateTime': 10, 'endDateTime': 12};
      expect(widget.isConfigAttrExistAndNotEmpty('latlong')).toBe(true);
      expect(widget.isConfigAttrExistAndNotEmpty('venueid')).toBe(false);
      expect(widget.eventReqAttrs).toEqual(result);
    });

    it('#eventReqAttrs should return result with apiKeyService.getApiWidgetsKey', () => {
      apiKeyService.checkApiKeyCookie = () => false;
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
      const result = {'apikey': true, 'postalCode': 90015, 'postalcode': 90015, 'startDateTime': 10, 'endDateTime': 12};
      expect(widget.isConfigAttrExistAndNotEmpty('latlong')).toBe(true);
      expect(widget.isConfigAttrExistAndNotEmpty('venueid')).toBe(false);
      expect(widget.eventReqAttrs).toEqual(result);
    });
  });

  describe('#getCoordinates', () => {
    it('#getCoordinates should call cb(widget.config.postalcode)', () => {
      let cb = jest.fn();
      widget.widgetConfig = {
        postalcode: '90015',
      };
      widget.getCoordinates(cb);
      expect(cb).toHaveBeenCalledWith('90015');
    });

    it('#getCoordinates should call cb(widget.config.latlong)', () => {
      let cb = jest.fn();
      expect(widget.config.postalcode).toBeFalsy();
      widget.onLoadCoordinate = function() {
        return true;
      };
      widget.getCoordinates(cb);
      expect(cb).toHaveBeenCalledWith('');
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

  it('#useGeolocation should call addEventListener twice', () => {
    const addEventListenerMock = jest.fn();
    document.getElementsByClassName('near-me-btn')[0].addEventListener = addEventListenerMock;
    widget.useGeolocation();
    expect(addEventListenerMock).toHaveBeenCalledTimes(2);
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
    widget.clearEvents = clearEventsMock;
    widget.clear();
    expect(clearEventsMock).toHaveBeenCalledTimes(1);
  });

  it('#update should set style and make request', () => {
    widget.clear = jest.fn();
    widget.makeRequest = jest.fn();
    widget.showMessage = jest.fn();
    widget.initFullWidth = jest.fn();

    widget.update();
    expect(widget.widgetHeight).toBe(600);
    expect(widget.widgetRoot.style.height).toBe('600px');
    expect(widget.eventsRootContainer.style.height).toBe('600px');
    expect(widget.eventsRootContainer.style.borderWidth).toBe('0px');
    expect(widget.clear).toHaveBeenCalledTimes(1);
    expect(widget.makeRequest).toHaveBeenCalledTimes(1);
  });

  describe('#needToUpdate', () => {
    it('#needToUpdate should be true because newTheme and oldTheme are different', () => {
      expect(widget.needToUpdate({'attr1': 1, 'attr2': 1}, '', ['attr1'])).toBeTruthy();
    });

    it('#needToUpdate should be false because newTheme and oldTheme are the same', () => {
      expect(widget.needToUpdate({'attr1': 1, 'attr2': 1}, {'attr1': 1, 'attr2': 1})).toBeFalsy();
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
      hideSliderControls: function() {
      },
      stopAutoSlideX: function() {
      },
    };
    it('makeRequest should be called', () => {
      widget.reduceParamsAndReloadEvents.call(widgetMock);
      expect(showMessageMock).toHaveBeenCalledWith('No results were found.<br/>Here other options for you.');
      expect(makeRequestMock).toHaveBeenCalledTimes(1);
    });

    it('showMessage should be called with two args', () => {
      const additionalMockParams = {
        ...widgetMock,
        reduceParamsOrder: 20,
      };
      widget.reduceParamsAndReloadEvents.call(additionalMockParams);
      expect(showMessageMock).toHaveBeenCalledWith('No results were found.', true);
      expect(additionalMockParams.reduceParamsOrder).toBe(0);
    });
  });

  describe('#setMarkers', () => {
    const addListenerMock = jest.fn();
    window.google = {
      maps: {
        InfoWindow: function() {
        },
        Map: jest.fn(() => {
          return {fitBounds: jest.fn()};
        }),
        ControlPosition: {
          RIGHT_CENTER: true,
        },
        LatLng: jest.fn((lat, lng) => ({lat, lng})),
        MapTypeId: {
          ROADMAP: 'ROADMAPmock',
        },
        LatLngBounds: jest.fn(() => {
          return {extend: jest.fn()};
        }),
        Size: jest.fn(),
        Point: jest.fn(),
        Marker: jest.fn(),
        event: {
          addListener: addListenerMock,
        },
      },
    };

    it('#setMarkers should be called', () => {
      let markers = [['titleMock', 1, 2, 'zIndexMock', 'htmlMock']];
      widget.setMarkers('map', markers);
      expect(addListenerMock).toHaveBeenCalledTimes(3);
      expect(google.maps.Marker).toHaveBeenCalledTimes(1);
    });
  });

  describe('#eventsLoadingHandler', () => {
    const groupEventsByNameMock = jest.fn();
    const addListenerMock = jest.fn();
    const formatDateMock = jest.fn();
    const setMarkersMock = jest.fn();
    const resetReduceParamsOrderMock = jest.fn();
    const hideMessageMock = jest.fn();
    const hideMessageWithDelayMock = jest.fn();
    const reduceParamsAndReloadEventsMock = jest.fn();

    beforeEach(() => {
      groupEventsByNameMock.mockReset();
      formatDateMock.mockReset();
      addListenerMock.mockReset();
      setMarkersMock.mockReset();
      resetReduceParamsOrderMock.mockReset();
      reduceParamsAndReloadEventsMock.mockReset();
      hideMessageWithDelayMock.mockReset();
      hideMessageMock.mockReset();
    });

    const responseTxt = [{
      date: {day: 'dayMock', time: 'timeMock'},
      address: {name: 'nameAddressMock', line1: 'line1Mock'},
      url: 'urlMock',
      name: 'nameMock',
      location: {lat: 'latMock', lng: 'lngMock'},
    }];
    const widgetMock = {
      readyState: XMLHttpRequest.DONE,
      status: 200,
      responseText: JSON.stringify(responseTxt),
      widget: {
        groupEventsByName: groupEventsByNameMock,
        formatDate: formatDateMock,
        isUniverseUrl: function() {
          return true;
        },
        setMarkers: setMarkersMock,
        resetReduceParamsOrder: resetReduceParamsOrderMock,
        hideMessageDelay: 500,
        hideMessageWithDelay: hideMessageWithDelayMock,
        hideMessage: hideMessageMock,
        reduceParamsAndReloadEvents: reduceParamsAndReloadEventsMock,
        hideMessageWithoutDelay: function() {
        },
        clearEvents: function() {
        },
        widgetRoot: {
          firstChild: {},
        },
      },
    };

    it('should group events by name, set markers and hide message', () => {
      widget.eventsLoadingHandler.call(widgetMock);
      expect(groupEventsByNameMock).toHaveBeenCalledTimes(1);
      expect(formatDateMock).toHaveBeenCalledWith({'day': 'dayMock', 'time': 'timeMock'});
      expect(setMarkersMock).toHaveBeenCalledTimes(1);
      expect(resetReduceParamsOrderMock).toHaveBeenCalledTimes(1);
      expect(hideMessageMock).toHaveBeenCalledTimes(1);
    });

    it('should call hideMessageWithDelay', () => {
      const responseTxt = [{
        date: {day: 'dayMock', time: 'timeMock'},
        address: {},
        url: 'urlMock',
        name: 'nameMock',
        location: {lat: 'latMock', lng: 'lngMock'},
      }];
      const additionalMockParams = {
        responseText: JSON.stringify(responseTxt),
        widget: {
          ...widgetMock.widget,
          hideMessageWithoutDelay: false,
        },
      };
      widget.eventsLoadingHandler.call({...widgetMock, ...additionalMockParams});
      expect(hideMessageWithDelayMock).toHaveBeenCalledWith(500);
    });

    it('should call reduceParamsAndReloadEvents if responseTxt is empty', () => {
      const responseTxt = [];
      const additionalMockParams = {
        responseText: JSON.stringify(responseTxt),
      };
      widget.eventsLoadingHandler.call({...widgetMock, ...additionalMockParams});
      expect(reduceParamsAndReloadEventsMock).toHaveBeenCalledTimes(1);
    });

    it('should call reduceParamsAndReloadEvents if response do not have 200 status', () => {
      const additionalMockParams = {
        ...widgetMock,
        status: 400,
      };
      widget.eventsLoadingHandler.call({...widgetMock, ...additionalMockParams});
      expect(reduceParamsAndReloadEventsMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('#getImageForEvent', () => {
    it('#getImageForEvent should return the last img', () => {
      const images = [
        {width: '100', height: '200', url: 'img-01.bmp'},
        {width: '400', height: '300', url: 'img-02.bmp'},
        {width: '50', height: '50', url: 'img-03.bmp'},
        {width: '10', height: '10', url: 'img-04.bmp'},
      ];
      expect(widget.getImageForEvent(images)).toBe('img-04.bmp');
    });

    it('#getImageForEvent should return an empty img', () => {
      const images = [
        {width: '100', height: '200', url: 'img-01.bmp'},
        {width: '400', height: '300', url: 'img-02.bmp'},
        {width: '500', height: '50', url: 'img-03.bmp'},
        {width: '600', height: '10', url: 'img-04.bmp'},
      ];
      expect(widget.getImageForEvent(images)).toBe('');
    });
  });

  describe('#parseEvents', () => {
    it('#parseEvents should return currentEvent', () => {
      const eventsSet = {
        _embedded: {
          events: {
            key: {
              id: 'idMock',
              url: 'urlMock',
              name: 'nameMock',
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
              images: [
                {width: '100', height: '200', url: 'img-01.bmp'},
                {width: '400', height: '300', url: 'img-02.bmp'},
                {width: '50', height: '50', url: 'img-03.bmp'},
                {width: '10', height: '10', url: 'img-04.bmp'},
              ],
              _embedded: {
                venues: [{
                  address: {},
                  name: 'addressName',
                  location: {latitude: 34.1, longitude: -18.2},
                }],
              },
            },
          },
        },
      };
      const generatedObj = [{
        address: {
          name: 'addressName',
        },
        date: {
          'day': '23.09.83',
          'time': '12:00',
        },
        id: 'idMock',
        img: 'img-04.bmp',
        name: 'nameMock',
        url: 'urlMock',
        location: {
          lat: 34.1,
          lng: -18.2,
        },
      }];
      expect(widget.parseEvents(eventsSet)).toEqual(generatedObj);
    });

    it('#parseEvent should return empty Array', () => {
      const eventSet = {};
      expect(widget.parseEvents(eventSet)).toEqual([]);
    });
  });

  it('#initPretendedLink should set attribute and add class', () => {
    widget.initPretendedLink(widget.widgetRoot, 'http://www.google.com', true);
    expect(widget.widgetRoot.classList).toContain('event-pretended-link');
    expect(widget.widgetRoot.getAttribute('data-url')).toBe('http://www.google.com');
  });

  it('#makeImageUrl should be url', () => {
    expect(widget.makeImageUrl('id')).toBe('https://app.ticketmaster.com/discovery-widgets/v2/events/id/images.json');
  });
});
