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
