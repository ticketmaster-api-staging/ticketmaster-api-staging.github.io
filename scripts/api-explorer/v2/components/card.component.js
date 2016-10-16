function card(params) {
	this.title = params.title;
	this.cardIndex = params.cardIndex;
	this.groupIndex = params.groupIndex;
	this.sectionIndex = params.sectionIndex;
	this.data = params.data;
	this.colorClass = params.colorClass;
	this.getMore = params.getMore;
	
}

module.exports = ko.components.register('card', {
	viewModel: card,
	template: `
	<div data-bind="foreachprop: value">
		<div class="clearfix">
			<b class="key">
				<span data-bind="text: key"></span>
			</b>
			<!-- ko ifnot: typeof value === 'object' -->
				<span class="key">:&nbsp;</span><span data-bind="text: value" class="value"></span>
			<!-- /ko -->
			<!-- ko if: typeof value === 'object' -->
				<button data-bind="click: $component.getMore.bind($component, $parent.value)" type="button" class="btn btn-icon blue-shevron-right pull-right"></button>
			<!-- /ko -->
		</div>
	</div>
`});

/*
 <!-- ko if: console.log() --><!-- /ko -->
 */
