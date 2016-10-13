function paging(params) {}

paging.prototype.getPrevPage = function () {
	var pageParam = self.url().find(function (item) {
		return item.name === 'page';
	});
	var val = +pageParam.value();
	pageParam.value(val > 0? val - 1: 0);
	$('#api-exp-get-btn').trigger('click');
};

paging.prototype.getNextPage = function (vm, event) {
	var pageParam = self.url().find(function (item) {
		return item.name === 'page';
	});
	var val = +pageParam.value();
	pageParam.value(val < this.items.totalPages - 1 ? val  + 1: val);
	$('#api-exp-get-btn').trigger('click');
};

module.exports = ko.components.register('paging', {
	viewModel: paging,
	template:
	`<span class="navigation-wrapper">
		<button data-bind="click: $component.getPrevPage, enable: !!+items.number" type="button" class="navigation prev"></button>
		<button  data-bind="click: $component.getNextPage, enable: +items.number < +items.totalPages - 1" type="button" class="navigation next"></button>
	</span>`
});
