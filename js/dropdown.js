(function($) {
    'use strict'

    function Dropdown($elem, options) {
        this.$elem = $elem;
        this.options = options;
        this.$layer = this.$elem.find('.dropdown-layer'),
        this.activeClass = options.active + '-active';
        this._init();
    }

    Dropdown.DEFAULTS = {
        event: "hover",
        css3: true,
        js: true,
        animation: 'fade',
        delay: 0,
        active: 'dropdown' // css类名前缀，支持用户指定 dropdown-active menu-active
    };

    Dropdown.prototype._init = function() {
        var self = this;
        this.$layer.showHide(this.options); // 初始化

        this.$layer.on('show shown hide hidden', function(e) {
            self.$elem.trigger('dropdown-' + e.type); // 发布事件
        });

        // 根据参数绑定事件
        if (this.options.event === 'click') {
            this.$elem.on('click', function(e) {
                self.show();
                e.stopPropagation();
            });
            $(document).on('click', $.proxy(this.hide, this));
        } else {
            this.$elem.hover($.proxy(this.show, this), $.proxy(this.hide, this));
        }
    }

    // 支持动画延迟参数 delay
    Dropdown.prototype.show = function() {
        var self = this;
        if (this.options.delay) {
            this.timer = setTimeout(function() {
                _show();
            }, this.options.delay);
        } else {
            _show();
        }

        function _show() {
            self.$elem.addClass(self.activeClass); // 配合css类，实现页面效果
            self.$layer.showHide('show');
        }
    }

    Dropdown.prototype.hide = function() {
        if(this.options.delay){
            clearTimeout(this.timer);
        }
        this.$elem.removeClass(this.activeClass);
        this.$layer.showHide('hide');
    }

    $.fn.extend({
        dropdown: function(option) {
            return this.each(function() {
                var $this = $(this), // 缓存
                    options = $.extend({}, Dropdown.DEFAULTS, $this.data(), typeof option==='object' && option),
                    dropdown = $this.data('dropdown');

                if (!dropdown) { //解决多次调用 dropdown 方法的问题：多次实例化对象
                    $this.data('dropdown', dropdown = new Dropdown($this,options));
                }

                if(typeof dropdown[option] === 'function'){
                    dropdown[option]();
                }
            });
        }
    });

})(jQuery);
