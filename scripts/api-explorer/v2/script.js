var base =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Main file for Api Explrer v2.0
	 * For development please use Webpack to bundle all modules
	 * It can be made using npm scripts cmd - 'webpack'
	 */
	// custom bindings
	__webpack_require__(2);
	
	// Modules
	var base = __webpack_require__(3);
	var apiKey = __webpack_require__(4);
	var ajaxService = __webpack_require__(5);
	
	// View Models
	var MenuViewModel = __webpack_require__(6);
	var ParamsViewModel = __webpack_require__(8);
	var MethodsViewModel = __webpack_require__(9);
	var RequestsListViewModel = __webpack_require__(10);
	
	// Components
	__webpack_require__(15);
	
	/**
	 * Main application view-model
	 * @param obj {object} global data object
	 */
	function AppViewModel(obj) {
	  var base = obj || {};
	  self = this;
	  this.apiKey = apiKey;
	
	  // observables
	  this.selectedCategory = ko.observable('');
	  this.selectedMethod = ko.observable('');
	  this.selectedParams = ko.observableArray([]);
		this.requests = ko.observableArray([]);
	
		// computed
	  this.URL = ko.computed(this.getUrl, this);
	  this.sendButtonText = ko.pureComputed(this.getMethodName, this);
	
	  // sub-models
	  this.menu = new MenuViewModel(base, this.selectedCategory);
	  this.methods = new MethodsViewModel(base, this.selectedCategory, this.selectedMethod);
	  this.params = new ParamsViewModel(base, this.selectedMethod, this.selectedParams);
	  this.requestsList = new RequestsListViewModel(this.requests, this.selectedParams);
	}
	
	/**
	 * Send request method
	 */
	AppViewModel.prototype.onClickSendBtn = function () {
	  ajaxService(this.URL(), this.requests, base);
	};
	
	/**
	 * Gets current method name
	 * @returns {string}
	 */
	AppViewModel.prototype.getMethodName = function () {
	  return this.selectedMethod().method.toLowerCase();
	};
	
	/**
	 * Gets raw url data array
	 * @returns {*[]}
	 */
	AppViewModel.prototype.getUrl = function () {
	  return [
	    this.selectedMethod(),
	    this.apiKey,
	    this.selectedParams()
	  ];
	};
	
	/**
	 * Gets deep prop
	 * @returns {*[]}
	 */
	Object.getProp = function(o, s) {
		if (typeof o !== 'object' || !s) {
			console.log(o,s);
			return;
		}
		s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
		s = s.replace(/^\./, '');           // strip a leading dot
		var a = s.split('.');
		for (var i = 0, n = a.length; i < n; ++i) {
			var k = a[i];
			if (k in o) {
				o = o[k];
			} else {
				return;
			}
		}
		return o;
	};
	
	/**
	 * Activates knockout.js
	 */
	ko.applyBindings(new AppViewModel(base));
	
	/**
	 * exports global variable
	 */
	module.exports = base;


/***/ },
/* 2 */
/***/ function(module, exports) {

	 module.exports = ko.bindingHandlers.foreachprop = {
	
		transformObject: function (params) {
			var properties = [];
			var obj, sortFn = params.sortFn;
	
			if (sortFn) {
				obj = params.data;
			} else {
				obj = params;
			}
	
			ko.utils.objectForEach(obj, function (key, value) {
				properties.push({
					key: key,
					value: value
				});
			});
	
			if (sortFn) {
				properties.sort(sortFn);
			}
	
			return properties;
		},
		init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
			var properties = ko.pureComputed(function () {
				var obj = ko.utils.unwrapObservable(valueAccessor());
				return ko.bindingHandlers.foreachprop.transformObject(obj);
			});
			ko.applyBindingsToNode(element, {
				foreach: properties
			}, bindingContext);
			return {
				controlsDescendantBindings: true
			};
		}
	};


/***/ },
/* 3 */
/***/ function(module, exports) {

	var base = {};
	var CONFIG_URL = '../../apidescription.xml';
	
	var parseData = function (xml) {
		var global = {};
		//get all APIs
		var resourcesEl = $(xml).find("resources").eq(0);
	
		// resource
		$(xml)
			.find("resource")
			.get()
			.map(function (res) {
				var resource = $(res);
				// method --------------------------------
				var methodElem = resource.find("method").eq(0);
	
				var method = {
					id : methodElem.attr("id"), // method id
					name : methodElem.attr("apigee:displayName") || methodElem.attr("id"), // method name
					method : methodElem.attr('name'), // GET or POST
					category : methodElem.find('[primary="true"]').text().trim(), // API name
					path: resource.attr('path'), // method URL
					base : resourcesEl.attr('base'), // method base link
					link : methodElem.find('doc').eq(0).attr('apigee:url'), // link to documentation
					description : methodElem.find('doc').eq(0).text().trim(), //method description
					parameters: {}
				};
	
				// params --------------------------------
				resource
					.find('param')
					.get()
					.map(function (par) {
						var param = $(par);
						var options = param.find('option');
						var isSelect = !!options.length;
	
						var parameter = {
							name: param.attr('name'),
							doc: param.first('doc').text().trim(),
							style: param.attr('style'),
							required: param.attr('required'),
							default: param.attr('default') === 'none' && isSelect ? '' : param.attr('default'),
							select: isSelect
						};
	
						if (isSelect) {
							parameter.options = options.get().map(function (option) {
								return {
									name: $(option).attr('value'),
									checked: $(option).attr('value') === parameter.default || $(option).attr('value') === 'none',
									link: false
								};
							});
						}
	
						method.parameters[parameter.name] = parameter;
					});
	
				/**
				 * Global obj composition
	       */
				// set category obj
				global[method.category] = global[method.category] || {};
	
				// set methods type obj
				global[method.category].ALL = global[method.category].ALL || {};
				global[method.category][method.method] = global[method.category][method.method] || {};
	
				// set method obj
				global[method.category].ALL[method.id] = method;
				global[method.category][method.method][method.id] = method;
			});
	
		return global;
	};
	
	//gets document from WADL configuration file
	var readFromWADL = function () {
	  $.ajax({
	    url: CONFIG_URL,
	    async : false,
	    dataType: ($.browser.msie) ? "text" : "xml",
	    success : function(response){
	      var xml;
	
	      if (typeof response == "string"){
	        xml = new ActiveXObject("Microsoft.XMLDOM");
	        xml.async = false;
	        xml.loadXML(response);
	      } else {
	        xml = response;
	      }
	
				base = parseData(xml);
	    },
	
	    error: function(XMLHttpRequest, textStatus, errorThrown){
	      alert('Data Could Not Be Loaded - '+ textStatus);
	    }
	  });
	};
	readFromWADL();
	module.exports = base;


/***/ },
/* 4 */
/***/ function(module, exports) {

	var apiKey = sessionStorage.getItem('tk-api-key') || apiKeyService.getApiExploreKey(); //API Key
	
	module.exports = {
	  name: 'apikey',
	  style: 'query',
	  value: ko.observable(apiKey)
	};


/***/ },
/* 5 */
/***/ function(module, exports) {

	/**
	 * Ajax Service
	 * @param url
	 * @param method
	 * @param callback
	 */
	var ajaxService = function (url, method, callback) {
	  $.ajax({
	    type: method,
	    url: url,
	    async: true,
	    dataType: "json",
	    complete: callback
	  });
	};
	
	/**
	 * Filters and prepares params pairs
	 * @param arr
	 * @returns {boolean}
	 */
	var prepareUrl = function (arr) {
	  var replacement, url, domain, path, method, apiKey, params;
	
	  if (!arr && !arr.length) {
	    return false;
	  }
	  
	  domain = arr[0].base;
	  path = arr[0].path;
	  apiKey = arr[1];
	  params = arr[2].filter(function (item) {
	    return item.style === 'query';
	  });
	
	  // arr of template marks
	  replacement = path.match(/([^{]*?)\w(?=\})/gmi);
	
	  // arr of template params
	  var templatesArr = arr[2].filter(function (item) {
	    return item.style === 'template';
	  });
	
	  // replacement
	  replacement.forEach(function (val) {
	    var param = templatesArr.find(function (item) {
	      return item.name === val;
	    });
	    path = path.replace('{'+ param.name + '}', param.value() || param.default);
	  });
	
	  // adds apiKey param
	  if (!params[0] || params[0].name !== 'apikey') {
	    params.unshift(apiKey);
	  }
	
	  // prepares params part of url
	  params = params.map(function (item) {
	      return [item.name, item.value() || item.default].join('=');
	    }).join('&');
	
	  url = [domain, '/', path, '?', params].join('');
	
	  return encodeURI(url);
	};
	
	// sends request to get the second column
	var sendPrimaryRequest = function (arr, requests, global) {
	  var url = prepareUrl(arr);
	
	  ajaxService(url, arr[0].method, function(res, msg) {
			var resObj = {
				req: url,
				index: requests().length
			};
	
			if (msg == 'error') {
				var err = res &&
					res.responseJSON &&
					res.responseJSON.errors &&
					res.responseJSON.errors[0];
	
				resObj.error = {
					code: err ? err.code: 500,
					message: err ? err.detail: 'No responce data!'
				}
			} else {
				global.lastResponse = resObj.res = {
					id: arr[0].id, // method id was used
					res: res.responseJSON // response
				};
			}
	
			// exporting data using observable
			requests.unshift(resObj);
	  });
	};
	
	
	module.exports = sendPrimaryRequest;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var hf = __webpack_require__(7);
	var self;
	
	
	/**
	 * Menu View-Model
	 * @param base
	 * @param category
	 * @constructor
	 */
	function MenuViewModel(base, category) {
	  self = this;
	  this.category = category;
	  this.categories = ko.observableArray(Object.keys(base).map(function (item, index) {
	    return {
	      checked: ko.observable(!index),
	      name: item,
	      link: false
	    }
	  }));
	
	  // initial load
	  this.selectCategory(this.categories()[0]);
	}
	
	/**
	 * Menu View-Model method
	 * @param category
	 */
	MenuViewModel.prototype.selectCategory = function (category) {
	  var categoryName = category.name;
	  self.category(categoryName);
	  hf.checkActive(self.categories, categoryName);
	};
	
	module.exports = MenuViewModel;


/***/ },
/* 7 */
/***/ function(module, exports) {

	exports.getModelArray = function getModelArray(params) {
	    var obj = params.obj || {},
	        arr = params.arr || [],
	        prop = params.prop || 'name';
	
	    for (var i in obj) {
	        if (!obj.hasOwnProperty(i)) { continue; }
	
	        var item = arr.find(function (m1) {
	            return m1.name === obj[i][prop];
	        });
	
	        if (item) { continue; }
	
	        arr.push({
	            checked: ko.observable(false),
	            name: obj[i][prop]
	        });
	    }
	    return arr;
	};
	
	exports.checkActive = function checkActive(koArr, activeElem) {
	    if (!koArr && !activeElem) {return false;}
	
	    koArr(koArr().map(function (obj) {
	        if (obj.name === activeElem) {
	            obj.checked(true);
	        } else {
	            obj.checked(false);
	        }
	        return obj;
	    }));
	};
	
	exports.iterate = function (obj) {
		for (var property in obj) {
			if (obj.hasOwnProperty(property)) {
				if (typeof obj[property] == "object") {
					iterate(obj[property]);
				}
				else {
					console.log('|' + property + " |  " + obj[property] + '|');
				}
			}
		}
	};
	


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var self;
	var base;
	var hf = __webpack_require__(7);
	/**
	 * Params View-Model
	 * @param raw
	 * @param method
	 * @param params
	 * @constructor
	 */
	function ParamsViewModel(raw, method, params) {
	  base = raw;
	  self = this;
	  this.animationSpeed = 200;
	
	  // observables
	  this.method = method;
	  this.params = params;
	  this.isHidden = ko.observable(true);
	  this.paramInFocus = ko.observable('');
		this.paramsModel = ko.observableArray([]);
	
		// computed
		// this.paramsModel = ko.computed(this.updateParamsModel, this);
		this.updateViewModel();
		this.method.subscribe(this.updateViewModel, this);
	
		this.isDirty = ko.computed(this.checkDirty, this);
	}
	
	
	/**
	 * Initial build of Select Model
	 */
	ParamsViewModel.prototype.updateViewModel = function () {
		var obj = this.method().parameters || {},
			arr = [];
	
		for (var i in obj) {
			if (!obj.hasOwnProperty(i)) {continue;}
	
			// copies all values from model to view-model
			var vmParam = $.extend({}, obj[i]);
	
			vmParam.value = ko.observable(vmParam.value || (vmParam.select && vmParam.default) || '');
	
			//add observable for selected options
			if (vmParam.select) {
				vmParam.options = ko.observableArray(obj[i].options.map(function (item) {
					var obj = $.extend({}, item);
					obj.checked = ko.observable(item.checked);
					return obj;
				}))
			}
	
			// 'dirty' flag watcher for current field
			vmParam.isDirty = ko.pureComputed(function () {
				if (this.select) {
					return this.value() !== this.default && this.value() !== 'none';
				}
				return !!(this.value().toString()).trim().length;
			}, vmParam);
	
			// add calendar btn for current field
			vmParam.hasCalendar = i.search(/(date|time)/gmi) != -1;
	
			// add pop-up btn for current field
			vmParam.hasPopUp = i.search(/(attractionId|venueId)/gmi) != -1;
	
			arr.push(vmParam);
		}
	
		// prepare output for request
		this.paramsModel(arr);
		this.paramInFocus(this.paramsModel()[0]);
		this.prepareUrlPairs(arr, this.params);
		return arr;
	};
	
	/**
	 * Dirty params form observable method
	 * @returns {boolean}
	 */
	ParamsViewModel.prototype.checkDirty = function () {
		this.prepareUrlPairs(this.paramsModel(), this.params);
		var dirty = this.paramsModel().filter(function (item) {
			return item.isDirty() === true;
		});
		return dirty.length > 0;
	};
	
	
	/**
	 * Enter key handler
	 * @param model
	 * @param event
	 */
	ParamsViewModel.prototype.onEnterKeyDown = function (model, event) {
	  if (event.keyCode === 13) {
	    $('#api-exp-get-btn').trigger('click');
	  } else {
	    return true;
	  }
	};
	
	/**
	 * Slide toggle for params container method
	 * @param viewModel
	 * @param event
	 */
	ParamsViewModel.prototype.slideToggle = function (viewModel, event) {
	  $(event.currentTarget)
	    .parents('.js-slide-control')
	    .find('.js-slide-wrapper')
	    .slideToggle(viewModel.animationSpeed, function () {
	      viewModel.isHidden(!viewModel.isHidden());
	    });
	};
	
	/**
	 * Maches focused param
	 * @param item
	 */
	ParamsViewModel.prototype.onFocus = function (item) {
	  self.paramInFocus(item);
	};
	
	/**
	 * Filters params by defined value
	 * @param arr
	 * @param koObs
	 * @returns {boolean}
	 */
	ParamsViewModel.prototype.prepareUrlPairs = function (arr, koObs) {
	  if (!arr && !koObs) {return false;}
	
	  return koObs(arr.filter(function (item) {
	    return (item.value() || item.default);
	  }));
	};
	
	/**
	 * On select value handler for params select
	 * @param param {object} parameter view-model
	 * @param option {object} option view-model
	 */
	ParamsViewModel.prototype.onSelectParamValue = function (param, option) {
		hf.checkActive(param.options, option.name);
		param.value(option.name);
	};
	
	/**
	 * Params clear button handler
	 * @param vm {object} view model
	 * @param e {object} event
	 */
	ParamsViewModel.prototype.onParamsClear = function (vm, e) {
		this.updateViewModel();
	};
	
	module.exports = ParamsViewModel;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var hf = __webpack_require__(7);
	var self;
	var base;
	var category;
	
	/**
	 * Methods View-Model
	 * @param raw
	 * @param category
	 * @param method
	 * @constructor
	 */
	function MethodsViewModel(raw, category, method) {
	  self = this;
	  base = raw;
	
	  // observables
	  this.category = category;
	  this.method = method;
	  this.togglePopUp = ko.observable(false);
	  this.radiosModel = ko.observableArray([]);
	  this.methodsViewModel = ko.observableArray([]);
	  this.updateModel(this.category());
	  this.category.subscribe(this.updateModel, this);
	}
	
	/**
	 * On category change handler
	 * Methods View-Model method
	 * @param category
	 */
	MethodsViewModel.prototype.updateModel = function (category) {
	  // initial radios model
	  self.updateRadiosModel(base[category]);
	  // initial select model (first method in first section for start)
	  self.updateSelect(self.radiosModel()[0]);
	};
	
	/**
	 * Onchange handler for Radio buttons
	 * @param item
	 */
	MethodsViewModel.prototype.onchangeRadios = function (item) {
	  //update Radios Model
	  hf.checkActive(self.radiosModel, item.name);
	  //update Select Model
	  self.updateSelect(item);
	};
	
	/**
	 * Initial build of Radios Model
	 * @param param
	 * @returns {Array}
	 */
	MethodsViewModel.prototype.updateRadiosModel = function (param) {
	  var obj = param || {},
	    arr = [];
	
	  for (var i in obj) {
	    if (!obj.hasOwnProperty(i)) { continue; }
	    var item = {
	      checked: ko.observable(i === 'ALL'),
	      name: i
	    };
	
	    if (i === 'ALL') {
	      arr.unshift(item)
	    } else {
	      arr.push(item);
	    }
	  }
		arr = arr.sort(compareMethods);
	  this.radiosModel(arr);
	  return arr;
	};
	
	/**
	 * Initial build of Select Model
	 * @param item
	 */
	MethodsViewModel.prototype.updateSelect = function (item) {
	  var obj = base[self.category()][item.name]|| {},
	    arr = [],
	    count = 0;
	
	  for (var i in obj) {
	    if (!obj.hasOwnProperty(i)) { continue; }
	    var property = obj[i];
			// copies all values from model to view-model
			var vmMethod = $.extend({}, property);
	
			delete vmMethod.parameters;
			vmMethod.checked = ko.observable(!count);
	
			arr.push(vmMethod);
	
	    // set global observable
	    !count && this.method(base[property.category][property.method][property.id]);
	
	    count++;
	
	  }
	
		this.methodsViewModel(arr);
		return arr;
	};
	
	MethodsViewModel.prototype.onSelectMethod = function (item) {
	  hf.checkActive(self.methodsViewModel, item.name);
	  self.method(base[item.category][item.method][item.id]);
	};
	
	MethodsViewModel.prototype.onAboutClick = function (model, event) {
	  model.togglePopUp(!model.togglePopUp());
	};
	
	/**
	 * Sort function for methods aray
	 * @param f
	 * @param s
	 * @returns {number}
	 */
	function compareMethods(f,s) {
		var a = f.name.toUpperCase();
		var b = s.name.toUpperCase();
	
		if (a === b) {return 0;}
		if (a === 'ALL' ||
			(a === 'GET' && (b === 'POST' || b === 'PUT' || b === 'DELETE')) ||
			(a === 'POST' && (b === 'PUT' || b === 'DELETE')) ||
			(a === 'PUT' && b === 'DELETE')) {
			return -1;
		}
		return 1;
	}
	
	module.exports = MethodsViewModel;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var jsonHighlight = __webpack_require__(11);
	var self;
	var slider = __webpack_require__(14);
	
	function RequestsListViewModel(requests, url) {
		this.url = url;
		self = this;
		this.colors = [
			'column-color-1',
			'column-color-2',
			'column-color-3',
			'column-color-4',
			'column-color-5',
			'column-color-6',
			'column-color-7',
			'column-color-8',
			'column-color-9',
			'column-color-10',
			'column-color-11',
			'column-color-12'
		];
		this.requests = requests;
		this.isActiveTab = ko.observable(false);
		this.viewModel = ko.observableArray([]);
		this.clearBtnIsVisible = ko.computed(this._isVisible, this);
		this.requests.subscribe(this.updateModel, this);
	}
	
	/**
	 * Update Viewmodel of request list
	 * @param arr
	 */
	RequestsListViewModel.prototype.updateModel = function (arr) {
		var self = this;
		
		var newModel = this.requests()
			.map(function (obj) {
				var item =  $.extend({}, obj, {
					color: self.colors[obj.index % self.colors.length],
					active: ko.observable(false),
					resHTML: ko.observable('')
				});
				return item;
			});
		slider.remove(self.viewModel().length);
		self.viewModel(newModel);
		setTimeout(function () {
			slider.set(self.viewModel().length);
			$('#show-details-0').trigger('click');
		}, 10);
	};
	
	/**
	 * get details
	 * @param data
	 */
	RequestsListViewModel.prototype.getMore = function (data) {
		var card = this;
		var currentSlider = $('#slider-' + card.sectionIndex);
		var component = $('<section data-bind="component: {name: \'panel-group\', params: params}"></section>');
		var curslick = currentSlider.slick('getSlick');
		var newData = {};
		
		// gathering all primitive props in additional panel
		for (var key in data) {
			if (!data.hasOwnProperty(key)) {
				continue;
			}
			var val = data[key];
			if (typeof val !== 'object') {
				newData[data.type || Object.keys(data)[0]] = newData[data.type || Object.keys(data)[0]] || {};
				newData[data.type || Object.keys(data)[0]][key] = val;
			} else {
				newData[key] = val;
			}
		}
		
		// extending additional data (copy)
		var params = $.extend({}, card, {cards: newData, groupIndex: card.groupIndex + 1});
		// apply component data bindings
		ko.applyBindings({
			params: params
		}, component[0]);
		
		// add slide with selected data
		currentSlider.slick('slickAdd', component);
		
		// remove outstanding slides
		for (var i = curslick.slideCount - 2; i > card.groupIndex; i--) {
			currentSlider.slick('slickRemove', i, false);
		}
		// move to next slide
		currentSlider.slick('slickNext');
	};
	
	/**
	 * Visibility flag for Clear btn
	 * @returns {boolean}
	 * @private
	 */
	RequestsListViewModel.prototype._isVisible = function () {
		return this.requests().length > 0;
	};
	
	/**
	 * Clear requeststs list handler
	 * @param vm
	 * @param event
	 */
	RequestsListViewModel.prototype.onClearRequests = function (vm, event) {
		this.requests([]);
	};
	
	/**
	 * Details toggle handler
	 * @param vm
	 * @param event
	 */
	RequestsListViewModel.prototype.getDetails = function (vm, event) {
		if (!this.resHTML().length) {
			jsonHighlight(this.resHTML, this.res);
		}
		this.active(!this.active());
	};
	
	/**
	 * Join string for id's
	 * @param s
	 * @param i
	 * @returns {string}
	 */
	RequestsListViewModel.prototype.getStr = function (s, i) {
		var str = s;
		var i1 = i ? i() : '';
		return [
			str,
			i1
		].join('-');
	};
	
	module.exports = RequestsListViewModel;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var Worker = __webpack_require__(12); // Json-formatter worker
	
	module.exports = function (observable, code) {
		var animTime = 100;
		var worker = new Worker;
	
		worker.onmessage = function (event) {
			observable(event.data);
	
			$(document)
				.on('click touch', '.tm-code-container .expanded', function jsonCodeContainerExpanded(e) {
					e.preventDefault();
					e.stopPropagation();
					var $self = $(this);
					$self
						.parent()
						.find('>ul')
						.slideUp(animTime, function() {
							$self.addClass('collapsed');
						});
				})
				.on('click touch', '.tm-code-container .expanded.collapsed', function jsonCodeContainerCollapsed(e) {
					e.preventDefault();
					e.stopPropagation();
					var $self = $(this);
					$self
						.removeClass('collapsed')
						.parent()
						.find('>ul')
						.slideDown(animTime, function() {
							$self
								.removeClass('collapsed')
								.removeClass('hidden');
						});
				})
		};
		worker.onerror = function (event) {
			console.log(event);
		};
	
		worker.postMessage(code);
	};


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function() {
		return __webpack_require__(13)("/******/ (function(modules) { // webpackBootstrap\n/******/ \t// The module cache\n/******/ \tvar installedModules = {};\n/******/\n/******/ \t// The require function\n/******/ \tfunction __webpack_require__(moduleId) {\n/******/\n/******/ \t\t// Check if module is in cache\n/******/ \t\tif(installedModules[moduleId])\n/******/ \t\t\treturn installedModules[moduleId].exports;\n/******/\n/******/ \t\t// Create a new module (and put it into the cache)\n/******/ \t\tvar module = installedModules[moduleId] = {\n/******/ \t\t\texports: {},\n/******/ \t\t\tid: moduleId,\n/******/ \t\t\tloaded: false\n/******/ \t\t};\n/******/\n/******/ \t\t// Execute the module function\n/******/ \t\tmodules[moduleId].call(module.exports, module, module.exports, __webpack_require__);\n/******/\n/******/ \t\t// Flag the module as loaded\n/******/ \t\tmodule.loaded = true;\n/******/\n/******/ \t\t// Return the exports of the module\n/******/ \t\treturn module.exports;\n/******/ \t}\n/******/\n/******/\n/******/ \t// expose the modules object (__webpack_modules__)\n/******/ \t__webpack_require__.m = modules;\n/******/\n/******/ \t// expose the module cache\n/******/ \t__webpack_require__.c = installedModules;\n/******/\n/******/ \t// __webpack_public_path__\n/******/ \t__webpack_require__.p = \"\";\n/******/\n/******/ \t// Load entry module and return exports\n/******/ \treturn __webpack_require__(0);\n/******/ })\n/************************************************************************/\n/******/ ([\n/* 0 */\n/***/ function(module, exports, __webpack_require__) {\n\n\t/**\r\n\t * Code format web-worker\r\n\t * @param event\r\n\t */\r\n\t// var highlightJson()\r\n\tvar highlightJson = __webpack_require__(1);\r\n\t\r\n\tonmessage = function(event) {\r\n\t  var code = event.data;\r\n\t  // importScripts('json-parse.js');\r\n\t  var result = highlightJson(code, {expanded: true});\r\n\t  // var result =JSON.stringify(code);\r\n\t  postMessage(result);\r\n\t};\r\n\n\n/***/ },\n/* 1 */\n/***/ function(module, exports) {\n\n\tvar prefix = 'tm-code';\r\n\t\r\n\tvar getExpanderClasses = function (expanded) {\r\n\t\tif (!expanded) {\r\n\t\t\treturn 'expanded collapsed hidden';\r\n\t\t}\r\n\t\treturn 'expanded';\r\n\t};\r\n\t\r\n\tvar encode = function (value) {\r\n\t\treturn ['<span>', value, '</span>'].join('');\r\n\t};\r\n\t\r\n\tvar createElement = function (key, value, type, expanderClasses) {\r\n\t\tvar klass = 'object',\r\n\t\t\topen = '{',\r\n\t\t\tclose = '}';\r\n\t\r\n\t\tif (Array.isArray(value)) {\r\n\t\t\tklass = 'array';\r\n\t\t\topen = '[';\r\n\t\t\tclose = ']';\r\n\t\t}\r\n\t\r\n\t\tif (value === null) {\r\n\t\t\treturn [\r\n\t\t\t\t'<li>',\r\n\t\t\t\t\t'<span class=\"key\">\"', encode(key), '\": </span>',\r\n\t\t\t\t\t'<span class=\"null\">\"', encode(value), '\"</span>',\r\n\t\t\t\t'</li>'\r\n\t\t\t].join('');\r\n\t\t}\r\n\t\r\n\t\tif (type == 'object') {\r\n\t\t\treturn [\r\n\t\t\t\t'<li>',\r\n\t\t\t\t\t'<span class=\"', expanderClasses, '\"></span>',\r\n\t\t\t\t\t'<span class=\"key\">\"', encode(key), '\": </span> ',\r\n\t\t\t\t\t'<span class=\"open\">', open, '</span> ',\r\n\t\t\t\t\t'<ul class=\"', klass, '\">',\r\n\t\t\t\t\t\tjson2html(value, expanderClasses),\r\n\t\t\t\t\t'</ul>',\r\n\t\t\t\t\t'<span class=\"close\">', close, '</span>',\r\n\t\t\t\t'</li>'\r\n\t\t\t].join('');\r\n\t\t}\r\n\t\r\n\t\tif (type == 'number' || type == 'boolean') {\r\n\t\t\treturn [\r\n\t\t\t\t'<li>',\r\n\t\t\t\t\t'<span class=\"key\">\"', encode(key), '\": </span>',\r\n\t\t\t\t\t'<span class=\"', type, '\">', encode(value), '</span>',\r\n\t\t\t\t'</li>'\r\n\t\t\t].join('');\r\n\t\t}\r\n\t\treturn [\r\n\t\t\t'<li>',\r\n\t\t\t\t'<span class=\"key\">\"', encode(key), '\": </span>',\r\n\t\t\t\t'<span class=\"', type, '\">\"', encode(value), '\"</span>',\r\n\t\t\t'</li>'\r\n\t\t].join('');\r\n\t};\r\n\t\r\n\tvar json2html = function (json, expanderClasses) {\r\n\t\tvar html = '';\r\n\t\tfor (var key in json) {\r\n\t\t\tif (!json.hasOwnProperty(key)) {\r\n\t\t\t\tcontinue;\r\n\t\t\t}\r\n\t\r\n\t\t\thtml = [html, createElement(key, json[key], typeof json[key], expanderClasses)].join('');\r\n\t\t}\r\n\t\treturn html;\r\n\t};\r\n\t\r\n\tvar getJsonViewer = function (data, options) {\r\n\t\ttry {\r\n\t\t\treturn [\r\n\t\t\t\t'<ul class=\"', prefix, '-container\">',\r\n\t\t\t\t\tjson2html([JSON.parse(data)], getExpanderClasses(options.expanded)),\r\n\t\t\t\t'</ul>'\r\n\t\t\t].join('');\r\n\t\t} catch (e) {\r\n\t\t\treturn [\r\n\t\t\t\t'<div class=\"', prefix, '-error\" >', e.toString(), ' </div>'\r\n\t\t\t].join('');\r\n\t\t}\r\n\t};\r\n\t\r\n\tmodule.exports = function(data, opt) {\r\n\t\tvar json = '';\r\n\t\tvar options = opt || {expanded: true};\r\n\t\tif (typeof data == 'string') {\r\n\t\t\tjson = data;\r\n\t\t} else if (typeof data == 'object') {\r\n\t\t\tjson = JSON.stringify(data)\r\n\t\t}\r\n\t\treturn getJsonViewer(json, options);\r\n\t};\r\n\n\n/***/ }\n/******/ ]);\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNDcxYjEwZDQ0Y2E3MjgwZTExNGEiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9hcGktZXhwbG9yZXIvdjIvbW9kdWxlcy9oaWdobGlnaHRKc29uLndvcmtlci5qcyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzL2FwaS1leHBsb3Jlci92Mi9tb2R1bGVzL2pzb24tcGFyc2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHFDQUFvQyxlQUFlO0FBQ25EO0FBQ0E7QUFDQTs7Ozs7OztBQ2JBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVc7QUFDWCxhQUFZOztBQUVaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHdCQUF1QjtBQUN2QjtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImhpZ2hsaWdodEpzb24ud29ya2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCA0NzFiMTBkNDRjYTcyODBlMTE0YVxuICoqLyIsIi8qKlxyXG4gKiBDb2RlIGZvcm1hdCB3ZWItd29ya2VyXHJcbiAqIEBwYXJhbSBldmVudFxyXG4gKi9cclxuLy8gdmFyIGhpZ2hsaWdodEpzb24oKVxyXG52YXIgaGlnaGxpZ2h0SnNvbiA9IHJlcXVpcmUoJy4vanNvbi1wYXJzZScpO1xyXG5cclxub25tZXNzYWdlID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuICB2YXIgY29kZSA9IGV2ZW50LmRhdGE7XHJcbiAgLy8gaW1wb3J0U2NyaXB0cygnanNvbi1wYXJzZS5qcycpO1xyXG4gIHZhciByZXN1bHQgPSBoaWdobGlnaHRKc29uKGNvZGUsIHtleHBhbmRlZDogdHJ1ZX0pO1xyXG4gIC8vIHZhciByZXN1bHQgPUpTT04uc3RyaW5naWZ5KGNvZGUpO1xyXG4gIHBvc3RNZXNzYWdlKHJlc3VsdCk7XHJcbn07XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zY3JpcHRzL2FwaS1leHBsb3Jlci92Mi9tb2R1bGVzL2hpZ2hsaWdodEpzb24ud29ya2VyLmpzXG4gKiogbW9kdWxlIGlkID0gMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIHByZWZpeCA9ICd0bS1jb2RlJztcclxuXHJcbnZhciBnZXRFeHBhbmRlckNsYXNzZXMgPSBmdW5jdGlvbiAoZXhwYW5kZWQpIHtcclxuXHRpZiAoIWV4cGFuZGVkKSB7XHJcblx0XHRyZXR1cm4gJ2V4cGFuZGVkIGNvbGxhcHNlZCBoaWRkZW4nO1xyXG5cdH1cclxuXHRyZXR1cm4gJ2V4cGFuZGVkJztcclxufTtcclxuXHJcbnZhciBlbmNvZGUgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuXHRyZXR1cm4gWyc8c3Bhbj4nLCB2YWx1ZSwgJzwvc3Bhbj4nXS5qb2luKCcnKTtcclxufTtcclxuXHJcbnZhciBjcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24gKGtleSwgdmFsdWUsIHR5cGUsIGV4cGFuZGVyQ2xhc3Nlcykge1xyXG5cdHZhciBrbGFzcyA9ICdvYmplY3QnLFxyXG5cdFx0b3BlbiA9ICd7JyxcclxuXHRcdGNsb3NlID0gJ30nO1xyXG5cclxuXHRpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcclxuXHRcdGtsYXNzID0gJ2FycmF5JztcclxuXHRcdG9wZW4gPSAnWyc7XHJcblx0XHRjbG9zZSA9ICddJztcclxuXHR9XHJcblxyXG5cdGlmICh2YWx1ZSA9PT0gbnVsbCkge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0JzxsaT4nLFxyXG5cdFx0XHRcdCc8c3BhbiBjbGFzcz1cImtleVwiPlwiJywgZW5jb2RlKGtleSksICdcIjogPC9zcGFuPicsXHJcblx0XHRcdFx0JzxzcGFuIGNsYXNzPVwibnVsbFwiPlwiJywgZW5jb2RlKHZhbHVlKSwgJ1wiPC9zcGFuPicsXHJcblx0XHRcdCc8L2xpPidcclxuXHRcdF0uam9pbignJyk7XHJcblx0fVxyXG5cclxuXHRpZiAodHlwZSA9PSAnb2JqZWN0Jykge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0JzxsaT4nLFxyXG5cdFx0XHRcdCc8c3BhbiBjbGFzcz1cIicsIGV4cGFuZGVyQ2xhc3NlcywgJ1wiPjwvc3Bhbj4nLFxyXG5cdFx0XHRcdCc8c3BhbiBjbGFzcz1cImtleVwiPlwiJywgZW5jb2RlKGtleSksICdcIjogPC9zcGFuPiAnLFxyXG5cdFx0XHRcdCc8c3BhbiBjbGFzcz1cIm9wZW5cIj4nLCBvcGVuLCAnPC9zcGFuPiAnLFxyXG5cdFx0XHRcdCc8dWwgY2xhc3M9XCInLCBrbGFzcywgJ1wiPicsXHJcblx0XHRcdFx0XHRqc29uMmh0bWwodmFsdWUsIGV4cGFuZGVyQ2xhc3NlcyksXHJcblx0XHRcdFx0JzwvdWw+JyxcclxuXHRcdFx0XHQnPHNwYW4gY2xhc3M9XCJjbG9zZVwiPicsIGNsb3NlLCAnPC9zcGFuPicsXHJcblx0XHRcdCc8L2xpPidcclxuXHRcdF0uam9pbignJyk7XHJcblx0fVxyXG5cclxuXHRpZiAodHlwZSA9PSAnbnVtYmVyJyB8fCB0eXBlID09ICdib29sZWFuJykge1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0JzxsaT4nLFxyXG5cdFx0XHRcdCc8c3BhbiBjbGFzcz1cImtleVwiPlwiJywgZW5jb2RlKGtleSksICdcIjogPC9zcGFuPicsXHJcblx0XHRcdFx0JzxzcGFuIGNsYXNzPVwiJywgdHlwZSwgJ1wiPicsIGVuY29kZSh2YWx1ZSksICc8L3NwYW4+JyxcclxuXHRcdFx0JzwvbGk+J1xyXG5cdFx0XS5qb2luKCcnKTtcclxuXHR9XHJcblx0cmV0dXJuIFtcclxuXHRcdCc8bGk+JyxcclxuXHRcdFx0JzxzcGFuIGNsYXNzPVwia2V5XCI+XCInLCBlbmNvZGUoa2V5KSwgJ1wiOiA8L3NwYW4+JyxcclxuXHRcdFx0JzxzcGFuIGNsYXNzPVwiJywgdHlwZSwgJ1wiPlwiJywgZW5jb2RlKHZhbHVlKSwgJ1wiPC9zcGFuPicsXHJcblx0XHQnPC9saT4nXHJcblx0XS5qb2luKCcnKTtcclxufTtcclxuXHJcbnZhciBqc29uMmh0bWwgPSBmdW5jdGlvbiAoanNvbiwgZXhwYW5kZXJDbGFzc2VzKSB7XHJcblx0dmFyIGh0bWwgPSAnJztcclxuXHRmb3IgKHZhciBrZXkgaW4ganNvbikge1xyXG5cdFx0aWYgKCFqc29uLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuXHRcdFx0Y29udGludWU7XHJcblx0XHR9XHJcblxyXG5cdFx0aHRtbCA9IFtodG1sLCBjcmVhdGVFbGVtZW50KGtleSwganNvbltrZXldLCB0eXBlb2YganNvbltrZXldLCBleHBhbmRlckNsYXNzZXMpXS5qb2luKCcnKTtcclxuXHR9XHJcblx0cmV0dXJuIGh0bWw7XHJcbn07XHJcblxyXG52YXIgZ2V0SnNvblZpZXdlciA9IGZ1bmN0aW9uIChkYXRhLCBvcHRpb25zKSB7XHJcblx0dHJ5IHtcclxuXHRcdHJldHVybiBbXHJcblx0XHRcdCc8dWwgY2xhc3M9XCInLCBwcmVmaXgsICctY29udGFpbmVyXCI+JyxcclxuXHRcdFx0XHRqc29uMmh0bWwoW0pTT04ucGFyc2UoZGF0YSldLCBnZXRFeHBhbmRlckNsYXNzZXMob3B0aW9ucy5leHBhbmRlZCkpLFxyXG5cdFx0XHQnPC91bD4nXHJcblx0XHRdLmpvaW4oJycpO1xyXG5cdH0gY2F0Y2ggKGUpIHtcclxuXHRcdHJldHVybiBbXHJcblx0XHRcdCc8ZGl2IGNsYXNzPVwiJywgcHJlZml4LCAnLWVycm9yXCIgPicsIGUudG9TdHJpbmcoKSwgJyA8L2Rpdj4nXHJcblx0XHRdLmpvaW4oJycpO1xyXG5cdH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZGF0YSwgb3B0KSB7XHJcblx0dmFyIGpzb24gPSAnJztcclxuXHR2YXIgb3B0aW9ucyA9IG9wdCB8fCB7ZXhwYW5kZWQ6IHRydWV9O1xyXG5cdGlmICh0eXBlb2YgZGF0YSA9PSAnc3RyaW5nJykge1xyXG5cdFx0anNvbiA9IGRhdGE7XHJcblx0fSBlbHNlIGlmICh0eXBlb2YgZGF0YSA9PSAnb2JqZWN0Jykge1xyXG5cdFx0anNvbiA9IEpTT04uc3RyaW5naWZ5KGRhdGEpXHJcblx0fVxyXG5cdHJldHVybiBnZXRKc29uVmlld2VyKGpzb24sIG9wdGlvbnMpO1xyXG59O1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc2NyaXB0cy9hcGktZXhwbG9yZXIvdjIvbW9kdWxlcy9qc29uLXBhcnNlLmpzXG4gKiogbW9kdWxlIGlkID0gMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==", __webpack_require__.p + "highlightJson.worker.js");
	};

/***/ },
/* 13 */
/***/ function(module, exports) {

	// http://stackoverflow.com/questions/10343913/how-to-create-a-web-worker-from-a-string
	
	var URL = window.URL || window.webkitURL;
	module.exports = function(content, url) {
		try {
			try {
				var blob;
				try { // BlobBuilder = Deprecated, but widely implemented
					var BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
					blob = new BlobBuilder();
					blob.append(content);
					blob = blob.getBlob();
				} catch(e) { // The proposed API
					blob = new Blob([content]);
				}
				return new Worker(URL.createObjectURL(blob));
			} catch(e) {
				return new Worker('data:application/javascript,' + encodeURIComponent(content));
			}
		} catch(e) {
			return new Worker(url);
		}
	}

/***/ },
/* 14 */
/***/ function(module, exports) {

	function slick(times) {
		"use strict";
		var selector = '#slider-';
		
		for (var i = 0; i < times; i++) {
			$(selector + i).slick({
				dots: false,
				infinite: false,
				speed: 300,
				slidesToShow: 3,
				slidesToScroll: 1,
				variableWidth: true,
				autoplay: false,
				responsive: [
					{
						breakpoint: 1200,
						settings: {
							variableWidth: true,
							slidesToShow: 2,
							slidesToScroll: 1,
							infinite: false,
							dots: false
						}
					},
					{
						breakpoint: 800,
						settings: {
							variableWidth: true,
							slidesToShow: 1,
							slidesToScroll: 1
						}
					}
				]
			});
		}
	}
	
	function unslick(times) {
		"use strict";
		var selector = '#slider-';
		
		for (var i = 0; i < times; i++) {
			$(selector + i).slick('unslick');
		}
		console.log('cleared');
	}
	
	module.exports = {
		set: slick,
		remove: unslick
	};


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (function () {
		__webpack_require__(16);
		__webpack_require__(17);
		__webpack_require__(19);
		__webpack_require__(20);
		__webpack_require__(21);
		__webpack_require__(22);
	}());


/***/ },
/* 16 */
/***/ function(module, exports) {

	/**
	 * Custom Select component
	 */
	var self;
	
	/**
	 * Custom Select View-Model
	 * @param params
	 * @constructor
	 */
	function CustomSelect(params) {
	  self = this;
	
	  this.animationSpeed = params.animationSpeed || 200;
		this.curentSelectData = params.data || null;
		this.onFocus = params.focus || null;
		
	  //observables
	  this.selectModel = typeof params.options !=='function' ? ko.observableArray(params.options):  params.options;
	  this.placeholder = ko.observable(params.placeholder || '');
	  this.onselect = params.onselect || function (item) { console.log(item +'selected!')};
	  this.selected = ko.observable(this.selectModel()[0]);
	  this.isOneOption = ko.pureComputed(function () {
	    return this.selectModel().length < 2; // more than one option
	  }, this);
	}
	
	function findElement(event) {
	  var parent = $(event.currentTarget).parents('.js-custom-select');
	  return {
	    wrapper: parent.find('.js-custom-select-wrapper'),
	    layer: parent.find('.js-custom-select-layer')
	  }
	}
	
	/**
	 * Custom Select View-Model method
	 * @param viewModel
	 * @param event
	 */
	CustomSelect.prototype.slideToggle = function(viewModel, event) {
		// elem in focus emulation
		this.onFocus && this.onFocus(this.curentSelectData);
	
		if (this.isOneOption()) {return false;}
	  var el = findElement(event);
	    el.wrapper.slideToggle(viewModel.animationSpeed);
	    el.layer.toggleClass('hidden');
	};
	
	/**
	 * Custom Select View-Model method
	 * @param item
	 * @param event
	 */
	CustomSelect.prototype.selectItem = function (item, event) {
	  var self = this;
	  this.selected(item);
	  // run handler
	  this.onselect(item);
		// slide up
	  this.slideToggle(self, event);
	};
	
	module.exports = ko.components.register('custom-select', {
	  viewModel: CustomSelect,
	  template: ([
	    '<div class="api-exp-custom-select js-custom-select">',
	      '<div class="api-exp-custom-select-wrapper">',
	        '<select data-bind="options: selectModel, optionsText: \'name\', value: selected" class="api-exp-custom-select__field" name="api-exp-method"></select>',
	        '<span class="api-exp-custom-select__placeholder">',
	          '<input data-bind="event: {click: slideToggle}, attr: {value: selected().name, disabled: isOneOption}" type="text" value="" readonly="">',
	          '<b data-bind="css: {hidden: isOneOption}" class="api-exp-custom-select__chevron">&nbsp;</b>',
	        '</span>',
	        '<ul data-bind="foreach: selectModel" class="api-exp-custom-select__list js-custom-select-wrapper">',
	          '<li data-bind="css: {\'active\': checked}" class="api-exp-custom-select__item">',
	            '<button data-bind="event: {click: $parent.selectItem.bind($parent)}, text: name, css: {\'active\': checked()}, attr: {\'data-value\': name}"  class="api-exp-custom-select__item-label" href="#"></button>',
	            // '<span data-bind="if: link">',
	            	'<a data-bind="attr: {href: link}, css: {\'hidden\': !link}" class="api-exp-custom-select__item-link" target="_blank">&nbsp;</a>',
	            // '</span>',
	          '</li>',
	        '</ul>',
	      '</div>',
	      '<div data-bind="click: slideToggle" class="api-exp-custom-select-layer js-custom-select-layer hidden"></div>',
	    '</div>'
	  ]).join('')
	});


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var self;
	
	function cardGroupComponent(params) {
		self = this;
		var url = params.url;
		this.filter = __webpack_require__(18);
		this.cards = this.removeCards(params.cards);
		this.groupIndex = params.groupIndex || 0;
		this.cardIndex = params.cardIndex;
		this.sectionIndex = ko.utils.unwrapObservable(params.sectionIndex);
		this.data = params.data;
		this.colorClass = params.colorClass;
		this.getMore = params.getMore;
		this.reqId = this.reqId || params.reqId;
		this.cardSize = params.cardSize || this.cards.page.size;
		this.pageParam = (params.pageParam || ko.utils.unwrapObservable(url).find(function (item) {
			return item.name === 'page';
		})).value;
		
		this.collapseId = [
			'card-panel-body-',
			this.sectionIndex,
			this.groupIndex
		].join('');
		
		this.isActive = ko.observable(false);
	}
	
	cardGroupComponent.prototype.removeCards = function (obj) {
		var deprecated = this.filter.deprecated;
		var unwrapp = this.filter.unwrapp;
		// var currentApi = this.filter[]
	
		deprecated.map(function (item) {
			if (obj[item]) {
				delete obj[item]
			}
			return item;
		});
	
		unwrapp.map(function (item) {
			var val = obj[item];
			if (val) {
				var arr = Object.keys(val);
				for (var i = 0; i < arr.length; i++) {
					var prop = arr[i];
					obj[prop] = val[prop];
				}
				delete obj[item];
			}
			return item;
		});
	
		
		return obj;
	};
	
	cardGroupComponent.prototype.setActive = function (vm, e) {
		if (!this.isActive) {
			 return this.isActive = ko.observable(true);
		}
		this.isActive(!this.isActive());
	};
	
	cardGroupComponent.prototype.sortByConfig = function sortFunc(a, b) {
		var config = self.filter[self.reqId];
		var o1 = config.find(function (obj) {
			return obj.title === a.key;
		});
		var o2 = config.find(function (obj) {
			return obj.title === b.key;
		});
		return config.indexOf(o1) - config.indexOf(o2);
	};
	
	module.exports = ko.components.register('panel-group', {
		viewModel: cardGroupComponent,
		template:`
			<section data-bind="foreachprop: {data: cards, sortFn: sortByConfig}" class="panel-group">
				<section data-bind="css: {[$component.colorClass]: true}" class="panel panel-primary">
					<!--panel-heading-->
					<panel-heading params="data: $data, index: $index, cardSize: $component.cardSize, pageParam: $component.pageParam, collapseId: $component.collapseId"></panel-heading>			
					<!--panel-body-->
					<section data-bind="attr:{'id': $component.collapseId + $index()}" class="panel-collapse collapse">
						<div class="panel-body">
						
							<!-- ko if: (typeof value === 'object' && !$.isArray(value)) -->
								<object-panel-body params="data: $data, cardGroup: $component, pageParam: $component.pageParam"></object-panel-body>
							<!-- /ko -->
							
							<!-- ko if: (typeof value === 'object' && $.isArray(value)) -->
								<array-panel-body params="data: $data, cardGroup: $component"></array-panel-body>
							<!-- /ko -->
						</div>
					</section>
				</section>
		
			</section>
	`});


/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = {
		"discovery.v2.events.get": [
			{
				"title": "events",
				"items": [
					{
						"title": "event"
					},
					{
						"title": "images"
					},
					{
						"title": "sales"
					},
					{
						"title": "venues"
					},
					{
						"title": "dates",
						"items": [
							{
								"title": "start"
							},
							{
								"title": "status"
							},
							{
								"title": "end"
							}
						]
					}
				]
			},
			{
				"title": "page"
			}
		],
		"deprecated": [
			"_links"
		],
		"unwrapp": [
			"_embedded"
		]
	};

/***/ },
/* 19 */
/***/ function(module, exports) {

	var self;
	
	/**
	 * Pagination element
	 * @param params
	 */
	function pagination(params) {
		this.pageParam = params.pageParam;
		this.totalPages = +params.totalPages;
		this.number = +params.number;
		this.first = !!this.number;
		this.last = this.number < this.totalPages - 1;
		this.requestBtn = $('#api-exp-get-btn');
		self = this;
	}
	
	/**
	 * get next page
	 */
	pagination.prototype.getPrevPage = function () {
		var val = this.pageParam();
		self.pageParam(val > 0 ? val - 1 : 0);
		self.requestBtn.trigger('click');
	};
	
	/**
	 * get prev page
	 */
	pagination.prototype.getNextPage = function () {
		var val = this.number;
		self.pageParam(val < self.totalPages - 1 ? val  + 1: val);
		self.requestBtn.trigger('click');
	};
	
	module.exports = ko.components.register('pagination', {
		viewModel: pagination,
		template:
		`<span class="navigation-wrapper">
			<button data-bind="click: getPrevPage, enable: first" type="button" class="navigation prev"></button>
			<button  data-bind="click: getNextPage, enable: last" type="button" class="navigation next"></button>
		</span>`
	});


/***/ },
/* 20 */
/***/ function(module, exports) {

	var self;
	
	function objectPanelBodyComponent(params) {
		self = this;
		this.title = params.data.key;
		this.data = params.data.value;
		this.index = ko.utils.unwrapObservable(params.index);
		this.cardSize = params.cardSize;
		this.pageParam = params.pageParam;
		this.collapseId = params.collapseId;
	}
	module.exports = ko.components.register('panel-heading', {
		viewModel:  objectPanelBodyComponent,
		template:`
			<section class="panel-heading">
				<div class="panel-title">
					
					<a data-bind="attr: {'href': '#' + collapseId + index, 'aria-controls': collapseId + index}" class="btn btn-icon" type="button" data-toggle="collapse" aria-expanded="false">
						<span class="btn btn-icon shevron white-shevron-up"></span>
						<p data-bind="text: title" class="title">Title</p>
					</a>
					
					<!-- ko if: title === 'events'-->
						<span data-bind="text: cardSize" class="counter"></span>
					<!-- /ko-->
					
					<!-- ko if: title === 'page'-->
						<pagination params="number: data.number, totalPages: data.totalPages, pageParam: pageParam"></pagination>
					<!-- /ko-->
				</div>
			</section>
	`});


/***/ },
/* 21 */
/***/ function(module, exports) {

	var self;
	
	function objectPanelBodyComponent(params) {
		self = this;
		this.title = params.data.key;
		this.data = params.data.value;
		this.cardGroup = params.cardGroup;
		this.getMore = this.cardGroup.getMore;
		this.pageParam = params.pageParam;
	}
	
	objectPanelBodyComponent.prototype.onEnterKeyDown = function (model, event) {
		var pageNumber = Math.abs(~~model.value);
		self.pageParam(pageNumber < +self.data.totalPages ? pageNumber : +self.data.totalPages - 2);
		if (event.keyCode === 13) {
			$('#api-exp-get-btn').trigger('click');
		} else {
			return true;
		}
	};
	
	module.exports = ko.components.register('object-panel-body', {
		viewModel:  objectPanelBodyComponent,
		template:`
			<ul data-bind="foreachprop: data">
				<li class="clearfix">
					<!-- ko if: $component.title === 'images' -->
						<img data-bind="attr: {src: url, alt: 'image-' + ratio}" alt="img" class="img img-thumbnail">
					<!-- /ko -->
					
					<b class="key">
						<span data-bind="text: typeof value === 'object' ? key: key + ':'"></span>
					</b>
					
					<!-- ko ifnot: typeof value === 'object' || $component.title === 'page' && key === 'number' -->
						<span data-bind="text: value" class="value"></span>
					<!-- /ko -->
					
					<!-- ko if: $component.title === 'page' && key === 'number'-->
						<div class="form-inline">
							<input id="pagination-input" data-bind="textInput: value, event: {keydown: $component.onEnterKeyDown}" type="text" pattern="[0-9]+" class="form-control">
						</div>
					<!-- /ko -->
					
					<!-- ko if: typeof value === 'object' -->
						<button data-bind="click: $component.getMore.bind($component.cardGroup, value)" type="button" class="btn btn-icon blue-shevron-right pull-right"></button>
					<!-- /ko -->
					
				</li>
			</ul>
	`});


/***/ },
/* 22 */
/***/ function(module, exports) {

	var self;
	
	function objectPanelBodyComponent(params) {
		self = this;
		this.title = params.data.key;
		this.data = params.data.value;
		this.cardGroup = params.cardGroup;
		this.getMore = this.cardGroup.getMore;
	}
	
	
	module.exports = ko.components.register('array-panel-body', {
		viewModel:  objectPanelBodyComponent,
		template:`
			<ul data-bind="foreach: data" class="list-group">
				<li class="list-group-item">
				
					<!-- ko if: $parent.title === 'images' -->
						<img data-bind="attr: {src: url, alt: 'image-' + ratio}" alt="img" class="img">
					<!-- /ko -->
					
					<!-- ko ifnot: $parent.title === 'images' -->
					<span data-bind="text: name || '#' + $index()" class="name truncate">event name</span>
					<!-- /ko -->
					
					<!-- ko if: typeof $data === 'object' -->
						<button data-bind="click: $component.getMore.bind($component.cardGroup)" type="button" class="btn btn-icon blue-shevron-right pull-right"></button>
					<!-- /ko -->
					
				</li>
			</ul>
	`});


/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgN2M5MjIxYmMwNWIyYzEwMzAyMTUiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9hcGktZXhwbG9yZXIvdjIvVmlld01vZGVscy9tYWluLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL2N1c3RvbUJpbmRpbmdzL2ZvcmVhY2hQcm9wLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL21vZHVsZXMvYmFzZS5qcyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzL2FwaS1leHBsb3Jlci92Mi9tb2R1bGVzL2FwaWtleS5qcyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzL2FwaS1leHBsb3Jlci92Mi9tb2R1bGVzL2FqYXhTZXJ2aWNlLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL1ZpZXdNb2RlbHMvbWVudVZpZXdNb2RlbC5qcyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzL2FwaS1leHBsb3Jlci92Mi9tb2R1bGVzL2hlbHBlckZ1bmMuanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9hcGktZXhwbG9yZXIvdjIvVmlld01vZGVscy9wYXJhbXNWaWV3TW9kZWwuanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9hcGktZXhwbG9yZXIvdjIvVmlld01vZGVscy9tZXRob2RzVmlld01vZGVsLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL1ZpZXdNb2RlbHMvcmVxdWVzdHNMaXN0Vmlld01vZGVsLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL21vZHVsZXMvanNvbi1oaWdobGlnaHQuanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9hcGktZXhwbG9yZXIvdjIvbW9kdWxlcy9oaWdobGlnaHRKc29uLndvcmtlci5qcyIsIndlYnBhY2s6Ly8vRDovdGlja2V0bWFzdGVyLWFwaS1zdGFnaW5nLmdpdGh1Yi5pby9+L3dvcmtlci1sb2FkZXIvY3JlYXRlSW5saW5lV29ya2VyLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL21vZHVsZXMvc2xpZGVyLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL2NvbXBvbmVudHMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9hcGktZXhwbG9yZXIvdjIvY29tcG9uZW50cy9jdXN0b21TZWxlY3QuY29tcG9uZW50LmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL2NvbXBvbmVudHMvcGFuZWxzL3BhbmVsR3JvdXAuY29tcG9uZW50LmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL2NvbmZpZy5qc29uIiwid2VicGFjazovLy8uL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL2NvbXBvbmVudHMvcGFuZWxzL3BhZ2luYXRpb24uY29tcG9uZW50LmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL2NvbXBvbmVudHMvcGFuZWxzL3BhbmVsSGVhZGluZy5jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9hcGktZXhwbG9yZXIvdjIvY29tcG9uZW50cy9wYW5lbHMvb2JqZWN0UGFuZWxCb2R5LmNvbXBvbmVudC5qcyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzL2FwaS1leHBsb3Jlci92Mi9jb21wb25lbnRzL3BhbmVscy9hcnJheVBhbmVsQm9keS5jb21wb25lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7OztB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ZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCA3YzkyMjFiYzA1YjJjMTAzMDIxNVxuICoqLyIsIi8qKlxyXG4gKiBNYWluIGZpbGUgZm9yIEFwaSBFeHBscmVyIHYyLjBcclxuICogRm9yIGRldmVsb3BtZW50IHBsZWFzZSB1c2UgV2VicGFjayB0byBidW5kbGUgYWxsIG1vZHVsZXNcclxuICogSXQgY2FuIGJlIG1hZGUgdXNpbmcgbnBtIHNjcmlwdHMgY21kIC0gJ3dlYnBhY2snXHJcbiAqL1xyXG4vLyBjdXN0b20gYmluZGluZ3NcclxucmVxdWlyZSgnLi4vY3VzdG9tQmluZGluZ3MvZm9yZWFjaFByb3AnKTtcclxuXHJcbi8vIE1vZHVsZXNcclxudmFyIGJhc2UgPSByZXF1aXJlKCcuLi9tb2R1bGVzL2Jhc2UnKTtcclxudmFyIGFwaUtleSA9IHJlcXVpcmUoJy4uL21vZHVsZXMvYXBpa2V5Jyk7XHJcbnZhciBhamF4U2VydmljZSA9IHJlcXVpcmUoJy4uL21vZHVsZXMvYWpheFNlcnZpY2UnKTtcclxuXHJcbi8vIFZpZXcgTW9kZWxzXHJcbnZhciBNZW51Vmlld01vZGVsID0gcmVxdWlyZSgnLi4vVmlld01vZGVscy9tZW51Vmlld01vZGVsJyk7XHJcbnZhciBQYXJhbXNWaWV3TW9kZWwgPSByZXF1aXJlKCcuL3BhcmFtc1ZpZXdNb2RlbCcpO1xyXG52YXIgTWV0aG9kc1ZpZXdNb2RlbCA9IHJlcXVpcmUoJy4vbWV0aG9kc1ZpZXdNb2RlbCcpO1xyXG52YXIgUmVxdWVzdHNMaXN0Vmlld01vZGVsID0gcmVxdWlyZSgnLi9yZXF1ZXN0c0xpc3RWaWV3TW9kZWwnKTtcclxuXHJcbi8vIENvbXBvbmVudHNcclxucmVxdWlyZSgnLi4vY29tcG9uZW50cy9pbmRleCcpO1xyXG5cclxuLyoqXHJcbiAqIE1haW4gYXBwbGljYXRpb24gdmlldy1tb2RlbFxyXG4gKiBAcGFyYW0gb2JqIHtvYmplY3R9IGdsb2JhbCBkYXRhIG9iamVjdFxyXG4gKi9cclxuZnVuY3Rpb24gQXBwVmlld01vZGVsKG9iaikge1xyXG4gIHZhciBiYXNlID0gb2JqIHx8IHt9O1xyXG4gIHNlbGYgPSB0aGlzO1xyXG4gIHRoaXMuYXBpS2V5ID0gYXBpS2V5O1xyXG5cclxuICAvLyBvYnNlcnZhYmxlc1xyXG4gIHRoaXMuc2VsZWN0ZWRDYXRlZ29yeSA9IGtvLm9ic2VydmFibGUoJycpO1xyXG4gIHRoaXMuc2VsZWN0ZWRNZXRob2QgPSBrby5vYnNlcnZhYmxlKCcnKTtcclxuICB0aGlzLnNlbGVjdGVkUGFyYW1zID0ga28ub2JzZXJ2YWJsZUFycmF5KFtdKTtcclxuXHR0aGlzLnJlcXVlc3RzID0ga28ub2JzZXJ2YWJsZUFycmF5KFtdKTtcclxuXHJcblx0Ly8gY29tcHV0ZWRcclxuICB0aGlzLlVSTCA9IGtvLmNvbXB1dGVkKHRoaXMuZ2V0VXJsLCB0aGlzKTtcclxuICB0aGlzLnNlbmRCdXR0b25UZXh0ID0ga28ucHVyZUNvbXB1dGVkKHRoaXMuZ2V0TWV0aG9kTmFtZSwgdGhpcyk7XHJcblxyXG4gIC8vIHN1Yi1tb2RlbHNcclxuICB0aGlzLm1lbnUgPSBuZXcgTWVudVZpZXdNb2RlbChiYXNlLCB0aGlzLnNlbGVjdGVkQ2F0ZWdvcnkpO1xyXG4gIHRoaXMubWV0aG9kcyA9IG5ldyBNZXRob2RzVmlld01vZGVsKGJhc2UsIHRoaXMuc2VsZWN0ZWRDYXRlZ29yeSwgdGhpcy5zZWxlY3RlZE1ldGhvZCk7XHJcbiAgdGhpcy5wYXJhbXMgPSBuZXcgUGFyYW1zVmlld01vZGVsKGJhc2UsIHRoaXMuc2VsZWN0ZWRNZXRob2QsIHRoaXMuc2VsZWN0ZWRQYXJhbXMpO1xyXG4gIHRoaXMucmVxdWVzdHNMaXN0ID0gbmV3IFJlcXVlc3RzTGlzdFZpZXdNb2RlbCh0aGlzLnJlcXVlc3RzLCB0aGlzLnNlbGVjdGVkUGFyYW1zKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNlbmQgcmVxdWVzdCBtZXRob2RcclxuICovXHJcbkFwcFZpZXdNb2RlbC5wcm90b3R5cGUub25DbGlja1NlbmRCdG4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgYWpheFNlcnZpY2UodGhpcy5VUkwoKSwgdGhpcy5yZXF1ZXN0cywgYmFzZSk7XHJcbn07XHJcblxyXG4vKipcclxuICogR2V0cyBjdXJyZW50IG1ldGhvZCBuYW1lXHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAqL1xyXG5BcHBWaWV3TW9kZWwucHJvdG90eXBlLmdldE1ldGhvZE5hbWUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRNZXRob2QoKS5tZXRob2QudG9Mb3dlckNhc2UoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBHZXRzIHJhdyB1cmwgZGF0YSBhcnJheVxyXG4gKiBAcmV0dXJucyB7KltdfVxyXG4gKi9cclxuQXBwVmlld01vZGVsLnByb3RvdHlwZS5nZXRVcmwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIFtcclxuICAgIHRoaXMuc2VsZWN0ZWRNZXRob2QoKSxcclxuICAgIHRoaXMuYXBpS2V5LFxyXG4gICAgdGhpcy5zZWxlY3RlZFBhcmFtcygpXHJcbiAgXTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBHZXRzIGRlZXAgcHJvcFxyXG4gKiBAcmV0dXJucyB7KltdfVxyXG4gKi9cclxuT2JqZWN0LmdldFByb3AgPSBmdW5jdGlvbihvLCBzKSB7XHJcblx0aWYgKHR5cGVvZiBvICE9PSAnb2JqZWN0JyB8fCAhcykge1xyXG5cdFx0Y29uc29sZS5sb2cobyxzKTtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblx0cyA9IHMucmVwbGFjZSgvXFxbKFxcdyspXFxdL2csICcuJDEnKTsgLy8gY29udmVydCBpbmRleGVzIHRvIHByb3BlcnRpZXNcclxuXHRzID0gcy5yZXBsYWNlKC9eXFwuLywgJycpOyAgICAgICAgICAgLy8gc3RyaXAgYSBsZWFkaW5nIGRvdFxyXG5cdHZhciBhID0gcy5zcGxpdCgnLicpO1xyXG5cdGZvciAodmFyIGkgPSAwLCBuID0gYS5sZW5ndGg7IGkgPCBuOyArK2kpIHtcclxuXHRcdHZhciBrID0gYVtpXTtcclxuXHRcdGlmIChrIGluIG8pIHtcclxuXHRcdFx0byA9IG9ba107XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybiBvO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEFjdGl2YXRlcyBrbm9ja291dC5qc1xyXG4gKi9cclxua28uYXBwbHlCaW5kaW5ncyhuZXcgQXBwVmlld01vZGVsKGJhc2UpKTtcclxuXHJcbi8qKlxyXG4gKiBleHBvcnRzIGdsb2JhbCB2YXJpYWJsZVxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSBiYXNlO1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc2NyaXB0cy9hcGktZXhwbG9yZXIvdjIvVmlld01vZGVscy9tYWluLmpzXG4gKiogbW9kdWxlIGlkID0gMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiIG1vZHVsZS5leHBvcnRzID0ga28uYmluZGluZ0hhbmRsZXJzLmZvcmVhY2hwcm9wID0ge1xyXG5cclxuXHR0cmFuc2Zvcm1PYmplY3Q6IGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuXHRcdHZhciBwcm9wZXJ0aWVzID0gW107XHJcblx0XHR2YXIgb2JqLCBzb3J0Rm4gPSBwYXJhbXMuc29ydEZuO1xyXG5cclxuXHRcdGlmIChzb3J0Rm4pIHtcclxuXHRcdFx0b2JqID0gcGFyYW1zLmRhdGE7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRvYmogPSBwYXJhbXM7XHJcblx0XHR9XHJcblxyXG5cdFx0a28udXRpbHMub2JqZWN0Rm9yRWFjaChvYmosIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XHJcblx0XHRcdHByb3BlcnRpZXMucHVzaCh7XHJcblx0XHRcdFx0a2V5OiBrZXksXHJcblx0XHRcdFx0dmFsdWU6IHZhbHVlXHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0aWYgKHNvcnRGbikge1xyXG5cdFx0XHRwcm9wZXJ0aWVzLnNvcnQoc29ydEZuKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gcHJvcGVydGllcztcclxuXHR9LFxyXG5cdGluaXQ6IGZ1bmN0aW9uKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IsIGFsbEJpbmRpbmdzQWNjZXNzb3IsIHZpZXdNb2RlbCwgYmluZGluZ0NvbnRleHQpIHtcclxuXHRcdHZhciBwcm9wZXJ0aWVzID0ga28ucHVyZUNvbXB1dGVkKGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0dmFyIG9iaiA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUodmFsdWVBY2Nlc3NvcigpKTtcclxuXHRcdFx0cmV0dXJuIGtvLmJpbmRpbmdIYW5kbGVycy5mb3JlYWNocHJvcC50cmFuc2Zvcm1PYmplY3Qob2JqKTtcclxuXHRcdH0pO1xyXG5cdFx0a28uYXBwbHlCaW5kaW5nc1RvTm9kZShlbGVtZW50LCB7XHJcblx0XHRcdGZvcmVhY2g6IHByb3BlcnRpZXNcclxuXHRcdH0sIGJpbmRpbmdDb250ZXh0KTtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGNvbnRyb2xzRGVzY2VuZGFudEJpbmRpbmdzOiB0cnVlXHJcblx0XHR9O1xyXG5cdH1cclxufTtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL2N1c3RvbUJpbmRpbmdzL2ZvcmVhY2hQcm9wLmpzXG4gKiogbW9kdWxlIGlkID0gMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIGJhc2UgPSB7fTtcclxudmFyIENPTkZJR19VUkwgPSAnLi4vLi4vYXBpZGVzY3JpcHRpb24ueG1sJztcclxuXHJcbnZhciBwYXJzZURhdGEgPSBmdW5jdGlvbiAoeG1sKSB7XHJcblx0dmFyIGdsb2JhbCA9IHt9O1xyXG5cdC8vZ2V0IGFsbCBBUElzXHJcblx0dmFyIHJlc291cmNlc0VsID0gJCh4bWwpLmZpbmQoXCJyZXNvdXJjZXNcIikuZXEoMCk7XHJcblxyXG5cdC8vIHJlc291cmNlXHJcblx0JCh4bWwpXHJcblx0XHQuZmluZChcInJlc291cmNlXCIpXHJcblx0XHQuZ2V0KClcclxuXHRcdC5tYXAoZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHR2YXIgcmVzb3VyY2UgPSAkKHJlcyk7XHJcblx0XHRcdC8vIG1ldGhvZCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHR2YXIgbWV0aG9kRWxlbSA9IHJlc291cmNlLmZpbmQoXCJtZXRob2RcIikuZXEoMCk7XHJcblxyXG5cdFx0XHR2YXIgbWV0aG9kID0ge1xyXG5cdFx0XHRcdGlkIDogbWV0aG9kRWxlbS5hdHRyKFwiaWRcIiksIC8vIG1ldGhvZCBpZFxyXG5cdFx0XHRcdG5hbWUgOiBtZXRob2RFbGVtLmF0dHIoXCJhcGlnZWU6ZGlzcGxheU5hbWVcIikgfHwgbWV0aG9kRWxlbS5hdHRyKFwiaWRcIiksIC8vIG1ldGhvZCBuYW1lXHJcblx0XHRcdFx0bWV0aG9kIDogbWV0aG9kRWxlbS5hdHRyKCduYW1lJyksIC8vIEdFVCBvciBQT1NUXHJcblx0XHRcdFx0Y2F0ZWdvcnkgOiBtZXRob2RFbGVtLmZpbmQoJ1twcmltYXJ5PVwidHJ1ZVwiXScpLnRleHQoKS50cmltKCksIC8vIEFQSSBuYW1lXHJcblx0XHRcdFx0cGF0aDogcmVzb3VyY2UuYXR0cigncGF0aCcpLCAvLyBtZXRob2QgVVJMXHJcblx0XHRcdFx0YmFzZSA6IHJlc291cmNlc0VsLmF0dHIoJ2Jhc2UnKSwgLy8gbWV0aG9kIGJhc2UgbGlua1xyXG5cdFx0XHRcdGxpbmsgOiBtZXRob2RFbGVtLmZpbmQoJ2RvYycpLmVxKDApLmF0dHIoJ2FwaWdlZTp1cmwnKSwgLy8gbGluayB0byBkb2N1bWVudGF0aW9uXHJcblx0XHRcdFx0ZGVzY3JpcHRpb24gOiBtZXRob2RFbGVtLmZpbmQoJ2RvYycpLmVxKDApLnRleHQoKS50cmltKCksIC8vbWV0aG9kIGRlc2NyaXB0aW9uXHJcblx0XHRcdFx0cGFyYW1ldGVyczoge31cclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdC8vIHBhcmFtcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHRyZXNvdXJjZVxyXG5cdFx0XHRcdC5maW5kKCdwYXJhbScpXHJcblx0XHRcdFx0LmdldCgpXHJcblx0XHRcdFx0Lm1hcChmdW5jdGlvbiAocGFyKSB7XHJcblx0XHRcdFx0XHR2YXIgcGFyYW0gPSAkKHBhcik7XHJcblx0XHRcdFx0XHR2YXIgb3B0aW9ucyA9IHBhcmFtLmZpbmQoJ29wdGlvbicpO1xyXG5cdFx0XHRcdFx0dmFyIGlzU2VsZWN0ID0gISFvcHRpb25zLmxlbmd0aDtcclxuXHJcblx0XHRcdFx0XHR2YXIgcGFyYW1ldGVyID0ge1xyXG5cdFx0XHRcdFx0XHRuYW1lOiBwYXJhbS5hdHRyKCduYW1lJyksXHJcblx0XHRcdFx0XHRcdGRvYzogcGFyYW0uZmlyc3QoJ2RvYycpLnRleHQoKS50cmltKCksXHJcblx0XHRcdFx0XHRcdHN0eWxlOiBwYXJhbS5hdHRyKCdzdHlsZScpLFxyXG5cdFx0XHRcdFx0XHRyZXF1aXJlZDogcGFyYW0uYXR0cigncmVxdWlyZWQnKSxcclxuXHRcdFx0XHRcdFx0ZGVmYXVsdDogcGFyYW0uYXR0cignZGVmYXVsdCcpID09PSAnbm9uZScgJiYgaXNTZWxlY3QgPyAnJyA6IHBhcmFtLmF0dHIoJ2RlZmF1bHQnKSxcclxuXHRcdFx0XHRcdFx0c2VsZWN0OiBpc1NlbGVjdFxyXG5cdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRpZiAoaXNTZWxlY3QpIHtcclxuXHRcdFx0XHRcdFx0cGFyYW1ldGVyLm9wdGlvbnMgPSBvcHRpb25zLmdldCgpLm1hcChmdW5jdGlvbiAob3B0aW9uKSB7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRcdFx0XHRcdG5hbWU6ICQob3B0aW9uKS5hdHRyKCd2YWx1ZScpLFxyXG5cdFx0XHRcdFx0XHRcdFx0Y2hlY2tlZDogJChvcHRpb24pLmF0dHIoJ3ZhbHVlJykgPT09IHBhcmFtZXRlci5kZWZhdWx0IHx8ICQob3B0aW9uKS5hdHRyKCd2YWx1ZScpID09PSAnbm9uZScsXHJcblx0XHRcdFx0XHRcdFx0XHRsaW5rOiBmYWxzZVxyXG5cdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdG1ldGhvZC5wYXJhbWV0ZXJzW3BhcmFtZXRlci5uYW1lXSA9IHBhcmFtZXRlcjtcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdC8qKlxyXG5cdFx0XHQgKiBHbG9iYWwgb2JqIGNvbXBvc2l0aW9uXHJcbiAgICAgICAqL1xyXG5cdFx0XHQvLyBzZXQgY2F0ZWdvcnkgb2JqXHJcblx0XHRcdGdsb2JhbFttZXRob2QuY2F0ZWdvcnldID0gZ2xvYmFsW21ldGhvZC5jYXRlZ29yeV0gfHwge307XHJcblxyXG5cdFx0XHQvLyBzZXQgbWV0aG9kcyB0eXBlIG9ialxyXG5cdFx0XHRnbG9iYWxbbWV0aG9kLmNhdGVnb3J5XS5BTEwgPSBnbG9iYWxbbWV0aG9kLmNhdGVnb3J5XS5BTEwgfHwge307XHJcblx0XHRcdGdsb2JhbFttZXRob2QuY2F0ZWdvcnldW21ldGhvZC5tZXRob2RdID0gZ2xvYmFsW21ldGhvZC5jYXRlZ29yeV1bbWV0aG9kLm1ldGhvZF0gfHwge307XHJcblxyXG5cdFx0XHQvLyBzZXQgbWV0aG9kIG9ialxyXG5cdFx0XHRnbG9iYWxbbWV0aG9kLmNhdGVnb3J5XS5BTExbbWV0aG9kLmlkXSA9IG1ldGhvZDtcclxuXHRcdFx0Z2xvYmFsW21ldGhvZC5jYXRlZ29yeV1bbWV0aG9kLm1ldGhvZF1bbWV0aG9kLmlkXSA9IG1ldGhvZDtcclxuXHRcdH0pO1xyXG5cclxuXHRyZXR1cm4gZ2xvYmFsO1xyXG59O1xyXG5cclxuLy9nZXRzIGRvY3VtZW50IGZyb20gV0FETCBjb25maWd1cmF0aW9uIGZpbGVcclxudmFyIHJlYWRGcm9tV0FETCA9IGZ1bmN0aW9uICgpIHtcclxuICAkLmFqYXgoe1xyXG4gICAgdXJsOiBDT05GSUdfVVJMLFxyXG4gICAgYXN5bmMgOiBmYWxzZSxcclxuICAgIGRhdGFUeXBlOiAoJC5icm93c2VyLm1zaWUpID8gXCJ0ZXh0XCIgOiBcInhtbFwiLFxyXG4gICAgc3VjY2VzcyA6IGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuICAgICAgdmFyIHhtbDtcclxuXHJcbiAgICAgIGlmICh0eXBlb2YgcmVzcG9uc2UgPT0gXCJzdHJpbmdcIil7XHJcbiAgICAgICAgeG1sID0gbmV3IEFjdGl2ZVhPYmplY3QoXCJNaWNyb3NvZnQuWE1MRE9NXCIpO1xyXG4gICAgICAgIHhtbC5hc3luYyA9IGZhbHNlO1xyXG4gICAgICAgIHhtbC5sb2FkWE1MKHJlc3BvbnNlKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB4bWwgPSByZXNwb25zZTtcclxuICAgICAgfVxyXG5cclxuXHRcdFx0YmFzZSA9IHBhcnNlRGF0YSh4bWwpO1xyXG4gICAgfSxcclxuXHJcbiAgICBlcnJvcjogZnVuY3Rpb24oWE1MSHR0cFJlcXVlc3QsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKXtcclxuICAgICAgYWxlcnQoJ0RhdGEgQ291bGQgTm90IEJlIExvYWRlZCAtICcrIHRleHRTdGF0dXMpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59O1xyXG5yZWFkRnJvbVdBREwoKTtcclxubW9kdWxlLmV4cG9ydHMgPSBiYXNlO1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc2NyaXB0cy9hcGktZXhwbG9yZXIvdjIvbW9kdWxlcy9iYXNlLmpzXG4gKiogbW9kdWxlIGlkID0gM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIGFwaUtleSA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ3RrLWFwaS1rZXknKSB8fCBhcGlLZXlTZXJ2aWNlLmdldEFwaUV4cGxvcmVLZXkoKTsgLy9BUEkgS2V5XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBuYW1lOiAnYXBpa2V5JyxcbiAgc3R5bGU6ICdxdWVyeScsXG4gIHZhbHVlOiBrby5vYnNlcnZhYmxlKGFwaUtleSlcbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc2NyaXB0cy9hcGktZXhwbG9yZXIvdjIvbW9kdWxlcy9hcGlrZXkuanNcbiAqKiBtb2R1bGUgaWQgPSA0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKipcclxuICogQWpheCBTZXJ2aWNlXHJcbiAqIEBwYXJhbSB1cmxcclxuICogQHBhcmFtIG1ldGhvZFxyXG4gKiBAcGFyYW0gY2FsbGJhY2tcclxuICovXHJcbnZhciBhamF4U2VydmljZSA9IGZ1bmN0aW9uICh1cmwsIG1ldGhvZCwgY2FsbGJhY2spIHtcclxuICAkLmFqYXgoe1xyXG4gICAgdHlwZTogbWV0aG9kLFxyXG4gICAgdXJsOiB1cmwsXHJcbiAgICBhc3luYzogdHJ1ZSxcclxuICAgIGRhdGFUeXBlOiBcImpzb25cIixcclxuICAgIGNvbXBsZXRlOiBjYWxsYmFja1xyXG4gIH0pO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEZpbHRlcnMgYW5kIHByZXBhcmVzIHBhcmFtcyBwYWlyc1xyXG4gKiBAcGFyYW0gYXJyXHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cclxudmFyIHByZXBhcmVVcmwgPSBmdW5jdGlvbiAoYXJyKSB7XHJcbiAgdmFyIHJlcGxhY2VtZW50LCB1cmwsIGRvbWFpbiwgcGF0aCwgbWV0aG9kLCBhcGlLZXksIHBhcmFtcztcclxuXHJcbiAgaWYgKCFhcnIgJiYgIWFyci5sZW5ndGgpIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbiAgXHJcbiAgZG9tYWluID0gYXJyWzBdLmJhc2U7XHJcbiAgcGF0aCA9IGFyclswXS5wYXRoO1xyXG4gIGFwaUtleSA9IGFyclsxXTtcclxuICBwYXJhbXMgPSBhcnJbMl0uZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICByZXR1cm4gaXRlbS5zdHlsZSA9PT0gJ3F1ZXJ5JztcclxuICB9KTtcclxuXHJcbiAgLy8gYXJyIG9mIHRlbXBsYXRlIG1hcmtzXHJcbiAgcmVwbGFjZW1lbnQgPSBwYXRoLm1hdGNoKC8oW157XSo/KVxcdyg/PVxcfSkvZ21pKTtcclxuXHJcbiAgLy8gYXJyIG9mIHRlbXBsYXRlIHBhcmFtc1xyXG4gIHZhciB0ZW1wbGF0ZXNBcnIgPSBhcnJbMl0uZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICByZXR1cm4gaXRlbS5zdHlsZSA9PT0gJ3RlbXBsYXRlJztcclxuICB9KTtcclxuXHJcbiAgLy8gcmVwbGFjZW1lbnRcclxuICByZXBsYWNlbWVudC5mb3JFYWNoKGZ1bmN0aW9uICh2YWwpIHtcclxuICAgIHZhciBwYXJhbSA9IHRlbXBsYXRlc0Fyci5maW5kKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgIHJldHVybiBpdGVtLm5hbWUgPT09IHZhbDtcclxuICAgIH0pO1xyXG4gICAgcGF0aCA9IHBhdGgucmVwbGFjZSgneycrIHBhcmFtLm5hbWUgKyAnfScsIHBhcmFtLnZhbHVlKCkgfHwgcGFyYW0uZGVmYXVsdCk7XHJcbiAgfSk7XHJcblxyXG4gIC8vIGFkZHMgYXBpS2V5IHBhcmFtXHJcbiAgaWYgKCFwYXJhbXNbMF0gfHwgcGFyYW1zWzBdLm5hbWUgIT09ICdhcGlrZXknKSB7XHJcbiAgICBwYXJhbXMudW5zaGlmdChhcGlLZXkpO1xyXG4gIH1cclxuXHJcbiAgLy8gcHJlcGFyZXMgcGFyYW1zIHBhcnQgb2YgdXJsXHJcbiAgcGFyYW1zID0gcGFyYW1zLm1hcChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICByZXR1cm4gW2l0ZW0ubmFtZSwgaXRlbS52YWx1ZSgpIHx8IGl0ZW0uZGVmYXVsdF0uam9pbignPScpO1xyXG4gICAgfSkuam9pbignJicpO1xyXG5cclxuICB1cmwgPSBbZG9tYWluLCAnLycsIHBhdGgsICc/JywgcGFyYW1zXS5qb2luKCcnKTtcclxuXHJcbiAgcmV0dXJuIGVuY29kZVVSSSh1cmwpO1xyXG59O1xyXG5cclxuLy8gc2VuZHMgcmVxdWVzdCB0byBnZXQgdGhlIHNlY29uZCBjb2x1bW5cclxudmFyIHNlbmRQcmltYXJ5UmVxdWVzdCA9IGZ1bmN0aW9uIChhcnIsIHJlcXVlc3RzLCBnbG9iYWwpIHtcclxuICB2YXIgdXJsID0gcHJlcGFyZVVybChhcnIpO1xyXG5cclxuICBhamF4U2VydmljZSh1cmwsIGFyclswXS5tZXRob2QsIGZ1bmN0aW9uKHJlcywgbXNnKSB7XHJcblx0XHR2YXIgcmVzT2JqID0ge1xyXG5cdFx0XHRyZXE6IHVybCxcclxuXHRcdFx0aW5kZXg6IHJlcXVlc3RzKCkubGVuZ3RoXHJcblx0XHR9O1xyXG5cclxuXHRcdGlmIChtc2cgPT0gJ2Vycm9yJykge1xyXG5cdFx0XHR2YXIgZXJyID0gcmVzICYmXHJcblx0XHRcdFx0cmVzLnJlc3BvbnNlSlNPTiAmJlxyXG5cdFx0XHRcdHJlcy5yZXNwb25zZUpTT04uZXJyb3JzICYmXHJcblx0XHRcdFx0cmVzLnJlc3BvbnNlSlNPTi5lcnJvcnNbMF07XHJcblxyXG5cdFx0XHRyZXNPYmouZXJyb3IgPSB7XHJcblx0XHRcdFx0Y29kZTogZXJyID8gZXJyLmNvZGU6IDUwMCxcclxuXHRcdFx0XHRtZXNzYWdlOiBlcnIgPyBlcnIuZGV0YWlsOiAnTm8gcmVzcG9uY2UgZGF0YSEnXHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGdsb2JhbC5sYXN0UmVzcG9uc2UgPSByZXNPYmoucmVzID0ge1xyXG5cdFx0XHRcdGlkOiBhcnJbMF0uaWQsIC8vIG1ldGhvZCBpZCB3YXMgdXNlZFxyXG5cdFx0XHRcdHJlczogcmVzLnJlc3BvbnNlSlNPTiAvLyByZXNwb25zZVxyXG5cdFx0XHR9O1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGV4cG9ydGluZyBkYXRhIHVzaW5nIG9ic2VydmFibGVcclxuXHRcdHJlcXVlc3RzLnVuc2hpZnQocmVzT2JqKTtcclxuICB9KTtcclxufTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNlbmRQcmltYXJ5UmVxdWVzdDtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL21vZHVsZXMvYWpheFNlcnZpY2UuanNcbiAqKiBtb2R1bGUgaWQgPSA1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgaGYgPSByZXF1aXJlKCcuLi9tb2R1bGVzL2hlbHBlckZ1bmMnKTtcclxudmFyIHNlbGY7XHJcblxyXG5cclxuLyoqXHJcbiAqIE1lbnUgVmlldy1Nb2RlbFxyXG4gKiBAcGFyYW0gYmFzZVxyXG4gKiBAcGFyYW0gY2F0ZWdvcnlcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqL1xyXG5mdW5jdGlvbiBNZW51Vmlld01vZGVsKGJhc2UsIGNhdGVnb3J5KSB7XHJcbiAgc2VsZiA9IHRoaXM7XHJcbiAgdGhpcy5jYXRlZ29yeSA9IGNhdGVnb3J5O1xyXG4gIHRoaXMuY2F0ZWdvcmllcyA9IGtvLm9ic2VydmFibGVBcnJheShPYmplY3Qua2V5cyhiYXNlKS5tYXAoZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBjaGVja2VkOiBrby5vYnNlcnZhYmxlKCFpbmRleCksXHJcbiAgICAgIG5hbWU6IGl0ZW0sXHJcbiAgICAgIGxpbms6IGZhbHNlXHJcbiAgICB9XHJcbiAgfSkpO1xyXG5cclxuICAvLyBpbml0aWFsIGxvYWRcclxuICB0aGlzLnNlbGVjdENhdGVnb3J5KHRoaXMuY2F0ZWdvcmllcygpWzBdKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIE1lbnUgVmlldy1Nb2RlbCBtZXRob2RcclxuICogQHBhcmFtIGNhdGVnb3J5XHJcbiAqL1xyXG5NZW51Vmlld01vZGVsLnByb3RvdHlwZS5zZWxlY3RDYXRlZ29yeSA9IGZ1bmN0aW9uIChjYXRlZ29yeSkge1xyXG4gIHZhciBjYXRlZ29yeU5hbWUgPSBjYXRlZ29yeS5uYW1lO1xyXG4gIHNlbGYuY2F0ZWdvcnkoY2F0ZWdvcnlOYW1lKTtcclxuICBoZi5jaGVja0FjdGl2ZShzZWxmLmNhdGVnb3JpZXMsIGNhdGVnb3J5TmFtZSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1lbnVWaWV3TW9kZWw7XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zY3JpcHRzL2FwaS1leHBsb3Jlci92Mi9WaWV3TW9kZWxzL21lbnVWaWV3TW9kZWwuanNcbiAqKiBtb2R1bGUgaWQgPSA2XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJleHBvcnRzLmdldE1vZGVsQXJyYXkgPSBmdW5jdGlvbiBnZXRNb2RlbEFycmF5KHBhcmFtcykge1xyXG4gICAgdmFyIG9iaiA9IHBhcmFtcy5vYmogfHwge30sXHJcbiAgICAgICAgYXJyID0gcGFyYW1zLmFyciB8fCBbXSxcclxuICAgICAgICBwcm9wID0gcGFyYW1zLnByb3AgfHwgJ25hbWUnO1xyXG5cclxuICAgIGZvciAodmFyIGkgaW4gb2JqKSB7XHJcbiAgICAgICAgaWYgKCFvYmouaGFzT3duUHJvcGVydHkoaSkpIHsgY29udGludWU7IH1cclxuXHJcbiAgICAgICAgdmFyIGl0ZW0gPSBhcnIuZmluZChmdW5jdGlvbiAobTEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG0xLm5hbWUgPT09IG9ialtpXVtwcm9wXTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKGl0ZW0pIHsgY29udGludWU7IH1cclxuXHJcbiAgICAgICAgYXJyLnB1c2goe1xyXG4gICAgICAgICAgICBjaGVja2VkOiBrby5vYnNlcnZhYmxlKGZhbHNlKSxcclxuICAgICAgICAgICAgbmFtZTogb2JqW2ldW3Byb3BdXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXJyO1xyXG59O1xyXG5cclxuZXhwb3J0cy5jaGVja0FjdGl2ZSA9IGZ1bmN0aW9uIGNoZWNrQWN0aXZlKGtvQXJyLCBhY3RpdmVFbGVtKSB7XHJcbiAgICBpZiAoIWtvQXJyICYmICFhY3RpdmVFbGVtKSB7cmV0dXJuIGZhbHNlO31cclxuXHJcbiAgICBrb0Fycihrb0FycigpLm1hcChmdW5jdGlvbiAob2JqKSB7XHJcbiAgICAgICAgaWYgKG9iai5uYW1lID09PSBhY3RpdmVFbGVtKSB7XHJcbiAgICAgICAgICAgIG9iai5jaGVja2VkKHRydWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG9iai5jaGVja2VkKGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG9iajtcclxuICAgIH0pKTtcclxufTtcclxuXHJcbmV4cG9ydHMuaXRlcmF0ZSA9IGZ1bmN0aW9uIChvYmopIHtcclxuXHRmb3IgKHZhciBwcm9wZXJ0eSBpbiBvYmopIHtcclxuXHRcdGlmIChvYmouaGFzT3duUHJvcGVydHkocHJvcGVydHkpKSB7XHJcblx0XHRcdGlmICh0eXBlb2Ygb2JqW3Byb3BlcnR5XSA9PSBcIm9iamVjdFwiKSB7XHJcblx0XHRcdFx0aXRlcmF0ZShvYmpbcHJvcGVydHldKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZygnfCcgKyBwcm9wZXJ0eSArIFwiIHwgIFwiICsgb2JqW3Byb3BlcnR5XSArICd8Jyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn07XHJcblxyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc2NyaXB0cy9hcGktZXhwbG9yZXIvdjIvbW9kdWxlcy9oZWxwZXJGdW5jLmpzXG4gKiogbW9kdWxlIGlkID0gN1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIHNlbGY7XHJcbnZhciBiYXNlO1xyXG52YXIgaGYgPSByZXF1aXJlKCcuLi9tb2R1bGVzL2hlbHBlckZ1bmMnKTtcclxuLyoqXHJcbiAqIFBhcmFtcyBWaWV3LU1vZGVsXHJcbiAqIEBwYXJhbSByYXdcclxuICogQHBhcmFtIG1ldGhvZFxyXG4gKiBAcGFyYW0gcGFyYW1zXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxuZnVuY3Rpb24gUGFyYW1zVmlld01vZGVsKHJhdywgbWV0aG9kLCBwYXJhbXMpIHtcclxuICBiYXNlID0gcmF3O1xyXG4gIHNlbGYgPSB0aGlzO1xyXG4gIHRoaXMuYW5pbWF0aW9uU3BlZWQgPSAyMDA7XHJcblxyXG4gIC8vIG9ic2VydmFibGVzXHJcbiAgdGhpcy5tZXRob2QgPSBtZXRob2Q7XHJcbiAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7XHJcbiAgdGhpcy5pc0hpZGRlbiA9IGtvLm9ic2VydmFibGUodHJ1ZSk7XHJcbiAgdGhpcy5wYXJhbUluRm9jdXMgPSBrby5vYnNlcnZhYmxlKCcnKTtcclxuXHR0aGlzLnBhcmFtc01vZGVsID0ga28ub2JzZXJ2YWJsZUFycmF5KFtdKTtcclxuXHJcblx0Ly8gY29tcHV0ZWRcclxuXHQvLyB0aGlzLnBhcmFtc01vZGVsID0ga28uY29tcHV0ZWQodGhpcy51cGRhdGVQYXJhbXNNb2RlbCwgdGhpcyk7XHJcblx0dGhpcy51cGRhdGVWaWV3TW9kZWwoKTtcclxuXHR0aGlzLm1ldGhvZC5zdWJzY3JpYmUodGhpcy51cGRhdGVWaWV3TW9kZWwsIHRoaXMpO1xyXG5cclxuXHR0aGlzLmlzRGlydHkgPSBrby5jb21wdXRlZCh0aGlzLmNoZWNrRGlydHksIHRoaXMpO1xyXG59XHJcblxyXG5cclxuLyoqXHJcbiAqIEluaXRpYWwgYnVpbGQgb2YgU2VsZWN0IE1vZGVsXHJcbiAqL1xyXG5QYXJhbXNWaWV3TW9kZWwucHJvdG90eXBlLnVwZGF0ZVZpZXdNb2RlbCA9IGZ1bmN0aW9uICgpIHtcclxuXHR2YXIgb2JqID0gdGhpcy5tZXRob2QoKS5wYXJhbWV0ZXJzIHx8IHt9LFxyXG5cdFx0YXJyID0gW107XHJcblxyXG5cdGZvciAodmFyIGkgaW4gb2JqKSB7XHJcblx0XHRpZiAoIW9iai5oYXNPd25Qcm9wZXJ0eShpKSkge2NvbnRpbnVlO31cclxuXHJcblx0XHQvLyBjb3BpZXMgYWxsIHZhbHVlcyBmcm9tIG1vZGVsIHRvIHZpZXctbW9kZWxcclxuXHRcdHZhciB2bVBhcmFtID0gJC5leHRlbmQoe30sIG9ialtpXSk7XHJcblxyXG5cdFx0dm1QYXJhbS52YWx1ZSA9IGtvLm9ic2VydmFibGUodm1QYXJhbS52YWx1ZSB8fCAodm1QYXJhbS5zZWxlY3QgJiYgdm1QYXJhbS5kZWZhdWx0KSB8fCAnJyk7XHJcblxyXG5cdFx0Ly9hZGQgb2JzZXJ2YWJsZSBmb3Igc2VsZWN0ZWQgb3B0aW9uc1xyXG5cdFx0aWYgKHZtUGFyYW0uc2VsZWN0KSB7XHJcblx0XHRcdHZtUGFyYW0ub3B0aW9ucyA9IGtvLm9ic2VydmFibGVBcnJheShvYmpbaV0ub3B0aW9ucy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcclxuXHRcdFx0XHR2YXIgb2JqID0gJC5leHRlbmQoe30sIGl0ZW0pO1xyXG5cdFx0XHRcdG9iai5jaGVja2VkID0ga28ub2JzZXJ2YWJsZShpdGVtLmNoZWNrZWQpO1xyXG5cdFx0XHRcdHJldHVybiBvYmo7XHJcblx0XHRcdH0pKVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vICdkaXJ0eScgZmxhZyB3YXRjaGVyIGZvciBjdXJyZW50IGZpZWxkXHJcblx0XHR2bVBhcmFtLmlzRGlydHkgPSBrby5wdXJlQ29tcHV0ZWQoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAodGhpcy5zZWxlY3QpIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy52YWx1ZSgpICE9PSB0aGlzLmRlZmF1bHQgJiYgdGhpcy52YWx1ZSgpICE9PSAnbm9uZSc7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuICEhKHRoaXMudmFsdWUoKS50b1N0cmluZygpKS50cmltKCkubGVuZ3RoO1xyXG5cdFx0fSwgdm1QYXJhbSk7XHJcblxyXG5cdFx0Ly8gYWRkIGNhbGVuZGFyIGJ0biBmb3IgY3VycmVudCBmaWVsZFxyXG5cdFx0dm1QYXJhbS5oYXNDYWxlbmRhciA9IGkuc2VhcmNoKC8oZGF0ZXx0aW1lKS9nbWkpICE9IC0xO1xyXG5cclxuXHRcdC8vIGFkZCBwb3AtdXAgYnRuIGZvciBjdXJyZW50IGZpZWxkXHJcblx0XHR2bVBhcmFtLmhhc1BvcFVwID0gaS5zZWFyY2goLyhhdHRyYWN0aW9uSWR8dmVudWVJZCkvZ21pKSAhPSAtMTtcclxuXHJcblx0XHRhcnIucHVzaCh2bVBhcmFtKTtcclxuXHR9XHJcblxyXG5cdC8vIHByZXBhcmUgb3V0cHV0IGZvciByZXF1ZXN0XHJcblx0dGhpcy5wYXJhbXNNb2RlbChhcnIpO1xyXG5cdHRoaXMucGFyYW1JbkZvY3VzKHRoaXMucGFyYW1zTW9kZWwoKVswXSk7XHJcblx0dGhpcy5wcmVwYXJlVXJsUGFpcnMoYXJyLCB0aGlzLnBhcmFtcyk7XHJcblx0cmV0dXJuIGFycjtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBEaXJ0eSBwYXJhbXMgZm9ybSBvYnNlcnZhYmxlIG1ldGhvZFxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICovXHJcblBhcmFtc1ZpZXdNb2RlbC5wcm90b3R5cGUuY2hlY2tEaXJ0eSA9IGZ1bmN0aW9uICgpIHtcclxuXHR0aGlzLnByZXBhcmVVcmxQYWlycyh0aGlzLnBhcmFtc01vZGVsKCksIHRoaXMucGFyYW1zKTtcclxuXHR2YXIgZGlydHkgPSB0aGlzLnBhcmFtc01vZGVsKCkuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XHJcblx0XHRyZXR1cm4gaXRlbS5pc0RpcnR5KCkgPT09IHRydWU7XHJcblx0fSk7XHJcblx0cmV0dXJuIGRpcnR5Lmxlbmd0aCA+IDA7XHJcbn07XHJcblxyXG5cclxuLyoqXHJcbiAqIEVudGVyIGtleSBoYW5kbGVyXHJcbiAqIEBwYXJhbSBtb2RlbFxyXG4gKiBAcGFyYW0gZXZlbnRcclxuICovXHJcblBhcmFtc1ZpZXdNb2RlbC5wcm90b3R5cGUub25FbnRlcktleURvd24gPSBmdW5jdGlvbiAobW9kZWwsIGV2ZW50KSB7XHJcbiAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDEzKSB7XHJcbiAgICAkKCcjYXBpLWV4cC1nZXQtYnRuJykudHJpZ2dlcignY2xpY2snKTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNsaWRlIHRvZ2dsZSBmb3IgcGFyYW1zIGNvbnRhaW5lciBtZXRob2RcclxuICogQHBhcmFtIHZpZXdNb2RlbFxyXG4gKiBAcGFyYW0gZXZlbnRcclxuICovXHJcblBhcmFtc1ZpZXdNb2RlbC5wcm90b3R5cGUuc2xpZGVUb2dnbGUgPSBmdW5jdGlvbiAodmlld01vZGVsLCBldmVudCkge1xyXG4gICQoZXZlbnQuY3VycmVudFRhcmdldClcclxuICAgIC5wYXJlbnRzKCcuanMtc2xpZGUtY29udHJvbCcpXHJcbiAgICAuZmluZCgnLmpzLXNsaWRlLXdyYXBwZXInKVxyXG4gICAgLnNsaWRlVG9nZ2xlKHZpZXdNb2RlbC5hbmltYXRpb25TcGVlZCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICB2aWV3TW9kZWwuaXNIaWRkZW4oIXZpZXdNb2RlbC5pc0hpZGRlbigpKTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE1hY2hlcyBmb2N1c2VkIHBhcmFtXHJcbiAqIEBwYXJhbSBpdGVtXHJcbiAqL1xyXG5QYXJhbXNWaWV3TW9kZWwucHJvdG90eXBlLm9uRm9jdXMgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gIHNlbGYucGFyYW1JbkZvY3VzKGl0ZW0pO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEZpbHRlcnMgcGFyYW1zIGJ5IGRlZmluZWQgdmFsdWVcclxuICogQHBhcmFtIGFyclxyXG4gKiBAcGFyYW0ga29PYnNcclxuICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAqL1xyXG5QYXJhbXNWaWV3TW9kZWwucHJvdG90eXBlLnByZXBhcmVVcmxQYWlycyA9IGZ1bmN0aW9uIChhcnIsIGtvT2JzKSB7XHJcbiAgaWYgKCFhcnIgJiYgIWtvT2JzKSB7cmV0dXJuIGZhbHNlO31cclxuXHJcbiAgcmV0dXJuIGtvT2JzKGFyci5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgIHJldHVybiAoaXRlbS52YWx1ZSgpIHx8IGl0ZW0uZGVmYXVsdCk7XHJcbiAgfSkpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE9uIHNlbGVjdCB2YWx1ZSBoYW5kbGVyIGZvciBwYXJhbXMgc2VsZWN0XHJcbiAqIEBwYXJhbSBwYXJhbSB7b2JqZWN0fSBwYXJhbWV0ZXIgdmlldy1tb2RlbFxyXG4gKiBAcGFyYW0gb3B0aW9uIHtvYmplY3R9IG9wdGlvbiB2aWV3LW1vZGVsXHJcbiAqL1xyXG5QYXJhbXNWaWV3TW9kZWwucHJvdG90eXBlLm9uU2VsZWN0UGFyYW1WYWx1ZSA9IGZ1bmN0aW9uIChwYXJhbSwgb3B0aW9uKSB7XHJcblx0aGYuY2hlY2tBY3RpdmUocGFyYW0ub3B0aW9ucywgb3B0aW9uLm5hbWUpO1xyXG5cdHBhcmFtLnZhbHVlKG9wdGlvbi5uYW1lKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBQYXJhbXMgY2xlYXIgYnV0dG9uIGhhbmRsZXJcclxuICogQHBhcmFtIHZtIHtvYmplY3R9IHZpZXcgbW9kZWxcclxuICogQHBhcmFtIGUge29iamVjdH0gZXZlbnRcclxuICovXHJcblBhcmFtc1ZpZXdNb2RlbC5wcm90b3R5cGUub25QYXJhbXNDbGVhciA9IGZ1bmN0aW9uICh2bSwgZSkge1xyXG5cdHRoaXMudXBkYXRlVmlld01vZGVsKCk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBhcmFtc1ZpZXdNb2RlbDtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL1ZpZXdNb2RlbHMvcGFyYW1zVmlld01vZGVsLmpzXG4gKiogbW9kdWxlIGlkID0gOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIGhmID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9oZWxwZXJGdW5jJyk7XHJcbnZhciBzZWxmO1xyXG52YXIgYmFzZTtcclxudmFyIGNhdGVnb3J5O1xyXG5cclxuLyoqXHJcbiAqIE1ldGhvZHMgVmlldy1Nb2RlbFxyXG4gKiBAcGFyYW0gcmF3XHJcbiAqIEBwYXJhbSBjYXRlZ29yeVxyXG4gKiBAcGFyYW0gbWV0aG9kXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxuZnVuY3Rpb24gTWV0aG9kc1ZpZXdNb2RlbChyYXcsIGNhdGVnb3J5LCBtZXRob2QpIHtcclxuICBzZWxmID0gdGhpcztcclxuICBiYXNlID0gcmF3O1xyXG5cclxuICAvLyBvYnNlcnZhYmxlc1xyXG4gIHRoaXMuY2F0ZWdvcnkgPSBjYXRlZ29yeTtcclxuICB0aGlzLm1ldGhvZCA9IG1ldGhvZDtcclxuICB0aGlzLnRvZ2dsZVBvcFVwID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XHJcbiAgdGhpcy5yYWRpb3NNb2RlbCA9IGtvLm9ic2VydmFibGVBcnJheShbXSk7XHJcbiAgdGhpcy5tZXRob2RzVmlld01vZGVsID0ga28ub2JzZXJ2YWJsZUFycmF5KFtdKTtcclxuICB0aGlzLnVwZGF0ZU1vZGVsKHRoaXMuY2F0ZWdvcnkoKSk7XHJcbiAgdGhpcy5jYXRlZ29yeS5zdWJzY3JpYmUodGhpcy51cGRhdGVNb2RlbCwgdGhpcyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBPbiBjYXRlZ29yeSBjaGFuZ2UgaGFuZGxlclxyXG4gKiBNZXRob2RzIFZpZXctTW9kZWwgbWV0aG9kXHJcbiAqIEBwYXJhbSBjYXRlZ29yeVxyXG4gKi9cclxuTWV0aG9kc1ZpZXdNb2RlbC5wcm90b3R5cGUudXBkYXRlTW9kZWwgPSBmdW5jdGlvbiAoY2F0ZWdvcnkpIHtcclxuICAvLyBpbml0aWFsIHJhZGlvcyBtb2RlbFxyXG4gIHNlbGYudXBkYXRlUmFkaW9zTW9kZWwoYmFzZVtjYXRlZ29yeV0pO1xyXG4gIC8vIGluaXRpYWwgc2VsZWN0IG1vZGVsIChmaXJzdCBtZXRob2QgaW4gZmlyc3Qgc2VjdGlvbiBmb3Igc3RhcnQpXHJcbiAgc2VsZi51cGRhdGVTZWxlY3Qoc2VsZi5yYWRpb3NNb2RlbCgpWzBdKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBPbmNoYW5nZSBoYW5kbGVyIGZvciBSYWRpbyBidXR0b25zXHJcbiAqIEBwYXJhbSBpdGVtXHJcbiAqL1xyXG5NZXRob2RzVmlld01vZGVsLnByb3RvdHlwZS5vbmNoYW5nZVJhZGlvcyA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgLy91cGRhdGUgUmFkaW9zIE1vZGVsXHJcbiAgaGYuY2hlY2tBY3RpdmUoc2VsZi5yYWRpb3NNb2RlbCwgaXRlbS5uYW1lKTtcclxuICAvL3VwZGF0ZSBTZWxlY3QgTW9kZWxcclxuICBzZWxmLnVwZGF0ZVNlbGVjdChpdGVtKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBJbml0aWFsIGJ1aWxkIG9mIFJhZGlvcyBNb2RlbFxyXG4gKiBAcGFyYW0gcGFyYW1cclxuICogQHJldHVybnMge0FycmF5fVxyXG4gKi9cclxuTWV0aG9kc1ZpZXdNb2RlbC5wcm90b3R5cGUudXBkYXRlUmFkaW9zTW9kZWwgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICB2YXIgb2JqID0gcGFyYW0gfHwge30sXHJcbiAgICBhcnIgPSBbXTtcclxuXHJcbiAgZm9yICh2YXIgaSBpbiBvYmopIHtcclxuICAgIGlmICghb2JqLmhhc093blByb3BlcnR5KGkpKSB7IGNvbnRpbnVlOyB9XHJcbiAgICB2YXIgaXRlbSA9IHtcclxuICAgICAgY2hlY2tlZDoga28ub2JzZXJ2YWJsZShpID09PSAnQUxMJyksXHJcbiAgICAgIG5hbWU6IGlcclxuICAgIH07XHJcblxyXG4gICAgaWYgKGkgPT09ICdBTEwnKSB7XHJcbiAgICAgIGFyci51bnNoaWZ0KGl0ZW0pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBhcnIucHVzaChpdGVtKTtcclxuICAgIH1cclxuICB9XHJcblx0YXJyID0gYXJyLnNvcnQoY29tcGFyZU1ldGhvZHMpO1xyXG4gIHRoaXMucmFkaW9zTW9kZWwoYXJyKTtcclxuICByZXR1cm4gYXJyO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEluaXRpYWwgYnVpbGQgb2YgU2VsZWN0IE1vZGVsXHJcbiAqIEBwYXJhbSBpdGVtXHJcbiAqL1xyXG5NZXRob2RzVmlld01vZGVsLnByb3RvdHlwZS51cGRhdGVTZWxlY3QgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gIHZhciBvYmogPSBiYXNlW3NlbGYuY2F0ZWdvcnkoKV1baXRlbS5uYW1lXXx8IHt9LFxyXG4gICAgYXJyID0gW10sXHJcbiAgICBjb3VudCA9IDA7XHJcblxyXG4gIGZvciAodmFyIGkgaW4gb2JqKSB7XHJcbiAgICBpZiAoIW9iai5oYXNPd25Qcm9wZXJ0eShpKSkgeyBjb250aW51ZTsgfVxyXG4gICAgdmFyIHByb3BlcnR5ID0gb2JqW2ldO1xyXG5cdFx0Ly8gY29waWVzIGFsbCB2YWx1ZXMgZnJvbSBtb2RlbCB0byB2aWV3LW1vZGVsXHJcblx0XHR2YXIgdm1NZXRob2QgPSAkLmV4dGVuZCh7fSwgcHJvcGVydHkpO1xyXG5cclxuXHRcdGRlbGV0ZSB2bU1ldGhvZC5wYXJhbWV0ZXJzO1xyXG5cdFx0dm1NZXRob2QuY2hlY2tlZCA9IGtvLm9ic2VydmFibGUoIWNvdW50KTtcclxuXHJcblx0XHRhcnIucHVzaCh2bU1ldGhvZCk7XHJcblxyXG4gICAgLy8gc2V0IGdsb2JhbCBvYnNlcnZhYmxlXHJcbiAgICAhY291bnQgJiYgdGhpcy5tZXRob2QoYmFzZVtwcm9wZXJ0eS5jYXRlZ29yeV1bcHJvcGVydHkubWV0aG9kXVtwcm9wZXJ0eS5pZF0pO1xyXG5cclxuICAgIGNvdW50Kys7XHJcblxyXG4gIH1cclxuXHJcblx0dGhpcy5tZXRob2RzVmlld01vZGVsKGFycik7XHJcblx0cmV0dXJuIGFycjtcclxufTtcclxuXHJcbk1ldGhvZHNWaWV3TW9kZWwucHJvdG90eXBlLm9uU2VsZWN0TWV0aG9kID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICBoZi5jaGVja0FjdGl2ZShzZWxmLm1ldGhvZHNWaWV3TW9kZWwsIGl0ZW0ubmFtZSk7XHJcbiAgc2VsZi5tZXRob2QoYmFzZVtpdGVtLmNhdGVnb3J5XVtpdGVtLm1ldGhvZF1baXRlbS5pZF0pO1xyXG59O1xyXG5cclxuTWV0aG9kc1ZpZXdNb2RlbC5wcm90b3R5cGUub25BYm91dENsaWNrID0gZnVuY3Rpb24gKG1vZGVsLCBldmVudCkge1xyXG4gIG1vZGVsLnRvZ2dsZVBvcFVwKCFtb2RlbC50b2dnbGVQb3BVcCgpKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTb3J0IGZ1bmN0aW9uIGZvciBtZXRob2RzIGFyYXlcclxuICogQHBhcmFtIGZcclxuICogQHBhcmFtIHNcclxuICogQHJldHVybnMge251bWJlcn1cclxuICovXHJcbmZ1bmN0aW9uIGNvbXBhcmVNZXRob2RzKGYscykge1xyXG5cdHZhciBhID0gZi5uYW1lLnRvVXBwZXJDYXNlKCk7XHJcblx0dmFyIGIgPSBzLm5hbWUudG9VcHBlckNhc2UoKTtcclxuXHJcblx0aWYgKGEgPT09IGIpIHtyZXR1cm4gMDt9XHJcblx0aWYgKGEgPT09ICdBTEwnIHx8XHJcblx0XHQoYSA9PT0gJ0dFVCcgJiYgKGIgPT09ICdQT1NUJyB8fCBiID09PSAnUFVUJyB8fCBiID09PSAnREVMRVRFJykpIHx8XHJcblx0XHQoYSA9PT0gJ1BPU1QnICYmIChiID09PSAnUFVUJyB8fCBiID09PSAnREVMRVRFJykpIHx8XHJcblx0XHQoYSA9PT0gJ1BVVCcgJiYgYiA9PT0gJ0RFTEVURScpKSB7XHJcblx0XHRyZXR1cm4gLTE7XHJcblx0fVxyXG5cdHJldHVybiAxO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1ldGhvZHNWaWV3TW9kZWw7XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zY3JpcHRzL2FwaS1leHBsb3Jlci92Mi9WaWV3TW9kZWxzL21ldGhvZHNWaWV3TW9kZWwuanNcbiAqKiBtb2R1bGUgaWQgPSA5XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIganNvbkhpZ2hsaWdodCA9IHJlcXVpcmUoJy4vLi4vbW9kdWxlcy9qc29uLWhpZ2hsaWdodCcpO1xyXG52YXIgc2VsZjtcclxudmFyIHNsaWRlciA9IHJlcXVpcmUoJy4uL21vZHVsZXMvc2xpZGVyJyk7XHJcblxyXG5mdW5jdGlvbiBSZXF1ZXN0c0xpc3RWaWV3TW9kZWwocmVxdWVzdHMsIHVybCkge1xyXG5cdHRoaXMudXJsID0gdXJsO1xyXG5cdHNlbGYgPSB0aGlzO1xyXG5cdHRoaXMuY29sb3JzID0gW1xyXG5cdFx0J2NvbHVtbi1jb2xvci0xJyxcclxuXHRcdCdjb2x1bW4tY29sb3ItMicsXHJcblx0XHQnY29sdW1uLWNvbG9yLTMnLFxyXG5cdFx0J2NvbHVtbi1jb2xvci00JyxcclxuXHRcdCdjb2x1bW4tY29sb3ItNScsXHJcblx0XHQnY29sdW1uLWNvbG9yLTYnLFxyXG5cdFx0J2NvbHVtbi1jb2xvci03JyxcclxuXHRcdCdjb2x1bW4tY29sb3ItOCcsXHJcblx0XHQnY29sdW1uLWNvbG9yLTknLFxyXG5cdFx0J2NvbHVtbi1jb2xvci0xMCcsXHJcblx0XHQnY29sdW1uLWNvbG9yLTExJyxcclxuXHRcdCdjb2x1bW4tY29sb3ItMTInXHJcblx0XTtcclxuXHR0aGlzLnJlcXVlc3RzID0gcmVxdWVzdHM7XHJcblx0dGhpcy5pc0FjdGl2ZVRhYiA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xyXG5cdHRoaXMudmlld01vZGVsID0ga28ub2JzZXJ2YWJsZUFycmF5KFtdKTtcclxuXHR0aGlzLmNsZWFyQnRuSXNWaXNpYmxlID0ga28uY29tcHV0ZWQodGhpcy5faXNWaXNpYmxlLCB0aGlzKTtcclxuXHR0aGlzLnJlcXVlc3RzLnN1YnNjcmliZSh0aGlzLnVwZGF0ZU1vZGVsLCB0aGlzKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFVwZGF0ZSBWaWV3bW9kZWwgb2YgcmVxdWVzdCBsaXN0XHJcbiAqIEBwYXJhbSBhcnJcclxuICovXHJcblJlcXVlc3RzTGlzdFZpZXdNb2RlbC5wcm90b3R5cGUudXBkYXRlTW9kZWwgPSBmdW5jdGlvbiAoYXJyKSB7XHJcblx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdFxyXG5cdHZhciBuZXdNb2RlbCA9IHRoaXMucmVxdWVzdHMoKVxyXG5cdFx0Lm1hcChmdW5jdGlvbiAob2JqKSB7XHJcblx0XHRcdHZhciBpdGVtID0gICQuZXh0ZW5kKHt9LCBvYmosIHtcclxuXHRcdFx0XHRjb2xvcjogc2VsZi5jb2xvcnNbb2JqLmluZGV4ICUgc2VsZi5jb2xvcnMubGVuZ3RoXSxcclxuXHRcdFx0XHRhY3RpdmU6IGtvLm9ic2VydmFibGUoZmFsc2UpLFxyXG5cdFx0XHRcdHJlc0hUTUw6IGtvLm9ic2VydmFibGUoJycpXHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gaXRlbTtcclxuXHRcdH0pO1xyXG5cdHNsaWRlci5yZW1vdmUoc2VsZi52aWV3TW9kZWwoKS5sZW5ndGgpO1xyXG5cdHNlbGYudmlld01vZGVsKG5ld01vZGVsKTtcclxuXHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuXHRcdHNsaWRlci5zZXQoc2VsZi52aWV3TW9kZWwoKS5sZW5ndGgpO1xyXG5cdFx0JCgnI3Nob3ctZGV0YWlscy0wJykudHJpZ2dlcignY2xpY2snKTtcclxuXHR9LCAxMCk7XHJcbn07XHJcblxyXG4vKipcclxuICogZ2V0IGRldGFpbHNcclxuICogQHBhcmFtIGRhdGFcclxuICovXHJcblJlcXVlc3RzTGlzdFZpZXdNb2RlbC5wcm90b3R5cGUuZ2V0TW9yZSA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcblx0dmFyIGNhcmQgPSB0aGlzO1xyXG5cdHZhciBjdXJyZW50U2xpZGVyID0gJCgnI3NsaWRlci0nICsgY2FyZC5zZWN0aW9uSW5kZXgpO1xyXG5cdHZhciBjb21wb25lbnQgPSAkKCc8c2VjdGlvbiBkYXRhLWJpbmQ9XCJjb21wb25lbnQ6IHtuYW1lOiBcXCdwYW5lbC1ncm91cFxcJywgcGFyYW1zOiBwYXJhbXN9XCI+PC9zZWN0aW9uPicpO1xyXG5cdHZhciBjdXJzbGljayA9IGN1cnJlbnRTbGlkZXIuc2xpY2soJ2dldFNsaWNrJyk7XHJcblx0dmFyIG5ld0RhdGEgPSB7fTtcclxuXHRcclxuXHQvLyBnYXRoZXJpbmcgYWxsIHByaW1pdGl2ZSBwcm9wcyBpbiBhZGRpdGlvbmFsIHBhbmVsXHJcblx0Zm9yICh2YXIga2V5IGluIGRhdGEpIHtcclxuXHRcdGlmICghZGF0YS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcblx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0fVxyXG5cdFx0dmFyIHZhbCA9IGRhdGFba2V5XTtcclxuXHRcdGlmICh0eXBlb2YgdmFsICE9PSAnb2JqZWN0Jykge1xyXG5cdFx0XHRuZXdEYXRhW2RhdGEudHlwZSB8fCBPYmplY3Qua2V5cyhkYXRhKVswXV0gPSBuZXdEYXRhW2RhdGEudHlwZSB8fCBPYmplY3Qua2V5cyhkYXRhKVswXV0gfHwge307XHJcblx0XHRcdG5ld0RhdGFbZGF0YS50eXBlIHx8IE9iamVjdC5rZXlzKGRhdGEpWzBdXVtrZXldID0gdmFsO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bmV3RGF0YVtrZXldID0gdmFsO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHQvLyBleHRlbmRpbmcgYWRkaXRpb25hbCBkYXRhIChjb3B5KVxyXG5cdHZhciBwYXJhbXMgPSAkLmV4dGVuZCh7fSwgY2FyZCwge2NhcmRzOiBuZXdEYXRhLCBncm91cEluZGV4OiBjYXJkLmdyb3VwSW5kZXggKyAxfSk7XHJcblx0Ly8gYXBwbHkgY29tcG9uZW50IGRhdGEgYmluZGluZ3NcclxuXHRrby5hcHBseUJpbmRpbmdzKHtcclxuXHRcdHBhcmFtczogcGFyYW1zXHJcblx0fSwgY29tcG9uZW50WzBdKTtcclxuXHRcclxuXHQvLyBhZGQgc2xpZGUgd2l0aCBzZWxlY3RlZCBkYXRhXHJcblx0Y3VycmVudFNsaWRlci5zbGljaygnc2xpY2tBZGQnLCBjb21wb25lbnQpO1xyXG5cdFxyXG5cdC8vIHJlbW92ZSBvdXRzdGFuZGluZyBzbGlkZXNcclxuXHRmb3IgKHZhciBpID0gY3Vyc2xpY2suc2xpZGVDb3VudCAtIDI7IGkgPiBjYXJkLmdyb3VwSW5kZXg7IGktLSkge1xyXG5cdFx0Y3VycmVudFNsaWRlci5zbGljaygnc2xpY2tSZW1vdmUnLCBpLCBmYWxzZSk7XHJcblx0fVxyXG5cdC8vIG1vdmUgdG8gbmV4dCBzbGlkZVxyXG5cdGN1cnJlbnRTbGlkZXIuc2xpY2soJ3NsaWNrTmV4dCcpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFZpc2liaWxpdHkgZmxhZyBmb3IgQ2xlYXIgYnRuXHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuUmVxdWVzdHNMaXN0Vmlld01vZGVsLnByb3RvdHlwZS5faXNWaXNpYmxlID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiB0aGlzLnJlcXVlc3RzKCkubGVuZ3RoID4gMDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDbGVhciByZXF1ZXN0c3RzIGxpc3QgaGFuZGxlclxyXG4gKiBAcGFyYW0gdm1cclxuICogQHBhcmFtIGV2ZW50XHJcbiAqL1xyXG5SZXF1ZXN0c0xpc3RWaWV3TW9kZWwucHJvdG90eXBlLm9uQ2xlYXJSZXF1ZXN0cyA9IGZ1bmN0aW9uICh2bSwgZXZlbnQpIHtcclxuXHR0aGlzLnJlcXVlc3RzKFtdKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBEZXRhaWxzIHRvZ2dsZSBoYW5kbGVyXHJcbiAqIEBwYXJhbSB2bVxyXG4gKiBAcGFyYW0gZXZlbnRcclxuICovXHJcblJlcXVlc3RzTGlzdFZpZXdNb2RlbC5wcm90b3R5cGUuZ2V0RGV0YWlscyA9IGZ1bmN0aW9uICh2bSwgZXZlbnQpIHtcclxuXHRpZiAoIXRoaXMucmVzSFRNTCgpLmxlbmd0aCkge1xyXG5cdFx0anNvbkhpZ2hsaWdodCh0aGlzLnJlc0hUTUwsIHRoaXMucmVzKTtcclxuXHR9XHJcblx0dGhpcy5hY3RpdmUoIXRoaXMuYWN0aXZlKCkpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEpvaW4gc3RyaW5nIGZvciBpZCdzXHJcbiAqIEBwYXJhbSBzXHJcbiAqIEBwYXJhbSBpXHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAqL1xyXG5SZXF1ZXN0c0xpc3RWaWV3TW9kZWwucHJvdG90eXBlLmdldFN0ciA9IGZ1bmN0aW9uIChzLCBpKSB7XHJcblx0dmFyIHN0ciA9IHM7XHJcblx0dmFyIGkxID0gaSA/IGkoKSA6ICcnO1xyXG5cdHJldHVybiBbXHJcblx0XHRzdHIsXHJcblx0XHRpMVxyXG5cdF0uam9pbignLScpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSZXF1ZXN0c0xpc3RWaWV3TW9kZWw7XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zY3JpcHRzL2FwaS1leHBsb3Jlci92Mi9WaWV3TW9kZWxzL3JlcXVlc3RzTGlzdFZpZXdNb2RlbC5qc1xuICoqIG1vZHVsZSBpZCA9IDEwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgV29ya2VyID0gcmVxdWlyZSgnLi9oaWdobGlnaHRKc29uLndvcmtlci5qcycpOyAvLyBKc29uLWZvcm1hdHRlciB3b3JrZXJcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9ic2VydmFibGUsIGNvZGUpIHtcclxuXHR2YXIgYW5pbVRpbWUgPSAxMDA7XHJcblx0dmFyIHdvcmtlciA9IG5ldyBXb3JrZXI7XHJcblxyXG5cdHdvcmtlci5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdG9ic2VydmFibGUoZXZlbnQuZGF0YSk7XHJcblxyXG5cdFx0JChkb2N1bWVudClcclxuXHRcdFx0Lm9uKCdjbGljayB0b3VjaCcsICcudG0tY29kZS1jb250YWluZXIgLmV4cGFuZGVkJywgZnVuY3Rpb24ganNvbkNvZGVDb250YWluZXJFeHBhbmRlZChlKSB7XHJcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0XHRcdFx0dmFyICRzZWxmID0gJCh0aGlzKTtcclxuXHRcdFx0XHQkc2VsZlxyXG5cdFx0XHRcdFx0LnBhcmVudCgpXHJcblx0XHRcdFx0XHQuZmluZCgnPnVsJylcclxuXHRcdFx0XHRcdC5zbGlkZVVwKGFuaW1UaW1lLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0JHNlbGYuYWRkQ2xhc3MoJ2NvbGxhcHNlZCcpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdH0pXHJcblx0XHRcdC5vbignY2xpY2sgdG91Y2gnLCAnLnRtLWNvZGUtY29udGFpbmVyIC5leHBhbmRlZC5jb2xsYXBzZWQnLCBmdW5jdGlvbiBqc29uQ29kZUNvbnRhaW5lckNvbGxhcHNlZChlKSB7XHJcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0XHRcdFx0dmFyICRzZWxmID0gJCh0aGlzKTtcclxuXHRcdFx0XHQkc2VsZlxyXG5cdFx0XHRcdFx0LnJlbW92ZUNsYXNzKCdjb2xsYXBzZWQnKVxyXG5cdFx0XHRcdFx0LnBhcmVudCgpXHJcblx0XHRcdFx0XHQuZmluZCgnPnVsJylcclxuXHRcdFx0XHRcdC5zbGlkZURvd24oYW5pbVRpbWUsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHQkc2VsZlxyXG5cdFx0XHRcdFx0XHRcdC5yZW1vdmVDbGFzcygnY29sbGFwc2VkJylcclxuXHRcdFx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdH0pXHJcblx0fTtcclxuXHR3b3JrZXIub25lcnJvciA9IGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0Y29uc29sZS5sb2coZXZlbnQpO1xyXG5cdH07XHJcblxyXG5cdHdvcmtlci5wb3N0TWVzc2FnZShjb2RlKTtcclxufTtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL21vZHVsZXMvanNvbi1oaWdobGlnaHQuanNcbiAqKiBtb2R1bGUgaWQgPSAxMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHJlcXVpcmUoXCIhIUQ6XFxcXHRpY2tldG1hc3Rlci1hcGktc3RhZ2luZy5naXRodWIuaW9cXFxcbm9kZV9tb2R1bGVzXFxcXHdvcmtlci1sb2FkZXJcXFxcY3JlYXRlSW5saW5lV29ya2VyLmpzXCIpKFwiLyoqKioqKi8gKGZ1bmN0aW9uKG1vZHVsZXMpIHsgLy8gd2VicGFja0Jvb3RzdHJhcFxcbi8qKioqKiovIFxcdC8vIFRoZSBtb2R1bGUgY2FjaGVcXG4vKioqKioqLyBcXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xcbi8qKioqKiovXFxuLyoqKioqKi8gXFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cXG4vKioqKioqLyBcXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XFxuLyoqKioqKi9cXG4vKioqKioqLyBcXHRcXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcXG4vKioqKioqLyBcXHRcXHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcXG4vKioqKioqLyBcXHRcXHRcXHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcXG4vKioqKioqL1xcbi8qKioqKiovIFxcdFxcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXFxuLyoqKioqKi8gXFx0XFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xcbi8qKioqKiovIFxcdFxcdFxcdGV4cG9ydHM6IHt9LFxcbi8qKioqKiovIFxcdFxcdFxcdGlkOiBtb2R1bGVJZCxcXG4vKioqKioqLyBcXHRcXHRcXHRsb2FkZWQ6IGZhbHNlXFxuLyoqKioqKi8gXFx0XFx0fTtcXG4vKioqKioqL1xcbi8qKioqKiovIFxcdFxcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxcbi8qKioqKiovIFxcdFxcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xcbi8qKioqKiovXFxuLyoqKioqKi8gXFx0XFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxcbi8qKioqKiovIFxcdFxcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xcbi8qKioqKiovXFxuLyoqKioqKi8gXFx0XFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcXG4vKioqKioqLyBcXHRcXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XFxuLyoqKioqKi8gXFx0fVxcbi8qKioqKiovXFxuLyoqKioqKi9cXG4vKioqKioqLyBcXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxcbi8qKioqKiovIFxcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XFxuLyoqKioqKi9cXG4vKioqKioqLyBcXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxcbi8qKioqKiovIFxcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XFxuLyoqKioqKi9cXG4vKioqKioqLyBcXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xcbi8qKioqKiovIFxcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFxcXCJcXFwiO1xcbi8qKioqKiovXFxuLyoqKioqKi8gXFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXFxuLyoqKioqKi8gXFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XFxuLyoqKioqKi8gfSlcXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xcbi8qKioqKiovIChbXFxuLyogMCAqL1xcbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xcblxcblxcdC8qKlxcclxcblxcdCAqIENvZGUgZm9ybWF0IHdlYi13b3JrZXJcXHJcXG5cXHQgKiBAcGFyYW0gZXZlbnRcXHJcXG5cXHQgKi9cXHJcXG5cXHQvLyB2YXIgaGlnaGxpZ2h0SnNvbigpXFxyXFxuXFx0dmFyIGhpZ2hsaWdodEpzb24gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpO1xcclxcblxcdFxcclxcblxcdG9ubWVzc2FnZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XFxyXFxuXFx0ICB2YXIgY29kZSA9IGV2ZW50LmRhdGE7XFxyXFxuXFx0ICAvLyBpbXBvcnRTY3JpcHRzKCdqc29uLXBhcnNlLmpzJyk7XFxyXFxuXFx0ICB2YXIgcmVzdWx0ID0gaGlnaGxpZ2h0SnNvbihjb2RlLCB7ZXhwYW5kZWQ6IHRydWV9KTtcXHJcXG5cXHQgIC8vIHZhciByZXN1bHQgPUpTT04uc3RyaW5naWZ5KGNvZGUpO1xcclxcblxcdCAgcG9zdE1lc3NhZ2UocmVzdWx0KTtcXHJcXG5cXHR9O1xcclxcblxcblxcbi8qKiovIH0sXFxuLyogMSAqL1xcbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xcblxcblxcdHZhciBwcmVmaXggPSAndG0tY29kZSc7XFxyXFxuXFx0XFxyXFxuXFx0dmFyIGdldEV4cGFuZGVyQ2xhc3NlcyA9IGZ1bmN0aW9uIChleHBhbmRlZCkge1xcclxcblxcdFxcdGlmICghZXhwYW5kZWQpIHtcXHJcXG5cXHRcXHRcXHRyZXR1cm4gJ2V4cGFuZGVkIGNvbGxhcHNlZCBoaWRkZW4nO1xcclxcblxcdFxcdH1cXHJcXG5cXHRcXHRyZXR1cm4gJ2V4cGFuZGVkJztcXHJcXG5cXHR9O1xcclxcblxcdFxcclxcblxcdHZhciBlbmNvZGUgPSBmdW5jdGlvbiAodmFsdWUpIHtcXHJcXG5cXHRcXHRyZXR1cm4gWyc8c3Bhbj4nLCB2YWx1ZSwgJzwvc3Bhbj4nXS5qb2luKCcnKTtcXHJcXG5cXHR9O1xcclxcblxcdFxcclxcblxcdHZhciBjcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24gKGtleSwgdmFsdWUsIHR5cGUsIGV4cGFuZGVyQ2xhc3Nlcykge1xcclxcblxcdFxcdHZhciBrbGFzcyA9ICdvYmplY3QnLFxcclxcblxcdFxcdFxcdG9wZW4gPSAneycsXFxyXFxuXFx0XFx0XFx0Y2xvc2UgPSAnfSc7XFxyXFxuXFx0XFxyXFxuXFx0XFx0aWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XFxyXFxuXFx0XFx0XFx0a2xhc3MgPSAnYXJyYXknO1xcclxcblxcdFxcdFxcdG9wZW4gPSAnWyc7XFxyXFxuXFx0XFx0XFx0Y2xvc2UgPSAnXSc7XFxyXFxuXFx0XFx0fVxcclxcblxcdFxcclxcblxcdFxcdGlmICh2YWx1ZSA9PT0gbnVsbCkge1xcclxcblxcdFxcdFxcdHJldHVybiBbXFxyXFxuXFx0XFx0XFx0XFx0JzxsaT4nLFxcclxcblxcdFxcdFxcdFxcdFxcdCc8c3BhbiBjbGFzcz1cXFwia2V5XFxcIj5cXFwiJywgZW5jb2RlKGtleSksICdcXFwiOiA8L3NwYW4+JyxcXHJcXG5cXHRcXHRcXHRcXHRcXHQnPHNwYW4gY2xhc3M9XFxcIm51bGxcXFwiPlxcXCInLCBlbmNvZGUodmFsdWUpLCAnXFxcIjwvc3Bhbj4nLFxcclxcblxcdFxcdFxcdFxcdCc8L2xpPidcXHJcXG5cXHRcXHRcXHRdLmpvaW4oJycpO1xcclxcblxcdFxcdH1cXHJcXG5cXHRcXHJcXG5cXHRcXHRpZiAodHlwZSA9PSAnb2JqZWN0Jykge1xcclxcblxcdFxcdFxcdHJldHVybiBbXFxyXFxuXFx0XFx0XFx0XFx0JzxsaT4nLFxcclxcblxcdFxcdFxcdFxcdFxcdCc8c3BhbiBjbGFzcz1cXFwiJywgZXhwYW5kZXJDbGFzc2VzLCAnXFxcIj48L3NwYW4+JyxcXHJcXG5cXHRcXHRcXHRcXHRcXHQnPHNwYW4gY2xhc3M9XFxcImtleVxcXCI+XFxcIicsIGVuY29kZShrZXkpLCAnXFxcIjogPC9zcGFuPiAnLFxcclxcblxcdFxcdFxcdFxcdFxcdCc8c3BhbiBjbGFzcz1cXFwib3BlblxcXCI+Jywgb3BlbiwgJzwvc3Bhbj4gJyxcXHJcXG5cXHRcXHRcXHRcXHRcXHQnPHVsIGNsYXNzPVxcXCInLCBrbGFzcywgJ1xcXCI+JyxcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRqc29uMmh0bWwodmFsdWUsIGV4cGFuZGVyQ2xhc3NlcyksXFxyXFxuXFx0XFx0XFx0XFx0XFx0JzwvdWw+JyxcXHJcXG5cXHRcXHRcXHRcXHRcXHQnPHNwYW4gY2xhc3M9XFxcImNsb3NlXFxcIj4nLCBjbG9zZSwgJzwvc3Bhbj4nLFxcclxcblxcdFxcdFxcdFxcdCc8L2xpPidcXHJcXG5cXHRcXHRcXHRdLmpvaW4oJycpO1xcclxcblxcdFxcdH1cXHJcXG5cXHRcXHJcXG5cXHRcXHRpZiAodHlwZSA9PSAnbnVtYmVyJyB8fCB0eXBlID09ICdib29sZWFuJykge1xcclxcblxcdFxcdFxcdHJldHVybiBbXFxyXFxuXFx0XFx0XFx0XFx0JzxsaT4nLFxcclxcblxcdFxcdFxcdFxcdFxcdCc8c3BhbiBjbGFzcz1cXFwia2V5XFxcIj5cXFwiJywgZW5jb2RlKGtleSksICdcXFwiOiA8L3NwYW4+JyxcXHJcXG5cXHRcXHRcXHRcXHRcXHQnPHNwYW4gY2xhc3M9XFxcIicsIHR5cGUsICdcXFwiPicsIGVuY29kZSh2YWx1ZSksICc8L3NwYW4+JyxcXHJcXG5cXHRcXHRcXHRcXHQnPC9saT4nXFxyXFxuXFx0XFx0XFx0XS5qb2luKCcnKTtcXHJcXG5cXHRcXHR9XFxyXFxuXFx0XFx0cmV0dXJuIFtcXHJcXG5cXHRcXHRcXHQnPGxpPicsXFxyXFxuXFx0XFx0XFx0XFx0JzxzcGFuIGNsYXNzPVxcXCJrZXlcXFwiPlxcXCInLCBlbmNvZGUoa2V5KSwgJ1xcXCI6IDwvc3Bhbj4nLFxcclxcblxcdFxcdFxcdFxcdCc8c3BhbiBjbGFzcz1cXFwiJywgdHlwZSwgJ1xcXCI+XFxcIicsIGVuY29kZSh2YWx1ZSksICdcXFwiPC9zcGFuPicsXFxyXFxuXFx0XFx0XFx0JzwvbGk+J1xcclxcblxcdFxcdF0uam9pbignJyk7XFxyXFxuXFx0fTtcXHJcXG5cXHRcXHJcXG5cXHR2YXIganNvbjJodG1sID0gZnVuY3Rpb24gKGpzb24sIGV4cGFuZGVyQ2xhc3Nlcykge1xcclxcblxcdFxcdHZhciBodG1sID0gJyc7XFxyXFxuXFx0XFx0Zm9yICh2YXIga2V5IGluIGpzb24pIHtcXHJcXG5cXHRcXHRcXHRpZiAoIWpzb24uaGFzT3duUHJvcGVydHkoa2V5KSkge1xcclxcblxcdFxcdFxcdFxcdGNvbnRpbnVlO1xcclxcblxcdFxcdFxcdH1cXHJcXG5cXHRcXHJcXG5cXHRcXHRcXHRodG1sID0gW2h0bWwsIGNyZWF0ZUVsZW1lbnQoa2V5LCBqc29uW2tleV0sIHR5cGVvZiBqc29uW2tleV0sIGV4cGFuZGVyQ2xhc3NlcyldLmpvaW4oJycpO1xcclxcblxcdFxcdH1cXHJcXG5cXHRcXHRyZXR1cm4gaHRtbDtcXHJcXG5cXHR9O1xcclxcblxcdFxcclxcblxcdHZhciBnZXRKc29uVmlld2VyID0gZnVuY3Rpb24gKGRhdGEsIG9wdGlvbnMpIHtcXHJcXG5cXHRcXHR0cnkge1xcclxcblxcdFxcdFxcdHJldHVybiBbXFxyXFxuXFx0XFx0XFx0XFx0Jzx1bCBjbGFzcz1cXFwiJywgcHJlZml4LCAnLWNvbnRhaW5lclxcXCI+JyxcXHJcXG5cXHRcXHRcXHRcXHRcXHRqc29uMmh0bWwoW0pTT04ucGFyc2UoZGF0YSldLCBnZXRFeHBhbmRlckNsYXNzZXMob3B0aW9ucy5leHBhbmRlZCkpLFxcclxcblxcdFxcdFxcdFxcdCc8L3VsPidcXHJcXG5cXHRcXHRcXHRdLmpvaW4oJycpO1xcclxcblxcdFxcdH0gY2F0Y2ggKGUpIHtcXHJcXG5cXHRcXHRcXHRyZXR1cm4gW1xcclxcblxcdFxcdFxcdFxcdCc8ZGl2IGNsYXNzPVxcXCInLCBwcmVmaXgsICctZXJyb3JcXFwiID4nLCBlLnRvU3RyaW5nKCksICcgPC9kaXY+J1xcclxcblxcdFxcdFxcdF0uam9pbignJyk7XFxyXFxuXFx0XFx0fVxcclxcblxcdH07XFxyXFxuXFx0XFxyXFxuXFx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkYXRhLCBvcHQpIHtcXHJcXG5cXHRcXHR2YXIganNvbiA9ICcnO1xcclxcblxcdFxcdHZhciBvcHRpb25zID0gb3B0IHx8IHtleHBhbmRlZDogdHJ1ZX07XFxyXFxuXFx0XFx0aWYgKHR5cGVvZiBkYXRhID09ICdzdHJpbmcnKSB7XFxyXFxuXFx0XFx0XFx0anNvbiA9IGRhdGE7XFxyXFxuXFx0XFx0fSBlbHNlIGlmICh0eXBlb2YgZGF0YSA9PSAnb2JqZWN0Jykge1xcclxcblxcdFxcdFxcdGpzb24gPSBKU09OLnN0cmluZ2lmeShkYXRhKVxcclxcblxcdFxcdH1cXHJcXG5cXHRcXHRyZXR1cm4gZ2V0SnNvblZpZXdlcihqc29uLCBvcHRpb25zKTtcXHJcXG5cXHR9O1xcclxcblxcblxcbi8qKiovIH1cXG4vKioqKioqLyBdKTtcXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbmRsWW5CaFkyczZMeTh2ZDJWaWNHRmpheTlpYjI5MGMzUnlZWEFnTkRjeFlqRXdaRFEwWTJFM01qZ3daVEV4TkdFaUxDSjNaV0p3WVdOck9pOHZMeTR2YzJOeWFYQjBjeTloY0drdFpYaHdiRzl5WlhJdmRqSXZiVzlrZFd4bGN5OW9hV2RvYkdsbmFIUktjMjl1TG5kdmNtdGxjaTVxY3lJc0luZGxZbkJoWTJzNkx5OHZMaTl6WTNKcGNIUnpMMkZ3YVMxbGVIQnNiM0psY2k5Mk1pOXRiMlIxYkdWekwycHpiMjR0Y0dGeWMyVXVhbk1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJanRCUVVGQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMSFZDUVVGbE8wRkJRMlk3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN096dEJRVWRCTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHM3UVVGRlFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN096czdPenM3UVVOMFEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJMSEZEUVVGdlF5eGxRVUZsTzBGQlEyNUVPMEZCUTBFN1FVRkRRVHM3T3pzN096dEJRMkpCT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTEZsQlFWYzdRVUZEV0N4aFFVRlpPenRCUVVWYU8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFc1IwRkJSVHRCUVVOR08wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxIZENRVUYxUWp0QlFVTjJRanRCUVVOQk8wRkJRMEVzUjBGQlJUdEJRVU5HTzBGQlEwRTdRVUZEUVR0QlFVTkJJaXdpWm1sc1pTSTZJbWhwWjJoc2FXZG9kRXB6YjI0dWQyOXlhMlZ5TG1weklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lJRngwTHk4Z1ZHaGxJRzF2WkhWc1pTQmpZV05vWlZ4dUlGeDBkbUZ5SUdsdWMzUmhiR3hsWkUxdlpIVnNaWE1nUFNCN2ZUdGNibHh1SUZ4MEx5OGdWR2hsSUhKbGNYVnBjbVVnWm5WdVkzUnBiMjVjYmlCY2RHWjFibU4wYVc5dUlGOWZkMlZpY0dGamExOXlaWEYxYVhKbFgxOG9iVzlrZFd4bFNXUXBJSHRjYmx4dUlGeDBYSFF2THlCRGFHVmpheUJwWmlCdGIyUjFiR1VnYVhNZ2FXNGdZMkZqYUdWY2JpQmNkRngwYVdZb2FXNXpkR0ZzYkdWa1RXOWtkV3hsYzF0dGIyUjFiR1ZKWkYwcFhHNGdYSFJjZEZ4MGNtVjBkWEp1SUdsdWMzUmhiR3hsWkUxdlpIVnNaWE5iYlc5a2RXeGxTV1JkTG1WNGNHOXlkSE03WEc1Y2JpQmNkRngwTHk4Z1EzSmxZWFJsSUdFZ2JtVjNJRzF2WkhWc1pTQW9ZVzVrSUhCMWRDQnBkQ0JwYm5SdklIUm9aU0JqWVdOb1pTbGNiaUJjZEZ4MGRtRnlJRzF2WkhWc1pTQTlJR2x1YzNSaGJHeGxaRTF2WkhWc1pYTmJiVzlrZFd4bFNXUmRJRDBnZTF4dUlGeDBYSFJjZEdWNGNHOXlkSE02SUh0OUxGeHVJRngwWEhSY2RHbGtPaUJ0YjJSMWJHVkpaQ3hjYmlCY2RGeDBYSFJzYjJGa1pXUTZJR1poYkhObFhHNGdYSFJjZEgwN1hHNWNiaUJjZEZ4MEx5OGdSWGhsWTNWMFpTQjBhR1VnYlc5a2RXeGxJR1oxYm1OMGFXOXVYRzRnWEhSY2RHMXZaSFZzWlhOYmJXOWtkV3hsU1dSZExtTmhiR3dvYlc5a2RXeGxMbVY0Y0c5eWRITXNJRzF2WkhWc1pTd2diVzlrZFd4bExtVjRjRzl5ZEhNc0lGOWZkMlZpY0dGamExOXlaWEYxYVhKbFgxOHBPMXh1WEc0Z1hIUmNkQzh2SUVac1lXY2dkR2hsSUcxdlpIVnNaU0JoY3lCc2IyRmtaV1JjYmlCY2RGeDBiVzlrZFd4bExteHZZV1JsWkNBOUlIUnlkV1U3WEc1Y2JpQmNkRngwTHk4Z1VtVjBkWEp1SUhSb1pTQmxlSEJ2Y25SeklHOW1JSFJvWlNCdGIyUjFiR1ZjYmlCY2RGeDBjbVYwZFhKdUlHMXZaSFZzWlM1bGVIQnZjblJ6TzF4dUlGeDBmVnh1WEc1Y2JpQmNkQzh2SUdWNGNHOXpaU0IwYUdVZ2JXOWtkV3hsY3lCdlltcGxZM1FnS0Y5ZmQyVmljR0ZqYTE5dGIyUjFiR1Z6WDE4cFhHNGdYSFJmWDNkbFluQmhZMnRmY21WeGRXbHlaVjlmTG0wZ1BTQnRiMlIxYkdWek8xeHVYRzRnWEhRdkx5QmxlSEJ2YzJVZ2RHaGxJRzF2WkhWc1pTQmpZV05vWlZ4dUlGeDBYMTkzWldKd1lXTnJYM0psY1hWcGNtVmZYeTVqSUQwZ2FXNXpkR0ZzYkdWa1RXOWtkV3hsY3p0Y2JseHVJRngwTHk4Z1gxOTNaV0p3WVdOclgzQjFZbXhwWTE5d1lYUm9YMTljYmlCY2RGOWZkMlZpY0dGamExOXlaWEYxYVhKbFgxOHVjQ0E5SUZ3aVhDSTdYRzVjYmlCY2RDOHZJRXh2WVdRZ1pXNTBjbmtnYlc5a2RXeGxJR0Z1WkNCeVpYUjFjbTRnWlhod2IzSjBjMXh1SUZ4MGNtVjBkWEp1SUY5ZmQyVmljR0ZqYTE5eVpYRjFhWEpsWDE4b01DazdYRzVjYmx4dVhHNHZLaW9nVjBWQ1VFRkRTeUJHVDA5VVJWSWdLaXBjYmlBcUtpQjNaV0p3WVdOckwySnZiM1J6ZEhKaGNDQTBOekZpTVRCa05EUmpZVGN5T0RCbE1URTBZVnh1SUNvcUx5SXNJaThxS2x4eVhHNGdLaUJEYjJSbElHWnZjbTFoZENCM1pXSXRkMjl5YTJWeVhISmNiaUFxSUVCd1lYSmhiU0JsZG1WdWRGeHlYRzRnS2k5Y2NseHVMeThnZG1GeUlHaHBaMmhzYVdkb2RFcHpiMjRvS1Z4eVhHNTJZWElnYUdsbmFHeHBaMmgwU25OdmJpQTlJSEpsY1hWcGNtVW9KeTR2YW5OdmJpMXdZWEp6WlNjcE8xeHlYRzVjY2x4dWIyNXRaWE56WVdkbElEMGdablZ1WTNScGIyNG9aWFpsYm5RcElIdGNjbHh1SUNCMllYSWdZMjlrWlNBOUlHVjJaVzUwTG1SaGRHRTdYSEpjYmlBZ0x5OGdhVzF3YjNKMFUyTnlhWEIwY3lnbmFuTnZiaTF3WVhKelpTNXFjeWNwTzF4eVhHNGdJSFpoY2lCeVpYTjFiSFFnUFNCb2FXZG9iR2xuYUhSS2MyOXVLR052WkdVc0lIdGxlSEJoYm1SbFpEb2dkSEoxWlgwcE8xeHlYRzRnSUM4dklIWmhjaUJ5WlhOMWJIUWdQVXBUVDA0dWMzUnlhVzVuYVdaNUtHTnZaR1VwTzF4eVhHNGdJSEJ2YzNSTlpYTnpZV2RsS0hKbGMzVnNkQ2s3WEhKY2JuMDdYSEpjYmx4dVhHNWNiaThxS2lvcUtpb3FLaW9xS2lvcUtpb3FLbHh1SUNvcUlGZEZRbEJCUTBzZ1JrOVBWRVZTWEc0Z0tpb2dMaTl6WTNKcGNIUnpMMkZ3YVMxbGVIQnNiM0psY2k5Mk1pOXRiMlIxYkdWekwyaHBaMmhzYVdkb2RFcHpiMjR1ZDI5eWEyVnlMbXB6WEc0Z0tpb2diVzlrZFd4bElHbGtJRDBnTUZ4dUlDb3FJRzF2WkhWc1pTQmphSFZ1YTNNZ1BTQXdYRzRnS2lvdklpd2lkbUZ5SUhCeVpXWnBlQ0E5SUNkMGJTMWpiMlJsSnp0Y2NseHVYSEpjYm5aaGNpQm5aWFJGZUhCaGJtUmxja05zWVhOelpYTWdQU0JtZFc1amRHbHZiaUFvWlhod1lXNWtaV1FwSUh0Y2NseHVYSFJwWmlBb0lXVjRjR0Z1WkdWa0tTQjdYSEpjYmx4MFhIUnlaWFIxY200Z0oyVjRjR0Z1WkdWa0lHTnZiR3hoY0hObFpDQm9hV1JrWlc0bk8xeHlYRzVjZEgxY2NseHVYSFJ5WlhSMWNtNGdKMlY0Y0dGdVpHVmtKenRjY2x4dWZUdGNjbHh1WEhKY2JuWmhjaUJsYm1OdlpHVWdQU0JtZFc1amRHbHZiaUFvZG1Gc2RXVXBJSHRjY2x4dVhIUnlaWFIxY200Z1d5YzhjM0JoYmo0bkxDQjJZV3gxWlN3Z0p6d3ZjM0JoYmo0blhTNXFiMmx1S0NjbktUdGNjbHh1ZlR0Y2NseHVYSEpjYm5aaGNpQmpjbVZoZEdWRmJHVnRaVzUwSUQwZ1puVnVZM1JwYjI0Z0tHdGxlU3dnZG1Gc2RXVXNJSFI1Y0dVc0lHVjRjR0Z1WkdWeVEyeGhjM05sY3lrZ2UxeHlYRzVjZEhaaGNpQnJiR0Z6Y3lBOUlDZHZZbXBsWTNRbkxGeHlYRzVjZEZ4MGIzQmxiaUE5SUNkN0p5eGNjbHh1WEhSY2RHTnNiM05sSUQwZ0ozMG5PMXh5WEc1Y2NseHVYSFJwWmlBb1FYSnlZWGt1YVhOQmNuSmhlU2gyWVd4MVpTa3BJSHRjY2x4dVhIUmNkR3RzWVhOeklEMGdKMkZ5Y21GNUp6dGNjbHh1WEhSY2RHOXdaVzRnUFNBbld5YzdYSEpjYmx4MFhIUmpiRzl6WlNBOUlDZGRKenRjY2x4dVhIUjlYSEpjYmx4eVhHNWNkR2xtSUNoMllXeDFaU0E5UFQwZ2JuVnNiQ2tnZTF4eVhHNWNkRngwY21WMGRYSnVJRnRjY2x4dVhIUmNkRngwSnp4c2FUNG5MRnh5WEc1Y2RGeDBYSFJjZENjOGMzQmhiaUJqYkdGemN6MWNJbXRsZVZ3aVBsd2lKeXdnWlc1amIyUmxLR3RsZVNrc0lDZGNJam9nUEM5emNHRnVQaWNzWEhKY2JseDBYSFJjZEZ4MEp6eHpjR0Z1SUdOc1lYTnpQVndpYm5Wc2JGd2lQbHdpSnl3Z1pXNWpiMlJsS0haaGJIVmxLU3dnSjF3aVBDOXpjR0Z1UGljc1hISmNibHgwWEhSY2RDYzhMMnhwUGlkY2NseHVYSFJjZEYwdWFtOXBiaWduSnlrN1hISmNibHgwZlZ4eVhHNWNjbHh1WEhScFppQW9kSGx3WlNBOVBTQW5iMkpxWldOMEp5a2dlMXh5WEc1Y2RGeDBjbVYwZFhKdUlGdGNjbHh1WEhSY2RGeDBKenhzYVQ0bkxGeHlYRzVjZEZ4MFhIUmNkQ2M4YzNCaGJpQmpiR0Z6Y3oxY0lpY3NJR1Y0Y0dGdVpHVnlRMnhoYzNObGN5d2dKMXdpUGp3dmMzQmhiajRuTEZ4eVhHNWNkRngwWEhSY2RDYzhjM0JoYmlCamJHRnpjejFjSW10bGVWd2lQbHdpSnl3Z1pXNWpiMlJsS0d0bGVTa3NJQ2RjSWpvZ1BDOXpjR0Z1UGlBbkxGeHlYRzVjZEZ4MFhIUmNkQ2M4YzNCaGJpQmpiR0Z6Y3oxY0ltOXdaVzVjSWo0bkxDQnZjR1Z1TENBblBDOXpjR0Z1UGlBbkxGeHlYRzVjZEZ4MFhIUmNkQ2M4ZFd3Z1kyeGhjM005WENJbkxDQnJiR0Z6Y3l3Z0oxd2lQaWNzWEhKY2JseDBYSFJjZEZ4MFhIUnFjMjl1TW1oMGJXd29kbUZzZFdVc0lHVjRjR0Z1WkdWeVEyeGhjM05sY3lrc1hISmNibHgwWEhSY2RGeDBKend2ZFd3K0p5eGNjbHh1WEhSY2RGeDBYSFFuUEhOd1lXNGdZMnhoYzNNOVhDSmpiRzl6WlZ3aVBpY3NJR05zYjNObExDQW5QQzl6Y0dGdVBpY3NYSEpjYmx4MFhIUmNkQ2M4TDJ4cFBpZGNjbHh1WEhSY2RGMHVhbTlwYmlnbkp5azdYSEpjYmx4MGZWeHlYRzVjY2x4dVhIUnBaaUFvZEhsd1pTQTlQU0FuYm5WdFltVnlKeUI4ZkNCMGVYQmxJRDA5SUNkaWIyOXNaV0Z1SnlrZ2UxeHlYRzVjZEZ4MGNtVjBkWEp1SUZ0Y2NseHVYSFJjZEZ4MEp6eHNhVDRuTEZ4eVhHNWNkRngwWEhSY2RDYzhjM0JoYmlCamJHRnpjejFjSW10bGVWd2lQbHdpSnl3Z1pXNWpiMlJsS0d0bGVTa3NJQ2RjSWpvZ1BDOXpjR0Z1UGljc1hISmNibHgwWEhSY2RGeDBKenh6Y0dGdUlHTnNZWE56UFZ3aUp5d2dkSGx3WlN3Z0oxd2lQaWNzSUdWdVkyOWtaU2gyWVd4MVpTa3NJQ2M4TDNOd1lXNCtKeXhjY2x4dVhIUmNkRngwSnp3dmJHaytKMXh5WEc1Y2RGeDBYUzVxYjJsdUtDY25LVHRjY2x4dVhIUjlYSEpjYmx4MGNtVjBkWEp1SUZ0Y2NseHVYSFJjZENjOGJHaytKeXhjY2x4dVhIUmNkRngwSnp4emNHRnVJR05zWVhOelBWd2lhMlY1WENJK1hDSW5MQ0JsYm1OdlpHVW9hMlY1S1N3Z0oxd2lPaUE4TDNOd1lXNCtKeXhjY2x4dVhIUmNkRngwSnp4emNHRnVJR05zWVhOelBWd2lKeXdnZEhsd1pTd2dKMXdpUGx3aUp5d2daVzVqYjJSbEtIWmhiSFZsS1N3Z0oxd2lQQzl6Y0dGdVBpY3NYSEpjYmx4MFhIUW5QQzlzYVQ0blhISmNibHgwWFM1cWIybHVLQ2NuS1R0Y2NseHVmVHRjY2x4dVhISmNiblpoY2lCcWMyOXVNbWgwYld3Z1BTQm1kVzVqZEdsdmJpQW9hbk52Yml3Z1pYaHdZVzVrWlhKRGJHRnpjMlZ6S1NCN1hISmNibHgwZG1GeUlHaDBiV3dnUFNBbkp6dGNjbHh1WEhSbWIzSWdLSFpoY2lCclpYa2dhVzRnYW5OdmJpa2dlMXh5WEc1Y2RGeDBhV1lnS0NGcWMyOXVMbWhoYzA5M2JsQnliM0JsY25SNUtHdGxlU2twSUh0Y2NseHVYSFJjZEZ4MFkyOXVkR2x1ZFdVN1hISmNibHgwWEhSOVhISmNibHh5WEc1Y2RGeDBhSFJ0YkNBOUlGdG9kRzFzTENCamNtVmhkR1ZGYkdWdFpXNTBLR3RsZVN3Z2FuTnZibHRyWlhsZExDQjBlWEJsYjJZZ2FuTnZibHRyWlhsZExDQmxlSEJoYm1SbGNrTnNZWE56WlhNcFhTNXFiMmx1S0NjbktUdGNjbHh1WEhSOVhISmNibHgwY21WMGRYSnVJR2gwYld3N1hISmNibjA3WEhKY2JseHlYRzUyWVhJZ1oyVjBTbk52YmxacFpYZGxjaUE5SUdaMWJtTjBhVzl1SUNoa1lYUmhMQ0J2Y0hScGIyNXpLU0I3WEhKY2JseDBkSEo1SUh0Y2NseHVYSFJjZEhKbGRIVnliaUJiWEhKY2JseDBYSFJjZENjOGRXd2dZMnhoYzNNOVhDSW5MQ0J3Y21WbWFYZ3NJQ2N0WTI5dWRHRnBibVZ5WENJK0p5eGNjbHh1WEhSY2RGeDBYSFJxYzI5dU1taDBiV3dvVzBwVFQwNHVjR0Z5YzJVb1pHRjBZU2xkTENCblpYUkZlSEJoYm1SbGNrTnNZWE56WlhNb2IzQjBhVzl1Y3k1bGVIQmhibVJsWkNrcExGeHlYRzVjZEZ4MFhIUW5QQzkxYkQ0blhISmNibHgwWEhSZExtcHZhVzRvSnljcE8xeHlYRzVjZEgwZ1kyRjBZMmdnS0dVcElIdGNjbHh1WEhSY2RISmxkSFZ5YmlCYlhISmNibHgwWEhSY2RDYzhaR2wySUdOc1lYTnpQVndpSnl3Z2NISmxabWw0TENBbkxXVnljbTl5WENJZ1BpY3NJR1V1ZEc5VGRISnBibWNvS1N3Z0p5QThMMlJwZGo0blhISmNibHgwWEhSZExtcHZhVzRvSnljcE8xeHlYRzVjZEgxY2NseHVmVHRjY2x4dVhISmNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdablZ1WTNScGIyNG9aR0YwWVN3Z2IzQjBLU0I3WEhKY2JseDBkbUZ5SUdwemIyNGdQU0FuSnp0Y2NseHVYSFIyWVhJZ2IzQjBhVzl1Y3lBOUlHOXdkQ0I4ZkNCN1pYaHdZVzVrWldRNklIUnlkV1Y5TzF4eVhHNWNkR2xtSUNoMGVYQmxiMllnWkdGMFlTQTlQU0FuYzNSeWFXNW5KeWtnZTF4eVhHNWNkRngwYW5OdmJpQTlJR1JoZEdFN1hISmNibHgwZlNCbGJITmxJR2xtSUNoMGVYQmxiMllnWkdGMFlTQTlQU0FuYjJKcVpXTjBKeWtnZTF4eVhHNWNkRngwYW5OdmJpQTlJRXBUVDA0dWMzUnlhVzVuYVdaNUtHUmhkR0VwWEhKY2JseDBmVnh5WEc1Y2RISmxkSFZ5YmlCblpYUktjMjl1Vm1sbGQyVnlLR3B6YjI0c0lHOXdkR2x2Ym5NcE8xeHlYRzU5TzF4eVhHNWNibHh1WEc0dktpb3FLaW9xS2lvcUtpb3FLaW9xS2lwY2JpQXFLaUJYUlVKUVFVTkxJRVpQVDFSRlVseHVJQ29xSUM0dmMyTnlhWEIwY3k5aGNHa3RaWGh3Ykc5eVpYSXZkakl2Ylc5a2RXeGxjeTlxYzI5dUxYQmhjbk5sTG1welhHNGdLaW9nYlc5a2RXeGxJR2xrSUQwZ01WeHVJQ29xSUcxdlpIVnNaU0JqYUhWdWEzTWdQU0F3WEc0Z0tpb3ZJbDBzSW5OdmRYSmpaVkp2YjNRaU9pSWlmUT09XCIsIF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCJoaWdobGlnaHRKc29uLndvcmtlci5qc1wiKTtcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL21vZHVsZXMvaGlnaGxpZ2h0SnNvbi53b3JrZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAxMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMDM0MzkxMy9ob3ctdG8tY3JlYXRlLWEtd2ViLXdvcmtlci1mcm9tLWEtc3RyaW5nXHJcblxyXG52YXIgVVJMID0gd2luZG93LlVSTCB8fCB3aW5kb3cud2Via2l0VVJMO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGNvbnRlbnQsIHVybCkge1xyXG5cdHRyeSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHR2YXIgYmxvYjtcclxuXHRcdFx0dHJ5IHsgLy8gQmxvYkJ1aWxkZXIgPSBEZXByZWNhdGVkLCBidXQgd2lkZWx5IGltcGxlbWVudGVkXHJcblx0XHRcdFx0dmFyIEJsb2JCdWlsZGVyID0gd2luZG93LkJsb2JCdWlsZGVyIHx8IHdpbmRvdy5XZWJLaXRCbG9iQnVpbGRlciB8fCB3aW5kb3cuTW96QmxvYkJ1aWxkZXIgfHwgd2luZG93Lk1TQmxvYkJ1aWxkZXI7XHJcblx0XHRcdFx0YmxvYiA9IG5ldyBCbG9iQnVpbGRlcigpO1xyXG5cdFx0XHRcdGJsb2IuYXBwZW5kKGNvbnRlbnQpO1xyXG5cdFx0XHRcdGJsb2IgPSBibG9iLmdldEJsb2IoKTtcclxuXHRcdFx0fSBjYXRjaChlKSB7IC8vIFRoZSBwcm9wb3NlZCBBUElcclxuXHRcdFx0XHRibG9iID0gbmV3IEJsb2IoW2NvbnRlbnRdKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gbmV3IFdvcmtlcihVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpKTtcclxuXHRcdH0gY2F0Y2goZSkge1xyXG5cdFx0XHRyZXR1cm4gbmV3IFdvcmtlcignZGF0YTphcHBsaWNhdGlvbi9qYXZhc2NyaXB0LCcgKyBlbmNvZGVVUklDb21wb25lbnQoY29udGVudCkpO1xyXG5cdFx0fVxyXG5cdH0gY2F0Y2goZSkge1xyXG5cdFx0cmV0dXJuIG5ldyBXb3JrZXIodXJsKTtcclxuXHR9XHJcbn1cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIEQ6L3RpY2tldG1hc3Rlci1hcGktc3RhZ2luZy5naXRodWIuaW8vfi93b3JrZXItbG9hZGVyL2NyZWF0ZUlubGluZVdvcmtlci5qc1xuICoqIG1vZHVsZSBpZCA9IDEzXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJmdW5jdGlvbiBzbGljayh0aW1lcykge1xyXG5cdFwidXNlIHN0cmljdFwiO1xyXG5cdHZhciBzZWxlY3RvciA9ICcjc2xpZGVyLSc7XHJcblx0XHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aW1lczsgaSsrKSB7XHJcblx0XHQkKHNlbGVjdG9yICsgaSkuc2xpY2soe1xyXG5cdFx0XHRkb3RzOiBmYWxzZSxcclxuXHRcdFx0aW5maW5pdGU6IGZhbHNlLFxyXG5cdFx0XHRzcGVlZDogMzAwLFxyXG5cdFx0XHRzbGlkZXNUb1Nob3c6IDMsXHJcblx0XHRcdHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG5cdFx0XHR2YXJpYWJsZVdpZHRoOiB0cnVlLFxyXG5cdFx0XHRhdXRvcGxheTogZmFsc2UsXHJcblx0XHRcdHJlc3BvbnNpdmU6IFtcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRicmVha3BvaW50OiAxMjAwLFxyXG5cdFx0XHRcdFx0c2V0dGluZ3M6IHtcclxuXHRcdFx0XHRcdFx0dmFyaWFibGVXaWR0aDogdHJ1ZSxcclxuXHRcdFx0XHRcdFx0c2xpZGVzVG9TaG93OiAyLFxyXG5cdFx0XHRcdFx0XHRzbGlkZXNUb1Njcm9sbDogMSxcclxuXHRcdFx0XHRcdFx0aW5maW5pdGU6IGZhbHNlLFxyXG5cdFx0XHRcdFx0XHRkb3RzOiBmYWxzZVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0YnJlYWtwb2ludDogODAwLFxyXG5cdFx0XHRcdFx0c2V0dGluZ3M6IHtcclxuXHRcdFx0XHRcdFx0dmFyaWFibGVXaWR0aDogdHJ1ZSxcclxuXHRcdFx0XHRcdFx0c2xpZGVzVG9TaG93OiAxLFxyXG5cdFx0XHRcdFx0XHRzbGlkZXNUb1Njcm9sbDogMVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XVxyXG5cdFx0fSk7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiB1bnNsaWNrKHRpbWVzKSB7XHJcblx0XCJ1c2Ugc3RyaWN0XCI7XHJcblx0dmFyIHNlbGVjdG9yID0gJyNzbGlkZXItJztcclxuXHRcclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHRpbWVzOyBpKyspIHtcclxuXHRcdCQoc2VsZWN0b3IgKyBpKS5zbGljaygndW5zbGljaycpO1xyXG5cdH1cclxuXHRjb25zb2xlLmxvZygnY2xlYXJlZCcpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRzZXQ6IHNsaWNrLFxyXG5cdHJlbW92ZTogdW5zbGlja1xyXG59O1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc2NyaXB0cy9hcGktZXhwbG9yZXIvdjIvbW9kdWxlcy9zbGlkZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAxNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKCkge1xyXG5cdHJlcXVpcmUoJy4vY3VzdG9tU2VsZWN0LmNvbXBvbmVudCcpO1xyXG5cdHJlcXVpcmUoJy4vcGFuZWxzL3BhbmVsR3JvdXAuY29tcG9uZW50Jyk7XHJcblx0cmVxdWlyZSgnLi9wYW5lbHMvcGFnaW5hdGlvbi5jb21wb25lbnQnKTtcclxuXHRyZXF1aXJlKCcuL3BhbmVscy9wYW5lbEhlYWRpbmcuY29tcG9uZW50Jyk7XHJcblx0cmVxdWlyZSgnLi9wYW5lbHMvb2JqZWN0UGFuZWxCb2R5LmNvbXBvbmVudCcpO1xyXG5cdHJlcXVpcmUoJy4vcGFuZWxzL2FycmF5UGFuZWxCb2R5LmNvbXBvbmVudCcpO1xyXG59KCkpO1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc2NyaXB0cy9hcGktZXhwbG9yZXIvdjIvY29tcG9uZW50cy9pbmRleC5qc1xuICoqIG1vZHVsZSBpZCA9IDE1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKipcclxuICogQ3VzdG9tIFNlbGVjdCBjb21wb25lbnRcclxuICovXHJcbnZhciBzZWxmO1xyXG5cclxuLyoqXHJcbiAqIEN1c3RvbSBTZWxlY3QgVmlldy1Nb2RlbFxyXG4gKiBAcGFyYW0gcGFyYW1zXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxuZnVuY3Rpb24gQ3VzdG9tU2VsZWN0KHBhcmFtcykge1xyXG4gIHNlbGYgPSB0aGlzO1xyXG5cclxuICB0aGlzLmFuaW1hdGlvblNwZWVkID0gcGFyYW1zLmFuaW1hdGlvblNwZWVkIHx8IDIwMDtcclxuXHR0aGlzLmN1cmVudFNlbGVjdERhdGEgPSBwYXJhbXMuZGF0YSB8fCBudWxsO1xyXG5cdHRoaXMub25Gb2N1cyA9IHBhcmFtcy5mb2N1cyB8fCBudWxsO1xyXG5cdFxyXG4gIC8vb2JzZXJ2YWJsZXNcclxuICB0aGlzLnNlbGVjdE1vZGVsID0gdHlwZW9mIHBhcmFtcy5vcHRpb25zICE9PSdmdW5jdGlvbicgPyBrby5vYnNlcnZhYmxlQXJyYXkocGFyYW1zLm9wdGlvbnMpOiAgcGFyYW1zLm9wdGlvbnM7XHJcbiAgdGhpcy5wbGFjZWhvbGRlciA9IGtvLm9ic2VydmFibGUocGFyYW1zLnBsYWNlaG9sZGVyIHx8ICcnKTtcclxuICB0aGlzLm9uc2VsZWN0ID0gcGFyYW1zLm9uc2VsZWN0IHx8IGZ1bmN0aW9uIChpdGVtKSB7IGNvbnNvbGUubG9nKGl0ZW0gKydzZWxlY3RlZCEnKX07XHJcbiAgdGhpcy5zZWxlY3RlZCA9IGtvLm9ic2VydmFibGUodGhpcy5zZWxlY3RNb2RlbCgpWzBdKTtcclxuICB0aGlzLmlzT25lT3B0aW9uID0ga28ucHVyZUNvbXB1dGVkKGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB0aGlzLnNlbGVjdE1vZGVsKCkubGVuZ3RoIDwgMjsgLy8gbW9yZSB0aGFuIG9uZSBvcHRpb25cclxuICB9LCB0aGlzKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZmluZEVsZW1lbnQoZXZlbnQpIHtcclxuICB2YXIgcGFyZW50ID0gJChldmVudC5jdXJyZW50VGFyZ2V0KS5wYXJlbnRzKCcuanMtY3VzdG9tLXNlbGVjdCcpO1xyXG4gIHJldHVybiB7XHJcbiAgICB3cmFwcGVyOiBwYXJlbnQuZmluZCgnLmpzLWN1c3RvbS1zZWxlY3Qtd3JhcHBlcicpLFxyXG4gICAgbGF5ZXI6IHBhcmVudC5maW5kKCcuanMtY3VzdG9tLXNlbGVjdC1sYXllcicpXHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQ3VzdG9tIFNlbGVjdCBWaWV3LU1vZGVsIG1ldGhvZFxyXG4gKiBAcGFyYW0gdmlld01vZGVsXHJcbiAqIEBwYXJhbSBldmVudFxyXG4gKi9cclxuQ3VzdG9tU2VsZWN0LnByb3RvdHlwZS5zbGlkZVRvZ2dsZSA9IGZ1bmN0aW9uKHZpZXdNb2RlbCwgZXZlbnQpIHtcclxuXHQvLyBlbGVtIGluIGZvY3VzIGVtdWxhdGlvblxyXG5cdHRoaXMub25Gb2N1cyAmJiB0aGlzLm9uRm9jdXModGhpcy5jdXJlbnRTZWxlY3REYXRhKTtcclxuXHJcblx0aWYgKHRoaXMuaXNPbmVPcHRpb24oKSkge3JldHVybiBmYWxzZTt9XHJcbiAgdmFyIGVsID0gZmluZEVsZW1lbnQoZXZlbnQpO1xyXG4gICAgZWwud3JhcHBlci5zbGlkZVRvZ2dsZSh2aWV3TW9kZWwuYW5pbWF0aW9uU3BlZWQpO1xyXG4gICAgZWwubGF5ZXIudG9nZ2xlQ2xhc3MoJ2hpZGRlbicpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEN1c3RvbSBTZWxlY3QgVmlldy1Nb2RlbCBtZXRob2RcclxuICogQHBhcmFtIGl0ZW1cclxuICogQHBhcmFtIGV2ZW50XHJcbiAqL1xyXG5DdXN0b21TZWxlY3QucHJvdG90eXBlLnNlbGVjdEl0ZW0gPSBmdW5jdGlvbiAoaXRlbSwgZXZlbnQpIHtcclxuICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgdGhpcy5zZWxlY3RlZChpdGVtKTtcclxuICAvLyBydW4gaGFuZGxlclxyXG4gIHRoaXMub25zZWxlY3QoaXRlbSk7XHJcblx0Ly8gc2xpZGUgdXBcclxuICB0aGlzLnNsaWRlVG9nZ2xlKHNlbGYsIGV2ZW50KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ga28uY29tcG9uZW50cy5yZWdpc3RlcignY3VzdG9tLXNlbGVjdCcsIHtcclxuICB2aWV3TW9kZWw6IEN1c3RvbVNlbGVjdCxcclxuICB0ZW1wbGF0ZTogKFtcclxuICAgICc8ZGl2IGNsYXNzPVwiYXBpLWV4cC1jdXN0b20tc2VsZWN0IGpzLWN1c3RvbS1zZWxlY3RcIj4nLFxyXG4gICAgICAnPGRpdiBjbGFzcz1cImFwaS1leHAtY3VzdG9tLXNlbGVjdC13cmFwcGVyXCI+JyxcclxuICAgICAgICAnPHNlbGVjdCBkYXRhLWJpbmQ9XCJvcHRpb25zOiBzZWxlY3RNb2RlbCwgb3B0aW9uc1RleHQ6IFxcJ25hbWVcXCcsIHZhbHVlOiBzZWxlY3RlZFwiIGNsYXNzPVwiYXBpLWV4cC1jdXN0b20tc2VsZWN0X19maWVsZFwiIG5hbWU9XCJhcGktZXhwLW1ldGhvZFwiPjwvc2VsZWN0PicsXHJcbiAgICAgICAgJzxzcGFuIGNsYXNzPVwiYXBpLWV4cC1jdXN0b20tc2VsZWN0X19wbGFjZWhvbGRlclwiPicsXHJcbiAgICAgICAgICAnPGlucHV0IGRhdGEtYmluZD1cImV2ZW50OiB7Y2xpY2s6IHNsaWRlVG9nZ2xlfSwgYXR0cjoge3ZhbHVlOiBzZWxlY3RlZCgpLm5hbWUsIGRpc2FibGVkOiBpc09uZU9wdGlvbn1cIiB0eXBlPVwidGV4dFwiIHZhbHVlPVwiXCIgcmVhZG9ubHk9XCJcIj4nLFxyXG4gICAgICAgICAgJzxiIGRhdGEtYmluZD1cImNzczoge2hpZGRlbjogaXNPbmVPcHRpb259XCIgY2xhc3M9XCJhcGktZXhwLWN1c3RvbS1zZWxlY3RfX2NoZXZyb25cIj4mbmJzcDs8L2I+JyxcclxuICAgICAgICAnPC9zcGFuPicsXHJcbiAgICAgICAgJzx1bCBkYXRhLWJpbmQ9XCJmb3JlYWNoOiBzZWxlY3RNb2RlbFwiIGNsYXNzPVwiYXBpLWV4cC1jdXN0b20tc2VsZWN0X19saXN0IGpzLWN1c3RvbS1zZWxlY3Qtd3JhcHBlclwiPicsXHJcbiAgICAgICAgICAnPGxpIGRhdGEtYmluZD1cImNzczoge1xcJ2FjdGl2ZVxcJzogY2hlY2tlZH1cIiBjbGFzcz1cImFwaS1leHAtY3VzdG9tLXNlbGVjdF9faXRlbVwiPicsXHJcbiAgICAgICAgICAgICc8YnV0dG9uIGRhdGEtYmluZD1cImV2ZW50OiB7Y2xpY2s6ICRwYXJlbnQuc2VsZWN0SXRlbS5iaW5kKCRwYXJlbnQpfSwgdGV4dDogbmFtZSwgY3NzOiB7XFwnYWN0aXZlXFwnOiBjaGVja2VkKCl9LCBhdHRyOiB7XFwnZGF0YS12YWx1ZVxcJzogbmFtZX1cIiAgY2xhc3M9XCJhcGktZXhwLWN1c3RvbS1zZWxlY3RfX2l0ZW0tbGFiZWxcIiBocmVmPVwiI1wiPjwvYnV0dG9uPicsXHJcbiAgICAgICAgICAgIC8vICc8c3BhbiBkYXRhLWJpbmQ9XCJpZjogbGlua1wiPicsXHJcbiAgICAgICAgICAgIFx0JzxhIGRhdGEtYmluZD1cImF0dHI6IHtocmVmOiBsaW5rfSwgY3NzOiB7XFwnaGlkZGVuXFwnOiAhbGlua31cIiBjbGFzcz1cImFwaS1leHAtY3VzdG9tLXNlbGVjdF9faXRlbS1saW5rXCIgdGFyZ2V0PVwiX2JsYW5rXCI+Jm5ic3A7PC9hPicsXHJcbiAgICAgICAgICAgIC8vICc8L3NwYW4+JyxcclxuICAgICAgICAgICc8L2xpPicsXHJcbiAgICAgICAgJzwvdWw+JyxcclxuICAgICAgJzwvZGl2PicsXHJcbiAgICAgICc8ZGl2IGRhdGEtYmluZD1cImNsaWNrOiBzbGlkZVRvZ2dsZVwiIGNsYXNzPVwiYXBpLWV4cC1jdXN0b20tc2VsZWN0LWxheWVyIGpzLWN1c3RvbS1zZWxlY3QtbGF5ZXIgaGlkZGVuXCI+PC9kaXY+JyxcclxuICAgICc8L2Rpdj4nXHJcbiAgXSkuam9pbignJylcclxufSk7XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zY3JpcHRzL2FwaS1leHBsb3Jlci92Mi9jb21wb25lbnRzL2N1c3RvbVNlbGVjdC5jb21wb25lbnQuanNcbiAqKiBtb2R1bGUgaWQgPSAxNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIHNlbGY7XHJcblxyXG5mdW5jdGlvbiBjYXJkR3JvdXBDb21wb25lbnQocGFyYW1zKSB7XHJcblx0c2VsZiA9IHRoaXM7XHJcblx0dmFyIHVybCA9IHBhcmFtcy51cmw7XHJcblx0dGhpcy5maWx0ZXIgPSByZXF1aXJlKCcuLi8uLi9jb25maWcuanNvbicpO1xyXG5cdHRoaXMuY2FyZHMgPSB0aGlzLnJlbW92ZUNhcmRzKHBhcmFtcy5jYXJkcyk7XHJcblx0dGhpcy5ncm91cEluZGV4ID0gcGFyYW1zLmdyb3VwSW5kZXggfHwgMDtcclxuXHR0aGlzLmNhcmRJbmRleCA9IHBhcmFtcy5jYXJkSW5kZXg7XHJcblx0dGhpcy5zZWN0aW9uSW5kZXggPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHBhcmFtcy5zZWN0aW9uSW5kZXgpO1xyXG5cdHRoaXMuZGF0YSA9IHBhcmFtcy5kYXRhO1xyXG5cdHRoaXMuY29sb3JDbGFzcyA9IHBhcmFtcy5jb2xvckNsYXNzO1xyXG5cdHRoaXMuZ2V0TW9yZSA9IHBhcmFtcy5nZXRNb3JlO1xyXG5cdHRoaXMucmVxSWQgPSB0aGlzLnJlcUlkIHx8IHBhcmFtcy5yZXFJZDtcclxuXHR0aGlzLmNhcmRTaXplID0gcGFyYW1zLmNhcmRTaXplIHx8IHRoaXMuY2FyZHMucGFnZS5zaXplO1xyXG5cdHRoaXMucGFnZVBhcmFtID0gKHBhcmFtcy5wYWdlUGFyYW0gfHwga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh1cmwpLmZpbmQoZnVuY3Rpb24gKGl0ZW0pIHtcclxuXHRcdHJldHVybiBpdGVtLm5hbWUgPT09ICdwYWdlJztcclxuXHR9KSkudmFsdWU7XHJcblx0XHJcblx0dGhpcy5jb2xsYXBzZUlkID0gW1xyXG5cdFx0J2NhcmQtcGFuZWwtYm9keS0nLFxyXG5cdFx0dGhpcy5zZWN0aW9uSW5kZXgsXHJcblx0XHR0aGlzLmdyb3VwSW5kZXhcclxuXHRdLmpvaW4oJycpO1xyXG5cdFxyXG5cdHRoaXMuaXNBY3RpdmUgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcclxufVxyXG5cclxuY2FyZEdyb3VwQ29tcG9uZW50LnByb3RvdHlwZS5yZW1vdmVDYXJkcyA9IGZ1bmN0aW9uIChvYmopIHtcclxuXHR2YXIgZGVwcmVjYXRlZCA9IHRoaXMuZmlsdGVyLmRlcHJlY2F0ZWQ7XHJcblx0dmFyIHVud3JhcHAgPSB0aGlzLmZpbHRlci51bndyYXBwO1xyXG5cdC8vIHZhciBjdXJyZW50QXBpID0gdGhpcy5maWx0ZXJbXVxyXG5cclxuXHRkZXByZWNhdGVkLm1hcChmdW5jdGlvbiAoaXRlbSkge1xyXG5cdFx0aWYgKG9ialtpdGVtXSkge1xyXG5cdFx0XHRkZWxldGUgb2JqW2l0ZW1dXHJcblx0XHR9XHJcblx0XHRyZXR1cm4gaXRlbTtcclxuXHR9KTtcclxuXHJcblx0dW53cmFwcC5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcclxuXHRcdHZhciB2YWwgPSBvYmpbaXRlbV07XHJcblx0XHRpZiAodmFsKSB7XHJcblx0XHRcdHZhciBhcnIgPSBPYmplY3Qua2V5cyh2YWwpO1xyXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdHZhciBwcm9wID0gYXJyW2ldO1xyXG5cdFx0XHRcdG9ialtwcm9wXSA9IHZhbFtwcm9wXTtcclxuXHRcdFx0fVxyXG5cdFx0XHRkZWxldGUgb2JqW2l0ZW1dO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGl0ZW07XHJcblx0fSk7XHJcblxyXG5cdFxyXG5cdHJldHVybiBvYmo7XHJcbn07XHJcblxyXG5jYXJkR3JvdXBDb21wb25lbnQucHJvdG90eXBlLnNldEFjdGl2ZSA9IGZ1bmN0aW9uICh2bSwgZSkge1xyXG5cdGlmICghdGhpcy5pc0FjdGl2ZSkge1xyXG5cdFx0IHJldHVybiB0aGlzLmlzQWN0aXZlID0ga28ub2JzZXJ2YWJsZSh0cnVlKTtcclxuXHR9XHJcblx0dGhpcy5pc0FjdGl2ZSghdGhpcy5pc0FjdGl2ZSgpKTtcclxufTtcclxuXHJcbmNhcmRHcm91cENvbXBvbmVudC5wcm90b3R5cGUuc29ydEJ5Q29uZmlnID0gZnVuY3Rpb24gc29ydEZ1bmMoYSwgYikge1xyXG5cdHZhciBjb25maWcgPSBzZWxmLmZpbHRlcltzZWxmLnJlcUlkXTtcclxuXHR2YXIgbzEgPSBjb25maWcuZmluZChmdW5jdGlvbiAob2JqKSB7XHJcblx0XHRyZXR1cm4gb2JqLnRpdGxlID09PSBhLmtleTtcclxuXHR9KTtcclxuXHR2YXIgbzIgPSBjb25maWcuZmluZChmdW5jdGlvbiAob2JqKSB7XHJcblx0XHRyZXR1cm4gb2JqLnRpdGxlID09PSBiLmtleTtcclxuXHR9KTtcclxuXHRyZXR1cm4gY29uZmlnLmluZGV4T2YobzEpIC0gY29uZmlnLmluZGV4T2YobzIpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBrby5jb21wb25lbnRzLnJlZ2lzdGVyKCdwYW5lbC1ncm91cCcsIHtcclxuXHR2aWV3TW9kZWw6IGNhcmRHcm91cENvbXBvbmVudCxcclxuXHR0ZW1wbGF0ZTpgXHJcblx0XHQ8c2VjdGlvbiBkYXRhLWJpbmQ9XCJmb3JlYWNocHJvcDoge2RhdGE6IGNhcmRzLCBzb3J0Rm46IHNvcnRCeUNvbmZpZ31cIiBjbGFzcz1cInBhbmVsLWdyb3VwXCI+XHJcblx0XHRcdDxzZWN0aW9uIGRhdGEtYmluZD1cImNzczoge1skY29tcG9uZW50LmNvbG9yQ2xhc3NdOiB0cnVlfVwiIGNsYXNzPVwicGFuZWwgcGFuZWwtcHJpbWFyeVwiPlxyXG5cdFx0XHRcdDwhLS1wYW5lbC1oZWFkaW5nLS0+XHJcblx0XHRcdFx0PHBhbmVsLWhlYWRpbmcgcGFyYW1zPVwiZGF0YTogJGRhdGEsIGluZGV4OiAkaW5kZXgsIGNhcmRTaXplOiAkY29tcG9uZW50LmNhcmRTaXplLCBwYWdlUGFyYW06ICRjb21wb25lbnQucGFnZVBhcmFtLCBjb2xsYXBzZUlkOiAkY29tcG9uZW50LmNvbGxhcHNlSWRcIj48L3BhbmVsLWhlYWRpbmc+XHRcdFx0XHJcblx0XHRcdFx0PCEtLXBhbmVsLWJvZHktLT5cclxuXHRcdFx0XHQ8c2VjdGlvbiBkYXRhLWJpbmQ9XCJhdHRyOnsnaWQnOiAkY29tcG9uZW50LmNvbGxhcHNlSWQgKyAkaW5kZXgoKX1cIiBjbGFzcz1cInBhbmVsLWNvbGxhcHNlIGNvbGxhcHNlXCI+XHJcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicGFuZWwtYm9keVwiPlxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdDwhLS0ga28gaWY6ICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmICEkLmlzQXJyYXkodmFsdWUpKSAtLT5cclxuXHRcdFx0XHRcdFx0XHQ8b2JqZWN0LXBhbmVsLWJvZHkgcGFyYW1zPVwiZGF0YTogJGRhdGEsIGNhcmRHcm91cDogJGNvbXBvbmVudCwgcGFnZVBhcmFtOiAkY29tcG9uZW50LnBhZ2VQYXJhbVwiPjwvb2JqZWN0LXBhbmVsLWJvZHk+XHJcblx0XHRcdFx0XHRcdDwhLS0gL2tvIC0tPlxyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0PCEtLSBrbyBpZjogKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgJC5pc0FycmF5KHZhbHVlKSkgLS0+XHJcblx0XHRcdFx0XHRcdFx0PGFycmF5LXBhbmVsLWJvZHkgcGFyYW1zPVwiZGF0YTogJGRhdGEsIGNhcmRHcm91cDogJGNvbXBvbmVudFwiPjwvYXJyYXktcGFuZWwtYm9keT5cclxuXHRcdFx0XHRcdFx0PCEtLSAva28gLS0+XHJcblx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHQ8L3NlY3Rpb24+XHJcblx0XHRcdDwvc2VjdGlvbj5cclxuXHRcclxuXHRcdDwvc2VjdGlvbj5cclxuYH0pO1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc2NyaXB0cy9hcGktZXhwbG9yZXIvdjIvY29tcG9uZW50cy9wYW5lbHMvcGFuZWxHcm91cC5jb21wb25lbnQuanNcbiAqKiBtb2R1bGUgaWQgPSAxN1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdFwiZGlzY292ZXJ5LnYyLmV2ZW50cy5nZXRcIjogW1xuXHRcdHtcblx0XHRcdFwidGl0bGVcIjogXCJldmVudHNcIixcblx0XHRcdFwiaXRlbXNcIjogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0XCJ0aXRsZVwiOiBcImV2ZW50XCJcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdFwidGl0bGVcIjogXCJpbWFnZXNcIlxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0XCJ0aXRsZVwiOiBcInNhbGVzXCJcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdFwidGl0bGVcIjogXCJ2ZW51ZXNcIlxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0XCJ0aXRsZVwiOiBcImRhdGVzXCIsXG5cdFx0XHRcdFx0XCJpdGVtc1wiOiBbXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFwidGl0bGVcIjogXCJzdGFydFwiXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcInRpdGxlXCI6IFwic3RhdHVzXCJcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFwidGl0bGVcIjogXCJlbmRcIlxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdF1cblx0XHRcdFx0fVxuXHRcdFx0XVxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0XCJ0aXRsZVwiOiBcInBhZ2VcIlxuXHRcdH1cblx0XSxcblx0XCJkZXByZWNhdGVkXCI6IFtcblx0XHRcIl9saW5rc1wiXG5cdF0sXG5cdFwidW53cmFwcFwiOiBbXG5cdFx0XCJfZW1iZWRkZWRcIlxuXHRdXG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zY3JpcHRzL2FwaS1leHBsb3Jlci92Mi9jb25maWcuanNvblxuICoqIG1vZHVsZSBpZCA9IDE4XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgc2VsZjtcclxuXHJcbi8qKlxyXG4gKiBQYWdpbmF0aW9uIGVsZW1lbnRcclxuICogQHBhcmFtIHBhcmFtc1xyXG4gKi9cclxuZnVuY3Rpb24gcGFnaW5hdGlvbihwYXJhbXMpIHtcclxuXHR0aGlzLnBhZ2VQYXJhbSA9IHBhcmFtcy5wYWdlUGFyYW07XHJcblx0dGhpcy50b3RhbFBhZ2VzID0gK3BhcmFtcy50b3RhbFBhZ2VzO1xyXG5cdHRoaXMubnVtYmVyID0gK3BhcmFtcy5udW1iZXI7XHJcblx0dGhpcy5maXJzdCA9ICEhdGhpcy5udW1iZXI7XHJcblx0dGhpcy5sYXN0ID0gdGhpcy5udW1iZXIgPCB0aGlzLnRvdGFsUGFnZXMgLSAxO1xyXG5cdHRoaXMucmVxdWVzdEJ0biA9ICQoJyNhcGktZXhwLWdldC1idG4nKTtcclxuXHRzZWxmID0gdGhpcztcclxufVxyXG5cclxuLyoqXHJcbiAqIGdldCBuZXh0IHBhZ2VcclxuICovXHJcbnBhZ2luYXRpb24ucHJvdG90eXBlLmdldFByZXZQYWdlID0gZnVuY3Rpb24gKCkge1xyXG5cdHZhciB2YWwgPSB0aGlzLnBhZ2VQYXJhbSgpO1xyXG5cdHNlbGYucGFnZVBhcmFtKHZhbCA+IDAgPyB2YWwgLSAxIDogMCk7XHJcblx0c2VsZi5yZXF1ZXN0QnRuLnRyaWdnZXIoJ2NsaWNrJyk7XHJcbn07XHJcblxyXG4vKipcclxuICogZ2V0IHByZXYgcGFnZVxyXG4gKi9cclxucGFnaW5hdGlvbi5wcm90b3R5cGUuZ2V0TmV4dFBhZ2UgPSBmdW5jdGlvbiAoKSB7XHJcblx0dmFyIHZhbCA9IHRoaXMubnVtYmVyO1xyXG5cdHNlbGYucGFnZVBhcmFtKHZhbCA8IHNlbGYudG90YWxQYWdlcyAtIDEgPyB2YWwgICsgMTogdmFsKTtcclxuXHRzZWxmLnJlcXVlc3RCdG4udHJpZ2dlcignY2xpY2snKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ga28uY29tcG9uZW50cy5yZWdpc3RlcigncGFnaW5hdGlvbicsIHtcclxuXHR2aWV3TW9kZWw6IHBhZ2luYXRpb24sXHJcblx0dGVtcGxhdGU6XHJcblx0YDxzcGFuIGNsYXNzPVwibmF2aWdhdGlvbi13cmFwcGVyXCI+XHJcblx0XHQ8YnV0dG9uIGRhdGEtYmluZD1cImNsaWNrOiBnZXRQcmV2UGFnZSwgZW5hYmxlOiBmaXJzdFwiIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cIm5hdmlnYXRpb24gcHJldlwiPjwvYnV0dG9uPlxyXG5cdFx0PGJ1dHRvbiAgZGF0YS1iaW5kPVwiY2xpY2s6IGdldE5leHRQYWdlLCBlbmFibGU6IGxhc3RcIiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJuYXZpZ2F0aW9uIG5leHRcIj48L2J1dHRvbj5cclxuXHQ8L3NwYW4+YFxyXG59KTtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL2NvbXBvbmVudHMvcGFuZWxzL3BhZ2luYXRpb24uY29tcG9uZW50LmpzXG4gKiogbW9kdWxlIGlkID0gMTlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBzZWxmO1xyXG5cclxuZnVuY3Rpb24gb2JqZWN0UGFuZWxCb2R5Q29tcG9uZW50KHBhcmFtcykge1xyXG5cdHNlbGYgPSB0aGlzO1xyXG5cdHRoaXMudGl0bGUgPSBwYXJhbXMuZGF0YS5rZXk7XHJcblx0dGhpcy5kYXRhID0gcGFyYW1zLmRhdGEudmFsdWU7XHJcblx0dGhpcy5pbmRleCA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUocGFyYW1zLmluZGV4KTtcclxuXHR0aGlzLmNhcmRTaXplID0gcGFyYW1zLmNhcmRTaXplO1xyXG5cdHRoaXMucGFnZVBhcmFtID0gcGFyYW1zLnBhZ2VQYXJhbTtcclxuXHR0aGlzLmNvbGxhcHNlSWQgPSBwYXJhbXMuY29sbGFwc2VJZDtcclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IGtvLmNvbXBvbmVudHMucmVnaXN0ZXIoJ3BhbmVsLWhlYWRpbmcnLCB7XHJcblx0dmlld01vZGVsOiAgb2JqZWN0UGFuZWxCb2R5Q29tcG9uZW50LFxyXG5cdHRlbXBsYXRlOmBcclxuXHRcdDxzZWN0aW9uIGNsYXNzPVwicGFuZWwtaGVhZGluZ1wiPlxyXG5cdFx0XHQ8ZGl2IGNsYXNzPVwicGFuZWwtdGl0bGVcIj5cclxuXHRcdFx0XHRcclxuXHRcdFx0XHQ8YSBkYXRhLWJpbmQ9XCJhdHRyOiB7J2hyZWYnOiAnIycgKyBjb2xsYXBzZUlkICsgaW5kZXgsICdhcmlhLWNvbnRyb2xzJzogY29sbGFwc2VJZCArIGluZGV4fVwiIGNsYXNzPVwiYnRuIGJ0bi1pY29uXCIgdHlwZT1cImJ1dHRvblwiIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIj5cclxuXHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwiYnRuIGJ0bi1pY29uIHNoZXZyb24gd2hpdGUtc2hldnJvbi11cFwiPjwvc3Bhbj5cclxuXHRcdFx0XHRcdDxwIGRhdGEtYmluZD1cInRleHQ6IHRpdGxlXCIgY2xhc3M9XCJ0aXRsZVwiPlRpdGxlPC9wPlxyXG5cdFx0XHRcdDwvYT5cclxuXHRcdFx0XHRcclxuXHRcdFx0XHQ8IS0tIGtvIGlmOiB0aXRsZSA9PT0gJ2V2ZW50cyctLT5cclxuXHRcdFx0XHRcdDxzcGFuIGRhdGEtYmluZD1cInRleHQ6IGNhcmRTaXplXCIgY2xhc3M9XCJjb3VudGVyXCI+PC9zcGFuPlxyXG5cdFx0XHRcdDwhLS0gL2tvLS0+XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0PCEtLSBrbyBpZjogdGl0bGUgPT09ICdwYWdlJy0tPlxyXG5cdFx0XHRcdFx0PHBhZ2luYXRpb24gcGFyYW1zPVwibnVtYmVyOiBkYXRhLm51bWJlciwgdG90YWxQYWdlczogZGF0YS50b3RhbFBhZ2VzLCBwYWdlUGFyYW06IHBhZ2VQYXJhbVwiPjwvcGFnaW5hdGlvbj5cclxuXHRcdFx0XHQ8IS0tIC9rby0tPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdDwvc2VjdGlvbj5cclxuYH0pO1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc2NyaXB0cy9hcGktZXhwbG9yZXIvdjIvY29tcG9uZW50cy9wYW5lbHMvcGFuZWxIZWFkaW5nLmNvbXBvbmVudC5qc1xuICoqIG1vZHVsZSBpZCA9IDIwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgc2VsZjtcclxuXHJcbmZ1bmN0aW9uIG9iamVjdFBhbmVsQm9keUNvbXBvbmVudChwYXJhbXMpIHtcclxuXHRzZWxmID0gdGhpcztcclxuXHR0aGlzLnRpdGxlID0gcGFyYW1zLmRhdGEua2V5O1xyXG5cdHRoaXMuZGF0YSA9IHBhcmFtcy5kYXRhLnZhbHVlO1xyXG5cdHRoaXMuY2FyZEdyb3VwID0gcGFyYW1zLmNhcmRHcm91cDtcclxuXHR0aGlzLmdldE1vcmUgPSB0aGlzLmNhcmRHcm91cC5nZXRNb3JlO1xyXG5cdHRoaXMucGFnZVBhcmFtID0gcGFyYW1zLnBhZ2VQYXJhbTtcclxufVxyXG5cclxub2JqZWN0UGFuZWxCb2R5Q29tcG9uZW50LnByb3RvdHlwZS5vbkVudGVyS2V5RG93biA9IGZ1bmN0aW9uIChtb2RlbCwgZXZlbnQpIHtcclxuXHR2YXIgcGFnZU51bWJlciA9IE1hdGguYWJzKH5+bW9kZWwudmFsdWUpO1xyXG5cdHNlbGYucGFnZVBhcmFtKHBhZ2VOdW1iZXIgPCArc2VsZi5kYXRhLnRvdGFsUGFnZXMgPyBwYWdlTnVtYmVyIDogK3NlbGYuZGF0YS50b3RhbFBhZ2VzIC0gMik7XHJcblx0aWYgKGV2ZW50LmtleUNvZGUgPT09IDEzKSB7XHJcblx0XHQkKCcjYXBpLWV4cC1nZXQtYnRuJykudHJpZ2dlcignY2xpY2snKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBrby5jb21wb25lbnRzLnJlZ2lzdGVyKCdvYmplY3QtcGFuZWwtYm9keScsIHtcclxuXHR2aWV3TW9kZWw6ICBvYmplY3RQYW5lbEJvZHlDb21wb25lbnQsXHJcblx0dGVtcGxhdGU6YFxyXG5cdFx0PHVsIGRhdGEtYmluZD1cImZvcmVhY2hwcm9wOiBkYXRhXCI+XHJcblx0XHRcdDxsaSBjbGFzcz1cImNsZWFyZml4XCI+XHJcblx0XHRcdFx0PCEtLSBrbyBpZjogJGNvbXBvbmVudC50aXRsZSA9PT0gJ2ltYWdlcycgLS0+XHJcblx0XHRcdFx0XHQ8aW1nIGRhdGEtYmluZD1cImF0dHI6IHtzcmM6IHVybCwgYWx0OiAnaW1hZ2UtJyArIHJhdGlvfVwiIGFsdD1cImltZ1wiIGNsYXNzPVwiaW1nIGltZy10aHVtYm5haWxcIj5cclxuXHRcdFx0XHQ8IS0tIC9rbyAtLT5cclxuXHRcdFx0XHRcclxuXHRcdFx0XHQ8YiBjbGFzcz1cImtleVwiPlxyXG5cdFx0XHRcdFx0PHNwYW4gZGF0YS1iaW5kPVwidGV4dDogdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyA/IGtleToga2V5ICsgJzonXCI+PC9zcGFuPlxyXG5cdFx0XHRcdDwvYj5cclxuXHRcdFx0XHRcclxuXHRcdFx0XHQ8IS0tIGtvIGlmbm90OiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnIHx8ICRjb21wb25lbnQudGl0bGUgPT09ICdwYWdlJyAmJiBrZXkgPT09ICdudW1iZXInIC0tPlxyXG5cdFx0XHRcdFx0PHNwYW4gZGF0YS1iaW5kPVwidGV4dDogdmFsdWVcIiBjbGFzcz1cInZhbHVlXCI+PC9zcGFuPlxyXG5cdFx0XHRcdDwhLS0gL2tvIC0tPlxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdDwhLS0ga28gaWY6ICRjb21wb25lbnQudGl0bGUgPT09ICdwYWdlJyAmJiBrZXkgPT09ICdudW1iZXInLS0+XHJcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiZm9ybS1pbmxpbmVcIj5cclxuXHRcdFx0XHRcdFx0PGlucHV0IGlkPVwicGFnaW5hdGlvbi1pbnB1dFwiIGRhdGEtYmluZD1cInRleHRJbnB1dDogdmFsdWUsIGV2ZW50OiB7a2V5ZG93bjogJGNvbXBvbmVudC5vbkVudGVyS2V5RG93bn1cIiB0eXBlPVwidGV4dFwiIHBhdHRlcm49XCJbMC05XStcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiPlxyXG5cdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0PCEtLSAva28gLS0+XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0PCEtLSBrbyBpZjogdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAtLT5cclxuXHRcdFx0XHRcdDxidXR0b24gZGF0YS1iaW5kPVwiY2xpY2s6ICRjb21wb25lbnQuZ2V0TW9yZS5iaW5kKCRjb21wb25lbnQuY2FyZEdyb3VwLCB2YWx1ZSlcIiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWljb24gYmx1ZS1zaGV2cm9uLXJpZ2h0IHB1bGwtcmlnaHRcIj48L2J1dHRvbj5cclxuXHRcdFx0XHQ8IS0tIC9rbyAtLT5cclxuXHRcdFx0XHRcclxuXHRcdFx0PC9saT5cclxuXHRcdDwvdWw+XHJcbmB9KTtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL2NvbXBvbmVudHMvcGFuZWxzL29iamVjdFBhbmVsQm9keS5jb21wb25lbnQuanNcbiAqKiBtb2R1bGUgaWQgPSAyMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIHNlbGY7XHJcblxyXG5mdW5jdGlvbiBvYmplY3RQYW5lbEJvZHlDb21wb25lbnQocGFyYW1zKSB7XHJcblx0c2VsZiA9IHRoaXM7XHJcblx0dGhpcy50aXRsZSA9IHBhcmFtcy5kYXRhLmtleTtcclxuXHR0aGlzLmRhdGEgPSBwYXJhbXMuZGF0YS52YWx1ZTtcclxuXHR0aGlzLmNhcmRHcm91cCA9IHBhcmFtcy5jYXJkR3JvdXA7XHJcblx0dGhpcy5nZXRNb3JlID0gdGhpcy5jYXJkR3JvdXAuZ2V0TW9yZTtcclxufVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ga28uY29tcG9uZW50cy5yZWdpc3RlcignYXJyYXktcGFuZWwtYm9keScsIHtcclxuXHR2aWV3TW9kZWw6ICBvYmplY3RQYW5lbEJvZHlDb21wb25lbnQsXHJcblx0dGVtcGxhdGU6YFxyXG5cdFx0PHVsIGRhdGEtYmluZD1cImZvcmVhY2g6IGRhdGFcIiBjbGFzcz1cImxpc3QtZ3JvdXBcIj5cclxuXHRcdFx0PGxpIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtXCI+XHJcblx0XHRcdFxyXG5cdFx0XHRcdDwhLS0ga28gaWY6ICRwYXJlbnQudGl0bGUgPT09ICdpbWFnZXMnIC0tPlxyXG5cdFx0XHRcdFx0PGltZyBkYXRhLWJpbmQ9XCJhdHRyOiB7c3JjOiB1cmwsIGFsdDogJ2ltYWdlLScgKyByYXRpb31cIiBhbHQ9XCJpbWdcIiBjbGFzcz1cImltZ1wiPlxyXG5cdFx0XHRcdDwhLS0gL2tvIC0tPlxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdDwhLS0ga28gaWZub3Q6ICRwYXJlbnQudGl0bGUgPT09ICdpbWFnZXMnIC0tPlxyXG5cdFx0XHRcdDxzcGFuIGRhdGEtYmluZD1cInRleHQ6IG5hbWUgfHwgJyMnICsgJGluZGV4KClcIiBjbGFzcz1cIm5hbWUgdHJ1bmNhdGVcIj5ldmVudCBuYW1lPC9zcGFuPlxyXG5cdFx0XHRcdDwhLS0gL2tvIC0tPlxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdDwhLS0ga28gaWY6IHR5cGVvZiAkZGF0YSA9PT0gJ29iamVjdCcgLS0+XHJcblx0XHRcdFx0XHQ8YnV0dG9uIGRhdGEtYmluZD1cImNsaWNrOiAkY29tcG9uZW50LmdldE1vcmUuYmluZCgkY29tcG9uZW50LmNhcmRHcm91cClcIiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWljb24gYmx1ZS1zaGV2cm9uLXJpZ2h0IHB1bGwtcmlnaHRcIj48L2J1dHRvbj5cclxuXHRcdFx0XHQ8IS0tIC9rbyAtLT5cclxuXHRcdFx0XHRcclxuXHRcdFx0PC9saT5cclxuXHRcdDwvdWw+XHJcbmB9KTtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL2NvbXBvbmVudHMvcGFuZWxzL2FycmF5UGFuZWxCb2R5LmNvbXBvbmVudC5qc1xuICoqIG1vZHVsZSBpZCA9IDIyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9