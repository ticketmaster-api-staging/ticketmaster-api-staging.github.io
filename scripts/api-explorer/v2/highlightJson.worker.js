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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var prefix = 'tm-code';

var getExpanderClasses = function getExpanderClasses(expanded) {
	if (!expanded) {
		return 'expanded collapsed hidden';
	}
	return 'expanded';
};

var encode = function encode(value) {
	return ['<span>', value, '</span>'].join('');
};

var createElement = function createElement(key, value, type, expanderClasses) {
	var klass = 'object',
	    open = '{',
	    close = '}';

	if (Array.isArray(value)) {
		klass = 'array';
		open = '[';
		close = ']';
	}

	if (value === null) {
		return ['<li>', '<span class="key">"', encode(key), '": </span>', '<span class="null">"', encode(value), '"</span>', '</li>'].join('');
	}

	if (type == 'object') {
		return ['<li>', '<span class="', expanderClasses, '"></span>', '<span class="key">"', encode(key), '": </span> ', '<span class="open">', open, '</span> ', '<ul class="', klass, '">', json2html(value, expanderClasses), '</ul>', '<span class="close">', close, '</span>', '</li>'].join('');
	}

	if (type == 'number' || type == 'boolean') {
		return ['<li>', '<span class="key">"', encode(key), '": </span>', '<span class="', type, '">', encode(value), '</span>', '</li>'].join('');
	}
	return ['<li>', '<span class="key">"', encode(key), '": </span>', '<span class="', type, '">"', encode(value), '"</span>', '</li>'].join('');
};

var json2html = function json2html(json, expanderClasses) {
	var html = '';
	for (var key in json) {
		if (!json.hasOwnProperty(key)) {
			continue;
		}

		html = [html, createElement(key, json[key], _typeof(json[key]), expanderClasses)].join('');
	}
	return html;
};

var getJsonViewer = function getJsonViewer(data, options) {
	try {
		return ['<ul class="', prefix, '-container">', json2html([JSON.parse(data)], getExpanderClasses(options.expanded)), '</ul>'].join('');
	} catch (e) {
		return ['<div class="', prefix, '-error" >', e.toString(), ' </div>'].join('');
	}
};

module.exports = function (data, opt) {
	var json = '';
	var options = opt || { expanded: true };
	if (typeof data == 'string') {
		json = data;
	} else if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) == 'object') {
		json = JSON.stringify(data);
	}
	return getJsonViewer(json, options);
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Code format web-worker
 * @param event
 */
// var highlightJson()
var highlightJson = __webpack_require__(0);

onmessage = function(event) {
  var code = event.data;
  // importScripts('json-parse.js');
  var result = highlightJson(code, {expanded: true});
  // var result =JSON.stringify(code);
  postMessage(result);
};


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYWRiZWFmYTU5YzIzNzRkMTZiNjYiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9hcGktZXhwbG9yZXIvdjIvc3JjL3NlcnZpY2VzL2pzb24taGlnaGxpZ2h0L2pzb24tcGFyc2UuanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9hcGktZXhwbG9yZXIvdjIvc3JjL3NlcnZpY2VzL2pzb24taGlnaGxpZ2h0L2hpZ2hsaWdodEpzb24ud29ya2VyLmpzIl0sIm5hbWVzIjpbInByZWZpeCIsImdldEV4cGFuZGVyQ2xhc3NlcyIsImV4cGFuZGVkIiwiZW5jb2RlIiwidmFsdWUiLCJqb2luIiwiY3JlYXRlRWxlbWVudCIsImtleSIsInR5cGUiLCJleHBhbmRlckNsYXNzZXMiLCJrbGFzcyIsIm9wZW4iLCJjbG9zZSIsIkFycmF5IiwiaXNBcnJheSIsImpzb24yaHRtbCIsImpzb24iLCJodG1sIiwiaGFzT3duUHJvcGVydHkiLCJnZXRKc29uVmlld2VyIiwiZGF0YSIsIm9wdGlvbnMiLCJKU09OIiwicGFyc2UiLCJlIiwidG9TdHJpbmciLCJtb2R1bGUiLCJleHBvcnRzIiwib3B0Iiwic3RyaW5naWZ5Il0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2hFQSxJQUFJQSxTQUFTLFNBQWI7O0FBRUEsSUFBSUMscUJBQXFCLFNBQXJCQSxrQkFBcUIsQ0FBVUMsUUFBVixFQUFvQjtBQUM1QyxLQUFJLENBQUNBLFFBQUwsRUFBZTtBQUNkLFNBQU8sMkJBQVA7QUFDQTtBQUNELFFBQU8sVUFBUDtBQUNBLENBTEQ7O0FBT0EsSUFBSUMsU0FBUyxTQUFUQSxNQUFTLENBQVVDLEtBQVYsRUFBaUI7QUFDN0IsUUFBTyxDQUFDLFFBQUQsRUFBV0EsS0FBWCxFQUFrQixTQUFsQixFQUE2QkMsSUFBN0IsQ0FBa0MsRUFBbEMsQ0FBUDtBQUNBLENBRkQ7O0FBSUEsSUFBSUMsZ0JBQWdCLFNBQWhCQSxhQUFnQixDQUFVQyxHQUFWLEVBQWVILEtBQWYsRUFBc0JJLElBQXRCLEVBQTRCQyxlQUE1QixFQUE2QztBQUNoRSxLQUFJQyxRQUFRLFFBQVo7QUFBQSxLQUNDQyxPQUFPLEdBRFI7QUFBQSxLQUVDQyxRQUFRLEdBRlQ7O0FBSUEsS0FBSUMsTUFBTUMsT0FBTixDQUFjVixLQUFkLENBQUosRUFBMEI7QUFDekJNLFVBQVEsT0FBUjtBQUNBQyxTQUFPLEdBQVA7QUFDQUMsVUFBUSxHQUFSO0FBQ0E7O0FBRUQsS0FBSVIsVUFBVSxJQUFkLEVBQW9CO0FBQ25CLFNBQU8sQ0FDTixNQURNLEVBRUwscUJBRkssRUFFa0JELE9BQU9JLEdBQVAsQ0FGbEIsRUFFK0IsWUFGL0IsRUFHTCxzQkFISyxFQUdtQkosT0FBT0MsS0FBUCxDQUhuQixFQUdrQyxVQUhsQyxFQUlOLE9BSk0sRUFLTEMsSUFMSyxDQUtBLEVBTEEsQ0FBUDtBQU1BOztBQUVELEtBQUlHLFFBQVEsUUFBWixFQUFzQjtBQUNyQixTQUFPLENBQ04sTUFETSxFQUVMLGVBRkssRUFFWUMsZUFGWixFQUU2QixXQUY3QixFQUdMLHFCQUhLLEVBR2tCTixPQUFPSSxHQUFQLENBSGxCLEVBRytCLGFBSC9CLEVBSUwscUJBSkssRUFJa0JJLElBSmxCLEVBSXdCLFVBSnhCLEVBS0wsYUFMSyxFQUtVRCxLQUxWLEVBS2lCLElBTGpCLEVBTUpLLFVBQVVYLEtBQVYsRUFBaUJLLGVBQWpCLENBTkksRUFPTCxPQVBLLEVBUUwsc0JBUkssRUFRbUJHLEtBUm5CLEVBUTBCLFNBUjFCLEVBU04sT0FUTSxFQVVMUCxJQVZLLENBVUEsRUFWQSxDQUFQO0FBV0E7O0FBRUQsS0FBSUcsUUFBUSxRQUFSLElBQW9CQSxRQUFRLFNBQWhDLEVBQTJDO0FBQzFDLFNBQU8sQ0FDTixNQURNLEVBRUwscUJBRkssRUFFa0JMLE9BQU9JLEdBQVAsQ0FGbEIsRUFFK0IsWUFGL0IsRUFHTCxlQUhLLEVBR1lDLElBSFosRUFHa0IsSUFIbEIsRUFHd0JMLE9BQU9DLEtBQVAsQ0FIeEIsRUFHdUMsU0FIdkMsRUFJTixPQUpNLEVBS0xDLElBTEssQ0FLQSxFQUxBLENBQVA7QUFNQTtBQUNELFFBQU8sQ0FDTixNQURNLEVBRUwscUJBRkssRUFFa0JGLE9BQU9JLEdBQVAsQ0FGbEIsRUFFK0IsWUFGL0IsRUFHTCxlQUhLLEVBR1lDLElBSFosRUFHa0IsS0FIbEIsRUFHeUJMLE9BQU9DLEtBQVAsQ0FIekIsRUFHd0MsVUFIeEMsRUFJTixPQUpNLEVBS0xDLElBTEssQ0FLQSxFQUxBLENBQVA7QUFNQSxDQWhERDs7QUFrREEsSUFBSVUsWUFBWSxTQUFaQSxTQUFZLENBQVVDLElBQVYsRUFBZ0JQLGVBQWhCLEVBQWlDO0FBQ2hELEtBQUlRLE9BQU8sRUFBWDtBQUNBLE1BQUssSUFBSVYsR0FBVCxJQUFnQlMsSUFBaEIsRUFBc0I7QUFDckIsTUFBSSxDQUFDQSxLQUFLRSxjQUFMLENBQW9CWCxHQUFwQixDQUFMLEVBQStCO0FBQzlCO0FBQ0E7O0FBRURVLFNBQU8sQ0FBQ0EsSUFBRCxFQUFPWCxjQUFjQyxHQUFkLEVBQW1CUyxLQUFLVCxHQUFMLENBQW5CLFVBQXFDUyxLQUFLVCxHQUFMLENBQXJDLEdBQWdERSxlQUFoRCxDQUFQLEVBQXlFSixJQUF6RSxDQUE4RSxFQUE5RSxDQUFQO0FBQ0E7QUFDRCxRQUFPWSxJQUFQO0FBQ0EsQ0FWRDs7QUFZQSxJQUFJRSxnQkFBZ0IsU0FBaEJBLGFBQWdCLENBQVVDLElBQVYsRUFBZ0JDLE9BQWhCLEVBQXlCO0FBQzVDLEtBQUk7QUFDSCxTQUFPLENBQ04sYUFETSxFQUNTckIsTUFEVCxFQUNpQixjQURqQixFQUVMZSxVQUFVLENBQUNPLEtBQUtDLEtBQUwsQ0FBV0gsSUFBWCxDQUFELENBQVYsRUFBOEJuQixtQkFBbUJvQixRQUFRbkIsUUFBM0IsQ0FBOUIsQ0FGSyxFQUdOLE9BSE0sRUFJTEcsSUFKSyxDQUlBLEVBSkEsQ0FBUDtBQUtBLEVBTkQsQ0FNRSxPQUFPbUIsQ0FBUCxFQUFVO0FBQ1gsU0FBTyxDQUNOLGNBRE0sRUFDVXhCLE1BRFYsRUFDa0IsV0FEbEIsRUFDK0J3QixFQUFFQyxRQUFGLEVBRC9CLEVBQzZDLFNBRDdDLEVBRUxwQixJQUZLLENBRUEsRUFGQSxDQUFQO0FBR0E7QUFDRCxDQVpEOztBQWNBcUIsT0FBT0MsT0FBUCxHQUFpQixVQUFTUCxJQUFULEVBQWVRLEdBQWYsRUFBb0I7QUFDcEMsS0FBSVosT0FBTyxFQUFYO0FBQ0EsS0FBSUssVUFBVU8sT0FBTyxFQUFDMUIsVUFBVSxJQUFYLEVBQXJCO0FBQ0EsS0FBSSxPQUFPa0IsSUFBUCxJQUFlLFFBQW5CLEVBQTZCO0FBQzVCSixTQUFPSSxJQUFQO0FBQ0EsRUFGRCxNQUVPLElBQUksUUFBT0EsSUFBUCx5Q0FBT0EsSUFBUCxNQUFlLFFBQW5CLEVBQTZCO0FBQ25DSixTQUFPTSxLQUFLTyxTQUFMLENBQWVULElBQWYsQ0FBUDtBQUNBO0FBQ0QsUUFBT0QsY0FBY0gsSUFBZCxFQUFvQkssT0FBcEIsQ0FBUDtBQUNBLENBVEQsQzs7Ozs7O0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsZUFBZTtBQUNuRDtBQUNBO0FBQ0EiLCJmaWxlIjoiaGlnaGxpZ2h0SnNvbi53b3JrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDEpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGFkYmVhZmE1OWMyMzc0ZDE2YjY2IiwidmFyIHByZWZpeCA9ICd0bS1jb2RlJztcblxudmFyIGdldEV4cGFuZGVyQ2xhc3NlcyA9IGZ1bmN0aW9uIChleHBhbmRlZCkge1xuXHRpZiAoIWV4cGFuZGVkKSB7XG5cdFx0cmV0dXJuICdleHBhbmRlZCBjb2xsYXBzZWQgaGlkZGVuJztcblx0fVxuXHRyZXR1cm4gJ2V4cGFuZGVkJztcbn07XG5cbnZhciBlbmNvZGUgPSBmdW5jdGlvbiAodmFsdWUpIHtcblx0cmV0dXJuIFsnPHNwYW4+JywgdmFsdWUsICc8L3NwYW4+J10uam9pbignJyk7XG59O1xuXG52YXIgY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uIChrZXksIHZhbHVlLCB0eXBlLCBleHBhbmRlckNsYXNzZXMpIHtcblx0dmFyIGtsYXNzID0gJ29iamVjdCcsXG5cdFx0b3BlbiA9ICd7Jyxcblx0XHRjbG9zZSA9ICd9JztcblxuXHRpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcblx0XHRrbGFzcyA9ICdhcnJheSc7XG5cdFx0b3BlbiA9ICdbJztcblx0XHRjbG9zZSA9ICddJztcblx0fVxuXG5cdGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuXHRcdHJldHVybiBbXG5cdFx0XHQnPGxpPicsXG5cdFx0XHRcdCc8c3BhbiBjbGFzcz1cImtleVwiPlwiJywgZW5jb2RlKGtleSksICdcIjogPC9zcGFuPicsXG5cdFx0XHRcdCc8c3BhbiBjbGFzcz1cIm51bGxcIj5cIicsIGVuY29kZSh2YWx1ZSksICdcIjwvc3Bhbj4nLFxuXHRcdFx0JzwvbGk+J1xuXHRcdF0uam9pbignJyk7XG5cdH1cblxuXHRpZiAodHlwZSA9PSAnb2JqZWN0Jykge1xuXHRcdHJldHVybiBbXG5cdFx0XHQnPGxpPicsXG5cdFx0XHRcdCc8c3BhbiBjbGFzcz1cIicsIGV4cGFuZGVyQ2xhc3NlcywgJ1wiPjwvc3Bhbj4nLFxuXHRcdFx0XHQnPHNwYW4gY2xhc3M9XCJrZXlcIj5cIicsIGVuY29kZShrZXkpLCAnXCI6IDwvc3Bhbj4gJyxcblx0XHRcdFx0JzxzcGFuIGNsYXNzPVwib3BlblwiPicsIG9wZW4sICc8L3NwYW4+ICcsXG5cdFx0XHRcdCc8dWwgY2xhc3M9XCInLCBrbGFzcywgJ1wiPicsXG5cdFx0XHRcdFx0anNvbjJodG1sKHZhbHVlLCBleHBhbmRlckNsYXNzZXMpLFxuXHRcdFx0XHQnPC91bD4nLFxuXHRcdFx0XHQnPHNwYW4gY2xhc3M9XCJjbG9zZVwiPicsIGNsb3NlLCAnPC9zcGFuPicsXG5cdFx0XHQnPC9saT4nXG5cdFx0XS5qb2luKCcnKTtcblx0fVxuXG5cdGlmICh0eXBlID09ICdudW1iZXInIHx8IHR5cGUgPT0gJ2Jvb2xlYW4nKSB7XG5cdFx0cmV0dXJuIFtcblx0XHRcdCc8bGk+Jyxcblx0XHRcdFx0JzxzcGFuIGNsYXNzPVwia2V5XCI+XCInLCBlbmNvZGUoa2V5KSwgJ1wiOiA8L3NwYW4+Jyxcblx0XHRcdFx0JzxzcGFuIGNsYXNzPVwiJywgdHlwZSwgJ1wiPicsIGVuY29kZSh2YWx1ZSksICc8L3NwYW4+Jyxcblx0XHRcdCc8L2xpPidcblx0XHRdLmpvaW4oJycpO1xuXHR9XG5cdHJldHVybiBbXG5cdFx0JzxsaT4nLFxuXHRcdFx0JzxzcGFuIGNsYXNzPVwia2V5XCI+XCInLCBlbmNvZGUoa2V5KSwgJ1wiOiA8L3NwYW4+Jyxcblx0XHRcdCc8c3BhbiBjbGFzcz1cIicsIHR5cGUsICdcIj5cIicsIGVuY29kZSh2YWx1ZSksICdcIjwvc3Bhbj4nLFxuXHRcdCc8L2xpPidcblx0XS5qb2luKCcnKTtcbn07XG5cbnZhciBqc29uMmh0bWwgPSBmdW5jdGlvbiAoanNvbiwgZXhwYW5kZXJDbGFzc2VzKSB7XG5cdHZhciBodG1sID0gJyc7XG5cdGZvciAodmFyIGtleSBpbiBqc29uKSB7XG5cdFx0aWYgKCFqc29uLmhhc093blByb3BlcnR5KGtleSkpIHtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblxuXHRcdGh0bWwgPSBbaHRtbCwgY3JlYXRlRWxlbWVudChrZXksIGpzb25ba2V5XSwgdHlwZW9mIGpzb25ba2V5XSwgZXhwYW5kZXJDbGFzc2VzKV0uam9pbignJyk7XG5cdH1cblx0cmV0dXJuIGh0bWw7XG59O1xuXG52YXIgZ2V0SnNvblZpZXdlciA9IGZ1bmN0aW9uIChkYXRhLCBvcHRpb25zKSB7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIFtcblx0XHRcdCc8dWwgY2xhc3M9XCInLCBwcmVmaXgsICctY29udGFpbmVyXCI+Jyxcblx0XHRcdFx0anNvbjJodG1sKFtKU09OLnBhcnNlKGRhdGEpXSwgZ2V0RXhwYW5kZXJDbGFzc2VzKG9wdGlvbnMuZXhwYW5kZWQpKSxcblx0XHRcdCc8L3VsPidcblx0XHRdLmpvaW4oJycpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0cmV0dXJuIFtcblx0XHRcdCc8ZGl2IGNsYXNzPVwiJywgcHJlZml4LCAnLWVycm9yXCIgPicsIGUudG9TdHJpbmcoKSwgJyA8L2Rpdj4nXG5cdFx0XS5qb2luKCcnKTtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkYXRhLCBvcHQpIHtcblx0dmFyIGpzb24gPSAnJztcblx0dmFyIG9wdGlvbnMgPSBvcHQgfHwge2V4cGFuZGVkOiB0cnVlfTtcblx0aWYgKHR5cGVvZiBkYXRhID09ICdzdHJpbmcnKSB7XG5cdFx0anNvbiA9IGRhdGE7XG5cdH0gZWxzZSBpZiAodHlwZW9mIGRhdGEgPT0gJ29iamVjdCcpIHtcblx0XHRqc29uID0gSlNPTi5zdHJpbmdpZnkoZGF0YSlcblx0fVxuXHRyZXR1cm4gZ2V0SnNvblZpZXdlcihqc29uLCBvcHRpb25zKTtcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zY3JpcHRzL2FwaS1leHBsb3Jlci92Mi9zcmMvc2VydmljZXMvanNvbi1oaWdobGlnaHQvanNvbi1wYXJzZS5qcyIsIi8qKlxuICogQ29kZSBmb3JtYXQgd2ViLXdvcmtlclxuICogQHBhcmFtIGV2ZW50XG4gKi9cbi8vIHZhciBoaWdobGlnaHRKc29uKClcbnZhciBoaWdobGlnaHRKc29uID0gcmVxdWlyZSgnLi9qc29uLXBhcnNlJyk7XG5cbm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gIHZhciBjb2RlID0gZXZlbnQuZGF0YTtcbiAgLy8gaW1wb3J0U2NyaXB0cygnanNvbi1wYXJzZS5qcycpO1xuICB2YXIgcmVzdWx0ID0gaGlnaGxpZ2h0SnNvbihjb2RlLCB7ZXhwYW5kZWQ6IHRydWV9KTtcbiAgLy8gdmFyIHJlc3VsdCA9SlNPTi5zdHJpbmdpZnkoY29kZSk7XG4gIHBvc3RNZXNzYWdlKHJlc3VsdCk7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zY3JpcHRzL2FwaS1leHBsb3Jlci92Mi9zcmMvc2VydmljZXMvanNvbi1oaWdobGlnaHQvaGlnaGxpZ2h0SnNvbi53b3JrZXIuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==