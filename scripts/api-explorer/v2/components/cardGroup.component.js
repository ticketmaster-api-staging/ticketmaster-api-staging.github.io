var self;

function cardGroupComponent(params) {
	self = this;
	var url = params.url;
	this.filter = require('../config.json');
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
