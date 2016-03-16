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

            var styleParts = $build.find('style').html().split(';'),
                css = '';
            for (var i = 0, len = styleParts.length; i < len; i++) {
                if (styleParts[i].indexOf('@import') > -1) {
                    css += styleParts[i] + ';';
                }
            }

            $build.find('meta').remove();
            $build.find('style').remove();

            if (css !== '') {
                $('head').append('<style class="google-styles">' + css + '</style>');
            }

            // process html type based
            if ($attrs.type === 'lunch-menu') {
                var table1 = $build.find('table:eq(0)'),
                    table2 = $build.find('table:eq(1)'),
                    render = '<div class="lunch-menu table-1"><table>' + table1.html()
                        + '</table></div><div class="lunch-menu table-2"><table>' + table2.html() + '</table></div>';
                $('.google-doc', $element).html(render);
			// Gallerie
			} else if ($attrs.type === 'gallerie') {
                var _findNextSpan = function($p) {
                    var $span = $p.next().find('span'),
                        $next = $p.next();
                    if (($span.length === 0 || $span.html().length === 0) && $next.length) {
                        return _findNextSpan($next);
                    } else if ($span.length !== 0 && $span.html().length !== 0) {
                        return $span;
                    } else if (!$next.length) {
                        return [];
                    }
                };

                var id = new Date().getTime();

				var render = '<div id="gallery-' + id + '" class="owl-carousel owl-theme">',
                    imgCount = 0;
				$build.find('p > span').each(function(i, el){
					var galleryimg = $(el).find('img');
					if (galleryimg.length > 0) {
						var gallerytxt = _findNextSpan($(el).parent());
						if (gallerytxt.length && gallerytxt.html().length > 0 && gallerytxt.find('img').length === 0) {
							render += '<div class="gallerie-img">' +
                                '<div class="wrapper">' +
                                galleryimg.parent().html() +
                                '</div>' +
                                '<div class="gallerie-txt">' + gallerytxt.html() + '</div>' +
                                '</div>';

						} else {
                            render += '<div class="gallerie-img">' +
                                '<div class="wrapper">' +
                                galleryimg.parent().html() +
                                '</div>' +
                                '</div>';
                        }
                        imgCount++;
					}
				});

                $('.google-doc', $element)
                    .addClass('gallerie')
                    .html(render);

                $('#gallery-' + id).owlCarousel({
                    loop: false,
                    pagination : true,
                    paginationNumbers: true,
                    responsiveClass: true,
                    scrollPerPage : true,
                    navText: ['<i class="icon-angle-left"></i>', '<i class="icon-angle-right"></i>'],
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
                            items: 3,
                            nav: true
                        }
                    }
                });

			// news
            } else if ($attrs.type === 'news') {
                var firstMatch = null;
                if ($build.text() !== '') {
                    $('.google-doc', $element)
                        .addClass('news')
                        .html($build.html());
                }
                
			// a la carte
            } else if ($attrs.type === 'alacarte-menu') {
                var table1 = $build.find('table:eq(0)'),
                    table2 = $build.find('table:eq(1)'),
                    table3 = $build.find('table:eq(2)'),
                    table4 = $build.find('table:eq(3)');

                var owlBuild = '<div class="owl-carousel owl-theme">' +
                    '<div><div class="lunch-menu table-one"><table>' + table1.html() + '</table></div></div>' +
                    '<div><div class="lunch-menu table-two"><table>' + table2.html() + '</table></div></div>' +
					'<div><div class="lunch-menu table-three"><table>' + table3.html() + '</table></div></div>' +
                    '<div><div class="lunch-menu table-four"><table>' + table4.html() + '</table></div></div>' +
                    '</div>';

                $('.google-doc', $element).html(owlBuild);

                $('.owl-carousel').owlCarousel({
                    loop: false,
                    pagination : true,
                    paginationNumbers: true,
                    responsiveClass: true,
					scrollPerPage : true,
                    navText: ['<i class="icon-angle-left"></i>', '<i class="icon-angle-right"></i>'],
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
                            items: 2,
                            nav: true
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
