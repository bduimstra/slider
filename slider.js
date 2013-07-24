var Slider = function( container, settings ) {
	this.container = container;
	this.settings = settings;
};

Slider.prototype.buildSlider = function() {
	$('body').append('<link rel="stylesheet" href="css/slider.css">');

	var myContainer = this.container,
		containerContents = myContainer.html(),
		containerWrapper = $('<div />' , { 'class' : 'slider-wrapper' });

	myContainer.empty();

	containerWrapper
			.append(containerContents)
			.css('width' , containerWrapper.children().length * this.settings.sliderWidth);

	myContainer
			.append(containerWrapper)
			.css({
				'height' : this.settings.sliderHeight,
				'width' : this.settings.sliderWidth,
				'overflow' : 'hidden',
				'position' : 'relative'
			})
			.children('.slider-wrapper').children().css({
				'float' : 'left',
				'position' : 'relative'
			});

	this.buildButtons();
};

Slider.prototype.buildButtons = function() {
	var dotNav = $('<div />', { 'class' : 'dot-nav' }),
		slideNumber,
		container = this.container;

	container.append('<div class="nav-buttons"><div class="left-button"><p>&larr;</p></div><div class="right-button"><p>&rarr;</p></div></div>');

	for ( i = 0; i < container.find('.slider-wrapper').children().length; i++ ) {
		slideNumber = i + 1;
		dotNav.append('<div class="dot-outer"><div class="dot"><p>' + slideNumber + '</p></div></div>')
	}

	container.append(dotNav);

	$('.left-button , .right-button', container)
			.on('mouseenter.slider.nav-buttons', function(){
				$(this).stop().animate({ opacity : 0.7 }, 200);
			})
			.on('mouseleave.slider.nav-buttons', function(){
				$(this).stop().animate({ opacity : 0.4 }, 200);
			});

	this.slideMover();
};

Slider.prototype.slideMover = function() {
	var currentSlide = this.settings.currentSlide - 1 || 0,
		container = this.container,
		slideContainer = container.find('.slider-wrapper'),
		numSlides = slideContainer.children().length - 1,
		slideWidth,
		moveSlide,
		autoPushTimer;

	$('.dot-outer').eq(currentSlide).addClass('current-dot');

	$('.left-button').on('click.left-button', function() {
		if ( currentSlide == 0) {
			currentSlide = numSlides;
		} else {
			currentSlide--;
		}

		moveSlide( currentSlide );
		clearInterval(autoPushTimer)
	});

	$('.right-button').on('click.right-button', function() {
		if ( currentSlide == numSlides ) {
			currentSlide = 0;
		} else {
			currentSlide++;
		}

		moveSlide( currentSlide );
		clearInterval(autoPushTimer)
	});

	$('.dot-outer').on('click.dot-button', function() {
		currentSlide = $(this).index();
		moveSlide( currentSlide );
		clearInterval(autoPushTimer)
	});

	moveSlide = function( currentSlide ) {
		var currentSlide = currentSlide,
			slideWidth = slideContainer.children().outerWidth();

		$('.dot-outer').removeClass('current-dot').eq(currentSlide).addClass('current-dot');

		if ( Modernizr.csstransitions ) {
			slideContainer.css('margin-left' , (-1 * slideWidth * currentSlide) + 'px');
		} else {
			slideContainer.animate({'margin-left' : (-1 * slideWidth * currentSlide) + 'px'}, 600);
		}
	}

	if ( this.settings.autoPush == true ) {
		autoPushTimer = setInterval(function() {
			if ( currentSlide != numSlides ) {
				currentSlide++;
			} else {
				currentSlide = 0;
			}
			moveSlide( currentSlide )
		}, 6000)
	} 
};

