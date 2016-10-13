
function cardGroupComponent(params) {
	self = this;

	this.sectionIndex = params.sectionIndex;

	this.colorClass = params.colorClass;
	this.cards = params.cards;
	this.getMore = params.getMore;
	this.groupIndex = params.groupIndex || 0;
}

cardGroupComponent.prototype.getKeyName = function (o, kofn) {
	if (typeof kofn !== 'function' || typeof o !== 'object') return 'bad title';
	return Object.keys(o)[kofn()]
};

cardGroupComponent.prototype.setActive = function () {
	this.isActive(!this.isActive());
};

cardGroupComponent.prototype.setIdex = function (kofn) {
	if (typeof kofn !== 'function') return console.warn('NOT UNIQ INDEX FOR CARD!!!');
	return '' + this.index + kofn();
};

module.exports = ko.components.register('cardGroup', {
	viewModel: cardGroupComponent,
	template:
	`<section data-bind="foreachprop: cards" class="panel-group">
			<!-- ko if: console.log('object', $data) --><!-- /ko -->
			<!-- ko component: {
					name: 'card',
					params: {
						title: key,
						cardIndex: $index(),
						groupIndex: $component.groupIndex,
						sectionIndex: $component.sectionIndex,
						data: value,
						colorClass: $component.colorClass,
						getMore: $component.getMore
					}
				}--><!-- /ko -->
		</section>`
});
