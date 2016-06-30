
(function ($) {
    var CollapseButton =(function ($) {

        var Button = function (opts) {
            $.extend(this, opts);
            this.el = document.createElement('div');
            this.el.innerHTML = this.getTitle();
            this.el.classList.add(this.className.common);
            this.el.classList.add(this.className.collapsed);
            this.expanded = false;
            this.render();
        };

        Button.prototype = {
            constructor: CollapseButton,
            el: null,
            elToCollapse: null,
            title: null,
            events:{
                expand: 'expand',
                collapse: 'collapse',
                click: 'click'
            },
            setTitle: function (title) {
                this.title = title;
                this.el.innerHTML = title;
            },
            getTitle: function(){
                return this.title || this.titleText.expand;
            },
            registerListeners: function () {
                for ( $event in this.listeners){
                    this.el.addEventListener($event, this.listeners[$event].bind(this));
                }
            },
            render: function () {
                this.setTitle(this.titleText.expand);
                this.elToCollapse.after(this.el);
                this.registerListeners();
            },
            titleText: {
                expand: 'Expand',
                collapse: 'Collapse'
            },
            className: {
                collapsed: 'collapsed',
                common: 'table_collapse__btn'
            },
            listeners:{}
        };

        return Button;
    })(jQuery);

    jQuery.fn.tableCollapse = function (options) {

        var defaults = {
                scrollUpOnCollapse: true,
                fixedHeight: 400,
                scrollUpSpeed: 500,
                separationLineHeight: 0,
                additionalScrollSpace: 170,
                cssClass: 'table_collapse',
                cssClassBtn: 'table_collapse__btn',
                cssClassInner: 'table_collapse__inner',
                cssClassCollapsed: 'table_collapse-collapsed',
                title: 'Expand',
                titleCollapse: 'Collapse',
                tooltipPosition: 'top'
            },
            settings = $.extend({}, defaults, options),
            $htmlBody = $('body, html');


        var clickHandler = function(e){

            this.expanded = !this.expanded;

            var $table = $(this.elToCollapse);
            var $btn = $(this.el);

            this.setTitle(this.expanded ? this.titleText.collapse : this.titleText.expand );

            if(this.expanded){
                $table.removeAttr('style');
                $table.height($table.find('table').height())
            }else{
                $table.height(settings.fixedHeight)
            }
            $htmlBody.animate({
                scrollTop: $table.offset().top - settings.additionalScrollSpace
            }, settings.scrollUpSpeed);

            $table.toggleClass('expanded');
            $table.toggleClass('collapsed');
            $btn.toggleClass('collapsed');
        };

        this.each(function () {
            var $item = $(this);
            var originalHeight = $item.height();
            if(originalHeight > defaults.fixedHeight){
                $item.addClass('collapsed');
                $item.height(settings.fixedHeight);
                new CollapseButton({
                    elToCollapse: $item,
                    listeners: {
                        click: clickHandler
                    }
                });
            }
        });

        return this;
    };
})(jQuery);


$(document).on('ready', function () {
    $('.table-wrapper').tableCollapse();
});