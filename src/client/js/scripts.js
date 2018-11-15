'use strict';

/**
 * 1. Featured Slider
 * 2. Search
 * 3. Menu Mobile
 * 4. Header Small
 * 5. Portfolio
 */

(function ($) {
	// filtering & sorting transitions
	$.fn.hukaIsotope = function (opts) {
		var $self = $(this),
			defaults = {
				filter         : '*',
				itemSelector   : '.project-item',
				percentPosition: true,
				masonry        : {
					columnWidth: '.project-item-sizer'
				}
			},
			options = $.extend(defaults, $self.data(), opts),
			$images = $('img', $self),
			$smallImages = $('.image', $self),
			count = 0,
			total = $images.length,
			smallTotal = $smallImages.length;

		if (smallTotal) {
			$.each($smallImages, function () {
				count++;

				if (count === smallTotal) {
					$self.isotope(options);
					$self.data('isIsotope', true);
				}
			});
		} else if (total) {
			$.each($images, function () {
				var image = new Image();

				image.src = $(this).attr('src');

				image.onload = function () {

					count++;

					if (count === total) {
						$self.isotope(options);
						$self.data('isIsotope', true);
					}
				}
			});
		} else {
			$self.isotope(options);
			$self.data('isIsotope', true);
		}

		$self.prev('.controls').on( 'click', 'a', function(e) {
			e.preventDefault();
			var filterValue = $( this ).attr('data-filter'),
				$parent = $(this).closest('li');
			$self.isotope({ filter: filterValue });
			$parent.addClass('active').siblings().removeClass('active');
		});
	};

	$.fn.hukaMagnificPopup = function (opts) {

		var $self = $(this),
			options = $.extend({
				delegate   : '.media',
				type       : 'image',
				tLoading   : '<div class="dots">\
							<div class="dot active"></div>\
							<div class="dot active"></div>\
							<div class="dot active"></div>\
							<div class="dot active"></div>\
						</div>',
				mainClass  : 'mfp-img-mobile',
				gallery    : {
					enabled           : true,
					navigateByImgClick: true,
					preload           : [0, 3] // Will preload 0 - before current, and 1 after the current image
				},
				image      : {
					tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
				},
				closeMarkup: '<button title="%title%" type="button" class="mfp-close"></button>',
				callbacks  : {
					markupParse      : function (item) {
					},
					imageLoadComplete: function () {
						var $container = $('.mfp-container');

						$container.addClass('load-done');
						setTimeout(function () {
							$container.addClass('load-transition');
						}, 50);
					},
					change           : function () {
						var $container = $('.mfp-container');
						$container.removeClass('load-done load-transition');
					}

				}
			}, $self.data(), opts);
		$('.media', $self).each( function () {
			var href = $(this).data('url');

			if (href && href !== '') {
				$(this).attr('href', href);
			}

		});
		$self.magnificPopup(options);
	};

	$(document).on('ready', function () {

		/* 1. Featured Slider */
		var $featuredWrap = $('.featured-slider-wrap');

		$featuredWrap.each( function () {
			var maxHeight = $(this).data('maxHeight'),
				marginTop = $(this).data('marginTop');
			if (parseInt(maxHeight, 10)) {
				$('.image', this).css('max-height', maxHeight + 'px');
			}
			if (parseInt(marginTop, 10)) {
				$(this).css('margin-top', marginTop + 'px');
			}
			$('.featured-slider', this).owlCarousel({
				items: 1,
				dots : false,
				nav: true,
				loop: true,
				navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
				responsive: {
					0: {
						dots: 0,
						autoplay: 0
					},
					768: {}
				}
			});
		});

		/* 2. Search */
		var $search = $('.search', '.socials');

		if ($search.length) {
			$search.on('click', function (e) {
				e.preventDefault();
				$search.toggleClass('active');
				$('#box-search').toggleClass('active');

				if ($search.hasClass('active')) {
					setTimeout(function () {
						$('input', '#box-search').focus();
					}, 50);
				}
			});
		}

		/* 3. Menu Mobile */
		var $menu = $('.menu-list'),
			$menuMobile = $('.menu-mobile'),
			$mainMenu = $('.main-menu'),
			$mobileCover = $('.mobile-cover');

		if ($menu.length) {
			$('.menu-item-has-children > a', $menu).on('click', function (e) {
				var ww = $(window).width(),
					$parent = $(this).closest('.menu-item-has-children');

				if ( ww <= 991) {
					e.preventDefault();
					$('> .sub-menu', $parent).slideToggle();
				}
			});
		}
		$menuMobile.on('click', function () {
			$mainMenu.addClass('active');
		});

		$mobileCover.on('click', function () {
			$mainMenu.removeClass('active');
		});
		$('.close-menu').on('click', function () {
			console.log(1);
			$mobileCover.trigger('click');
		});
		$(document).on('keydown', function (event) {
			if ($mainMenu.hasClass('active')) {
				if (event.keyCode === 27) {
					$mobileCover.trigger('click');
				}
			}
		});


		/* 4. Header Small */
		$(window).on('scroll', function () {
			var scrollTop = $(window).scrollTop(),
				$header = $('#header');
			if (scrollTop > 10) {
				$header.addClass('header-small');
			}
			else {
				$header.removeClass('header-small');
			}
		});


		/* 5. Portfolio */
		var $portfolio = $('.grids-layout');

		if ($portfolio.length) {

			$portfolio.each(function () {
				$(this).hukaIsotope();
			})
		}

		var $imageProject = $('.images-project');

		if ($imageProject.length) {
			$imageProject.hukaMagnificPopup({
				delegate: 'a'
			});
		}
		// ==== Projects filter nav, upon first load and clicks ==== //
		// Remodelling ==> change this once we have Remodelling pics
		$('#projects-list-filter div.remodelling').hide();
		$('.projects .controls a[data-filter=".remodelling"]').on('click', function() {
			$('#projects-list-filter div.remodelling').show();
		});
		// Cabinets
		$('#projects-list-filter div.cabinets').hide();
		$('.projects .controls a[data-filter=".cabinets"]').on('click', function() {
			$('#projects-list-filter div.cabinets').show();
		});
		// Fencing
		$('#projects-list-filter div.fencing').hide();
		$('.projects .controls a[data-filter=".fencing"]').on('click', function() {
			$('#projects-list-filter div.fencing').show();
		});
		/*  Project Pics  */
		// Image Async Load
		$('.lazyLoad').each(function () {
		var $currentImage = $(this);
			$(this).attr('src', $currentImage.attr('data-src'));
		});
		$portfolio.each(function () {
			$(this).hukaIsotope();
		});

		//////// Remove preloader after we assign img src ///////
		if ($('#projects-list-filter').length !== 0) {
			$('.preloader').addClass('deactivate');
		}
		// and Carousel
		if ($('.carousel').length) {
			$('.carousel').carousel({interval: false});
		}
		////////////////////////////////////////////////////////

		var $backToTop = $('.back-to-top');

		$backToTop.on('click', function () {
			$('html, body').animate({
				scrollTop: 0
			}, 500);
		});

		// Testimonial Slider
		var $testimonial = $('.testimonial-items');

		if ($testimonial.length) {
			$testimonial.owlCarousel({
				items: 1,
				nav: false,
				dots: true,
				autoHeight: true
			});
		}

		$(window).on('scroll', function () {
			var wt = $(window).scrollTop();

			if (wt > 500) {
				$backToTop.addClass('active');
			}
			else {
				$backToTop.removeClass('active');
			}
		});


		// Sticky Project
		var $projectInner = $('.project-inner.sticky');

		if ($projectInner.length && $projectInner.parent().hasClass('col-md-6')) {
			var options = {
				minWidth: 768,
				marginTop: 80,
				zIndex: 99,
				limit: function () {
					var limit = $imageProject.outerHeight(true) + $imageProject.offset().top - $projectInner.outerHeight(true);

					return limit;
				},
				removeOffsets: true
			};
			$projectInner.scrollToFixed(options);
		}


		$(window).on('load', function () {
			$('.preloader').addClass('deactivate');
		})

	});
})(jQuery);