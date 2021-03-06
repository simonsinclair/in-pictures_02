// main.js
//

"use strict";

(function(win, $, undefined) {

	var doc = win.document;

	// HOOK
	// Page loaded

	$(win).on('load', function() {
		$('body').addClass('loaded');
	});

	// Keyboard shortcuts
	$(doc).on('keyup', function(e) {
		switch(e.which) {
			case 37:
				Gallery.previousImage();				
				break;

			case 39:
				Gallery.nextImage();
				break;

			default:
				console.log(e.which);
		}
	});

	// MODULES
	// - Gallery

	var Gallery = {

		config: {
			numImages: 18,
			imageWidth: 976,
			thumbWidth: 61,
			thumbScrollThreshold: 7
		},

		activeImage: 0,
		thumbsPosition: 0,
		captions: {},

		init: function(id) {
			Gallery.$elem 	= $(id);
			Gallery.$thumbs = $('#js-gallery-thumbs', Gallery.$elem);
			Gallery.bindEvents();
			Gallery.setImagesWidth();
			Gallery.setThumbsWidth();

			$.get('captions.json', function(data) {
				Gallery.captions = data;
			});
		},

		setCaptions: function(d) {
			console.log(d);
		},

		bindEvents: function() {
			$('#js-gallery-previous').on('click', Gallery.previousImage);
			$('#js-gallery-next').on('click', Gallery.nextImage);
			Gallery.$thumbs.on('click', 'li', Gallery.navigateViaThumb);
		},

		setImagesWidth: function() {
			var imagesWidth = Gallery.config.imageWidth * Gallery.config.numImages;
			$('#js-gallery-images', Gallery.$elem).css('width', imagesWidth);
		},

		setThumbsWidth: function() {
			var thumbsWidth = (Gallery.config.thumbWidth * Gallery.config.numImages) + (8 * Gallery.config.numImages);
			Gallery.$thumbs.css('width', thumbsWidth);
		},

		previousImage: function(e) {
			if(Gallery.activeImage <= 0) {
				return;
			}
			Gallery.navigateToImage( Gallery.activeImage - 1 );
		},

		nextImage: function(e) {
			if(Gallery.activeImage >= (Gallery.config.numImages - 1)) {
				return;
			}
			Gallery.navigateToImage( Gallery.activeImage + 1 );
		},

		navigateViaThumb: function() {
			var index = $('li', Gallery.$thumbs).index(this);

			// Navigate to image
			Gallery.navigateToImage(index);
		},

		navigateToImage: function(index) {

			// Don't navigate if we're already on that image
			if(index === Gallery.activeImage) {
				return;
			}

			// Move carousel
			var position = Gallery.config.imageWidth * index;
			$('#js-gallery-images', Gallery.$self).css('transform', 'translateX('+ -position +'px)');

			// Update current index
			Gallery.activeImage = index;

			// Update appearances
			Gallery.updateActiveThumb();
			Gallery.updateThumbsPosition();
			Gallery.updatePreviousNext();
			Gallery.updateImageOf();
			Gallery.updateCaption();
		},

		updateActiveThumb: function() {
			$('li.active', Gallery.$thumbs).removeClass('active');
			$('li', Gallery.$thumbs)
				.eq(Gallery.activeImage)
				.addClass('active');
		},

		updateThumbsPosition: function() {

			if((Gallery.activeImage + 1) > Gallery.config.thumbScrollThreshold) {

				if(Gallery.config.numImages - Gallery.activeImage > Gallery.config.thumbScrollThreshold) {

					// We subtract thumbScrollThreshold from activeImage to move the point at which we scroll
					var position = Gallery.config.thumbWidth * ((Gallery.activeImage + 1) - Gallery.config.thumbScrollThreshold);
					Gallery.$thumbs.css('transform', 'translateX('+ -position +'px)');
				}

			} else {
				Gallery.$thumbs.css('transform', 'translateX(0)');
			}
		},

		updatePreviousNext: function() {

			// By default
			$('#js-gallery-previous', Gallery.$self).removeClass('deactivated');
			$('#js-gallery-next', Gallery.$self).removeClass('deactivated');

			// At the beginning
			if(Gallery.activeImage <= 0) {
				$('#js-gallery-previous', Gallery.$self).addClass('deactivated');
			}

			// At the end
			if(Gallery.activeImage >= (Gallery.config.numImages - 1)) {
				$('#js-gallery-next', Gallery.$self).addClass('deactivated');
			}
		},

		updateImageOf: function() {
			$('#js-image-of').text( Gallery.activeImage + 1 );
		},

		updateCaption: function() {
			$('#js-gallery-caption').text( Gallery.captions[Gallery.activeImage] );
		}

	};

	$(function() {
		Gallery.init('#js-gallery');
	});
})(this, jQuery);
