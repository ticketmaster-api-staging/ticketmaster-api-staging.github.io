var widgetsLib =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var eq = __webpack_require__(62);

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

module.exports = assocIndexOf;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var isKeyable = __webpack_require__(41);

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

module.exports = getMapData;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(3);

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsNative = __webpack_require__(26),
    getValue = __webpack_require__(35);

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var freeGlobal = __webpack_require__(33);

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(4);

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),
/* 6 */
/***/ (function(module, exports) {

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(23),
    isObject = __webpack_require__(8);

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;


/***/ }),
/* 8 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_without__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_without___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_without__);


const ATTRIBUTE_NAMES = {
  ID: 'w-id',
  WIDGET_TYPE: 'w-type',
  DEFAULT_VALUE: 'data-default-value',
  WIDGET_THEME: 'w-theme',
  WIDGET_LAYOUT: 'w-layout',
  WIDGET_HEIGHT: 'w-height',
  WIDGET_BORDER: 'w-border',

  TITLE_COLOR: 'w-titleColor',
  TITLE_HOVER_COLOR: 'w-titleHoverColor',
  ARROW_COLOR: 'w-arrowColor',
  ARROW_HOVER_COLOR: 'w-arrowHoverColor',
  EVENT_DATE_COLOR: 'w-dateColor',
  EVENT_DESCRIPTION_COLOR: 'w-descriptionColor',
  EVENTS_COUNTER_COLOR: 'w-counterColor',
  BORDER_COLOR: 'w-bordercolor',
  BACKGROUND_COLOR: 'w-backgroundcolor',
};
/* harmony export (immutable) */ __webpack_exports__["ATTRIBUTE_NAMES"] = ATTRIBUTE_NAMES;


const ATTRIBUTE_VALUES = {
  WIDGET_THEME: {
    SIMPLE: 'simple',
    OLD_SCHOOL: 'oldschool',
    NEW_SCHOOL: 'newschool',
    LIST_VIEW: 'listview',
    LIST_VIEW_THUMBNAILS: 'listviewthumbnails',
  },
  WIDGET_LAYOUT: {
    HORIZONTAL: 'horizontal',
  },
};
/* harmony export (immutable) */ __webpack_exports__["ATTRIBUTE_VALUES"] = ATTRIBUTE_VALUES;


const CUSTOM_THEME_ATTRIBUTES = [
  ATTRIBUTE_NAMES.TITLE_COLOR,
  ATTRIBUTE_NAMES.TITLE_HOVER_COLOR,
  ATTRIBUTE_NAMES.ARROW_COLOR,
  ATTRIBUTE_NAMES.ARROW_HOVER_COLOR,
  ATTRIBUTE_NAMES.EVENT_DATE_COLOR,
  ATTRIBUTE_NAMES.EVENT_DESCRIPTION_COLOR,
  ATTRIBUTE_NAMES.EVENTS_COUNTER_COLOR,
  ATTRIBUTE_NAMES.BORDER_COLOR,
  ATTRIBUTE_NAMES.BACKGROUND_COLOR,
];
/* harmony export (immutable) */ __webpack_exports__["CUSTOM_THEME_ATTRIBUTES"] = CUSTOM_THEME_ATTRIBUTES;


const AVAILABLE_CUSTOM_FIELDS_FOR_THEME = {
  [ATTRIBUTE_VALUES.WIDGET_THEME.SIMPLE]: __WEBPACK_IMPORTED_MODULE_0_lodash_without___default()(CUSTOM_THEME_ATTRIBUTES, ATTRIBUTE_NAMES.BACKGROUND_COLOR),
  [ATTRIBUTE_VALUES.WIDGET_THEME.OLD_SCHOOL]: CUSTOM_THEME_ATTRIBUTES,
  [ATTRIBUTE_VALUES.WIDGET_THEME.NEW_SCHOOL]: CUSTOM_THEME_ATTRIBUTES,
  [ATTRIBUTE_VALUES.WIDGET_THEME.LIST_VIEW]: __WEBPACK_IMPORTED_MODULE_0_lodash_without___default()(CUSTOM_THEME_ATTRIBUTES, ATTRIBUTE_NAMES.ARROW_COLOR, ATTRIBUTE_NAMES.ARROW_HOVER_COLOR),
  [ATTRIBUTE_VALUES.WIDGET_THEME.LIST_VIEW_THUMBNAILS]: __WEBPACK_IMPORTED_MODULE_0_lodash_without___default()(CUSTOM_THEME_ATTRIBUTES, ATTRIBUTE_NAMES.ARROW_COLOR, ATTRIBUTE_NAMES.ARROW_HOVER_COLOR),
};
/* harmony export (immutable) */ __webpack_exports__["AVAILABLE_CUSTOM_FIELDS_FOR_THEME"] = AVAILABLE_CUSTOM_FIELDS_FOR_THEME;




/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
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

/* harmony default export */ __webpack_exports__["default"] = ({
  EVENT_CATEGORY,
  EVENT_NAME,
  initialize,
  sendEvent,
});


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ELEMENTS_STYLED_BY_A;

var _widgetsAnalytics = __webpack_require__(10);

var _widgetsAnalytics2 = _interopRequireDefault(_widgetsAnalytics);

var _attributeNames = __webpack_require__(9);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ELEMENTS_STYLED_BY_ATTRIBUTES = (_ELEMENTS_STYLED_BY_A = {}, _defineProperty(_ELEMENTS_STYLED_BY_A, _attributeNames.ATTRIBUTE_NAMES.TITLE_COLOR, [{
  selector: '.event-name',
  stylePropName: 'color'
}]), _defineProperty(_ELEMENTS_STYLED_BY_A, _attributeNames.ATTRIBUTE_NAMES.TITLE_HOVER_COLOR, [{
  selector: '.event-name:hover',
  stylePropName: 'color'
}]), _defineProperty(_ELEMENTS_STYLED_BY_A, _attributeNames.ATTRIBUTE_NAMES.ARROW_COLOR, [{
  selector: '.events_control-right',
  stylePropName: 'border-color',
  getValue: function getValue(value) {
    return 'transparent transparent transparent ' + value;
  }
}, {
  selector: '.events_control-left',
  stylePropName: 'border-color',
  getValue: function getValue(value) {
    return 'transparent ' + value + ' transparent transparent ';
  }
}]), _defineProperty(_ELEMENTS_STYLED_BY_A, _attributeNames.ATTRIBUTE_NAMES.ARROW_HOVER_COLOR, [{
  selector: '.events_control-right:hover',
  stylePropName: 'border-color',
  getValue: function getValue(value) {
    return 'transparent transparent transparent ' + value;
  }
}, {
  selector: '.events_control-left:hover',
  stylePropName: 'border-color',
  getValue: function getValue(value) {
    return 'transparent ' + value + ' transparent transparent ';
  }
}]), _defineProperty(_ELEMENTS_STYLED_BY_A, _attributeNames.ATTRIBUTE_NAMES.EVENT_DATE_COLOR, [{
  selector: '.event-date',
  stylePropName: 'color'
}]), _defineProperty(_ELEMENTS_STYLED_BY_A, _attributeNames.ATTRIBUTE_NAMES.EVENT_DESCRIPTION_COLOR, [{
  selector: '.event-address',
  stylePropName: 'color'
}]), _defineProperty(_ELEMENTS_STYLED_BY_A, _attributeNames.ATTRIBUTE_NAMES.EVENTS_COUNTER_COLOR, [{
  selector: '.events-counter',
  stylePropName: 'color'
}]), _defineProperty(_ELEMENTS_STYLED_BY_A, _attributeNames.ATTRIBUTE_NAMES.BORDER_COLOR, [{
  selector: '.events-root-container',
  stylePropName: 'border-color'
}]), _defineProperty(_ELEMENTS_STYLED_BY_A, _attributeNames.ATTRIBUTE_NAMES.BACKGROUND_COLOR, [{
  selector: '.events-root-container',
  stylePropName: 'background'
}]), _ELEMENTS_STYLED_BY_A);

_widgetsAnalytics2.default.initialize(_widgetsAnalytics2.default.EVENT_CATEGORY.EVENT_DISCOVERY_WIDGET);

var TicketmasterEventDiscoveryWidget = function () {
  _createClass(TicketmasterEventDiscoveryWidget, [{
    key: 'isConfigAttrExistAndNotEmpty',
    value: function isConfigAttrExistAndNotEmpty(attr) {
      if (!this.config.hasOwnProperty(attr) || this.config[attr] === "undefined") {
        return false;
      } else if (this.config[attr] === "") {
        return false;
      }
      return true;
    }
  }, {
    key: 'setUniqueWidgetId',
    value: function setUniqueWidgetId() {
      if (!this.widgetRoot.getAttribute(_attributeNames.ATTRIBUTE_NAMES.ID)) {
        this.widgetRoot.setAttribute(_attributeNames.ATTRIBUTE_NAMES.ID, 'id_' + Math.random().toString(36).substring(7));
      }
    }
  }, {
    key: 'config',
    set: function set(attrs) {
      this.widgetConfig = this.loadConfig(attrs);
    },
    get: function get() {
      return this.widgetConfig;
    }
  }, {
    key: 'events',
    set: function set(responce) {
      this.eventsList = this.parseEvents(responce);
    },
    get: function get() {
      return this.eventsList;
    }
  }, {
    key: 'isListView',
    get: function get() {
      return this.config.theme === 'listview';
    }
  }, {
    key: 'isListViewThumbnails',
    get: function get() {
      return this.config.theme === 'listviewthumbnails';
    }
  }, {
    key: 'isFullWidth',
    get: function get() {
      return this.config.layout === 'fullwidth';
    }
  }, {
    key: 'isPosterTheme',
    get: function get() {
      return this.config.layout === 'simple';
    }
  }, {
    key: 'isBarcodeWidget',
    get: function get() {
      return this.config.theme === 'oldschool' || this.config.theme === 'newschool';
    }
  }, {
    key: 'isSimpleProportionM',
    get: function get() {
      return this.config.proportion === 'm';
    }
  }, {
    key: 'borderSize',
    get: function get() {
      return this.config.border || 0;
    }
  }, {
    key: 'widgetHeight',
    get: function get() {
      return this.config.height || 600;
    }
  }, {
    key: 'widgetContentHeight',
    get: function get() {
      return this.widgetHeight - (this.isListView || this.isListViewThumbnails || this.isSimpleProportionM || this.isFullWidth ? 0 : 39) || 600;
    }
  }, {
    key: 'eventUrl',
    get: function get() {
      return "https://www.ticketmaster.com/event/";
    }
  }, {
    key: 'apiUrl',
    get: function get() {
      return "https://app.ticketmaster.com/discovery-widgets/v2/events.json";
    }
  }, {
    key: 'themeUrl',
    get: function get() {
      return window.location.host === 'developer.ticketmaster.com' ? 'https://developer.ticketmaster.com/products-and-docs/widgets/event-discovery/1.0.0/theme/' : 'https://ticketmaster-api-staging.github.io/products-and-docs/widgets/event-discovery/1.0.0/theme/';
    }
  }, {
    key: 'portalUrl',
    get: function get() {
      return window.location.host === 'developer.ticketmaster.com' ? 'https://developer.ticketmaster.com/' : 'https://ticketmaster-api-staging.github.io/';
    }
  }, {
    key: 'logoUrl',
    get: function get() {
      return "https://www.ticketmaster.com/";
    }
  }, {
    key: 'legalNoticeUrl',
    get: function get() {
      return "https://developer.ticketmaster.com/support/terms-of-use/";
    }
  }, {
    key: 'questionUrl',
    get: function get() {
      return "https://developer.ticketmaster.com/support/faq/";
    }
  }, {
    key: 'widgetVersion',
    get: function get() {
      return '' + "1.0.-4837";
    }
  }, {
    key: 'geocodeUrl',
    get: function get() {
      return "https://maps.googleapis.com/maps/api/geocode/json";
    }
  }, {
    key: 'updateExceptions',
    get: function get() {
      return ["width", "height", "border", "borderradius", "colorscheme", "layout", "affiliateid", "propotion", "googleapikey"];
    }
  }, {
    key: 'sliderDelay',
    get: function get() {
      return 5000;
    }
  }, {
    key: 'sliderRestartDelay',
    get: function get() {
      return 5000;
    }
  }, {
    key: 'hideMessageDelay',
    get: function get() {
      return 5000;
    }
  }, {
    key: 'controlHiddenClass',
    get: function get() {
      return "events_control-hidden";
    }
  }, {
    key: 'tmWidgetWhiteList',
    get: function get() {
      return ["2200504BAD4C848F", "00005044BDC83AE6", "1B005068DB60687F", "1B004F4DBEE45E47", "3A004F4ED7829D5E", "3A004F4ED1FC9B63", "1B004F4FF83289C5", "1B004F4FC0276888", "0E004F4F3B7DC543", "1D004F4F09C61861", "1600505AC9A972A1", "22004F4FD82795C6", "01005057AFF54574", "01005056FAD8793A", "3A004F4FB2453240", "22004F50D2149AC6", "01005059AD49507A", "01005062B4236D5D"];
    }
  }, {
    key: 'countriesWhiteList',
    get: function get() {
      return ['Australia', 'Austria', 'Belgium', 'Canada', 'Denmark', 'Finland', 'France', 'Germany', 'Ireland', 'Mexico', 'Netherlands', 'New Zealand', 'Norway', 'Spain', 'Sweden', 'Turkey', 'UAE', 'United Kingdom', 'United States'];
    }
  }, {
    key: 'eventReqAttrs',
    get: function get() {
      var WidgetRoot = this.eventsRootContainer.parentNode;
      var attrs = {},
          params = [{
        attr: 'tmapikey',
        verboseName: 'apikey'
      }, {
        attr: 'latlong',
        verboseName: 'latlong'
      }, {
        attr: 'keyword',
        verboseName: 'keyword'
      }, {
        attr: 'size',
        verboseName: 'size'
      }, {
        attr: 'radius',
        verboseName: 'radius'
      }, {
        attr: 'attractionid',
        verboseName: 'attractionId'
      }, {
        attr: 'promoterid',
        verboseName: 'promoterId'
      }, {
        attr: 'venueid',
        verboseName: 'venueId'
      }, {
        attr: 'classificationname',
        verboseName: 'classificationName'
      }, {
        attr: 'city',
        verboseName: 'city'
      }, {
        attr: 'countrycode',
        verboseName: 'countryCode'
      }, {
        attr: 'source',
        verboseName: 'source'
      }];

      for (var i in params) {
        var item = params[i];
        if (this.isConfigAttrExistAndNotEmpty(item.attr)) attrs[item.verboseName] = this.config[item.attr];
      }

      if (this.config.latlong) {
        attrs.latlong = this.config.latlong.replace(/\s+/g, '');
      }

      if (this.isConfigAttrExistAndNotEmpty("period")) {
        var period = this.getDateFromPeriod(this.config.period);
        attrs.startDateTime = period[0];
        attrs.endDateTime = period[1];
      }

      if (this.widgetRoot.getAttribute("w-latlong") != null) {
        attrs.latlong = this.widgetRoot.getAttribute("w-latlong").replace(/\s+/g, '');
      }

      if (attrs.latlong == ',') {
        delete attrs.latlong;
      }

      if (attrs.latlong == null) {
        delete attrs.latlong;
      }

      return attrs;
    }
  }]);

  function TicketmasterEventDiscoveryWidget(root) {
    var _this = this;

    _classCallCheck(this, TicketmasterEventDiscoveryWidget);

    if (!root) return;
    this.widgetRoot = root;
    if (this.widgetRoot.querySelector('.events-root-container') === null) {
      this.setUniqueWidgetId();
      this.eventsRootContainer = document.createElement("div");
      this.eventsRootContainer.classList.add("events-root-container");
      this.widgetRoot.appendChild(this.eventsRootContainer);

      this.eventsRootDiv = document.createElement("div");
      this.eventsRootDiv.setAttribute("class", "ss");
      this.eventsRootDiv.setAttribute("ss-container", "");
      this.eventsRootContainer.appendChild(this.eventsRootDiv);

      this.eventsRoot = document.createElement("ul");
      this.eventsRoot.classList.add("events-root");
      this.eventsRootDiv.appendChild(this.eventsRoot);

      // Set theme modificators
      this.themeModificators = {
        "oldschool": this.oldSchoolModificator.bind(this),
        "newschool": this.newSchoolModificator.bind(this),
        "listview": this.listViewModificator.bind(this),
        "listviewthumbnails": this.listViewModificator.bind(this)
      };

      this.config = this.widgetRoot.attributes;
      this.listenerResize = [];

      if (this.config.theme !== null && !document.getElementById('widget-theme-' + this.config.theme)) {
        this.makeRequest(this.styleLoadingHandler, this.themeUrl + this.config.theme + ".css");
      }

      this.eventsRootContainer.classList.remove("border");
      if (this.config.border) {
        this.eventsRootContainer.classList.add("border");
      }

      this.widgetRoot.style.height = this.widgetHeight + 'px';
      this.widgetRoot.style.width = this.config.width + 'px';

      this.eventsRootContainer.style.height = this.widgetContentHeight + 'px';
      this.eventsRootContainer.style.width = this.config.width + 'px';
      this.eventsRootContainer.style.borderRadius = this.config.borderradius + 'px';
      this.eventsRootContainer.style.borderWidth = this.borderSize + 'px';

      //this.clear();

      this.AdditionalElements();

      this.getCoordinates(function () {
        _this.makeRequest(_this.eventsLoadingHandler, _this.apiUrl, _this.eventReqAttrs);
      });

      if (this.themeModificators.hasOwnProperty(this.widgetConfig.theme)) {
        this.themeModificators[this.widgetConfig.theme]();
      }

      /*plugins for 'buy button'*/
      this.embedUniversePlugin();
      this.embedTMPlugin();

      this.initBuyBtn();

      this.initMessage();

      if (!this.isListView || !this.isListViewThumbnails) this.initSliderControls();

      if (!this.isListView || !this.isListViewThumbnails) this.initEventCounter();

      if (this.isListView || this.isListViewThumbnails) this.addScroll();

      if (this.isFullWidth) {
        this.initFullWidth();
      }

      _widgetsAnalytics2.default.sendEvent(_widgetsAnalytics2.default.EVENT_CATEGORY.EVENT_DISCOVERY_WIDGET, _widgetsAnalytics2.default.EVENT_NAME.RENDERED);

      this.loadCustomStyle();
    }
  }

  _createClass(TicketmasterEventDiscoveryWidget, [{
    key: 'setRuleForStyleSheet',
    value: function setRuleForStyleSheet(styleSheet, selector, rule) {
      var widgetId = this.widgetRoot.getAttribute(_attributeNames.ATTRIBUTE_NAMES.ID);

      styleSheet.addRule('div[w-id=' + widgetId + '] ' + selector, rule);
      styleSheet.insertRule('div[w-id=' + widgetId + '] ' + selector + ' { ' + rule + ' }');
    }
  }, {
    key: 'getStyleSheetNode',
    value: function getStyleSheetNode() {
      var sheet = void 0;
      if (this.widgetRoot.getElementsByTagName('style')[0] === undefined) {
        var cusStyle = document.createElement('style');
        this.widgetRoot.appendChild(cusStyle);
        sheet = cusStyle.sheet;
      } else {
        sheet = this.widgetRoot.getElementsByTagName('style')[0].sheet;
      }
      return sheet;
    }
  }, {
    key: 'loadCustomStyle',
    value: function loadCustomStyle() {
      var _this2 = this;

      _attributeNames.CUSTOM_THEME_ATTRIBUTES.forEach(function (themeAttribute) {
        var attributeValue = _this2.widgetRoot.getAttribute(themeAttribute);
        if (attributeValue) {
          ELEMENTS_STYLED_BY_ATTRIBUTES[themeAttribute].forEach(function (element) {
            var value = element.getValue ? element.getValue(attributeValue) : attributeValue;
            _this2.setRuleForStyleSheet(_this2.getStyleSheetNode(), element.selector, element.stylePropName + ': ' + value);
          });
        }
      });
    }
  }, {
    key: 'getParseGoogleGeocodeResponse',
    value: function getParseGoogleGeocodeResponse(cb) {
      var widget = this;
      return function () {
        if (this && this.readyState === XMLHttpRequest.DONE) {
          var latlong = '',
              results = null,
              countryShortName = '';
          if (this.status === 200) {
            var response = JSON.parse(this.responseText);
            if (response.status === 'OK' && response.results.length) {
              // Filtering only white list countries
              results = response.results.filter(function (item) {
                return widget.countriesWhiteList.filter(function (elem) {
                  return elem === item.address_components[item.address_components.length - 1].long_name;
                }).length > 0;
              });

              if (results.length) {
                // sorting results by country name
                results.sort(function (f, g) {
                  var a = f.address_components[f.address_components.length - 1].long_name;
                  var b = g.address_components[g.address_components.length - 1].long_name;
                  if (a > b) {
                    return 1;
                  }
                  if (a < b) {
                    return -1;
                  }
                  return 0;
                });

                // Use first item if multiple results was found in one country or in different
                var geometry = results[0].geometry;
                countryShortName = results[0].address_components[results[0].address_components.length - 1].short_name;

                // If multiple results without country try to find USA as prefer value
                if (!widget.config.country) {
                  for (var i in results) {
                    var result = results[i];
                    if (result.address_components) {
                      var country = result.address_components[result.address_components.length - 1];
                      if (country) {
                        if (country.short_name === 'US') {
                          countryShortName = 'US';
                          geometry = result.geometry;
                        }
                      }
                    }
                  }
                }

                if (geometry) {
                  if (geometry.location) {
                    latlong = geometry.location.lat + ',' + geometry.location.lng;
                  }
                }
              } else {
                results = null;
              }
            }
          }
          // Used in builder
          if (widget.onLoadCoordinate) widget.onLoadCoordinate(results, countryShortName);
          widget.config.latlong = latlong;
          cb(widget.config.latlong);
        }
      };
    }
  }, {
    key: 'getCoordinates',
    value: function getCoordinates(cb) {
      var widget = this;
      if (this.isConfigAttrExistAndNotEmpty('postalcode')) {
        var args = { language: 'en', components: 'postal_code:' + widget.config.postalcode };
        if (widget.config.googleapikey) args.key = widget.config.googleapikey;
        if (this.config.country) args.components += '|country:' + this.config.country;
        this.makeRequest(this.getParseGoogleGeocodeResponse(cb), this.geocodeUrl, args);
      } else {
        // Used in builder
        if (widget.onLoadCoordinate) widget.onLoadCoordinate(null);
        widget.config.latlong = '';
        widget.config.country = '';
        cb(widget.config.latlong);
      }
    }
  }, {
    key: 'initBuyBtn',
    value: function initBuyBtn() {
      var _this3 = this;

      this.buyBtn = document.createElement("a");
      this.buyBtn.appendChild(document.createTextNode('BUY NOW'));
      this.buyBtn.classList.add("event-buy-btn");
      this.buyBtn.classList.add("main-btn");
      this.buyBtn.target = '_blank';
      this.buyBtn.setAttribute('data-enable-widget', '');
      this.buyBtn.href = '';
      this.buyBtn.addEventListener('click', function (e) {
        // e.preventDefault(); /*used in plugins for 'buy button'*/
        _this3.stopAutoSlideX();
        ga('send', 'event', 'DiscoveryClickBuyButton', 'click');
        ga('tmOpenPlatform.send', 'event', 'EventDiscoveryWidget', 'buyButtonClick');
      });
      this.eventsRootContainer.appendChild(this.buyBtn);
    }

    /**
     * Set position center/right
     *
     * @param url
     * @param isAddressCenter - if true : Set address position center/right for oldschool theme 300x250 (proportion :'m')
     */

  }, {
    key: 'updateTransition',
    value: function updateTransition(url, isAddressCenter) {
      var el = this.eventsRootContainer.querySelector(".event-logo.centered-logo");
      isAddressCenter ? el = this.eventsRootContainer.querySelectorAll(".event-date.centered-logo") : el = this.eventsRootContainer.querySelector(".event-logo.centered-logo");
      if (url !== '') {
        if (el && !isAddressCenter) {
          el.classList.add("right-logo");
          el.classList.remove("centered-logo");
        } else if (el) {
          var i = void 0;
          for (i = 0; i < el.length - 1; i++) {
            el[i].classList.remove("centered-logo");
          }
        }
      } else {
        isAddressCenter ? el = this.eventsRootContainer.querySelectorAll(".event-date") : el = this.eventsRootContainer.querySelector(".event-logo.right-logo");
        if (el && !isAddressCenter) {
          el.classList.remove("right-logo");
          el.classList.add("centered-logo");
        } else if (el) {
          var _i = void 0;
          for (_i = 0; _i < el.length - 1; _i++) {
            el[_i].classList.add("centered-logo");
          }
        }
      }
    }
  }, {
    key: 'setBuyBtnUrl',
    value: function setBuyBtnUrl() {
      if (this.buyBtn) {
        var event = this.eventsGroups[this.currentSlideX][this.currentSlideY],
            url = '';
        if (event) {
          if (event.url) {
            if (this.isUniversePluginInitialized && this.isUniverseUrl(event.url) || this.isTMPluginInitialized && this.isAllowedTMEvent(event.url)) {
              url = event.url;
            }

            if (this.config.theme === 'oldschool' && this.config.proportion === 'm') {
              this.updateTransition(url, true);
            } else {
              this.updateTransition(url);
            }
          }
        }
        this.buyBtn.href = url;
      }
    }
  }, {
    key: 'isUniverseUrl',
    value: function isUniverseUrl(url) {
      return !!url && (url.match(/universe.com/g) || url.match(/uniiverse.com/g) || url.match(/ticketmaster.com/g));
    }
  }, {
    key: 'isAllowedTMEvent',
    value: function isAllowedTMEvent(url) {
      var id = 0;
      if (url !== undefined) {
        for (var t = [/(?:ticketmaster\.com)\/(.*\/)?event\/([^\/?#]+)/, /(?:concerts\.livenation\.com)\/(.*\/)?event\/([^\/?#]+)/], n = null, r = 0; r < t.length && (n = url.match(t[r]), null === n); r++) {}
        id = null !== n ? n[2] : void 0;
      } else {
        var _id = 0;
      }
      return this.tmWidgetWhiteList.indexOf(id) > -1;
    }
  }, {
    key: 'embedTMPlugin',
    value: function embedTMPlugin() {
      var id = 'id_tm_widget';
      if (!document.getElementById(id)) {
        var script = document.createElement('script');
        script.setAttribute('src', this.portalUrl + 'scripts/vendors/tm.js');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('charset', 'UTF-8');
        script.setAttribute('id', id);
        (document.head || document.getElementsByTagName('head')[0]).appendChild(script);
      }
      this.isTMPluginInitialized = true;
    }
  }, {
    key: 'embedUniversePlugin',
    value: function embedUniversePlugin() {
      var id = 'id_universe_widget';
      if (!document.getElementById(id)) {
        var script = document.createElement('script');
        script.setAttribute('src', 'https://www.universe.com/embed.js');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('charset', 'UTF-8');
        script.setAttribute('id', id);
        (document.head || document.getElementsByTagName('head')[0]).appendChild(script);
      }
      this.isUniversePluginInitialized = true;
    }

    // Message

  }, {
    key: 'initMessage',
    value: function initMessage() {
      var _this4 = this;

      this.messageDialog = document.createElement('div');
      this.messageDialog.classList.add("event-message");
      this.messageContent = document.createElement('div');
      this.messageContent.classList.add("event-message__content");

      var messageClose = document.createElement('div');
      messageClose.classList.add("event-message__btn");
      messageClose.addEventListener("click", function () {
        _this4.hideMessage();
      });

      this.messageDialog.appendChild(this.messageContent);
      this.messageDialog.appendChild(messageClose);
      this.eventsRootContainer.appendChild(this.messageDialog);
    }
  }, {
    key: 'showMessage',
    value: function showMessage(message, hideMessageWithoutDelay) {
      if (message.length) {
        this.hideMessageWithoutDelay = hideMessageWithoutDelay;
        this.messageContent.innerHTML = message;
        this.messageDialog.classList.add("event-message-visible");
        if (this.messageTimeout) {
          clearTimeout(this.messageTimeout); // Clear timeout if before 'hideMessageWithDelay' was called
        }
      }
    }
  }, {
    key: 'hideMessageWithDelay',
    value: function hideMessageWithDelay(delay) {
      var _this5 = this;

      if (this.messageTimeout) clearTimeout(this.messageTimeout); // Clear timeout if this method was called before
      this.messageTimeout = setTimeout(function () {
        _this5.hideMessage();
      }, delay);
    }
  }, {
    key: 'hideMessage',
    value: function hideMessage() {
      if (this.messageTimeout) clearTimeout(this.messageTimeout); // Clear timeout and hide message immediately.
      this.messageDialog.classList.remove("event-message-visible");
    }
    // End message

  }, {
    key: 'AdditionalElements',
    value: function AdditionalElements() {
      var legalNoticeContent = document.createTextNode('Legal Notice'),
          legalNotice = document.createElement("a");
      legalNotice.appendChild(legalNoticeContent);
      legalNotice.classList.add("legal-notice");
      legalNotice.target = '_blank';
      legalNotice.href = this.legalNoticeUrl;
      this.widgetRoot.appendChild(legalNotice);

      var logo = document.createElement('a');
      logo.classList.add("event-logo", "centered-logo");
      logo.target = '_blank';
      logo.href = this.logoUrl;
      logo.innerHTML = 'Powered by ';

      var logoBox = document.createElement('div');
      logoBox.classList.add("event-logo-box");
      logoBox.appendChild(logo);
      this.eventsRootContainer.appendChild(logoBox);

      var question = document.createElement('span'),
          toolTip = document.createElement('div'),
          tooltipHtml = '\n      <div class="tooltip-inner"> \n        <a href="' + this.questionUrl + '" target = "_blank" >About widget</a>\n        <div class="place">version: <b>' + this.widgetVersion + '</b></div>\n      </div>';
      question.classList.add("event-question");
      question.addEventListener('click', toolTipHandler);
      toolTip.classList.add("tooltip-version");
      toolTip.classList.add("left");
      toolTip.innerHTML = tooltipHtml;
      this.eventsRootContainer.appendChild(question);
      this.eventsRootContainer.appendChild(toolTip);

      function toolTipHandler(e) {
        e.preventDefault();
        e.target.nextSibling.classList.toggle('show-tip');
      }
    }

    //adds general admission element for OLDSCHOOL theme

  }, {
    key: 'oldSchoolModificator',
    value: function oldSchoolModificator() {

      var generalAdmissionWrapper = document.createElement("div");
      generalAdmissionWrapper.classList.add("general-admission", "modificator");

      var generalAdmission = document.createElement("div"),
          generalAdmissionText = document.createTextNode('GENERAL ADMISSION');
      generalAdmission.appendChild(generalAdmissionText);
      generalAdmissionWrapper.appendChild(generalAdmission);

      this.eventsRootContainer.appendChild(generalAdmissionWrapper);
    }
  }, {
    key: 'newSchoolModificator',
    value: function newSchoolModificator() {
      var ticketLogo = document.createElement("div");
      ticketLogo.classList.add("ticket-logo", "modificator");

      for (var i = 0; i < 4; i++) {
        var headLogo = document.createElement("img");
        headLogo.setAttribute("src", this.portalUrl + "assets/widgets/1.0.0/img/ticketmaster-logo-white.svg");
        headLogo.setAttribute("height", "11");
        ticketLogo.appendChild(headLogo);
      }

      this.eventsRootContainer.appendChild(ticketLogo);
    }
  }, {
    key: 'listViewModificator',
    value: function listViewModificator() {}
  }, {
    key: 'hideSliderControls',
    value: function hideSliderControls() {
      this.prevEventX.classList.add(this.controlHiddenClass);
      this.nextEventX.classList.add(this.controlHiddenClass);
      this.prevEventY.classList.add(this.controlHiddenClass);
      this.nextEventY.classList.add(this.controlHiddenClass);
    }
  }, {
    key: 'toggleControlsVisibility',
    value: function toggleControlsVisibility() {
      // Horizontal
      if (this.slideCountX > 1) {
        this.prevEventX.classList.remove(this.controlHiddenClass);
        this.nextEventX.classList.remove(this.controlHiddenClass);
        if (this.currentSlideX === 0) {
          this.prevEventX.classList.add(this.controlHiddenClass);
        } else if (this.currentSlideX === this.slideCountX - 1) {
          this.nextEventX.classList.add(this.controlHiddenClass);
        }
      } else {
        this.prevEventX.classList.add(this.controlHiddenClass);
        this.nextEventX.classList.add(this.controlHiddenClass);
      }

      // Vertical
      if (this.eventsGroups.length) {
        if (this.eventsGroups[this.currentSlideX].length > 1) {
          this.prevEventY.classList.remove(this.controlHiddenClass);
          this.nextEventY.classList.remove(this.controlHiddenClass);
          if (this.currentSlideY === 0) {
            this.prevEventY.classList.add(this.controlHiddenClass);
          } else if (this.currentSlideY === this.eventsGroups[this.currentSlideX].length - 1) {
            this.nextEventY.classList.add(this.controlHiddenClass);
          }
        } else {
          this.prevEventY.classList.add(this.controlHiddenClass);
          this.nextEventY.classList.add(this.controlHiddenClass);
        }
      } else {
        this.prevEventY.classList.add(this.controlHiddenClass);
        this.nextEventY.classList.add(this.controlHiddenClass);
      }
    }
  }, {
    key: 'prevSlideX',
    value: function prevSlideX() {
      if (this.currentSlideX > 0) {
        this.setSlideManually(this.currentSlideX - 1, true);
      }
    }
  }, {
    key: 'nextSlideX',
    value: function nextSlideX() {
      if (this.slideCountX - 1 > this.currentSlideX) {
        this.setSlideManually(this.currentSlideX + 1, true);
      }
    }
  }, {
    key: 'prevSlideY',
    value: function prevSlideY() {
      if (this.currentSlideY > 0) {
        this.setSlideManually(this.currentSlideY - 1, false);
      }
    }
  }, {
    key: 'nextSlideY',
    value: function nextSlideY() {
      if (this.eventsGroups[this.currentSlideX].length - 1 > this.currentSlideY) {
        this.setSlideManually(this.currentSlideY + 1, false);
      }
    }
  }, {
    key: 'setSlideManually',
    value: function setSlideManually(slideIndex, isDirectionX) {
      var _this6 = this;

      this.stopAutoSlideX();
      this.sliderTimeout = setTimeout(function () {
        _this6.runAutoSlideX();
      }, this.sliderRestartDelay);
      if (isDirectionX) this.goToSlideX(slideIndex);else this.goToSlideY(slideIndex);
    }
  }, {
    key: 'goToSlideX',
    value: function goToSlideX(slideIndex) {
      if (this.currentSlideX === slideIndex) return;
      this.currentSlideY = 0;
      this.currentSlideX = slideIndex;
      this.eventsRoot.style.marginLeft = '-' + this.currentSlideX * 100 + '%';
      this.toggleControlsVisibility();
      this.setEventsCounter();
      this.setBuyBtnUrl();
    }
  }, {
    key: 'goToSlideY',
    value: function goToSlideY(slideIndex) {
      if (this.currentSlideY === slideIndex) return;
      this.currentSlideY = slideIndex;
      var eventGroup = this.eventsRoot.getElementsByClassName("event-group-" + this.currentSlideX);
      if (eventGroup.length) {
        eventGroup = eventGroup[0];
        eventGroup.style.marginTop = '-' + this.currentSlideY * (this.widgetContentHeight - this.borderSize * 2) + 'px';
        this.toggleControlsVisibility();
        this.setBuyBtnUrl();
      }
    }
  }, {
    key: 'runAutoSlideX',
    value: function runAutoSlideX() {
      var _this7 = this;

      if (this.slideCountX > 1) {
        this.sliderInterval = setInterval(function () {
          var slideIndex = 0;
          if (_this7.slideCountX - 1 > _this7.currentSlideX) slideIndex = _this7.currentSlideX + 1;
          _this7.goToSlideX(slideIndex);
        }, this.sliderDelay);
      }
    }
  }, {
    key: 'stopAutoSlideX',
    value: function stopAutoSlideX() {
      if (this.sliderTimeout) clearTimeout(this.sliderTimeout);
      if (this.sliderInterval) clearInterval(this.sliderInterval);
    }
  }, {
    key: 'initSliderControls',
    value: function initSliderControls() {
      var _this8 = this;

      this.currentSlideX = 0;
      this.currentSlideY = 0;
      this.slideCountX = 0;
      var coreCssClass = 'events_control';

      // left btn
      this.prevEventX = document.createElement("div");
      var prevEventXClass = [coreCssClass, coreCssClass + '-horizontal', coreCssClass + '-left', this.controlHiddenClass];
      for (var i in prevEventXClass) {
        this.prevEventX.classList.add(prevEventXClass[i]);
      }
      this.eventsRootContainer.appendChild(this.prevEventX);

      // right btn
      this.nextEventX = document.createElement("div");
      var nextEventXClass = [coreCssClass, coreCssClass + '-horizontal', coreCssClass + '-right', this.controlHiddenClass];
      for (var _i2 in nextEventXClass) {
        this.nextEventX.classList.add(nextEventXClass[_i2]);
      }
      this.eventsRootContainer.appendChild(this.nextEventX);

      // top btn
      this.prevEventY = document.createElement("div");
      var prevEventYClass = [coreCssClass, coreCssClass + '-vertical', coreCssClass + '-top', this.controlHiddenClass];
      for (var _i3 in prevEventYClass) {
        this.prevEventY.classList.add(prevEventYClass[_i3]);
      }
      this.eventsRootContainer.appendChild(this.prevEventY);

      // bottom btn
      this.nextEventY = document.createElement("div");
      var nextEventYClass = [coreCssClass, coreCssClass + '-vertical', coreCssClass + '-bottom', this.controlHiddenClass];
      for (var _i4 in nextEventYClass) {
        this.nextEventY.classList.add(nextEventYClass[_i4]);
      }
      this.eventsRootContainer.appendChild(this.nextEventY);

      // Restore events group position
      function whichTransitionEvent() {
        var el = document.createElement('fakeelement'),
            transitions = {
          'transition': 'transitionend',
          'OTransition': 'oTransitionEnd',
          'MozTransition': 'transitionend',
          'WebkitTransition': 'webkitTransitionEnd'
        };

        for (var event in transitions) {
          if (el.style[event] !== undefined) return transitions[event];
        }
      }

      var transitionEvent = whichTransitionEvent();
      transitionEvent && this.eventsRoot.addEventListener(transitionEvent, function (e) {
        if (_this8.eventsRoot !== e.target) return;
        var eventGroup = _this8.eventsRoot.getElementsByClassName("event-group");
        // Reset all groups. We don't know what event group was visible before.
        for (var _i5 = 0; eventGroup.length > _i5; _i5++) {
          eventGroup[_i5].style.marginTop = 0;
        }
      });

      // Arrows
      this.prevEventX.addEventListener("click", function () {
        _this8.prevSlideX();
      });

      this.nextEventX.addEventListener("click", function () {
        _this8.nextSlideX();
      });

      this.prevEventY.addEventListener("click", function () {
        _this8.prevSlideY();
      });

      this.nextEventY.addEventListener("click", function () {
        _this8.nextSlideY();
      });

      // Tough device swipes
      var xDown = null,
          yDown = null;

      function handleTouchStart(evt) {
        xDown = evt.touches[0].clientX;
        yDown = evt.touches[0].clientY;
      }

      function handleTouchMove(evt) {
        if (!xDown || !yDown) return;

        var xUp = evt.touches[0].clientX,
            yUp = evt.touches[0].clientY,
            xDiff = xDown - xUp,
            yDiff = yDown - yUp;

        if (Math.abs(xDiff) > Math.abs(yDiff)) {
          if (xDiff > 0) this.nextSlideX(); // left swipe
          else this.prevSlideX(); // right swipe
        } else {
          if (yDiff > 0) this.nextSlideY(); // up swipe
          else this.prevSlideY(); // down swipe
        }

        xDown = null;
        yDown = null;
      }

      this.eventsRootContainer.addEventListener('touchstart', function (e) {
        handleTouchStart.call(_this8, e);
      }, false);
      this.eventsRootContainer.addEventListener('touchmove', function (e) {
        handleTouchMove.call(_this8, e);
      }, false);
    }
  }, {
    key: 'initSlider',
    value: function initSlider() {
      if (this.sliderInterval) clearInterval(this.sliderInterval);
      if (this.sliderTimeout) clearTimeout(this.sliderTimeout);
      this.slideCountX = this.eventsGroups.length;
      this.eventsRoot.style.marginLeft = '0%';
      this.eventsRoot.style.width = this.isFullWidth ? this.slideCountX * this.widgetRoot.offsetWidth + 'px' : this.slideCountX * 100 + '%';
      this.currentSlideX = 0;
      this.currentSlideY = 0;
      this.runAutoSlideX();

      if (this.isFullWidth) {
        var resizeThrottler = function resizeThrottler() {
          // ignore resize events as long as an actualResizeHandler execution is in the queue
          if (!resizeTimeout) {
            resizeTimeout = setTimeout(function () {
              resizeTimeout = null;
              _actualResizeHandler();

              // The actualResizeHandler will execute at a rate of 15fps
            }, 66);
          }
        };

        var _actualResizeHandler = function _actualResizeHandler() {
          // handle the resize event
          list.forEach(function (item) {
            item.style.width = me.widgetRoot.offsetWidth + 'px';
            item.style.height = me.widgetRoot.widgetContentHeight + 'px';
          });

          me.eventsRoot.style.width = me.isFullWidth ? me.slideCountX * me.widgetRoot.offsetWidth + 'px' : me.slideCountX * 100 + '%';
        };

        var list = this.widgetRoot.querySelectorAll('li'),
            me = this,
            resizeTimeout = void 0;

        window.addEventListener('resize', resizeThrottler, false);
        this.listenerResize.push(resizeThrottler);
      } else if (this.listenerResize && this.listenerResize.length !== 0) {
        window.removeEventListener("resize", this.listenerResize[0], false);
        this.listenerResize.pop();
      }

      this.toggleControlsVisibility();
      this.setBuyBtnUrl();
    }
  }, {
    key: 'initFullWidth',
    value: function initFullWidth() {
      var heightStatic = 550;
      this.config.width = '100%';
      this.config.height = heightStatic;
      this.widgetRoot.style.width = '100%';
      this.widgetRoot.style.height = heightStatic + 'px';
      this.widgetRoot.style.display = 'block';
      this.eventsRootContainer.style.width = '100%';
      this.eventsRootContainer.style.height = this.widgetContentHeight + 'px';
    }
  }, {
    key: 'formatDate',
    value: function formatDate(date) {
      var result = '';
      if (date === undefined) return result;
      if (!date.day) return result; // Day is required

      function LZ(x) {
        return (x < 0 || x > 9 ? "" : "0") + x;
      }
      var MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          dayArray = date.day.split('-'),
          d = parseInt(dayArray[2]),
          M = parseInt(dayArray[1]);

      // var E = new Date(date.day).getDay();
      var E = new Date(+date.day.split('-')[0], +date.day.split('-')[1] - 1, +date.day.split('-')[2]).getDay();
      result = DAY_NAMES[E] + ', ' + MONTH_NAMES[M - 1] + ' ' + d + ', ' + dayArray[0];

      if (!date.time) return result;

      var timeArray = date.time.split(':'),
          H = parseInt(timeArray[0]),
          m = timeArray[1],
          a = "AM";

      if (H > 11) a = "PM";
      if (H == 0) {
        H = 12;
      } else if (H > 12) {
        H = H - 12;
      }

      return result + ' ' + LZ(H) + ':' + m + ' ' + a;
    }
  }, {
    key: 'clearEvents',
    value: function clearEvents() {
      this.eventsRoot.innerHTML = "";
    }
  }, {
    key: 'clear',
    value: function clear() {
      var modificatorList = this.widgetRoot.getElementsByClassName('modificator');
      while (modificatorList.length) {
        var el = modificatorList[0],
            parent = el.parentNode;
        parent.removeChild(el);
      }

      if (!this.isListView && !this.isListViewThumbnails) {
        var eventsRootContainer = document.getElementsByClassName("events-root-container")[0];
        var eventsRoot = document.getElementsByClassName("events-root")[0];
        var ss = document.getElementsByClassName("ss")[0];
        ss.parentNode.removeChild(ss);

        var ssDiv = document.createElement("div");
        ssDiv.setAttribute("class", "ss");
        eventsRootContainer.appendChild(ssDiv);

        var ssDiv = document.getElementsByClassName("ss")[0];
        ssDiv.appendChild(eventsRoot);

        var eventsRootContainer = document.getElementsByClassName("widget-container--discovery")[0];
        eventsRootContainer.classList.remove("listview-after");
      }

      if (this.isListView || this.isListViewThumbnails || this.isFullWidth) {
        var eventsRootContainer = document.getElementsByClassName("widget-container--discovery")[0];
        eventsRootContainer.classList.add("listview-after");
      }

      this.clearEvents();
    }
  }, {
    key: 'update',
    value: function update() {
      var _this9 = this;

      var oldTheme = this.config.constructor();
      for (var attr in this.config) {
        if (this.config.hasOwnProperty(attr)) oldTheme[attr] = this.config[attr];
      }

      this.config = this.widgetRoot.attributes;

      if (this.isListView || this.isListViewThumbnails) {
        this.stopAutoSlideX();
      }
      if (!this.isFullWidth) {
        this.widgetRoot.style.height = this.widgetHeight + 'px';
        this.widgetRoot.style.width = this.config.width + 'px';
        this.eventsRootContainer.style.height = this.widgetContentHeight + 'px';
        this.eventsRootContainer.style.width = this.config.width + 'px';
      }
      this.eventsRootContainer.style.borderRadius = this.config.borderradius + 'px';
      this.eventsRootContainer.style.borderWidth = this.borderSize + 'px';

      this.eventsRootContainer.classList.remove("border");
      if (this.config.hasOwnProperty("border")) {
        this.eventsRootContainer.classList.add("border");
      }

      if (!this.needToUpdate(this.config, oldTheme, this.updateExceptions) || this.needToUpdate(this.config, oldTheme, this.updateExceptions)) {
        this.clear();

        if (this.themeModificators.hasOwnProperty(this.widgetConfig.theme)) {
          this.themeModificators[this.widgetConfig.theme]();
        }

        this.getCoordinates(function () {
          _this9.makeRequest(_this9.eventsLoadingHandler, _this9.apiUrl, _this9.eventReqAttrs);
        });

        if (this.isListView || this.isListViewThumbnails) this.addScroll();
        if (this.isFullWidth) {
          this.initFullWidth();
        }
      } else {
        var events = this.eventsRoot.getElementsByClassName("event-wrapper");
        for (var i in events) {
          if (events.hasOwnProperty(i) && events[i].style !== undefined) {
            events[i].style.width = this.config.width - this.borderSize * 2 + 'px';
            events[i].style.height = this.widgetContentHeight - this.borderSize * 2 + 'px';
          }
        }
        if (!this.isListView && !this.isListViewThumbnails) {
          this.goToSlideY(0);
        }
      }

      this.loadCustomStyle();
    }
  }, {
    key: 'needToUpdate',
    value: function needToUpdate(newTheme, oldTheme) {
      var forCheck = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

      return Object.keys(newTheme).map(function (key) {
        if (forCheck.indexOf(key) > -1) return true;
        return newTheme[key] === oldTheme[key];
      }).indexOf(false) > -1;
    }
  }, {
    key: 'loadConfig',
    value: function loadConfig(NamedNodeMap) {
      var config = {};
      Object.keys(NamedNodeMap).map(function (value) {
        if (typeof NamedNodeMap[value].name !== "undefined" && NamedNodeMap[value].name.indexOf("w-") !== -1) {
          config[NamedNodeMap[value].name.replace(/w-/g, "").replace(/-/g, "")] = NamedNodeMap[value].value;
        }
      });
      return config;
    }
  }, {
    key: 'styleLoadingHandler',
    value: function styleLoadingHandler() {
      if (this && this.readyState == XMLHttpRequest.DONE) {
        if (this.status == 200) {
          var style = document.createElement("style");
          style.setAttribute("type", "text/css");
          style.setAttribute("id", 'widget-theme-' + this.widget.config.theme);
          style.textContent = this.responseText;
          document.getElementsByTagName("head")[0].appendChild(style);
        } else {
          console.log("theme wasn't loaded");
        }
      }
    }
  }, {
    key: 'groupEventsByName',
    value: function groupEventsByName() {
      var groups = {};
      this.events.map(function (event) {
        if (groups[event.name] === undefined) groups[event.name] = [];
        groups[event.name].push(event);
      });
      this.eventsGroups = [];
      for (var groupName in groups) {
        this.eventsGroups.push(groups[groupName]);
      }
    }
  }, {
    key: 'initEventCounter',
    value: function initEventCounter() {
      this.eventsCounter = document.createElement("div");
      this.eventsCounter.classList.add("events-counter");
      this.widgetRoot.appendChild(this.eventsCounter);
    }
  }, {
    key: 'setEventsCounter',
    value: function setEventsCounter() {
      if (this.eventsCounter) {
        var text = '';
        if (this.eventsGroups.length) {
          if (this.eventsGroups.length > 1) {
            text = this.currentSlideX + 1 + ' of ' + this.eventsGroups.length + ' events';
          } else {
            text = '1 event';
          }
        }
        this.eventsCounter.innerHTML = text;
      }
    }
  }, {
    key: 'resetReduceParamsOrder',
    value: function resetReduceParamsOrder() {
      this.reduceParamsOrder = 0;
    }
  }, {
    key: 'reduceParamsAndReloadEvents',
    value: function reduceParamsAndReloadEvents() {
      var eventReqAttrs = {},
          reduceParamsList = [['classificationName'], ['city'], ['countryCode'], ['source'], ['startDateTime', 'endDateTime', 'country'], ['radius'], ['postalCode', 'latlong'], ['attractionId'], ['promoterId'],
      // ['segmentId'],
      ['venueId'], ['keyword'], ['size']];

      // make copy of params
      for (var key in this.eventReqAttrs) {
        eventReqAttrs[key] = this.eventReqAttrs[key];
      }

      if (!this.reduceParamsOrder) this.reduceParamsOrder = 0;
      if (reduceParamsList.length > this.reduceParamsOrder) {
        for (var item in reduceParamsList) {
          if (this.reduceParamsOrder >= item) {
            for (var i in reduceParamsList[item]) {
              delete eventReqAttrs[reduceParamsList[item][i]];
            }
          }
        }

        if (this.reduceParamsOrder === 0) this.showMessage("No results were found.<br/>Here other options for you.");
        this.reduceParamsOrder++;
        this.makeRequest(this.eventsLoadingHandler, this.apiUrl, eventReqAttrs);
      } else {
        // We haven't any results
        this.showMessage("No results were found.", true);
        this.reduceParamsOrder = 0;
        this.hideSliderControls();
        document.querySelector('.event-buy-btn.main-btn').setAttribute('href', '');
        this.stopAutoSlideX();
      }
    }
  }, {
    key: 'eventsLoadingHandler',
    value: function eventsLoadingHandler() {
      var widget = this.widget;
      var groupByNameSortingField = 'groupByName';
      widget.clearEvents(); // Additional clearing after each loading
      if (this && this.readyState == XMLHttpRequest.DONE) {
        if (this.status == 200) {
          widget.events = JSON.parse(this.responseText);
          if (widget.events.length) {
            var sorting = widget.widgetRoot.getAttribute('w-sorting');
            if (sorting == groupByNameSortingField || !sorting) {
              widget.groupEventsByName.call(widget);
              widget.eventsGroups.map(function (group, i) {
                if (group.length === 1) {
                  widget.publishEvent(group[0]);
                } else {
                  widget.publishEventsGroup.call(widget, group, i);
                }
              });
            } else {
              widget.eventsGroups = widget.events;
              widget.eventsGroups.map(function (group) {
                widget.publishEvent(group);
              });
            }

            if (!widget.isListView && !widget.isListViewThumbnails) widget.initSlider();

            widget.setEventsCounter();
            widget.resetReduceParamsOrder();
            if (widget.hideMessageWithoutDelay) {
              widget.hideMessage();
            } else {
              widget.hideMessageWithDelay(widget.hideMessageDelay);
            }
          } else {
            widget.reduceParamsAndReloadEvents.call(widget);
          }
        } else {
          widget.reduceParamsAndReloadEvents.call(widget);
          console.log('something else other than 200 was returned');
        }
      }
    }
  }, {
    key: 'publishEventsGroup',
    value: function publishEventsGroup(group, index) {
      var _this10 = this;

      var groupNodeWrapper = document.createElement("li");
      groupNodeWrapper.classList.add("event-wrapper");
      groupNodeWrapper.classList.add("event-group-wrapper");

      groupNodeWrapper.style.width = !this.isFullWidth ? this.config.width - this.borderSize * 2 + 'px' : this.widgetRoot.offsetWidth - this.borderSize * 2 + 'px';
      groupNodeWrapper.style.height = !this.isFullWidth ? this.widgetContentHeight - this.borderSize * 2 + 'px' : this.widgetContentHeight - this.borderSize * 2 + 'px';

      var groupNode = document.createElement("ul");
      groupNode.classList.add("event-group");
      groupNode.classList.add("event-group-" + index);

      group.map(function (event) {
        _this10.publishEvent(event, groupNode);
      });

      groupNodeWrapper.appendChild(groupNode);
      this.eventsRoot.appendChild(groupNodeWrapper);
    }
  }, {
    key: 'publishEvent',
    value: function publishEvent(event, parentNode) {
      parentNode = parentNode || this.eventsRoot;
      var DOMElement = this.createDOMItem(event);
      parentNode.appendChild(DOMElement);
    }
  }, {
    key: 'getEventByID',
    value: function getEventByID(id) {
      for (var index in this.events) {
        if (this.events.hasOwnProperty(index) && this.events[index].id === id) {
          return this.events[index];
        }
      }
    }
  }, {
    key: 'getImageForEvent',
    value: function getImageForEvent(images, isGetSmallest, isSecondSmallest) {
      var width = this.config.width,
          height = this.widgetContentHeight;

      if (width === '100%') {
        width = this.widgetRoot.offsetWidth;
      }
      images.sort(function (a, b) {
        if (a.width < b.width) return -1;else if (a.width > b.width) return 1;else return 0;
      });

      var myImg = "";
      images.forEach(function (element) {
        if (element.width >= width && element.height >= height && !myImg) {
          myImg = element.url;
        }
      });

      if (isGetSmallest) {
        myImg = images[0].url;
        if (isSecondSmallest) {
          myImg = images[2].url;
        }
      }
      return myImg;
    }
  }, {
    key: 'parseEvents',
    value: function parseEvents(eventsSet) {
      if (!eventsSet._embedded) {
        if (typeof $widgetModalNoCode !== "undefined") {
          $widgetModalNoCode.modal();
        }
        return [];
      }
      eventsSet = eventsSet._embedded.events;
      var tmpEventSet = [];

      for (var key in eventsSet) {
        if (eventsSet.hasOwnProperty(key)) {
          var currentEvent = {};

          currentEvent.id = eventsSet[key].id;
          currentEvent.url = eventsSet[key].url;
          currentEvent.name = eventsSet[key].name;

          /* Change URL [START] */
          var parser = document.createElement("a");
          parser.href = currentEvent.url;
          var expr = "/ticketmaster.evyy.net/";
          if (parser.href.match(expr) !== null) {
            var changeURL = parser.pathname.split('/');
            changeURL[3] = '330564';
            currentEvent.url = parser.origin + changeURL.join('/') + parser.search + parser.hash;
          }
          /* Change URL [END] */

          currentEvent.date = {
            day: eventsSet[key].dates.start.localDate,
            time: eventsSet[key].dates.start.localTime
          };

          if (eventsSet[key].hasOwnProperty('_embedded') && eventsSet[key]._embedded.hasOwnProperty('venues')) {
            var venue = eventsSet[key]._embedded.venues[0];
            if (venue) {
              if (venue.address) currentEvent.address = venue.address;

              if (venue.name) {
                if (!currentEvent.address) currentEvent.address = {};
                currentEvent.address.name = venue.name;
              }
            }
          }

          // Remove this comment to get categories
          /*if(eventsSet[key]._embedded.hasOwnProperty('categories')){
            currentEvent.categories = [];
            let eventCategories = eventsSet[key]._embedded.categories;
            currentEvent.categories = Object.keys(eventCategories).map(function(category){
              return eventCategories[category].name
            });
          }*/
          currentEvent.img = this.getImageForEvent(eventsSet[key].images, this.isListViewThumbnails, this.isFullWidth); //*this.listViewModificator() - is boolean*/

          tmpEventSet.push(currentEvent);
        }
      }
      return tmpEventSet;
    }
  }, {
    key: 'makeRequest',
    value: function makeRequest(handler) {
      var url = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.apiUrl;
      var attrs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var method = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "GET";

      attrs = Object.keys(attrs).map(function (key) {
        return key + '=' + attrs[key];
      }).join("&");

      url = [url, attrs].join("?");
      if (this.widgetRoot.getAttribute('w-postalcodeapi') != null) url += '&postalCode=' + this.widgetRoot.getAttribute('w-postalcodeapi');
      url += '&sort=date,asc';

      this.xmlHTTP = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
      if (method == "POST") {
        this.xmlHTTP.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      }
      this.xmlHTTP.widget = this;
      this.xmlHTTP.onreadystatechange = handler;
      this.xmlHTTP.open(method, url, true);
      this.xmlHTTP.send();
    }
  }, {
    key: 'initPretendedLink',
    value: function initPretendedLink(el, url, isBlank) {
      if (el && url) {
        el.setAttribute('data-url', url);
        el.classList.add("event-pretended-link");
        el.addEventListener('click', function () {
          var url = this.getAttribute('data-url');
          if (url) {
            var win = window.open(url, isBlank ? '_blank' : '_self');
            win.focus();
          }
        });
        el.addEventListener('touchend', function () {
          var url = this.getAttribute('data-url');
          if (url) {
            var win = window.open(url, isBlank ? '_blank' : '_self');
            if (win) {
              win.focus();
            }
          }
        });
      }
      return el;
    }
  }, {
    key: 'createBackgroundImage',
    value: function createBackgroundImage(event, img) {
      if (!this.isListView && !this.isListViewThumbnails) {
        var image = document.createElement("span");
        image.classList.add("bg-cover");
        image.style.backgroundImage = 'url(\'' + img + '\')';
        event.appendChild(image);
      }
      if (this.isListViewThumbnails) {
        var wrapperImg = document.createElement("div"),
            image = document.createElement("span");

        wrapperImg.classList.add("wrapper-thumbnails");
        image.classList.add('bg-cover-thumbnails');
        image.style.backgroundImage = 'url(\'' + img + '\')';
        if (!img) {
          image.classList.add('bg-cover-default');
          image.removeAttribute('style');
        }
        wrapperImg.appendChild(image);
        event.appendChild(wrapperImg);

        return wrapperImg;
      }
    }
  }, {
    key: 'addBarcode',
    value: function addBarcode(domNode, url) {
      if (this.isBarcodeWidget) {
        var barcodeBtn = document.createElement("a");
        barcodeBtn.classList.add("barcode");
        barcodeBtn.target = '_blank';
        barcodeBtn.href = url;
        barcodeBtn.addEventListener('click', function (e) {
          e.preventDefault();
          ga('send', 'event', 'DiscoveryClickEventName', 'click');
          ga('tmOpenPlatform.send', 'event', 'EventDiscoveryWidget', 'eventNameClick');
        });
        domNode.appendChild(barcodeBtn);
        var bottomBg = document.createElement("span");
        bottomBg.classList.add("barcode-bottom");
        domNode.appendChild(bottomBg);
      }
    }
  }, {
    key: 'addBuyButton',
    value: function addBuyButton(domNode, url) {
      if (this.isListView || this.isListViewThumbnails) {
        var _urlValid = this.isUniversePluginInitialized && this.isUniverseUrl(url) || this.isTMPluginInitialized && this.isAllowedTMEvent(url);
        if (!_urlValid) url = '';
        var buyBtn = document.createElement("a");
        buyBtn.appendChild(document.createTextNode('BUY NOW'));
        buyBtn.classList.add("event-buy-btn");
        buyBtn.target = '_blank';
        buyBtn.href = url;
        buyBtn.addEventListener('click', function (e) {
          e.preventDefault();
          ga('send', 'event', 'DiscoveryClickBuyButton', 'click');
          ga('tmOpenPlatform.send', 'event', 'EventDiscoveryWidget', 'buyButtonClick');
        });
        domNode.appendChild(buyBtn);
      }
    }
  }, {
    key: 'addSimpleScrollBar',
    value: function addSimpleScrollBar() {
      (function (n, t) {
        function u(n) {
          n.hasOwnProperty("data-simple-scrollbar") || Object.defineProperty(n, "data-simple-scrollbar", new SimpleScrollbar(n));
        }function e(n, i) {
          function f(n) {
            var t = n.pageY - u;u = n.pageY;r(function () {
              i.el.scrollTop += t / i.scrollRatio;
            });
          }function e() {
            n.classList.remove("ss-grabbed");t.body.classList.remove("ss-grabbed");t.removeEventListener("mousemove", f);t.removeEventListener("mouseup", e);
          }var u;n.addEventListener("mousedown", function (i) {
            return u = i.pageY, n.classList.add("ss-grabbed"), t.body.classList.add("ss-grabbed"), t.addEventListener("mousemove", f), t.addEventListener("mouseup", e), !1;
          });
        }function i(n) {
          for (this.target = n, this.bar = '<div class="ss-scroll">', this.wrapper = t.createElement("div"), this.wrapper.setAttribute("class", "ss-wrapper"), this.el = t.createElement("div"), this.el.setAttribute("class", "ss-content"), this.wrapper.appendChild(this.el); this.target.firstChild;) {
            this.el.appendChild(this.target.firstChild);
          }this.target.appendChild(this.wrapper);this.target.insertAdjacentHTML("beforeend", this.bar);this.bar = this.target.lastChild;e(this.bar, this);this.moveBar();this.el.addEventListener("scroll", this.moveBar.bind(this));this.el.addEventListener("mouseenter", this.moveBar.bind(this));this.target.classList.add("ss-container");
        }function f() {
          for (var i = t.querySelectorAll("*[ss-container]"), n = 0; n < i.length; n++) {
            u(i[n]);
          }
        }var r = n.requestAnimationFrame || n.setImmediate || function (n) {
          return setTimeout(n, 0);
        };i.prototype = { moveBar: function moveBar() {
            var t = this.el.scrollHeight,
                i = this.el.clientHeight,
                n = this;this.scrollRatio = i / t;r(function () {
              n.bar.style.cssText = "height:" + i / t * 100 + "%; top:" + n.el.scrollTop / t * 100 + "%;right:-" + (n.target.clientWidth - n.bar.clientWidth) + "px;";
            });
          } };t.addEventListener("DOMContentLoaded", f);i.initEl = u;i.initAll = f;n.SimpleScrollbar = i;
      })(window, document);
    }
  }, {
    key: 'addScroll',
    value: function addScroll() {
      this.addSimpleScrollBar();
      // var scrollRoot = document.getElementsByClassName("ss")[0];
      var scrollRoot = document.querySelector('.ss');
      SimpleScrollbar.initEl(scrollRoot);
    }
  }, {
    key: 'createDOMItem',
    value: function createDOMItem(itemConfig) {
      var medWrapper = document.createElement("div");
      medWrapper.classList.add("event-content-wraper");

      var event = document.createElement("li");
      event.classList.add("event-wrapper");
      event.style.height = !this.isFullWidth ? this.widgetContentHeight - this.borderSize * 2 + 'px' : this.widgetContentHeight - this.borderSize * 2 + 'px';
      event.style.width = !this.isFullWidth ? this.config.width - this.borderSize * 2 + 'px' : this.widgetRoot.offsetWidth - this.borderSize * 2 + 'px';

      var wrapperImg = this.createBackgroundImage(event, itemConfig.img);
      var titleLink = document.querySelector('[w-type="event-discovery"]').getAttribute('w-titlelink');
      var nameContent = document.createTextNode(itemConfig.name);

      if (titleLink && titleLink == 'off') {
        var name = document.createElement("span");
        name.classList.add("event-name");
        name.appendChild(nameContent);
        this.initPretendedLink(name, itemConfig.url, true);
        name.addEventListener('click', function (e) {
          e.preventDefault();
          ga('send', 'event', 'DiscoveryClickeventName', 'click', '" + itemConfig.url + "');
          ga('tmOpenPlatform.send', 'event', 'EventDiscoveryWidget', 'eventNameClick');
        });
        medWrapper.appendChild(name);
      } else {
        var _name = document.createElement("a");
        _name.classList.add("event-name");
        _name.classList.add("event-pretended-link");
        _name.href = itemConfig.url;
        _name.appendChild(nameContent);
        _name.setAttribute('onclick', "");
        _name.addEventListener('click', function (e) {
          e.preventDefault();
          ga('send', 'event', 'DiscoveryClickeventName', 'click', '" + itemConfig.url + "');
          ga('tmOpenPlatform.send', 'event', 'EventDiscoveryWidget', 'eventNameClick');
        });
        medWrapper.appendChild(_name);
      }

      this.addBarcode(event, itemConfig.url);
      this.addBuyButton(!this.isListViewThumbnails ? medWrapper : wrapperImg, itemConfig.url); //add 'BuyButton' to '.wrapper-thumbnails' if choose ListViewThumbnails

      var dateTimeContent = document.createTextNode(this.formatDate(itemConfig.date)),
          dateTime = document.createElement("span");
      dateTime.classList.add("event-date", "centered-logo");
      dateTime.appendChild(dateTimeContent);

      var dateWraper = document.createElement("span");
      dateWraper.classList.add("event-date-wraper");
      dateWraper.appendChild(dateTime);
      medWrapper.appendChild(dateWraper);

      if (itemConfig.hasOwnProperty("address")) {
        var addressWrapper = document.createElement("span");
        addressWrapper.classList.add("address-wrapper");

        if (itemConfig.address.hasOwnProperty("name")) {
          var addressNameText = document.createTextNode(itemConfig.address.name),
              addressName = document.createElement("span");
          addressName.classList.add("event-address");
          addressName.classList.add("event-address-name");
          addressName.appendChild(addressNameText);
          addressWrapper.appendChild(addressName);
        }

        if (itemConfig.address.hasOwnProperty("line1")) {
          var addressOneText = document.createTextNode(itemConfig.address.line1),
              addressOne = document.createElement("span");
          addressOne.classList.add("event-address");
          addressOne.appendChild(addressOneText);
          addressWrapper.appendChild(addressOne);
        }

        if (itemConfig.address.hasOwnProperty("line2")) {
          var addressTwoText = document.createTextNode(itemConfig.address.line2),
              addressTwo = document.createElement("span");
          addressTwo.classList.add("event-address");
          addressTwo.appendChild(addressTwoText);
          addressWrapper.appendChild(addressTwo);
        }

        medWrapper.appendChild(addressWrapper);
      }

      if (itemConfig.hasOwnProperty("categories")) {
        var categoriesWrapper = document.createElement("span");
        categoriesWrapper.classList.add("category-wrapper");

        itemConfig.categories.forEach(function (element) {
          var categoryText = document.createTextNode(element),
              category = document.createElement("span");
          category.classList.add("event-category");
          category.appendChild(categoryText);
          categoriesWrapper.appendChild(category);
        });
        medWrapper.appendChild(categoriesWrapper);
      }

      event.appendChild(medWrapper);

      return event;
    }
  }, {
    key: 'makeImageUrl',
    value: function makeImageUrl(id) {
      return 'https://app.ticketmaster.com/discovery-widgets/v2/events/' + id + '/images.json';
    }

    /*
     * Config block
     */

  }, {
    key: 'decConfig',
    value: function decConfig(config) {
      return JSON.parse(window.atob(config));
    }
  }, {
    key: 'encConfig',
    value: function encConfig(config) {
      return window.btoa(config);
    }
  }, {
    key: 'toShortISOString',
    value: function toShortISOString(dateObj) {
      return dateObj.getFullYear() + "-" + (dateObj.getMonth() + 1 < 10 ? "0" + (dateObj.getMonth() + 1) : dateObj.getMonth() + 1) + "-" + (dateObj.getDate() < 10 ? "0" + dateObj.getDate() : dateObj.getDate()) + "T" + (dateObj.getHours() < 10 ? "0" + dateObj.getHours() : dateObj.getHours()) + ":" + (dateObj.getMinutes() < 10 ? "0" + dateObj.getMinutes() : dateObj.getMinutes()) + ":" + (dateObj.getSeconds() < 10 ? "0" + dateObj.getSeconds() : dateObj.getSeconds()) + "Z";
    }
  }, {
    key: 'getDateFromPeriod',
    value: function getDateFromPeriod(period) {

      var period = period.toLowerCase(),
          firstDay,
          lastDay;

      if (period == "year") {
        // firstDay = new Date( new Date(new Date()).toISOString() );
        // lastDay = new Date( new Date(new Date().valueOf()+24*365*60*60*1000).toISOString() );
        // firstDay = new Date().toISOString().slice(0,19) + 'Z';
        // lastDay = new Date(new Date().valueOf()+24*365*60*60*1000).toISOString().slice(0,19) + 'Z';
        firstDay = new Date().toISOString().slice(0, 11) + '00:00:00Z';
        lastDay = new Date(new Date().valueOf() + 24 * 365 * 60 * 60 * 1000).toISOString().slice(0, 11) + '00:00:00Z';
      } else if (period == "month") {
        // firstDay = new Date( new Date(new Date()).toISOString() );
        // lastDay = new Date( new Date(new Date().valueOf()+24*31*60*60*1000).toISOString() );
        // firstDay = new Date().toISOString().slice(0,19) + 'Z';
        // lastDay = new Date(new Date().valueOf()+24*31*60*60*1000).toISOString().slice(0,19) + 'Z';
        firstDay = new Date().toISOString().slice(0, 11) + '00:00:00Z';
        lastDay = new Date(new Date().valueOf() + 24 * 31 * 60 * 60 * 1000).toISOString().slice(0, 11) + '00:00:00Z';
      } else if (period == "week") {
        // firstDay = new Date( new Date(new Date()).toISOString() );
        // lastDay = new Date( new Date(new Date().valueOf()+24*7*60*60*1000).toISOString() );
        // firstDay = new Date().toISOString().slice(0,19) + 'Z';
        // lastDay = new Date(new Date().valueOf()+24*7*60*60*1000).toISOString().slice(0,19) + 'Z';
        firstDay = new Date().toISOString().slice(0, 11) + '00:00:00Z';
        lastDay = new Date(new Date().valueOf() + 24 * 7 * 60 * 60 * 1000).toISOString().slice(0, 11) + '00:00:00Z';
      } else {
        // firstDay = new Date( new Date(new Date()).toISOString() );
        // lastDay = new Date( new Date(new Date().valueOf()+24*60*60*1000).toISOString() );
        // firstDay = new Date().toISOString().slice(0,19) + 'Z';
        // lastDay = new Date(new Date().valueOf()+24*60*60*1000).toISOString().slice(0,19) + 'Z';
        firstDay = new Date().toISOString().slice(0, 11) + '00:00:00Z';
        lastDay = new Date(new Date().valueOf() + 24 * 60 * 60 * 1000).toISOString().slice(0, 11) + '00:00:00Z';
      }

      // return [this.toShortISOString(firstDay), this.toShortISOString(lastDay)];
      return [firstDay, lastDay];
    }
  }]);

  return TicketmasterEventDiscoveryWidget;
}();

var widgetsEventDiscovery = [];
(function () {
  var widgetContainers = document.querySelectorAll("div[w-type='event-discovery']");
  for (var i = 0; i < widgetContainers.length; ++i) {
    widgetsEventDiscovery.push(new TicketmasterEventDiscoveryWidget(widgetContainers[i]));
  }
})();

if (true) {
  module.exports = { widgetsEventDiscovery: widgetsEventDiscovery, TicketmasterEventDiscoveryWidget: TicketmasterEventDiscoveryWidget };
}

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var hashClear = __webpack_require__(36),
    hashDelete = __webpack_require__(37),
    hashGet = __webpack_require__(38),
    hashHas = __webpack_require__(39),
    hashSet = __webpack_require__(40);

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

module.exports = Hash;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var listCacheClear = __webpack_require__(43),
    listCacheDelete = __webpack_require__(44),
    listCacheGet = __webpack_require__(45),
    listCacheHas = __webpack_require__(46),
    listCacheSet = __webpack_require__(47);

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

module.exports = ListCache;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(3),
    root = __webpack_require__(4);

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var mapCacheClear = __webpack_require__(48),
    mapCacheDelete = __webpack_require__(49),
    mapCacheGet = __webpack_require__(50),
    mapCacheHas = __webpack_require__(51),
    mapCacheSet = __webpack_require__(52);

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

module.exports = MapCache;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var MapCache = __webpack_require__(15),
    setCacheAdd = __webpack_require__(55),
    setCacheHas = __webpack_require__(56);

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

module.exports = SetCache;


/***/ }),
/* 17 */
/***/ (function(module, exports) {

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

module.exports = apply;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var baseIndexOf = __webpack_require__(24);

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array == null ? 0 : array.length;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

module.exports = arrayIncludes;


/***/ }),
/* 19 */
/***/ (function(module, exports) {

/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

module.exports = arrayIncludesWith;


/***/ }),
/* 20 */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var SetCache = __webpack_require__(16),
    arrayIncludes = __webpack_require__(18),
    arrayIncludesWith = __webpack_require__(19),
    arrayMap = __webpack_require__(20),
    baseUnary = __webpack_require__(29),
    cacheHas = __webpack_require__(30);

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * The base implementation of methods like `_.difference` without support
 * for excluding multiple arrays or iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Array} values The values to exclude.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of filtered values.
 */
function baseDifference(array, values, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      isCommon = true,
      length = array.length,
      result = [],
      valuesLength = values.length;

  if (!length) {
    return result;
  }
  if (iteratee) {
    values = arrayMap(values, baseUnary(iteratee));
  }
  if (comparator) {
    includes = arrayIncludesWith;
    isCommon = false;
  }
  else if (values.length >= LARGE_ARRAY_SIZE) {
    includes = cacheHas;
    isCommon = false;
    values = new SetCache(values);
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee == null ? value : iteratee(value);

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var valuesIndex = valuesLength;
      while (valuesIndex--) {
        if (values[valuesIndex] === computed) {
          continue outer;
        }
      }
      result.push(value);
    }
    else if (!includes(values, computed, comparator)) {
      result.push(value);
    }
  }
  return result;
}

module.exports = baseDifference;


/***/ }),
/* 22 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

module.exports = baseFindIndex;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(5),
    getRawTag = __webpack_require__(34),
    objectToString = __webpack_require__(53);

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

var baseFindIndex = __webpack_require__(22),
    baseIsNaN = __webpack_require__(25),
    strictIndexOf = __webpack_require__(59);

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  return value === value
    ? strictIndexOf(array, value, fromIndex)
    : baseFindIndex(array, baseIsNaN, fromIndex);
}

module.exports = baseIndexOf;


/***/ }),
/* 25 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

module.exports = baseIsNaN;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(7),
    isMasked = __webpack_require__(42),
    isObject = __webpack_require__(8),
    toSource = __webpack_require__(60);

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

var identity = __webpack_require__(6),
    overRest = __webpack_require__(54),
    setToString = __webpack_require__(57);

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return setToString(overRest(func, start, identity), func + '');
}

module.exports = baseRest;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

var constant = __webpack_require__(61),
    defineProperty = __webpack_require__(32),
    identity = __webpack_require__(6);

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !defineProperty ? identity : function(func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

module.exports = baseSetToString;


/***/ }),
/* 29 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;


/***/ }),
/* 30 */
/***/ (function(module, exports) {

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

module.exports = cacheHas;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(4);

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(3);

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(68)))

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(5);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ }),
/* 35 */
/***/ (function(module, exports) {

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(2);

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

module.exports = hashClear;


/***/ }),
/* 37 */
/***/ (function(module, exports) {

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = hashDelete;


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(2);

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

module.exports = hashGet;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(2);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

module.exports = hashHas;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(2);

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

module.exports = hashSet;


/***/ }),
/* 41 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

module.exports = isKeyable;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

var coreJsData = __webpack_require__(31);

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;


/***/ }),
/* 43 */
/***/ (function(module, exports) {

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

module.exports = listCacheClear;


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(0);

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

module.exports = listCacheDelete;


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(0);

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

module.exports = listCacheGet;


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(0);

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

module.exports = listCacheHas;


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(0);

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

module.exports = listCacheSet;


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

var Hash = __webpack_require__(12),
    ListCache = __webpack_require__(13),
    Map = __webpack_require__(14);

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(1);

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = mapCacheDelete;


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(1);

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

module.exports = mapCacheGet;


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(1);

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

module.exports = mapCacheHas;


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(1);

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

module.exports = mapCacheSet;


/***/ }),
/* 53 */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

var apply = __webpack_require__(17);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

module.exports = overRest;


/***/ }),
/* 55 */
/***/ (function(module, exports) {

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

module.exports = setCacheAdd;


/***/ }),
/* 56 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

module.exports = setCacheHas;


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

var baseSetToString = __webpack_require__(28),
    shortOut = __webpack_require__(58);

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = shortOut(baseSetToString);

module.exports = setToString;


/***/ }),
/* 58 */
/***/ (function(module, exports) {

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

module.exports = shortOut;


/***/ }),
/* 59 */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.indexOf` which performs strict equality
 * comparisons of values, i.e. `===`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

module.exports = strictIndexOf;


/***/ }),
/* 60 */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;


/***/ }),
/* 61 */
/***/ (function(module, exports) {

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

module.exports = constant;


/***/ }),
/* 62 */
/***/ (function(module, exports) {

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(7),
    isLength = __webpack_require__(65);

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

var isArrayLike = __webpack_require__(63),
    isObjectLike = __webpack_require__(66);

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

module.exports = isArrayLikeObject;


/***/ }),
/* 65 */
/***/ (function(module, exports) {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;


/***/ }),
/* 66 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

var baseDifference = __webpack_require__(21),
    baseRest = __webpack_require__(27),
    isArrayLikeObject = __webpack_require__(64);

/**
 * Creates an array excluding all given values using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * **Note:** Unlike `_.pull`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {...*} [values] The values to exclude.
 * @returns {Array} Returns the new array of filtered values.
 * @see _.difference, _.xor
 * @example
 *
 * _.without([2, 1, 2, 3], 1, 2);
 * // => [3]
 */
var without = baseRest(function(array, values) {
  return isArrayLikeObject(array)
    ? baseDifference(array, values)
    : [];
});

module.exports = without;


/***/ }),
/* 68 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ })
/******/ ]);
//# sourceMappingURL=main-widget.js.map
