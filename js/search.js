// 面向对象方式实现搜索功能
(function ($) {
    'use strict';

    var cache = {
        data: {},
        count: 0,
        addData: function (key, data) {
            if (!this.data[key]) {
                this.data[key] = data;
                this.count++;
            }
        },
        readData: function (key) {
            return this.data[key];
        },
        deleteDataByKey: function (key) {
            delete this.data[key];
            this.count--;
        },
        deleteDataByOrder: function (num) {
            var count = 0;

            for (var p in this.data) {
                if (count >= num) break;
                count++;
                this.deleteDataByKey(p);
            }
        }
    };

    function Search($elem, options) {
        this.$elem = $elem;
        this.options = options;

        this.$form = this.$elem.find('.search-form');
        this.$input = this.$elem.find('.search-inputbox');
        this.$layer = this.$elem.find('.search-layer');
        this.loaded = false;
        this.$elem.on('click', '.search-btn', $.proxy(this.submit, this));
        if (this.options.autocomplete) { // 更具初始化参数决定是否查询并显示提示信息
            this.autocomplete();
        }
    }

    Search.DEFAULTS = {
        autocomplete: false,
        url: 'https://suggest.taobao.com/sug?code=utf-8&_ksTS=1484204931352_18291&callback=jsonp18292&k=1&area=c2c&bucketid=6&q=',
        css3: false,
        js: false,
        animation: 'fade',
        getDataInterval: 200
    };

    Search.prototype.submit = function () {
        if (this.getInputVal() === '') {
            return false;
        }
        this.$form.submit();
    };

    Search.prototype.autocomplete = function () {
        var timer = null,
            self = this;
        this.$input
            .on('input', function () {
                if (self.options.getDataInterval) { // 请求的事件间隔，限频
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        self.getData();
                    }, self.options.getDataInterval);
                } else {
                    self.getData();
                }
            })
            .on('focus', $.proxy(this.showLayer, this))
            .on('click', function () { // 阻止事件冒泡
                return false;
            });

        this.$layer.showHide(this.options); // 初始化
        $(document).on('click', $.proxy(this.hideLayer, this));
    };

    Search.prototype.getData = function () {
        var self = this,
            inputVal = this.getInputVal();

        if (inputVal == '') return self.$elem.trigger('search-noData'); // 发布事件
        if (cache.readData(inputVal)) return self.$elem.trigger('search-getData', [cache.readData(inputVal)]);

        if (this.jqXHR) this.jqXHR.abort(); // 处理重复请求
        this.jqXHR = $.ajax({
            url: this.options.url + inputVal,
            dataType: 'jsonp'
        }).done(function (data) {
            console.log(data);
            cache.addData(inputVal, data);
            console.log(cache.data);
            console.log(cache.count);
            self.$elem.trigger('search-getData', [data]); // 要将数据放在数组[]中传递
        }).fail(function () {
            self.$elem.trigger('search-noData');
        }).always(function () {
            self.jqXHR = null;
        });
    };

    Search.prototype.showLayer = function () {
        if (!this.loaded) return;
        this.$layer.showHide('show');
    };

    Search.prototype.hideLayer = function () {
        this.$layer.showHide('hide');
    };

    Search.prototype.getInputVal = function () {
        return $.trim(this.$input.val());
    };

    Search.prototype.setInputVal = function (val) {
        this.$input.val(_removeHtmlTags(val));

        function _removeHtmlTags(str) {
            return str.replace(/<(?:[^>'"]|"[^"]*"|'[^']*')*>/g, '');
        }
    };

    Search.prototype.appendLayer = function (html) {
        this.$layer.html(html);
        this.loaded = !!html; // true or false
    };

    $.fn.extend({
        search: function (option, value) {
            return this.each(function () {
                var $this = $(this),
                    search = $this.data('search'),
                    options = $.extend({}, Search.DEFAULTS, $(this).data(), typeof option === 'object' && option);

                if (!search) {
                    $this.data('search', search = new Search($this, options));
                }

                // 通过参数调用对应的实例方法
                if (typeof search[option] === 'function') {
                    search[option](value);
                }
            });
        }
    });

})(jQuery);
