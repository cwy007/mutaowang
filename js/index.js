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
        var dataLoad = $elem.data('load'); // 加载路径

        if (!dataLoad) return;

        if (!$elem.data('loaded')) {
            $elem.data('loaded', true);
            setTimeout(function() {
                $.getJSON(dataLoad).done(function (data) {
                    if (typeof success === 'function') success($elem, data);
                }).fail(function () {
                    $elem.data('loaded', false);
                });
            }, 3000) // 模拟当有延迟时，出现加载图标，3秒后在出现具体商品内容。
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

    //header search
    var $headerSearch = $('#header-search');
    var html = '',
        maxNum = 10;

    // 获得数据处理
    $headerSearch.on('search-getData', function (e, data) {
        var $this = $(this);
        html = createHeaderSearchLayer(data, maxNum);
        $this.search('appendLayer', html); // 将生成的html呈现在页面中

        if (html) {
            $this.search('showLayer'); // 调用实例方法
        } else {
            $this.search('hideLayer');
        }
    }).on('search-noData', function (e) {
        // 没获得数据处理
        $(this).search('hideLayer').search('appendLayer', '');
    }).on('click', '.search-layer-item', function () {
        // 点击每项时，提交
        $headerSearch.search('setInputVal', $(this).html());
        $headerSearch.search('submit');
    });

    $headerSearch.search({ // 初始化
        autocomplete: true,
        css3: false,
        js: false,
        animation: 'fade',
        getDataInterval: 0
    });

    // 获取数据，生成html
    function createHeaderSearchLayer(data, maxNum) {
        var html = '',
            dataNum = data['result'].length;

        if (dataNum === 0) return '';
        for (var i = 0; i < dataNum; i++) {
            if (i >= maxNum) break;
            html += '<li class="search-layer-item text-ellipsis">' + data['result'][i][0] + '</li>';
        }
        return html;
    }

// cart
    $('.cart').on('dropdown-show', function (e) {
        loadOnce($(this), buildCartItem);
    });

    //menu 下拉菜单设置
    $(".cart").dropdown({
        css3: true,
        js: false
    });

    function buildCartItem($elem, data) {
        var html = "";
        if (data.length === 0) {
            html = '<li class="cart-blank">购物车里还没有商品<br>赶紧去选购吧！<\/li>';
            $elem.data('loaded', false);
        } else {
            html += '<div class="cart-title">最新加入的商品<\/div>';
            html += '<div class="cart-items">';
            for (var i = 0; i < data.length; i++) {
                html += '<li class="cart-item cf">';
                html += '<img src="' + data[i]['imgUrl'] + '" class="fl" alt="1.png">';
                html += '<span class="item-name">' + data[i]['name'] + '<a href="#" class="link delete-btn fr">X<\/a><\/span>';
                html += '<span class="price">¥' + data[i]['price'] + 'x' + data[i]['num'] + '<\/span>';
                html += '<\/li>';
            }
            html += '<\/div>';
            html += '<div class="cart-bottom">';
            html += '共 <span class="total-num">0<\/span> 件商品&nbsp;';
            html += '共计¥ <span class="total-price">0.00<\/span>';
            html += '<a href="#" class="go-shopping-btn">去购物<\/a>';
            html += '<\/div>';
        }
        $elem.find('.dropdown-layer').html(html);
        $elem.find('.dropdown-toggle .num').html(totalNum(data));
        $elem.find('.cart-bottom .total-num').html(totalNum(data));
        $elem.find('.cart-bottom .total-price').html(totalPrice(data));
    }

    function totalNum(data) {
        var total = 0;
        for (var i = 0; i < data.length; i++) {
            total += Number(data[i].num);
        }
        return total;
    }

    function totalPrice(data) {
        var total = 0;
        for (var i = 0; i < data.length; i++) {
            total += Number(data[i].price);
        }
        return total;
    }

})(jQuery);
