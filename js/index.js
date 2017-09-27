$(document).ready(function () {
    //判断横竖屏
    document.querySelector('body').addEventListener('touchmove', function(e) {
        e.preventDefault();
    });
    window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", orientationfn, false);
    orientationfn();

    setTimeout(function () {
        $('.loading').hide();
        $('.container').show();
        $('.container').addClass('fadeIn')
    },2200);
    setTimeout(function () {
        $('.shade-swipe').show();
        $('.shade-swipe').addClass('fadeIn')
    },1000);
    var shade=document.getElementsByClassName('shade-swipe');
    shade[0].addEventListener('touchstart',function () {
        $('.shade-swipe').hide();
    },false);

    //滑动处理
    var startX, startY;
    var home = document.getElementsByClassName('home');
    home[0].addEventListener('touchstart', function (ev) {
        startX = ev.touches[0].pageX;
        startY = ev.touches[0].pageY;

        $('.flag').hide();
        $('.building').removeClass('scale');
        $('.building').hide();
    }, false);
    var currentAngle = null;
    var initAngle = null;
    home[0].addEventListener('touchmove', function (ev) {
        var currentX, currentY;
        currentX = ev.changedTouches[0].pageX;
        currentY = ev.changedTouches[0].pageY;
        var direction = GetSlideDirection(startX, startY, currentX, currentY);
        var distance = startX - currentX;
        var angle = distance / 5;

        //每次都恢复上次 touchend时的角度
        currentAngle = initAngle;
        currentAngle += angle;
        // 超出的角度禁止滑动
        if (currentAngle >= 48) {
            e.preventDefault();
            currentAngle = 48
        }
        else if (currentAngle < -48) {
            e.preventDefault();
            currentAngle = -48
        }

        if (direction == 3) {
            $('.earch').css({
                'transform': 'rotate(' + currentAngle + 'deg)',
                '-webkit-transform': 'rotate(' + currentAngle + 'deg)'
            });
        }
        if (direction == 4) {
            $('.earch').css({
                'transform': 'rotate(' + currentAngle + 'deg)',
                '-webkit-transform': 'rotate(' + currentAngle + 'deg)'
            })
        }
    }, false);

    home[0].addEventListener('touchend', function (ev) {
        if (currentAngle >= 30) {
            initAngle = 48;
            $('.earch').css({'transform': 'rotate(48deg)', '-webkit-transform': 'rotate(48deg)'});

            $('.flag-model').show();
            $('.flag-model').addClass('bounceIn');

            $('.container .building').css({'top': '21%'});
            $('.buildingA').show();
            $('.buildingA').addClass('scale');
        }
        else if (currentAngle >= 0 && currentAngle < 30) {
            initAngle = 0;
            $('.earch').css({'transform': 'rotate(0deg)', '-webkit-transform': 'rotate(0deg)'});

            $('.flag-sales').show();
            $('.flag-sales').addClass('bounceIn');

            $('.container .building').css({'top': '23%'});
            $('.buildingB').show();
            $('.buildingB').addClass('scale');
        }
        else if (currentAngle <= -30) {
            initAngle = -48;
            $('.earch').css({'transform': 'rotate(-48deg)', '-webkit-transform': 'rotate(-48deg)'});

            $('.flag-location').show();
            $('.flag-location').addClass('bounceIn');

            $('.container .building').css({'top': '10%'});
            $('.buildingC').show();
            $('.buildingC').addClass('scale');
        }
        else if (currentAngle < 0 && currentAngle > -30) {
            initAngle = 0;
            $('.earch').css({'transform': 'rotate(0deg)', '-webkit-transform': 'rotate(0deg)'});

            $('.flag-sales').show();
            $('.flag-sales').addClass('bounceIn');

            $('.container .building').css({'top': '23%'});
            $('.buildingB').show();
            $('.buildingB').addClass('scale');
        }
    }, false);


    //点击buildingB
    $('.home .buildingB').on('click', function () {
        $.ajax({
            url: 'http://192.168.0.189/repos/net_sindcorp_store/web/peixiao',
            type: 'GET',
            jsonp: "callback",
            dataType: 'jsonp',
            success: function (res) {
                $('.sales-netWork .header h2').text(+res.data.length+'家配销公司');
                var parent = $('.sales-netWork .swiper-container .swiper-wrapper');
                parent.empty();
                res.data.forEach(function (val, index) {
                    console.log(index)
                    var children = "<div class='swiper-slide'><input type='hidden' name='id' data-id=" + res.data[index].id + ">" + res.data[index].shop_name + "</div>";
                    parent.append(children);
                    $('.sales-netWork').show();
                    var mySwiper = new Swiper('.swiper-container', {
                        direction: 'horizontal',
                        speed: 800,
                        slidesPerView: 5,
                        paginationClickable: true,
                        spaceBetween: 5,
                        autoplay: 1500
                    });
                });
                $('.swiper-slide').on('click', function () {
                    var id = $(this).children("input[name='id']").data('id');
                    console.log(id);
                    $.ajax({
                        url: 'http://192.168.0.189/repos/net_sindcorp_store/web/peixiao/default/detail?id=' + id,
                        type: 'GET',
                        jsonp: "callback",
                        dataType: 'jsonp',
                        success: function (res) {
                            var parent = $('.search .content');
                            parent.empty();
                            var children = "<div class='box'><h3>" + res.data.shop_name + "</h3><p>所在地址:" + res.data.address + "</p><p>联系电话:" + res.data.telephone + "</p><p>配销区域:" + res.data.region + "</p></div>"
                            parent.append(children);
                            $('.sales-netWork').hide();
                            $('.search').show();
                            $('.search').addClass('fadeIn');
                        }
                    });
                });
            }
        })
    });

    //点击某一配销公司跳转到search


    //营销模式
    $('.buildingA').on('click',function () {
        $('.floating-window').hide();
        $('.sales-model').show();
        $('.sales-model').addClass('fadeIn')
    });

    //搜索
    $('.buildingC').on('click',function () {
        $('.floating-window').hide();
        var parent = $('.search .content');
        parent.empty();
        $('.search').show();
        $('.search').addClass('fadeIn');

        $("input[name='submit']").on('click',function () {
            var keywords=$("input[name='province']").val();
            $.ajax({
                url:'http://192.168.0.189/repos/net_sindcorp_store/web/peixiao?keywords='+keywords,
                type: 'GET',
                jsonp: "callback",
                dataType: 'jsonp',
                success:function (res) {
                    var parent = $('.search .content');
                    parent.empty();
                    res.data.forEach(function (val, index) {
                        var children = "<div class='box'><h3>" + res.data[index].shop_name + "</h3><p>所在地址:" + res.data[index].address + "</p><p>联系电话:" + res.data[index].telephone + "</p><p>配销区域:" + res.data[index].region + "</p></div>"
                        parent.append(children);
                    });
                }
            })
        });
    });


    // 隐藏悬浮窗
    $('.icon-close').on('click', function () {
        $(this).parent('.floating-window').hide()
    });

});
//判断横竖屏
function orientationfn() {
    setTimeout(function () {
        var html = document.documentElement;
        var w = html.clientWidth, h = html.clientHeight;
        if (h > w) {
            // alert('横屏显示效果展示更好哦!')
            // $('body').css({'transform': 'rotate(90deg)'});
            // $('.loading,.container').css({'transform': 'rotate(90deg)'});
            // $('.shade-swipe').css({'transform': 'rotate(-90deg)'});
        }
    }, 300);
}

//返回角度
function GetSlideAngle(dx, dy) {
    return Math.atan2(dy, dx) * 180 / Math.PI;
}

//根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
function GetSlideDirection(startX, startY, endX, endY) {
    var dy = startY - endY;
    var dx = endX - startX;
    var result = 0;

    //如果滑动距离太短
    if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
        return result;
    }

    var angle = GetSlideAngle(dx, dy);
    if (angle >= -45 && angle < 45) {
        result = 4;
    } else if (angle >= 45 && angle < 135) {
        result = 1;
    } else if (angle >= -135 && angle < -45) {
        result = 2;
    }
    else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
        result = 3;
    }
    return result;
}