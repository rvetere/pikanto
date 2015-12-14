angular.module('app').controller('HomeCtrl', function HomeCtrl($timeout) {

    var vm = this; // this == $scope because we use the controllerAs definition

    // bind public functions
    vm.selectStripe = selectStripe;

    // private variables
    var $main = $( '#pt-main' ), $pages, $navs, pagesCount,
        $iterate = $( '#iterateEffects' ),
        animcursor = 1,
        current = 0,
        isAnimating = false,
        isWheeling = false,
        isWheelingTimer = null,
        isWheelingTimer2 = null,
        endCurrPage = false,
        endNextPage = false,
        animEndEventNames = {
            'WebkitAnimation' : 'webkitAnimationEnd',
            'OAnimation' : 'oAnimationEnd',
            'msAnimation' : 'MSAnimationEnd',
            'animation' : 'animationend'
        },
    // animation end event name
        animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ],
    // support css animations
        support = Modernizr.cssanimations;

    var viewportW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var viewportH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    $timeout(function() {
        _init();
        _initImageFlipper();
    }, 100);

    // public functions

    function selectStripe(index) {
        if (index > current) {
            _nextPage( 19, index, true );
            $('body').removeClass('pt-hover');
        } else {
            _nextPage( 26, index, true );
            $('body').removeClass('pt-hover');
        }
    }

    // private functions

    function _init() {
        $pages = $main.children( 'div.pt-page' );
        if ($pages.length < 7) {
            console.log('not all pages available..');
            return setTimeout(function() {
                _init();
            }, 50);
        }
        $navs = $('.pt-page-nav li', $main);
        pagesCount = $pages.length;
        $pages.each( function() {
            var $page = $( this );
            $page.data( 'originalClassList', $page.attr( 'class' ) );
        } );

        $pages.eq( current ).addClass( 'pt-page-current' );
        $navs.eq( current ).addClass( 'pt-nav-active' );

        var hammerEl = $('#pt-main')[0],
            mc = new Hammer.Manager(hammerEl, {});

        mc.add( new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0 }) );
        //mc.add( new Hammer.Tap({ event: 'quadrupletap', taps: 4 }) );

        mc.on('pan', _handlePan);
        //mc.on('quadrupletap', handleTaps);

        $('body')
            .on('mousewheel', function(ev) {
                if (isAnimating || isWheeling) {
                    return;
                }

                isWheeling = true;
                if (ev.deltaY > 0) {
                    _nextPage( 26, -1 );
                } else {
                    _nextPage( 19, 1 );
                }

                clearTimeout(isWheelingTimer2);
                isWheelingTimer2 = setTimeout(function() {
                    isWheeling = false;
                }, 3200);
            })
            .on('keyup', function(ev) {
                switch (ev.keyCode) {

                    case 38: // up
                        _nextPage( 26, -1 );
                        break;
                    case 40: // down
                        _nextPage( 19, 1 );
                        break;

                    default:
                        //console.log(ev.keyCode);
                        break;
                }
            });

        $('.pt-page-nav li a', $main).on('mouseover', function(ev) {
            $('body').addClass('pt-hover');
        });

        $('.pt-page-nav-wrap', $main).on('mouseout', function(ev) {
            if ($(ev.target).hasClass('pt-page-nav-wrap')) {
                $('body').removeClass('pt-hover');
            }
        });

        $(window).scroll(function() {
            if (document.body.scrollTop >= 866) {
                $('.navbar-header').addClass('affix-top');
            } else {
                $('.navbar-header').removeClass('affix-top');
            }
        });

    }

    function _initImageFlipper() {
        var $imgs = [];
        $('.image-flipper .hover-img:not(.secondary)').each(function(i, el) {
            if ($(el).find('.secondary').length) {
                $imgs.push(el);
            }
        });

        var min = 3000, max = 6000;
        var _changeImg = function() {
            // change the image to it's secondary src in a nice animation, safe the current url as data-first
            if ($(this).find('.secondary').hasClass('changed')) {
                $(this).find('.secondary').removeClass('changed');
            } else {
                $(this).find('.secondary').addClass('changed');
            }

            var rnd = Math.random() * (max - min) + min;
            setTimeout(_changeImg.bind(this), rnd);
        };

        // giving the intervals some bounds..
        for (var i = 0, len = $imgs.length; i < len; i++) {
            // change every image in a randomly chosen interval..
            var rnd = Math.random() * (max - min) + min;
            setTimeout(_changeImg.bind($imgs[i]), rnd);
        }

    }

    function _handlePan(ev) {
        if (ev.direction === Hammer.DIRECTION_UP) {
            _nextPage( 19, 1 );
        } else if (ev.direction === Hammer.DIRECTION_DOWN) {
            _nextPage( 26, -1 );
        }
    }

    function _nextPage( animation, step, force ) {

        return;

        if( isAnimating ) {
            return false;
        }

        var $currPage = $pages.eq( current );

        current = current + step;
        if (force !== undefined) {
            current = step;
        }

        if ( current < 0 ) {
            current = 0;
        }
        if (current > pagesCount - 1) {
            current = pagesCount - 1;
        }

        if ($pages.eq( current).hasClass('pt-page-current')) {
            return;
        }

        isAnimating = true;

        var $nextPage = $pages.eq( current ).addClass( 'pt-page-current'),
            outClass = '', inClass = '';

        var pageName = $nextPage[0].className.split('pt-page-')[1].split(' ')[0],
            $pageNav = $navs.parents('ul');
        $pageNav[0].className = 'pt-page-nav';
        $pageNav.addClass('state-' + pageName);

        $('.pt-nav-active', $main).removeClass('pt-nav-active');
        var $li = $navs
            .eq( current )
            .addClass( 'pt-nav-active' )
            //.addClass( 'animated' )
            //.addClass( 'pulse' )
            //.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            //    $(this)
            //        .removeClass('animated')
            //        .removeClass('pulse');
            //});
            ;
        //setTimeout(function() {
        //    $(this)
        //        .removeClass('animated')
        //        .removeClass('pulse');
        //}.bind($li[0]), 600);

        var __ret = _getAnimClasses(animation, outClass, inClass);

        $currPage.addClass( __ret.outClass ).on( animEndEventName, function() {
            $currPage.off( animEndEventName );
            endCurrPage = true;
            if( endNextPage ) {
                _onEndAnimation( $currPage, $nextPage );
            }
        } );

        $nextPage.addClass( __ret.inClass ).on( animEndEventName, function() {
            $nextPage.off( animEndEventName );
            endNextPage = true;
            if( endCurrPage ) {
                _onEndAnimation( $currPage, $nextPage );
            }
        } );

        if( !support ) {
            _onEndAnimation( $currPage, $nextPage );
        }

    }

    function _onEndAnimation( $outpage, $inpage ) {
        endCurrPage = false;
        endNextPage = false;
        _resetPage( $outpage, $inpage );
        isAnimating = false;
        clearTimeout(isWheelingTimer);
        isWheelingTimer = setTimeout(function() {
            isWheeling = false;
        }, 600);
        _onNewPageOpen($outpage, $inpage);
    }

    function _onNewPageOpen($outpage, $inpage) {
        // check if there is a video on the current page to play..
        var $video = $('video', $inpage);
        if ($video.length) {
            $video[0].play();
        }

        // and if there is a video on the old page to stop now..
        $video = $('video', $outpage);
        if ($video.length) {
            $video[0].pause();
        }
    }

    function _resetPage( $outpage, $inpage ) {
        $outpage.attr( 'class', $outpage.data( 'originalClassList' ) );
        $inpage.attr( 'class', $inpage.data( 'originalClassList' ) + ' pt-page-current' );
    }

    function _getAnimClasses(animation, outClass, inClass) {
        switch (animation) {

            case 1:
                outClass = 'pt-page-moveToLeft';
                inClass = 'pt-page-moveFromRight';
                break;
            case 2:
                outClass = 'pt-page-moveToRight';
                inClass = 'pt-page-moveFromLeft';
                break;
            case 3:
                outClass = 'pt-page-moveToTop';
                inClass = 'pt-page-moveFromBottom';
                break;
            case 4:
                outClass = 'pt-page-moveToBottom';
                inClass = 'pt-page-moveFromTop';
                break;
            case 5:
                outClass = 'pt-page-fade';
                inClass = 'pt-page-moveFromRight pt-page-ontop';
                break;
            case 6:
                outClass = 'pt-page-fade';
                inClass = 'pt-page-moveFromLeft pt-page-ontop';
                break;
            case 7:
                outClass = 'pt-page-fade';
                inClass = 'pt-page-moveFromBottom pt-page-ontop';
                break;
            case 8:
                outClass = 'pt-page-fade';
                inClass = 'pt-page-moveFromTop pt-page-ontop';
                break;
            case 9:
                outClass = 'pt-page-moveToLeftFade';
                inClass = 'pt-page-moveFromRightFade';
                break;
            case 10:
                outClass = 'pt-page-moveToRightFade';
                inClass = 'pt-page-moveFromLeftFade';
                break;
            case 11:
                outClass = 'pt-page-moveToTopFade';
                inClass = 'pt-page-moveFromBottomFade';
                break;
            case 12:
                outClass = 'pt-page-moveToBottomFade';
                inClass = 'pt-page-moveFromTopFade';
                break;
            case 13:
                outClass = 'pt-page-moveToLeftEasing pt-page-ontop';
                inClass = 'pt-page-moveFromRight';
                break;
            case 14:
                outClass = 'pt-page-moveToRightEasing pt-page-ontop';
                inClass = 'pt-page-moveFromLeft';
                break;
            case 15:
                outClass = 'pt-page-moveToTopEasing pt-page-ontop';
                inClass = 'pt-page-moveFromBottom';
                break;
            case 16:
                outClass = 'pt-page-moveToBottomEasing pt-page-ontop';
                inClass = 'pt-page-moveFromTop';
                break;
            case 17:
                outClass = 'pt-page-scaleDown';
                inClass = 'pt-page-moveFromRight pt-page-ontop';
                break;
            case 18:
                outClass = 'pt-page-scaleDown';
                inClass = 'pt-page-moveFromLeft pt-page-ontop';
                break;
            case 19:
                outClass = 'pt-page-scaleDown';
                inClass = 'pt-page-moveFromBottom pt-page-ontop';
                break;
            case 20:
                outClass = 'pt-page-scaleDown';
                inClass = 'pt-page-moveFromTop pt-page-ontop';
                break;
            case 21:
                outClass = 'pt-page-scaleDown';
                inClass = 'pt-page-scaleUpDown pt-page-delay300';
                break;
            case 22:
                outClass = 'pt-page-scaleDownUp';
                inClass = 'pt-page-scaleUp pt-page-delay300';
                break;
            case 23:
                outClass = 'pt-page-moveToLeft pt-page-ontop';
                inClass = 'pt-page-scaleUp';
                break;
            case 24:
                outClass = 'pt-page-moveToRight pt-page-ontop';
                inClass = 'pt-page-scaleUp';
                break;
            case 25:
                outClass = 'pt-page-moveToTop pt-page-ontop';
                inClass = 'pt-page-scaleUp';
                break;
            case 26:
                outClass = 'pt-page-moveToBottom pt-page-ontop';
                inClass = 'pt-page-scaleUp';
                break;
            case 27:
                outClass = 'pt-page-scaleDownCenter';
                inClass = 'pt-page-scaleUpCenter pt-page-delay400';
                break;
            case 28:
                outClass = 'pt-page-rotateRightSideFirst';
                inClass = 'pt-page-moveFromRight pt-page-delay200 pt-page-ontop';
                break;
            case 29:
                outClass = 'pt-page-rotateLeftSideFirst';
                inClass = 'pt-page-moveFromLeft pt-page-delay200 pt-page-ontop';
                break;
            case 30:
                outClass = 'pt-page-rotateTopSideFirst';
                inClass = 'pt-page-moveFromTop pt-page-delay200 pt-page-ontop';
                break;
            case 31:
                outClass = 'pt-page-rotateBottomSideFirst';
                inClass = 'pt-page-moveFromBottom pt-page-delay200 pt-page-ontop';
                break;
            case 32:
                outClass = 'pt-page-flipOutRight';
                inClass = 'pt-page-flipInLeft pt-page-delay500';
                break;
            case 33:
                outClass = 'pt-page-flipOutLeft';
                inClass = 'pt-page-flipInRight pt-page-delay500';
                break;
            case 34:
                outClass = 'pt-page-flipOutTop';
                inClass = 'pt-page-flipInBottom pt-page-delay500';
                break;
            case 35:
                outClass = 'pt-page-flipOutBottom';
                inClass = 'pt-page-flipInTop pt-page-delay500';
                break;
            case 36:
                outClass = 'pt-page-rotateFall pt-page-ontop';
                inClass = 'pt-page-scaleUp';
                break;
            case 37:
                outClass = 'pt-page-rotateOutNewspaper';
                inClass = 'pt-page-rotateInNewspaper pt-page-delay500';
                break;
            case 38:
                outClass = 'pt-page-rotatePushLeft';
                inClass = 'pt-page-moveFromRight';
                break;
            case 39:
                outClass = 'pt-page-rotatePushRight';
                inClass = 'pt-page-moveFromLeft';
                break;
            case 40:
                outClass = 'pt-page-rotatePushTop';
                inClass = 'pt-page-moveFromBottom';
                break;
            case 41:
                outClass = 'pt-page-rotatePushBottom';
                inClass = 'pt-page-moveFromTop';
                break;
            case 42:
                outClass = 'pt-page-rotatePushLeft';
                inClass = 'pt-page-rotatePullRight pt-page-delay180';
                break;
            case 43:
                outClass = 'pt-page-rotatePushRight';
                inClass = 'pt-page-rotatePullLeft pt-page-delay180';
                break;
            case 44:
                outClass = 'pt-page-rotatePushTop';
                inClass = 'pt-page-rotatePullBottom pt-page-delay180';
                break;
            case 45:
                outClass = 'pt-page-rotatePushBottom';
                inClass = 'pt-page-rotatePullTop pt-page-delay180';
                break;
            case 46:
                outClass = 'pt-page-rotateFoldLeft';
                inClass = 'pt-page-moveFromRightFade';
                break;
            case 47:
                outClass = 'pt-page-rotateFoldRight';
                inClass = 'pt-page-moveFromLeftFade';
                break;
            case 48:
                outClass = 'pt-page-rotateFoldTop';
                inClass = 'pt-page-moveFromBottomFade';
                break;
            case 49:
                outClass = 'pt-page-rotateFoldBottom';
                inClass = 'pt-page-moveFromTopFade';
                break;
            case 50:
                outClass = 'pt-page-moveToRightFade';
                inClass = 'pt-page-rotateUnfoldLeft';
                break;
            case 51:
                outClass = 'pt-page-moveToLeftFade';
                inClass = 'pt-page-rotateUnfoldRight';
                break;
            case 52:
                outClass = 'pt-page-moveToBottomFade';
                inClass = 'pt-page-rotateUnfoldTop';
                break;
            case 53:
                outClass = 'pt-page-moveToTopFade';
                inClass = 'pt-page-rotateUnfoldBottom';
                break;
            case 54:
                outClass = 'pt-page-rotateRoomLeftOut pt-page-ontop';
                inClass = 'pt-page-rotateRoomLeftIn';
                break;
            case 55:
                outClass = 'pt-page-rotateRoomRightOut pt-page-ontop';
                inClass = 'pt-page-rotateRoomRightIn';
                break;
            case 56:
                outClass = 'pt-page-rotateRoomTopOut pt-page-ontop';
                inClass = 'pt-page-rotateRoomTopIn';
                break;
            case 57:
                outClass = 'pt-page-rotateRoomBottomOut pt-page-ontop';
                inClass = 'pt-page-rotateRoomBottomIn';
                break;
            case 58:
                outClass = 'pt-page-rotateCubeLeftOut pt-page-ontop';
                inClass = 'pt-page-rotateCubeLeftIn';
                break;
            case 59:
                outClass = 'pt-page-rotateCubeRightOut pt-page-ontop';
                inClass = 'pt-page-rotateCubeRightIn';
                break;
            case 60:
                outClass = 'pt-page-rotateCubeTopOut pt-page-ontop';
                inClass = 'pt-page-rotateCubeTopIn';
                break;
            case 61:
                outClass = 'pt-page-rotateCubeBottomOut pt-page-ontop';
                inClass = 'pt-page-rotateCubeBottomIn';
                break;
            case 62:
                outClass = 'pt-page-rotateCarouselLeftOut pt-page-ontop';
                inClass = 'pt-page-rotateCarouselLeftIn';
                break;
            case 63:
                outClass = 'pt-page-rotateCarouselRightOut pt-page-ontop';
                inClass = 'pt-page-rotateCarouselRightIn';
                break;
            case 64:
                outClass = 'pt-page-rotateCarouselTopOut pt-page-ontop';
                inClass = 'pt-page-rotateCarouselTopIn';
                break;
            case 65:
                outClass = 'pt-page-rotateCarouselBottomOut pt-page-ontop';
                inClass = 'pt-page-rotateCarouselBottomIn';
                break;
            case 66:
                outClass = 'pt-page-rotateSidesOut';
                inClass = 'pt-page-rotateSidesIn pt-page-delay200';
                break;
            case 67:
                outClass = 'pt-page-rotateSlideOut';
                inClass = 'pt-page-rotateSlideIn';
                break;

        }
        return {outClass: outClass, inClass: inClass};
    }

});
