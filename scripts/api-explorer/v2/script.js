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

	var apiKey = sessionStorage.getItem('tk-api-key') || "7elxdku9GGG5k8j0Xm8KWdANDgecHMV0"; //API Key
	
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
		var component = $('<section data-bind="component: {name: \'cardGroup\', params: params}"></section>');
		var curslick = currentSlider.slick('getSlick');
		var newData = {};
		
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
		
		var params = $.extend({}, card, {cards: newData, groupIndex: card.groupIndex + 1});
		
		ko.applyBindings({
			params: params
		}, component[0]);
		
		currentSlider.slick('slickAdd', component);
		for (var i = curslick.slideCount - 2; i > card.groupIndex; i--) {
			currentSlider.slick('slickRemove', i, false);
		}
		currentSlider.slick('slickNext', false);
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
		this.sectionIndex = params.sectionIndex;
		this.data = params.data;
		this.colorClass = params.colorClass;
		this.getMore = params.getMore;
		this.reqId = this.reqId || params.reqId;
		this.cardSize = params.cardSize || this.cards.page.size;
		
		this.pageParam = params.pageParam || url().find(function (item) {
			return item.name === 'page';
		});
		
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
		var config = self.filter[self.reqId].sortBy;
		return config.indexOf(a.key) - config.indexOf(b.key);
	};
	
	module.exports = ko.components.register('cardGroup', {
		viewModel: cardGroupComponent,
		template:`
			<section data-bind="foreachprop: {data: cards, sortFn: sortByConfig}" class="panel-group">
				<section data-bind="css: {[$component.colorClass]: true}" class="panel panel-primary">
					<!--panel-heading-->
					<section class="panel-heading">
						<div class="panel-title">
							
							<a data-bind="attr: {'href': '#' + $component.collapseId + $index(), 'aria-controls': $component.collapseId + $index()}" class="btn btn-icon" type="button" data-toggle="collapse" aria-expanded="false">
								<span class="btn btn-icon shevron white-shevron-up"></span>
								<span data-bind="text: key" class="title">Title</span>
							</a>
							
							<!-- ko if: key === 'events'-->
								<span data-bind="text: $component.cardSize" class="counter"></span>
							<!-- /ko-->
							
							<!-- ko if: key === 'page'-->
								<pagination params="number: value.number, totalPages: value.totalPages, pageParam: $component.pageParam.value"></pagination>
							<!-- /ko-->
						</div>
					</section>
					
					<!--panel-body-->
					<section data-bind="css: {'in': !$index()}, attr:{'id': $component.collapseId + $index()}" class="panel-collapse collapse">
						<div class="panel-body">
						
							<!-- ko if: (typeof value === 'object' && !$.isArray(value)) -->
								<div data-bind="foreachprop: value">
									<div class="clearfix">
										<b class="key">
											<span data-bind="text: key"></span>
										</b>
										
										<!-- ko ifnot: typeof value === 'object' -->
											<span class="key">:&nbsp;</span><span data-bind="text: value" class="value"></span>
										<!-- /ko -->
										
										<!-- ko if: typeof value === 'object' -->
											<span data-bind="text: console.log(value)"></span>
											<button data-bind="click: $component.getMore.bind($component, value)" type="button" class="btn btn-icon blue-shevron-right pull-right"></button>
										<!-- /ko -->
										
									</div>
								</div>
							<!-- /ko -->
							
							<!-- ko if: (typeof value === 'object' && $.isArray(value)) -->
								<ul data-bind="foreach: value" class="list-group">
									<li class="list-group-item">
									
										<!-- ko if: $parent.key === 'images' -->
											<img data-bind="attr: {src: url}" alt="img" style="max-width: 50px; max-height: 50px">
										<!-- /ko -->
										
										<!-- ko ifnot: $parent.key === 'images' -->
										<span data-bind="text: name || '#' + $index()" class="name truncate">event name</span>
										<!-- /ko -->
										
										<!-- ko if: typeof $data === 'object' -->
											<button data-bind="click: $component.getMore.bind($component)" type="button" class="btn btn-icon blue-shevron-right pull-right"></button>
										<!-- /ko -->
										
									</li>
								</ul>
							<!-- /ko -->
							
							<!-- ko ifnot: typeof value === 'object' -->
								<span data-bind="text: value" class="value"></span>
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
		"discovery.v2.events.get": {
			"sortBy": [
				"page",
				"events",
				"event",
				"images",
				"sales",
				"venues",
				"dates",
				"start",
				"status",
				"end"
			]
		},
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
		self = this;
		this.pageParam = params.pageParam;
		this.totalPages = +params.totalPages;
		this.number = +params.number;
		this.first = !!this.number;
		this.last = this.number < this.totalPages - 1;
		this.requestBtn = $('#api-exp-get-btn');
	}
	
	/**
	 * get next page
	 */
	pagination.prototype.getPrevPage = function () {
		var val = self.pageParam();
		self.pageParam(val > 0 ? val - 1 : 0);
		self.requestBtn.trigger('click');
	};
	
	/**
	 * get prev page
	 */
	pagination.prototype.getNextPage = function () {
		var val = self.number;
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

	function listCard(params) {
		self = this;
	}
	
	module.exports = ko.components.register('listCard', {
		viewModel: listCard,
		template:
			`<section class="panel panel-primary">
				
				<!--panel-heading-->
				<div class="panel-heading" role="tab">
					<div class="panel-title">
						<button class="btn btn-icon" type="button">
							<span class="btn btn-icon shevron white-shevron-up"></span>
							<span class="title" data-bind="text: name">Title</span>
						</button>	
						
						<!-- ko if: quantity in $data-->
							<span data-bind="text: quantity" class="counter"></span>
						<!-- /ko -->
					</div>
				</div><!--panel-heading-->
				
				<!--panel-body-->
				<div class="panel-collapse collapse" role="tabpanel">
					<div class="panel-body">
							<ul data-bind="foreach: items" class="list-group">
								<li class="list-group-item">
									<span data-bind="text: name" class="name truncate">event name</span>
									
									<!--additional-info-->
									<div class="additional-info">
										<p data-bind="text: Object.getProp($data, 'dates.start.localDate')" class="date">event date</p>
										<span data-bind="if: Object.getProp($data, '_embedded.venues[0].name')">
											<p data-bind="text: Object.getProp($data, '_embedded.venues[0].name')" class="venue">event venue</p>
										</span>
									</div><!--additional-info-->
									
									<button type="button" class="btn btn-icon blue-shevron-right"></button>
								</li>
							</ul>
					</div>
				</div><!--panel-body-->
			</section>`
	});


/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYzJkMWM0YjRkYzVmM2Y3MDM3MzQiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9hcGktZXhwbG9yZXIvdjIvVmlld01vZGVscy9tYWluLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL2N1c3RvbUJpbmRpbmdzL2ZvcmVhY2hQcm9wLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL21vZHVsZXMvYmFzZS5qcyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzL2FwaS1leHBsb3Jlci92Mi9tb2R1bGVzL2FwaWtleS5qcyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzL2FwaS1leHBsb3Jlci92Mi9tb2R1bGVzL2FqYXhTZXJ2aWNlLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL1ZpZXdNb2RlbHMvbWVudVZpZXdNb2RlbC5qcyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzL2FwaS1leHBsb3Jlci92Mi9tb2R1bGVzL2hlbHBlckZ1bmMuanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9hcGktZXhwbG9yZXIvdjIvVmlld01vZGVscy9wYXJhbXNWaWV3TW9kZWwuanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9hcGktZXhwbG9yZXIvdjIvVmlld01vZGVscy9tZXRob2RzVmlld01vZGVsLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL1ZpZXdNb2RlbHMvcmVxdWVzdHNMaXN0Vmlld01vZGVsLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL21vZHVsZXMvanNvbi1oaWdobGlnaHQuanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9hcGktZXhwbG9yZXIvdjIvbW9kdWxlcy9oaWdobGlnaHRKc29uLndvcmtlci5qcyIsIndlYnBhY2s6Ly8vRDovdGlja2V0bWFzdGVyLWFwaS1zdGFnaW5nLmdpdGh1Yi5pby9+L3dvcmtlci1sb2FkZXIvY3JlYXRlSW5saW5lV29ya2VyLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL21vZHVsZXMvc2xpZGVyLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL2NvbXBvbmVudHMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9hcGktZXhwbG9yZXIvdjIvY29tcG9uZW50cy9jdXN0b21TZWxlY3QuY29tcG9uZW50LmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL2NvbXBvbmVudHMvY2FyZEdyb3VwLmNvbXBvbmVudC5qcyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzL2FwaS1leHBsb3Jlci92Mi9jb25maWcuanNvbiIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzL2FwaS1leHBsb3Jlci92Mi9jb21wb25lbnRzL3BhZ2luYXRpb24uY29tcG9uZW50LmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL2NvbXBvbmVudHMvbGlzdENhcmQuY29tcG9uZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxnQkFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFD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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQzs7Ozs7OztBQ3pDRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQyIsImZpbGUiOiJzY3JpcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIGMyZDFjNGI0ZGM1ZjNmNzAzNzM0XG4gKiovIiwiLyoqXG4gKiBNYWluIGZpbGUgZm9yIEFwaSBFeHBscmVyIHYyLjBcbiAqIEZvciBkZXZlbG9wbWVudCBwbGVhc2UgdXNlIFdlYnBhY2sgdG8gYnVuZGxlIGFsbCBtb2R1bGVzXG4gKiBJdCBjYW4gYmUgbWFkZSB1c2luZyBucG0gc2NyaXB0cyBjbWQgLSAnd2VicGFjaydcbiAqL1xuLy8gY3VzdG9tIGJpbmRpbmdzXG5yZXF1aXJlKCcuLi9jdXN0b21CaW5kaW5ncy9mb3JlYWNoUHJvcCcpO1xuXG4vLyBNb2R1bGVzXG52YXIgYmFzZSA9IHJlcXVpcmUoJy4uL21vZHVsZXMvYmFzZScpO1xudmFyIGFwaUtleSA9IHJlcXVpcmUoJy4uL21vZHVsZXMvYXBpa2V5Jyk7XG52YXIgYWpheFNlcnZpY2UgPSByZXF1aXJlKCcuLi9tb2R1bGVzL2FqYXhTZXJ2aWNlJyk7XG5cbi8vIFZpZXcgTW9kZWxzXG52YXIgTWVudVZpZXdNb2RlbCA9IHJlcXVpcmUoJy4uL1ZpZXdNb2RlbHMvbWVudVZpZXdNb2RlbCcpO1xudmFyIFBhcmFtc1ZpZXdNb2RlbCA9IHJlcXVpcmUoJy4vcGFyYW1zVmlld01vZGVsJyk7XG52YXIgTWV0aG9kc1ZpZXdNb2RlbCA9IHJlcXVpcmUoJy4vbWV0aG9kc1ZpZXdNb2RlbCcpO1xudmFyIFJlcXVlc3RzTGlzdFZpZXdNb2RlbCA9IHJlcXVpcmUoJy4vcmVxdWVzdHNMaXN0Vmlld01vZGVsJyk7XG5cbi8vIENvbXBvbmVudHNcbnJlcXVpcmUoJy4uL2NvbXBvbmVudHMvaW5kZXgnKTtcblxuLyoqXG4gKiBNYWluIGFwcGxpY2F0aW9uIHZpZXctbW9kZWxcbiAqIEBwYXJhbSBvYmoge29iamVjdH0gZ2xvYmFsIGRhdGEgb2JqZWN0XG4gKi9cbmZ1bmN0aW9uIEFwcFZpZXdNb2RlbChvYmopIHtcbiAgdmFyIGJhc2UgPSBvYmogfHwge307XG4gIHNlbGYgPSB0aGlzO1xuICB0aGlzLmFwaUtleSA9IGFwaUtleTtcblxuICAvLyBvYnNlcnZhYmxlc1xuICB0aGlzLnNlbGVjdGVkQ2F0ZWdvcnkgPSBrby5vYnNlcnZhYmxlKCcnKTtcbiAgdGhpcy5zZWxlY3RlZE1ldGhvZCA9IGtvLm9ic2VydmFibGUoJycpO1xuICB0aGlzLnNlbGVjdGVkUGFyYW1zID0ga28ub2JzZXJ2YWJsZUFycmF5KFtdKTtcblx0dGhpcy5yZXF1ZXN0cyA9IGtvLm9ic2VydmFibGVBcnJheShbXSk7XG5cblx0Ly8gY29tcHV0ZWRcbiAgdGhpcy5VUkwgPSBrby5jb21wdXRlZCh0aGlzLmdldFVybCwgdGhpcyk7XG4gIHRoaXMuc2VuZEJ1dHRvblRleHQgPSBrby5wdXJlQ29tcHV0ZWQodGhpcy5nZXRNZXRob2ROYW1lLCB0aGlzKTtcblxuICAvLyBzdWItbW9kZWxzXG4gIHRoaXMubWVudSA9IG5ldyBNZW51Vmlld01vZGVsKGJhc2UsIHRoaXMuc2VsZWN0ZWRDYXRlZ29yeSk7XG4gIHRoaXMubWV0aG9kcyA9IG5ldyBNZXRob2RzVmlld01vZGVsKGJhc2UsIHRoaXMuc2VsZWN0ZWRDYXRlZ29yeSwgdGhpcy5zZWxlY3RlZE1ldGhvZCk7XG4gIHRoaXMucGFyYW1zID0gbmV3IFBhcmFtc1ZpZXdNb2RlbChiYXNlLCB0aGlzLnNlbGVjdGVkTWV0aG9kLCB0aGlzLnNlbGVjdGVkUGFyYW1zKTtcbiAgdGhpcy5yZXF1ZXN0c0xpc3QgPSBuZXcgUmVxdWVzdHNMaXN0Vmlld01vZGVsKHRoaXMucmVxdWVzdHMsIHRoaXMuc2VsZWN0ZWRQYXJhbXMpO1xufVxuXG4vKipcbiAqIFNlbmQgcmVxdWVzdCBtZXRob2RcbiAqL1xuQXBwVmlld01vZGVsLnByb3RvdHlwZS5vbkNsaWNrU2VuZEJ0biA9IGZ1bmN0aW9uICgpIHtcbiAgYWpheFNlcnZpY2UodGhpcy5VUkwoKSwgdGhpcy5yZXF1ZXN0cywgYmFzZSk7XG59O1xuXG4vKipcbiAqIEdldHMgY3VycmVudCBtZXRob2QgbmFtZVxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuQXBwVmlld01vZGVsLnByb3RvdHlwZS5nZXRNZXRob2ROYW1lID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5zZWxlY3RlZE1ldGhvZCgpLm1ldGhvZC50b0xvd2VyQ2FzZSgpO1xufTtcblxuLyoqXG4gKiBHZXRzIHJhdyB1cmwgZGF0YSBhcnJheVxuICogQHJldHVybnMgeypbXX1cbiAqL1xuQXBwVmlld01vZGVsLnByb3RvdHlwZS5nZXRVcmwgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBbXG4gICAgdGhpcy5zZWxlY3RlZE1ldGhvZCgpLFxuICAgIHRoaXMuYXBpS2V5LFxuICAgIHRoaXMuc2VsZWN0ZWRQYXJhbXMoKVxuICBdO1xufTtcblxuLyoqXG4gKiBHZXRzIGRlZXAgcHJvcFxuICogQHJldHVybnMgeypbXX1cbiAqL1xuT2JqZWN0LmdldFByb3AgPSBmdW5jdGlvbihvLCBzKSB7XG5cdGlmICh0eXBlb2YgbyAhPT0gJ29iamVjdCcgfHwgIXMpIHtcblx0XHRjb25zb2xlLmxvZyhvLHMpO1xuXHRcdHJldHVybjtcblx0fVxuXHRzID0gcy5yZXBsYWNlKC9cXFsoXFx3KylcXF0vZywgJy4kMScpOyAvLyBjb252ZXJ0IGluZGV4ZXMgdG8gcHJvcGVydGllc1xuXHRzID0gcy5yZXBsYWNlKC9eXFwuLywgJycpOyAgICAgICAgICAgLy8gc3RyaXAgYSBsZWFkaW5nIGRvdFxuXHR2YXIgYSA9IHMuc3BsaXQoJy4nKTtcblx0Zm9yICh2YXIgaSA9IDAsIG4gPSBhLmxlbmd0aDsgaSA8IG47ICsraSkge1xuXHRcdHZhciBrID0gYVtpXTtcblx0XHRpZiAoayBpbiBvKSB7XG5cdFx0XHRvID0gb1trXTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gbztcbn07XG5cbi8qKlxuICogQWN0aXZhdGVzIGtub2Nrb3V0LmpzXG4gKi9cbmtvLmFwcGx5QmluZGluZ3MobmV3IEFwcFZpZXdNb2RlbChiYXNlKSk7XG5cbi8qKlxuICogZXhwb3J0cyBnbG9iYWwgdmFyaWFibGVcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBiYXNlO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL1ZpZXdNb2RlbHMvbWFpbi5qc1xuICoqIG1vZHVsZSBpZCA9IDFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIiBtb2R1bGUuZXhwb3J0cyA9IGtvLmJpbmRpbmdIYW5kbGVycy5mb3JlYWNocHJvcCA9IHtcblxuXHR0cmFuc2Zvcm1PYmplY3Q6IGZ1bmN0aW9uIChwYXJhbXMpIHtcblx0XHR2YXIgcHJvcGVydGllcyA9IFtdO1xuXHRcdHZhciBvYmosIHNvcnRGbiA9IHBhcmFtcy5zb3J0Rm47XG5cblx0XHRpZiAoc29ydEZuKSB7XG5cdFx0XHRvYmogPSBwYXJhbXMuZGF0YTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0b2JqID0gcGFyYW1zO1xuXHRcdH1cblxuXHRcdGtvLnV0aWxzLm9iamVjdEZvckVhY2gob2JqLCBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuXHRcdFx0cHJvcGVydGllcy5wdXNoKHtcblx0XHRcdFx0a2V5OiBrZXksXG5cdFx0XHRcdHZhbHVlOiB2YWx1ZVxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHRpZiAoc29ydEZuKSB7XG5cdFx0XHRwcm9wZXJ0aWVzLnNvcnQoc29ydEZuKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcHJvcGVydGllcztcblx0fSxcblx0aW5pdDogZnVuY3Rpb24oZWxlbWVudCwgdmFsdWVBY2Nlc3NvciwgYWxsQmluZGluZ3NBY2Nlc3Nvciwgdmlld01vZGVsLCBiaW5kaW5nQ29udGV4dCkge1xuXHRcdHZhciBwcm9wZXJ0aWVzID0ga28ucHVyZUNvbXB1dGVkKGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBvYmogPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHZhbHVlQWNjZXNzb3IoKSk7XG5cdFx0XHRyZXR1cm4ga28uYmluZGluZ0hhbmRsZXJzLmZvcmVhY2hwcm9wLnRyYW5zZm9ybU9iamVjdChvYmopO1xuXHRcdH0pO1xuXHRcdGtvLmFwcGx5QmluZGluZ3NUb05vZGUoZWxlbWVudCwge1xuXHRcdFx0Zm9yZWFjaDogcHJvcGVydGllc1xuXHRcdH0sIGJpbmRpbmdDb250ZXh0KTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0Y29udHJvbHNEZXNjZW5kYW50QmluZGluZ3M6IHRydWVcblx0XHR9O1xuXHR9XG59O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL2N1c3RvbUJpbmRpbmdzL2ZvcmVhY2hQcm9wLmpzXG4gKiogbW9kdWxlIGlkID0gMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIGJhc2UgPSB7fTtcclxudmFyIENPTkZJR19VUkwgPSAnLi4vLi4vYXBpZGVzY3JpcHRpb24ueG1sJztcclxuXHJcbnZhciBwYXJzZURhdGEgPSBmdW5jdGlvbiAoeG1sKSB7XHJcblx0dmFyIGdsb2JhbCA9IHt9O1xyXG5cdC8vZ2V0IGFsbCBBUElzXHJcblx0dmFyIHJlc291cmNlc0VsID0gJCh4bWwpLmZpbmQoXCJyZXNvdXJjZXNcIikuZXEoMCk7XHJcblxyXG5cdC8vIHJlc291cmNlXHJcblx0JCh4bWwpXHJcblx0XHQuZmluZChcInJlc291cmNlXCIpXHJcblx0XHQuZ2V0KClcclxuXHRcdC5tYXAoZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHR2YXIgcmVzb3VyY2UgPSAkKHJlcyk7XHJcblx0XHRcdC8vIG1ldGhvZCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHR2YXIgbWV0aG9kRWxlbSA9IHJlc291cmNlLmZpbmQoXCJtZXRob2RcIikuZXEoMCk7XHJcblxyXG5cdFx0XHR2YXIgbWV0aG9kID0ge1xyXG5cdFx0XHRcdGlkIDogbWV0aG9kRWxlbS5hdHRyKFwiaWRcIiksIC8vIG1ldGhvZCBpZFxyXG5cdFx0XHRcdG5hbWUgOiBtZXRob2RFbGVtLmF0dHIoXCJhcGlnZWU6ZGlzcGxheU5hbWVcIikgfHwgbWV0aG9kRWxlbS5hdHRyKFwiaWRcIiksIC8vIG1ldGhvZCBuYW1lXHJcblx0XHRcdFx0bWV0aG9kIDogbWV0aG9kRWxlbS5hdHRyKCduYW1lJyksIC8vIEdFVCBvciBQT1NUXHJcblx0XHRcdFx0Y2F0ZWdvcnkgOiBtZXRob2RFbGVtLmZpbmQoJ1twcmltYXJ5PVwidHJ1ZVwiXScpLnRleHQoKS50cmltKCksIC8vIEFQSSBuYW1lXHJcblx0XHRcdFx0cGF0aDogcmVzb3VyY2UuYXR0cigncGF0aCcpLCAvLyBtZXRob2QgVVJMXHJcblx0XHRcdFx0YmFzZSA6IHJlc291cmNlc0VsLmF0dHIoJ2Jhc2UnKSwgLy8gbWV0aG9kIGJhc2UgbGlua1xyXG5cdFx0XHRcdGxpbmsgOiBtZXRob2RFbGVtLmZpbmQoJ2RvYycpLmVxKDApLmF0dHIoJ2FwaWdlZTp1cmwnKSwgLy8gbGluayB0byBkb2N1bWVudGF0aW9uXHJcblx0XHRcdFx0ZGVzY3JpcHRpb24gOiBtZXRob2RFbGVtLmZpbmQoJ2RvYycpLmVxKDApLnRleHQoKS50cmltKCksIC8vbWV0aG9kIGRlc2NyaXB0aW9uXHJcblx0XHRcdFx0cGFyYW1ldGVyczoge31cclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdC8vIHBhcmFtcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHRyZXNvdXJjZVxyXG5cdFx0XHRcdC5maW5kKCdwYXJhbScpXHJcblx0XHRcdFx0LmdldCgpXHJcblx0XHRcdFx0Lm1hcChmdW5jdGlvbiAocGFyKSB7XHJcblx0XHRcdFx0XHR2YXIgcGFyYW0gPSAkKHBhcik7XHJcblx0XHRcdFx0XHR2YXIgb3B0aW9ucyA9IHBhcmFtLmZpbmQoJ29wdGlvbicpO1xyXG5cdFx0XHRcdFx0dmFyIGlzU2VsZWN0ID0gISFvcHRpb25zLmxlbmd0aDtcclxuXHJcblx0XHRcdFx0XHR2YXIgcGFyYW1ldGVyID0ge1xyXG5cdFx0XHRcdFx0XHRuYW1lOiBwYXJhbS5hdHRyKCduYW1lJyksXHJcblx0XHRcdFx0XHRcdGRvYzogcGFyYW0uZmlyc3QoJ2RvYycpLnRleHQoKS50cmltKCksXHJcblx0XHRcdFx0XHRcdHN0eWxlOiBwYXJhbS5hdHRyKCdzdHlsZScpLFxyXG5cdFx0XHRcdFx0XHRyZXF1aXJlZDogcGFyYW0uYXR0cigncmVxdWlyZWQnKSxcclxuXHRcdFx0XHRcdFx0ZGVmYXVsdDogcGFyYW0uYXR0cignZGVmYXVsdCcpID09PSAnbm9uZScgJiYgaXNTZWxlY3QgPyAnJyA6IHBhcmFtLmF0dHIoJ2RlZmF1bHQnKSxcclxuXHRcdFx0XHRcdFx0c2VsZWN0OiBpc1NlbGVjdFxyXG5cdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRpZiAoaXNTZWxlY3QpIHtcclxuXHRcdFx0XHRcdFx0cGFyYW1ldGVyLm9wdGlvbnMgPSBvcHRpb25zLmdldCgpLm1hcChmdW5jdGlvbiAob3B0aW9uKSB7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRcdFx0XHRcdG5hbWU6ICQob3B0aW9uKS5hdHRyKCd2YWx1ZScpLFxyXG5cdFx0XHRcdFx0XHRcdFx0Y2hlY2tlZDogJChvcHRpb24pLmF0dHIoJ3ZhbHVlJykgPT09IHBhcmFtZXRlci5kZWZhdWx0IHx8ICQob3B0aW9uKS5hdHRyKCd2YWx1ZScpID09PSAnbm9uZScsXHJcblx0XHRcdFx0XHRcdFx0XHRsaW5rOiBmYWxzZVxyXG5cdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdG1ldGhvZC5wYXJhbWV0ZXJzW3BhcmFtZXRlci5uYW1lXSA9IHBhcmFtZXRlcjtcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdC8qKlxyXG5cdFx0XHQgKiBHbG9iYWwgb2JqIGNvbXBvc2l0aW9uXHJcbiAgICAgICAqL1xyXG5cdFx0XHQvLyBzZXQgY2F0ZWdvcnkgb2JqXHJcblx0XHRcdGdsb2JhbFttZXRob2QuY2F0ZWdvcnldID0gZ2xvYmFsW21ldGhvZC5jYXRlZ29yeV0gfHwge307XHJcblxyXG5cdFx0XHQvLyBzZXQgbWV0aG9kcyB0eXBlIG9ialxyXG5cdFx0XHRnbG9iYWxbbWV0aG9kLmNhdGVnb3J5XS5BTEwgPSBnbG9iYWxbbWV0aG9kLmNhdGVnb3J5XS5BTEwgfHwge307XHJcblx0XHRcdGdsb2JhbFttZXRob2QuY2F0ZWdvcnldW21ldGhvZC5tZXRob2RdID0gZ2xvYmFsW21ldGhvZC5jYXRlZ29yeV1bbWV0aG9kLm1ldGhvZF0gfHwge307XHJcblxyXG5cdFx0XHQvLyBzZXQgbWV0aG9kIG9ialxyXG5cdFx0XHRnbG9iYWxbbWV0aG9kLmNhdGVnb3J5XS5BTExbbWV0aG9kLmlkXSA9IG1ldGhvZDtcclxuXHRcdFx0Z2xvYmFsW21ldGhvZC5jYXRlZ29yeV1bbWV0aG9kLm1ldGhvZF1bbWV0aG9kLmlkXSA9IG1ldGhvZDtcclxuXHRcdH0pO1xyXG5cclxuXHRyZXR1cm4gZ2xvYmFsO1xyXG59O1xyXG5cclxuLy9nZXRzIGRvY3VtZW50IGZyb20gV0FETCBjb25maWd1cmF0aW9uIGZpbGVcclxudmFyIHJlYWRGcm9tV0FETCA9IGZ1bmN0aW9uICgpIHtcclxuICAkLmFqYXgoe1xyXG4gICAgdXJsOiBDT05GSUdfVVJMLFxyXG4gICAgYXN5bmMgOiBmYWxzZSxcclxuICAgIGRhdGFUeXBlOiAoJC5icm93c2VyLm1zaWUpID8gXCJ0ZXh0XCIgOiBcInhtbFwiLFxyXG4gICAgc3VjY2VzcyA6IGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuICAgICAgdmFyIHhtbDtcclxuXHJcbiAgICAgIGlmICh0eXBlb2YgcmVzcG9uc2UgPT0gXCJzdHJpbmdcIil7XHJcbiAgICAgICAgeG1sID0gbmV3IEFjdGl2ZVhPYmplY3QoXCJNaWNyb3NvZnQuWE1MRE9NXCIpO1xyXG4gICAgICAgIHhtbC5hc3luYyA9IGZhbHNlO1xyXG4gICAgICAgIHhtbC5sb2FkWE1MKHJlc3BvbnNlKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB4bWwgPSByZXNwb25zZTtcclxuICAgICAgfVxyXG5cclxuXHRcdFx0YmFzZSA9IHBhcnNlRGF0YSh4bWwpO1xyXG4gICAgfSxcclxuXHJcbiAgICBlcnJvcjogZnVuY3Rpb24oWE1MSHR0cFJlcXVlc3QsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKXtcclxuICAgICAgYWxlcnQoJ0RhdGEgQ291bGQgTm90IEJlIExvYWRlZCAtICcrIHRleHRTdGF0dXMpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59O1xyXG5yZWFkRnJvbVdBREwoKTtcclxubW9kdWxlLmV4cG9ydHMgPSBiYXNlO1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc2NyaXB0cy9hcGktZXhwbG9yZXIvdjIvbW9kdWxlcy9iYXNlLmpzXG4gKiogbW9kdWxlIGlkID0gM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIGFwaUtleSA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ3RrLWFwaS1rZXknKSB8fCBcIjdlbHhka3U5R0dHNWs4ajBYbThLV2RBTkRnZWNITVYwXCI7IC8vQVBJIEtleVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgbmFtZTogJ2FwaWtleScsXHJcbiAgc3R5bGU6ICdxdWVyeScsXHJcbiAgdmFsdWU6IGtvLm9ic2VydmFibGUoYXBpS2V5KVxyXG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zY3JpcHRzL2FwaS1leHBsb3Jlci92Mi9tb2R1bGVzL2FwaWtleS5qc1xuICoqIG1vZHVsZSBpZCA9IDRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKlxuICogQWpheCBTZXJ2aWNlXG4gKiBAcGFyYW0gdXJsXG4gKiBAcGFyYW0gbWV0aG9kXG4gKiBAcGFyYW0gY2FsbGJhY2tcbiAqL1xudmFyIGFqYXhTZXJ2aWNlID0gZnVuY3Rpb24gKHVybCwgbWV0aG9kLCBjYWxsYmFjaykge1xuICAkLmFqYXgoe1xuICAgIHR5cGU6IG1ldGhvZCxcbiAgICB1cmw6IHVybCxcbiAgICBhc3luYzogdHJ1ZSxcbiAgICBkYXRhVHlwZTogXCJqc29uXCIsXG4gICAgY29tcGxldGU6IGNhbGxiYWNrXG4gIH0pO1xufTtcblxuLyoqXG4gKiBGaWx0ZXJzIGFuZCBwcmVwYXJlcyBwYXJhbXMgcGFpcnNcbiAqIEBwYXJhbSBhcnJcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG52YXIgcHJlcGFyZVVybCA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgdmFyIHJlcGxhY2VtZW50LCB1cmwsIGRvbWFpbiwgcGF0aCwgbWV0aG9kLCBhcGlLZXksIHBhcmFtcztcblxuICBpZiAoIWFyciAmJiAhYXJyLmxlbmd0aCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBcbiAgZG9tYWluID0gYXJyWzBdLmJhc2U7XG4gIHBhdGggPSBhcnJbMF0ucGF0aDtcbiAgYXBpS2V5ID0gYXJyWzFdO1xuICBwYXJhbXMgPSBhcnJbMl0uZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgcmV0dXJuIGl0ZW0uc3R5bGUgPT09ICdxdWVyeSc7XG4gIH0pO1xuXG4gIC8vIGFyciBvZiB0ZW1wbGF0ZSBtYXJrc1xuICByZXBsYWNlbWVudCA9IHBhdGgubWF0Y2goLyhbXntdKj8pXFx3KD89XFx9KS9nbWkpO1xuXG4gIC8vIGFyciBvZiB0ZW1wbGF0ZSBwYXJhbXNcbiAgdmFyIHRlbXBsYXRlc0FyciA9IGFyclsyXS5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICByZXR1cm4gaXRlbS5zdHlsZSA9PT0gJ3RlbXBsYXRlJztcbiAgfSk7XG5cbiAgLy8gcmVwbGFjZW1lbnRcbiAgcmVwbGFjZW1lbnQuZm9yRWFjaChmdW5jdGlvbiAodmFsKSB7XG4gICAgdmFyIHBhcmFtID0gdGVtcGxhdGVzQXJyLmZpbmQoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHJldHVybiBpdGVtLm5hbWUgPT09IHZhbDtcbiAgICB9KTtcbiAgICBwYXRoID0gcGF0aC5yZXBsYWNlKCd7JysgcGFyYW0ubmFtZSArICd9JywgcGFyYW0udmFsdWUoKSB8fCBwYXJhbS5kZWZhdWx0KTtcbiAgfSk7XG5cbiAgLy8gYWRkcyBhcGlLZXkgcGFyYW1cbiAgaWYgKCFwYXJhbXNbMF0gfHwgcGFyYW1zWzBdLm5hbWUgIT09ICdhcGlrZXknKSB7XG4gICAgcGFyYW1zLnVuc2hpZnQoYXBpS2V5KTtcbiAgfVxuXG4gIC8vIHByZXBhcmVzIHBhcmFtcyBwYXJ0IG9mIHVybFxuICBwYXJhbXMgPSBwYXJhbXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICByZXR1cm4gW2l0ZW0ubmFtZSwgaXRlbS52YWx1ZSgpIHx8IGl0ZW0uZGVmYXVsdF0uam9pbignPScpO1xuICAgIH0pLmpvaW4oJyYnKTtcblxuICB1cmwgPSBbZG9tYWluLCAnLycsIHBhdGgsICc/JywgcGFyYW1zXS5qb2luKCcnKTtcblxuICByZXR1cm4gZW5jb2RlVVJJKHVybCk7XG59O1xuXG4vLyBzZW5kcyByZXF1ZXN0IHRvIGdldCB0aGUgc2Vjb25kIGNvbHVtblxudmFyIHNlbmRQcmltYXJ5UmVxdWVzdCA9IGZ1bmN0aW9uIChhcnIsIHJlcXVlc3RzLCBnbG9iYWwpIHtcbiAgdmFyIHVybCA9IHByZXBhcmVVcmwoYXJyKTtcblxuICBhamF4U2VydmljZSh1cmwsIGFyclswXS5tZXRob2QsIGZ1bmN0aW9uKHJlcywgbXNnKSB7XG5cdFx0dmFyIHJlc09iaiA9IHtcblx0XHRcdHJlcTogdXJsLFxuXHRcdFx0aW5kZXg6IHJlcXVlc3RzKCkubGVuZ3RoXG5cdFx0fTtcblxuXHRcdGlmIChtc2cgPT0gJ2Vycm9yJykge1xuXHRcdFx0dmFyIGVyciA9IHJlcyAmJlxuXHRcdFx0XHRyZXMucmVzcG9uc2VKU09OICYmXG5cdFx0XHRcdHJlcy5yZXNwb25zZUpTT04uZXJyb3JzICYmXG5cdFx0XHRcdHJlcy5yZXNwb25zZUpTT04uZXJyb3JzWzBdO1xuXG5cdFx0XHRyZXNPYmouZXJyb3IgPSB7XG5cdFx0XHRcdGNvZGU6IGVyciA/IGVyci5jb2RlOiA1MDAsXG5cdFx0XHRcdG1lc3NhZ2U6IGVyciA/IGVyci5kZXRhaWw6ICdObyByZXNwb25jZSBkYXRhISdcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0Z2xvYmFsLmxhc3RSZXNwb25zZSA9IHJlc09iai5yZXMgPSB7XG5cdFx0XHRcdGlkOiBhcnJbMF0uaWQsIC8vIG1ldGhvZCBpZCB3YXMgdXNlZFxuXHRcdFx0XHRyZXM6IHJlcy5yZXNwb25zZUpTT04gLy8gcmVzcG9uc2Vcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0Ly8gZXhwb3J0aW5nIGRhdGEgdXNpbmcgb2JzZXJ2YWJsZVxuXHRcdHJlcXVlc3RzLnVuc2hpZnQocmVzT2JqKTtcbiAgfSk7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gc2VuZFByaW1hcnlSZXF1ZXN0O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL21vZHVsZXMvYWpheFNlcnZpY2UuanNcbiAqKiBtb2R1bGUgaWQgPSA1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgaGYgPSByZXF1aXJlKCcuLi9tb2R1bGVzL2hlbHBlckZ1bmMnKTtcclxudmFyIHNlbGY7XHJcblxyXG5cclxuLyoqXHJcbiAqIE1lbnUgVmlldy1Nb2RlbFxyXG4gKiBAcGFyYW0gYmFzZVxyXG4gKiBAcGFyYW0gY2F0ZWdvcnlcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqL1xyXG5mdW5jdGlvbiBNZW51Vmlld01vZGVsKGJhc2UsIGNhdGVnb3J5KSB7XHJcbiAgc2VsZiA9IHRoaXM7XHJcbiAgdGhpcy5jYXRlZ29yeSA9IGNhdGVnb3J5O1xyXG4gIHRoaXMuY2F0ZWdvcmllcyA9IGtvLm9ic2VydmFibGVBcnJheShPYmplY3Qua2V5cyhiYXNlKS5tYXAoZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBjaGVja2VkOiBrby5vYnNlcnZhYmxlKCFpbmRleCksXHJcbiAgICAgIG5hbWU6IGl0ZW0sXHJcbiAgICAgIGxpbms6IGZhbHNlXHJcbiAgICB9XHJcbiAgfSkpO1xyXG5cclxuICAvLyBpbml0aWFsIGxvYWRcclxuICB0aGlzLnNlbGVjdENhdGVnb3J5KHRoaXMuY2F0ZWdvcmllcygpWzBdKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIE1lbnUgVmlldy1Nb2RlbCBtZXRob2RcclxuICogQHBhcmFtIGNhdGVnb3J5XHJcbiAqL1xyXG5NZW51Vmlld01vZGVsLnByb3RvdHlwZS5zZWxlY3RDYXRlZ29yeSA9IGZ1bmN0aW9uIChjYXRlZ29yeSkge1xyXG4gIHZhciBjYXRlZ29yeU5hbWUgPSBjYXRlZ29yeS5uYW1lO1xyXG4gIHNlbGYuY2F0ZWdvcnkoY2F0ZWdvcnlOYW1lKTtcclxuICBoZi5jaGVja0FjdGl2ZShzZWxmLmNhdGVnb3JpZXMsIGNhdGVnb3J5TmFtZSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1lbnVWaWV3TW9kZWw7XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zY3JpcHRzL2FwaS1leHBsb3Jlci92Mi9WaWV3TW9kZWxzL21lbnVWaWV3TW9kZWwuanNcbiAqKiBtb2R1bGUgaWQgPSA2XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJleHBvcnRzLmdldE1vZGVsQXJyYXkgPSBmdW5jdGlvbiBnZXRNb2RlbEFycmF5KHBhcmFtcykge1xyXG4gICAgdmFyIG9iaiA9IHBhcmFtcy5vYmogfHwge30sXHJcbiAgICAgICAgYXJyID0gcGFyYW1zLmFyciB8fCBbXSxcclxuICAgICAgICBwcm9wID0gcGFyYW1zLnByb3AgfHwgJ25hbWUnO1xyXG5cclxuICAgIGZvciAodmFyIGkgaW4gb2JqKSB7XHJcbiAgICAgICAgaWYgKCFvYmouaGFzT3duUHJvcGVydHkoaSkpIHsgY29udGludWU7IH1cclxuXHJcbiAgICAgICAgdmFyIGl0ZW0gPSBhcnIuZmluZChmdW5jdGlvbiAobTEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG0xLm5hbWUgPT09IG9ialtpXVtwcm9wXTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKGl0ZW0pIHsgY29udGludWU7IH1cclxuXHJcbiAgICAgICAgYXJyLnB1c2goe1xyXG4gICAgICAgICAgICBjaGVja2VkOiBrby5vYnNlcnZhYmxlKGZhbHNlKSxcclxuICAgICAgICAgICAgbmFtZTogb2JqW2ldW3Byb3BdXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXJyO1xyXG59O1xyXG5cclxuZXhwb3J0cy5jaGVja0FjdGl2ZSA9IGZ1bmN0aW9uIGNoZWNrQWN0aXZlKGtvQXJyLCBhY3RpdmVFbGVtKSB7XHJcbiAgICBpZiAoIWtvQXJyICYmICFhY3RpdmVFbGVtKSB7cmV0dXJuIGZhbHNlO31cclxuXHJcbiAgICBrb0Fycihrb0FycigpLm1hcChmdW5jdGlvbiAob2JqKSB7XHJcbiAgICAgICAgaWYgKG9iai5uYW1lID09PSBhY3RpdmVFbGVtKSB7XHJcbiAgICAgICAgICAgIG9iai5jaGVja2VkKHRydWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG9iai5jaGVja2VkKGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG9iajtcclxuICAgIH0pKTtcclxufTtcclxuXHJcbmV4cG9ydHMuaXRlcmF0ZSA9IGZ1bmN0aW9uIChvYmopIHtcclxuXHRmb3IgKHZhciBwcm9wZXJ0eSBpbiBvYmopIHtcclxuXHRcdGlmIChvYmouaGFzT3duUHJvcGVydHkocHJvcGVydHkpKSB7XHJcblx0XHRcdGlmICh0eXBlb2Ygb2JqW3Byb3BlcnR5XSA9PSBcIm9iamVjdFwiKSB7XHJcblx0XHRcdFx0aXRlcmF0ZShvYmpbcHJvcGVydHldKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZygnfCcgKyBwcm9wZXJ0eSArIFwiIHwgIFwiICsgb2JqW3Byb3BlcnR5XSArICd8Jyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn07XHJcblxyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc2NyaXB0cy9hcGktZXhwbG9yZXIvdjIvbW9kdWxlcy9oZWxwZXJGdW5jLmpzXG4gKiogbW9kdWxlIGlkID0gN1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIHNlbGY7XHJcbnZhciBiYXNlO1xyXG52YXIgaGYgPSByZXF1aXJlKCcuLi9tb2R1bGVzL2hlbHBlckZ1bmMnKTtcclxuLyoqXHJcbiAqIFBhcmFtcyBWaWV3LU1vZGVsXHJcbiAqIEBwYXJhbSByYXdcclxuICogQHBhcmFtIG1ldGhvZFxyXG4gKiBAcGFyYW0gcGFyYW1zXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxuZnVuY3Rpb24gUGFyYW1zVmlld01vZGVsKHJhdywgbWV0aG9kLCBwYXJhbXMpIHtcclxuICBiYXNlID0gcmF3O1xyXG4gIHNlbGYgPSB0aGlzO1xyXG4gIHRoaXMuYW5pbWF0aW9uU3BlZWQgPSAyMDA7XHJcblxyXG4gIC8vIG9ic2VydmFibGVzXHJcbiAgdGhpcy5tZXRob2QgPSBtZXRob2Q7XHJcbiAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7XHJcbiAgdGhpcy5pc0hpZGRlbiA9IGtvLm9ic2VydmFibGUodHJ1ZSk7XHJcbiAgdGhpcy5wYXJhbUluRm9jdXMgPSBrby5vYnNlcnZhYmxlKCcnKTtcclxuXHR0aGlzLnBhcmFtc01vZGVsID0ga28ub2JzZXJ2YWJsZUFycmF5KFtdKTtcclxuXHJcblx0Ly8gY29tcHV0ZWRcclxuXHQvLyB0aGlzLnBhcmFtc01vZGVsID0ga28uY29tcHV0ZWQodGhpcy51cGRhdGVQYXJhbXNNb2RlbCwgdGhpcyk7XHJcblx0dGhpcy51cGRhdGVWaWV3TW9kZWwoKTtcclxuXHR0aGlzLm1ldGhvZC5zdWJzY3JpYmUodGhpcy51cGRhdGVWaWV3TW9kZWwsIHRoaXMpO1xyXG5cclxuXHR0aGlzLmlzRGlydHkgPSBrby5jb21wdXRlZCh0aGlzLmNoZWNrRGlydHksIHRoaXMpO1xyXG59XHJcblxyXG5cclxuLyoqXHJcbiAqIEluaXRpYWwgYnVpbGQgb2YgU2VsZWN0IE1vZGVsXHJcbiAqL1xyXG5QYXJhbXNWaWV3TW9kZWwucHJvdG90eXBlLnVwZGF0ZVZpZXdNb2RlbCA9IGZ1bmN0aW9uICgpIHtcclxuXHR2YXIgb2JqID0gdGhpcy5tZXRob2QoKS5wYXJhbWV0ZXJzIHx8IHt9LFxyXG5cdFx0YXJyID0gW107XHJcblxyXG5cdGZvciAodmFyIGkgaW4gb2JqKSB7XHJcblx0XHRpZiAoIW9iai5oYXNPd25Qcm9wZXJ0eShpKSkge2NvbnRpbnVlO31cclxuXHJcblx0XHQvLyBjb3BpZXMgYWxsIHZhbHVlcyBmcm9tIG1vZGVsIHRvIHZpZXctbW9kZWxcclxuXHRcdHZhciB2bVBhcmFtID0gJC5leHRlbmQoe30sIG9ialtpXSk7XHJcblxyXG5cdFx0dm1QYXJhbS52YWx1ZSA9IGtvLm9ic2VydmFibGUodm1QYXJhbS52YWx1ZSB8fCAodm1QYXJhbS5zZWxlY3QgJiYgdm1QYXJhbS5kZWZhdWx0KSB8fCAnJyk7XHJcblxyXG5cdFx0Ly9hZGQgb2JzZXJ2YWJsZSBmb3Igc2VsZWN0ZWQgb3B0aW9uc1xyXG5cdFx0aWYgKHZtUGFyYW0uc2VsZWN0KSB7XHJcblx0XHRcdHZtUGFyYW0ub3B0aW9ucyA9IGtvLm9ic2VydmFibGVBcnJheShvYmpbaV0ub3B0aW9ucy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcclxuXHRcdFx0XHR2YXIgb2JqID0gJC5leHRlbmQoe30sIGl0ZW0pO1xyXG5cdFx0XHRcdG9iai5jaGVja2VkID0ga28ub2JzZXJ2YWJsZShpdGVtLmNoZWNrZWQpO1xyXG5cdFx0XHRcdHJldHVybiBvYmo7XHJcblx0XHRcdH0pKVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vICdkaXJ0eScgZmxhZyB3YXRjaGVyIGZvciBjdXJyZW50IGZpZWxkXHJcblx0XHR2bVBhcmFtLmlzRGlydHkgPSBrby5wdXJlQ29tcHV0ZWQoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAodGhpcy5zZWxlY3QpIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy52YWx1ZSgpICE9PSB0aGlzLmRlZmF1bHQgJiYgdGhpcy52YWx1ZSgpICE9PSAnbm9uZSc7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuICEhKHRoaXMudmFsdWUoKS50b1N0cmluZygpKS50cmltKCkubGVuZ3RoO1xyXG5cdFx0fSwgdm1QYXJhbSk7XHJcblxyXG5cdFx0Ly8gYWRkIGNhbGVuZGFyIGJ0biBmb3IgY3VycmVudCBmaWVsZFxyXG5cdFx0dm1QYXJhbS5oYXNDYWxlbmRhciA9IGkuc2VhcmNoKC8oZGF0ZXx0aW1lKS9nbWkpICE9IC0xO1xyXG5cclxuXHRcdC8vIGFkZCBwb3AtdXAgYnRuIGZvciBjdXJyZW50IGZpZWxkXHJcblx0XHR2bVBhcmFtLmhhc1BvcFVwID0gaS5zZWFyY2goLyhhdHRyYWN0aW9uSWR8dmVudWVJZCkvZ21pKSAhPSAtMTtcclxuXHJcblx0XHRhcnIucHVzaCh2bVBhcmFtKTtcclxuXHR9XHJcblxyXG5cdC8vIHByZXBhcmUgb3V0cHV0IGZvciByZXF1ZXN0XHJcblx0dGhpcy5wYXJhbXNNb2RlbChhcnIpO1xyXG5cdHRoaXMucGFyYW1JbkZvY3VzKHRoaXMucGFyYW1zTW9kZWwoKVswXSk7XHJcblx0dGhpcy5wcmVwYXJlVXJsUGFpcnMoYXJyLCB0aGlzLnBhcmFtcyk7XHJcblx0cmV0dXJuIGFycjtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBEaXJ0eSBwYXJhbXMgZm9ybSBvYnNlcnZhYmxlIG1ldGhvZFxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICovXHJcblBhcmFtc1ZpZXdNb2RlbC5wcm90b3R5cGUuY2hlY2tEaXJ0eSA9IGZ1bmN0aW9uICgpIHtcclxuXHR0aGlzLnByZXBhcmVVcmxQYWlycyh0aGlzLnBhcmFtc01vZGVsKCksIHRoaXMucGFyYW1zKTtcclxuXHR2YXIgZGlydHkgPSB0aGlzLnBhcmFtc01vZGVsKCkuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XHJcblx0XHRyZXR1cm4gaXRlbS5pc0RpcnR5KCkgPT09IHRydWU7XHJcblx0fSk7XHJcblx0cmV0dXJuIGRpcnR5Lmxlbmd0aCA+IDA7XHJcbn07XHJcblxyXG5cclxuLyoqXHJcbiAqIEVudGVyIGtleSBoYW5kbGVyXHJcbiAqIEBwYXJhbSBtb2RlbFxyXG4gKiBAcGFyYW0gZXZlbnRcclxuICovXHJcblBhcmFtc1ZpZXdNb2RlbC5wcm90b3R5cGUub25FbnRlcktleURvd24gPSBmdW5jdGlvbiAobW9kZWwsIGV2ZW50KSB7XHJcbiAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDEzKSB7XHJcbiAgICAkKCcjYXBpLWV4cC1nZXQtYnRuJykudHJpZ2dlcignY2xpY2snKTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNsaWRlIHRvZ2dsZSBmb3IgcGFyYW1zIGNvbnRhaW5lciBtZXRob2RcclxuICogQHBhcmFtIHZpZXdNb2RlbFxyXG4gKiBAcGFyYW0gZXZlbnRcclxuICovXHJcblBhcmFtc1ZpZXdNb2RlbC5wcm90b3R5cGUuc2xpZGVUb2dnbGUgPSBmdW5jdGlvbiAodmlld01vZGVsLCBldmVudCkge1xyXG4gICQoZXZlbnQuY3VycmVudFRhcmdldClcclxuICAgIC5wYXJlbnRzKCcuanMtc2xpZGUtY29udHJvbCcpXHJcbiAgICAuZmluZCgnLmpzLXNsaWRlLXdyYXBwZXInKVxyXG4gICAgLnNsaWRlVG9nZ2xlKHZpZXdNb2RlbC5hbmltYXRpb25TcGVlZCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICB2aWV3TW9kZWwuaXNIaWRkZW4oIXZpZXdNb2RlbC5pc0hpZGRlbigpKTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE1hY2hlcyBmb2N1c2VkIHBhcmFtXHJcbiAqIEBwYXJhbSBpdGVtXHJcbiAqL1xyXG5QYXJhbXNWaWV3TW9kZWwucHJvdG90eXBlLm9uRm9jdXMgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gIHNlbGYucGFyYW1JbkZvY3VzKGl0ZW0pO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEZpbHRlcnMgcGFyYW1zIGJ5IGRlZmluZWQgdmFsdWVcclxuICogQHBhcmFtIGFyclxyXG4gKiBAcGFyYW0ga29PYnNcclxuICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAqL1xyXG5QYXJhbXNWaWV3TW9kZWwucHJvdG90eXBlLnByZXBhcmVVcmxQYWlycyA9IGZ1bmN0aW9uIChhcnIsIGtvT2JzKSB7XHJcbiAgaWYgKCFhcnIgJiYgIWtvT2JzKSB7cmV0dXJuIGZhbHNlO31cclxuXHJcbiAgcmV0dXJuIGtvT2JzKGFyci5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgIHJldHVybiAoaXRlbS52YWx1ZSgpIHx8IGl0ZW0uZGVmYXVsdCk7XHJcbiAgfSkpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE9uIHNlbGVjdCB2YWx1ZSBoYW5kbGVyIGZvciBwYXJhbXMgc2VsZWN0XHJcbiAqIEBwYXJhbSBwYXJhbSB7b2JqZWN0fSBwYXJhbWV0ZXIgdmlldy1tb2RlbFxyXG4gKiBAcGFyYW0gb3B0aW9uIHtvYmplY3R9IG9wdGlvbiB2aWV3LW1vZGVsXHJcbiAqL1xyXG5QYXJhbXNWaWV3TW9kZWwucHJvdG90eXBlLm9uU2VsZWN0UGFyYW1WYWx1ZSA9IGZ1bmN0aW9uIChwYXJhbSwgb3B0aW9uKSB7XHJcblx0aGYuY2hlY2tBY3RpdmUocGFyYW0ub3B0aW9ucywgb3B0aW9uLm5hbWUpO1xyXG5cdHBhcmFtLnZhbHVlKG9wdGlvbi5uYW1lKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBQYXJhbXMgY2xlYXIgYnV0dG9uIGhhbmRsZXJcclxuICogQHBhcmFtIHZtIHtvYmplY3R9IHZpZXcgbW9kZWxcclxuICogQHBhcmFtIGUge29iamVjdH0gZXZlbnRcclxuICovXHJcblBhcmFtc1ZpZXdNb2RlbC5wcm90b3R5cGUub25QYXJhbXNDbGVhciA9IGZ1bmN0aW9uICh2bSwgZSkge1xyXG5cdHRoaXMudXBkYXRlVmlld01vZGVsKCk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBhcmFtc1ZpZXdNb2RlbDtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL1ZpZXdNb2RlbHMvcGFyYW1zVmlld01vZGVsLmpzXG4gKiogbW9kdWxlIGlkID0gOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIGhmID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9oZWxwZXJGdW5jJyk7XHJcbnZhciBzZWxmO1xyXG52YXIgYmFzZTtcclxudmFyIGNhdGVnb3J5O1xyXG5cclxuLyoqXHJcbiAqIE1ldGhvZHMgVmlldy1Nb2RlbFxyXG4gKiBAcGFyYW0gcmF3XHJcbiAqIEBwYXJhbSBjYXRlZ29yeVxyXG4gKiBAcGFyYW0gbWV0aG9kXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxuZnVuY3Rpb24gTWV0aG9kc1ZpZXdNb2RlbChyYXcsIGNhdGVnb3J5LCBtZXRob2QpIHtcclxuICBzZWxmID0gdGhpcztcclxuICBiYXNlID0gcmF3O1xyXG5cclxuICAvLyBvYnNlcnZhYmxlc1xyXG4gIHRoaXMuY2F0ZWdvcnkgPSBjYXRlZ29yeTtcclxuICB0aGlzLm1ldGhvZCA9IG1ldGhvZDtcclxuICB0aGlzLnRvZ2dsZVBvcFVwID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XHJcbiAgdGhpcy5yYWRpb3NNb2RlbCA9IGtvLm9ic2VydmFibGVBcnJheShbXSk7XHJcbiAgdGhpcy5tZXRob2RzVmlld01vZGVsID0ga28ub2JzZXJ2YWJsZUFycmF5KFtdKTtcclxuICB0aGlzLnVwZGF0ZU1vZGVsKHRoaXMuY2F0ZWdvcnkoKSk7XHJcbiAgdGhpcy5jYXRlZ29yeS5zdWJzY3JpYmUodGhpcy51cGRhdGVNb2RlbCwgdGhpcyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBPbiBjYXRlZ29yeSBjaGFuZ2UgaGFuZGxlclxyXG4gKiBNZXRob2RzIFZpZXctTW9kZWwgbWV0aG9kXHJcbiAqIEBwYXJhbSBjYXRlZ29yeVxyXG4gKi9cclxuTWV0aG9kc1ZpZXdNb2RlbC5wcm90b3R5cGUudXBkYXRlTW9kZWwgPSBmdW5jdGlvbiAoY2F0ZWdvcnkpIHtcclxuICAvLyBpbml0aWFsIHJhZGlvcyBtb2RlbFxyXG4gIHNlbGYudXBkYXRlUmFkaW9zTW9kZWwoYmFzZVtjYXRlZ29yeV0pO1xyXG4gIC8vIGluaXRpYWwgc2VsZWN0IG1vZGVsIChmaXJzdCBtZXRob2QgaW4gZmlyc3Qgc2VjdGlvbiBmb3Igc3RhcnQpXHJcbiAgc2VsZi51cGRhdGVTZWxlY3Qoc2VsZi5yYWRpb3NNb2RlbCgpWzBdKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBPbmNoYW5nZSBoYW5kbGVyIGZvciBSYWRpbyBidXR0b25zXHJcbiAqIEBwYXJhbSBpdGVtXHJcbiAqL1xyXG5NZXRob2RzVmlld01vZGVsLnByb3RvdHlwZS5vbmNoYW5nZVJhZGlvcyA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgLy91cGRhdGUgUmFkaW9zIE1vZGVsXHJcbiAgaGYuY2hlY2tBY3RpdmUoc2VsZi5yYWRpb3NNb2RlbCwgaXRlbS5uYW1lKTtcclxuICAvL3VwZGF0ZSBTZWxlY3QgTW9kZWxcclxuICBzZWxmLnVwZGF0ZVNlbGVjdChpdGVtKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBJbml0aWFsIGJ1aWxkIG9mIFJhZGlvcyBNb2RlbFxyXG4gKiBAcGFyYW0gcGFyYW1cclxuICogQHJldHVybnMge0FycmF5fVxyXG4gKi9cclxuTWV0aG9kc1ZpZXdNb2RlbC5wcm90b3R5cGUudXBkYXRlUmFkaW9zTW9kZWwgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICB2YXIgb2JqID0gcGFyYW0gfHwge30sXHJcbiAgICBhcnIgPSBbXTtcclxuXHJcbiAgZm9yICh2YXIgaSBpbiBvYmopIHtcclxuICAgIGlmICghb2JqLmhhc093blByb3BlcnR5KGkpKSB7IGNvbnRpbnVlOyB9XHJcbiAgICB2YXIgaXRlbSA9IHtcclxuICAgICAgY2hlY2tlZDoga28ub2JzZXJ2YWJsZShpID09PSAnQUxMJyksXHJcbiAgICAgIG5hbWU6IGlcclxuICAgIH07XHJcblxyXG4gICAgaWYgKGkgPT09ICdBTEwnKSB7XHJcbiAgICAgIGFyci51bnNoaWZ0KGl0ZW0pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBhcnIucHVzaChpdGVtKTtcclxuICAgIH1cclxuICB9XHJcblx0YXJyID0gYXJyLnNvcnQoY29tcGFyZU1ldGhvZHMpO1xyXG4gIHRoaXMucmFkaW9zTW9kZWwoYXJyKTtcclxuICByZXR1cm4gYXJyO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEluaXRpYWwgYnVpbGQgb2YgU2VsZWN0IE1vZGVsXHJcbiAqIEBwYXJhbSBpdGVtXHJcbiAqL1xyXG5NZXRob2RzVmlld01vZGVsLnByb3RvdHlwZS51cGRhdGVTZWxlY3QgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gIHZhciBvYmogPSBiYXNlW3NlbGYuY2F0ZWdvcnkoKV1baXRlbS5uYW1lXXx8IHt9LFxyXG4gICAgYXJyID0gW10sXHJcbiAgICBjb3VudCA9IDA7XHJcblxyXG4gIGZvciAodmFyIGkgaW4gb2JqKSB7XHJcbiAgICBpZiAoIW9iai5oYXNPd25Qcm9wZXJ0eShpKSkgeyBjb250aW51ZTsgfVxyXG4gICAgdmFyIHByb3BlcnR5ID0gb2JqW2ldO1xyXG5cdFx0Ly8gY29waWVzIGFsbCB2YWx1ZXMgZnJvbSBtb2RlbCB0byB2aWV3LW1vZGVsXHJcblx0XHR2YXIgdm1NZXRob2QgPSAkLmV4dGVuZCh7fSwgcHJvcGVydHkpO1xyXG5cclxuXHRcdGRlbGV0ZSB2bU1ldGhvZC5wYXJhbWV0ZXJzO1xyXG5cdFx0dm1NZXRob2QuY2hlY2tlZCA9IGtvLm9ic2VydmFibGUoIWNvdW50KTtcclxuXHJcblx0XHRhcnIucHVzaCh2bU1ldGhvZCk7XHJcblxyXG4gICAgLy8gc2V0IGdsb2JhbCBvYnNlcnZhYmxlXHJcbiAgICAhY291bnQgJiYgdGhpcy5tZXRob2QoYmFzZVtwcm9wZXJ0eS5jYXRlZ29yeV1bcHJvcGVydHkubWV0aG9kXVtwcm9wZXJ0eS5pZF0pO1xyXG5cclxuICAgIGNvdW50Kys7XHJcblxyXG4gIH1cclxuXHJcblx0dGhpcy5tZXRob2RzVmlld01vZGVsKGFycik7XHJcblx0cmV0dXJuIGFycjtcclxufTtcclxuXHJcbk1ldGhvZHNWaWV3TW9kZWwucHJvdG90eXBlLm9uU2VsZWN0TWV0aG9kID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICBoZi5jaGVja0FjdGl2ZShzZWxmLm1ldGhvZHNWaWV3TW9kZWwsIGl0ZW0ubmFtZSk7XHJcbiAgc2VsZi5tZXRob2QoYmFzZVtpdGVtLmNhdGVnb3J5XVtpdGVtLm1ldGhvZF1baXRlbS5pZF0pO1xyXG59O1xyXG5cclxuTWV0aG9kc1ZpZXdNb2RlbC5wcm90b3R5cGUub25BYm91dENsaWNrID0gZnVuY3Rpb24gKG1vZGVsLCBldmVudCkge1xyXG4gIG1vZGVsLnRvZ2dsZVBvcFVwKCFtb2RlbC50b2dnbGVQb3BVcCgpKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTb3J0IGZ1bmN0aW9uIGZvciBtZXRob2RzIGFyYXlcclxuICogQHBhcmFtIGZcclxuICogQHBhcmFtIHNcclxuICogQHJldHVybnMge251bWJlcn1cclxuICovXHJcbmZ1bmN0aW9uIGNvbXBhcmVNZXRob2RzKGYscykge1xyXG5cdHZhciBhID0gZi5uYW1lLnRvVXBwZXJDYXNlKCk7XHJcblx0dmFyIGIgPSBzLm5hbWUudG9VcHBlckNhc2UoKTtcclxuXHJcblx0aWYgKGEgPT09IGIpIHtyZXR1cm4gMDt9XHJcblx0aWYgKGEgPT09ICdBTEwnIHx8XHJcblx0XHQoYSA9PT0gJ0dFVCcgJiYgKGIgPT09ICdQT1NUJyB8fCBiID09PSAnUFVUJyB8fCBiID09PSAnREVMRVRFJykpIHx8XHJcblx0XHQoYSA9PT0gJ1BPU1QnICYmIChiID09PSAnUFVUJyB8fCBiID09PSAnREVMRVRFJykpIHx8XHJcblx0XHQoYSA9PT0gJ1BVVCcgJiYgYiA9PT0gJ0RFTEVURScpKSB7XHJcblx0XHRyZXR1cm4gLTE7XHJcblx0fVxyXG5cdHJldHVybiAxO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1ldGhvZHNWaWV3TW9kZWw7XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zY3JpcHRzL2FwaS1leHBsb3Jlci92Mi9WaWV3TW9kZWxzL21ldGhvZHNWaWV3TW9kZWwuanNcbiAqKiBtb2R1bGUgaWQgPSA5XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIganNvbkhpZ2hsaWdodCA9IHJlcXVpcmUoJy4vLi4vbW9kdWxlcy9qc29uLWhpZ2hsaWdodCcpO1xudmFyIHNlbGY7XG52YXIgc2xpZGVyID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9zbGlkZXInKTtcblxuZnVuY3Rpb24gUmVxdWVzdHNMaXN0Vmlld01vZGVsKHJlcXVlc3RzLCB1cmwpIHtcblx0dGhpcy51cmwgPSB1cmw7XG5cdHNlbGYgPSB0aGlzO1xuXHR0aGlzLmNvbG9ycyA9IFtcblx0XHQnY29sdW1uLWNvbG9yLTEnLFxuXHRcdCdjb2x1bW4tY29sb3ItMicsXG5cdFx0J2NvbHVtbi1jb2xvci0zJyxcblx0XHQnY29sdW1uLWNvbG9yLTQnLFxuXHRcdCdjb2x1bW4tY29sb3ItNScsXG5cdFx0J2NvbHVtbi1jb2xvci02Jyxcblx0XHQnY29sdW1uLWNvbG9yLTcnLFxuXHRcdCdjb2x1bW4tY29sb3ItOCcsXG5cdFx0J2NvbHVtbi1jb2xvci05Jyxcblx0XHQnY29sdW1uLWNvbG9yLTEwJyxcblx0XHQnY29sdW1uLWNvbG9yLTExJyxcblx0XHQnY29sdW1uLWNvbG9yLTEyJ1xuXHRdO1xuXHR0aGlzLnJlcXVlc3RzID0gcmVxdWVzdHM7XG5cdHRoaXMuaXNBY3RpdmVUYWIgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcblx0dGhpcy52aWV3TW9kZWwgPSBrby5vYnNlcnZhYmxlQXJyYXkoW10pO1xuXHR0aGlzLmNsZWFyQnRuSXNWaXNpYmxlID0ga28uY29tcHV0ZWQodGhpcy5faXNWaXNpYmxlLCB0aGlzKTtcblx0dGhpcy5yZXF1ZXN0cy5zdWJzY3JpYmUodGhpcy51cGRhdGVNb2RlbCwgdGhpcyk7XG59XG5cbi8qKlxuICogVXBkYXRlIFZpZXdtb2RlbCBvZiByZXF1ZXN0IGxpc3RcbiAqIEBwYXJhbSBhcnJcbiAqL1xuUmVxdWVzdHNMaXN0Vmlld01vZGVsLnByb3RvdHlwZS51cGRhdGVNb2RlbCA9IGZ1bmN0aW9uIChhcnIpIHtcblx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcblx0dmFyIG5ld01vZGVsID0gdGhpcy5yZXF1ZXN0cygpXG5cdFx0Lm1hcChmdW5jdGlvbiAob2JqKSB7XG5cdFx0XHR2YXIgaXRlbSA9ICAkLmV4dGVuZCh7fSwgb2JqLCB7XG5cdFx0XHRcdGNvbG9yOiBzZWxmLmNvbG9yc1tvYmouaW5kZXggJSBzZWxmLmNvbG9ycy5sZW5ndGhdLFxuXHRcdFx0XHRhY3RpdmU6IGtvLm9ic2VydmFibGUoZmFsc2UpLFxuXHRcdFx0XHRyZXNIVE1MOiBrby5vYnNlcnZhYmxlKCcnKVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gaXRlbTtcblx0XHR9KTtcblx0c2xpZGVyLnJlbW92ZShzZWxmLnZpZXdNb2RlbCgpLmxlbmd0aCk7XG5cdHNlbGYudmlld01vZGVsKG5ld01vZGVsKTtcblx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0c2xpZGVyLnNldChzZWxmLnZpZXdNb2RlbCgpLmxlbmd0aCk7XG5cdFx0JCgnI3Nob3ctZGV0YWlscy0wJykudHJpZ2dlcignY2xpY2snKTtcblx0fSwgMTApO1xufTtcblxuLyoqXG4gKiBnZXQgZGV0YWlsc1xuICogQHBhcmFtIGRhdGFcbiAqL1xuUmVxdWVzdHNMaXN0Vmlld01vZGVsLnByb3RvdHlwZS5nZXRNb3JlID0gZnVuY3Rpb24gKGRhdGEpIHtcblx0dmFyIGNhcmQgPSB0aGlzO1xuXHR2YXIgY3VycmVudFNsaWRlciA9ICQoJyNzbGlkZXItJyArIGNhcmQuc2VjdGlvbkluZGV4KTtcblx0dmFyIGNvbXBvbmVudCA9ICQoJzxzZWN0aW9uIGRhdGEtYmluZD1cImNvbXBvbmVudDoge25hbWU6IFxcJ2NhcmRHcm91cFxcJywgcGFyYW1zOiBwYXJhbXN9XCI+PC9zZWN0aW9uPicpO1xuXHR2YXIgY3Vyc2xpY2sgPSBjdXJyZW50U2xpZGVyLnNsaWNrKCdnZXRTbGljaycpO1xuXHR2YXIgbmV3RGF0YSA9IHt9O1xuXHRcblx0Zm9yICh2YXIga2V5IGluIGRhdGEpIHtcblx0XHRpZiAoIWRhdGEuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXHRcdHZhciB2YWwgPSBkYXRhW2tleV07XG5cdFx0aWYgKHR5cGVvZiB2YWwgIT09ICdvYmplY3QnKSB7XG5cdFx0XHRuZXdEYXRhW2RhdGEudHlwZSB8fCBPYmplY3Qua2V5cyhkYXRhKVswXV0gPSBuZXdEYXRhW2RhdGEudHlwZSB8fCBPYmplY3Qua2V5cyhkYXRhKVswXV0gfHwge307XG5cdFx0XHRuZXdEYXRhW2RhdGEudHlwZSB8fCBPYmplY3Qua2V5cyhkYXRhKVswXV1ba2V5XSA9IHZhbDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bmV3RGF0YVtrZXldID0gdmFsO1xuXHRcdH1cblx0fVxuXHRcblx0dmFyIHBhcmFtcyA9ICQuZXh0ZW5kKHt9LCBjYXJkLCB7Y2FyZHM6IG5ld0RhdGEsIGdyb3VwSW5kZXg6IGNhcmQuZ3JvdXBJbmRleCArIDF9KTtcblx0XG5cdGtvLmFwcGx5QmluZGluZ3Moe1xuXHRcdHBhcmFtczogcGFyYW1zXG5cdH0sIGNvbXBvbmVudFswXSk7XG5cdFxuXHRjdXJyZW50U2xpZGVyLnNsaWNrKCdzbGlja0FkZCcsIGNvbXBvbmVudCk7XG5cdGZvciAodmFyIGkgPSBjdXJzbGljay5zbGlkZUNvdW50IC0gMjsgaSA+IGNhcmQuZ3JvdXBJbmRleDsgaS0tKSB7XG5cdFx0Y3VycmVudFNsaWRlci5zbGljaygnc2xpY2tSZW1vdmUnLCBpLCBmYWxzZSk7XG5cdH1cblx0Y3VycmVudFNsaWRlci5zbGljaygnc2xpY2tOZXh0JywgZmFsc2UpO1xufTtcblxuLyoqXG4gKiBWaXNpYmlsaXR5IGZsYWcgZm9yIENsZWFyIGJ0blxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKiBAcHJpdmF0ZVxuICovXG5SZXF1ZXN0c0xpc3RWaWV3TW9kZWwucHJvdG90eXBlLl9pc1Zpc2libGUgPSBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiB0aGlzLnJlcXVlc3RzKCkubGVuZ3RoID4gMDtcbn07XG5cbi8qKlxuICogQ2xlYXIgcmVxdWVzdHN0cyBsaXN0IGhhbmRsZXJcbiAqIEBwYXJhbSB2bVxuICogQHBhcmFtIGV2ZW50XG4gKi9cblJlcXVlc3RzTGlzdFZpZXdNb2RlbC5wcm90b3R5cGUub25DbGVhclJlcXVlc3RzID0gZnVuY3Rpb24gKHZtLCBldmVudCkge1xuXHR0aGlzLnJlcXVlc3RzKFtdKTtcbn07XG5cbi8qKlxuICogRGV0YWlscyB0b2dnbGUgaGFuZGxlclxuICogQHBhcmFtIHZtXG4gKiBAcGFyYW0gZXZlbnRcbiAqL1xuUmVxdWVzdHNMaXN0Vmlld01vZGVsLnByb3RvdHlwZS5nZXREZXRhaWxzID0gZnVuY3Rpb24gKHZtLCBldmVudCkge1xuXHRpZiAoIXRoaXMucmVzSFRNTCgpLmxlbmd0aCkge1xuXHRcdGpzb25IaWdobGlnaHQodGhpcy5yZXNIVE1MLCB0aGlzLnJlcyk7XG5cdH1cblx0dGhpcy5hY3RpdmUoIXRoaXMuYWN0aXZlKCkpO1xufTtcblxuUmVxdWVzdHNMaXN0Vmlld01vZGVsLnByb3RvdHlwZS5nZXRTdHIgPSBmdW5jdGlvbiAocywgaSkge1xuXHR2YXIgc3RyID0gcztcblx0dmFyIGkxID0gaSA/IGkoKSA6ICcnO1xuXHRyZXR1cm4gW1xuXHRcdHN0cixcblx0XHRpMVxuXHRdLmpvaW4oJy0nKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUmVxdWVzdHNMaXN0Vmlld01vZGVsO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL1ZpZXdNb2RlbHMvcmVxdWVzdHNMaXN0Vmlld01vZGVsLmpzXG4gKiogbW9kdWxlIGlkID0gMTBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBXb3JrZXIgPSByZXF1aXJlKCcuL2hpZ2hsaWdodEpzb24ud29ya2VyLmpzJyk7IC8vIEpzb24tZm9ybWF0dGVyIHdvcmtlclxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JzZXJ2YWJsZSwgY29kZSkge1xyXG5cdHZhciBhbmltVGltZSA9IDEwMDtcclxuXHR2YXIgd29ya2VyID0gbmV3IFdvcmtlcjtcclxuXHJcblx0d29ya2VyLm9ubWVzc2FnZSA9IGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0b2JzZXJ2YWJsZShldmVudC5kYXRhKTtcclxuXHJcblx0XHQkKGRvY3VtZW50KVxyXG5cdFx0XHQub24oJ2NsaWNrIHRvdWNoJywgJy50bS1jb2RlLWNvbnRhaW5lciAuZXhwYW5kZWQnLCBmdW5jdGlvbiBqc29uQ29kZUNvbnRhaW5lckV4cGFuZGVkKGUpIHtcclxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHRcdFx0XHR2YXIgJHNlbGYgPSAkKHRoaXMpO1xyXG5cdFx0XHRcdCRzZWxmXHJcblx0XHRcdFx0XHQucGFyZW50KClcclxuXHRcdFx0XHRcdC5maW5kKCc+dWwnKVxyXG5cdFx0XHRcdFx0LnNsaWRlVXAoYW5pbVRpbWUsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHQkc2VsZi5hZGRDbGFzcygnY29sbGFwc2VkJyk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0fSlcclxuXHRcdFx0Lm9uKCdjbGljayB0b3VjaCcsICcudG0tY29kZS1jb250YWluZXIgLmV4cGFuZGVkLmNvbGxhcHNlZCcsIGZ1bmN0aW9uIGpzb25Db2RlQ29udGFpbmVyQ29sbGFwc2VkKGUpIHtcclxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHRcdFx0XHR2YXIgJHNlbGYgPSAkKHRoaXMpO1xyXG5cdFx0XHRcdCRzZWxmXHJcblx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNlZCcpXHJcblx0XHRcdFx0XHQucGFyZW50KClcclxuXHRcdFx0XHRcdC5maW5kKCc+dWwnKVxyXG5cdFx0XHRcdFx0LnNsaWRlRG93bihhbmltVGltZSwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdCRzZWxmXHJcblx0XHRcdFx0XHRcdFx0LnJlbW92ZUNsYXNzKCdjb2xsYXBzZWQnKVxyXG5cdFx0XHRcdFx0XHRcdC5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0fSlcclxuXHR9O1xyXG5cdHdvcmtlci5vbmVycm9yID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRjb25zb2xlLmxvZyhldmVudCk7XHJcblx0fTtcclxuXHJcblx0d29ya2VyLnBvc3RNZXNzYWdlKGNvZGUpO1xyXG59O1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc2NyaXB0cy9hcGktZXhwbG9yZXIvdjIvbW9kdWxlcy9qc29uLWhpZ2hsaWdodC5qc1xuICoqIG1vZHVsZSBpZCA9IDExXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gcmVxdWlyZShcIiEhRDpcXFxcdGlja2V0bWFzdGVyLWFwaS1zdGFnaW5nLmdpdGh1Yi5pb1xcXFxub2RlX21vZHVsZXNcXFxcd29ya2VyLWxvYWRlclxcXFxjcmVhdGVJbmxpbmVXb3JrZXIuanNcIikoXCIvKioqKioqLyAoZnVuY3Rpb24obW9kdWxlcykgeyAvLyB3ZWJwYWNrQm9vdHN0cmFwXFxuLyoqKioqKi8gXFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxcbi8qKioqKiovIFxcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XFxuLyoqKioqKi9cXG4vKioqKioqLyBcXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxcbi8qKioqKiovIFxcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcXG4vKioqKioqL1xcbi8qKioqKiovIFxcdFxcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxcbi8qKioqKiovIFxcdFxcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxcbi8qKioqKiovIFxcdFxcdFxcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xcbi8qKioqKiovXFxuLyoqKioqKi8gXFx0XFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcXG4vKioqKioqLyBcXHRcXHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XFxuLyoqKioqKi8gXFx0XFx0XFx0ZXhwb3J0czoge30sXFxuLyoqKioqKi8gXFx0XFx0XFx0aWQ6IG1vZHVsZUlkLFxcbi8qKioqKiovIFxcdFxcdFxcdGxvYWRlZDogZmFsc2VcXG4vKioqKioqLyBcXHRcXHR9O1xcbi8qKioqKiovXFxuLyoqKioqKi8gXFx0XFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXFxuLyoqKioqKi8gXFx0XFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XFxuLyoqKioqKi9cXG4vKioqKioqLyBcXHRcXHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXFxuLyoqKioqKi8gXFx0XFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XFxuLyoqKioqKi9cXG4vKioqKioqLyBcXHRcXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxcbi8qKioqKiovIFxcdFxcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcXG4vKioqKioqLyBcXHR9XFxuLyoqKioqKi9cXG4vKioqKioqL1xcbi8qKioqKiovIFxcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXFxuLyoqKioqKi8gXFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcXG4vKioqKioqL1xcbi8qKioqKiovIFxcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXFxuLyoqKioqKi8gXFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcXG4vKioqKioqL1xcbi8qKioqKiovIFxcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXFxuLyoqKioqKi8gXFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXFxcIlxcXCI7XFxuLyoqKioqKi9cXG4vKioqKioqLyBcXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcXG4vKioqKioqLyBcXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcXG4vKioqKioqLyB9KVxcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXFxuLyoqKioqKi8gKFtcXG4vKiAwICovXFxuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XFxuXFxuXFx0LyoqXFxyXFxuXFx0ICogQ29kZSBmb3JtYXQgd2ViLXdvcmtlclxcclxcblxcdCAqIEBwYXJhbSBldmVudFxcclxcblxcdCAqL1xcclxcblxcdC8vIHZhciBoaWdobGlnaHRKc29uKClcXHJcXG5cXHR2YXIgaGlnaGxpZ2h0SnNvbiA9IF9fd2VicGFja19yZXF1aXJlX18oMSk7XFxyXFxuXFx0XFxyXFxuXFx0b25tZXNzYWdlID0gZnVuY3Rpb24oZXZlbnQpIHtcXHJcXG5cXHQgIHZhciBjb2RlID0gZXZlbnQuZGF0YTtcXHJcXG5cXHQgIC8vIGltcG9ydFNjcmlwdHMoJ2pzb24tcGFyc2UuanMnKTtcXHJcXG5cXHQgIHZhciByZXN1bHQgPSBoaWdobGlnaHRKc29uKGNvZGUsIHtleHBhbmRlZDogdHJ1ZX0pO1xcclxcblxcdCAgLy8gdmFyIHJlc3VsdCA9SlNPTi5zdHJpbmdpZnkoY29kZSk7XFxyXFxuXFx0ICBwb3N0TWVzc2FnZShyZXN1bHQpO1xcclxcblxcdH07XFxyXFxuXFxuXFxuLyoqKi8gfSxcXG4vKiAxICovXFxuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XFxuXFxuXFx0dmFyIHByZWZpeCA9ICd0bS1jb2RlJztcXHJcXG5cXHRcXHJcXG5cXHR2YXIgZ2V0RXhwYW5kZXJDbGFzc2VzID0gZnVuY3Rpb24gKGV4cGFuZGVkKSB7XFxyXFxuXFx0XFx0aWYgKCFleHBhbmRlZCkge1xcclxcblxcdFxcdFxcdHJldHVybiAnZXhwYW5kZWQgY29sbGFwc2VkIGhpZGRlbic7XFxyXFxuXFx0XFx0fVxcclxcblxcdFxcdHJldHVybiAnZXhwYW5kZWQnO1xcclxcblxcdH07XFxyXFxuXFx0XFxyXFxuXFx0dmFyIGVuY29kZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xcclxcblxcdFxcdHJldHVybiBbJzxzcGFuPicsIHZhbHVlLCAnPC9zcGFuPiddLmpvaW4oJycpO1xcclxcblxcdH07XFxyXFxuXFx0XFxyXFxuXFx0dmFyIGNyZWF0ZUVsZW1lbnQgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSwgdHlwZSwgZXhwYW5kZXJDbGFzc2VzKSB7XFxyXFxuXFx0XFx0dmFyIGtsYXNzID0gJ29iamVjdCcsXFxyXFxuXFx0XFx0XFx0b3BlbiA9ICd7JyxcXHJcXG5cXHRcXHRcXHRjbG9zZSA9ICd9JztcXHJcXG5cXHRcXHJcXG5cXHRcXHRpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcXHJcXG5cXHRcXHRcXHRrbGFzcyA9ICdhcnJheSc7XFxyXFxuXFx0XFx0XFx0b3BlbiA9ICdbJztcXHJcXG5cXHRcXHRcXHRjbG9zZSA9ICddJztcXHJcXG5cXHRcXHR9XFxyXFxuXFx0XFxyXFxuXFx0XFx0aWYgKHZhbHVlID09PSBudWxsKSB7XFxyXFxuXFx0XFx0XFx0cmV0dXJuIFtcXHJcXG5cXHRcXHRcXHRcXHQnPGxpPicsXFxyXFxuXFx0XFx0XFx0XFx0XFx0JzxzcGFuIGNsYXNzPVxcXCJrZXlcXFwiPlxcXCInLCBlbmNvZGUoa2V5KSwgJ1xcXCI6IDwvc3Bhbj4nLFxcclxcblxcdFxcdFxcdFxcdFxcdCc8c3BhbiBjbGFzcz1cXFwibnVsbFxcXCI+XFxcIicsIGVuY29kZSh2YWx1ZSksICdcXFwiPC9zcGFuPicsXFxyXFxuXFx0XFx0XFx0XFx0JzwvbGk+J1xcclxcblxcdFxcdFxcdF0uam9pbignJyk7XFxyXFxuXFx0XFx0fVxcclxcblxcdFxcclxcblxcdFxcdGlmICh0eXBlID09ICdvYmplY3QnKSB7XFxyXFxuXFx0XFx0XFx0cmV0dXJuIFtcXHJcXG5cXHRcXHRcXHRcXHQnPGxpPicsXFxyXFxuXFx0XFx0XFx0XFx0XFx0JzxzcGFuIGNsYXNzPVxcXCInLCBleHBhbmRlckNsYXNzZXMsICdcXFwiPjwvc3Bhbj4nLFxcclxcblxcdFxcdFxcdFxcdFxcdCc8c3BhbiBjbGFzcz1cXFwia2V5XFxcIj5cXFwiJywgZW5jb2RlKGtleSksICdcXFwiOiA8L3NwYW4+ICcsXFxyXFxuXFx0XFx0XFx0XFx0XFx0JzxzcGFuIGNsYXNzPVxcXCJvcGVuXFxcIj4nLCBvcGVuLCAnPC9zcGFuPiAnLFxcclxcblxcdFxcdFxcdFxcdFxcdCc8dWwgY2xhc3M9XFxcIicsIGtsYXNzLCAnXFxcIj4nLFxcclxcblxcdFxcdFxcdFxcdFxcdFxcdGpzb24yaHRtbCh2YWx1ZSwgZXhwYW5kZXJDbGFzc2VzKSxcXHJcXG5cXHRcXHRcXHRcXHRcXHQnPC91bD4nLFxcclxcblxcdFxcdFxcdFxcdFxcdCc8c3BhbiBjbGFzcz1cXFwiY2xvc2VcXFwiPicsIGNsb3NlLCAnPC9zcGFuPicsXFxyXFxuXFx0XFx0XFx0XFx0JzwvbGk+J1xcclxcblxcdFxcdFxcdF0uam9pbignJyk7XFxyXFxuXFx0XFx0fVxcclxcblxcdFxcclxcblxcdFxcdGlmICh0eXBlID09ICdudW1iZXInIHx8IHR5cGUgPT0gJ2Jvb2xlYW4nKSB7XFxyXFxuXFx0XFx0XFx0cmV0dXJuIFtcXHJcXG5cXHRcXHRcXHRcXHQnPGxpPicsXFxyXFxuXFx0XFx0XFx0XFx0XFx0JzxzcGFuIGNsYXNzPVxcXCJrZXlcXFwiPlxcXCInLCBlbmNvZGUoa2V5KSwgJ1xcXCI6IDwvc3Bhbj4nLFxcclxcblxcdFxcdFxcdFxcdFxcdCc8c3BhbiBjbGFzcz1cXFwiJywgdHlwZSwgJ1xcXCI+JywgZW5jb2RlKHZhbHVlKSwgJzwvc3Bhbj4nLFxcclxcblxcdFxcdFxcdFxcdCc8L2xpPidcXHJcXG5cXHRcXHRcXHRdLmpvaW4oJycpO1xcclxcblxcdFxcdH1cXHJcXG5cXHRcXHRyZXR1cm4gW1xcclxcblxcdFxcdFxcdCc8bGk+JyxcXHJcXG5cXHRcXHRcXHRcXHQnPHNwYW4gY2xhc3M9XFxcImtleVxcXCI+XFxcIicsIGVuY29kZShrZXkpLCAnXFxcIjogPC9zcGFuPicsXFxyXFxuXFx0XFx0XFx0XFx0JzxzcGFuIGNsYXNzPVxcXCInLCB0eXBlLCAnXFxcIj5cXFwiJywgZW5jb2RlKHZhbHVlKSwgJ1xcXCI8L3NwYW4+JyxcXHJcXG5cXHRcXHRcXHQnPC9saT4nXFxyXFxuXFx0XFx0XS5qb2luKCcnKTtcXHJcXG5cXHR9O1xcclxcblxcdFxcclxcblxcdHZhciBqc29uMmh0bWwgPSBmdW5jdGlvbiAoanNvbiwgZXhwYW5kZXJDbGFzc2VzKSB7XFxyXFxuXFx0XFx0dmFyIGh0bWwgPSAnJztcXHJcXG5cXHRcXHRmb3IgKHZhciBrZXkgaW4ganNvbikge1xcclxcblxcdFxcdFxcdGlmICghanNvbi5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XFxyXFxuXFx0XFx0XFx0XFx0Y29udGludWU7XFxyXFxuXFx0XFx0XFx0fVxcclxcblxcdFxcclxcblxcdFxcdFxcdGh0bWwgPSBbaHRtbCwgY3JlYXRlRWxlbWVudChrZXksIGpzb25ba2V5XSwgdHlwZW9mIGpzb25ba2V5XSwgZXhwYW5kZXJDbGFzc2VzKV0uam9pbignJyk7XFxyXFxuXFx0XFx0fVxcclxcblxcdFxcdHJldHVybiBodG1sO1xcclxcblxcdH07XFxyXFxuXFx0XFxyXFxuXFx0dmFyIGdldEpzb25WaWV3ZXIgPSBmdW5jdGlvbiAoZGF0YSwgb3B0aW9ucykge1xcclxcblxcdFxcdHRyeSB7XFxyXFxuXFx0XFx0XFx0cmV0dXJuIFtcXHJcXG5cXHRcXHRcXHRcXHQnPHVsIGNsYXNzPVxcXCInLCBwcmVmaXgsICctY29udGFpbmVyXFxcIj4nLFxcclxcblxcdFxcdFxcdFxcdFxcdGpzb24yaHRtbChbSlNPTi5wYXJzZShkYXRhKV0sIGdldEV4cGFuZGVyQ2xhc3NlcyhvcHRpb25zLmV4cGFuZGVkKSksXFxyXFxuXFx0XFx0XFx0XFx0JzwvdWw+J1xcclxcblxcdFxcdFxcdF0uam9pbignJyk7XFxyXFxuXFx0XFx0fSBjYXRjaCAoZSkge1xcclxcblxcdFxcdFxcdHJldHVybiBbXFxyXFxuXFx0XFx0XFx0XFx0JzxkaXYgY2xhc3M9XFxcIicsIHByZWZpeCwgJy1lcnJvclxcXCIgPicsIGUudG9TdHJpbmcoKSwgJyA8L2Rpdj4nXFxyXFxuXFx0XFx0XFx0XS5qb2luKCcnKTtcXHJcXG5cXHRcXHR9XFxyXFxuXFx0fTtcXHJcXG5cXHRcXHJcXG5cXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRhdGEsIG9wdCkge1xcclxcblxcdFxcdHZhciBqc29uID0gJyc7XFxyXFxuXFx0XFx0dmFyIG9wdGlvbnMgPSBvcHQgfHwge2V4cGFuZGVkOiB0cnVlfTtcXHJcXG5cXHRcXHRpZiAodHlwZW9mIGRhdGEgPT0gJ3N0cmluZycpIHtcXHJcXG5cXHRcXHRcXHRqc29uID0gZGF0YTtcXHJcXG5cXHRcXHR9IGVsc2UgaWYgKHR5cGVvZiBkYXRhID09ICdvYmplY3QnKSB7XFxyXFxuXFx0XFx0XFx0anNvbiA9IEpTT04uc3RyaW5naWZ5KGRhdGEpXFxyXFxuXFx0XFx0fVxcclxcblxcdFxcdHJldHVybiBnZXRKc29uVmlld2VyKGpzb24sIG9wdGlvbnMpO1xcclxcblxcdH07XFxyXFxuXFxuXFxuLyoqKi8gfVxcbi8qKioqKiovIF0pO1xcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkluZGxZbkJoWTJzNkx5OHZkMlZpY0dGamF5OWliMjkwYzNSeVlYQWdORGN4WWpFd1pEUTBZMkUzTWpnd1pURXhOR0VpTENKM1pXSndZV05yT2k4dkx5NHZjMk55YVhCMGN5OWhjR2t0Wlhod2JHOXlaWEl2ZGpJdmJXOWtkV3hsY3k5b2FXZG9iR2xuYUhSS2MyOXVMbmR2Y210bGNpNXFjeUlzSW5kbFluQmhZMnM2THk4dkxpOXpZM0pwY0hSekwyRndhUzFsZUhCc2IzSmxjaTkyTWk5dGIyUjFiR1Z6TDJwemIyNHRjR0Z5YzJVdWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqdEJRVUZCTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxIVkNRVUZsTzBGQlEyWTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3T3p0QlFVZEJPMEZCUTBFN08wRkJSVUU3UVVGRFFUczdRVUZGUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3T3pzN096czdRVU4wUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQkxIRkRRVUZ2UXl4bFFVRmxPMEZCUTI1RU8wRkJRMEU3UVVGRFFUczdPenM3T3p0QlEySkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRmxCUVZjN1FVRkRXQ3hoUVVGWk96dEJRVVZhTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEVzUjBGQlJUdEJRVU5HTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTEhkQ1FVRjFRanRCUVVOMlFqdEJRVU5CTzBGQlEwRXNSMEZCUlR0QlFVTkdPMEZCUTBFN1FVRkRRVHRCUVVOQklpd2labWxzWlNJNkltaHBaMmhzYVdkb2RFcHpiMjR1ZDI5eWEyVnlMbXB6SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaUlGeDBMeThnVkdobElHMXZaSFZzWlNCallXTm9aVnh1SUZ4MGRtRnlJR2x1YzNSaGJHeGxaRTF2WkhWc1pYTWdQU0I3ZlR0Y2JseHVJRngwTHk4Z1ZHaGxJSEpsY1hWcGNtVWdablZ1WTNScGIyNWNiaUJjZEdaMWJtTjBhVzl1SUY5ZmQyVmljR0ZqYTE5eVpYRjFhWEpsWDE4b2JXOWtkV3hsU1dRcElIdGNibHh1SUZ4MFhIUXZMeUJEYUdWamF5QnBaaUJ0YjJSMWJHVWdhWE1nYVc0Z1kyRmphR1ZjYmlCY2RGeDBhV1lvYVc1emRHRnNiR1ZrVFc5a2RXeGxjMXR0YjJSMWJHVkpaRjBwWEc0Z1hIUmNkRngwY21WMGRYSnVJR2x1YzNSaGJHeGxaRTF2WkhWc1pYTmJiVzlrZFd4bFNXUmRMbVY0Y0c5eWRITTdYRzVjYmlCY2RGeDBMeThnUTNKbFlYUmxJR0VnYm1WM0lHMXZaSFZzWlNBb1lXNWtJSEIxZENCcGRDQnBiblJ2SUhSb1pTQmpZV05vWlNsY2JpQmNkRngwZG1GeUlHMXZaSFZzWlNBOUlHbHVjM1JoYkd4bFpFMXZaSFZzWlhOYmJXOWtkV3hsU1dSZElEMGdlMXh1SUZ4MFhIUmNkR1Y0Y0c5eWRITTZJSHQ5TEZ4dUlGeDBYSFJjZEdsa09pQnRiMlIxYkdWSlpDeGNiaUJjZEZ4MFhIUnNiMkZrWldRNklHWmhiSE5sWEc0Z1hIUmNkSDA3WEc1Y2JpQmNkRngwTHk4Z1JYaGxZM1YwWlNCMGFHVWdiVzlrZFd4bElHWjFibU4wYVc5dVhHNGdYSFJjZEcxdlpIVnNaWE5iYlc5a2RXeGxTV1JkTG1OaGJHd29iVzlrZFd4bExtVjRjRzl5ZEhNc0lHMXZaSFZzWlN3Z2JXOWtkV3hsTG1WNGNHOXlkSE1zSUY5ZmQyVmljR0ZqYTE5eVpYRjFhWEpsWDE4cE8xeHVYRzRnWEhSY2RDOHZJRVpzWVdjZ2RHaGxJRzF2WkhWc1pTQmhjeUJzYjJGa1pXUmNiaUJjZEZ4MGJXOWtkV3hsTG14dllXUmxaQ0E5SUhSeWRXVTdYRzVjYmlCY2RGeDBMeThnVW1WMGRYSnVJSFJvWlNCbGVIQnZjblJ6SUc5bUlIUm9aU0J0YjJSMWJHVmNiaUJjZEZ4MGNtVjBkWEp1SUcxdlpIVnNaUzVsZUhCdmNuUnpPMXh1SUZ4MGZWeHVYRzVjYmlCY2RDOHZJR1Y0Y0c5elpTQjBhR1VnYlc5a2RXeGxjeUJ2WW1wbFkzUWdLRjlmZDJWaWNHRmphMTl0YjJSMWJHVnpYMThwWEc0Z1hIUmZYM2RsWW5CaFkydGZjbVZ4ZFdseVpWOWZMbTBnUFNCdGIyUjFiR1Z6TzF4dVhHNGdYSFF2THlCbGVIQnZjMlVnZEdobElHMXZaSFZzWlNCallXTm9aVnh1SUZ4MFgxOTNaV0p3WVdOclgzSmxjWFZwY21WZlh5NWpJRDBnYVc1emRHRnNiR1ZrVFc5a2RXeGxjenRjYmx4dUlGeDBMeThnWDE5M1pXSndZV05yWDNCMVlteHBZMTl3WVhSb1gxOWNiaUJjZEY5ZmQyVmljR0ZqYTE5eVpYRjFhWEpsWDE4dWNDQTlJRndpWENJN1hHNWNiaUJjZEM4dklFeHZZV1FnWlc1MGNua2diVzlrZFd4bElHRnVaQ0J5WlhSMWNtNGdaWGh3YjNKMGMxeHVJRngwY21WMGRYSnVJRjlmZDJWaWNHRmphMTl5WlhGMWFYSmxYMThvTUNrN1hHNWNibHh1WEc0dktpb2dWMFZDVUVGRFN5QkdUMDlVUlZJZ0tpcGNiaUFxS2lCM1pXSndZV05yTDJKdmIzUnpkSEpoY0NBME56RmlNVEJrTkRSallUY3lPREJsTVRFMFlWeHVJQ29xTHlJc0lpOHFLbHh5WEc0Z0tpQkRiMlJsSUdadmNtMWhkQ0IzWldJdGQyOXlhMlZ5WEhKY2JpQXFJRUJ3WVhKaGJTQmxkbVZ1ZEZ4eVhHNGdLaTljY2x4dUx5OGdkbUZ5SUdocFoyaHNhV2RvZEVwemIyNG9LVnh5WEc1MllYSWdhR2xuYUd4cFoyaDBTbk52YmlBOUlISmxjWFZwY21Vb0p5NHZhbk52Ymkxd1lYSnpaU2NwTzF4eVhHNWNjbHh1YjI1dFpYTnpZV2RsSUQwZ1puVnVZM1JwYjI0b1pYWmxiblFwSUh0Y2NseHVJQ0IyWVhJZ1kyOWtaU0E5SUdWMlpXNTBMbVJoZEdFN1hISmNiaUFnTHk4Z2FXMXdiM0owVTJOeWFYQjBjeWduYW5OdmJpMXdZWEp6WlM1cWN5Y3BPMXh5WEc0Z0lIWmhjaUJ5WlhOMWJIUWdQU0JvYVdkb2JHbG5hSFJLYzI5dUtHTnZaR1VzSUh0bGVIQmhibVJsWkRvZ2RISjFaWDBwTzF4eVhHNGdJQzh2SUhaaGNpQnlaWE4xYkhRZ1BVcFRUMDR1YzNSeWFXNW5hV1o1S0dOdlpHVXBPMXh5WEc0Z0lIQnZjM1JOWlhOellXZGxLSEpsYzNWc2RDazdYSEpjYm4wN1hISmNibHh1WEc1Y2JpOHFLaW9xS2lvcUtpb3FLaW9xS2lvcUtseHVJQ29xSUZkRlFsQkJRMHNnUms5UFZFVlNYRzRnS2lvZ0xpOXpZM0pwY0hSekwyRndhUzFsZUhCc2IzSmxjaTkyTWk5dGIyUjFiR1Z6TDJocFoyaHNhV2RvZEVwemIyNHVkMjl5YTJWeUxtcHpYRzRnS2lvZ2JXOWtkV3hsSUdsa0lEMGdNRnh1SUNvcUlHMXZaSFZzWlNCamFIVnVhM01nUFNBd1hHNGdLaW92SWl3aWRtRnlJSEJ5WldacGVDQTlJQ2QwYlMxamIyUmxKenRjY2x4dVhISmNiblpoY2lCblpYUkZlSEJoYm1SbGNrTnNZWE56WlhNZ1BTQm1kVzVqZEdsdmJpQW9aWGh3WVc1a1pXUXBJSHRjY2x4dVhIUnBaaUFvSVdWNGNHRnVaR1ZrS1NCN1hISmNibHgwWEhSeVpYUjFjbTRnSjJWNGNHRnVaR1ZrSUdOdmJHeGhjSE5sWkNCb2FXUmtaVzRuTzF4eVhHNWNkSDFjY2x4dVhIUnlaWFIxY200Z0oyVjRjR0Z1WkdWa0p6dGNjbHh1ZlR0Y2NseHVYSEpjYm5aaGNpQmxibU52WkdVZ1BTQm1kVzVqZEdsdmJpQW9kbUZzZFdVcElIdGNjbHh1WEhSeVpYUjFjbTRnV3ljOGMzQmhiajRuTENCMllXeDFaU3dnSnp3dmMzQmhiajRuWFM1cWIybHVLQ2NuS1R0Y2NseHVmVHRjY2x4dVhISmNiblpoY2lCamNtVmhkR1ZGYkdWdFpXNTBJRDBnWm5WdVkzUnBiMjRnS0d0bGVTd2dkbUZzZFdVc0lIUjVjR1VzSUdWNGNHRnVaR1Z5UTJ4aGMzTmxjeWtnZTF4eVhHNWNkSFpoY2lCcmJHRnpjeUE5SUNkdlltcGxZM1FuTEZ4eVhHNWNkRngwYjNCbGJpQTlJQ2Q3Snl4Y2NseHVYSFJjZEdOc2IzTmxJRDBnSjMwbk8xeHlYRzVjY2x4dVhIUnBaaUFvUVhKeVlYa3VhWE5CY25KaGVTaDJZV3gxWlNrcElIdGNjbHh1WEhSY2RHdHNZWE56SUQwZ0oyRnljbUY1Snp0Y2NseHVYSFJjZEc5d1pXNGdQU0FuV3ljN1hISmNibHgwWEhSamJHOXpaU0E5SUNkZEp6dGNjbHh1WEhSOVhISmNibHh5WEc1Y2RHbG1JQ2gyWVd4MVpTQTlQVDBnYm5Wc2JDa2dlMXh5WEc1Y2RGeDBjbVYwZFhKdUlGdGNjbHh1WEhSY2RGeDBKenhzYVQ0bkxGeHlYRzVjZEZ4MFhIUmNkQ2M4YzNCaGJpQmpiR0Z6Y3oxY0ltdGxlVndpUGx3aUp5d2daVzVqYjJSbEtHdGxlU2tzSUNkY0lqb2dQQzl6Y0dGdVBpY3NYSEpjYmx4MFhIUmNkRngwSnp4emNHRnVJR05zWVhOelBWd2liblZzYkZ3aVBsd2lKeXdnWlc1amIyUmxLSFpoYkhWbEtTd2dKMXdpUEM5emNHRnVQaWNzWEhKY2JseDBYSFJjZENjOEwyeHBQaWRjY2x4dVhIUmNkRjB1YW05cGJpZ25KeWs3WEhKY2JseDBmVnh5WEc1Y2NseHVYSFJwWmlBb2RIbHdaU0E5UFNBbmIySnFaV04wSnlrZ2UxeHlYRzVjZEZ4MGNtVjBkWEp1SUZ0Y2NseHVYSFJjZEZ4MEp6eHNhVDRuTEZ4eVhHNWNkRngwWEhSY2RDYzhjM0JoYmlCamJHRnpjejFjSWljc0lHVjRjR0Z1WkdWeVEyeGhjM05sY3l3Z0oxd2lQand2YzNCaGJqNG5MRnh5WEc1Y2RGeDBYSFJjZENjOGMzQmhiaUJqYkdGemN6MWNJbXRsZVZ3aVBsd2lKeXdnWlc1amIyUmxLR3RsZVNrc0lDZGNJam9nUEM5emNHRnVQaUFuTEZ4eVhHNWNkRngwWEhSY2RDYzhjM0JoYmlCamJHRnpjejFjSW05d1pXNWNJajRuTENCdmNHVnVMQ0FuUEM5emNHRnVQaUFuTEZ4eVhHNWNkRngwWEhSY2RDYzhkV3dnWTJ4aGMzTTlYQ0luTENCcmJHRnpjeXdnSjF3aVBpY3NYSEpjYmx4MFhIUmNkRngwWEhScWMyOXVNbWgwYld3b2RtRnNkV1VzSUdWNGNHRnVaR1Z5UTJ4aGMzTmxjeWtzWEhKY2JseDBYSFJjZEZ4MEp6d3ZkV3crSnl4Y2NseHVYSFJjZEZ4MFhIUW5QSE53WVc0Z1kyeGhjM005WENKamJHOXpaVndpUGljc0lHTnNiM05sTENBblBDOXpjR0Z1UGljc1hISmNibHgwWEhSY2RDYzhMMnhwUGlkY2NseHVYSFJjZEYwdWFtOXBiaWduSnlrN1hISmNibHgwZlZ4eVhHNWNjbHh1WEhScFppQW9kSGx3WlNBOVBTQW5iblZ0WW1WeUp5QjhmQ0IwZVhCbElEMDlJQ2RpYjI5c1pXRnVKeWtnZTF4eVhHNWNkRngwY21WMGRYSnVJRnRjY2x4dVhIUmNkRngwSnp4c2FUNG5MRnh5WEc1Y2RGeDBYSFJjZENjOGMzQmhiaUJqYkdGemN6MWNJbXRsZVZ3aVBsd2lKeXdnWlc1amIyUmxLR3RsZVNrc0lDZGNJam9nUEM5emNHRnVQaWNzWEhKY2JseDBYSFJjZEZ4MEp6eHpjR0Z1SUdOc1lYTnpQVndpSnl3Z2RIbHdaU3dnSjF3aVBpY3NJR1Z1WTI5a1pTaDJZV3gxWlNrc0lDYzhMM053WVc0K0p5eGNjbHh1WEhSY2RGeDBKend2YkdrK0oxeHlYRzVjZEZ4MFhTNXFiMmx1S0NjbktUdGNjbHh1WEhSOVhISmNibHgwY21WMGRYSnVJRnRjY2x4dVhIUmNkQ2M4YkdrK0p5eGNjbHh1WEhSY2RGeDBKenh6Y0dGdUlHTnNZWE56UFZ3aWEyVjVYQ0krWENJbkxDQmxibU52WkdVb2EyVjVLU3dnSjF3aU9pQThMM053WVc0K0p5eGNjbHh1WEhSY2RGeDBKenh6Y0dGdUlHTnNZWE56UFZ3aUp5d2dkSGx3WlN3Z0oxd2lQbHdpSnl3Z1pXNWpiMlJsS0haaGJIVmxLU3dnSjF3aVBDOXpjR0Z1UGljc1hISmNibHgwWEhRblBDOXNhVDRuWEhKY2JseDBYUzVxYjJsdUtDY25LVHRjY2x4dWZUdGNjbHh1WEhKY2JuWmhjaUJxYzI5dU1taDBiV3dnUFNCbWRXNWpkR2x2YmlBb2FuTnZiaXdnWlhod1lXNWtaWEpEYkdGemMyVnpLU0I3WEhKY2JseDBkbUZ5SUdoMGJXd2dQU0FuSnp0Y2NseHVYSFJtYjNJZ0tIWmhjaUJyWlhrZ2FXNGdhbk52YmlrZ2UxeHlYRzVjZEZ4MGFXWWdLQ0ZxYzI5dUxtaGhjMDkzYmxCeWIzQmxjblI1S0d0bGVTa3BJSHRjY2x4dVhIUmNkRngwWTI5dWRHbHVkV1U3WEhKY2JseDBYSFI5WEhKY2JseHlYRzVjZEZ4MGFIUnRiQ0E5SUZ0b2RHMXNMQ0JqY21WaGRHVkZiR1Z0Wlc1MEtHdGxlU3dnYW5OdmJsdHJaWGxkTENCMGVYQmxiMllnYW5OdmJsdHJaWGxkTENCbGVIQmhibVJsY2tOc1lYTnpaWE1wWFM1cWIybHVLQ2NuS1R0Y2NseHVYSFI5WEhKY2JseDBjbVYwZFhKdUlHaDBiV3c3WEhKY2JuMDdYSEpjYmx4eVhHNTJZWElnWjJWMFNuTnZibFpwWlhkbGNpQTlJR1oxYm1OMGFXOXVJQ2hrWVhSaExDQnZjSFJwYjI1ektTQjdYSEpjYmx4MGRISjVJSHRjY2x4dVhIUmNkSEpsZEhWeWJpQmJYSEpjYmx4MFhIUmNkQ2M4ZFd3Z1kyeGhjM005WENJbkxDQndjbVZtYVhnc0lDY3RZMjl1ZEdGcGJtVnlYQ0krSnl4Y2NseHVYSFJjZEZ4MFhIUnFjMjl1TW1oMGJXd29XMHBUVDA0dWNHRnljMlVvWkdGMFlTbGRMQ0JuWlhSRmVIQmhibVJsY2tOc1lYTnpaWE1vYjNCMGFXOXVjeTVsZUhCaGJtUmxaQ2twTEZ4eVhHNWNkRngwWEhRblBDOTFiRDRuWEhKY2JseDBYSFJkTG1wdmFXNG9KeWNwTzF4eVhHNWNkSDBnWTJGMFkyZ2dLR1VwSUh0Y2NseHVYSFJjZEhKbGRIVnliaUJiWEhKY2JseDBYSFJjZENjOFpHbDJJR05zWVhOelBWd2lKeXdnY0hKbFptbDRMQ0FuTFdWeWNtOXlYQ0lnUGljc0lHVXVkRzlUZEhKcGJtY29LU3dnSnlBOEwyUnBkajRuWEhKY2JseDBYSFJkTG1wdmFXNG9KeWNwTzF4eVhHNWNkSDFjY2x4dWZUdGNjbHh1WEhKY2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1puVnVZM1JwYjI0b1pHRjBZU3dnYjNCMEtTQjdYSEpjYmx4MGRtRnlJR3B6YjI0Z1BTQW5KenRjY2x4dVhIUjJZWElnYjNCMGFXOXVjeUE5SUc5d2RDQjhmQ0I3Wlhod1lXNWtaV1E2SUhSeWRXVjlPMXh5WEc1Y2RHbG1JQ2gwZVhCbGIyWWdaR0YwWVNBOVBTQW5jM1J5YVc1bkp5a2dlMXh5WEc1Y2RGeDBhbk52YmlBOUlHUmhkR0U3WEhKY2JseDBmU0JsYkhObElHbG1JQ2gwZVhCbGIyWWdaR0YwWVNBOVBTQW5iMkpxWldOMEp5a2dlMXh5WEc1Y2RGeDBhbk52YmlBOUlFcFRUMDR1YzNSeWFXNW5hV1o1S0dSaGRHRXBYSEpjYmx4MGZWeHlYRzVjZEhKbGRIVnliaUJuWlhSS2MyOXVWbWxsZDJWeUtHcHpiMjRzSUc5d2RHbHZibk1wTzF4eVhHNTlPMXh5WEc1Y2JseHVYRzR2S2lvcUtpb3FLaW9xS2lvcUtpb3FLaXBjYmlBcUtpQlhSVUpRUVVOTElFWlBUMVJGVWx4dUlDb3FJQzR2YzJOeWFYQjBjeTloY0drdFpYaHdiRzl5WlhJdmRqSXZiVzlrZFd4bGN5OXFjMjl1TFhCaGNuTmxMbXB6WEc0Z0tpb2diVzlrZFd4bElHbGtJRDBnTVZ4dUlDb3FJRzF2WkhWc1pTQmphSFZ1YTNNZ1BTQXdYRzRnS2lvdklsMHNJbk52ZFhKalpWSnZiM1FpT2lJaWZRPT1cIiwgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcImhpZ2hsaWdodEpzb24ud29ya2VyLmpzXCIpO1xufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc2NyaXB0cy9hcGktZXhwbG9yZXIvdjIvbW9kdWxlcy9oaWdobGlnaHRKc29uLndvcmtlci5qc1xuICoqIG1vZHVsZSBpZCA9IDEyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEwMzQzOTEzL2hvdy10by1jcmVhdGUtYS13ZWItd29ya2VyLWZyb20tYS1zdHJpbmdcclxuXHJcbnZhciBVUkwgPSB3aW5kb3cuVVJMIHx8IHdpbmRvdy53ZWJraXRVUkw7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY29udGVudCwgdXJsKSB7XHJcblx0dHJ5IHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHZhciBibG9iO1xyXG5cdFx0XHR0cnkgeyAvLyBCbG9iQnVpbGRlciA9IERlcHJlY2F0ZWQsIGJ1dCB3aWRlbHkgaW1wbGVtZW50ZWRcclxuXHRcdFx0XHR2YXIgQmxvYkJ1aWxkZXIgPSB3aW5kb3cuQmxvYkJ1aWxkZXIgfHwgd2luZG93LldlYktpdEJsb2JCdWlsZGVyIHx8IHdpbmRvdy5Nb3pCbG9iQnVpbGRlciB8fCB3aW5kb3cuTVNCbG9iQnVpbGRlcjtcclxuXHRcdFx0XHRibG9iID0gbmV3IEJsb2JCdWlsZGVyKCk7XHJcblx0XHRcdFx0YmxvYi5hcHBlbmQoY29udGVudCk7XHJcblx0XHRcdFx0YmxvYiA9IGJsb2IuZ2V0QmxvYigpO1xyXG5cdFx0XHR9IGNhdGNoKGUpIHsgLy8gVGhlIHByb3Bvc2VkIEFQSVxyXG5cdFx0XHRcdGJsb2IgPSBuZXcgQmxvYihbY29udGVudF0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBuZXcgV29ya2VyKFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYikpO1xyXG5cdFx0fSBjYXRjaChlKSB7XHJcblx0XHRcdHJldHVybiBuZXcgV29ya2VyKCdkYXRhOmFwcGxpY2F0aW9uL2phdmFzY3JpcHQsJyArIGVuY29kZVVSSUNvbXBvbmVudChjb250ZW50KSk7XHJcblx0XHR9XHJcblx0fSBjYXRjaChlKSB7XHJcblx0XHRyZXR1cm4gbmV3IFdvcmtlcih1cmwpO1xyXG5cdH1cclxufVxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogRDovdGlja2V0bWFzdGVyLWFwaS1zdGFnaW5nLmdpdGh1Yi5pby9+L3dvcmtlci1sb2FkZXIvY3JlYXRlSW5saW5lV29ya2VyLmpzXG4gKiogbW9kdWxlIGlkID0gMTNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImZ1bmN0aW9uIHNsaWNrKHRpbWVzKSB7XHJcblx0XCJ1c2Ugc3RyaWN0XCI7XHJcblx0dmFyIHNlbGVjdG9yID0gJyNzbGlkZXItJztcclxuXHRcclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHRpbWVzOyBpKyspIHtcclxuXHRcdCQoc2VsZWN0b3IgKyBpKS5zbGljayh7XHJcblx0XHRcdGRvdHM6IGZhbHNlLFxyXG5cdFx0XHRpbmZpbml0ZTogZmFsc2UsXHJcblx0XHRcdHNwZWVkOiAzMDAsXHJcblx0XHRcdHNsaWRlc1RvU2hvdzogMyxcclxuXHRcdFx0c2xpZGVzVG9TY3JvbGw6IDEsXHJcblx0XHRcdHZhcmlhYmxlV2lkdGg6IHRydWUsXHJcblx0XHRcdGF1dG9wbGF5OiBmYWxzZSxcclxuXHRcdFx0cmVzcG9uc2l2ZTogW1xyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGJyZWFrcG9pbnQ6IDEyMDAsXHJcblx0XHRcdFx0XHRzZXR0aW5nczoge1xyXG5cdFx0XHRcdFx0XHR2YXJpYWJsZVdpZHRoOiB0cnVlLFxyXG5cdFx0XHRcdFx0XHRzbGlkZXNUb1Nob3c6IDIsXHJcblx0XHRcdFx0XHRcdHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG5cdFx0XHRcdFx0XHRpbmZpbml0ZTogZmFsc2UsXHJcblx0XHRcdFx0XHRcdGRvdHM6IGZhbHNlXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRicmVha3BvaW50OiA4MDAsXHJcblx0XHRcdFx0XHRzZXR0aW5nczoge1xyXG5cdFx0XHRcdFx0XHR2YXJpYWJsZVdpZHRoOiB0cnVlLFxyXG5cdFx0XHRcdFx0XHRzbGlkZXNUb1Nob3c6IDEsXHJcblx0XHRcdFx0XHRcdHNsaWRlc1RvU2Nyb2xsOiAxXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRdXHJcblx0XHR9KTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVuc2xpY2sodGltZXMpIHtcclxuXHRcInVzZSBzdHJpY3RcIjtcclxuXHR2YXIgc2VsZWN0b3IgPSAnI3NsaWRlci0nO1xyXG5cdFxyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgdGltZXM7IGkrKykge1xyXG5cdFx0JChzZWxlY3RvciArIGkpLnNsaWNrKCd1bnNsaWNrJyk7XHJcblx0fVxyXG5cdGNvbnNvbGUubG9nKCdjbGVhcmVkJyk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdHNldDogc2xpY2ssXHJcblx0cmVtb3ZlOiB1bnNsaWNrXHJcbn07XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zY3JpcHRzL2FwaS1leHBsb3Jlci92Mi9tb2R1bGVzL3NsaWRlci5qc1xuICoqIG1vZHVsZSBpZCA9IDE0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoKSB7XG5cdHJlcXVpcmUoJy4vY3VzdG9tU2VsZWN0LmNvbXBvbmVudCcpO1xuXHRyZXF1aXJlKCcuL2NhcmRHcm91cC5jb21wb25lbnQnKTtcblx0cmVxdWlyZSgnLi9wYWdpbmF0aW9uLmNvbXBvbmVudCcpO1xuXHRyZXF1aXJlKCcuL2xpc3RDYXJkLmNvbXBvbmVudCcpO1xufSgpKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zY3JpcHRzL2FwaS1leHBsb3Jlci92Mi9jb21wb25lbnRzL2luZGV4LmpzXG4gKiogbW9kdWxlIGlkID0gMTVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKlxyXG4gKiBDdXN0b20gU2VsZWN0IGNvbXBvbmVudFxyXG4gKi9cclxudmFyIHNlbGY7XHJcblxyXG4vKipcclxuICogQ3VzdG9tIFNlbGVjdCBWaWV3LU1vZGVsXHJcbiAqIEBwYXJhbSBwYXJhbXNcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqL1xyXG5mdW5jdGlvbiBDdXN0b21TZWxlY3QocGFyYW1zKSB7XHJcbiAgc2VsZiA9IHRoaXM7XHJcblxyXG4gIHRoaXMuYW5pbWF0aW9uU3BlZWQgPSBwYXJhbXMuYW5pbWF0aW9uU3BlZWQgfHwgMjAwO1xyXG5cdHRoaXMuY3VyZW50U2VsZWN0RGF0YSA9IHBhcmFtcy5kYXRhIHx8IG51bGw7XHJcblx0dGhpcy5vbkZvY3VzID0gcGFyYW1zLmZvY3VzIHx8IG51bGw7XHJcblx0XHJcbiAgLy9vYnNlcnZhYmxlc1xyXG4gIHRoaXMuc2VsZWN0TW9kZWwgPSB0eXBlb2YgcGFyYW1zLm9wdGlvbnMgIT09J2Z1bmN0aW9uJyA/IGtvLm9ic2VydmFibGVBcnJheShwYXJhbXMub3B0aW9ucyk6ICBwYXJhbXMub3B0aW9ucztcclxuICB0aGlzLnBsYWNlaG9sZGVyID0ga28ub2JzZXJ2YWJsZShwYXJhbXMucGxhY2Vob2xkZXIgfHwgJycpO1xyXG4gIHRoaXMub25zZWxlY3QgPSBwYXJhbXMub25zZWxlY3QgfHwgZnVuY3Rpb24gKGl0ZW0pIHsgY29uc29sZS5sb2coaXRlbSArJ3NlbGVjdGVkIScpfTtcclxuICB0aGlzLnNlbGVjdGVkID0ga28ub2JzZXJ2YWJsZSh0aGlzLnNlbGVjdE1vZGVsKClbMF0pO1xyXG4gIHRoaXMuaXNPbmVPcHRpb24gPSBrby5wdXJlQ29tcHV0ZWQoZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0TW9kZWwoKS5sZW5ndGggPCAyOyAvLyBtb3JlIHRoYW4gb25lIG9wdGlvblxyXG4gIH0sIHRoaXMpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmaW5kRWxlbWVudChldmVudCkge1xyXG4gIHZhciBwYXJlbnQgPSAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLnBhcmVudHMoJy5qcy1jdXN0b20tc2VsZWN0Jyk7XHJcbiAgcmV0dXJuIHtcclxuICAgIHdyYXBwZXI6IHBhcmVudC5maW5kKCcuanMtY3VzdG9tLXNlbGVjdC13cmFwcGVyJyksXHJcbiAgICBsYXllcjogcGFyZW50LmZpbmQoJy5qcy1jdXN0b20tc2VsZWN0LWxheWVyJylcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDdXN0b20gU2VsZWN0IFZpZXctTW9kZWwgbWV0aG9kXHJcbiAqIEBwYXJhbSB2aWV3TW9kZWxcclxuICogQHBhcmFtIGV2ZW50XHJcbiAqL1xyXG5DdXN0b21TZWxlY3QucHJvdG90eXBlLnNsaWRlVG9nZ2xlID0gZnVuY3Rpb24odmlld01vZGVsLCBldmVudCkge1xyXG5cdC8vIGVsZW0gaW4gZm9jdXMgZW11bGF0aW9uXHJcblx0dGhpcy5vbkZvY3VzICYmIHRoaXMub25Gb2N1cyh0aGlzLmN1cmVudFNlbGVjdERhdGEpO1xyXG5cclxuXHRpZiAodGhpcy5pc09uZU9wdGlvbigpKSB7cmV0dXJuIGZhbHNlO31cclxuICB2YXIgZWwgPSBmaW5kRWxlbWVudChldmVudCk7XHJcbiAgICBlbC53cmFwcGVyLnNsaWRlVG9nZ2xlKHZpZXdNb2RlbC5hbmltYXRpb25TcGVlZCk7XHJcbiAgICBlbC5sYXllci50b2dnbGVDbGFzcygnaGlkZGVuJyk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ3VzdG9tIFNlbGVjdCBWaWV3LU1vZGVsIG1ldGhvZFxyXG4gKiBAcGFyYW0gaXRlbVxyXG4gKiBAcGFyYW0gZXZlbnRcclxuICovXHJcbkN1c3RvbVNlbGVjdC5wcm90b3R5cGUuc2VsZWN0SXRlbSA9IGZ1bmN0aW9uIChpdGVtLCBldmVudCkge1xyXG4gIHZhciBzZWxmID0gdGhpcztcclxuICB0aGlzLnNlbGVjdGVkKGl0ZW0pO1xyXG4gIC8vIHJ1biBoYW5kbGVyXHJcbiAgdGhpcy5vbnNlbGVjdChpdGVtKTtcclxuXHQvLyBzbGlkZSB1cFxyXG4gIHRoaXMuc2xpZGVUb2dnbGUoc2VsZiwgZXZlbnQpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBrby5jb21wb25lbnRzLnJlZ2lzdGVyKCdjdXN0b20tc2VsZWN0Jywge1xyXG4gIHZpZXdNb2RlbDogQ3VzdG9tU2VsZWN0LFxyXG4gIHRlbXBsYXRlOiAoW1xyXG4gICAgJzxkaXYgY2xhc3M9XCJhcGktZXhwLWN1c3RvbS1zZWxlY3QganMtY3VzdG9tLXNlbGVjdFwiPicsXHJcbiAgICAgICc8ZGl2IGNsYXNzPVwiYXBpLWV4cC1jdXN0b20tc2VsZWN0LXdyYXBwZXJcIj4nLFxyXG4gICAgICAgICc8c2VsZWN0IGRhdGEtYmluZD1cIm9wdGlvbnM6IHNlbGVjdE1vZGVsLCBvcHRpb25zVGV4dDogXFwnbmFtZVxcJywgdmFsdWU6IHNlbGVjdGVkXCIgY2xhc3M9XCJhcGktZXhwLWN1c3RvbS1zZWxlY3RfX2ZpZWxkXCIgbmFtZT1cImFwaS1leHAtbWV0aG9kXCI+PC9zZWxlY3Q+JyxcclxuICAgICAgICAnPHNwYW4gY2xhc3M9XCJhcGktZXhwLWN1c3RvbS1zZWxlY3RfX3BsYWNlaG9sZGVyXCI+JyxcclxuICAgICAgICAgICc8aW5wdXQgZGF0YS1iaW5kPVwiZXZlbnQ6IHtjbGljazogc2xpZGVUb2dnbGV9LCBhdHRyOiB7dmFsdWU6IHNlbGVjdGVkKCkubmFtZSwgZGlzYWJsZWQ6IGlzT25lT3B0aW9ufVwiIHR5cGU9XCJ0ZXh0XCIgdmFsdWU9XCJcIiByZWFkb25seT1cIlwiPicsXHJcbiAgICAgICAgICAnPGIgZGF0YS1iaW5kPVwiY3NzOiB7aGlkZGVuOiBpc09uZU9wdGlvbn1cIiBjbGFzcz1cImFwaS1leHAtY3VzdG9tLXNlbGVjdF9fY2hldnJvblwiPiZuYnNwOzwvYj4nLFxyXG4gICAgICAgICc8L3NwYW4+JyxcclxuICAgICAgICAnPHVsIGRhdGEtYmluZD1cImZvcmVhY2g6IHNlbGVjdE1vZGVsXCIgY2xhc3M9XCJhcGktZXhwLWN1c3RvbS1zZWxlY3RfX2xpc3QganMtY3VzdG9tLXNlbGVjdC13cmFwcGVyXCI+JyxcclxuICAgICAgICAgICc8bGkgZGF0YS1iaW5kPVwiY3NzOiB7XFwnYWN0aXZlXFwnOiBjaGVja2VkfVwiIGNsYXNzPVwiYXBpLWV4cC1jdXN0b20tc2VsZWN0X19pdGVtXCI+JyxcclxuICAgICAgICAgICAgJzxidXR0b24gZGF0YS1iaW5kPVwiZXZlbnQ6IHtjbGljazogJHBhcmVudC5zZWxlY3RJdGVtLmJpbmQoJHBhcmVudCl9LCB0ZXh0OiBuYW1lLCBjc3M6IHtcXCdhY3RpdmVcXCc6IGNoZWNrZWQoKX0sIGF0dHI6IHtcXCdkYXRhLXZhbHVlXFwnOiBuYW1lfVwiICBjbGFzcz1cImFwaS1leHAtY3VzdG9tLXNlbGVjdF9faXRlbS1sYWJlbFwiIGhyZWY9XCIjXCI+PC9idXR0b24+JyxcclxuICAgICAgICAgICAgLy8gJzxzcGFuIGRhdGEtYmluZD1cImlmOiBsaW5rXCI+JyxcclxuICAgICAgICAgICAgXHQnPGEgZGF0YS1iaW5kPVwiYXR0cjoge2hyZWY6IGxpbmt9LCBjc3M6IHtcXCdoaWRkZW5cXCc6ICFsaW5rfVwiIGNsYXNzPVwiYXBpLWV4cC1jdXN0b20tc2VsZWN0X19pdGVtLWxpbmtcIiB0YXJnZXQ9XCJfYmxhbmtcIj4mbmJzcDs8L2E+JyxcclxuICAgICAgICAgICAgLy8gJzwvc3Bhbj4nLFxyXG4gICAgICAgICAgJzwvbGk+JyxcclxuICAgICAgICAnPC91bD4nLFxyXG4gICAgICAnPC9kaXY+JyxcclxuICAgICAgJzxkaXYgZGF0YS1iaW5kPVwiY2xpY2s6IHNsaWRlVG9nZ2xlXCIgY2xhc3M9XCJhcGktZXhwLWN1c3RvbS1zZWxlY3QtbGF5ZXIganMtY3VzdG9tLXNlbGVjdC1sYXllciBoaWRkZW5cIj48L2Rpdj4nLFxyXG4gICAgJzwvZGl2PidcclxuICBdKS5qb2luKCcnKVxyXG59KTtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL2NvbXBvbmVudHMvY3VzdG9tU2VsZWN0LmNvbXBvbmVudC5qc1xuICoqIG1vZHVsZSBpZCA9IDE2XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgc2VsZjtcblxuZnVuY3Rpb24gY2FyZEdyb3VwQ29tcG9uZW50KHBhcmFtcykge1xuXHRzZWxmID0gdGhpcztcblx0dmFyIHVybCA9IHBhcmFtcy51cmw7XG5cdHRoaXMuZmlsdGVyID0gcmVxdWlyZSgnLi4vY29uZmlnLmpzb24nKTtcblx0dGhpcy5jYXJkcyA9IHRoaXMucmVtb3ZlQ2FyZHMocGFyYW1zLmNhcmRzKTtcblx0dGhpcy5ncm91cEluZGV4ID0gcGFyYW1zLmdyb3VwSW5kZXggfHwgMDtcblx0dGhpcy5jYXJkSW5kZXggPSBwYXJhbXMuY2FyZEluZGV4O1xuXHR0aGlzLnNlY3Rpb25JbmRleCA9IHBhcmFtcy5zZWN0aW9uSW5kZXg7XG5cdHRoaXMuZGF0YSA9IHBhcmFtcy5kYXRhO1xuXHR0aGlzLmNvbG9yQ2xhc3MgPSBwYXJhbXMuY29sb3JDbGFzcztcblx0dGhpcy5nZXRNb3JlID0gcGFyYW1zLmdldE1vcmU7XG5cdHRoaXMucmVxSWQgPSB0aGlzLnJlcUlkIHx8IHBhcmFtcy5yZXFJZDtcblx0dGhpcy5jYXJkU2l6ZSA9IHBhcmFtcy5jYXJkU2l6ZSB8fCB0aGlzLmNhcmRzLnBhZ2Uuc2l6ZTtcblx0XG5cdHRoaXMucGFnZVBhcmFtID0gcGFyYW1zLnBhZ2VQYXJhbSB8fCB1cmwoKS5maW5kKGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0cmV0dXJuIGl0ZW0ubmFtZSA9PT0gJ3BhZ2UnO1xuXHR9KTtcblx0XG5cdHRoaXMuY29sbGFwc2VJZCA9IFtcblx0XHQnY2FyZC1wYW5lbC1ib2R5LScsXG5cdFx0dGhpcy5zZWN0aW9uSW5kZXgsXG5cdFx0dGhpcy5ncm91cEluZGV4XG5cdF0uam9pbignJyk7XG5cdFxuXHR0aGlzLmlzQWN0aXZlID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XG59XG5cbmNhcmRHcm91cENvbXBvbmVudC5wcm90b3R5cGUucmVtb3ZlQ2FyZHMgPSBmdW5jdGlvbiAob2JqKSB7XG5cdHZhciBkZXByZWNhdGVkID0gdGhpcy5maWx0ZXIuZGVwcmVjYXRlZDtcblx0dmFyIHVud3JhcHAgPSB0aGlzLmZpbHRlci51bndyYXBwO1xuXHQvLyB2YXIgY3VycmVudEFwaSA9IHRoaXMuZmlsdGVyW11cblxuXHRkZXByZWNhdGVkLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuXHRcdGlmIChvYmpbaXRlbV0pIHtcblx0XHRcdGRlbGV0ZSBvYmpbaXRlbV1cblx0XHR9XG5cdFx0cmV0dXJuIGl0ZW07XG5cdH0pO1xuXG5cdHVud3JhcHAubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0dmFyIHZhbCA9IG9ialtpdGVtXTtcblx0XHRpZiAodmFsKSB7XG5cdFx0XHR2YXIgYXJyID0gT2JqZWN0LmtleXModmFsKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHZhciBwcm9wID0gYXJyW2ldO1xuXHRcdFx0XHRvYmpbcHJvcF0gPSB2YWxbcHJvcF07XG5cdFx0XHR9XG5cdFx0XHRkZWxldGUgb2JqW2l0ZW1dO1xuXHRcdH1cblx0XHRyZXR1cm4gaXRlbTtcblx0fSk7XG5cblx0XG5cdHJldHVybiBvYmo7XG59O1xuXG5jYXJkR3JvdXBDb21wb25lbnQucHJvdG90eXBlLnNldEFjdGl2ZSA9IGZ1bmN0aW9uICh2bSwgZSkge1xuXHRpZiAoIXRoaXMuaXNBY3RpdmUpIHtcblx0XHQgcmV0dXJuIHRoaXMuaXNBY3RpdmUgPSBrby5vYnNlcnZhYmxlKHRydWUpO1xuXHR9XG5cdHRoaXMuaXNBY3RpdmUoIXRoaXMuaXNBY3RpdmUoKSk7XG59O1xuXG5jYXJkR3JvdXBDb21wb25lbnQucHJvdG90eXBlLnNvcnRCeUNvbmZpZyA9IGZ1bmN0aW9uIHNvcnRGdW5jKGEsIGIpIHtcblx0dmFyIGNvbmZpZyA9IHNlbGYuZmlsdGVyW3NlbGYucmVxSWRdLnNvcnRCeTtcblx0cmV0dXJuIGNvbmZpZy5pbmRleE9mKGEua2V5KSAtIGNvbmZpZy5pbmRleE9mKGIua2V5KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ga28uY29tcG9uZW50cy5yZWdpc3RlcignY2FyZEdyb3VwJywge1xuXHR2aWV3TW9kZWw6IGNhcmRHcm91cENvbXBvbmVudCxcblx0dGVtcGxhdGU6YFxuXHRcdDxzZWN0aW9uIGRhdGEtYmluZD1cImZvcmVhY2hwcm9wOiB7ZGF0YTogY2FyZHMsIHNvcnRGbjogc29ydEJ5Q29uZmlnfVwiIGNsYXNzPVwicGFuZWwtZ3JvdXBcIj5cblx0XHRcdDxzZWN0aW9uIGRhdGEtYmluZD1cImNzczoge1skY29tcG9uZW50LmNvbG9yQ2xhc3NdOiB0cnVlfVwiIGNsYXNzPVwicGFuZWwgcGFuZWwtcHJpbWFyeVwiPlxuXHRcdFx0XHQ8IS0tcGFuZWwtaGVhZGluZy0tPlxuXHRcdFx0XHQ8c2VjdGlvbiBjbGFzcz1cInBhbmVsLWhlYWRpbmdcIj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicGFuZWwtdGl0bGVcIj5cblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0PGEgZGF0YS1iaW5kPVwiYXR0cjogeydocmVmJzogJyMnICsgJGNvbXBvbmVudC5jb2xsYXBzZUlkICsgJGluZGV4KCksICdhcmlhLWNvbnRyb2xzJzogJGNvbXBvbmVudC5jb2xsYXBzZUlkICsgJGluZGV4KCl9XCIgY2xhc3M9XCJidG4gYnRuLWljb25cIiB0eXBlPVwiYnV0dG9uXCIgZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiPlxuXHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cImJ0biBidG4taWNvbiBzaGV2cm9uIHdoaXRlLXNoZXZyb24tdXBcIj48L3NwYW4+XG5cdFx0XHRcdFx0XHRcdDxzcGFuIGRhdGEtYmluZD1cInRleHQ6IGtleVwiIGNsYXNzPVwidGl0bGVcIj5UaXRsZTwvc3Bhbj5cblx0XHRcdFx0XHRcdDwvYT5cblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0PCEtLSBrbyBpZjoga2V5ID09PSAnZXZlbnRzJy0tPlxuXHRcdFx0XHRcdFx0XHQ8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiAkY29tcG9uZW50LmNhcmRTaXplXCIgY2xhc3M9XCJjb3VudGVyXCI+PC9zcGFuPlxuXHRcdFx0XHRcdFx0PCEtLSAva28tLT5cblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0PCEtLSBrbyBpZjoga2V5ID09PSAncGFnZSctLT5cblx0XHRcdFx0XHRcdFx0PHBhZ2luYXRpb24gcGFyYW1zPVwibnVtYmVyOiB2YWx1ZS5udW1iZXIsIHRvdGFsUGFnZXM6IHZhbHVlLnRvdGFsUGFnZXMsIHBhZ2VQYXJhbTogJGNvbXBvbmVudC5wYWdlUGFyYW0udmFsdWVcIj48L3BhZ2luYXRpb24+XG5cdFx0XHRcdFx0XHQ8IS0tIC9rby0tPlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L3NlY3Rpb24+XG5cdFx0XHRcdFxuXHRcdFx0XHQ8IS0tcGFuZWwtYm9keS0tPlxuXHRcdFx0XHQ8c2VjdGlvbiBkYXRhLWJpbmQ9XCJjc3M6IHsnaW4nOiAhJGluZGV4KCl9LCBhdHRyOnsnaWQnOiAkY29tcG9uZW50LmNvbGxhcHNlSWQgKyAkaW5kZXgoKX1cIiBjbGFzcz1cInBhbmVsLWNvbGxhcHNlIGNvbGxhcHNlXCI+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cInBhbmVsLWJvZHlcIj5cblx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdDwhLS0ga28gaWY6ICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmICEkLmlzQXJyYXkodmFsdWUpKSAtLT5cblx0XHRcdFx0XHRcdFx0PGRpdiBkYXRhLWJpbmQ9XCJmb3JlYWNocHJvcDogdmFsdWVcIj5cblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY2xlYXJmaXhcIj5cblx0XHRcdFx0XHRcdFx0XHRcdDxiIGNsYXNzPVwia2V5XCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxzcGFuIGRhdGEtYmluZD1cInRleHQ6IGtleVwiPjwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0XHRcdDwvYj5cblx0XHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRcdFx0PCEtLSBrbyBpZm5vdDogdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAtLT5cblx0XHRcdFx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJrZXlcIj46Jm5ic3A7PC9zcGFuPjxzcGFuIGRhdGEtYmluZD1cInRleHQ6IHZhbHVlXCIgY2xhc3M9XCJ2YWx1ZVwiPjwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0XHRcdDwhLS0gL2tvIC0tPlxuXHRcdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdFx0XHQ8IS0tIGtvIGlmOiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnIC0tPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiBjb25zb2xlLmxvZyh2YWx1ZSlcIj48L3NwYW4+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxidXR0b24gZGF0YS1iaW5kPVwiY2xpY2s6ICRjb21wb25lbnQuZ2V0TW9yZS5iaW5kKCRjb21wb25lbnQsIHZhbHVlKVwiIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4taWNvbiBibHVlLXNoZXZyb24tcmlnaHQgcHVsbC1yaWdodFwiPjwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0XHRcdFx0PCEtLSAva28gLS0+XG5cdFx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8IS0tIC9rbyAtLT5cblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0PCEtLSBrbyBpZjogKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgJC5pc0FycmF5KHZhbHVlKSkgLS0+XG5cdFx0XHRcdFx0XHRcdDx1bCBkYXRhLWJpbmQ9XCJmb3JlYWNoOiB2YWx1ZVwiIGNsYXNzPVwibGlzdC1ncm91cFwiPlxuXHRcdFx0XHRcdFx0XHRcdDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbVwiPlxuXHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRcdFx0PCEtLSBrbyBpZjogJHBhcmVudC5rZXkgPT09ICdpbWFnZXMnIC0tPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8aW1nIGRhdGEtYmluZD1cImF0dHI6IHtzcmM6IHVybH1cIiBhbHQ9XCJpbWdcIiBzdHlsZT1cIm1heC13aWR0aDogNTBweDsgbWF4LWhlaWdodDogNTBweFwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0PCEtLSAva28gLS0+XG5cdFx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRcdDwhLS0ga28gaWZub3Q6ICRwYXJlbnQua2V5ID09PSAnaW1hZ2VzJyAtLT5cblx0XHRcdFx0XHRcdFx0XHRcdDxzcGFuIGRhdGEtYmluZD1cInRleHQ6IG5hbWUgfHwgJyMnICsgJGluZGV4KClcIiBjbGFzcz1cIm5hbWUgdHJ1bmNhdGVcIj5ldmVudCBuYW1lPC9zcGFuPlxuXHRcdFx0XHRcdFx0XHRcdFx0PCEtLSAva28gLS0+XG5cdFx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRcdDwhLS0ga28gaWY6IHR5cGVvZiAkZGF0YSA9PT0gJ29iamVjdCcgLS0+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxidXR0b24gZGF0YS1iaW5kPVwiY2xpY2s6ICRjb21wb25lbnQuZ2V0TW9yZS5iaW5kKCRjb21wb25lbnQpXCIgdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1pY29uIGJsdWUtc2hldnJvbi1yaWdodCBwdWxsLXJpZ2h0XCI+PC9idXR0b24+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8IS0tIC9rbyAtLT5cblx0XHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRcdDwvbGk+XG5cdFx0XHRcdFx0XHRcdDwvdWw+XG5cdFx0XHRcdFx0XHQ8IS0tIC9rbyAtLT5cblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0PCEtLSBrbyBpZm5vdDogdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAtLT5cblx0XHRcdFx0XHRcdFx0PHNwYW4gZGF0YS1iaW5kPVwidGV4dDogdmFsdWVcIiBjbGFzcz1cInZhbHVlXCI+PC9zcGFuPlxuXHRcdFx0XHRcdFx0PCEtLSAva28gLS0+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDwvc2VjdGlvbj5cblx0XHRcdDwvc2VjdGlvbj5cblx0XG5cdFx0PC9zZWN0aW9uPlxuYH0pO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL2NvbXBvbmVudHMvY2FyZEdyb3VwLmNvbXBvbmVudC5qc1xuICoqIG1vZHVsZSBpZCA9IDE3XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0XCJkaXNjb3ZlcnkudjIuZXZlbnRzLmdldFwiOiB7XG5cdFx0XCJzb3J0QnlcIjogW1xuXHRcdFx0XCJwYWdlXCIsXG5cdFx0XHRcImV2ZW50c1wiLFxuXHRcdFx0XCJldmVudFwiLFxuXHRcdFx0XCJpbWFnZXNcIixcblx0XHRcdFwic2FsZXNcIixcblx0XHRcdFwidmVudWVzXCIsXG5cdFx0XHRcImRhdGVzXCIsXG5cdFx0XHRcInN0YXJ0XCIsXG5cdFx0XHRcInN0YXR1c1wiLFxuXHRcdFx0XCJlbmRcIlxuXHRcdF1cblx0fSxcblx0XCJkZXByZWNhdGVkXCI6IFtcblx0XHRcIl9saW5rc1wiXG5cdF0sXG5cdFwidW53cmFwcFwiOiBbXG5cdFx0XCJfZW1iZWRkZWRcIlxuXHRdXG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zY3JpcHRzL2FwaS1leHBsb3Jlci92Mi9jb25maWcuanNvblxuICoqIG1vZHVsZSBpZCA9IDE4XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgc2VsZjtcblxuLyoqXG4gKiBQYWdpbmF0aW9uIGVsZW1lbnRcbiAqIEBwYXJhbSBwYXJhbXNcbiAqL1xuZnVuY3Rpb24gcGFnaW5hdGlvbihwYXJhbXMpIHtcblx0c2VsZiA9IHRoaXM7XG5cdHRoaXMucGFnZVBhcmFtID0gcGFyYW1zLnBhZ2VQYXJhbTtcblx0dGhpcy50b3RhbFBhZ2VzID0gK3BhcmFtcy50b3RhbFBhZ2VzO1xuXHR0aGlzLm51bWJlciA9ICtwYXJhbXMubnVtYmVyO1xuXHR0aGlzLmZpcnN0ID0gISF0aGlzLm51bWJlcjtcblx0dGhpcy5sYXN0ID0gdGhpcy5udW1iZXIgPCB0aGlzLnRvdGFsUGFnZXMgLSAxO1xuXHR0aGlzLnJlcXVlc3RCdG4gPSAkKCcjYXBpLWV4cC1nZXQtYnRuJyk7XG59XG5cbi8qKlxuICogZ2V0IG5leHQgcGFnZVxuICovXG5wYWdpbmF0aW9uLnByb3RvdHlwZS5nZXRQcmV2UGFnZSA9IGZ1bmN0aW9uICgpIHtcblx0dmFyIHZhbCA9IHNlbGYucGFnZVBhcmFtKCk7XG5cdHNlbGYucGFnZVBhcmFtKHZhbCA+IDAgPyB2YWwgLSAxIDogMCk7XG5cdHNlbGYucmVxdWVzdEJ0bi50cmlnZ2VyKCdjbGljaycpO1xufTtcblxuLyoqXG4gKiBnZXQgcHJldiBwYWdlXG4gKi9cbnBhZ2luYXRpb24ucHJvdG90eXBlLmdldE5leHRQYWdlID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgdmFsID0gc2VsZi5udW1iZXI7XG5cdHNlbGYucGFnZVBhcmFtKHZhbCA8IHNlbGYudG90YWxQYWdlcyAtIDEgPyB2YWwgICsgMTogdmFsKTtcblx0c2VsZi5yZXF1ZXN0QnRuLnRyaWdnZXIoJ2NsaWNrJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGtvLmNvbXBvbmVudHMucmVnaXN0ZXIoJ3BhZ2luYXRpb24nLCB7XG5cdHZpZXdNb2RlbDogcGFnaW5hdGlvbixcblx0dGVtcGxhdGU6XG5cdGA8c3BhbiBjbGFzcz1cIm5hdmlnYXRpb24td3JhcHBlclwiPlxuXHRcdDxidXR0b24gZGF0YS1iaW5kPVwiY2xpY2s6IGdldFByZXZQYWdlLCBlbmFibGU6IGZpcnN0XCIgdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwibmF2aWdhdGlvbiBwcmV2XCI+PC9idXR0b24+XG5cdFx0PGJ1dHRvbiAgZGF0YS1iaW5kPVwiY2xpY2s6IGdldE5leHRQYWdlLCBlbmFibGU6IGxhc3RcIiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJuYXZpZ2F0aW9uIG5leHRcIj48L2J1dHRvbj5cblx0PC9zcGFuPmBcbn0pO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL2NvbXBvbmVudHMvcGFnaW5hdGlvbi5jb21wb25lbnQuanNcbiAqKiBtb2R1bGUgaWQgPSAxOVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiZnVuY3Rpb24gbGlzdENhcmQocGFyYW1zKSB7XHJcblx0c2VsZiA9IHRoaXM7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ga28uY29tcG9uZW50cy5yZWdpc3RlcignbGlzdENhcmQnLCB7XHJcblx0dmlld01vZGVsOiBsaXN0Q2FyZCxcclxuXHR0ZW1wbGF0ZTpcclxuXHRcdGA8c2VjdGlvbiBjbGFzcz1cInBhbmVsIHBhbmVsLXByaW1hcnlcIj5cclxuXHRcdFx0XHJcblx0XHRcdDwhLS1wYW5lbC1oZWFkaW5nLS0+XHJcblx0XHRcdDxkaXYgY2xhc3M9XCJwYW5lbC1oZWFkaW5nXCIgcm9sZT1cInRhYlwiPlxyXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJwYW5lbC10aXRsZVwiPlxyXG5cdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cImJ0biBidG4taWNvblwiIHR5cGU9XCJidXR0b25cIj5cclxuXHRcdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJidG4gYnRuLWljb24gc2hldnJvbiB3aGl0ZS1zaGV2cm9uLXVwXCI+PC9zcGFuPlxyXG5cdFx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cInRpdGxlXCIgZGF0YS1iaW5kPVwidGV4dDogbmFtZVwiPlRpdGxlPC9zcGFuPlxyXG5cdFx0XHRcdFx0PC9idXR0b24+XHRcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0PCEtLSBrbyBpZjogcXVhbnRpdHkgaW4gJGRhdGEtLT5cclxuXHRcdFx0XHRcdFx0PHNwYW4gZGF0YS1iaW5kPVwidGV4dDogcXVhbnRpdHlcIiBjbGFzcz1cImNvdW50ZXJcIj48L3NwYW4+XHJcblx0XHRcdFx0XHQ8IS0tIC9rbyAtLT5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9kaXY+PCEtLXBhbmVsLWhlYWRpbmctLT5cclxuXHRcdFx0XHJcblx0XHRcdDwhLS1wYW5lbC1ib2R5LS0+XHJcblx0XHRcdDxkaXYgY2xhc3M9XCJwYW5lbC1jb2xsYXBzZSBjb2xsYXBzZVwiIHJvbGU9XCJ0YWJwYW5lbFwiPlxyXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJwYW5lbC1ib2R5XCI+XHJcblx0XHRcdFx0XHRcdDx1bCBkYXRhLWJpbmQ9XCJmb3JlYWNoOiBpdGVtc1wiIGNsYXNzPVwibGlzdC1ncm91cFwiPlxyXG5cdFx0XHRcdFx0XHRcdDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbVwiPlxyXG5cdFx0XHRcdFx0XHRcdFx0PHNwYW4gZGF0YS1iaW5kPVwidGV4dDogbmFtZVwiIGNsYXNzPVwibmFtZSB0cnVuY2F0ZVwiPmV2ZW50IG5hbWU8L3NwYW4+XHJcblx0XHRcdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0XHRcdDwhLS1hZGRpdGlvbmFsLWluZm8tLT5cclxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJhZGRpdGlvbmFsLWluZm9cIj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0PHAgZGF0YS1iaW5kPVwidGV4dDogT2JqZWN0LmdldFByb3AoJGRhdGEsICdkYXRlcy5zdGFydC5sb2NhbERhdGUnKVwiIGNsYXNzPVwiZGF0ZVwiPmV2ZW50IGRhdGU8L3A+XHJcblx0XHRcdFx0XHRcdFx0XHRcdDxzcGFuIGRhdGEtYmluZD1cImlmOiBPYmplY3QuZ2V0UHJvcCgkZGF0YSwgJ19lbWJlZGRlZC52ZW51ZXNbMF0ubmFtZScpXCI+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0PHAgZGF0YS1iaW5kPVwidGV4dDogT2JqZWN0LmdldFByb3AoJGRhdGEsICdfZW1iZWRkZWQudmVudWVzWzBdLm5hbWUnKVwiIGNsYXNzPVwidmVudWVcIj5ldmVudCB2ZW51ZTwvcD5cclxuXHRcdFx0XHRcdFx0XHRcdFx0PC9zcGFuPlxyXG5cdFx0XHRcdFx0XHRcdFx0PC9kaXY+PCEtLWFkZGl0aW9uYWwtaW5mby0tPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdFx0XHQ8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4taWNvbiBibHVlLXNoZXZyb24tcmlnaHRcIj48L2J1dHRvbj5cclxuXHRcdFx0XHRcdFx0XHQ8L2xpPlxyXG5cdFx0XHRcdFx0XHQ8L3VsPlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8L2Rpdj48IS0tcGFuZWwtYm9keS0tPlxyXG5cdFx0PC9zZWN0aW9uPmBcclxufSk7XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zY3JpcHRzL2FwaS1leHBsb3Jlci92Mi9jb21wb25lbnRzL2xpc3RDYXJkLmNvbXBvbmVudC5qc1xuICoqIG1vZHVsZSBpZCA9IDIwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9
