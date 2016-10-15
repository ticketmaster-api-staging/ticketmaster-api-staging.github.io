var self;
function cardGroupComponent(params) {
	self = this;
	var url = params.url;

	this.cards = params.cards;
	this.groupIndex = params.groupIndex || 0;
	this.cardIndex = params.cardIndex;
	this.sectionIndex = params.sectionIndex;
	this.data = params.data;
	this.colorClass = params.colorClass;
	this.getMore = params.getMore;
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

cardGroupComponent.prototype.setActive = function (vm, e) {
	if (!this.isActive) {
		 return this.isActive = ko.observable(true);
	}
	this.isActive(!this.isActive());
};

cardGroupComponent.prototype.getPrevPage = function () {
	var val = +pageParam.value();
	self.pageParam.value(val > 0? val - 1: 0);
	$('#api-exp-get-btn').trigger('click');
};

cardGroupComponent.prototype.getNextPage = function (vm, event) {
	var val = +vm.value.number;
	self.pageParam.value(val < vm.value.totalPages - 1 ? val  + 1: val);
	$('#api-exp-get-btn').trigger('click');
};


module.exports = ko.components.register('cardGroup', {
	viewModel: cardGroupComponent,
	template:`
		<section data-bind="foreachprop: cards" class="panel-group">
			<section data-bind="css: {[$component.colorClass]: true}" class="panel panel-primary">
				<!--panel-heading-->
				<section class="panel-heading">
					<div class="panel-title">
						
						<button data-bind="attr: {'data-target': '#' + $component.collapseId + $index(), 'aria-controls': $component.collapseId + $index()}" class="btn btn-icon" type="button" data-toggle="collapse" aria-expanded="false">
							<span class="btn btn-icon shevron white-shevron-up"></span>
							<span data-bind="text: key" class="title truncate">Title</span>
						</button>
						
						<!-- ko if: key === 'events'-->
							<span data-bind="text: $component.cardSize" class="counter"></span>
						<!-- /ko-->
						
						<!-- ko if: key === 'page'-->
							<!--pager-->
							<span class="navigation-wrapper">
								<button data-bind="click: $component.getPrevPage, enable: !!+value.number" type="button" class="navigation prev"></button>
								<button  data-bind="click: $component.getNextPage, enable: +value.number < +value.totalPages - 1" type="button" class="navigation next"></button>
							</span>
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
									<!-- ko if: typeof value === 'object' -->
										<button data-bind="click: $component.getMore.bind($component, $parent.value)" type="button" class="btn btn-icon blue-shevron-right pull-right"></button>
									<!-- /ko -->
									<!-- ko ifnot: typeof value === 'object' -->
										<span class="key">:&nbsp;</span><span data-bind="text: value" class="value"></span>
									<!-- /ko -->
								</div>
							</div>
						<!-- /ko -->
						
						<!-- ko if: (typeof value === 'object' && $.isArray(value)) -->
							<ul data-bind="foreach: value" class="list-group">
								<li class="list-group-item">
									<span data-bind="text: name || '#' + $index()" class="name truncate">event name</span>
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
