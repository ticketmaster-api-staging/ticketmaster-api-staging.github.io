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


`});

/*
 <!-- ko if: console.log() --><!-- /ko -->
 */
