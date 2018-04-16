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
/******/ 	return __webpack_require__(__webpack_require__.s = 16);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var eq = __webpack_require__(68);

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

var isKeyable = __webpack_require__(47);

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

var getNative = __webpack_require__(4);

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(5);

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsNative = __webpack_require__(32),
    getValue = __webpack_require__(40);

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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var freeGlobal = __webpack_require__(38);

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),
/* 6 */
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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var SetCache = __webpack_require__(21),
    arrayIncludes = __webpack_require__(23),
    arrayIncludesWith = __webpack_require__(24),
    arrayMap = __webpack_require__(25),
    baseUnary = __webpack_require__(34),
    cacheHas = __webpack_require__(35);

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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(3),
    getRawTag = __webpack_require__(39),
    objectToString = __webpack_require__(59);

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
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var identity = __webpack_require__(10),
    overRest = __webpack_require__(60),
    setToString = __webpack_require__(63);

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
/* 10 */
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
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var isArrayLike = __webpack_require__(71),
    isObjectLike = __webpack_require__(6);

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
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(8),
    isObject = __webpack_require__(13);

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
/* 13 */
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
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var baseDifference = __webpack_require__(7),
    baseFlatten = __webpack_require__(28),
    baseRest = __webpack_require__(9),
    isArrayLikeObject = __webpack_require__(11);

/**
 * Creates an array of `array` values not included in the other given arrays
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons. The order and references of result values are
 * determined by the first array.
 *
 * **Note:** Unlike `_.pullAll`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {...Array} [values] The values to exclude.
 * @returns {Array} Returns the new array of filtered values.
 * @see _.without, _.xor
 * @example
 *
 * _.difference([2, 1], [2, 3]);
 * // => [1]
 */
var difference = baseRest(function(array, values) {
  return isArrayLikeObject(array)
    ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true))
    : [];
});

module.exports = difference;


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_without__ = __webpack_require__(73);
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
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _attributeNames = __webpack_require__(15);

var _difference = __webpack_require__(14);

var _difference2 = _interopRequireDefault(_difference);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {

  var DEFAULT_API_KEY = apiKeyService.checkApiKeyCookie() || apiKeyService.getApiWidgetsKey();

  function getHeightByTheme(theme) {
    return theme === 'simple' ? 286 : 339;
  }

  function getBorderByTheme(theme) {
    switch (theme) {
      case 'simple':
        return 0;
        break;
      default:
        return 2;
    }
  }

  function getGooleApiKey(code) {
    return code || "AIzaSyBQrJ5ECXDaXVlICIdUBOe8impKIGHDzdA";
  }

  var widget = widgetsLib.widgetsEventDiscovery[0],
      themeConfig = {
    sizes: {
      s: {
        width: 160,
        height: 300,
        layout: 'horizontal'
      },
      m: {
        width: 300,
        height: 250,
        layout: 'vertical'
      },
      l: {
        width: 160,
        height: 300,
        layout: 'horizontal'
      },
      xl: {
        width: 160,
        height: 300,
        layout: 'horizontal'
      },
      xxl: {
        width: 300,
        height: 600,
        layout: 'vertical'
      },
      custom: {
        width: 350,
        height: 600,
        layout: 'vertical'
      }
    },
    initSliderSize: {
      width: 350,
      height: 600,
      maxWidth: 500,
      minWidth: 350
    }
  },
      isPostalCodeChanged = false;

  var $darkSchemeSelector = $('.widget__dark-theme-selector');
  var $customColorSchemeSelector = $('.widget__color_scheme_custom');
  var widgetNode = document.querySelector('div[w-type="event-discovery"]');

  var selectedColorTheme = _attributeNames.ATTRIBUTE_VALUES.WIDGET_THEME.SIMPLE;

  $('#js_styling_nav_tab').on('shown.bs.tab', function () {
    windowScroll(); //recalculate widget container position
  });

  //variables for fixed widget
  var $window = $(window),
      $containerWidget = $(".widget-container-wrapper"),
      $configBlock = $(".config-block"),
      window_min = 0,
      window_max = 0,
      desktopWidth = 1200,
      threshold_offset = 50;
  /*
   set the container's maximum and minimum limits as well as movement thresholds
   */
  function setLimits() {
    //max and min container movements
    var topCss = $containerWidget.css("top") > 0 ? parseInt($containerWidget.css("top")) : 0;
    var headerOffset = $('.top-bar').height() + /*padding of top-bar*/8 + /*bottom-margin*/10;
    var max_move = $configBlock.offset().top + $configBlock.height() - $containerWidget.height() - topCss - headerOffset;
    var min_move = $configBlock.offset().top - headerOffset;

    $containerWidget.data('min', min_move).data('max', max_move);

    //window thresholds so the movement isn't called when its not needed!
    window_min = min_move - threshold_offset;
    window_max = max_move + $containerWidget.height() + threshold_offset;
  }
  //sets the limits for the first load
  setLimits();

  function windowScroll() {
    var innerWidth = window.innerWidth;
    var j = 0;
    function updateScroll() {
      //if the window is within the threshold, begin movements
      if ($window.scrollTop() >= window_min && $window.scrollTop() < window_max) {
        if ($containerWidget.height() < $configBlock.height() && innerWidth >= desktopWidth) {
          //reset the limits (optional)
          setLimits();
          //move the container
          containerMove();
        }
      }
      j++;
    }
    if (j === 0) updateScroll();

    setTimeout(function () {
      if (innerWidth < desktopWidth && $containerWidget.height() > $configBlock.height()) {
        // console.log('*** ', j , innerWidth ,'<', desktopWidth );
        containerMove_clearOffset();
        updateScroll();
      }
      if ($containerWidget.height() < $configBlock.height() || innerWidth >= desktopWidth) {
        // console.log('ignore ',j);
        if (innerWidth < desktopWidth) {
          containerMove_clearOffset();
        }
        updateScroll();
      }
    }, 200);
  }

  $window.on("scroll load resize", windowScroll);

  /**
   * Clear top offset of widget container
   */
  function containerMove_clearOffset() {
    $containerWidget.css("margin-top", 0);
  }
  /**
   * Handles moving the container if needed.
   **/
  function containerMove() {
    var marginTop = 0;
    var wst = $window.scrollTop(),
        _$containerWidget$dat = $containerWidget.data(),
        min = _$containerWidget$dat.min,
        max = _$containerWidget$dat.max;

    //if the window scroll is within the min and max (the container will be 'sticky';
    if (wst >= min && wst <= max) {
      //if the window scroll is below the minimum move it down!
      marginTop = wst - min;
    } else if (wst > max) {
      marginTop = max - min;
    }
    $containerWidget.css('marginTop', marginTop > 0 ? marginTop : 0);
  }
  //do one container move on load
  containerMove();

  var fullWidth = function fullWidth(targetValue, widgetNode) {
    var widthSlider = $('.js_widget_width_slider'),
        widgetContainerWrapper = $containerWidget,
        widgetContainer = $(".widget-container", widgetContainerWrapper),
        $border_slider = $('.js_widget_border_slider');

    if (targetValue === 'fullwidth') {
      // $layoutBox.slideUp();
      widthSlider.slideUp("fast");
      // $borderRadiusController.slider('setValue', 0);
      widgetNode.setAttribute('w-borderradius', 0);
      $border_slider.slideUp("fast");
      widgetContainerWrapper.css({ width: "100%" });
      widgetContainer.css({ width: '100%' });
      // widgetNode.setAttribute('w-height', 700);
    } else {
      // $layoutBox.slideDown("fast");
      widthSlider.hide();
      $border_slider.hide();
      // $borderRadiusController.slider('setValue', 4);
      widgetNode.setAttribute('w-borderradius', 4);
      widgetContainerWrapper.css({ width: 'auto' });
      widgetContainer.css({ width: 'auto' });
      //resetWidget($configForm );
    }
  };

  function handleCustomColorSchemeClick(event) {
    if (event.target.name === 'w-colorscheme') {
      if (event.target.value === 'custom') {
        $customColorSchemeSelector.show();
      } else {
        $customColorSchemeSelector.hide();
        clearCustomStyles();
        resetCustomColorInputs();
      }
    }
  }

  function resetCustomColorInputs() {
    _attributeNames.CUSTOM_THEME_ATTRIBUTES.forEach(function (custom) {
      var $customColorInput = $('#' + custom);
      $customColorInput.minicolors('value', $customColorInput.attr(_attributeNames.ATTRIBUTE_NAMES.DEFAULT_VALUE));
    });
  }

  function handleCustomFieldClick(event) {
    var widgetNode = document.querySelector('div[w-type="event-discovery"]');
    var _event$target = event.target,
        targetName = _event$target.name,
        targetValue = _event$target.value;

    _attributeNames.CUSTOM_THEME_ATTRIBUTES.forEach(function (themeAttribute) {
      if (targetName === themeAttribute) {
        widgetNode.setAttribute(themeAttribute, targetValue);
      }
    });
  }

  function clearCustomStyles() {
    var widgetNode = document.querySelector('div[w-type="event-discovery"]');
    var customSheet = widgetNode.getElementsByTagName('style')[0];

    _attributeNames.CUSTOM_THEME_ATTRIBUTES.forEach(function (customAttribute) {
      return widgetNode.removeAttribute(customAttribute);
    });

    if (customSheet !== undefined) {
      customSheet.parentNode.removeChild(customSheet);
    }
  }

  function handleThemeClick(_ref) {
    var _ref$target = _ref.target,
        targetName = _ref$target.name,
        newTheme = _ref$target.value;

    if (targetName === _attributeNames.ATTRIBUTE_NAMES.WIDGET_THEME) {
      if (newTheme === _attributeNames.ATTRIBUTE_VALUES.WIDGET_THEME.SIMPLE) {
        $darkSchemeSelector.hide();
      } else {
        $darkSchemeSelector.show();
      }

      if (widgetNode.getAttribute(_attributeNames.ATTRIBUTE_NAMES.WIDGET_LAYOUT) === _attributeNames.ATTRIBUTE_VALUES.WIDGET_LAYOUT.HORIZONTAL) {
        widgetNode.setAttribute(_attributeNames.ATTRIBUTE_NAMES.WIDGET_HEIGHT, getHeightByTheme(newTheme));
      }
      widgetNode.setAttribute(_attributeNames.ATTRIBUTE_NAMES.WIDGET_BORDER, getBorderByTheme(newTheme));

      updateCustomColorFields(selectedColorTheme, newTheme);
      selectedColorTheme = newTheme;
    }
  }

  function updateCustomColorFields(oldTheme, newTheme) {
    var currentCustomFieldsForTheme = _attributeNames.AVAILABLE_CUSTOM_FIELDS_FOR_THEME[oldTheme];
    var newCustomFieldsForTheme = _attributeNames.AVAILABLE_CUSTOM_FIELDS_FOR_THEME[newTheme];
    var fieldsToRemove = (0, _difference2.default)(currentCustomFieldsForTheme, newCustomFieldsForTheme);
    var fieldsToAdd = (0, _difference2.default)(newCustomFieldsForTheme, currentCustomFieldsForTheme);

    fieldsToRemove.forEach(function (field) {
      $('#' + field + '-container').hide();
      widgetNode.removeAttribute(field);
    });
    fieldsToAdd.forEach(function (field) {
      $('#' + field + '-container').show();
    });
  }

  var changeState = function changeState(event) {
    if (!event.target.name || event.target.name === "w-googleapikey") return;

    var widgetNode = document.querySelector("div[w-tmapikey]"),
        targetValue = event.target.value,
        targetName = event.target.name,
        $tabButtons = $('.js-tab-buttons');

    if (targetName === "w-postalcodeapi") {
      widgetNode.setAttribute('w-country', '');
      isPostalCodeChanged = true;
    }

    if (targetName === "w-latlong") {
      if (targetValue == '') {
        document.getElementById('w-latlong').value = document.getElementById('h-latlong').value;
        targetValue = document.getElementById('w-latlong').value;
      }
      widgetNode.setAttribute('w-latlong', targetValue.replace(/\s+/g, ''));
    }

    if (targetName === "w-postalcodeapi") {
      widgetNode.setAttribute('w-country', '');
      widgetNode.setAttribute('w-postalcodeapi', document.getElementById('w-postalcodeapi').value);
      isPostalCodeChanged = true;
    }

    if (targetName === "w-countryCode" && widgetNode.getAttribute('w-countrycode') !== null) {
      if (widgetNode.getAttribute('w-countrycode') != targetValue) {
        document.getElementById("w-city").value = '';
        widgetNode.setAttribute('w-city', '');
      }
    }

    handleCustomColorSchemeClick(event);
    handleCustomFieldClick(event);
    handleThemeClick(event);

    if (targetName === "w-layout") {
      var sizeConfig = themeConfig.initSliderSize;
      if (targetValue === 'horizontal') {
        sizeConfig = {
          width: 620,
          height: getHeightByTheme(widgetNode.getAttribute('w-theme')),
          maxWidth: 900,
          minWidth: 620
        };
      }

      fullWidth(targetValue, widgetNode);

      if (targetValue !== 'fullwidth') {

        $('.js_widget_width_slider').slideDown("fast");
        $('.js_widget_border_slider').slideDown("fast");
        // $borderRadiusController.slider('setValue', 4);
        widgetNode.setAttribute('w-borderradius', 4);
        $containerWidget.css({ width: 'auto' });
        $(".widget-container", $containerWidget).css({ width: 'auto' });
      }

      widgetNode.setAttribute('w-width', sizeConfig.width);
      widgetNode.setAttribute('w-height', sizeConfig.height);
    }

    //Check fixed sizes for 'simple' theme
    if (targetName === "w-proportion") {
      var widthSlider = $('.js_widget_width_slider');
      var _sizeConfig = {
        width: themeConfig.sizes[targetValue].width,
        height: themeConfig.sizes[targetValue].height,
        maxWidth: 600,
        minWidth: 350
      };

      //set width:'auto'
      fullWidth(targetValue, widgetNode);

      //set layout
      widgetNode.setAttribute('w-layout', themeConfig.sizes[targetValue].layout);

      if (targetValue !== 'custom') {
        $tabButtons.slideUp("fast");
        widthSlider.slideUp("fast");
      } else {
        $tabButtons.slideDown("fast");
        widthSlider.slideDown("fast");
        $('input:radio[name="w-layout"][value="vertical"]', $tabButtons).prop('checked', true);

        _sizeConfig = { //default size
          width: themeConfig.initSliderSize.width, //350
          height: themeConfig.initSliderSize.height, //600
          maxWidth: themeConfig.initSliderSize.maxWidth, //500
          minWidth: themeConfig.initSliderSize.minWidth // 350
        };
      }
      widgetNode.setAttribute('w-width', _sizeConfig.width);
      widgetNode.setAttribute('w-height', _sizeConfig.height);
    }

    widgetNode.setAttribute(event.target.name, event.target.value);
    document.getElementById('w-width').value = widgetNode.getAttribute('w-width');
    document.getElementById('w-borderradius').value = widgetNode.getAttribute('w-borderradius');
    widget.update();

    windowScroll(); //recalculate widget container position
  };

  var resetWidget = function resetWidget(configForm) {
    var widgetNode = document.querySelector("div[w-tmapikey]"),
        height = 600,
        theme = void 0,
        layout = void 0;
    var widthSlider = $('.js_widget_width_slider'),
        $tabButtons = $('.js-tab-buttons');

    configForm.find("input[type='text'], input[type='number']").each(function () {
      var $self = $(this),
          data = $self.data(),
          value = data.defaultValue;

      if (data.sliderValue) {
        value = data.sliderValue;
        $self.slider({
          setValue: value,
          max: data.sliderMax,
          min: data.sliderMin
        }).slider('refresh');
      } else {
        $self.val(value);
      }

      try {
        document.getElementById("w-country").disabled = true;
      } catch (e) {}

      var activeItems = document.querySelectorAll('.custom_select__item.custom_select__item-active');
      var activeItemsLenght = activeItems.length;
      for (var i = 0; i < activeItemsLenght; ++i) {
        activeItems[i].classList.remove('custom_select__item-active');
      }

      ["#w-countryCode", "#w-source"].map(function (item) {
        $(item).prop("selectedIndex", 0);
      });
      widgetNode.setAttribute($self.attr('name'), value);
      if ($self.attr('name') === 'w-tm-api-key') widgetNode.removeAttribute($self.attr('name'));
    });

    configForm.find("input[type='radio']").each(function () {
      var $self = $(this);
      if ($self.data('is-checked')) {
        var name = $self.attr('name'),
            val = $self.val();
        if (name === 'w-theme') {
          theme = val;
        } else if (name === 'w-layout') {
          layout = val;
        } else if (name === 'w-proportion') {
          $tabButtons.slideDown("fast");
          widthSlider.slideDown("fast");
        }
        $self.prop('checked', true);
        widgetNode.setAttribute($self.attr('name'), val);
      }
    });

    if (layout === 'horizontal') {
      height = getHeightByTheme(theme);
    }
    widgetNode.setAttribute('w-height', height);
    widgetNode.setAttribute('w-border', 0);
    widgetNode.removeAttribute('w-countryCode');
    widgetNode.removeAttribute('w-source');

    $('.country-select .js_custom_select').removeClass('custom_select-opened'); //reset custom select
    widget.onLoadCoordinate();
    widget.update();
  };

  var $configForm = $(".main-widget-config-form"),
      $widgetModal = $('#js_widget_modal'),
      $widgetModalNoCode = $('#js_widget_modal_no_code'),
      $widgetModalMap = $('#js_widget_modal_map');

  $configForm.on("change", changeState);
  // Mobile devices. Force 'change' by 'Go' press
  $configForm.on("submit", function (e) {
    $configForm.find('input:focus').trigger('blur');
    e.preventDefault();
  });

  $configForm.find("input[type='text'], input[type='number']").each(function () {
    var $self = $(this);
    $self.data('default-value', $self.val());
  });

  $configForm.find("input[type='radio']").each(function () {
    var $self = $(this);
    if ($self.is(':checked')) $self.data('is-checked', 'checked');
  });

  $('.js_get_widget_code').on('click', function () {
    var googleKey = 'YOUR_GOOGLE_API_KEY';
    var codeCont = document.querySelector(".language-html.widget_dialog__code");
    var htmlCode = document.createElement("div");
    widget.config.latlong = document.getElementById('w-latlong').value.replace(/\s+/g, '');
    for (var key in widget.config) {
      if (key !== 'country') {
        htmlCode.setAttribute("w-" + key, widget.config[key]);
      }
    }
    // Use only Key from config form
    htmlCode.setAttribute('w-googleapikey', getGooleApiKey());
    htmlCode.setAttribute('w-latlong', document.getElementById('w-latlong').value.replace(/\s+/g, ''));
    if (document.getElementById('w-googleapikey').value != '') {
      googleKey = document.getElementById('w-googleapikey').value;
      htmlCode.setAttribute('w-googleapikey', googleKey);
    } else {
      htmlCode.setAttribute('w-googleapikey', googleKey);
    }
    var tmp = document.createElement("div");
    tmp.appendChild(htmlCode);
    codeCont.textContent = tmp.innerHTML;
    $widgetModal.modal();
  });

  $('.js_reset_widget').on('click', function () {
    resetWidget($configForm);
  });

  $('#js_widget_modal__close').on('click', function () {
    $widgetModal.modal('hide');
  });

  $('#js_widget_modal_no_code__close').on('click', function () {
    $widgetModalNoCode.modal('hide');
  });

  $('#js_widget_modal_map__open').on('click', function (e) {
    e.preventDefault();
    $widgetModalMap.modal();
  });

  $('#js_widget_modal_map__close').on('click', function () {
    $widgetModalMap.modal('hide');
    document.querySelector('[w-type="event-discovery"]').setAttribute('w-latlong', document.getElementById('w-latlong').value.replace(/\s+/g, ''));
    widget.config.latlong = document.getElementById('w-latlong').value.replace(/\s+/g, '');
    widget.update();
  });

  $('.widget__location span').on('click', function () {
    $('.widget__location').addClass('hidn');
    $('.widget__latlong').removeClass('hidn');
    document.getElementById('h-countryCode').value = document.getElementById('w-countryCode').value;
    document.getElementById('h-postalcodeapi').value = document.getElementById('w-postalcodeapi').value;
    document.getElementById('h-city').value = document.getElementById('w-city').value;
    document.getElementById('w-latlong').value = document.getElementById('h-latlong').value;
    widget.config.latlong = document.getElementById('w-latlong').value.replace(/\s+/g, '');
    document.querySelector('[w-type="event-discovery"]').setAttribute('w-latlong', widget.config.latlong);
    document.querySelector('[w-type="event-discovery"]').removeAttribute('w-countrycode');
    document.querySelector('[w-type="event-discovery"]').removeAttribute('w-postalcodeapi');
    document.querySelector('[w-type="event-discovery"]').removeAttribute('w-city');
    widget.update();
  });

  $('.widget__latlong span').on('click', function () {
    $('.widget__latlong').addClass('hidn');
    $('.widget__location').removeClass('hidn');
    document.getElementById('h-latlong').value = document.getElementById('w-latlong').value.replace(/\s+/g, '');
    document.getElementById('w-latlong').value = '';
    document.querySelector('[w-type="event-discovery"]').removeAttribute('w-latlong');
    document.getElementById('w-countryCode').value = document.getElementById('h-countryCode').value;
    document.getElementById('w-postalcodeapi').value = document.getElementById('h-postalcodeapi').value;
    document.getElementById('w-city').value = document.getElementById('h-city').value;
    widget.config.countrycode = document.getElementById('w-countryCode').value;
    widget.config.postalcode = document.getElementById('w-postalcodeapi').value;
    widget.config.city = document.getElementById('w-city').value;
    document.querySelector('[w-type="event-discovery"]').setAttribute('w-countrycode', widget.config.countrycode);
    document.querySelector('[w-type="event-discovery"]').setAttribute('w-postalcodeapi', widget.config.postalcode);
    document.querySelector('[w-type="event-discovery"]').setAttribute('w-city', widget.config.city);
    widget.config.latlong = '';
    widget.update();
  });

  widget.onLoadCoordinate = function (results) {
    var countryShortName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    widget.config['country'] = countryShortName;
    if (isPostalCodeChanged) {
      isPostalCodeChanged = false;

      var $countrySelect = $('#w-country'),
          $ul = $(".country-select .js_widget_custom__list"),
          options = "<option selected value=''>All</option>";

      $countrySelect.html('');
      $ul.html(''); //clear custom select list
      $countrySelect.prop('disabled', !results);
      if (results) {
        var status = void 0;
        if (results.length <= 1) status = true;else status = false;
        $countrySelect.prop('disabled', status);
        // $countrySelect.prop('disabled', !results.length);
        options = '';
        for (var i in results) {
          var result = results[i];
          if (result.address_components) {
            var country = result.address_components[result.address_components.length - 1];
            if (country) {
              var isSelected = country.short_name === countryShortName ? 'selected' : '';
              options += '<option ' + isSelected + ' value="' + country.short_name + '">' + country.long_name + '</option>';
            }
          }
        }
      }

      $countrySelect.append(options);
      addCustomList($ul, '#w-country', countryShortName);
    }
  };

  function addCustomList(listWrapperElement, listWrapperId, activeVal) {
    var $listOption = $(listWrapperId).find('option'),
        //update list
    $placeholder = $(".country-select").find(".custom_select__placeholder"),
        $ul = listWrapperElement;

    $placeholder.val($listOption.html());

    $listOption.each(function () {
      var data = {
        value: $(this).val()
      };
      $ul.append('<li class="custom_select__item ' + (activeVal === data.value ? 'custom_select__item-active' : '') + '" data-value="' + data.value + '">' + $(this).text() + '</li>');
    });
  }

  // clearDropDownInput(['#w-countryCode','#w-source']);
  function clearDropDownInput(elemIds) {
    elemIds.map(function (item) {
      $(item).val('');
    });
  }

  // Set min widget size on mobile devices
  if (parseInt($(window).width(), 10) < 767) {
    $('#w-fixed-300x250').trigger('click');
  }

  document.getElementById('w-width').addEventListener('blur', function (e) {
    if (this.value < 350 || this.value > 1920) {
      this.value = 350;
      var _widgetNode = document.querySelector("div[w-tmapikey]");
      _widgetNode.setAttribute('w-width', '350');
      document.querySelector('.events-root-container').style.width = '350px';
      widget.update();
    }
  });

  document.getElementById('w-borderradius').addEventListener('blur', function (e) {
    if (this.value < 0 || this.value > 50) {
      this.value = 4;
      var _widgetNode2 = document.querySelector("div[w-tmapikey]");
      _widgetNode2.setAttribute('w-borderradius', '4');
      widget.update();
    }
  });

  $('.color-picker').minicolors();
})();

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var hashClear = __webpack_require__(41),
    hashDelete = __webpack_require__(42),
    hashGet = __webpack_require__(43),
    hashHas = __webpack_require__(44),
    hashSet = __webpack_require__(45);

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
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var listCacheClear = __webpack_require__(49),
    listCacheDelete = __webpack_require__(50),
    listCacheGet = __webpack_require__(51),
    listCacheHas = __webpack_require__(52),
    listCacheSet = __webpack_require__(53);

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
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(4),
    root = __webpack_require__(5);

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var mapCacheClear = __webpack_require__(54),
    mapCacheDelete = __webpack_require__(55),
    mapCacheGet = __webpack_require__(56),
    mapCacheHas = __webpack_require__(57),
    mapCacheSet = __webpack_require__(58);

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
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var MapCache = __webpack_require__(20),
    setCacheAdd = __webpack_require__(61),
    setCacheHas = __webpack_require__(62);

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
/* 22 */
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
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var baseIndexOf = __webpack_require__(29);

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
/* 24 */
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
/* 25 */
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
/* 26 */
/***/ (function(module, exports) {

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;


/***/ }),
/* 27 */
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
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

var arrayPush = __webpack_require__(26),
    isFlattenable = __webpack_require__(46);

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

module.exports = baseFlatten;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var baseFindIndex = __webpack_require__(27),
    baseIsNaN = __webpack_require__(31),
    strictIndexOf = __webpack_require__(65);

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
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(8),
    isObjectLike = __webpack_require__(6);

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;


/***/ }),
/* 31 */
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
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(12),
    isMasked = __webpack_require__(48),
    isObject = __webpack_require__(13),
    toSource = __webpack_require__(66);

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
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

var constant = __webpack_require__(67),
    defineProperty = __webpack_require__(37),
    identity = __webpack_require__(10);

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
/* 34 */
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
/* 35 */
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
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(5);

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(4);

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(74)))

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(3);

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
/* 40 */
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
/* 41 */
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
/* 42 */
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
/* 43 */
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
/* 44 */
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
/* 45 */
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
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(3),
    isArguments = __webpack_require__(69),
    isArray = __webpack_require__(70);

/** Built-in value references. */
var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArray(value) || isArguments(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

module.exports = isFlattenable;


/***/ }),
/* 47 */
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
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

var coreJsData = __webpack_require__(36);

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
/* 49 */
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
/* 50 */
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
/* 51 */
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
/* 52 */
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
/* 53 */
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
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

var Hash = __webpack_require__(17),
    ListCache = __webpack_require__(18),
    Map = __webpack_require__(19);

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
/* 55 */
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
/* 56 */
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
/* 57 */
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
/* 58 */
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
/* 59 */
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
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

var apply = __webpack_require__(22);

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
/* 61 */
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
/* 62 */
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
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

var baseSetToString = __webpack_require__(33),
    shortOut = __webpack_require__(64);

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
/* 64 */
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
/* 65 */
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
/* 66 */
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
/* 67 */
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
/* 68 */
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
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsArguments = __webpack_require__(30),
    isObjectLike = __webpack_require__(6);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;


/***/ }),
/* 70 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(12),
    isLength = __webpack_require__(72);

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
/* 72 */
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
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

var baseDifference = __webpack_require__(7),
    baseRest = __webpack_require__(9),
    isArrayLikeObject = __webpack_require__(11);

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
/* 74 */
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
//# sourceMappingURL=main-widget-config.js.map
