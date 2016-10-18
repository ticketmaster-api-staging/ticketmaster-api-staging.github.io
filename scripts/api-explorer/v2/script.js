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
		transformObject: function (obj) {
			var properties = [];
			ko.utils.objectForEach(obj, function (key, value) {
				properties.push({ key: key, value: value });
			});
			return properties;
		},
		init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
			var properties = ko.pureComputed(function () {
				var obj = ko.utils.unwrapObservable(valueAccessor());
				return ko.bindingHandlers.foreachprop.transformObject(obj);
			});
			ko.applyBindingsToNode(element, { foreach: properties }, bindingContext);
			return { controlsDescendantBindings: true };
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
	  // console.clear();
	  var url = prepareUrl(arr);
	  // console.log(url);
	
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
				global.lastResponse = res.responseJSON;
				resObj.res = res.responseJSON;
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
	
	var setSlider = __webpack_require__(14);
	
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
		this.blocksViewModel = ko.observableArray([]);
		this.clearBtnIsVisible = ko.computed(this._isVisible, this);
		this.requests.subscribe(this.updateModel, this);
	}
	
	
	RequestsListViewModel.prototype.getMore = function (parent, data, event) {
		var groupComponent = this;
		var slider = $(event.currentTarget).parents('.slider');
		var component = $('<section data-bind="component: {name: \'card\', params: params}"></section>');
		ko.applyBindings({
			params: {
				data: parent,
				color: groupComponent.color,
				index: groupComponent.index,
				getMore: groupComponent.getMore,
				url: groupComponent.url
			}
		}, component[0]);
	
		slider.slick('slickAdd', component);
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
	 * Update Viewmodel of request list
	 * @param arr
	 */
	RequestsListViewModel.prototype.updateModel = function (arr) {
		var self = this;
		
		var newModel = this.requests()
			.map(function (obj) {
				var item =  $.extend({
					color: self.colors[obj.index % self.colors.length],
					active: ko.observable(false),
					resHTML: ko.observable('')
				}, obj);
				return item;
			});
		self.viewModel(newModel);
		setTimeout(function () {
			$('#show-details-0').trigger('click');
		}, 10);
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

	module.exports = function (selector) {
		"use strict";
	
		$(selector).slick({
			dots: false,
			infinite: false,
			speed: 300,
			slidesToShow: 3,
			slidesToScroll: 1,
			variableWidth: true,
			responsive: [
				{
					breakpoint: 1024,
					settings: {
						variableWidth: true,
						slidesToShow: 2,
						slidesToScroll: 1,
						infinite: false,
						dots: false
					}
				},
				{
					breakpoint: 678,
					settings: {
						variableWidth: true,
						slidesToShow: 2,
						slidesToScroll: 1
					}
				},
				{
					breakpoint: 480,
					settings: {
						centerMode: true,
						variableWidth: true,
						slidesToShow: 1,
						slidesToScroll: 1
					}
				}
			]
		});
	};


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (function () {
		__webpack_require__(16);
		__webpack_require__(17);
		__webpack_require__(18);
		__webpack_require__(19);
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
/***/ function(module, exports) {

	function cardGroupComponent(params) {
		self = this;
	
		var index = params.index;
	
		this.colorClass = params.colorClass;
		this.cards = params.cards;
		this.id = {
			'id': index
		};
	}
	
	cardGroupComponent.prototype.getKeyName = function (o, kofn) {
		if (typeof kofn !== 'function' || typeof o !== 'object') return 'bad title';
		return Object.keys(o)[kofn()]
	};
	
	cardGroupComponent.prototype.setActive = function () {
		this.isActive(!this.isActive());
	};
	
	cardGroupComponent.prototype.setActive = function (kofn) {
		if (typeof kofn !== 'function') return console.warn('NOT UNIQ INDEX FOR CARD!!!');
		return '' + this.index + kofn();
	};
	
	module.exports = ko.components.register('cardGroup', {
		viewModel: cardGroupComponent,
		template:
		`<section data-bind="foreachprop: cards, attr: id" class="panel-group">
	
				<span data-bind="text: console.log($data, typeof $data)"></span>
				<!-- ko if: typeof $data === 'object' -->
				<section data-bind="component: {name: 'card', params: {data: value, index: $index(), title: key, colorClass: $component.colorClass }}">Object</section>
				<!-- /ko -->
				
				
				<!-- ko if: typeof $data === 'object' && Array.isArray($data) -->
				<section>Array</section>
				<!-- /ko -->
		</section>`
	});


/***/ },
/* 18 */
/***/ function(module, exports) {

	function card(params) {
		var collapseId = params.index;
	
		this.data = params.data;
		this.colorClass = params.colorClass;
		this.title = params.title;
	
		this.collapse = {
			btn: {
				'data-target': '#' + collapseId,
				'aria-controls': collapseId
			},
			target: {
				'id': collapseId
			}
		}
	}
	
	module.exports = ko.components.register('card', {
		viewModel: card,
		template:
		`<section class="panel panel-primary">
			<!--panel-heading-->
			<section class="panel-heading">
				<div class="panel-title">
					<button data-bind="attr: collapse.btn" class="btn btn-icon" type="button" data-toggle="collapse" aria-expanded="false">
						<span class="btn btn-icon shevron white-shevron-up"></span>
						<span data-bind="text: title" class="title">Title</span>
					</button>
				</div>
			</section>
			<!--panel-body-->
			<section data-bind="attr: collapse.target" class="panel-collapse collapse">
				<div class="panel-body">
					<div data-bind="foreachprop: data">
						<p>
							<b class="key">
								<span data-bind="text: key"></span>:&nbsp;
							</b>
							<span data-bind="text: value" class="value"></span>
						</p>
					</div>
				</div>
			</section>
		</section>`
	});


/***/ },
/* 19 */
/***/ function(module, exports) {

	function listCard(params) {
		self = this;
	}
	
	module.exports = ko.components.register('totalElements', {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZDIxMmNmZTBkMDQ5MjdmYzdjOWMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9hcGktZXhwbG9yZXIvdjIvVmlld01vZGVscy9tYWluLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL2N1c3RvbUJpbmRpbmdzL2ZvcmVhY2hQcm9wLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL21vZHVsZXMvYmFzZS5qcyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzL2FwaS1leHBsb3Jlci92Mi9tb2R1bGVzL2FwaWtleS5qcyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzL2FwaS1leHBsb3Jlci92Mi9tb2R1bGVzL2FqYXhTZXJ2aWNlLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL1ZpZXdNb2RlbHMvbWVudVZpZXdNb2RlbC5qcyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzL2FwaS1leHBsb3Jlci92Mi9tb2R1bGVzL2hlbHBlckZ1bmMuanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9hcGktZXhwbG9yZXIvdjIvVmlld01vZGVscy9wYXJhbXNWaWV3TW9kZWwuanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9hcGktZXhwbG9yZXIvdjIvVmlld01vZGVscy9tZXRob2RzVmlld01vZGVsLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL1ZpZXdNb2RlbHMvcmVxdWVzdHNMaXN0Vmlld01vZGVsLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL21vZHVsZXMvanNvbi1oaWdobGlnaHQuanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9hcGktZXhwbG9yZXIvdjIvbW9kdWxlcy9oaWdobGlnaHRKc29uLndvcmtlci5qcyIsIndlYnBhY2s6Ly8vRDovdGlja2V0bWFzdGVyLWFwaS1zdGFnaW5nLmdpdGh1Yi5pby9+L3dvcmtlci1sb2FkZXIvY3JlYXRlSW5saW5lV29ya2VyLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL21vZHVsZXMvc2xpZGVyLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL2NvbXBvbmVudHMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9hcGktZXhwbG9yZXIvdjIvY29tcG9uZW50cy9jdXN0b21TZWxlY3QuY29tcG9uZW50LmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL2NvbXBvbmVudHMvY2FyZEdyb3VwLmNvbXBvbmVudC5qcyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzL2FwaS1leHBsb3Jlci92Mi9jb21wb25lbnRzL2NhcmQuY29tcG9uZW50LmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL2NvbXBvbmVudHMvbGlzdENhcmQuY29tcG9uZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxnQkFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFvQztBQUNwQywyQkFBMEI7QUFDMUI7QUFDQSwrQkFBOEIsT0FBTztBQUNyQztBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQzFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFvQix5QkFBeUI7QUFDN0MsSUFBRztBQUNIO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNILG9DQUFtQyxzQkFBc0I7QUFDekQsV0FBVTtBQUNWO0FBQ0E7Ozs7Ozs7QUNoQkE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQOztBQUVBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBOztBQUVBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBOzs7Ozs7O0FDeEdBLHlGQUF3Rjs7QUFFeEY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHOzs7Ozs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBLGlDQUFnQyxXQUFXOztBQUUzQztBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMLDJCQUEwQixrQkFBa0I7QUFDNUMsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7OztBQUdBOzs7Ozs7O0FDbkdBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ25DQTtBQUNBLCtCQUE4QjtBQUM5QjtBQUNBOztBQUVBO0FBQ0Esc0NBQXFDLFVBQVU7O0FBRS9DO0FBQ0E7QUFDQSxVQUFTOztBQUVULG9CQUFtQixVQUFVOztBQUU3QjtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUNBQWdDOztBQUVoQztBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMOzs7Ozs7OztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUF5QztBQUN6Qzs7QUFFQTtBQUNBLGdDQUErQjs7QUFFL0I7QUFDQSw0QkFBMkI7O0FBRTNCOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDBCQUF5QjtBQUN6QjtBQUNBO0FBQ0EsS0FBSTtBQUNKOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQSx3QkFBdUI7O0FBRXZCO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBLGtCQUFpQixPQUFPO0FBQ3hCLG1CQUFrQixPQUFPO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWMsT0FBTztBQUNyQixjQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUNoS0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQSx3QkFBdUI7QUFDdkI7O0FBRUE7QUFDQSxrQ0FBaUMsVUFBVTtBQUMzQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBaUQ7QUFDakQ7QUFDQTs7QUFFQTtBQUNBLGtDQUFpQyxVQUFVO0FBQzNDO0FBQ0E7QUFDQSw2QkFBNEI7O0FBRTVCO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGdCQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQzFJQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0EscURBQW9ELCtCQUErQjtBQUNuRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRTs7QUFFRjtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSTtBQUNKO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUU7QUFDRjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQzdHQSxzQ0FBa0Q7O0FBRWxEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTTtBQUNOLEtBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFNO0FBQ04sS0FBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUN6Q0E7QUFDQSwrREFBOEksMkZBQTJGLG1HQUFtRywrSkFBK0oscUlBQXFJLDRCQUE0Qiw4RUFBOEUsMEpBQTBKLHlGQUF5RixpR0FBaUcsY0FBYyxnSUFBZ0ksdUdBQXVHLDJGQUEyRix5R0FBeUcsWUFBWSwySkFBMkosbUpBQW1KLHlDQUF5Qyw4QkFBOEIsMENBQTBDLDBDQUEwQyxlQUFlLEVBQUUsNENBQTRDLDRCQUE0QixRQUFRLGVBQWUsNkNBQTZDLDZCQUE2QiwwREFBMEQsd0JBQXdCLDZDQUE2QyxTQUFTLDBCQUEwQixRQUFRLDJDQUEyQyxxREFBcUQsUUFBUSw4RUFBOEUsZ0RBQWdELHNCQUFzQixFQUFFLHlDQUF5QywwQkFBMEIscUJBQXFCLHNCQUFzQixTQUFTLG1DQUFtQyxvTkFBb04sU0FBUyxxQ0FBcUMsbWJBQW1iLFNBQVMsMERBQTBELHNOQUFzTixTQUFTLDhNQUE4TSxRQUFRLDhEQUE4RCxzQkFBc0IsK0JBQStCLDBDQUEwQyxxQkFBcUIsV0FBVyx5R0FBeUcsU0FBUyxvQkFBb0IsUUFBUSwwREFBMEQsYUFBYSxnTUFBZ00sU0FBUyxZQUFZLGlIQUFpSCxTQUFTLFFBQVEsa0RBQWtELHNCQUFzQiw4QkFBOEIsZ0JBQWdCLHNDQUFzQyxzQkFBc0IsU0FBUyxvQ0FBb0MsOENBQThDLDRDQUE0QyxRQUFRLGVBQWUsY0FBYyw2Q0FBNkMsY0FBYztBQUN2K0osRzs7Ozs7O0FDRkE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUksV0FBVztBQUNmO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQSxFOzs7Ozs7QUN0QkE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRTtBQUNGOzs7Ozs7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDOzs7Ozs7O0FDTEQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHVEQUFzRDtBQUN0RDtBQUNBO0FBQ0EsMENBQXlDO0FBQ3pDLElBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDJCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFxQyxtQkFBbUIsU0FBUyw4Q0FBOEM7QUFDL0csZ0NBQStCLG9CQUFvQiwrQ0FBK0M7QUFDbEc7QUFDQTtBQUNBLGlDQUFnQyxvQkFBb0I7QUFDcEQseUNBQXdDLHdDQUF3QyxvQkFBb0Isc0JBQXNCLFNBQVMscUJBQXFCO0FBQ3hKO0FBQ0Esb0NBQW1DLFdBQVcsUUFBUSxrQkFBa0IsaUVBQWlFO0FBQ3pJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQzs7Ozs7OztBQ3RGRDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9DQUFtQyx1QkFBdUIsOEVBQThFO0FBQ3hJOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUM7Ozs7Ozs7QUN6Q0Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDOzs7Ozs7O0FDN0NEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDIiwiZmlsZSI6InNjcmlwdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgZDIxMmNmZTBkMDQ5MjdmYzdjOWNcbiAqKi8iLCIvKipcclxuICogTWFpbiBmaWxlIGZvciBBcGkgRXhwbHJlciB2Mi4wXHJcbiAqIEZvciBkZXZlbG9wbWVudCBwbGVhc2UgdXNlIFdlYnBhY2sgdG8gYnVuZGxlIGFsbCBtb2R1bGVzXHJcbiAqIEl0IGNhbiBiZSBtYWRlIHVzaW5nIG5wbSBzY3JpcHRzIGNtZCAtICd3ZWJwYWNrJ1xyXG4gKi9cclxuLy8gY3VzdG9tIGJpbmRpbmdzXHJcbnJlcXVpcmUoJy4uL2N1c3RvbUJpbmRpbmdzL2ZvcmVhY2hQcm9wJyk7XHJcblxyXG4vLyBNb2R1bGVzXHJcbnZhciBiYXNlID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9iYXNlJyk7XHJcbnZhciBhcGlLZXkgPSByZXF1aXJlKCcuLi9tb2R1bGVzL2FwaWtleScpO1xyXG52YXIgYWpheFNlcnZpY2UgPSByZXF1aXJlKCcuLi9tb2R1bGVzL2FqYXhTZXJ2aWNlJyk7XHJcblxyXG4vLyBWaWV3IE1vZGVsc1xyXG52YXIgTWVudVZpZXdNb2RlbCA9IHJlcXVpcmUoJy4uL1ZpZXdNb2RlbHMvbWVudVZpZXdNb2RlbCcpO1xyXG52YXIgUGFyYW1zVmlld01vZGVsID0gcmVxdWlyZSgnLi9wYXJhbXNWaWV3TW9kZWwnKTtcclxudmFyIE1ldGhvZHNWaWV3TW9kZWwgPSByZXF1aXJlKCcuL21ldGhvZHNWaWV3TW9kZWwnKTtcclxudmFyIFJlcXVlc3RzTGlzdFZpZXdNb2RlbCA9IHJlcXVpcmUoJy4vcmVxdWVzdHNMaXN0Vmlld01vZGVsJyk7XHJcblxyXG4vLyBDb21wb25lbnRzXHJcbnJlcXVpcmUoJy4uL2NvbXBvbmVudHMvaW5kZXgnKTtcclxuXHJcbi8qKlxyXG4gKiBNYWluIGFwcGxpY2F0aW9uIHZpZXctbW9kZWxcclxuICogQHBhcmFtIG9iaiB7b2JqZWN0fSBnbG9iYWwgZGF0YSBvYmplY3RcclxuICovXHJcbmZ1bmN0aW9uIEFwcFZpZXdNb2RlbChvYmopIHtcclxuICB2YXIgYmFzZSA9IG9iaiB8fCB7fTtcclxuICBzZWxmID0gdGhpcztcclxuICB0aGlzLmFwaUtleSA9IGFwaUtleTtcclxuXHJcbiAgLy8gb2JzZXJ2YWJsZXNcclxuICB0aGlzLnNlbGVjdGVkQ2F0ZWdvcnkgPSBrby5vYnNlcnZhYmxlKCcnKTtcclxuICB0aGlzLnNlbGVjdGVkTWV0aG9kID0ga28ub2JzZXJ2YWJsZSgnJyk7XHJcbiAgdGhpcy5zZWxlY3RlZFBhcmFtcyA9IGtvLm9ic2VydmFibGVBcnJheShbXSk7XHJcblx0dGhpcy5yZXF1ZXN0cyA9IGtvLm9ic2VydmFibGVBcnJheShbXSk7XHJcblxyXG5cdC8vIGNvbXB1dGVkXHJcbiAgdGhpcy5VUkwgPSBrby5jb21wdXRlZCh0aGlzLmdldFVybCwgdGhpcyk7XHJcbiAgdGhpcy5zZW5kQnV0dG9uVGV4dCA9IGtvLnB1cmVDb21wdXRlZCh0aGlzLmdldE1ldGhvZE5hbWUsIHRoaXMpO1xyXG5cclxuICAvLyBzdWItbW9kZWxzXHJcbiAgdGhpcy5tZW51ID0gbmV3IE1lbnVWaWV3TW9kZWwoYmFzZSwgdGhpcy5zZWxlY3RlZENhdGVnb3J5KTtcclxuICB0aGlzLm1ldGhvZHMgPSBuZXcgTWV0aG9kc1ZpZXdNb2RlbChiYXNlLCB0aGlzLnNlbGVjdGVkQ2F0ZWdvcnksIHRoaXMuc2VsZWN0ZWRNZXRob2QpO1xyXG4gIHRoaXMucGFyYW1zID0gbmV3IFBhcmFtc1ZpZXdNb2RlbChiYXNlLCB0aGlzLnNlbGVjdGVkTWV0aG9kLCB0aGlzLnNlbGVjdGVkUGFyYW1zKTtcclxuICB0aGlzLnJlcXVlc3RzTGlzdCA9IG5ldyBSZXF1ZXN0c0xpc3RWaWV3TW9kZWwodGhpcy5yZXF1ZXN0cywgdGhpcy5zZWxlY3RlZFBhcmFtcyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZW5kIHJlcXVlc3QgbWV0aG9kXHJcbiAqL1xyXG5BcHBWaWV3TW9kZWwucHJvdG90eXBlLm9uQ2xpY2tTZW5kQnRuID0gZnVuY3Rpb24gKCkge1xyXG4gIGFqYXhTZXJ2aWNlKHRoaXMuVVJMKCksIHRoaXMucmVxdWVzdHMsIGJhc2UpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdldHMgY3VycmVudCBtZXRob2QgbmFtZVxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4gKi9cclxuQXBwVmlld01vZGVsLnByb3RvdHlwZS5nZXRNZXRob2ROYW1lID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiB0aGlzLnNlbGVjdGVkTWV0aG9kKCkubWV0aG9kLnRvTG93ZXJDYXNlKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogR2V0cyByYXcgdXJsIGRhdGEgYXJyYXlcclxuICogQHJldHVybnMgeypbXX1cclxuICovXHJcbkFwcFZpZXdNb2RlbC5wcm90b3R5cGUuZ2V0VXJsID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiBbXHJcbiAgICB0aGlzLnNlbGVjdGVkTWV0aG9kKCksXHJcbiAgICB0aGlzLmFwaUtleSxcclxuICAgIHRoaXMuc2VsZWN0ZWRQYXJhbXMoKVxyXG4gIF07XHJcbn07XHJcblxyXG4vKipcclxuICogR2V0cyBkZWVwIHByb3BcclxuICogQHJldHVybnMgeypbXX1cclxuICovXHJcbk9iamVjdC5nZXRQcm9wID0gZnVuY3Rpb24obywgcykge1xyXG5cdGlmICh0eXBlb2YgbyAhPT0gJ29iamVjdCcgfHwgIXMpIHtcclxuXHRcdGNvbnNvbGUubG9nKG8scyk7XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cdHMgPSBzLnJlcGxhY2UoL1xcWyhcXHcrKVxcXS9nLCAnLiQxJyk7IC8vIGNvbnZlcnQgaW5kZXhlcyB0byBwcm9wZXJ0aWVzXHJcblx0cyA9IHMucmVwbGFjZSgvXlxcLi8sICcnKTsgICAgICAgICAgIC8vIHN0cmlwIGEgbGVhZGluZyBkb3RcclxuXHR2YXIgYSA9IHMuc3BsaXQoJy4nKTtcclxuXHRmb3IgKHZhciBpID0gMCwgbiA9IGEubGVuZ3RoOyBpIDwgbjsgKytpKSB7XHJcblx0XHR2YXIgayA9IGFbaV07XHJcblx0XHRpZiAoayBpbiBvKSB7XHJcblx0XHRcdG8gPSBvW2tdO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRyZXR1cm4gbztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBBY3RpdmF0ZXMga25vY2tvdXQuanNcclxuICovXHJcbmtvLmFwcGx5QmluZGluZ3MobmV3IEFwcFZpZXdNb2RlbChiYXNlKSk7XHJcblxyXG4vKipcclxuICogZXhwb3J0cyBnbG9iYWwgdmFyaWFibGVcclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gYmFzZTtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL1ZpZXdNb2RlbHMvbWFpbi5qc1xuICoqIG1vZHVsZSBpZCA9IDFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIiBtb2R1bGUuZXhwb3J0cyA9IGtvLmJpbmRpbmdIYW5kbGVycy5mb3JlYWNocHJvcCA9IHtcclxuXHR0cmFuc2Zvcm1PYmplY3Q6IGZ1bmN0aW9uIChvYmopIHtcclxuXHRcdHZhciBwcm9wZXJ0aWVzID0gW107XHJcblx0XHRrby51dGlscy5vYmplY3RGb3JFYWNoKG9iaiwgZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcclxuXHRcdFx0cHJvcGVydGllcy5wdXNoKHsga2V5OiBrZXksIHZhbHVlOiB2YWx1ZSB9KTtcclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIHByb3BlcnRpZXM7XHJcblx0fSxcclxuXHRpbml0OiBmdW5jdGlvbihlbGVtZW50LCB2YWx1ZUFjY2Vzc29yLCBhbGxCaW5kaW5nc0FjY2Vzc29yLCB2aWV3TW9kZWwsIGJpbmRpbmdDb250ZXh0KSB7XHJcblx0XHR2YXIgcHJvcGVydGllcyA9IGtvLnB1cmVDb21wdXRlZChmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHZhciBvYmogPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHZhbHVlQWNjZXNzb3IoKSk7XHJcblx0XHRcdHJldHVybiBrby5iaW5kaW5nSGFuZGxlcnMuZm9yZWFjaHByb3AudHJhbnNmb3JtT2JqZWN0KG9iaik7XHJcblx0XHR9KTtcclxuXHRcdGtvLmFwcGx5QmluZGluZ3NUb05vZGUoZWxlbWVudCwgeyBmb3JlYWNoOiBwcm9wZXJ0aWVzIH0sIGJpbmRpbmdDb250ZXh0KTtcclxuXHRcdHJldHVybiB7IGNvbnRyb2xzRGVzY2VuZGFudEJpbmRpbmdzOiB0cnVlIH07XHJcblx0fVxyXG59O1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc2NyaXB0cy9hcGktZXhwbG9yZXIvdjIvY3VzdG9tQmluZGluZ3MvZm9yZWFjaFByb3AuanNcbiAqKiBtb2R1bGUgaWQgPSAyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgYmFzZSA9IHt9O1xyXG52YXIgQ09ORklHX1VSTCA9ICcuLi8uLi9hcGlkZXNjcmlwdGlvbi54bWwnO1xyXG5cclxudmFyIHBhcnNlRGF0YSA9IGZ1bmN0aW9uICh4bWwpIHtcclxuXHR2YXIgZ2xvYmFsID0ge307XHJcblx0Ly9nZXQgYWxsIEFQSXNcclxuXHR2YXIgcmVzb3VyY2VzRWwgPSAkKHhtbCkuZmluZChcInJlc291cmNlc1wiKS5lcSgwKTtcclxuXHJcblx0Ly8gcmVzb3VyY2VcclxuXHQkKHhtbClcclxuXHRcdC5maW5kKFwicmVzb3VyY2VcIilcclxuXHRcdC5nZXQoKVxyXG5cdFx0Lm1hcChmdW5jdGlvbiAocmVzKSB7XHJcblx0XHRcdHZhciByZXNvdXJjZSA9ICQocmVzKTtcclxuXHRcdFx0Ly8gbWV0aG9kIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0XHRcdHZhciBtZXRob2RFbGVtID0gcmVzb3VyY2UuZmluZChcIm1ldGhvZFwiKS5lcSgwKTtcclxuXHJcblx0XHRcdHZhciBtZXRob2QgPSB7XHJcblx0XHRcdFx0aWQgOiBtZXRob2RFbGVtLmF0dHIoXCJpZFwiKSwgLy8gbWV0aG9kIGlkXHJcblx0XHRcdFx0bmFtZSA6IG1ldGhvZEVsZW0uYXR0cihcImFwaWdlZTpkaXNwbGF5TmFtZVwiKSB8fCBtZXRob2RFbGVtLmF0dHIoXCJpZFwiKSwgLy8gbWV0aG9kIG5hbWVcclxuXHRcdFx0XHRtZXRob2QgOiBtZXRob2RFbGVtLmF0dHIoJ25hbWUnKSwgLy8gR0VUIG9yIFBPU1RcclxuXHRcdFx0XHRjYXRlZ29yeSA6IG1ldGhvZEVsZW0uZmluZCgnW3ByaW1hcnk9XCJ0cnVlXCJdJykudGV4dCgpLnRyaW0oKSwgLy8gQVBJIG5hbWVcclxuXHRcdFx0XHRwYXRoOiByZXNvdXJjZS5hdHRyKCdwYXRoJyksIC8vIG1ldGhvZCBVUkxcclxuXHRcdFx0XHRiYXNlIDogcmVzb3VyY2VzRWwuYXR0cignYmFzZScpLCAvLyBtZXRob2QgYmFzZSBsaW5rXHJcblx0XHRcdFx0bGluayA6IG1ldGhvZEVsZW0uZmluZCgnZG9jJykuZXEoMCkuYXR0cignYXBpZ2VlOnVybCcpLCAvLyBsaW5rIHRvIGRvY3VtZW50YXRpb25cclxuXHRcdFx0XHRkZXNjcmlwdGlvbiA6IG1ldGhvZEVsZW0uZmluZCgnZG9jJykuZXEoMCkudGV4dCgpLnRyaW0oKSwgLy9tZXRob2QgZGVzY3JpcHRpb25cclxuXHRcdFx0XHRwYXJhbWV0ZXJzOiB7fVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0Ly8gcGFyYW1zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0XHRcdHJlc291cmNlXHJcblx0XHRcdFx0LmZpbmQoJ3BhcmFtJylcclxuXHRcdFx0XHQuZ2V0KClcclxuXHRcdFx0XHQubWFwKGZ1bmN0aW9uIChwYXIpIHtcclxuXHRcdFx0XHRcdHZhciBwYXJhbSA9ICQocGFyKTtcclxuXHRcdFx0XHRcdHZhciBvcHRpb25zID0gcGFyYW0uZmluZCgnb3B0aW9uJyk7XHJcblx0XHRcdFx0XHR2YXIgaXNTZWxlY3QgPSAhIW9wdGlvbnMubGVuZ3RoO1xyXG5cclxuXHRcdFx0XHRcdHZhciBwYXJhbWV0ZXIgPSB7XHJcblx0XHRcdFx0XHRcdG5hbWU6IHBhcmFtLmF0dHIoJ25hbWUnKSxcclxuXHRcdFx0XHRcdFx0ZG9jOiBwYXJhbS5maXJzdCgnZG9jJykudGV4dCgpLnRyaW0oKSxcclxuXHRcdFx0XHRcdFx0c3R5bGU6IHBhcmFtLmF0dHIoJ3N0eWxlJyksXHJcblx0XHRcdFx0XHRcdHJlcXVpcmVkOiBwYXJhbS5hdHRyKCdyZXF1aXJlZCcpLFxyXG5cdFx0XHRcdFx0XHRkZWZhdWx0OiBwYXJhbS5hdHRyKCdkZWZhdWx0JykgPT09ICdub25lJyAmJiBpc1NlbGVjdCA/ICcnIDogcGFyYW0uYXR0cignZGVmYXVsdCcpLFxyXG5cdFx0XHRcdFx0XHRzZWxlY3Q6IGlzU2VsZWN0XHJcblx0XHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRcdGlmIChpc1NlbGVjdCkge1xyXG5cdFx0XHRcdFx0XHRwYXJhbWV0ZXIub3B0aW9ucyA9IG9wdGlvbnMuZ2V0KCkubWFwKGZ1bmN0aW9uIChvcHRpb24pIHtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdFx0XHRcdFx0bmFtZTogJChvcHRpb24pLmF0dHIoJ3ZhbHVlJyksXHJcblx0XHRcdFx0XHRcdFx0XHRjaGVja2VkOiAkKG9wdGlvbikuYXR0cigndmFsdWUnKSA9PT0gcGFyYW1ldGVyLmRlZmF1bHQgfHwgJChvcHRpb24pLmF0dHIoJ3ZhbHVlJykgPT09ICdub25lJyxcclxuXHRcdFx0XHRcdFx0XHRcdGxpbms6IGZhbHNlXHJcblx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0bWV0aG9kLnBhcmFtZXRlcnNbcGFyYW1ldGVyLm5hbWVdID0gcGFyYW1ldGVyO1xyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0LyoqXHJcblx0XHRcdCAqIEdsb2JhbCBvYmogY29tcG9zaXRpb25cclxuICAgICAgICovXHJcblx0XHRcdC8vIHNldCBjYXRlZ29yeSBvYmpcclxuXHRcdFx0Z2xvYmFsW21ldGhvZC5jYXRlZ29yeV0gPSBnbG9iYWxbbWV0aG9kLmNhdGVnb3J5XSB8fCB7fTtcclxuXHJcblx0XHRcdC8vIHNldCBtZXRob2RzIHR5cGUgb2JqXHJcblx0XHRcdGdsb2JhbFttZXRob2QuY2F0ZWdvcnldLkFMTCA9IGdsb2JhbFttZXRob2QuY2F0ZWdvcnldLkFMTCB8fCB7fTtcclxuXHRcdFx0Z2xvYmFsW21ldGhvZC5jYXRlZ29yeV1bbWV0aG9kLm1ldGhvZF0gPSBnbG9iYWxbbWV0aG9kLmNhdGVnb3J5XVttZXRob2QubWV0aG9kXSB8fCB7fTtcclxuXHJcblx0XHRcdC8vIHNldCBtZXRob2Qgb2JqXHJcblx0XHRcdGdsb2JhbFttZXRob2QuY2F0ZWdvcnldLkFMTFttZXRob2QuaWRdID0gbWV0aG9kO1xyXG5cdFx0XHRnbG9iYWxbbWV0aG9kLmNhdGVnb3J5XVttZXRob2QubWV0aG9kXVttZXRob2QuaWRdID0gbWV0aG9kO1xyXG5cdFx0fSk7XHJcblxyXG5cdHJldHVybiBnbG9iYWw7XHJcbn07XHJcblxyXG4vL2dldHMgZG9jdW1lbnQgZnJvbSBXQURMIGNvbmZpZ3VyYXRpb24gZmlsZVxyXG52YXIgcmVhZEZyb21XQURMID0gZnVuY3Rpb24gKCkge1xyXG4gICQuYWpheCh7XHJcbiAgICB1cmw6IENPTkZJR19VUkwsXHJcbiAgICBhc3luYyA6IGZhbHNlLFxyXG4gICAgZGF0YVR5cGU6ICgkLmJyb3dzZXIubXNpZSkgPyBcInRleHRcIiA6IFwieG1sXCIsXHJcbiAgICBzdWNjZXNzIDogZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICB2YXIgeG1sO1xyXG5cclxuICAgICAgaWYgKHR5cGVvZiByZXNwb25zZSA9PSBcInN0cmluZ1wiKXtcclxuICAgICAgICB4bWwgPSBuZXcgQWN0aXZlWE9iamVjdChcIk1pY3Jvc29mdC5YTUxET01cIik7XHJcbiAgICAgICAgeG1sLmFzeW5jID0gZmFsc2U7XHJcbiAgICAgICAgeG1sLmxvYWRYTUwocmVzcG9uc2UpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHhtbCA9IHJlc3BvbnNlO1xyXG4gICAgICB9XHJcblxyXG5cdFx0XHRiYXNlID0gcGFyc2VEYXRhKHhtbCk7XHJcbiAgICB9LFxyXG5cclxuICAgIGVycm9yOiBmdW5jdGlvbihYTUxIdHRwUmVxdWVzdCwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pe1xyXG4gICAgICBhbGVydCgnRGF0YSBDb3VsZCBOb3QgQmUgTG9hZGVkIC0gJysgdGV4dFN0YXR1cyk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn07XHJcbnJlYWRGcm9tV0FETCgpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2U7XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zY3JpcHRzL2FwaS1leHBsb3Jlci92Mi9tb2R1bGVzL2Jhc2UuanNcbiAqKiBtb2R1bGUgaWQgPSAzXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgYXBpS2V5ID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgndGstYXBpLWtleScpIHx8IFwiN2VseGRrdTlHR0c1azhqMFhtOEtXZEFORGdlY0hNVjBcIjsgLy9BUEkgS2V5XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICBuYW1lOiAnYXBpa2V5JyxcclxuICBzdHlsZTogJ3F1ZXJ5JyxcclxuICB2YWx1ZToga28ub2JzZXJ2YWJsZShhcGlLZXkpXHJcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL21vZHVsZXMvYXBpa2V5LmpzXG4gKiogbW9kdWxlIGlkID0gNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXHJcbiAqIEFqYXggU2VydmljZVxyXG4gKiBAcGFyYW0gdXJsXHJcbiAqIEBwYXJhbSBtZXRob2RcclxuICogQHBhcmFtIGNhbGxiYWNrXHJcbiAqL1xyXG52YXIgYWpheFNlcnZpY2UgPSBmdW5jdGlvbiAodXJsLCBtZXRob2QsIGNhbGxiYWNrKSB7XHJcbiAgJC5hamF4KHtcclxuICAgIHR5cGU6IG1ldGhvZCxcclxuICAgIHVybDogdXJsLFxyXG4gICAgYXN5bmM6IHRydWUsXHJcbiAgICBkYXRhVHlwZTogXCJqc29uXCIsXHJcbiAgICBjb21wbGV0ZTogY2FsbGJhY2tcclxuICB9KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBGaWx0ZXJzIGFuZCBwcmVwYXJlcyBwYXJhbXMgcGFpcnNcclxuICogQHBhcmFtIGFyclxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICovXHJcbnZhciBwcmVwYXJlVXJsID0gZnVuY3Rpb24gKGFycikge1xyXG4gIHZhciByZXBsYWNlbWVudCwgdXJsLCBkb21haW4sIHBhdGgsIG1ldGhvZCwgYXBpS2V5LCBwYXJhbXM7XHJcblxyXG4gIGlmICghYXJyICYmICFhcnIubGVuZ3RoKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG4gIFxyXG4gIGRvbWFpbiA9IGFyclswXS5iYXNlO1xyXG4gIHBhdGggPSBhcnJbMF0ucGF0aDtcclxuICBhcGlLZXkgPSBhcnJbMV07XHJcbiAgcGFyYW1zID0gYXJyWzJdLmZpbHRlcihmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgcmV0dXJuIGl0ZW0uc3R5bGUgPT09ICdxdWVyeSc7XHJcbiAgfSk7XHJcblxyXG4gIC8vIGFyciBvZiB0ZW1wbGF0ZSBtYXJrc1xyXG4gIHJlcGxhY2VtZW50ID0gcGF0aC5tYXRjaCgvKFtee10qPylcXHcoPz1cXH0pL2dtaSk7XHJcblxyXG4gIC8vIGFyciBvZiB0ZW1wbGF0ZSBwYXJhbXNcclxuICB2YXIgdGVtcGxhdGVzQXJyID0gYXJyWzJdLmZpbHRlcihmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgcmV0dXJuIGl0ZW0uc3R5bGUgPT09ICd0ZW1wbGF0ZSc7XHJcbiAgfSk7XHJcblxyXG4gIC8vIHJlcGxhY2VtZW50XHJcbiAgcmVwbGFjZW1lbnQuZm9yRWFjaChmdW5jdGlvbiAodmFsKSB7XHJcbiAgICB2YXIgcGFyYW0gPSB0ZW1wbGF0ZXNBcnIuZmluZChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICByZXR1cm4gaXRlbS5uYW1lID09PSB2YWw7XHJcbiAgICB9KTtcclxuICAgIHBhdGggPSBwYXRoLnJlcGxhY2UoJ3snKyBwYXJhbS5uYW1lICsgJ30nLCBwYXJhbS52YWx1ZSgpIHx8IHBhcmFtLmRlZmF1bHQpO1xyXG4gIH0pO1xyXG5cclxuICAvLyBhZGRzIGFwaUtleSBwYXJhbVxyXG4gIGlmICghcGFyYW1zWzBdIHx8IHBhcmFtc1swXS5uYW1lICE9PSAnYXBpa2V5Jykge1xyXG4gICAgcGFyYW1zLnVuc2hpZnQoYXBpS2V5KTtcclxuICB9XHJcblxyXG4gIC8vIHByZXBhcmVzIHBhcmFtcyBwYXJ0IG9mIHVybFxyXG4gIHBhcmFtcyA9IHBhcmFtcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgcmV0dXJuIFtpdGVtLm5hbWUsIGl0ZW0udmFsdWUoKSB8fCBpdGVtLmRlZmF1bHRdLmpvaW4oJz0nKTtcclxuICAgIH0pLmpvaW4oJyYnKTtcclxuXHJcbiAgdXJsID0gW2RvbWFpbiwgJy8nLCBwYXRoLCAnPycsIHBhcmFtc10uam9pbignJyk7XHJcblxyXG4gIHJldHVybiBlbmNvZGVVUkkodXJsKTtcclxufTtcclxuXHJcbi8vIHNlbmRzIHJlcXVlc3QgdG8gZ2V0IHRoZSBzZWNvbmQgY29sdW1uXHJcbnZhciBzZW5kUHJpbWFyeVJlcXVlc3QgPSBmdW5jdGlvbiAoYXJyLCByZXF1ZXN0cywgZ2xvYmFsKSB7XHJcbiAgLy8gY29uc29sZS5jbGVhcigpO1xyXG4gIHZhciB1cmwgPSBwcmVwYXJlVXJsKGFycik7XHJcbiAgLy8gY29uc29sZS5sb2codXJsKTtcclxuXHJcbiAgYWpheFNlcnZpY2UodXJsLCBhcnJbMF0ubWV0aG9kLCBmdW5jdGlvbihyZXMsIG1zZykge1xyXG5cdFx0dmFyIHJlc09iaiA9IHtcclxuXHRcdFx0cmVxOiB1cmwsXHJcblx0XHRcdGluZGV4OiByZXF1ZXN0cygpLmxlbmd0aFxyXG5cdFx0fTtcclxuXHJcblx0XHRpZiAobXNnID09ICdlcnJvcicpIHtcclxuXHRcdFx0dmFyIGVyciA9IHJlcyAmJlxyXG5cdFx0XHRcdHJlcy5yZXNwb25zZUpTT04gJiZcclxuXHRcdFx0XHRyZXMucmVzcG9uc2VKU09OLmVycm9ycyAmJlxyXG5cdFx0XHRcdHJlcy5yZXNwb25zZUpTT04uZXJyb3JzWzBdO1xyXG5cclxuXHRcdFx0cmVzT2JqLmVycm9yID0ge1xyXG5cdFx0XHRcdGNvZGU6IGVyciA/IGVyci5jb2RlOiA1MDAsXHJcblx0XHRcdFx0bWVzc2FnZTogZXJyID8gZXJyLmRldGFpbDogJ05vIHJlc3BvbmNlIGRhdGEhJ1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRnbG9iYWwubGFzdFJlc3BvbnNlID0gcmVzLnJlc3BvbnNlSlNPTjtcclxuXHRcdFx0cmVzT2JqLnJlcyA9IHJlcy5yZXNwb25zZUpTT047XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZXhwb3J0aW5nIGRhdGEgdXNpbmcgb2JzZXJ2YWJsZVxyXG5cdFx0cmVxdWVzdHMudW5zaGlmdChyZXNPYmopO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2VuZFByaW1hcnlSZXF1ZXN0O1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc2NyaXB0cy9hcGktZXhwbG9yZXIvdjIvbW9kdWxlcy9hamF4U2VydmljZS5qc1xuICoqIG1vZHVsZSBpZCA9IDVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBoZiA9IHJlcXVpcmUoJy4uL21vZHVsZXMvaGVscGVyRnVuYycpO1xyXG52YXIgc2VsZjtcclxuXHJcblxyXG4vKipcclxuICogTWVudSBWaWV3LU1vZGVsXHJcbiAqIEBwYXJhbSBiYXNlXHJcbiAqIEBwYXJhbSBjYXRlZ29yeVxyXG4gKiBAY29uc3RydWN0b3JcclxuICovXHJcbmZ1bmN0aW9uIE1lbnVWaWV3TW9kZWwoYmFzZSwgY2F0ZWdvcnkpIHtcclxuICBzZWxmID0gdGhpcztcclxuICB0aGlzLmNhdGVnb3J5ID0gY2F0ZWdvcnk7XHJcbiAgdGhpcy5jYXRlZ29yaWVzID0ga28ub2JzZXJ2YWJsZUFycmF5KE9iamVjdC5rZXlzKGJhc2UpLm1hcChmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGNoZWNrZWQ6IGtvLm9ic2VydmFibGUoIWluZGV4KSxcclxuICAgICAgbmFtZTogaXRlbSxcclxuICAgICAgbGluazogZmFsc2VcclxuICAgIH1cclxuICB9KSk7XHJcblxyXG4gIC8vIGluaXRpYWwgbG9hZFxyXG4gIHRoaXMuc2VsZWN0Q2F0ZWdvcnkodGhpcy5jYXRlZ29yaWVzKClbMF0pO1xyXG59XHJcblxyXG4vKipcclxuICogTWVudSBWaWV3LU1vZGVsIG1ldGhvZFxyXG4gKiBAcGFyYW0gY2F0ZWdvcnlcclxuICovXHJcbk1lbnVWaWV3TW9kZWwucHJvdG90eXBlLnNlbGVjdENhdGVnb3J5ID0gZnVuY3Rpb24gKGNhdGVnb3J5KSB7XHJcbiAgdmFyIGNhdGVnb3J5TmFtZSA9IGNhdGVnb3J5Lm5hbWU7XHJcbiAgc2VsZi5jYXRlZ29yeShjYXRlZ29yeU5hbWUpO1xyXG4gIGhmLmNoZWNrQWN0aXZlKHNlbGYuY2F0ZWdvcmllcywgY2F0ZWdvcnlOYW1lKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWVudVZpZXdNb2RlbDtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL1ZpZXdNb2RlbHMvbWVudVZpZXdNb2RlbC5qc1xuICoqIG1vZHVsZSBpZCA9IDZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImV4cG9ydHMuZ2V0TW9kZWxBcnJheSA9IGZ1bmN0aW9uIGdldE1vZGVsQXJyYXkocGFyYW1zKSB7XHJcbiAgICB2YXIgb2JqID0gcGFyYW1zLm9iaiB8fCB7fSxcclxuICAgICAgICBhcnIgPSBwYXJhbXMuYXJyIHx8IFtdLFxyXG4gICAgICAgIHByb3AgPSBwYXJhbXMucHJvcCB8fCAnbmFtZSc7XHJcblxyXG4gICAgZm9yICh2YXIgaSBpbiBvYmopIHtcclxuICAgICAgICBpZiAoIW9iai5oYXNPd25Qcm9wZXJ0eShpKSkgeyBjb250aW51ZTsgfVxyXG5cclxuICAgICAgICB2YXIgaXRlbSA9IGFyci5maW5kKGZ1bmN0aW9uIChtMSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbTEubmFtZSA9PT0gb2JqW2ldW3Byb3BdO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAoaXRlbSkgeyBjb250aW51ZTsgfVxyXG5cclxuICAgICAgICBhcnIucHVzaCh7XHJcbiAgICAgICAgICAgIGNoZWNrZWQ6IGtvLm9ic2VydmFibGUoZmFsc2UpLFxyXG4gICAgICAgICAgICBuYW1lOiBvYmpbaV1bcHJvcF1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiBhcnI7XHJcbn07XHJcblxyXG5leHBvcnRzLmNoZWNrQWN0aXZlID0gZnVuY3Rpb24gY2hlY2tBY3RpdmUoa29BcnIsIGFjdGl2ZUVsZW0pIHtcclxuICAgIGlmICgha29BcnIgJiYgIWFjdGl2ZUVsZW0pIHtyZXR1cm4gZmFsc2U7fVxyXG5cclxuICAgIGtvQXJyKGtvQXJyKCkubWFwKGZ1bmN0aW9uIChvYmopIHtcclxuICAgICAgICBpZiAob2JqLm5hbWUgPT09IGFjdGl2ZUVsZW0pIHtcclxuICAgICAgICAgICAgb2JqLmNoZWNrZWQodHJ1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgb2JqLmNoZWNrZWQoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgfSkpO1xyXG59O1xyXG5cclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL21vZHVsZXMvaGVscGVyRnVuYy5qc1xuICoqIG1vZHVsZSBpZCA9IDdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBzZWxmO1xyXG52YXIgYmFzZTtcclxudmFyIGhmID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9oZWxwZXJGdW5jJyk7XHJcbi8qKlxyXG4gKiBQYXJhbXMgVmlldy1Nb2RlbFxyXG4gKiBAcGFyYW0gcmF3XHJcbiAqIEBwYXJhbSBtZXRob2RcclxuICogQHBhcmFtIHBhcmFtc1xyXG4gKiBAY29uc3RydWN0b3JcclxuICovXHJcbmZ1bmN0aW9uIFBhcmFtc1ZpZXdNb2RlbChyYXcsIG1ldGhvZCwgcGFyYW1zKSB7XHJcbiAgYmFzZSA9IHJhdztcclxuICBzZWxmID0gdGhpcztcclxuICB0aGlzLmFuaW1hdGlvblNwZWVkID0gMjAwO1xyXG5cclxuICAvLyBvYnNlcnZhYmxlc1xyXG4gIHRoaXMubWV0aG9kID0gbWV0aG9kO1xyXG4gIHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG4gIHRoaXMuaXNIaWRkZW4gPSBrby5vYnNlcnZhYmxlKHRydWUpO1xyXG4gIHRoaXMucGFyYW1JbkZvY3VzID0ga28ub2JzZXJ2YWJsZSgnJyk7XHJcblx0dGhpcy5wYXJhbXNNb2RlbCA9IGtvLm9ic2VydmFibGVBcnJheShbXSk7XHJcblxyXG5cdC8vIGNvbXB1dGVkXHJcblx0Ly8gdGhpcy5wYXJhbXNNb2RlbCA9IGtvLmNvbXB1dGVkKHRoaXMudXBkYXRlUGFyYW1zTW9kZWwsIHRoaXMpO1xyXG5cdHRoaXMudXBkYXRlVmlld01vZGVsKCk7XHJcblx0dGhpcy5tZXRob2Quc3Vic2NyaWJlKHRoaXMudXBkYXRlVmlld01vZGVsLCB0aGlzKTtcclxuXHJcblx0dGhpcy5pc0RpcnR5ID0ga28uY29tcHV0ZWQodGhpcy5jaGVja0RpcnR5LCB0aGlzKTtcclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKiBJbml0aWFsIGJ1aWxkIG9mIFNlbGVjdCBNb2RlbFxyXG4gKi9cclxuUGFyYW1zVmlld01vZGVsLnByb3RvdHlwZS51cGRhdGVWaWV3TW9kZWwgPSBmdW5jdGlvbiAoKSB7XHJcblx0dmFyIG9iaiA9IHRoaXMubWV0aG9kKCkucGFyYW1ldGVycyB8fCB7fSxcclxuXHRcdGFyciA9IFtdO1xyXG5cclxuXHRmb3IgKHZhciBpIGluIG9iaikge1xyXG5cdFx0aWYgKCFvYmouaGFzT3duUHJvcGVydHkoaSkpIHtjb250aW51ZTt9XHJcblxyXG5cdFx0Ly8gY29waWVzIGFsbCB2YWx1ZXMgZnJvbSBtb2RlbCB0byB2aWV3LW1vZGVsXHJcblx0XHR2YXIgdm1QYXJhbSA9ICQuZXh0ZW5kKHt9LCBvYmpbaV0pO1xyXG5cclxuXHRcdHZtUGFyYW0udmFsdWUgPSBrby5vYnNlcnZhYmxlKHZtUGFyYW0udmFsdWUgfHwgKHZtUGFyYW0uc2VsZWN0ICYmIHZtUGFyYW0uZGVmYXVsdCkgfHwgJycpO1xyXG5cclxuXHRcdC8vYWRkIG9ic2VydmFibGUgZm9yIHNlbGVjdGVkIG9wdGlvbnNcclxuXHRcdGlmICh2bVBhcmFtLnNlbGVjdCkge1xyXG5cdFx0XHR2bVBhcmFtLm9wdGlvbnMgPSBrby5vYnNlcnZhYmxlQXJyYXkob2JqW2ldLm9wdGlvbnMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XHJcblx0XHRcdFx0dmFyIG9iaiA9ICQuZXh0ZW5kKHt9LCBpdGVtKTtcclxuXHRcdFx0XHRvYmouY2hlY2tlZCA9IGtvLm9ic2VydmFibGUoaXRlbS5jaGVja2VkKTtcclxuXHRcdFx0XHRyZXR1cm4gb2JqO1xyXG5cdFx0XHR9KSlcclxuXHRcdH1cclxuXHJcblx0XHQvLyAnZGlydHknIGZsYWcgd2F0Y2hlciBmb3IgY3VycmVudCBmaWVsZFxyXG5cdFx0dm1QYXJhbS5pc0RpcnR5ID0ga28ucHVyZUNvbXB1dGVkKGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aWYgKHRoaXMuc2VsZWN0KSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMudmFsdWUoKSAhPT0gdGhpcy5kZWZhdWx0ICYmIHRoaXMudmFsdWUoKSAhPT0gJ25vbmUnO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiAhISh0aGlzLnZhbHVlKCkudG9TdHJpbmcoKSkudHJpbSgpLmxlbmd0aDtcclxuXHRcdH0sIHZtUGFyYW0pO1xyXG5cclxuXHRcdC8vIGFkZCBjYWxlbmRhciBidG4gZm9yIGN1cnJlbnQgZmllbGRcclxuXHRcdHZtUGFyYW0uaGFzQ2FsZW5kYXIgPSBpLnNlYXJjaCgvKGRhdGV8dGltZSkvZ21pKSAhPSAtMTtcclxuXHJcblx0XHQvLyBhZGQgcG9wLXVwIGJ0biBmb3IgY3VycmVudCBmaWVsZFxyXG5cdFx0dm1QYXJhbS5oYXNQb3BVcCA9IGkuc2VhcmNoKC8oYXR0cmFjdGlvbklkfHZlbnVlSWQpL2dtaSkgIT0gLTE7XHJcblxyXG5cdFx0YXJyLnB1c2godm1QYXJhbSk7XHJcblx0fVxyXG5cclxuXHQvLyBwcmVwYXJlIG91dHB1dCBmb3IgcmVxdWVzdFxyXG5cdHRoaXMucGFyYW1zTW9kZWwoYXJyKTtcclxuXHR0aGlzLnBhcmFtSW5Gb2N1cyh0aGlzLnBhcmFtc01vZGVsKClbMF0pO1xyXG5cdHRoaXMucHJlcGFyZVVybFBhaXJzKGFyciwgdGhpcy5wYXJhbXMpO1xyXG5cdHJldHVybiBhcnI7XHJcbn07XHJcblxyXG4vKipcclxuICogRGlydHkgcGFyYW1zIGZvcm0gb2JzZXJ2YWJsZSBtZXRob2RcclxuICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAqL1xyXG5QYXJhbXNWaWV3TW9kZWwucHJvdG90eXBlLmNoZWNrRGlydHkgPSBmdW5jdGlvbiAoKSB7XHJcblx0dGhpcy5wcmVwYXJlVXJsUGFpcnModGhpcy5wYXJhbXNNb2RlbCgpLCB0aGlzLnBhcmFtcyk7XHJcblx0dmFyIGRpcnR5ID0gdGhpcy5wYXJhbXNNb2RlbCgpLmZpbHRlcihmdW5jdGlvbiAoaXRlbSkge1xyXG5cdFx0cmV0dXJuIGl0ZW0uaXNEaXJ0eSgpID09PSB0cnVlO1xyXG5cdH0pO1xyXG5cdHJldHVybiBkaXJ0eS5sZW5ndGggPiAwO1xyXG59O1xyXG5cclxuXHJcbi8qKlxyXG4gKiBFbnRlciBrZXkgaGFuZGxlclxyXG4gKiBAcGFyYW0gbW9kZWxcclxuICogQHBhcmFtIGV2ZW50XHJcbiAqL1xyXG5QYXJhbXNWaWV3TW9kZWwucHJvdG90eXBlLm9uRW50ZXJLZXlEb3duID0gZnVuY3Rpb24gKG1vZGVsLCBldmVudCkge1xyXG4gIGlmIChldmVudC5rZXlDb2RlID09PSAxMykge1xyXG4gICAgJCgnI2FwaS1leHAtZ2V0LWJ0bicpLnRyaWdnZXIoJ2NsaWNrJyk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBTbGlkZSB0b2dnbGUgZm9yIHBhcmFtcyBjb250YWluZXIgbWV0aG9kXHJcbiAqIEBwYXJhbSB2aWV3TW9kZWxcclxuICogQHBhcmFtIGV2ZW50XHJcbiAqL1xyXG5QYXJhbXNWaWV3TW9kZWwucHJvdG90eXBlLnNsaWRlVG9nZ2xlID0gZnVuY3Rpb24gKHZpZXdNb2RlbCwgZXZlbnQpIHtcclxuICAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpXHJcbiAgICAucGFyZW50cygnLmpzLXNsaWRlLWNvbnRyb2wnKVxyXG4gICAgLmZpbmQoJy5qcy1zbGlkZS13cmFwcGVyJylcclxuICAgIC5zbGlkZVRvZ2dsZSh2aWV3TW9kZWwuYW5pbWF0aW9uU3BlZWQsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmlld01vZGVsLmlzSGlkZGVuKCF2aWV3TW9kZWwuaXNIaWRkZW4oKSk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBNYWNoZXMgZm9jdXNlZCBwYXJhbVxyXG4gKiBAcGFyYW0gaXRlbVxyXG4gKi9cclxuUGFyYW1zVmlld01vZGVsLnByb3RvdHlwZS5vbkZvY3VzID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICBzZWxmLnBhcmFtSW5Gb2N1cyhpdGVtKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBGaWx0ZXJzIHBhcmFtcyBieSBkZWZpbmVkIHZhbHVlXHJcbiAqIEBwYXJhbSBhcnJcclxuICogQHBhcmFtIGtvT2JzXHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cclxuUGFyYW1zVmlld01vZGVsLnByb3RvdHlwZS5wcmVwYXJlVXJsUGFpcnMgPSBmdW5jdGlvbiAoYXJyLCBrb09icykge1xyXG4gIGlmICghYXJyICYmICFrb09icykge3JldHVybiBmYWxzZTt9XHJcblxyXG4gIHJldHVybiBrb09icyhhcnIuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICByZXR1cm4gKGl0ZW0udmFsdWUoKSB8fCBpdGVtLmRlZmF1bHQpO1xyXG4gIH0pKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBPbiBzZWxlY3QgdmFsdWUgaGFuZGxlciBmb3IgcGFyYW1zIHNlbGVjdFxyXG4gKiBAcGFyYW0gcGFyYW0ge29iamVjdH0gcGFyYW1ldGVyIHZpZXctbW9kZWxcclxuICogQHBhcmFtIG9wdGlvbiB7b2JqZWN0fSBvcHRpb24gdmlldy1tb2RlbFxyXG4gKi9cclxuUGFyYW1zVmlld01vZGVsLnByb3RvdHlwZS5vblNlbGVjdFBhcmFtVmFsdWUgPSBmdW5jdGlvbiAocGFyYW0sIG9wdGlvbikge1xyXG5cdGhmLmNoZWNrQWN0aXZlKHBhcmFtLm9wdGlvbnMsIG9wdGlvbi5uYW1lKTtcclxuXHRwYXJhbS52YWx1ZShvcHRpb24ubmFtZSk7XHJcbn07XHJcblxyXG4vKipcclxuICogUGFyYW1zIGNsZWFyIGJ1dHRvbiBoYW5kbGVyXHJcbiAqIEBwYXJhbSB2bSB7b2JqZWN0fSB2aWV3IG1vZGVsXHJcbiAqIEBwYXJhbSBlIHtvYmplY3R9IGV2ZW50XHJcbiAqL1xyXG5QYXJhbXNWaWV3TW9kZWwucHJvdG90eXBlLm9uUGFyYW1zQ2xlYXIgPSBmdW5jdGlvbiAodm0sIGUpIHtcclxuXHR0aGlzLnVwZGF0ZVZpZXdNb2RlbCgpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQYXJhbXNWaWV3TW9kZWw7XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zY3JpcHRzL2FwaS1leHBsb3Jlci92Mi9WaWV3TW9kZWxzL3BhcmFtc1ZpZXdNb2RlbC5qc1xuICoqIG1vZHVsZSBpZCA9IDhcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBoZiA9IHJlcXVpcmUoJy4uL21vZHVsZXMvaGVscGVyRnVuYycpO1xyXG52YXIgc2VsZjtcclxudmFyIGJhc2U7XHJcbnZhciBjYXRlZ29yeTtcclxuXHJcbi8qKlxyXG4gKiBNZXRob2RzIFZpZXctTW9kZWxcclxuICogQHBhcmFtIHJhd1xyXG4gKiBAcGFyYW0gY2F0ZWdvcnlcclxuICogQHBhcmFtIG1ldGhvZFxyXG4gKiBAY29uc3RydWN0b3JcclxuICovXHJcbmZ1bmN0aW9uIE1ldGhvZHNWaWV3TW9kZWwocmF3LCBjYXRlZ29yeSwgbWV0aG9kKSB7XHJcbiAgc2VsZiA9IHRoaXM7XHJcbiAgYmFzZSA9IHJhdztcclxuXHJcbiAgLy8gb2JzZXJ2YWJsZXNcclxuICB0aGlzLmNhdGVnb3J5ID0gY2F0ZWdvcnk7XHJcbiAgdGhpcy5tZXRob2QgPSBtZXRob2Q7XHJcbiAgdGhpcy50b2dnbGVQb3BVcCA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xyXG4gIHRoaXMucmFkaW9zTW9kZWwgPSBrby5vYnNlcnZhYmxlQXJyYXkoW10pO1xyXG4gIHRoaXMubWV0aG9kc1ZpZXdNb2RlbCA9IGtvLm9ic2VydmFibGVBcnJheShbXSk7XHJcbiAgdGhpcy51cGRhdGVNb2RlbCh0aGlzLmNhdGVnb3J5KCkpO1xyXG4gIHRoaXMuY2F0ZWdvcnkuc3Vic2NyaWJlKHRoaXMudXBkYXRlTW9kZWwsIHRoaXMpO1xyXG59XHJcblxyXG4vKipcclxuICogT24gY2F0ZWdvcnkgY2hhbmdlIGhhbmRsZXJcclxuICogTWV0aG9kcyBWaWV3LU1vZGVsIG1ldGhvZFxyXG4gKiBAcGFyYW0gY2F0ZWdvcnlcclxuICovXHJcbk1ldGhvZHNWaWV3TW9kZWwucHJvdG90eXBlLnVwZGF0ZU1vZGVsID0gZnVuY3Rpb24gKGNhdGVnb3J5KSB7XHJcbiAgLy8gaW5pdGlhbCByYWRpb3MgbW9kZWxcclxuICBzZWxmLnVwZGF0ZVJhZGlvc01vZGVsKGJhc2VbY2F0ZWdvcnldKTtcclxuICAvLyBpbml0aWFsIHNlbGVjdCBtb2RlbCAoZmlyc3QgbWV0aG9kIGluIGZpcnN0IHNlY3Rpb24gZm9yIHN0YXJ0KVxyXG4gIHNlbGYudXBkYXRlU2VsZWN0KHNlbGYucmFkaW9zTW9kZWwoKVswXSk7XHJcbn07XHJcblxyXG4vKipcclxuICogT25jaGFuZ2UgaGFuZGxlciBmb3IgUmFkaW8gYnV0dG9uc1xyXG4gKiBAcGFyYW0gaXRlbVxyXG4gKi9cclxuTWV0aG9kc1ZpZXdNb2RlbC5wcm90b3R5cGUub25jaGFuZ2VSYWRpb3MgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gIC8vdXBkYXRlIFJhZGlvcyBNb2RlbFxyXG4gIGhmLmNoZWNrQWN0aXZlKHNlbGYucmFkaW9zTW9kZWwsIGl0ZW0ubmFtZSk7XHJcbiAgLy91cGRhdGUgU2VsZWN0IE1vZGVsXHJcbiAgc2VsZi51cGRhdGVTZWxlY3QoaXRlbSk7XHJcbn07XHJcblxyXG4vKipcclxuICogSW5pdGlhbCBidWlsZCBvZiBSYWRpb3MgTW9kZWxcclxuICogQHBhcmFtIHBhcmFtXHJcbiAqIEByZXR1cm5zIHtBcnJheX1cclxuICovXHJcbk1ldGhvZHNWaWV3TW9kZWwucHJvdG90eXBlLnVwZGF0ZVJhZGlvc01vZGVsID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgdmFyIG9iaiA9IHBhcmFtIHx8IHt9LFxyXG4gICAgYXJyID0gW107XHJcblxyXG4gIGZvciAodmFyIGkgaW4gb2JqKSB7XHJcbiAgICBpZiAoIW9iai5oYXNPd25Qcm9wZXJ0eShpKSkgeyBjb250aW51ZTsgfVxyXG4gICAgdmFyIGl0ZW0gPSB7XHJcbiAgICAgIGNoZWNrZWQ6IGtvLm9ic2VydmFibGUoaSA9PT0gJ0FMTCcpLFxyXG4gICAgICBuYW1lOiBpXHJcbiAgICB9O1xyXG5cclxuICAgIGlmIChpID09PSAnQUxMJykge1xyXG4gICAgICBhcnIudW5zaGlmdChpdGVtKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYXJyLnB1c2goaXRlbSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cdGFyciA9IGFyci5zb3J0KGNvbXBhcmVNZXRob2RzKTtcclxuICB0aGlzLnJhZGlvc01vZGVsKGFycik7XHJcbiAgcmV0dXJuIGFycjtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBJbml0aWFsIGJ1aWxkIG9mIFNlbGVjdCBNb2RlbFxyXG4gKiBAcGFyYW0gaXRlbVxyXG4gKi9cclxuTWV0aG9kc1ZpZXdNb2RlbC5wcm90b3R5cGUudXBkYXRlU2VsZWN0ID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICB2YXIgb2JqID0gYmFzZVtzZWxmLmNhdGVnb3J5KCldW2l0ZW0ubmFtZV18fCB7fSxcclxuICAgIGFyciA9IFtdLFxyXG4gICAgY291bnQgPSAwO1xyXG5cclxuICBmb3IgKHZhciBpIGluIG9iaikge1xyXG4gICAgaWYgKCFvYmouaGFzT3duUHJvcGVydHkoaSkpIHsgY29udGludWU7IH1cclxuICAgIHZhciBwcm9wZXJ0eSA9IG9ialtpXTtcclxuXHRcdC8vIGNvcGllcyBhbGwgdmFsdWVzIGZyb20gbW9kZWwgdG8gdmlldy1tb2RlbFxyXG5cdFx0dmFyIHZtTWV0aG9kID0gJC5leHRlbmQoe30sIHByb3BlcnR5KTtcclxuXHJcblx0XHRkZWxldGUgdm1NZXRob2QucGFyYW1ldGVycztcclxuXHRcdHZtTWV0aG9kLmNoZWNrZWQgPSBrby5vYnNlcnZhYmxlKCFjb3VudCk7XHJcblxyXG5cdFx0YXJyLnB1c2godm1NZXRob2QpO1xyXG5cclxuICAgIC8vIHNldCBnbG9iYWwgb2JzZXJ2YWJsZVxyXG4gICAgIWNvdW50ICYmIHRoaXMubWV0aG9kKGJhc2VbcHJvcGVydHkuY2F0ZWdvcnldW3Byb3BlcnR5Lm1ldGhvZF1bcHJvcGVydHkuaWRdKTtcclxuXHJcbiAgICBjb3VudCsrO1xyXG5cclxuICB9XHJcblxyXG5cdHRoaXMubWV0aG9kc1ZpZXdNb2RlbChhcnIpO1xyXG5cdHJldHVybiBhcnI7XHJcbn07XHJcblxyXG5NZXRob2RzVmlld01vZGVsLnByb3RvdHlwZS5vblNlbGVjdE1ldGhvZCA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgaGYuY2hlY2tBY3RpdmUoc2VsZi5tZXRob2RzVmlld01vZGVsLCBpdGVtLm5hbWUpO1xyXG4gIHNlbGYubWV0aG9kKGJhc2VbaXRlbS5jYXRlZ29yeV1baXRlbS5tZXRob2RdW2l0ZW0uaWRdKTtcclxufTtcclxuXHJcbk1ldGhvZHNWaWV3TW9kZWwucHJvdG90eXBlLm9uQWJvdXRDbGljayA9IGZ1bmN0aW9uIChtb2RlbCwgZXZlbnQpIHtcclxuICBtb2RlbC50b2dnbGVQb3BVcCghbW9kZWwudG9nZ2xlUG9wVXAoKSk7XHJcbn07XHJcblxyXG4vKipcclxuICogU29ydCBmdW5jdGlvbiBmb3IgbWV0aG9kcyBhcmF5XHJcbiAqIEBwYXJhbSBmXHJcbiAqIEBwYXJhbSBzXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9XHJcbiAqL1xyXG5mdW5jdGlvbiBjb21wYXJlTWV0aG9kcyhmLHMpIHtcclxuXHR2YXIgYSA9IGYubmFtZS50b1VwcGVyQ2FzZSgpO1xyXG5cdHZhciBiID0gcy5uYW1lLnRvVXBwZXJDYXNlKCk7XHJcblxyXG5cdGlmIChhID09PSBiKSB7cmV0dXJuIDA7fVxyXG5cdGlmIChhID09PSAnQUxMJyB8fFxyXG5cdFx0KGEgPT09ICdHRVQnICYmIChiID09PSAnUE9TVCcgfHwgYiA9PT0gJ1BVVCcgfHwgYiA9PT0gJ0RFTEVURScpKSB8fFxyXG5cdFx0KGEgPT09ICdQT1NUJyAmJiAoYiA9PT0gJ1BVVCcgfHwgYiA9PT0gJ0RFTEVURScpKSB8fFxyXG5cdFx0KGEgPT09ICdQVVQnICYmIGIgPT09ICdERUxFVEUnKSkge1xyXG5cdFx0cmV0dXJuIC0xO1xyXG5cdH1cclxuXHRyZXR1cm4gMTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZXRob2RzVmlld01vZGVsO1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc2NyaXB0cy9hcGktZXhwbG9yZXIvdjIvVmlld01vZGVscy9tZXRob2RzVmlld01vZGVsLmpzXG4gKiogbW9kdWxlIGlkID0gOVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIGpzb25IaWdobGlnaHQgPSByZXF1aXJlKCcuLy4uL21vZHVsZXMvanNvbi1oaWdobGlnaHQnKTtcbnZhciBzZWxmO1xuXG52YXIgc2V0U2xpZGVyID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9zbGlkZXInKTtcblxuZnVuY3Rpb24gUmVxdWVzdHNMaXN0Vmlld01vZGVsKHJlcXVlc3RzLCB1cmwpIHtcblx0dGhpcy51cmwgPSB1cmw7XG5cdHNlbGYgPSB0aGlzO1xuXHR0aGlzLmNvbG9ycyA9IFtcblx0XHQnY29sdW1uLWNvbG9yLTEnLFxuXHRcdCdjb2x1bW4tY29sb3ItMicsXG5cdFx0J2NvbHVtbi1jb2xvci0zJyxcblx0XHQnY29sdW1uLWNvbG9yLTQnLFxuXHRcdCdjb2x1bW4tY29sb3ItNScsXG5cdFx0J2NvbHVtbi1jb2xvci02Jyxcblx0XHQnY29sdW1uLWNvbG9yLTcnLFxuXHRcdCdjb2x1bW4tY29sb3ItOCcsXG5cdFx0J2NvbHVtbi1jb2xvci05Jyxcblx0XHQnY29sdW1uLWNvbG9yLTEwJyxcblx0XHQnY29sdW1uLWNvbG9yLTExJyxcblx0XHQnY29sdW1uLWNvbG9yLTEyJ1xuXHRdO1xuXHR0aGlzLnJlcXVlc3RzID0gcmVxdWVzdHM7XG5cdHRoaXMuaXNBY3RpdmVUYWIgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcblx0dGhpcy52aWV3TW9kZWwgPSBrby5vYnNlcnZhYmxlQXJyYXkoW10pO1xuXHR0aGlzLmJsb2Nrc1ZpZXdNb2RlbCA9IGtvLm9ic2VydmFibGVBcnJheShbXSk7XG5cdHRoaXMuY2xlYXJCdG5Jc1Zpc2libGUgPSBrby5jb21wdXRlZCh0aGlzLl9pc1Zpc2libGUsIHRoaXMpO1xuXHR0aGlzLnJlcXVlc3RzLnN1YnNjcmliZSh0aGlzLnVwZGF0ZU1vZGVsLCB0aGlzKTtcbn1cblxuXG5SZXF1ZXN0c0xpc3RWaWV3TW9kZWwucHJvdG90eXBlLmdldE1vcmUgPSBmdW5jdGlvbiAocGFyZW50LCBkYXRhLCBldmVudCkge1xuXHR2YXIgZ3JvdXBDb21wb25lbnQgPSB0aGlzO1xuXHR2YXIgc2xpZGVyID0gJChldmVudC5jdXJyZW50VGFyZ2V0KS5wYXJlbnRzKCcuc2xpZGVyJyk7XG5cdHZhciBjb21wb25lbnQgPSAkKCc8c2VjdGlvbiBkYXRhLWJpbmQ9XCJjb21wb25lbnQ6IHtuYW1lOiBcXCdjYXJkXFwnLCBwYXJhbXM6IHBhcmFtc31cIj48L3NlY3Rpb24+Jyk7XG5cdGtvLmFwcGx5QmluZGluZ3Moe1xuXHRcdHBhcmFtczoge1xuXHRcdFx0ZGF0YTogcGFyZW50LFxuXHRcdFx0Y29sb3I6IGdyb3VwQ29tcG9uZW50LmNvbG9yLFxuXHRcdFx0aW5kZXg6IGdyb3VwQ29tcG9uZW50LmluZGV4LFxuXHRcdFx0Z2V0TW9yZTogZ3JvdXBDb21wb25lbnQuZ2V0TW9yZSxcblx0XHRcdHVybDogZ3JvdXBDb21wb25lbnQudXJsXG5cdFx0fVxuXHR9LCBjb21wb25lbnRbMF0pO1xuXG5cdHNsaWRlci5zbGljaygnc2xpY2tBZGQnLCBjb21wb25lbnQpO1xufTtcblxuLyoqXG4gKiBWaXNpYmlsaXR5IGZsYWcgZm9yIENsZWFyIGJ0blxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKiBAcHJpdmF0ZVxuICovXG5SZXF1ZXN0c0xpc3RWaWV3TW9kZWwucHJvdG90eXBlLl9pc1Zpc2libGUgPSBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiB0aGlzLnJlcXVlc3RzKCkubGVuZ3RoID4gMDtcbn07XG5cbi8qKlxuICogVXBkYXRlIFZpZXdtb2RlbCBvZiByZXF1ZXN0IGxpc3RcbiAqIEBwYXJhbSBhcnJcbiAqL1xuUmVxdWVzdHNMaXN0Vmlld01vZGVsLnByb3RvdHlwZS51cGRhdGVNb2RlbCA9IGZ1bmN0aW9uIChhcnIpIHtcblx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcblx0dmFyIG5ld01vZGVsID0gdGhpcy5yZXF1ZXN0cygpXG5cdFx0Lm1hcChmdW5jdGlvbiAob2JqKSB7XG5cdFx0XHR2YXIgaXRlbSA9ICAkLmV4dGVuZCh7XG5cdFx0XHRcdGNvbG9yOiBzZWxmLmNvbG9yc1tvYmouaW5kZXggJSBzZWxmLmNvbG9ycy5sZW5ndGhdLFxuXHRcdFx0XHRhY3RpdmU6IGtvLm9ic2VydmFibGUoZmFsc2UpLFxuXHRcdFx0XHRyZXNIVE1MOiBrby5vYnNlcnZhYmxlKCcnKVxuXHRcdFx0fSwgb2JqKTtcblx0XHRcdHJldHVybiBpdGVtO1xuXHRcdH0pO1xuXHRzZWxmLnZpZXdNb2RlbChuZXdNb2RlbCk7XG5cdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdCQoJyNzaG93LWRldGFpbHMtMCcpLnRyaWdnZXIoJ2NsaWNrJyk7XG5cdH0sIDEwKTtcbn07XG5cbi8qKlxuICogQ2xlYXIgcmVxdWVzdHN0cyBsaXN0IGhhbmRsZXJcbiAqIEBwYXJhbSB2bVxuICogQHBhcmFtIGV2ZW50XG4gKi9cblJlcXVlc3RzTGlzdFZpZXdNb2RlbC5wcm90b3R5cGUub25DbGVhclJlcXVlc3RzID0gZnVuY3Rpb24gKHZtLCBldmVudCkge1xuXHR0aGlzLnJlcXVlc3RzKFtdKTtcbn07XG5cbi8qKlxuICogRGV0YWlscyB0b2dnbGUgaGFuZGxlclxuICogQHBhcmFtIHZtXG4gKiBAcGFyYW0gZXZlbnRcbiAqL1xuUmVxdWVzdHNMaXN0Vmlld01vZGVsLnByb3RvdHlwZS5nZXREZXRhaWxzID0gZnVuY3Rpb24gKHZtLCBldmVudCkge1xuXHRpZiAoIXRoaXMucmVzSFRNTCgpLmxlbmd0aCkge1xuXHRcdGpzb25IaWdobGlnaHQodGhpcy5yZXNIVE1MLCB0aGlzLnJlcyk7XG5cdH1cblx0dGhpcy5hY3RpdmUoIXRoaXMuYWN0aXZlKCkpO1xufTtcblxuUmVxdWVzdHNMaXN0Vmlld01vZGVsLnByb3RvdHlwZS5nZXRTdHIgPSBmdW5jdGlvbiAocywgaSkge1xuXHR2YXIgc3RyID0gcztcblx0dmFyIGkxID0gaSA/IGkoKSA6ICcnO1xuXHRyZXR1cm4gW1xuXHRcdHN0cixcblx0XHRpMVxuXHRdLmpvaW4oJy0nKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUmVxdWVzdHNMaXN0Vmlld01vZGVsO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL1ZpZXdNb2RlbHMvcmVxdWVzdHNMaXN0Vmlld01vZGVsLmpzXG4gKiogbW9kdWxlIGlkID0gMTBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBXb3JrZXIgPSByZXF1aXJlKCcuL2hpZ2hsaWdodEpzb24ud29ya2VyLmpzJyk7IC8vIEpzb24tZm9ybWF0dGVyIHdvcmtlclxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JzZXJ2YWJsZSwgY29kZSkge1xyXG5cdHZhciBhbmltVGltZSA9IDEwMDtcclxuXHR2YXIgd29ya2VyID0gbmV3IFdvcmtlcjtcclxuXHJcblx0d29ya2VyLm9ubWVzc2FnZSA9IGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0b2JzZXJ2YWJsZShldmVudC5kYXRhKTtcclxuXHJcblx0XHQkKGRvY3VtZW50KVxyXG5cdFx0XHQub24oJ2NsaWNrIHRvdWNoJywgJy50bS1jb2RlLWNvbnRhaW5lciAuZXhwYW5kZWQnLCBmdW5jdGlvbiBqc29uQ29kZUNvbnRhaW5lckV4cGFuZGVkKGUpIHtcclxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHRcdFx0XHR2YXIgJHNlbGYgPSAkKHRoaXMpO1xyXG5cdFx0XHRcdCRzZWxmXHJcblx0XHRcdFx0XHQucGFyZW50KClcclxuXHRcdFx0XHRcdC5maW5kKCc+dWwnKVxyXG5cdFx0XHRcdFx0LnNsaWRlVXAoYW5pbVRpbWUsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHQkc2VsZi5hZGRDbGFzcygnY29sbGFwc2VkJyk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0fSlcclxuXHRcdFx0Lm9uKCdjbGljayB0b3VjaCcsICcudG0tY29kZS1jb250YWluZXIgLmV4cGFuZGVkLmNvbGxhcHNlZCcsIGZ1bmN0aW9uIGpzb25Db2RlQ29udGFpbmVyQ29sbGFwc2VkKGUpIHtcclxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHRcdFx0XHR2YXIgJHNlbGYgPSAkKHRoaXMpO1xyXG5cdFx0XHRcdCRzZWxmXHJcblx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNlZCcpXHJcblx0XHRcdFx0XHQucGFyZW50KClcclxuXHRcdFx0XHRcdC5maW5kKCc+dWwnKVxyXG5cdFx0XHRcdFx0LnNsaWRlRG93bihhbmltVGltZSwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdCRzZWxmXHJcblx0XHRcdFx0XHRcdFx0LnJlbW92ZUNsYXNzKCdjb2xsYXBzZWQnKVxyXG5cdFx0XHRcdFx0XHRcdC5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0fSlcclxuXHR9O1xyXG5cdHdvcmtlci5vbmVycm9yID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRjb25zb2xlLmxvZyhldmVudCk7XHJcblx0fTtcclxuXHJcblx0d29ya2VyLnBvc3RNZXNzYWdlKGNvZGUpO1xyXG59O1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc2NyaXB0cy9hcGktZXhwbG9yZXIvdjIvbW9kdWxlcy9qc29uLWhpZ2hsaWdodC5qc1xuICoqIG1vZHVsZSBpZCA9IDExXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gcmVxdWlyZShcIiEhRDpcXFxcdGlja2V0bWFzdGVyLWFwaS1zdGFnaW5nLmdpdGh1Yi5pb1xcXFxub2RlX21vZHVsZXNcXFxcd29ya2VyLWxvYWRlclxcXFxjcmVhdGVJbmxpbmVXb3JrZXIuanNcIikoXCIvKioqKioqLyAoZnVuY3Rpb24obW9kdWxlcykgeyAvLyB3ZWJwYWNrQm9vdHN0cmFwXFxuLyoqKioqKi8gXFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxcbi8qKioqKiovIFxcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XFxuLyoqKioqKi9cXG4vKioqKioqLyBcXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxcbi8qKioqKiovIFxcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcXG4vKioqKioqL1xcbi8qKioqKiovIFxcdFxcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxcbi8qKioqKiovIFxcdFxcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxcbi8qKioqKiovIFxcdFxcdFxcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xcbi8qKioqKiovXFxuLyoqKioqKi8gXFx0XFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcXG4vKioqKioqLyBcXHRcXHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XFxuLyoqKioqKi8gXFx0XFx0XFx0ZXhwb3J0czoge30sXFxuLyoqKioqKi8gXFx0XFx0XFx0aWQ6IG1vZHVsZUlkLFxcbi8qKioqKiovIFxcdFxcdFxcdGxvYWRlZDogZmFsc2VcXG4vKioqKioqLyBcXHRcXHR9O1xcbi8qKioqKiovXFxuLyoqKioqKi8gXFx0XFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXFxuLyoqKioqKi8gXFx0XFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XFxuLyoqKioqKi9cXG4vKioqKioqLyBcXHRcXHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXFxuLyoqKioqKi8gXFx0XFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XFxuLyoqKioqKi9cXG4vKioqKioqLyBcXHRcXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxcbi8qKioqKiovIFxcdFxcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcXG4vKioqKioqLyBcXHR9XFxuLyoqKioqKi9cXG4vKioqKioqL1xcbi8qKioqKiovIFxcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXFxuLyoqKioqKi8gXFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcXG4vKioqKioqL1xcbi8qKioqKiovIFxcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXFxuLyoqKioqKi8gXFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcXG4vKioqKioqL1xcbi8qKioqKiovIFxcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXFxuLyoqKioqKi8gXFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXFxcIlxcXCI7XFxuLyoqKioqKi9cXG4vKioqKioqLyBcXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcXG4vKioqKioqLyBcXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcXG4vKioqKioqLyB9KVxcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXFxuLyoqKioqKi8gKFtcXG4vKiAwICovXFxuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XFxuXFxuXFx0LyoqXFxyXFxuXFx0ICogQ29kZSBmb3JtYXQgd2ViLXdvcmtlclxcclxcblxcdCAqIEBwYXJhbSBldmVudFxcclxcblxcdCAqL1xcclxcblxcdC8vIHZhciBoaWdobGlnaHRKc29uKClcXHJcXG5cXHR2YXIgaGlnaGxpZ2h0SnNvbiA9IF9fd2VicGFja19yZXF1aXJlX18oMSk7XFxyXFxuXFx0XFxyXFxuXFx0b25tZXNzYWdlID0gZnVuY3Rpb24oZXZlbnQpIHtcXHJcXG5cXHQgIHZhciBjb2RlID0gZXZlbnQuZGF0YTtcXHJcXG5cXHQgIC8vIGltcG9ydFNjcmlwdHMoJ2pzb24tcGFyc2UuanMnKTtcXHJcXG5cXHQgIHZhciByZXN1bHQgPSBoaWdobGlnaHRKc29uKGNvZGUsIHtleHBhbmRlZDogdHJ1ZX0pO1xcclxcblxcdCAgLy8gdmFyIHJlc3VsdCA9SlNPTi5zdHJpbmdpZnkoY29kZSk7XFxyXFxuXFx0ICBwb3N0TWVzc2FnZShyZXN1bHQpO1xcclxcblxcdH07XFxyXFxuXFxuXFxuLyoqKi8gfSxcXG4vKiAxICovXFxuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XFxuXFxuXFx0dmFyIHByZWZpeCA9ICd0bS1jb2RlJztcXHJcXG5cXHRcXHJcXG5cXHR2YXIgZ2V0RXhwYW5kZXJDbGFzc2VzID0gZnVuY3Rpb24gKGV4cGFuZGVkKSB7XFxyXFxuXFx0XFx0aWYgKCFleHBhbmRlZCkge1xcclxcblxcdFxcdFxcdHJldHVybiAnZXhwYW5kZWQgY29sbGFwc2VkIGhpZGRlbic7XFxyXFxuXFx0XFx0fVxcclxcblxcdFxcdHJldHVybiAnZXhwYW5kZWQnO1xcclxcblxcdH07XFxyXFxuXFx0XFxyXFxuXFx0dmFyIGVuY29kZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xcclxcblxcdFxcdHJldHVybiBbJzxzcGFuPicsIHZhbHVlLCAnPC9zcGFuPiddLmpvaW4oJycpO1xcclxcblxcdH07XFxyXFxuXFx0XFxyXFxuXFx0dmFyIGNyZWF0ZUVsZW1lbnQgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSwgdHlwZSwgZXhwYW5kZXJDbGFzc2VzKSB7XFxyXFxuXFx0XFx0dmFyIGtsYXNzID0gJ29iamVjdCcsXFxyXFxuXFx0XFx0XFx0b3BlbiA9ICd7JyxcXHJcXG5cXHRcXHRcXHRjbG9zZSA9ICd9JztcXHJcXG5cXHRcXHJcXG5cXHRcXHRpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcXHJcXG5cXHRcXHRcXHRrbGFzcyA9ICdhcnJheSc7XFxyXFxuXFx0XFx0XFx0b3BlbiA9ICdbJztcXHJcXG5cXHRcXHRcXHRjbG9zZSA9ICddJztcXHJcXG5cXHRcXHR9XFxyXFxuXFx0XFxyXFxuXFx0XFx0aWYgKHZhbHVlID09PSBudWxsKSB7XFxyXFxuXFx0XFx0XFx0cmV0dXJuIFtcXHJcXG5cXHRcXHRcXHRcXHQnPGxpPicsXFxyXFxuXFx0XFx0XFx0XFx0XFx0JzxzcGFuIGNsYXNzPVxcXCJrZXlcXFwiPlxcXCInLCBlbmNvZGUoa2V5KSwgJ1xcXCI6IDwvc3Bhbj4nLFxcclxcblxcdFxcdFxcdFxcdFxcdCc8c3BhbiBjbGFzcz1cXFwibnVsbFxcXCI+XFxcIicsIGVuY29kZSh2YWx1ZSksICdcXFwiPC9zcGFuPicsXFxyXFxuXFx0XFx0XFx0XFx0JzwvbGk+J1xcclxcblxcdFxcdFxcdF0uam9pbignJyk7XFxyXFxuXFx0XFx0fVxcclxcblxcdFxcclxcblxcdFxcdGlmICh0eXBlID09ICdvYmplY3QnKSB7XFxyXFxuXFx0XFx0XFx0cmV0dXJuIFtcXHJcXG5cXHRcXHRcXHRcXHQnPGxpPicsXFxyXFxuXFx0XFx0XFx0XFx0XFx0JzxzcGFuIGNsYXNzPVxcXCInLCBleHBhbmRlckNsYXNzZXMsICdcXFwiPjwvc3Bhbj4nLFxcclxcblxcdFxcdFxcdFxcdFxcdCc8c3BhbiBjbGFzcz1cXFwia2V5XFxcIj5cXFwiJywgZW5jb2RlKGtleSksICdcXFwiOiA8L3NwYW4+ICcsXFxyXFxuXFx0XFx0XFx0XFx0XFx0JzxzcGFuIGNsYXNzPVxcXCJvcGVuXFxcIj4nLCBvcGVuLCAnPC9zcGFuPiAnLFxcclxcblxcdFxcdFxcdFxcdFxcdCc8dWwgY2xhc3M9XFxcIicsIGtsYXNzLCAnXFxcIj4nLFxcclxcblxcdFxcdFxcdFxcdFxcdFxcdGpzb24yaHRtbCh2YWx1ZSwgZXhwYW5kZXJDbGFzc2VzKSxcXHJcXG5cXHRcXHRcXHRcXHRcXHQnPC91bD4nLFxcclxcblxcdFxcdFxcdFxcdFxcdCc8c3BhbiBjbGFzcz1cXFwiY2xvc2VcXFwiPicsIGNsb3NlLCAnPC9zcGFuPicsXFxyXFxuXFx0XFx0XFx0XFx0JzwvbGk+J1xcclxcblxcdFxcdFxcdF0uam9pbignJyk7XFxyXFxuXFx0XFx0fVxcclxcblxcdFxcclxcblxcdFxcdGlmICh0eXBlID09ICdudW1iZXInIHx8IHR5cGUgPT0gJ2Jvb2xlYW4nKSB7XFxyXFxuXFx0XFx0XFx0cmV0dXJuIFtcXHJcXG5cXHRcXHRcXHRcXHQnPGxpPicsXFxyXFxuXFx0XFx0XFx0XFx0XFx0JzxzcGFuIGNsYXNzPVxcXCJrZXlcXFwiPlxcXCInLCBlbmNvZGUoa2V5KSwgJ1xcXCI6IDwvc3Bhbj4nLFxcclxcblxcdFxcdFxcdFxcdFxcdCc8c3BhbiBjbGFzcz1cXFwiJywgdHlwZSwgJ1xcXCI+JywgZW5jb2RlKHZhbHVlKSwgJzwvc3Bhbj4nLFxcclxcblxcdFxcdFxcdFxcdCc8L2xpPidcXHJcXG5cXHRcXHRcXHRdLmpvaW4oJycpO1xcclxcblxcdFxcdH1cXHJcXG5cXHRcXHRyZXR1cm4gW1xcclxcblxcdFxcdFxcdCc8bGk+JyxcXHJcXG5cXHRcXHRcXHRcXHQnPHNwYW4gY2xhc3M9XFxcImtleVxcXCI+XFxcIicsIGVuY29kZShrZXkpLCAnXFxcIjogPC9zcGFuPicsXFxyXFxuXFx0XFx0XFx0XFx0JzxzcGFuIGNsYXNzPVxcXCInLCB0eXBlLCAnXFxcIj5cXFwiJywgZW5jb2RlKHZhbHVlKSwgJ1xcXCI8L3NwYW4+JyxcXHJcXG5cXHRcXHRcXHQnPC9saT4nXFxyXFxuXFx0XFx0XS5qb2luKCcnKTtcXHJcXG5cXHR9O1xcclxcblxcdFxcclxcblxcdHZhciBqc29uMmh0bWwgPSBmdW5jdGlvbiAoanNvbiwgZXhwYW5kZXJDbGFzc2VzKSB7XFxyXFxuXFx0XFx0dmFyIGh0bWwgPSAnJztcXHJcXG5cXHRcXHRmb3IgKHZhciBrZXkgaW4ganNvbikge1xcclxcblxcdFxcdFxcdGlmICghanNvbi5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XFxyXFxuXFx0XFx0XFx0XFx0Y29udGludWU7XFxyXFxuXFx0XFx0XFx0fVxcclxcblxcdFxcclxcblxcdFxcdFxcdGh0bWwgPSBbaHRtbCwgY3JlYXRlRWxlbWVudChrZXksIGpzb25ba2V5XSwgdHlwZW9mIGpzb25ba2V5XSwgZXhwYW5kZXJDbGFzc2VzKV0uam9pbignJyk7XFxyXFxuXFx0XFx0fVxcclxcblxcdFxcdHJldHVybiBodG1sO1xcclxcblxcdH07XFxyXFxuXFx0XFxyXFxuXFx0dmFyIGdldEpzb25WaWV3ZXIgPSBmdW5jdGlvbiAoZGF0YSwgb3B0aW9ucykge1xcclxcblxcdFxcdHRyeSB7XFxyXFxuXFx0XFx0XFx0cmV0dXJuIFtcXHJcXG5cXHRcXHRcXHRcXHQnPHVsIGNsYXNzPVxcXCInLCBwcmVmaXgsICctY29udGFpbmVyXFxcIj4nLFxcclxcblxcdFxcdFxcdFxcdFxcdGpzb24yaHRtbChbSlNPTi5wYXJzZShkYXRhKV0sIGdldEV4cGFuZGVyQ2xhc3NlcyhvcHRpb25zLmV4cGFuZGVkKSksXFxyXFxuXFx0XFx0XFx0XFx0JzwvdWw+J1xcclxcblxcdFxcdFxcdF0uam9pbignJyk7XFxyXFxuXFx0XFx0fSBjYXRjaCAoZSkge1xcclxcblxcdFxcdFxcdHJldHVybiBbXFxyXFxuXFx0XFx0XFx0XFx0JzxkaXYgY2xhc3M9XFxcIicsIHByZWZpeCwgJy1lcnJvclxcXCIgPicsIGUudG9TdHJpbmcoKSwgJyA8L2Rpdj4nXFxyXFxuXFx0XFx0XFx0XS5qb2luKCcnKTtcXHJcXG5cXHRcXHR9XFxyXFxuXFx0fTtcXHJcXG5cXHRcXHJcXG5cXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRhdGEsIG9wdCkge1xcclxcblxcdFxcdHZhciBqc29uID0gJyc7XFxyXFxuXFx0XFx0dmFyIG9wdGlvbnMgPSBvcHQgfHwge2V4cGFuZGVkOiB0cnVlfTtcXHJcXG5cXHRcXHRpZiAodHlwZW9mIGRhdGEgPT0gJ3N0cmluZycpIHtcXHJcXG5cXHRcXHRcXHRqc29uID0gZGF0YTtcXHJcXG5cXHRcXHR9IGVsc2UgaWYgKHR5cGVvZiBkYXRhID09ICdvYmplY3QnKSB7XFxyXFxuXFx0XFx0XFx0anNvbiA9IEpTT04uc3RyaW5naWZ5KGRhdGEpXFxyXFxuXFx0XFx0fVxcclxcblxcdFxcdHJldHVybiBnZXRKc29uVmlld2VyKGpzb24sIG9wdGlvbnMpO1xcclxcblxcdH07XFxyXFxuXFxuXFxuLyoqKi8gfVxcbi8qKioqKiovIF0pO1xcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkluZGxZbkJoWTJzNkx5OHZkMlZpY0dGamF5OWliMjkwYzNSeVlYQWdORGN4WWpFd1pEUTBZMkUzTWpnd1pURXhOR0VpTENKM1pXSndZV05yT2k4dkx5NHZjMk55YVhCMGN5OWhjR2t0Wlhod2JHOXlaWEl2ZGpJdmJXOWtkV3hsY3k5b2FXZG9iR2xuYUhSS2MyOXVMbmR2Y210bGNpNXFjeUlzSW5kbFluQmhZMnM2THk4dkxpOXpZM0pwY0hSekwyRndhUzFsZUhCc2IzSmxjaTkyTWk5dGIyUjFiR1Z6TDJwemIyNHRjR0Z5YzJVdWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqdEJRVUZCTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxIVkNRVUZsTzBGQlEyWTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3T3p0QlFVZEJPMEZCUTBFN08wRkJSVUU3UVVGRFFUczdRVUZGUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3T3pzN096czdRVU4wUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQkxIRkRRVUZ2UXl4bFFVRmxPMEZCUTI1RU8wRkJRMEU3UVVGRFFUczdPenM3T3p0QlEySkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRmxCUVZjN1FVRkRXQ3hoUVVGWk96dEJRVVZhTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEVzUjBGQlJUdEJRVU5HTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTEhkQ1FVRjFRanRCUVVOMlFqdEJRVU5CTzBGQlEwRXNSMEZCUlR0QlFVTkdPMEZCUTBFN1FVRkRRVHRCUVVOQklpd2labWxzWlNJNkltaHBaMmhzYVdkb2RFcHpiMjR1ZDI5eWEyVnlMbXB6SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaUlGeDBMeThnVkdobElHMXZaSFZzWlNCallXTm9aVnh1SUZ4MGRtRnlJR2x1YzNSaGJHeGxaRTF2WkhWc1pYTWdQU0I3ZlR0Y2JseHVJRngwTHk4Z1ZHaGxJSEpsY1hWcGNtVWdablZ1WTNScGIyNWNiaUJjZEdaMWJtTjBhVzl1SUY5ZmQyVmljR0ZqYTE5eVpYRjFhWEpsWDE4b2JXOWtkV3hsU1dRcElIdGNibHh1SUZ4MFhIUXZMeUJEYUdWamF5QnBaaUJ0YjJSMWJHVWdhWE1nYVc0Z1kyRmphR1ZjYmlCY2RGeDBhV1lvYVc1emRHRnNiR1ZrVFc5a2RXeGxjMXR0YjJSMWJHVkpaRjBwWEc0Z1hIUmNkRngwY21WMGRYSnVJR2x1YzNSaGJHeGxaRTF2WkhWc1pYTmJiVzlrZFd4bFNXUmRMbVY0Y0c5eWRITTdYRzVjYmlCY2RGeDBMeThnUTNKbFlYUmxJR0VnYm1WM0lHMXZaSFZzWlNBb1lXNWtJSEIxZENCcGRDQnBiblJ2SUhSb1pTQmpZV05vWlNsY2JpQmNkRngwZG1GeUlHMXZaSFZzWlNBOUlHbHVjM1JoYkd4bFpFMXZaSFZzWlhOYmJXOWtkV3hsU1dSZElEMGdlMXh1SUZ4MFhIUmNkR1Y0Y0c5eWRITTZJSHQ5TEZ4dUlGeDBYSFJjZEdsa09pQnRiMlIxYkdWSlpDeGNiaUJjZEZ4MFhIUnNiMkZrWldRNklHWmhiSE5sWEc0Z1hIUmNkSDA3WEc1Y2JpQmNkRngwTHk4Z1JYaGxZM1YwWlNCMGFHVWdiVzlrZFd4bElHWjFibU4wYVc5dVhHNGdYSFJjZEcxdlpIVnNaWE5iYlc5a2RXeGxTV1JkTG1OaGJHd29iVzlrZFd4bExtVjRjRzl5ZEhNc0lHMXZaSFZzWlN3Z2JXOWtkV3hsTG1WNGNHOXlkSE1zSUY5ZmQyVmljR0ZqYTE5eVpYRjFhWEpsWDE4cE8xeHVYRzRnWEhSY2RDOHZJRVpzWVdjZ2RHaGxJRzF2WkhWc1pTQmhjeUJzYjJGa1pXUmNiaUJjZEZ4MGJXOWtkV3hsTG14dllXUmxaQ0E5SUhSeWRXVTdYRzVjYmlCY2RGeDBMeThnVW1WMGRYSnVJSFJvWlNCbGVIQnZjblJ6SUc5bUlIUm9aU0J0YjJSMWJHVmNiaUJjZEZ4MGNtVjBkWEp1SUcxdlpIVnNaUzVsZUhCdmNuUnpPMXh1SUZ4MGZWeHVYRzVjYmlCY2RDOHZJR1Y0Y0c5elpTQjBhR1VnYlc5a2RXeGxjeUJ2WW1wbFkzUWdLRjlmZDJWaWNHRmphMTl0YjJSMWJHVnpYMThwWEc0Z1hIUmZYM2RsWW5CaFkydGZjbVZ4ZFdseVpWOWZMbTBnUFNCdGIyUjFiR1Z6TzF4dVhHNGdYSFF2THlCbGVIQnZjMlVnZEdobElHMXZaSFZzWlNCallXTm9aVnh1SUZ4MFgxOTNaV0p3WVdOclgzSmxjWFZwY21WZlh5NWpJRDBnYVc1emRHRnNiR1ZrVFc5a2RXeGxjenRjYmx4dUlGeDBMeThnWDE5M1pXSndZV05yWDNCMVlteHBZMTl3WVhSb1gxOWNiaUJjZEY5ZmQyVmljR0ZqYTE5eVpYRjFhWEpsWDE4dWNDQTlJRndpWENJN1hHNWNiaUJjZEM4dklFeHZZV1FnWlc1MGNua2diVzlrZFd4bElHRnVaQ0J5WlhSMWNtNGdaWGh3YjNKMGMxeHVJRngwY21WMGRYSnVJRjlmZDJWaWNHRmphMTl5WlhGMWFYSmxYMThvTUNrN1hHNWNibHh1WEc0dktpb2dWMFZDVUVGRFN5QkdUMDlVUlZJZ0tpcGNiaUFxS2lCM1pXSndZV05yTDJKdmIzUnpkSEpoY0NBME56RmlNVEJrTkRSallUY3lPREJsTVRFMFlWeHVJQ29xTHlJc0lpOHFLbHh5WEc0Z0tpQkRiMlJsSUdadmNtMWhkQ0IzWldJdGQyOXlhMlZ5WEhKY2JpQXFJRUJ3WVhKaGJTQmxkbVZ1ZEZ4eVhHNGdLaTljY2x4dUx5OGdkbUZ5SUdocFoyaHNhV2RvZEVwemIyNG9LVnh5WEc1MllYSWdhR2xuYUd4cFoyaDBTbk52YmlBOUlISmxjWFZwY21Vb0p5NHZhbk52Ymkxd1lYSnpaU2NwTzF4eVhHNWNjbHh1YjI1dFpYTnpZV2RsSUQwZ1puVnVZM1JwYjI0b1pYWmxiblFwSUh0Y2NseHVJQ0IyWVhJZ1kyOWtaU0E5SUdWMlpXNTBMbVJoZEdFN1hISmNiaUFnTHk4Z2FXMXdiM0owVTJOeWFYQjBjeWduYW5OdmJpMXdZWEp6WlM1cWN5Y3BPMXh5WEc0Z0lIWmhjaUJ5WlhOMWJIUWdQU0JvYVdkb2JHbG5hSFJLYzI5dUtHTnZaR1VzSUh0bGVIQmhibVJsWkRvZ2RISjFaWDBwTzF4eVhHNGdJQzh2SUhaaGNpQnlaWE4xYkhRZ1BVcFRUMDR1YzNSeWFXNW5hV1o1S0dOdlpHVXBPMXh5WEc0Z0lIQnZjM1JOWlhOellXZGxLSEpsYzNWc2RDazdYSEpjYm4wN1hISmNibHh1WEc1Y2JpOHFLaW9xS2lvcUtpb3FLaW9xS2lvcUtseHVJQ29xSUZkRlFsQkJRMHNnUms5UFZFVlNYRzRnS2lvZ0xpOXpZM0pwY0hSekwyRndhUzFsZUhCc2IzSmxjaTkyTWk5dGIyUjFiR1Z6TDJocFoyaHNhV2RvZEVwemIyNHVkMjl5YTJWeUxtcHpYRzRnS2lvZ2JXOWtkV3hsSUdsa0lEMGdNRnh1SUNvcUlHMXZaSFZzWlNCamFIVnVhM01nUFNBd1hHNGdLaW92SWl3aWRtRnlJSEJ5WldacGVDQTlJQ2QwYlMxamIyUmxKenRjY2x4dVhISmNiblpoY2lCblpYUkZlSEJoYm1SbGNrTnNZWE56WlhNZ1BTQm1kVzVqZEdsdmJpQW9aWGh3WVc1a1pXUXBJSHRjY2x4dVhIUnBaaUFvSVdWNGNHRnVaR1ZrS1NCN1hISmNibHgwWEhSeVpYUjFjbTRnSjJWNGNHRnVaR1ZrSUdOdmJHeGhjSE5sWkNCb2FXUmtaVzRuTzF4eVhHNWNkSDFjY2x4dVhIUnlaWFIxY200Z0oyVjRjR0Z1WkdWa0p6dGNjbHh1ZlR0Y2NseHVYSEpjYm5aaGNpQmxibU52WkdVZ1BTQm1kVzVqZEdsdmJpQW9kbUZzZFdVcElIdGNjbHh1WEhSeVpYUjFjbTRnV3ljOGMzQmhiajRuTENCMllXeDFaU3dnSnp3dmMzQmhiajRuWFM1cWIybHVLQ2NuS1R0Y2NseHVmVHRjY2x4dVhISmNiblpoY2lCamNtVmhkR1ZGYkdWdFpXNTBJRDBnWm5WdVkzUnBiMjRnS0d0bGVTd2dkbUZzZFdVc0lIUjVjR1VzSUdWNGNHRnVaR1Z5UTJ4aGMzTmxjeWtnZTF4eVhHNWNkSFpoY2lCcmJHRnpjeUE5SUNkdlltcGxZM1FuTEZ4eVhHNWNkRngwYjNCbGJpQTlJQ2Q3Snl4Y2NseHVYSFJjZEdOc2IzTmxJRDBnSjMwbk8xeHlYRzVjY2x4dVhIUnBaaUFvUVhKeVlYa3VhWE5CY25KaGVTaDJZV3gxWlNrcElIdGNjbHh1WEhSY2RHdHNZWE56SUQwZ0oyRnljbUY1Snp0Y2NseHVYSFJjZEc5d1pXNGdQU0FuV3ljN1hISmNibHgwWEhSamJHOXpaU0E5SUNkZEp6dGNjbHh1WEhSOVhISmNibHh5WEc1Y2RHbG1JQ2gyWVd4MVpTQTlQVDBnYm5Wc2JDa2dlMXh5WEc1Y2RGeDBjbVYwZFhKdUlGdGNjbHh1WEhSY2RGeDBKenhzYVQ0bkxGeHlYRzVjZEZ4MFhIUmNkQ2M4YzNCaGJpQmpiR0Z6Y3oxY0ltdGxlVndpUGx3aUp5d2daVzVqYjJSbEtHdGxlU2tzSUNkY0lqb2dQQzl6Y0dGdVBpY3NYSEpjYmx4MFhIUmNkRngwSnp4emNHRnVJR05zWVhOelBWd2liblZzYkZ3aVBsd2lKeXdnWlc1amIyUmxLSFpoYkhWbEtTd2dKMXdpUEM5emNHRnVQaWNzWEhKY2JseDBYSFJjZENjOEwyeHBQaWRjY2x4dVhIUmNkRjB1YW05cGJpZ25KeWs3WEhKY2JseDBmVnh5WEc1Y2NseHVYSFJwWmlBb2RIbHdaU0E5UFNBbmIySnFaV04wSnlrZ2UxeHlYRzVjZEZ4MGNtVjBkWEp1SUZ0Y2NseHVYSFJjZEZ4MEp6eHNhVDRuTEZ4eVhHNWNkRngwWEhSY2RDYzhjM0JoYmlCamJHRnpjejFjSWljc0lHVjRjR0Z1WkdWeVEyeGhjM05sY3l3Z0oxd2lQand2YzNCaGJqNG5MRnh5WEc1Y2RGeDBYSFJjZENjOGMzQmhiaUJqYkdGemN6MWNJbXRsZVZ3aVBsd2lKeXdnWlc1amIyUmxLR3RsZVNrc0lDZGNJam9nUEM5emNHRnVQaUFuTEZ4eVhHNWNkRngwWEhSY2RDYzhjM0JoYmlCamJHRnpjejFjSW05d1pXNWNJajRuTENCdmNHVnVMQ0FuUEM5emNHRnVQaUFuTEZ4eVhHNWNkRngwWEhSY2RDYzhkV3dnWTJ4aGMzTTlYQ0luTENCcmJHRnpjeXdnSjF3aVBpY3NYSEpjYmx4MFhIUmNkRngwWEhScWMyOXVNbWgwYld3b2RtRnNkV1VzSUdWNGNHRnVaR1Z5UTJ4aGMzTmxjeWtzWEhKY2JseDBYSFJjZEZ4MEp6d3ZkV3crSnl4Y2NseHVYSFJjZEZ4MFhIUW5QSE53WVc0Z1kyeGhjM005WENKamJHOXpaVndpUGljc0lHTnNiM05sTENBblBDOXpjR0Z1UGljc1hISmNibHgwWEhSY2RDYzhMMnhwUGlkY2NseHVYSFJjZEYwdWFtOXBiaWduSnlrN1hISmNibHgwZlZ4eVhHNWNjbHh1WEhScFppQW9kSGx3WlNBOVBTQW5iblZ0WW1WeUp5QjhmQ0IwZVhCbElEMDlJQ2RpYjI5c1pXRnVKeWtnZTF4eVhHNWNkRngwY21WMGRYSnVJRnRjY2x4dVhIUmNkRngwSnp4c2FUNG5MRnh5WEc1Y2RGeDBYSFJjZENjOGMzQmhiaUJqYkdGemN6MWNJbXRsZVZ3aVBsd2lKeXdnWlc1amIyUmxLR3RsZVNrc0lDZGNJam9nUEM5emNHRnVQaWNzWEhKY2JseDBYSFJjZEZ4MEp6eHpjR0Z1SUdOc1lYTnpQVndpSnl3Z2RIbHdaU3dnSjF3aVBpY3NJR1Z1WTI5a1pTaDJZV3gxWlNrc0lDYzhMM053WVc0K0p5eGNjbHh1WEhSY2RGeDBKend2YkdrK0oxeHlYRzVjZEZ4MFhTNXFiMmx1S0NjbktUdGNjbHh1WEhSOVhISmNibHgwY21WMGRYSnVJRnRjY2x4dVhIUmNkQ2M4YkdrK0p5eGNjbHh1WEhSY2RGeDBKenh6Y0dGdUlHTnNZWE56UFZ3aWEyVjVYQ0krWENJbkxDQmxibU52WkdVb2EyVjVLU3dnSjF3aU9pQThMM053WVc0K0p5eGNjbHh1WEhSY2RGeDBKenh6Y0dGdUlHTnNZWE56UFZ3aUp5d2dkSGx3WlN3Z0oxd2lQbHdpSnl3Z1pXNWpiMlJsS0haaGJIVmxLU3dnSjF3aVBDOXpjR0Z1UGljc1hISmNibHgwWEhRblBDOXNhVDRuWEhKY2JseDBYUzVxYjJsdUtDY25LVHRjY2x4dWZUdGNjbHh1WEhKY2JuWmhjaUJxYzI5dU1taDBiV3dnUFNCbWRXNWpkR2x2YmlBb2FuTnZiaXdnWlhod1lXNWtaWEpEYkdGemMyVnpLU0I3WEhKY2JseDBkbUZ5SUdoMGJXd2dQU0FuSnp0Y2NseHVYSFJtYjNJZ0tIWmhjaUJyWlhrZ2FXNGdhbk52YmlrZ2UxeHlYRzVjZEZ4MGFXWWdLQ0ZxYzI5dUxtaGhjMDkzYmxCeWIzQmxjblI1S0d0bGVTa3BJSHRjY2x4dVhIUmNkRngwWTI5dWRHbHVkV1U3WEhKY2JseDBYSFI5WEhKY2JseHlYRzVjZEZ4MGFIUnRiQ0E5SUZ0b2RHMXNMQ0JqY21WaGRHVkZiR1Z0Wlc1MEtHdGxlU3dnYW5OdmJsdHJaWGxkTENCMGVYQmxiMllnYW5OdmJsdHJaWGxkTENCbGVIQmhibVJsY2tOc1lYTnpaWE1wWFM1cWIybHVLQ2NuS1R0Y2NseHVYSFI5WEhKY2JseDBjbVYwZFhKdUlHaDBiV3c3WEhKY2JuMDdYSEpjYmx4eVhHNTJZWElnWjJWMFNuTnZibFpwWlhkbGNpQTlJR1oxYm1OMGFXOXVJQ2hrWVhSaExDQnZjSFJwYjI1ektTQjdYSEpjYmx4MGRISjVJSHRjY2x4dVhIUmNkSEpsZEhWeWJpQmJYSEpjYmx4MFhIUmNkQ2M4ZFd3Z1kyeGhjM005WENJbkxDQndjbVZtYVhnc0lDY3RZMjl1ZEdGcGJtVnlYQ0krSnl4Y2NseHVYSFJjZEZ4MFhIUnFjMjl1TW1oMGJXd29XMHBUVDA0dWNHRnljMlVvWkdGMFlTbGRMQ0JuWlhSRmVIQmhibVJsY2tOc1lYTnpaWE1vYjNCMGFXOXVjeTVsZUhCaGJtUmxaQ2twTEZ4eVhHNWNkRngwWEhRblBDOTFiRDRuWEhKY2JseDBYSFJkTG1wdmFXNG9KeWNwTzF4eVhHNWNkSDBnWTJGMFkyZ2dLR1VwSUh0Y2NseHVYSFJjZEhKbGRIVnliaUJiWEhKY2JseDBYSFJjZENjOFpHbDJJR05zWVhOelBWd2lKeXdnY0hKbFptbDRMQ0FuTFdWeWNtOXlYQ0lnUGljc0lHVXVkRzlUZEhKcGJtY29LU3dnSnlBOEwyUnBkajRuWEhKY2JseDBYSFJkTG1wdmFXNG9KeWNwTzF4eVhHNWNkSDFjY2x4dWZUdGNjbHh1WEhKY2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1puVnVZM1JwYjI0b1pHRjBZU3dnYjNCMEtTQjdYSEpjYmx4MGRtRnlJR3B6YjI0Z1BTQW5KenRjY2x4dVhIUjJZWElnYjNCMGFXOXVjeUE5SUc5d2RDQjhmQ0I3Wlhod1lXNWtaV1E2SUhSeWRXVjlPMXh5WEc1Y2RHbG1JQ2gwZVhCbGIyWWdaR0YwWVNBOVBTQW5jM1J5YVc1bkp5a2dlMXh5WEc1Y2RGeDBhbk52YmlBOUlHUmhkR0U3WEhKY2JseDBmU0JsYkhObElHbG1JQ2gwZVhCbGIyWWdaR0YwWVNBOVBTQW5iMkpxWldOMEp5a2dlMXh5WEc1Y2RGeDBhbk52YmlBOUlFcFRUMDR1YzNSeWFXNW5hV1o1S0dSaGRHRXBYSEpjYmx4MGZWeHlYRzVjZEhKbGRIVnliaUJuWlhSS2MyOXVWbWxsZDJWeUtHcHpiMjRzSUc5d2RHbHZibk1wTzF4eVhHNTlPMXh5WEc1Y2JseHVYRzR2S2lvcUtpb3FLaW9xS2lvcUtpb3FLaXBjYmlBcUtpQlhSVUpRUVVOTElFWlBUMVJGVWx4dUlDb3FJQzR2YzJOeWFYQjBjeTloY0drdFpYaHdiRzl5WlhJdmRqSXZiVzlrZFd4bGN5OXFjMjl1TFhCaGNuTmxMbXB6WEc0Z0tpb2diVzlrZFd4bElHbGtJRDBnTVZ4dUlDb3FJRzF2WkhWc1pTQmphSFZ1YTNNZ1BTQXdYRzRnS2lvdklsMHNJbk52ZFhKalpWSnZiM1FpT2lJaWZRPT1cIiwgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcImhpZ2hsaWdodEpzb24ud29ya2VyLmpzXCIpO1xufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc2NyaXB0cy9hcGktZXhwbG9yZXIvdjIvbW9kdWxlcy9oaWdobGlnaHRKc29uLndvcmtlci5qc1xuICoqIG1vZHVsZSBpZCA9IDEyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEwMzQzOTEzL2hvdy10by1jcmVhdGUtYS13ZWItd29ya2VyLWZyb20tYS1zdHJpbmdcclxuXHJcbnZhciBVUkwgPSB3aW5kb3cuVVJMIHx8IHdpbmRvdy53ZWJraXRVUkw7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY29udGVudCwgdXJsKSB7XHJcblx0dHJ5IHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHZhciBibG9iO1xyXG5cdFx0XHR0cnkgeyAvLyBCbG9iQnVpbGRlciA9IERlcHJlY2F0ZWQsIGJ1dCB3aWRlbHkgaW1wbGVtZW50ZWRcclxuXHRcdFx0XHR2YXIgQmxvYkJ1aWxkZXIgPSB3aW5kb3cuQmxvYkJ1aWxkZXIgfHwgd2luZG93LldlYktpdEJsb2JCdWlsZGVyIHx8IHdpbmRvdy5Nb3pCbG9iQnVpbGRlciB8fCB3aW5kb3cuTVNCbG9iQnVpbGRlcjtcclxuXHRcdFx0XHRibG9iID0gbmV3IEJsb2JCdWlsZGVyKCk7XHJcblx0XHRcdFx0YmxvYi5hcHBlbmQoY29udGVudCk7XHJcblx0XHRcdFx0YmxvYiA9IGJsb2IuZ2V0QmxvYigpO1xyXG5cdFx0XHR9IGNhdGNoKGUpIHsgLy8gVGhlIHByb3Bvc2VkIEFQSVxyXG5cdFx0XHRcdGJsb2IgPSBuZXcgQmxvYihbY29udGVudF0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBuZXcgV29ya2VyKFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYikpO1xyXG5cdFx0fSBjYXRjaChlKSB7XHJcblx0XHRcdHJldHVybiBuZXcgV29ya2VyKCdkYXRhOmFwcGxpY2F0aW9uL2phdmFzY3JpcHQsJyArIGVuY29kZVVSSUNvbXBvbmVudChjb250ZW50KSk7XHJcblx0XHR9XHJcblx0fSBjYXRjaChlKSB7XHJcblx0XHRyZXR1cm4gbmV3IFdvcmtlcih1cmwpO1xyXG5cdH1cclxufVxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogRDovdGlja2V0bWFzdGVyLWFwaS1zdGFnaW5nLmdpdGh1Yi5pby9+L3dvcmtlci1sb2FkZXIvY3JlYXRlSW5saW5lV29ya2VyLmpzXG4gKiogbW9kdWxlIGlkID0gMTNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHNlbGVjdG9yKSB7XHJcblx0XCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5cdCQoc2VsZWN0b3IpLnNsaWNrKHtcclxuXHRcdGRvdHM6IGZhbHNlLFxyXG5cdFx0aW5maW5pdGU6IGZhbHNlLFxyXG5cdFx0c3BlZWQ6IDMwMCxcclxuXHRcdHNsaWRlc1RvU2hvdzogMyxcclxuXHRcdHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG5cdFx0dmFyaWFibGVXaWR0aDogdHJ1ZSxcclxuXHRcdHJlc3BvbnNpdmU6IFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGJyZWFrcG9pbnQ6IDEwMjQsXHJcblx0XHRcdFx0c2V0dGluZ3M6IHtcclxuXHRcdFx0XHRcdHZhcmlhYmxlV2lkdGg6IHRydWUsXHJcblx0XHRcdFx0XHRzbGlkZXNUb1Nob3c6IDIsXHJcblx0XHRcdFx0XHRzbGlkZXNUb1Njcm9sbDogMSxcclxuXHRcdFx0XHRcdGluZmluaXRlOiBmYWxzZSxcclxuXHRcdFx0XHRcdGRvdHM6IGZhbHNlXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0YnJlYWtwb2ludDogNjc4LFxyXG5cdFx0XHRcdHNldHRpbmdzOiB7XHJcblx0XHRcdFx0XHR2YXJpYWJsZVdpZHRoOiB0cnVlLFxyXG5cdFx0XHRcdFx0c2xpZGVzVG9TaG93OiAyLFxyXG5cdFx0XHRcdFx0c2xpZGVzVG9TY3JvbGw6IDFcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRicmVha3BvaW50OiA0ODAsXHJcblx0XHRcdFx0c2V0dGluZ3M6IHtcclxuXHRcdFx0XHRcdGNlbnRlck1vZGU6IHRydWUsXHJcblx0XHRcdFx0XHR2YXJpYWJsZVdpZHRoOiB0cnVlLFxyXG5cdFx0XHRcdFx0c2xpZGVzVG9TaG93OiAxLFxyXG5cdFx0XHRcdFx0c2xpZGVzVG9TY3JvbGw6IDFcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdF1cclxuXHR9KTtcclxufTtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL21vZHVsZXMvc2xpZGVyLmpzXG4gKiogbW9kdWxlIGlkID0gMTRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uICgpIHtcclxuXHRyZXF1aXJlKCcuL2N1c3RvbVNlbGVjdC5jb21wb25lbnQnKTtcclxuXHRyZXF1aXJlKCcuL2NhcmRHcm91cC5jb21wb25lbnQnKTtcclxuXHRyZXF1aXJlKCcuL2NhcmQuY29tcG9uZW50Jyk7XHJcblx0cmVxdWlyZSgnLi9saXN0Q2FyZC5jb21wb25lbnQnKTtcclxufSgpKTtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL2NvbXBvbmVudHMvaW5kZXguanNcbiAqKiBtb2R1bGUgaWQgPSAxNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXHJcbiAqIEN1c3RvbSBTZWxlY3QgY29tcG9uZW50XHJcbiAqL1xyXG52YXIgc2VsZjtcclxuXHJcbi8qKlxyXG4gKiBDdXN0b20gU2VsZWN0IFZpZXctTW9kZWxcclxuICogQHBhcmFtIHBhcmFtc1xyXG4gKiBAY29uc3RydWN0b3JcclxuICovXHJcbmZ1bmN0aW9uIEN1c3RvbVNlbGVjdChwYXJhbXMpIHtcclxuICBzZWxmID0gdGhpcztcclxuXHJcbiAgdGhpcy5hbmltYXRpb25TcGVlZCA9IHBhcmFtcy5hbmltYXRpb25TcGVlZCB8fCAyMDA7XHJcblx0dGhpcy5jdXJlbnRTZWxlY3REYXRhID0gcGFyYW1zLmRhdGEgfHwgbnVsbDtcclxuXHR0aGlzLm9uRm9jdXMgPSBwYXJhbXMuZm9jdXMgfHwgbnVsbDtcclxuXHRcclxuICAvL29ic2VydmFibGVzXHJcbiAgdGhpcy5zZWxlY3RNb2RlbCA9IHR5cGVvZiBwYXJhbXMub3B0aW9ucyAhPT0nZnVuY3Rpb24nID8ga28ub2JzZXJ2YWJsZUFycmF5KHBhcmFtcy5vcHRpb25zKTogIHBhcmFtcy5vcHRpb25zO1xyXG4gIHRoaXMucGxhY2Vob2xkZXIgPSBrby5vYnNlcnZhYmxlKHBhcmFtcy5wbGFjZWhvbGRlciB8fCAnJyk7XHJcbiAgdGhpcy5vbnNlbGVjdCA9IHBhcmFtcy5vbnNlbGVjdCB8fCBmdW5jdGlvbiAoaXRlbSkgeyBjb25zb2xlLmxvZyhpdGVtICsnc2VsZWN0ZWQhJyl9O1xyXG4gIHRoaXMuc2VsZWN0ZWQgPSBrby5vYnNlcnZhYmxlKHRoaXMuc2VsZWN0TW9kZWwoKVswXSk7XHJcbiAgdGhpcy5pc09uZU9wdGlvbiA9IGtvLnB1cmVDb21wdXRlZChmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5zZWxlY3RNb2RlbCgpLmxlbmd0aCA8IDI7IC8vIG1vcmUgdGhhbiBvbmUgb3B0aW9uXHJcbiAgfSwgdGhpcyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpbmRFbGVtZW50KGV2ZW50KSB7XHJcbiAgdmFyIHBhcmVudCA9ICQoZXZlbnQuY3VycmVudFRhcmdldCkucGFyZW50cygnLmpzLWN1c3RvbS1zZWxlY3QnKTtcclxuICByZXR1cm4ge1xyXG4gICAgd3JhcHBlcjogcGFyZW50LmZpbmQoJy5qcy1jdXN0b20tc2VsZWN0LXdyYXBwZXInKSxcclxuICAgIGxheWVyOiBwYXJlbnQuZmluZCgnLmpzLWN1c3RvbS1zZWxlY3QtbGF5ZXInKVxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEN1c3RvbSBTZWxlY3QgVmlldy1Nb2RlbCBtZXRob2RcclxuICogQHBhcmFtIHZpZXdNb2RlbFxyXG4gKiBAcGFyYW0gZXZlbnRcclxuICovXHJcbkN1c3RvbVNlbGVjdC5wcm90b3R5cGUuc2xpZGVUb2dnbGUgPSBmdW5jdGlvbih2aWV3TW9kZWwsIGV2ZW50KSB7XHJcblx0Ly8gZWxlbSBpbiBmb2N1cyBlbXVsYXRpb25cclxuXHR0aGlzLm9uRm9jdXMgJiYgdGhpcy5vbkZvY3VzKHRoaXMuY3VyZW50U2VsZWN0RGF0YSk7XHJcblxyXG5cdGlmICh0aGlzLmlzT25lT3B0aW9uKCkpIHtyZXR1cm4gZmFsc2U7fVxyXG4gIHZhciBlbCA9IGZpbmRFbGVtZW50KGV2ZW50KTtcclxuICAgIGVsLndyYXBwZXIuc2xpZGVUb2dnbGUodmlld01vZGVsLmFuaW1hdGlvblNwZWVkKTtcclxuICAgIGVsLmxheWVyLnRvZ2dsZUNsYXNzKCdoaWRkZW4nKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDdXN0b20gU2VsZWN0IFZpZXctTW9kZWwgbWV0aG9kXHJcbiAqIEBwYXJhbSBpdGVtXHJcbiAqIEBwYXJhbSBldmVudFxyXG4gKi9cclxuQ3VzdG9tU2VsZWN0LnByb3RvdHlwZS5zZWxlY3RJdGVtID0gZnVuY3Rpb24gKGl0ZW0sIGV2ZW50KSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gIHRoaXMuc2VsZWN0ZWQoaXRlbSk7XHJcbiAgLy8gcnVuIGhhbmRsZXJcclxuICB0aGlzLm9uc2VsZWN0KGl0ZW0pO1xyXG5cdC8vIHNsaWRlIHVwXHJcbiAgdGhpcy5zbGlkZVRvZ2dsZShzZWxmLCBldmVudCk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGtvLmNvbXBvbmVudHMucmVnaXN0ZXIoJ2N1c3RvbS1zZWxlY3QnLCB7XHJcbiAgdmlld01vZGVsOiBDdXN0b21TZWxlY3QsXHJcbiAgdGVtcGxhdGU6IChbXHJcbiAgICAnPGRpdiBjbGFzcz1cImFwaS1leHAtY3VzdG9tLXNlbGVjdCBqcy1jdXN0b20tc2VsZWN0XCI+JyxcclxuICAgICAgJzxkaXYgY2xhc3M9XCJhcGktZXhwLWN1c3RvbS1zZWxlY3Qtd3JhcHBlclwiPicsXHJcbiAgICAgICAgJzxzZWxlY3QgZGF0YS1iaW5kPVwib3B0aW9uczogc2VsZWN0TW9kZWwsIG9wdGlvbnNUZXh0OiBcXCduYW1lXFwnLCB2YWx1ZTogc2VsZWN0ZWRcIiBjbGFzcz1cImFwaS1leHAtY3VzdG9tLXNlbGVjdF9fZmllbGRcIiBuYW1lPVwiYXBpLWV4cC1tZXRob2RcIj48L3NlbGVjdD4nLFxyXG4gICAgICAgICc8c3BhbiBjbGFzcz1cImFwaS1leHAtY3VzdG9tLXNlbGVjdF9fcGxhY2Vob2xkZXJcIj4nLFxyXG4gICAgICAgICAgJzxpbnB1dCBkYXRhLWJpbmQ9XCJldmVudDoge2NsaWNrOiBzbGlkZVRvZ2dsZX0sIGF0dHI6IHt2YWx1ZTogc2VsZWN0ZWQoKS5uYW1lLCBkaXNhYmxlZDogaXNPbmVPcHRpb259XCIgdHlwZT1cInRleHRcIiB2YWx1ZT1cIlwiIHJlYWRvbmx5PVwiXCI+JyxcclxuICAgICAgICAgICc8YiBkYXRhLWJpbmQ9XCJjc3M6IHtoaWRkZW46IGlzT25lT3B0aW9ufVwiIGNsYXNzPVwiYXBpLWV4cC1jdXN0b20tc2VsZWN0X19jaGV2cm9uXCI+Jm5ic3A7PC9iPicsXHJcbiAgICAgICAgJzwvc3Bhbj4nLFxyXG4gICAgICAgICc8dWwgZGF0YS1iaW5kPVwiZm9yZWFjaDogc2VsZWN0TW9kZWxcIiBjbGFzcz1cImFwaS1leHAtY3VzdG9tLXNlbGVjdF9fbGlzdCBqcy1jdXN0b20tc2VsZWN0LXdyYXBwZXJcIj4nLFxyXG4gICAgICAgICAgJzxsaSBkYXRhLWJpbmQ9XCJjc3M6IHtcXCdhY3RpdmVcXCc6IGNoZWNrZWR9XCIgY2xhc3M9XCJhcGktZXhwLWN1c3RvbS1zZWxlY3RfX2l0ZW1cIj4nLFxyXG4gICAgICAgICAgICAnPGJ1dHRvbiBkYXRhLWJpbmQ9XCJldmVudDoge2NsaWNrOiAkcGFyZW50LnNlbGVjdEl0ZW0uYmluZCgkcGFyZW50KX0sIHRleHQ6IG5hbWUsIGNzczoge1xcJ2FjdGl2ZVxcJzogY2hlY2tlZCgpfSwgYXR0cjoge1xcJ2RhdGEtdmFsdWVcXCc6IG5hbWV9XCIgIGNsYXNzPVwiYXBpLWV4cC1jdXN0b20tc2VsZWN0X19pdGVtLWxhYmVsXCIgaHJlZj1cIiNcIj48L2J1dHRvbj4nLFxyXG4gICAgICAgICAgICAvLyAnPHNwYW4gZGF0YS1iaW5kPVwiaWY6IGxpbmtcIj4nLFxyXG4gICAgICAgICAgICBcdCc8YSBkYXRhLWJpbmQ9XCJhdHRyOiB7aHJlZjogbGlua30sIGNzczoge1xcJ2hpZGRlblxcJzogIWxpbmt9XCIgY2xhc3M9XCJhcGktZXhwLWN1c3RvbS1zZWxlY3RfX2l0ZW0tbGlua1wiIHRhcmdldD1cIl9ibGFua1wiPiZuYnNwOzwvYT4nLFxyXG4gICAgICAgICAgICAvLyAnPC9zcGFuPicsXHJcbiAgICAgICAgICAnPC9saT4nLFxyXG4gICAgICAgICc8L3VsPicsXHJcbiAgICAgICc8L2Rpdj4nLFxyXG4gICAgICAnPGRpdiBkYXRhLWJpbmQ9XCJjbGljazogc2xpZGVUb2dnbGVcIiBjbGFzcz1cImFwaS1leHAtY3VzdG9tLXNlbGVjdC1sYXllciBqcy1jdXN0b20tc2VsZWN0LWxheWVyIGhpZGRlblwiPjwvZGl2PicsXHJcbiAgICAnPC9kaXY+J1xyXG4gIF0pLmpvaW4oJycpXHJcbn0pO1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc2NyaXB0cy9hcGktZXhwbG9yZXIvdjIvY29tcG9uZW50cy9jdXN0b21TZWxlY3QuY29tcG9uZW50LmpzXG4gKiogbW9kdWxlIGlkID0gMTZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImZ1bmN0aW9uIGNhcmRHcm91cENvbXBvbmVudChwYXJhbXMpIHtcblx0c2VsZiA9IHRoaXM7XG5cblx0dmFyIGluZGV4ID0gcGFyYW1zLmluZGV4O1xuXG5cdHRoaXMuY29sb3JDbGFzcyA9IHBhcmFtcy5jb2xvckNsYXNzO1xuXHR0aGlzLmNhcmRzID0gcGFyYW1zLmNhcmRzO1xuXHR0aGlzLmlkID0ge1xuXHRcdCdpZCc6IGluZGV4XG5cdH07XG59XG5cbmNhcmRHcm91cENvbXBvbmVudC5wcm90b3R5cGUuZ2V0S2V5TmFtZSA9IGZ1bmN0aW9uIChvLCBrb2ZuKSB7XG5cdGlmICh0eXBlb2Yga29mbiAhPT0gJ2Z1bmN0aW9uJyB8fCB0eXBlb2YgbyAhPT0gJ29iamVjdCcpIHJldHVybiAnYmFkIHRpdGxlJztcblx0cmV0dXJuIE9iamVjdC5rZXlzKG8pW2tvZm4oKV1cbn07XG5cbmNhcmRHcm91cENvbXBvbmVudC5wcm90b3R5cGUuc2V0QWN0aXZlID0gZnVuY3Rpb24gKCkge1xuXHR0aGlzLmlzQWN0aXZlKCF0aGlzLmlzQWN0aXZlKCkpO1xufTtcblxuY2FyZEdyb3VwQ29tcG9uZW50LnByb3RvdHlwZS5zZXRBY3RpdmUgPSBmdW5jdGlvbiAoa29mbikge1xuXHRpZiAodHlwZW9mIGtvZm4gIT09ICdmdW5jdGlvbicpIHJldHVybiBjb25zb2xlLndhcm4oJ05PVCBVTklRIElOREVYIEZPUiBDQVJEISEhJyk7XG5cdHJldHVybiAnJyArIHRoaXMuaW5kZXggKyBrb2ZuKCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGtvLmNvbXBvbmVudHMucmVnaXN0ZXIoJ2NhcmRHcm91cCcsIHtcblx0dmlld01vZGVsOiBjYXJkR3JvdXBDb21wb25lbnQsXG5cdHRlbXBsYXRlOlxuXHRgPHNlY3Rpb24gZGF0YS1iaW5kPVwiZm9yZWFjaHByb3A6IGNhcmRzLCBhdHRyOiBpZFwiIGNsYXNzPVwicGFuZWwtZ3JvdXBcIj5cblxuXHRcdFx0PHNwYW4gZGF0YS1iaW5kPVwidGV4dDogY29uc29sZS5sb2coJGRhdGEsIHR5cGVvZiAkZGF0YSlcIj48L3NwYW4+XG5cdFx0XHQ8IS0tIGtvIGlmOiB0eXBlb2YgJGRhdGEgPT09ICdvYmplY3QnIC0tPlxuXHRcdFx0PHNlY3Rpb24gZGF0YS1iaW5kPVwiY29tcG9uZW50OiB7bmFtZTogJ2NhcmQnLCBwYXJhbXM6IHtkYXRhOiB2YWx1ZSwgaW5kZXg6ICRpbmRleCgpLCB0aXRsZToga2V5LCBjb2xvckNsYXNzOiAkY29tcG9uZW50LmNvbG9yQ2xhc3MgfX1cIj5PYmplY3Q8L3NlY3Rpb24+XG5cdFx0XHQ8IS0tIC9rbyAtLT5cblx0XHRcdFxuXHRcdFx0XG5cdFx0XHQ8IS0tIGtvIGlmOiB0eXBlb2YgJGRhdGEgPT09ICdvYmplY3QnICYmIEFycmF5LmlzQXJyYXkoJGRhdGEpIC0tPlxuXHRcdFx0PHNlY3Rpb24+QXJyYXk8L3NlY3Rpb24+XG5cdFx0XHQ8IS0tIC9rbyAtLT5cblx0PC9zZWN0aW9uPmBcbn0pO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL2NvbXBvbmVudHMvY2FyZEdyb3VwLmNvbXBvbmVudC5qc1xuICoqIG1vZHVsZSBpZCA9IDE3XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJmdW5jdGlvbiBjYXJkKHBhcmFtcykge1xyXG5cdHZhciBjb2xsYXBzZUlkID0gcGFyYW1zLmluZGV4O1xyXG5cclxuXHR0aGlzLmRhdGEgPSBwYXJhbXMuZGF0YTtcclxuXHR0aGlzLmNvbG9yQ2xhc3MgPSBwYXJhbXMuY29sb3JDbGFzcztcclxuXHR0aGlzLnRpdGxlID0gcGFyYW1zLnRpdGxlO1xyXG5cclxuXHR0aGlzLmNvbGxhcHNlID0ge1xyXG5cdFx0YnRuOiB7XHJcblx0XHRcdCdkYXRhLXRhcmdldCc6ICcjJyArIGNvbGxhcHNlSWQsXHJcblx0XHRcdCdhcmlhLWNvbnRyb2xzJzogY29sbGFwc2VJZFxyXG5cdFx0fSxcclxuXHRcdHRhcmdldDoge1xyXG5cdFx0XHQnaWQnOiBjb2xsYXBzZUlkXHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGtvLmNvbXBvbmVudHMucmVnaXN0ZXIoJ2NhcmQnLCB7XHJcblx0dmlld01vZGVsOiBjYXJkLFxyXG5cdHRlbXBsYXRlOlxyXG5cdGA8c2VjdGlvbiBjbGFzcz1cInBhbmVsIHBhbmVsLXByaW1hcnlcIj5cclxuXHRcdDwhLS1wYW5lbC1oZWFkaW5nLS0+XHJcblx0XHQ8c2VjdGlvbiBjbGFzcz1cInBhbmVsLWhlYWRpbmdcIj5cclxuXHRcdFx0PGRpdiBjbGFzcz1cInBhbmVsLXRpdGxlXCI+XHJcblx0XHRcdFx0PGJ1dHRvbiBkYXRhLWJpbmQ9XCJhdHRyOiBjb2xsYXBzZS5idG5cIiBjbGFzcz1cImJ0biBidG4taWNvblwiIHR5cGU9XCJidXR0b25cIiBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCI+XHJcblx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cImJ0biBidG4taWNvbiBzaGV2cm9uIHdoaXRlLXNoZXZyb24tdXBcIj48L3NwYW4+XHJcblx0XHRcdFx0XHQ8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiB0aXRsZVwiIGNsYXNzPVwidGl0bGVcIj5UaXRsZTwvc3Bhbj5cclxuXHRcdFx0XHQ8L2J1dHRvbj5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQ8L3NlY3Rpb24+XHJcblx0XHQ8IS0tcGFuZWwtYm9keS0tPlxyXG5cdFx0PHNlY3Rpb24gZGF0YS1iaW5kPVwiYXR0cjogY29sbGFwc2UudGFyZ2V0XCIgY2xhc3M9XCJwYW5lbC1jb2xsYXBzZSBjb2xsYXBzZVwiPlxyXG5cdFx0XHQ8ZGl2IGNsYXNzPVwicGFuZWwtYm9keVwiPlxyXG5cdFx0XHRcdDxkaXYgZGF0YS1iaW5kPVwiZm9yZWFjaHByb3A6IGRhdGFcIj5cclxuXHRcdFx0XHRcdDxwPlxyXG5cdFx0XHRcdFx0XHQ8YiBjbGFzcz1cImtleVwiPlxyXG5cdFx0XHRcdFx0XHRcdDxzcGFuIGRhdGEtYmluZD1cInRleHQ6IGtleVwiPjwvc3Bhbj46Jm5ic3A7XHJcblx0XHRcdFx0XHRcdDwvYj5cclxuXHRcdFx0XHRcdFx0PHNwYW4gZGF0YS1iaW5kPVwidGV4dDogdmFsdWVcIiBjbGFzcz1cInZhbHVlXCI+PC9zcGFuPlxyXG5cdFx0XHRcdFx0PC9wPlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdDwvc2VjdGlvbj5cclxuXHQ8L3NlY3Rpb24+YFxyXG59KTtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL2NvbXBvbmVudHMvY2FyZC5jb21wb25lbnQuanNcbiAqKiBtb2R1bGUgaWQgPSAxOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiZnVuY3Rpb24gbGlzdENhcmQocGFyYW1zKSB7XHJcblx0c2VsZiA9IHRoaXM7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ga28uY29tcG9uZW50cy5yZWdpc3RlcigndG90YWxFbGVtZW50cycsIHtcclxuXHR2aWV3TW9kZWw6IGxpc3RDYXJkLFxyXG5cdHRlbXBsYXRlOlxyXG5cdFx0YDxzZWN0aW9uIGNsYXNzPVwicGFuZWwgcGFuZWwtcHJpbWFyeVwiPlxyXG5cdFx0XHRcclxuXHRcdFx0PCEtLXBhbmVsLWhlYWRpbmctLT5cclxuXHRcdFx0PGRpdiBjbGFzcz1cInBhbmVsLWhlYWRpbmdcIiByb2xlPVwidGFiXCI+XHJcblx0XHRcdFx0PGRpdiBjbGFzcz1cInBhbmVsLXRpdGxlXCI+XHJcblx0XHRcdFx0XHQ8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1pY29uXCIgdHlwZT1cImJ1dHRvblwiPlxyXG5cdFx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cImJ0biBidG4taWNvbiBzaGV2cm9uIHdoaXRlLXNoZXZyb24tdXBcIj48L3NwYW4+XHJcblx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwidGl0bGVcIiBkYXRhLWJpbmQ9XCJ0ZXh0OiBuYW1lXCI+VGl0bGU8L3NwYW4+XHJcblx0XHRcdFx0XHQ8L2J1dHRvbj5cdFxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHQ8IS0tIGtvIGlmOiBxdWFudGl0eSBpbiAkZGF0YS0tPlxyXG5cdFx0XHRcdFx0XHQ8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiBxdWFudGl0eVwiIGNsYXNzPVwiY291bnRlclwiPjwvc3Bhbj5cclxuXHRcdFx0XHRcdDwhLS0gL2tvIC0tPlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8L2Rpdj48IS0tcGFuZWwtaGVhZGluZy0tPlxyXG5cdFx0XHRcclxuXHRcdFx0PCEtLXBhbmVsLWJvZHktLT5cclxuXHRcdFx0PGRpdiBjbGFzcz1cInBhbmVsLWNvbGxhcHNlIGNvbGxhcHNlXCIgcm9sZT1cInRhYnBhbmVsXCI+XHJcblx0XHRcdFx0PGRpdiBjbGFzcz1cInBhbmVsLWJvZHlcIj5cclxuXHRcdFx0XHRcdFx0PHVsIGRhdGEtYmluZD1cImZvcmVhY2g6IGl0ZW1zXCIgY2xhc3M9XCJsaXN0LWdyb3VwXCI+XHJcblx0XHRcdFx0XHRcdFx0PGxpIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtXCI+XHJcblx0XHRcdFx0XHRcdFx0XHQ8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiBuYW1lXCIgY2xhc3M9XCJuYW1lIHRydW5jYXRlXCI+ZXZlbnQgbmFtZTwvc3Bhbj5cclxuXHRcdFx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcdFx0PCEtLWFkZGl0aW9uYWwtaW5mby0tPlxyXG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImFkZGl0aW9uYWwtaW5mb1wiPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHQ8cCBkYXRhLWJpbmQ9XCJ0ZXh0OiBPYmplY3QuZ2V0UHJvcCgkZGF0YSwgJ2RhdGVzLnN0YXJ0LmxvY2FsRGF0ZScpXCIgY2xhc3M9XCJkYXRlXCI+ZXZlbnQgZGF0ZTwvcD5cclxuXHRcdFx0XHRcdFx0XHRcdFx0PHNwYW4gZGF0YS1iaW5kPVwiaWY6IE9iamVjdC5nZXRQcm9wKCRkYXRhLCAnX2VtYmVkZGVkLnZlbnVlc1swXS5uYW1lJylcIj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8cCBkYXRhLWJpbmQ9XCJ0ZXh0OiBPYmplY3QuZ2V0UHJvcCgkZGF0YSwgJ19lbWJlZGRlZC52ZW51ZXNbMF0ubmFtZScpXCIgY2xhc3M9XCJ2ZW51ZVwiPmV2ZW50IHZlbnVlPC9wPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHQ8L3NwYW4+XHJcblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj48IS0tYWRkaXRpb25hbC1pbmZvLS0+XHJcblx0XHRcdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0XHRcdDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1pY29uIGJsdWUtc2hldnJvbi1yaWdodFwiPjwvYnV0dG9uPlxyXG5cdFx0XHRcdFx0XHRcdDwvbGk+XHJcblx0XHRcdFx0XHRcdDwvdWw+XHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdDwvZGl2PjwhLS1wYW5lbC1ib2R5LS0+XHJcblx0XHQ8L3NlY3Rpb24+YFxyXG59KTtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NjcmlwdHMvYXBpLWV4cGxvcmVyL3YyL2NvbXBvbmVudHMvbGlzdENhcmQuY29tcG9uZW50LmpzXG4gKiogbW9kdWxlIGlkID0gMTlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=
