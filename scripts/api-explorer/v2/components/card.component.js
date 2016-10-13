function card(params) {
	this.title = params.title;
	this.cardIndex = params.cardIndex;
	this.groupIndex = params.groupIndex;
	this.sectionIndex = params.sectionIndex;
	this.data = params.data;
	this.colorClass = params.colorClass;
	this.getMore = params.getMore;
	
	var collapseId = [
		'card-panel-body-',
		this.sectionIndex,
		this.groupIndex,
		this.cardIndex
	].join('');
	
	this.isActive = ko.observable(false);
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

card.prototype.setActive = function () {
 this.isActive(!this.isActive());
};

module.exports = ko.components.register('card', {
	viewModel: card,
	template:
	`<section data-bind="css: {active: isActive, [colorClass]: true, ['CARD-' + sectionIndex + groupIndex + cardIndex]: true}" class="panel panel-primary">
		<!--panel-heading-->
		<section class="panel-heading">
			<div class="panel-title">
				<button data-bind="click: setActive, attr: collapse.btn" class="btn btn-icon" type="button" data-toggle="collapse" aria-expanded="false">
					<span class="btn btn-icon shevron white-shevron-up"></span>
					<span data-bind="text: title" class="title">Title</span>
				</button>
			</div>
		</section>
		
		<!--panel-body-->
		<section data-bind="attr: collapse.target" class="panel-collapse collapse">
			<div class="panel-body">
			
				<!-- ko if: (typeof data === 'object' && typeof(data.length) === 'undefined') -->
				<!-- ko if: console.log('object', data) --><!-- /ko -->
					<div data-bind="foreachprop: data">
						<div>
							<b class="key">
								<span data-bind="text: key"></span>:&nbsp;
							</b>
							<!-- ko if: typeof value === 'object' -->
								<button data-bind="click: $component.getMore.bind($component)" type="button" class="btn btn-icon blue-shevron-right pull-right"></button>
							<!-- /ko -->
							<!-- ko ifnot: typeof value === 'object' -->
								<span data-bind="text: value" class="value"></span>
							<!-- /ko -->
						</div>
					</div>
				<!-- /ko -->
				
				<!-- ko if: (typeof data === 'object' && typeof(data.length) !== 'undefined') -->
					<ul data-bind="foreach: data" class="list-group">
						<li class="list-group-item">
							<span data-bind="text: name" class="name truncate">event name</span>
							<!-- ko if: typeof $data === 'object' -->
								<button data-bind="click: $component.getMore.bind($component)" type="button" class="btn btn-icon blue-shevron-right pull-right"></button>
							<!-- /ko -->
						</li>
					</ul>
				<!-- /ko -->
				
				<!-- ko ifnot: typeof data === 'object' -->
					<span data-bind="text: data" class="value"></span>
				<!-- /ko -->
			</div>
		</section>
	</section>`
});

/*
 <!-- ko if: console.log() --><!-- /ko -->
 */
