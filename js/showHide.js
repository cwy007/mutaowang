(function($) {
    var transition = window.mt.transition; // transition兼容解决，transition.js

    // 正常显示和隐藏
    var silent = {
        // 初始化显示和隐藏的状态
        init: init,
        show: function($elem) {
            show($elem, function() {
                $elem.show();
                $elem.data('status', 'shown').trigger('shown');
            });
        },
        hide: function($elem) {
            hide($elem, function() {
                $elem.hide();
                $elem.data('status', 'hidden').trigger('hidden');
            });
        }
    };

    // 提取init公共部分
    function init($elem, hiddenCallback) {
        if ($elem.is(':hidden')) { // :hidden
            $elem.data('status', 'hidden');
            if (typeof hiddenCallback === 'function') hiddenCallback();
        } else {
            $elem.data('status', 'shown');
        }
    }

    // 提取show公共部分
    function show($elem, callback) {
        //判断状态，解决重复触发事件
        if ($elem.data('status') === 'show') return;
        if ($elem.data('status') === 'shown') return;

        $elem.data('status', 'show').trigger('show'); // 给元素添加状态值

        callback(); // 显示操作和显示完成后要做的事情
    }

    // 提取hide公共部分
    function hide($elem, callback) {
        // 判断状态，解决重复触发事件
        if ($elem.data('status') === 'hide') return;
        if ($elem.data('status') === 'hidden') return; // 完成时状态

        $elem.data('status', 'hide').trigger('hide'); // 给元素添加状态值

        callback(); // 隐藏操作和隐藏完成后要做的事情
    }

    // 带效果的显示和隐藏，css3实现方法
    var css3 = {
        fade: { // 淡入淡出
            init: function($elem) {
                css3._init($elem, 'fadeOut');
            },
            show: function($elem) {
                css3._show($elem, 'fadeOut');
            },
            hide: function($elem) {
                css3._hide($elem, 'fadeOut');
            }
        },
        slideUpDown: { // 上下滚动
            init: function($elem) {
                $elem.height($elem.height()); //设置高度，解决没有slideUpDown的过程。
                css3._init($elem, 'slideUpDownCollapse');
            },
            show: function($elem) {
                css3._show($elem, 'slideUpDownCollapse');
            },
            hide: function($elem) {
                css3._hide($elem, 'slideUpDownCollapse');
            }
        },
        slideLeftRight: { // 左右滚动
            init: function($elem) {
                $elem.width($elem.width());
                css3._init($elem, 'slideLeftRightCollapse');
            },
            show: function($elem) {
                css3._show($elem, 'slideLeftRightCollapse');
            },
            hide: function($elem) {
                css3._hide($elem, 'slideLeftRightCollapse');
            }
        },
        fadeslideUpDown: { // 淡入淡出上下滚动
            init: function($elem) {
                $elem.height($elem.height());
                css3._init($elem, 'fadeOut slideUpDownCollapse');
            },
            show: function($elem) {
                css3._show($elem, 'fadeOut slideUpDownCollapse');
            },
            hide: function($elem) {
                css3._hide($elem, 'fadeOut slideUpDownCollapse');
            }
        },
        fadeslideLeftRight: { // 淡入淡出左右滚动
            init: function($elem) {
                $elem.width($elem.width());
                css3._init($elem, 'fadeOut slideLeftRightCollapse');
            },
            show: function($elem) {
                css3._show($elem, 'fadeOut slideLeftRightCollapse');
            },
            hide: function($elem) {
                css3._hide($elem, 'fadeOut slideLeftRightCollapse');
            }
        }
    };

    css3._init = function($elem, className) {
        $elem.addClass('transition'); // 动画过渡效果
        init($elem, function() {
            $elem.addClass(className);
        });
    };

    css3._show = function($elem, className) {
        show($elem, function() {
            $elem.off(transition.end).one(transition.end, function() {
                $elem.data('status', 'shown').trigger('shown');
            });
            $elem.show(); // display 属性
            setTimeout(function() { // 异步执行
                $elem.removeClass(className); // 触发动画效果
            }, 20);
        });
    };

    css3._hide = function($elem, className) {
        hide($elem, function() {
            $elem.off(transition.end).one(transition.end, function() {
                $elem.hide(); // 隐藏并且不会占据页面空间
                $elem.data('status', 'hidden').trigger('hidden');
            });
            $elem.addClass(className);
        });
    }

    // 带效果的显示和隐藏，js实现方法
    var js = {
        fade: { // 淡入淡出
            init: function($elem) {
                js._init($elem);
            },
            show: function($elem) {
                js._show($elem, 'fadeIn');
            },
            hide: function($elem) {
                js._hide($elem, 'fadeOut');
            }
        },
        slideUpDown: { // 上下滚动
            init: function($elem) {
                js._init($elem);
            },
            show: function($elem) {
                js._show($elem, 'slideDown');
            },
            hide: function($elem) {
                js._hide($elem, 'slideUp');
            }
        },
        slideLeftRight: { // 左右滚动
            init: function($elem) {
                js._customInit($elem, {
                    'width': 0,
                    'padding-left': 0,
                    'padding-right': 0
                });
            },
            show: function($elem) {
                js._customshow($elem);
            },
            hide: function($elem) {
                js._customHide($elem, {
                    'width': 0,
                    'padding-left': 0,
                    'padding-right': 0
                });
            }
        },
        fadeslideUpDown: { // 淡入淡出上下滚动
            init: function($elem) {
                js._customInit($elem, {
                    'opacity': 0,
                    'height': 0,
                    'padding-top': 0,
                    'padding-bottom': 0
                });
            },
            show: function($elem) {
                js._customshow($elem);
            },
            hide: function($elem) {
                js._customHide($elem, {
                    'opacity': 0,
                    'height': 0,
                    'padding-top': 0,
                    'padding-bottom': 0
                });
            }
        },
        fadeslideLeftRight: { // 淡入淡出左右滚动
            init: function($elem) {
                js._customInit($elem, {
                    'opacity': 0,
                    'width': 0,
                    'padding-left': 0,
                    'padding-right': 0
                });
            },
            show: function($elem) {
                js._customshow($elem);
            },
            hide: function($elem) {
                js._customHide($elem, {
                    'opacity': 0,
                    'width': 0,
                    'padding-left': 0,
                    'padding-right': 0
                });
            }
        }
    };

    js._init = function($elem, hiddenCallback) {
        $elem.removeClass('transition'); // js和transition动画冲突，在执行js前，将transition去掉，屏蔽风险。
        init($elem, hiddenCallback);
    };

    js._show = function($elem, mode) {
        show($elem, function () {
            $elem.stop()[mode](function () {
                $elem.data('status', 'shown').trigger('shown');
            });
        });
    };

    js._hide = function ($elem, mode) {
        hide($elem, function () {
            $elem.stop()[mode](function () {
                $elem.data('status', 'hidden').trigger('hidden');
            });
        });
    };

    js._customInit = function($elem, options) {
        var styles = {};
        for (var p in options) {
            styles[p] = $elem.css(p);
        }

        // 保存元素的初始属性值
        $elem.data('styles', styles);

        js._init($elem, function() {
            $elem.css(options); // 元素为隐藏状态时初始化元素的属性
        });
    };

    js._customshow = function($elem) {
        show($elem, function() {
            $elem.show();
            $elem.stop().animate($elem.data('styles'), function() {
                $elem.data('status', 'shown').trigger('shown');
            });
        });
    };

    js._customHide = function($elem, options) {
        hide($elem, function() {
            $elem.stop().animate(options, function() {
                $elem.hide();
                $elem.data('status', 'hidden').trigger('hidden');
            });
        });
    };

    var defaults = {
        css3: true,
        js: true,
        animation: 'fade'
    };

    function showHide($elem, options) {
        var mode = null;
        if (options.css3 && transition.isSupport) { //css3 transition
            mode = css3[options.animation] || css3[defaults.animation];
        } else if (options.js) { //js animation
            mode = js[options.animation] || js[defaults.animation];
        } else { // no animation
            mode = silent;
        }
        mode.init($elem); // 初始化

        return {
            show: $.proxy(mode.show, this, $elem), // 设置函数中的this执行和传递参数
            hide: $.proxy(mode.hide, this, $elem),
        };
    }

    // 将方法通过jQuery插件的形式暴露出来
    $.fn.extend({
        // option 为对象时进行初始化
        // 为字符串时，执行对应的函数
        showHide: function(option) {
            return this.each(function () {
                var $this = $(this),
                    options = $.extend({}, defaults, typeof option === 'object' && option), // typeof option === 'object' && option 为false时，不参与属性合并
                    mode = $this.data('showHide'); //

                if (!mode) { // 缓存
                    $this.data('showHide', mode = showHide($this, options));
                }

                if (typeof mode[option] === 'function') {
                    mode[option]();
                }
            });
        }
    });

})(jQuery);
