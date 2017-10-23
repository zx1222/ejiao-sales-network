$(document).ready(function () {
    document.querySelector('body').addEventListener('touchmove', function(e) {
        e.preventDefault();
    });
    //阻止滑动冒泡
    var floatingWindow=document.getElementsByClassName('floating-window');
    for(var i=0;i<floatingWindow.length;i++){
        floatingWindow[i].addEventListener('touchmove',function (e) {
            e.stopPropagation()
        },false)
    }
    //判断横竖屏
    window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", orientationfn, false);
    orientationfn();

    //loading
    setTimeout(function () {
        $('.loading').hide();
        $('.container').show();
        $('.container').addClass('fadeIn')
    },2000);

    //滑动提示遮罩
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
        ev.preventDefault();
        var currentX, currentY;
        currentX = ev.changedTouches[0].pageX;
        currentY = ev.changedTouches[0].pageY;
        var direction = GetSlideDirection(startX, startY, currentX, currentY);
        var distance = startY - currentY;
        var angle = distance / 5;

        //每次都恢复上次 touchend时的角度
        currentAngle = initAngle;
        currentAngle += angle;
        // 超出的角度禁止滑动
        if (currentAngle >= 48) {
            ev.preventDefault();
            currentAngle = 48
        }
        else if (currentAngle < -48) {
            ev.preventDefault();
            currentAngle = -48
        }

        if (direction == 1) {
            $('.earch').css({
                'transform': 'rotate(' + currentAngle + 'deg)',
                '-webkit-transform': 'rotate(' + currentAngle + 'deg)'
            });
            $('.car').css({
                'transform': 'rotate3d(0,1,0,190deg)'
            })
        }
        if (direction == 2) {
            $('.earch').css({
                'transform': 'rotate(' + currentAngle + 'deg)',
                '-webkit-transform': 'rotate(' + currentAngle + 'deg)'
            });
            $('.car').css({
                'transform': 'rotate3d(0,1,0,0deg)'
            })
        }
    }, false);

    home[0].addEventListener('touchend', function (ev) {
        if (currentAngle >= 30) {
            initAngle = 45;
            $('.earch').css({'transform': 'rotate(48deg)', '-webkit-transform': 'rotate(48deg)'});

            $('.flag-model').show();
            $('.flag-model').addClass('bounceIn');

            $('.container .building').css({'top': '41%'});
            $('.buildingA').show();
            $('.buildingA').addClass('scale');
        }
        else if (currentAngle >= 0 && currentAngle < 30) {
            initAngle = 0;
            $('.earch').css({'transform': 'rotate(0deg)', '-webkit-transform': 'rotate(0deg)'});

            $('.flag-sales').show();
            $('.flag-sales').addClass('bounceIn');

            $('.container .building').css({'top': '42%'});
            $('.buildingB').show();
            $('.buildingB').addClass('scale');
        }
        else if (currentAngle <= -30) {
            initAngle = -45;
            $('.earch').css({'transform': 'rotate(-48deg)', '-webkit-transform': 'rotate(-48deg)'});

            $('.flag-location').show();
            $('.flag-location').addClass('bounceIn');

            $('.container .building').css({'top': '35%'});
            $('.buildingC').show();
            $('.buildingC').addClass('scale');
        }
        else if (currentAngle < 0 && currentAngle > -30) {
            initAngle = 0;
            $('.earch').css({'transform': 'rotate(0deg)', '-webkit-transform': 'rotate(0deg)'});

            $('.flag-sales').show();
            $('.flag-sales').addClass('bounceIn');

            $('.container .building').css({'top': '42%'});
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
                    var children = "<div class='swiper-slide'><input type='hidden' name='id' data-id=" + res.data[index].id + ">" + res.data[index].shop_name + "</div>";
                    parent.append(children);
                    $('.sales-netWork').show();
                    var mySwiper = new Swiper('.swiper-container', {
                        loop:true,
                        direction: 'horizontal',
                        speed: 800,
                        slidesPerView: 5,
                        paginationClickable: true,
                        spaceBetween: 5,
                        autoplay: 1200,
                    });
                });
                $('.swiper-slide').on('click', function () {
                    var id = $(this).children("input[name='id']").data('id');
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

    //设置页面宽高
    var width=$('body').width();
    var height=$('body').height();
    $('.floating-window').css({'width':height,'height':width,'top':(height-width)/2+'px','left':-(height-width)/2+'px'});

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
                    if(res.data.length>1) {
                        $('.search .content ').height('50%');
                        res.data.forEach(function (val, index) {
                            var children = "<div class='box'><h3>" + res.data[index].shop_name + "</h3><p>所在地址:" + res.data[index].address + "</p><p>联系电话:" + res.data[index].telephone + "</p><p>配销区域:" + res.data[index].region + "</p></div>"
                            parent.append(children);
                        });
                    }
                    else {
                        var children = "<div class='box'><h3>" + res.data[0].shop_name + "</h3><p>所在地址:" + res.data[0].address + "</p><p>联系电话:" + res.data[0].telephone + "</p><p>配销区域:" + res.data[0].region + "</p></div>"
                        parent.append(children);
                    }
                }
            })
        });
    });


    // 隐藏悬浮窗
    $('.icon-close').on('click', function () {
        $(this).parent('.floating-window').hide();
        $("input[name='province']").val('');
        $('.search .content ').height("auto");
    });

});
//判断横竖屏
function orientationfn() {
    setTimeout(function () {
        var html = document.documentElement;
        var w = html.clientWidth, h = html.clientHeight;
        if (h < w) {
            alert('锁定竖屏显示效果更好yo~');
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
    }else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
        result = 3;
    }
    return result;
}