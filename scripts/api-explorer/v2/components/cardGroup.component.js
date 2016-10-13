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
