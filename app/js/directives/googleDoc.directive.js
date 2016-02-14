angular.module('app').directive('googleDoc', function appVersion() {
    return {
        restrict: 'E',
        template: '<div class="google-doc"></div>',
        link: link
    };

    function link($scope, $element, $attrs) {
        var proxyUrl = location.href.indexOf('localhost') > -1 ? 'http://localhost/' : '/',
            url = proxyUrl + 'app/assets/curlProxy.php?url=' + $attrs.url;

        var request = $.ajax({
            url: url,
            method: 'GET',
            dataType: 'html'
        });

        request.done(function(msg) {
            // cleanup some basic things
            var $build = $('<div>' + msg + '</div>');
            $build.find('meta').remove();
            $build.find('style').remove();

            // process html type based
            if ($attrs.type === 'lunch-menu') {
                var table1 = $build.find('table:eq(0)'),
                    table2 = $build.find('table:eq(1)'),
                    render = '<div class="lunch-menu table-one"><table>' + table1.html()
                        + '</table></div><div class="lunch-menu table-two"><table>' + table2.html() + '</table></div>';
                $('.google-doc', $element).html(render);
            } else if ($attrs.type === 'alacarte-menu') {
                var table1 = $build.find('table:eq(0)'),
                    table2 = $build.find('table:eq(1)'),
                    table3 = $build.find('table:eq(2)'),
                    table4 = $build.find('table:eq(3)');

                var owlBuild = '<div class="owl-carousel owl-theme">' +
                    '<div><div class="lunch-menu table-one"><table>' + table1.html() + '</table></div><div class="lunch-menu table-two"><table>' + table2.html() + '</table></div></div>' +
                    '<div><div class="lunch-menu table-three"><table>' + table3.html() + '</table></div><div class="lunch-menu table-four"><table>' + table4.html() + '</table></div></div>' +
                    '</div>';

                $('.google-doc', $element).html(owlBuild);

                $('.owl-carousel').owlCarousel({
                    loop: true,
                    responsiveClass: true,
                    navText: ['<i class="icn-ios-arrow-left"></i>', '<i class="icn-ios-arrow-right"></i>'],
                    responsive: {
                        0: {
                            items: 1,
                            nav: true
                        },
                        500: {
                            items: 1,
                            nav: true
                        },
                        1025: {
                            items: 1,
                            nav: true,
                            loop: false
                        }
                    }
                });
            } else {
                $('.google-doc', $element).html($($build[0]).html());
            }
        });

        request.fail(function(jqXHR, textStatus) {
            $('.google-doc', $element).html('Request failed: ' + textStatus);
        });
    }
});
