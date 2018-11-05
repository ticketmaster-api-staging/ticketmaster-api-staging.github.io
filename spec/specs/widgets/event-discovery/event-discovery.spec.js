jest.mock('products-and-docs/widgets/helpers/widgets-analytics.js');

let $ = require('jquery');
window.$ = window.jQuery = $;

import {TicketmasterEventDiscoveryWidget} from 'products-and-docs/widgets/event-discovery/1.0.0/src/main-widget.es6';

describe('EDWWidget', () => {
  let widget;
  const documentCreateElementDefault = document.createElement;
  const documentCreateTextNodeDefault = document.createTextNode;
  let setFixture = () => {
    document.body.innerHTML =
      '<head></head><div w-type="event-discovery" w-tmapikey="y61xDc5xqUSIOz4ISjgCe5E9Lh0hfUH1" w-googleapikey="AIzaSyBQrJ5ECXDaXVlICIdUBOe8impKIGHDzdA" w-keyword="" w-theme="ListView" w-colorscheme="light" w-width="350" w-height="600" w-size="25" w-border="0" w-borderradius="4" w-postalcode="" w-radius="" w-period="week" w-layout="vertical" w-attractionid="" w-promoterid="" w-venueid="" w-affiliateid="" w-segmentid="" w-proportion="custom" w-titlelink="off" w-countrycode="US" w-source="" w-latlong=","><div class="event-logo centered-logo"></div><div class="event-date centered-logo"></div></div>';
  };

	beforeAll(() => {
    window.__VERSION__ = 'mockedVersion';
    window.ga = jest.fn();
	});

	beforeEach(() => {
    setFixture();
    widget = new TicketmasterEventDiscoveryWidget(document.querySelector('div[w-type="event-discovery"]'));
    widget.getStyleSheetNode = jest.fn().mockReturnValue({
      addRule: jest.fn(),
      insertRule: jest.fn(),
    });
	});

  describe('getters and setters', () => {
    it('#events should be empty array when widget.events._embedded is falsy', () => {
      widget.getStyleSheetNode = jest.fn().mockReturnValue({
        addRule: jest.fn(),
        insertRule: jest.fn(),
      });
      widget.events = {};
      expect(widget.events).toEqual([]);
    });

    it('#isListView should be true', () => {
      widget.widgetConfig = {
        theme: 'listview',
      };
      expect(widget.isListView).toBeTruthy();
    });

    it('#isListViewThumbnails should be true', () => {
      widget.widgetConfig = {
        theme: 'listviewthumbnails',
      };
      expect(widget.isListViewThumbnails).toBeTruthy();
    });

    it('#isFullWidth should be true', () => {
      widget.widgetConfig = {
        layout: 'fullwidth',
      };
      expect(widget.isFullWidth).toBeTruthy();
    });

    it('#isPosterTheme should be true', () => {
      widget.widgetConfig = {
        layout: 'simple',
      };
      expect(widget.isPosterTheme).toBeTruthy();
    });

    it('#isBarcodeWidget should be true', () => {
      widget.widgetConfig = {
        theme: 'oldschool',
      };
      expect(widget.isBarcodeWidget).toBeTruthy();
      widget.widgetConfig = {
        theme: 'newschool',
      };
      expect(widget.isBarcodeWidget).toBeTruthy();
    });

    it('#isSimpleProportionM should be true', () => {
      widget.widgetConfig = {
        proportion: 'm',
      };
      expect(widget.isSimpleProportionM).toBeTruthy();
    });

    it('#borderSize should be 1', () => {
      widget.widgetConfig = {
        border: 1,
      };
      expect(widget.borderSize).toBe(1);
    });

    it('#widgetHeight should be 100', () => {
      widget.widgetConfig = {
        height: 100,
      };
      expect(widget.widgetHeight).toBe(100);
    });

    it('#widgetContentHeight should be 300', () => {
      widget.widgetConfig = {
        height: 300,
        theme: 'listview',
      };
      expect(widget.widgetContentHeight).toBe(300);
    });

    it('#eventUrl should be https://www.ticketmaster.com/event/', () => {
      expect(widget.eventUrl).toBe('https://www.ticketmaster.com/event/');
    });

    it('#apiUrl should be https://app.ticketmaster.com/discovery-widgets/v2/events.json', () => {
      expect(widget.apiUrl).toBe('https://app.ticketmaster.com/discovery-widgets/v2/events.json');
    });

    it('#themeUrl should be Defined', () => {
      expect(widget.themeUrl).toBe('https://ticketmaster-api-staging.github.io/products-and-docs/widgets/event-discovery/1.0.0/theme/');
      Object.defineProperty(window.location, 'host', {
        writable: true,
        value: 'developer.ticketmaster.com',
      });
      expect(widget.themeUrl).toBe('https://developer.ticketmaster.com/products-and-docs/widgets/event-discovery/1.0.0/theme/');
    });

    it('#portalUrl should be Defined', () => {
      Object.defineProperty(window.location, 'host', {
        writable: true,
        value: 'https://ticketmaster-api-staging.github.io/',
      });
      expect(widget.portalUrl).toBe('https://ticketmaster-api-staging.github.io/');
      Object.defineProperty(window.location, 'host', {
        writable: true,
        value: 'developer.ticketmaster.com',
      });
      expect(widget.portalUrl).toBe('https://developer.ticketmaster.com/');
    });

    it('#geocodeUrl should be https://maps.googleapis.com/maps/api/geocode/json', () => {
      expect(widget.geocodeUrl).toBe('https://maps.googleapis.com/maps/api/geocode/json');
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

    it('#tmWidgetWhiteList should contain 2200504BAD4C848F in array', () => {
      expect(widget.tmWidgetWhiteList).toContain('2200504BAD4C848F');
    });

    it('widget #countriesWhiteList should be array and contain France', () => {
      expect(widget.countriesWhiteList).toContain('France');
    });
  });

  describe('DOM elements', () => {
    const appendChildMock = jest.fn();
    const createTextNodeMock = jest.fn();
    const addMock = jest.fn();
    const addEventListenerMock = jest.fn();
    const eventsRootAppendChildMock = jest.fn();
    const widgetRootAppendChildMock = jest.fn();
    const setAttributeMock = jest.fn();

    afterEach(() => {
      document.createElement = documentCreateElementDefault;
      document.createTextNode = documentCreateTextNodeDefault;
    });

    beforeEach(() => {
      appendChildMock.mockReset();
      createTextNodeMock.mockReset();
      addMock.mockReset();
      addEventListenerMock.mockReset();
      eventsRootAppendChildMock.mockReset();
      widgetRootAppendChildMock.mockReset();
      setAttributeMock.mockReset();

      widget.eventsRootContainer.appendChild = eventsRootAppendChildMock;
      widget.widgetRoot.appendChild = widgetRootAppendChildMock;

      document.createElement = jest.fn(() => {
        return {
          appendChild: appendChildMock,
          createTextNode: createTextNodeMock,
          classList: {
            add: addMock,
          },
          addEventListener: addEventListenerMock,
          setAttribute: setAttributeMock,
        };
      });
      document.createTextNode = jest.fn(() => {
        return {
          appendChild: appendChildMock,
          createTextNode: createTextNodeMock,
          classList: {
            add: addMock,
          },
          addEventListener: addEventListenerMock,
        };
      });
    });

    it('#initBuyBtn should create element', () => {
      widget.initBuyBtn();
      expect(appendChildMock).toHaveBeenCalled();
      expect(addMock).toHaveBeenCalledTimes(2);
      expect(addMock).toHaveBeenCalledWith('event-buy-btn');
      expect(addMock).toHaveBeenCalledWith('main-btn');
      expect(widget.buyBtn.target).toBe('_blank');
      expect(widget.buyBtn.href).toBe('');
    });

    it('#oldSchoolModificator should create element with classList "modificator", "general-admission"', () => {
      widget.oldSchoolModificator();
      expect(addMock).toHaveBeenCalledWith('general-admission', 'modificator');
      expect(appendChildMock).toHaveBeenCalledTimes(2);
      expect(eventsRootAppendChildMock).toHaveBeenCalled();
    });

    it('#newSchoolModificator should create element with classList "modificator", "ticket-logo"', () => {
      Object.defineProperty(window.location, 'host', {
        writable: true,
        value: 'developer.ticketmaster/.com',
      });
      widget.newSchoolModificator();
      expect(addMock).toHaveBeenCalledWith('ticket-logo', 'modificator');
      expect(setAttributeMock).toHaveBeenCalledTimes(8);
      expect(setAttributeMock).toHaveBeenCalledWith('src', 'https://ticketmaster-api-staging.github.io/assets/widgets/1.0.0/img/ticketmaster-logo-white.svg');
      expect(setAttributeMock).toHaveBeenCalledWith('height', '11');
    });

    /* TODO part */
    it('#addBuyButton should be defined', () => {
      widget.config.theme = 'listview';
      widget.isUniversePluginInitialized = true;
      widget.addBuyButton(widget.eventsRootContainer, 'ticketmaster.com');
      expect(appendChildMock).toHaveBeenCalled();
      expect(addMock).toHaveBeenCalledWith('event-buy-btn');
      expect(widget.buyBtn.target).toBe('_blank');
      expect(widget.buyBtn.href).toBe('');

      document.querySelector('.event-buy-btn').click();
      expect(eventsRootAppendChildMock).toHaveBeenCalled();
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

	it('#eventReqAttrs should retrun object', () => {
		widget.eventsRootContainer = document.querySelector('.events-root-container');
		widget.widgetConfig = {
      tmapikey: 'test',
			latlong: '34567.87,4589745',
			postalcode: 90015,
			height: 350,
      theme: 'simple',
		};
		expect(widget.isConfigAttrExistAndNotEmpty('tmapikey')).toBe(true);
    expect(widget.isConfigAttrExistAndNotEmpty('venueid')).toBe(false);
    expect(widget.eventReqAttrs).toEqual({'apikey': 'test'});
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
    let onLoadCoordinate;
    beforeAll(() => {
      onLoadCoordinate = widget.onLoadCoordinate;
    });

    afterAll(() => {
      widget.onLoadCoordinate = onLoadCoordinate;
    });

    beforeEach(() => {
      updateTransitionMock.mockReset();
      onLoadCoordinateMock.mockReset();
      cbMock.mockReset();
    });

    const responseMock = {
      readyState: XMLHttpRequest.DONE,
      status: 200,
      onLoadCoordinate: onLoadCoordinateMock,
      config: {},
      responseText: JSON.stringify(responseTextMock),
      countriesWhiteList: ['Australia', 'Denmark', 'Finland'],
    };
  });

  describe('#getCoordinates', () => {
    const cbMock = jest.fn();
    const makeRequestMock = jest.fn();
    const getParseGoogleGeocodeResponseMock = jest.fn();
    const onLoadCoordinateMock = jest.fn(() => true);
    beforeEach(() => {
      makeRequestMock.mockReset();
      onLoadCoordinateMock.mockReset();
      getParseGoogleGeocodeResponseMock.mockReset();
    });

    const widgetMock = {
      isConfigAttrExistAndNotEmpty: function() {return true;},
      makeRequest: makeRequestMock,
      onLoadCoordinate: onLoadCoordinateMock,
      getParseGoogleGeocodeResponse: getParseGoogleGeocodeResponseMock,
      geocodeUrl: 'url',
      config: {
        googleapikey: 1234,
        country: 'Denmark',
      },
    };

    it('makeRequest function should be called', () => {
      widget.getCoordinates.call(widgetMock, widgetMock.cb);
      expect(makeRequestMock).toHaveBeenCalledTimes(1);
      expect(makeRequestMock.mock.calls[0][1]).toEqual('url');
      expect(makeRequestMock.mock.calls[0][2]).toEqual({'components': 'postal_code:undefined|country:Denmark', 'key': 1234, 'language': 'en'});
    });

    it('onLoadCoordinate and cb functions should be called', () => {
      const additionalMockParams = {
        ...widgetMock,
        isConfigAttrExistAndNotEmpty: function() {return false;},
      };
      widget.getCoordinates.call(additionalMockParams, cbMock);
      expect(onLoadCoordinateMock).toHaveBeenCalledTimes(1);
      expect(onLoadCoordinateMock).toHaveBeenCalledWith(null);
      expect(cbMock).toHaveBeenCalledTimes(1);
      expect(cbMock).toHaveBeenCalledWith('');
    });
  });

  describe('#setBuyBtnUrl method', () => {
    const widgetMock = {
      buyBtn: {},
      eventsGroups: [[{
        url: 'https://www.universe.com',
      }]],
      currentSlideX: 0,
      currentSlideY: 0,
      isUniversePluginInitialized: true,
      isUniverseUrl: function() {return true;},
      config: {
        theme: 'oldschool',
        proportion: 'm',
      },
    };

    it('should call #updateTransition with two params', () => {
      widget.setBuyBtnUrl.call(widgetMock);
      expect(widgetMock.buyBtn.href).toEqual('https://www.universe.com');
    });

    it('should call #updateTransition with one params', () => {
      const additionalMockParams = {
        config: {
          theme: 'simple',
        },
      };
      widget.setBuyBtnUrl.call({...widgetMock, ...additionalMockParams});
      expect(widgetMock.buyBtn.href).toEqual('https://www.universe.com');
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
    const removeMock = jest.fn();
    beforeEach(() => {
      addMock.mockReset();
      removeMock.mockReset();
    });
    const widgetMock = {
      hideMessageWithoutDelay: {},
      messageContent: {},
      messageDialog: {
        classList: {
          add: addMock,
          remove: removeMock,
        },
      },
      messageTimeout: true,
    };
    widget.showMessage.call(widgetMock, 'message', true, 'className');
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

  it('#hideMessage should clearTimeout and remove class event-message-visible', () => {
    jest.useFakeTimers();
    widget.showMessage('message');
    expect(widget.messageDialog.classList).toContain('event-message-visible');
    widget.messageTimeout = 1;
    widget.hideMessage();
    expect(clearTimeout).toHaveBeenCalledWith(1);
    expect(widget.messageDialog.classList).not.toContain('event-message-visible');
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

	it('#listViewModificator should be defined', () => {
		widget.listViewModificator();
		expect(widget.listViewModificator).toBeDefined();
	});

  it('#hideSliderControls should add class events_control-hidden', () => {
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

  describe('slides block', () => {
    const setSlideManuallyMock = jest.fn();
    beforeEach(() => {
      setSlideManuallyMock.mockReset();
    });

    it('#prevSlideX should call setSlideManually if currentSlideX > 0', () => {
      const widgetMock = {
        currentSlideX: 5,
        setSlideManually: setSlideManuallyMock,
      };
      widget.prevSlideX.call(widgetMock);
      expect(setSlideManuallyMock).toHaveBeenCalledWith(4, true);
    });

    it('#nextSlideX should should call setSlideManually if slideCountX > currentSlideX', () => {
      const widgetMock = {
        currentSlideX: 2,
        slideCountX: 5,
        setSlideManually: setSlideManuallyMock,
      };
      widget.nextSlideX.call(widgetMock);
      expect(setSlideManuallyMock).toHaveBeenCalledWith(3, true);
    });

    it('#prevSlideY should call setSlideManually if currentSlideY > 0', () => {
      const widgetMock = {
        currentSlideY: 2,
        setSlideManually: setSlideManuallyMock,
      };
      widget.prevSlideY.call(widgetMock);
      expect(setSlideManuallyMock).toHaveBeenCalledWith(1, false);
    });

    it('#nextSlideY should call setSlideManually if ([1, 2, 3].length -1) > currentSlideX', () => {
      const widgetMock = {
        currentSlideY: 1,
        currentSlideX: 0,
        eventsGroups: [[1, 2, 3]],
        setSlideManually: setSlideManuallyMock,
      };
      widget.nextSlideY.call(widgetMock);
      expect(setSlideManuallyMock).toHaveBeenCalledWith(2, false);
    });
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
    it('setBuyBtnUrl function should not be called', () => {
      const setBuyBtnUrlMock = jest.fn();
      const widgetMock = {
        currentSlideX: 1,
        setBuyBtnUrl: setBuyBtnUrlMock,
      };
      widget.goToSlideX.call(widgetMock, 1);
      expect(setBuyBtnUrlMock).not.toHaveBeenCalled();
    });

    it('setBuyBtnUrl function should be called', () => {
      const setBuyBtnUrlMock = jest.fn();
      const toggleControlsVisibilityMock = jest.fn();
      const setEventsCounterMock = jest.fn();
      const widgetMock = {
        currentSlideX: 1,
        setBuyBtnUrl: setBuyBtnUrlMock,
        toggleControlsVisibility: toggleControlsVisibilityMock,
        setEventsCounter: setEventsCounterMock,
        eventsRoot: {
          style: {
            marginLeft: '10',
          },
        },
      };
      widget.goToSlideX.call(widgetMock, 2);
      expect(setBuyBtnUrlMock).toHaveBeenCalled();
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
          getElementsByClassName: () => [{style: {marginTop: 1}}, {}],
        },
      };
      widget.goToSlideY.call(widgetMock, 2);
      expect(setBuyBtnUrlMock).toHaveBeenCalled();
    });

    it('setBuyBtnUrl function should not be called', () => {
      const setBuyBtnUrlMock = jest.fn();
      const widgetMock = {
        currentSlideY: 1,
        setBuyBtnUrl: setBuyBtnUrlMock,
      };
      widget.goToSlideY.call(widgetMock, 1);
      expect(setBuyBtnUrlMock).not.toHaveBeenCalled();
    });
  });

  it('#runAutoSlideX should call goToSlideX(2)', () => {
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

  describe('#initSlider', () => {
    const runAutoSlideXMock = jest.fn();
    const goToSlideXMock = jest.fn();
    const stopAutoSlideXMock = jest.fn();
    const goToSlideYMock = jest.fn();

    beforeEach(() => {
      runAutoSlideXMock.mockReset();
      goToSlideXMock.mockReset();
      stopAutoSlideXMock.mockReset();
      goToSlideYMock.mockReset();
    });

    const widgetMock = {
      sliderInterval: () => true,
      sliderTimeout: () => true,
      eventsGroups: [1, 2, 3, 4],
      runAutoSlideX: runAutoSlideXMock,
      stopAutoSlideX: stopAutoSlideXMock,
      goToSlideX: goToSlideXMock,
      goToSlideY: goToSlideYMock,
      isFullWidth: true,
      listenerResize: [],
      toggleControlsVisibility: () => true,
      setBuyBtnUrl: () => true,
      widgetRoot: {
        offsetWidth: 20,
        querySelectorAll: function() {},
      },
      eventsRoot: {
        style: {
          marginLeft: '10',
        },
      },
    };

    /* TODO */
    it('runAutoSlideXMock function should not be called', () => {
      widget.initSlider.call(widgetMock);
      expect(runAutoSlideXMock.mock.calls.length).toBe(1);
      expect(widgetMock.listenerResize.length).toBe(1);
      widgetMock.listenerResize[0]();
     // expect(goToSlideXMock.mock.calls.length).toBe(1);
      // widget.setSlideManually.call(widgetMock, 1, 1);
      // expect(goToSlideXMock.mock.calls.length).toBe(1);
    });

    it('runAutoSlideXMock function should not be called', () => {
      const additionalMockParams = {
        ...widgetMock,
        isFullWidth: false,
        listenerResize: [function() {}, 2, 3],
      };
      widget.initSlider.call(additionalMockParams);
      expect(runAutoSlideXMock).toHaveBeenCalled();
      expect(additionalMockParams.listenerResize.length).toBe(2);
    });
  });

	it('#initFullWidth should define eventsRootContainer height', () => {
		widget.widgetConfig = {
			layout: 'fullwidth',
		};
		widget.initFullWidth();
		expect(widget.eventsRootContainer.style.height).toBe('550px');
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

  /* TODO */
  it('#clear should call clearEvents', () => {
    $(widget.widgetRoot).append('<div class="modificator"></div><div class="modificator"></div><div class="modificator"></div>');
    $(document.body).append('<div class="widget-container--discovery"><div class="listview-after"></div></div>');
    widget.clearEvents = jest.fn();
    widget.config = {
      theme: 'listview',
    };
    widget.clear();
    expect(widget.clearEvents ).toHaveBeenCalled();
  });

  /* TODO */
  it('#update should be defined', () => {
    spyOn(widget, 'clear');
    widget.eventsRootContainer = document.querySelector('.events-root-container');
    widget.eventsRoot = document.querySelector('.events-root-container');
    widget.themeModificators = {
      hasOwnProperty: () => {},
    };
    widget.update();
    expect(typeof(widget.update)).toBe('function');
    widget.config = {
      border: '2',
    };
    widget.widgetConfig = {
      theme: '',
    };
    widget.update();
    expect(typeof(widget.update)).toBe('function');
  });

  it('#addStylesheetForWidgetTheme should add style link for the set widget theme', () => {
    const widgetMock = {
      config: {
        theme: 'mockTheme',
      },
      themeUrl: 'http://widgetThemeUrl/',
    };

    widget.addStylesheetForWidgetTheme.call(widgetMock);

    let elem = document.getElementById('widget-theme-mockTheme');
    expect(elem).toBeDefined();
  });

  it('#groupEventsByName should define eventsGroups', () => {
    const widgetMock = {
      events: [{'name': 'mockName'}, {'name': 'mockName'}],
    };
    widget.groupEventsByName.call(widgetMock);
    expect(widgetMock.eventsGroups).toEqual([[{'name': 'mockName'}, {'name': 'mockName'}]]);
  });

  it('#initEventCounter should create element with class events-counter', () => {
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

    it('if eventsGroups.length > 1 text should be "2 of 3 events"', () => {
      widget.setEventsCounter.call(widgetMock);
      expect(widgetMock.eventsCounter.innerHTML).toBe('2 of 3 events');
    });

    it('if eventsGroups.length == 1 text should be "1 event"', () => {
      const additionalMockParams = {
        ...widgetMock,
        eventsGroups: [1],
      };
      widget.setEventsCounter.call(additionalMockParams);
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
      expect(showMessageMock.mock.calls.length).toBe(1);
      expect(showMessageMock.mock.calls[0][0]).toEqual('No results were found.<br/>Here other options for you.');
      expect(makeRequestMock.mock.calls.length).toBe(1);
    });

    it('showMessage should be called with two args', () => {
      const additionalMockParams = {
        ...widgetMock,
        reduceParamsOrder: 20,
      };
      widget.reduceParamsAndReloadEvents.call(additionalMockParams);
      expect(showMessageMock.mock.calls.length).toBe(1);
      expect(showMessageMock.mock.calls[0][0]).toEqual('No results were found.');
      expect(showMessageMock.mock.calls[0][1]).toEqual(true);
    });
  });

  describe('#eventsLoadingHandler', () => {
    const groupEventsByNameMock = jest.fn();
    const publishEventMock = jest.fn();
    const initSliderMock = jest.fn();
    const publishEventsGroupMock = jest.fn();
    const setEventsCounterMock = jest.fn();
    const	resetReduceParamsOrderMock = jest.fn();
    const hideMessageMock = jest.fn();
    const hideMessageWithDelayMock = jest.fn();
    const reduceParamsAndReloadEventsMock = jest.fn();
    const getAttributeMock = jest.fn();

    beforeEach(() => {
      groupEventsByNameMock.mockReset();
      publishEventMock.mockReset();
      initSliderMock.mockReset();
      publishEventsGroupMock.mockReset();
      setEventsCounterMock.mockReset();
      resetReduceParamsOrderMock.mockReset();
      hideMessageMock.mockReset();
    });

    const responseTxt = [{name: '1'}, {name: '2'}, {name: '1'}, {name: '3'}];
    const sortedByName = [[{name: '1'}, {name: '1'}], [{name: '2'}], [{name: '3'}]];
    const widgetMock = {
      readyState: XMLHttpRequest.DONE,
      status: 200,
      responseText: JSON.stringify(responseTxt),
      widget: {
        groupEventsByName: groupEventsByNameMock,
        publishEvent: publishEventMock,
        publishEventsGroup: publishEventsGroupMock,
        hideMessageDelay: 500,
        hideMessageWithDelay: hideMessageWithDelayMock,
        hideMessage: hideMessageMock,
        eventsGroups: sortedByName,
        initSlider: initSliderMock,
        setEventsCounter: setEventsCounterMock,
        resetReduceParamsOrder: resetReduceParamsOrderMock,
        reduceParamsAndReloadEvents: reduceParamsAndReloadEventsMock,
        hideMessageWithoutDelay: function() {},
        clearEvents: function() {},
      },
    };

    it('should group events by name and publish them if there are no sorting param', () => {
      const additionalMockParams = {
        widget: {
          ...widgetMock.widget,
          widgetRoot: {
            getAttribute: getAttributeMock.mockReturnValue(false),
          },
        },
      };
      widget.eventsLoadingHandler.call({...widgetMock, ...additionalMockParams});

      expect(groupEventsByNameMock).toHaveBeenCalled();
      expect(publishEventMock).toHaveBeenCalledTimes(2);
      expect(publishEventsGroupMock).toHaveBeenCalled();
      expect(initSliderMock).toHaveBeenCalled();
      expect(setEventsCounterMock).toHaveBeenCalled();
      expect(resetReduceParamsOrderMock).toHaveBeenCalled();
      expect(hideMessageMock).toHaveBeenCalled();
      expect(publishEventsGroupMock).toHaveBeenCalledWith([{'name': '1'}, {'name': '1'}], 0);
      expect(publishEventMock).toHaveBeenCalledWith({'name': '2'});
      expect(publishEventMock).toHaveBeenCalledWith({'name': '3'});
      expect(groupEventsByNameMock.mock.instances[0]).toBe(additionalMockParams.widget);
    });

    it('should group events by name and publish them if sorting params set to group by name value', () => {
      const additionalMockParams = {
        widget: {
          ...widgetMock.widget,
          widgetRoot: {
            getAttribute: getAttributeMock.mockReturnValue('groupByName'),
          },
        },
      };
      widget.eventsLoadingHandler.call({...widgetMock, ...additionalMockParams});

      expect(groupEventsByNameMock).toHaveBeenCalled();
      expect(publishEventMock).toHaveBeenCalledTimes(2);
      expect(publishEventsGroupMock).toHaveBeenCalled();
      expect(initSliderMock).toHaveBeenCalled();
      expect(setEventsCounterMock).toHaveBeenCalled();
      expect(resetReduceParamsOrderMock).toHaveBeenCalled();
      expect(hideMessageMock).toHaveBeenCalled();
      expect(publishEventsGroupMock).toHaveBeenCalledWith([{'name': '1'}, {'name': '1'}], 0);
      expect(publishEventMock).toHaveBeenCalledWith({'name': '2'});
      expect(publishEventMock).toHaveBeenCalledWith({'name': '3'});
      expect(groupEventsByNameMock.mock.instances[0]).toBe(additionalMockParams.widget);
    });

    it('just publish events if sorting param is set to ascending value', () => {
      const additionalMockParams = {
        widget: {
          ...widgetMock.widget,
          hideMessageWithoutDelay: false,
          widgetRoot: {
            getAttribute: getAttributeMock.mockReturnValue('dateAscending'),
          },
        },
      };
      widget.eventsLoadingHandler.call({...widgetMock, ...additionalMockParams});

      expect(publishEventMock).toHaveBeenCalledTimes(4);
      expect(initSliderMock).toHaveBeenCalled();
      expect(setEventsCounterMock).toHaveBeenCalled();
      expect(resetReduceParamsOrderMock).toHaveBeenCalled();
      expect(publishEventMock).toHaveBeenCalledWith({'name': '3'});
      expect(publishEventMock).toHaveBeenCalledWith({'name': '1'});
      expect(publishEventMock).toHaveBeenCalledWith({'name': '2'});
    });
  });

  describe('#publishEventsGroup', () => {
  const group = {
    map: (fn) => {fn();},
  };

    it('#publishEventsGroup should create elem and add style when config.layout != fullwidth', () => {
      widget.publishEvent = jest.fn();
      widget.publishEventsGroup(group, 1);
      let elem = document.querySelector('.event-wrapper.event-group-wrapper');
      expect(elem.style.width).toBe('350px');
      expect(elem.style.height).toBe('561px');
      expect(widget.publishEvent).toHaveBeenCalled();
    });

    it('#publishEventsGroup should create elem and add style when config.layout == fullwidth', () => {
      widget.publishEvent = jest.fn();
      widget.config.layout = 'fullwidth';
      widget.publishEventsGroup(group, 1);
      let elem = document.querySelector('.event-wrapper.event-group-wrapper');
      expect(elem.style.width).toBe('0px');
      expect(elem.style.height).toBe('600px');
      expect(widget.publishEvent).toHaveBeenCalled();
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
    expect(appendChildMock).toHaveBeenCalled();
    expect(createDOMItemMock).toHaveBeenCalled();
    expect(createDOMItemMock).toHaveBeenCalledWith('mockEvent');
  });

  it('#getEventByID should return {"id": 1}', () => {
    const widgetMock = {
      events: [{id: 1}, {id: 2}],
    };
    expect(widget.getEventByID.call(widgetMock, 1)).toEqual({'id': 1});
  });

  describe('#getImageForEvent', () => {
    const images = [
      {width: '100', height: '200', url: 'img-01.bmp'},
      {width: '400', height: '300', url: 'img-02.bmp'},
      {width: '10', height: '50', url: 'img-03.bmp'},
      {width: '10', height: '10', url: 'img-04.bmp'},
    ];
    it('#getImageForEvent should return the first img', () => {
      widget.config.width = '100';
      widget.config.height = '200';
      expect(widget.getImageForEvent(images)).toBe('img-01.bmp');
    });

    it('#getImageForEvent should return the second smallest img', () => {
      widget.config.width = '100%';
      expect(widget.getImageForEvent(images, true, true)).toBe('img-01.bmp');
    });
  });

  describe('#parseEvents', () => {
    it('#parseEvents should return currentEvent', () => {
      widget.config.theme = 'listviewthumbnails';
      widget.config.layout = 'fullwidth';
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
        img: 'img-02.bmp',
        name: 'nameMock',
        url: 'urlMock',
      }];
      expect(widget.parseEvents(eventsSet)).toEqual(generatedObj);
    });

    it('#parseEvent should return empty Array', () => {
      const eventSet = {};
      expect(widget.parseEvents(eventSet)).toEqual([]);
    });
  });

  it('#initPretendedLink should add addEventListener to widget.widgetRoot', () => {
    const setAttributeMock = jest.fn();
    const getAttributeMock = jest.fn();
    widget.widgetRoot.setAttribute = setAttributeMock;
    widget.widgetRoot.getAttribute = getAttributeMock;
    const res = widget.initPretendedLink(widget.widgetRoot, 'http://ticketmaster.com');
    expect(res).toEqual(widget.widgetRoot);
    expect(setAttributeMock).toHaveBeenCalledWith('data-url', 'http://ticketmaster.com');

    $(widget.widgetRoot).trigger('click');
    expect(getAttributeMock).toHaveBeenCalledWith('data-url');
  });

  describe('#createBackgroundImage', () => {
    it('#createBackgroundImage should create elem with class bg-cover', () => {
      widget.createBackgroundImage(widget.widgetRoot, 'http://ticketmaster.com');
      const elem = widget.widgetRoot.querySelector('.bg-cover');
      expect(elem.style.backgroundImage).toEqual('url(http://ticketmaster.com)');
    });
    it('#createBackgroundImage should create elem with class bg-cover-thumbnails', () => {
      widget.config.theme = 'listviewthumbnails';
      widget.createBackgroundImage(widget.widgetRoot, 'http://ticketmaster.com');
      const elem = widget.widgetRoot.querySelector('.bg-cover-thumbnails');
      expect(elem.style.backgroundImage).toEqual('url(http://ticketmaster.com)');
    });

    it('#createBackgroundImage should create elem with class bg-cover-default', () => {
      widget.config.theme = 'listviewthumbnails';
      widget.createBackgroundImage(widget.widgetRoot, false);
      const elem = widget.widgetRoot.querySelector('.bg-cover-default');
      expect(elem.style.backgroundImage).toEqual('');
    });
  });

  it('#addBarcode should create elem with class barcode', () => {
    let elem = widget.widgetRoot.querySelector('.barcode');
    expect(elem).toBe(null);

    widget.config.theme = 'oldschool';
    widget.addBarcode(widget.widgetRoot, 'http://ticketmaster.com');
    elem = widget.widgetRoot.querySelector('.barcode');
    expect(elem.getAttribute('target')).toBe('_blank');
    expect(elem.getAttribute('href')).toBe('http://ticketmaster.com');
  });

  /* TODO */
  it('#addSimpleScrollBar', () => {
    expect(window.hasOwnProperty('data-simple-scrollbar')).toBe(false);
    widget.addSimpleScrollBar();
  });

  it('#addScroll should call addSimpleScrollBar', () => {
    widget.addSimpleScrollBar = jest.fn();
    window.SimpleScrollbar = {
      initEl: jest.fn(),
    };
    widget.addScroll();
    expect(widget.addSimpleScrollBar).toHaveBeenCalled();
    expect(SimpleScrollbar.initEl).toHaveBeenCalled();
  });

	it('#makeImageUrl should be https://app.ticketmaster.com/discovery-widgets/v2/events/test/images.json', () => {
		expect(widget.makeImageUrl('test')).toBe('https://app.ticketmaster.com/discovery-widgets/v2/events/test/images.json');
	});

	/* TODO */
  it('#createDOMItem should be defined', () => {
    widget.config = {
      theme: 'listview',
    };
    let evt = JSON.parse('{"id":"LvZ184X-QKyIveZvudILo","url":"https://www.universe.com/events/2017-2018-subscription-tickets-F39HZP?ref=ticketmaster","name":"2017/2018 Subscription","date":{"day":"2016-09-25","time":"18:15:00"},"img":"https://s1.ticketm.net/dam/c/8cf/a6653880-7899-4f67-8067-1f95f4d158cf_124761_TABLET_LANDSCAPE_16_9.jpg"}');
    widget.createDOMItem(evt, widget.widgetRoot);
    expect(typeof(widget.createDOMItem)).toBe('function');
    document.querySelector('[w-type="event-discovery"]').removeAttribute('w-titlelink');
    evt = JSON.parse('{"id":"LvZ184X-QKyIveZvudILo","url":"https://www.universe.com/events/2017-2018-subscription-tickets-F39HZP?ref=ticketmaster","name":"2017/2018 Subscription","address":{"name":"Avenue 5", "line1":"one" ,"line2": "two"},"categories":["music", "games"],"date":{"day":"2016-09-25","time":"18:15:00"},"img":"https://s1.ticketm.net/dam/c/8cf/a6653880-7899-4f67-8067-1f95f4d158cf_124761_TABLET_LANDSCAPE_16_9.jpg"}');
    widget.createDOMItem(evt, widget.widgetRoot);
    evt = JSON.parse('{"id":"LvZ184X-QKyIveZvudILo","url":"https://www.universe.com/events/2017-2018-subscription-tickets-F39HZP?ref=ticketmaster","address":"","name":"2017/2018 Subscription","date":{"day":"2016-09-25","time":"18:15:00"},"img":"https://s1.ticketm.net/dam/c/8cf/a6653880-7899-4f67-8067-1f95f4d158cf_124761_TABLET_LANDSCAPE_16_9.jpg"}');
    widget.createDOMItem(evt, widget.widgetRoot);
  });
});

