var jsonHighlight = require('./../modules/json-highlight');
var self;
var slider = require('../modules/slider');


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
	var currentSlider = $('#slider-' + 0);
	var component = $('<section data-bind="component: {name: \'cardGroup\', params: params}"></section>');
	var curslick = currentSlider.slick('getSlick');
	
	ko.applyBindings({
		params: {
			cards: data,
			colorClass: card.colorClass,
			sectionIndex: card.sectionIndex,
			groupIndex: card.groupIndex + 1,
			// cardIndex: card.cardIndex,
			getMore: card.getMore
		}
	}, component[0]);
	
	for (var i = curslick.slideCount - 1; i > card.groupIndex; i--) {
		currentSlider.slick('slickRemove', i, false);
	}
	currentSlider.slick('slickAdd', component);
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

RequestsListViewModel.prototype.getStr = function (s, i) {
	var str = s;
	var i1 = i ? i() : '';
	return [
		str,
		i1
	].join('-');
};

module.exports = RequestsListViewModel;
