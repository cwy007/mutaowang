(function($) {
    $('.menu').on('dropdown-show', function (e) {
        loadOnce($(this), buildMenuItem);
    });

    //menu 下拉菜单设置
    $(".menu").dropdown({
        css3: true,
        js: false
    });

    // 按需加载
    function loadOnce($elem, success) {
        var dataLoad = $elem.data('load');

        if (!dataLoad) return;

        if (!$elem.data('loaded')) {
            $elem.data('loaded', true);
            $.getJSON(dataLoad).done(function (data) {
                if (typeof success === 'function') success($elem, data);
            }).fail(function () {
                $elem.data('loaded', false);
            });
        }
    }


    function buildMenuItem($elem, data) {
        var html = "";
        if (data.length === 0) return;
        for (var i = 0; i < data.length; i++) {
            html += '<li><a href="' + data[i].url + '" target="_blank" class="menu-item">' + data[i].name + '</a></li>'
        }
        $elem.find('.dropdown-layer').html(html);
    }

})(jQuery);
