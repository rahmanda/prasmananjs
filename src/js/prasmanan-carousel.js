(function() {
  var defaultOpts = {
    autoPlay: true,
    autoPlaySpeed: 5000,
    pointer: 0,
    left: 0,
    margin: 5,
    height: 250,
    width: 590,
    centerMode: 'true',
    responsive: 'false'
  };

  function calculateDistance (frame, slideWidth) {
    var left;
    left = (frame.outerWidth() - slideWidth) / 2;
    return slideWidth - left;
  }

  function Carousel(opts) {
    this.opts = $.extend({}, defaultOpts, opts);
    this.initialize();
  }

  Carousel.prototype.initialize = function() {
    this.setSlideWidth();
    this.setFrameHeight();
    this.setInitialProps();
    this.setNavWidth();
    this.buildNavButton();
    this.buildDots();
    this.setTrackWidth();
    this.setInitialLeft();
    return this.startAutoPlay();
  };

  Carousel.prototype.startAutoPlay = function() {
    if (this.opts.autoPlay) {
      this.interval = setInterval(this.next.bind(this), this.opts.autoPlaySpeed);
    }
  };

  Carousel.prototype.stopAutoPlay = function() {
    if (this.opts.autoPlay) {
      clearInterval(this.interval);
    }
  };

  Carousel.prototype.restartAutoPlay = function() {
    if (this.opts.autoPlay) {
      clearInterval(this.interval);
      this.startAutoPlay();
    }
  };

  Carousel.prototype.next = function() {
    if (this.opts.pointer < this.opts.slidesCount - 1) {
      this.cycle = false;
    } else {
      this.cycle = true;
    }
    this.opts.left -= this.opts.distance;
    this.opts.pointer++;
    this.restartAutoPlay();
    this.moveTrack('next');
  };

  Carousel.prototype.prev = function() {
    if (this.opts.pointer > 0) {
      this.cycle = false;
    } else {
      this.cycle = true;
    }
    this.opts.left += this.opts.distance;
    this.opts.pointer--;
    this.restartAutoPlay();
    this.moveTrack('prev');
  };

  Carousel.prototype.moveTrack = function(dir) {
    var event, that, track;
    that = this;
    event = 'webkitTransitionEnd mozTransitionEnd oAnimationEnd otransitionend transitionend';
    track = document.getElementsByClassName(this.opts.track)[0];
    track.classList.add('animate');
    // I'm here
    track.css({
      left: that.opts.left
    });
    return track.one(event, function(e) {
      if (that.cycle) {
        track.removeClass('animate');
        if (dir === 'next') {
          that.opts.left = that.defaultNearLeft;
          that.opts.pointer = 0;
        } else if (dir === 'prev') {
          that.opts.left = that.defaultFarLeft;
          that.opts.pointer = that.opts.slidesCount - 1;
        }
        track.css({
          left: that.opts.left
        });
      }
      that.moveDot();
    });
  };

  Carousel.prototype.moveDot = function() {
    var $container;
    if (this.opts.centerMode === 'false') {
      $container = this.opts.frame;
      $container.find('.js-carousel-dot').removeClass('active');
      $container.find(".js-carousel-dot-" + this.opts.pointer).addClass('active');
    }
  };

  Carousel.prototype.buildNavButton = function() {
    var $btnLeft, $btnRight, navWidth, template;
    if (this.opts.centerMode === 'true' && $('.js-carousel-nav').length === 0) {
      template = "<button class='carousel__nav js-carousel-nav'></button>";
      $btnLeft = $(template);
      navWidth = ($(this.opts.frame).outerWidth() - this.opts.slideWidth) / 2;
      $btnLeft.css("width", navWidth - this.opts.margin);
      $btnRight = $btnLeft.clone();
      $btnLeft.attr('data-type', 'go-prev-banner');
      $btnRight.attr('data-type', 'go-next-banner');
      $btnLeft.addClass('carousel__nav--prev');
      $btnRight.addClass('carousel__nav--next');
      this.opts.frame.append($btnLeft);
      this.opts.frame.append($btnRight);
    }
  };

  Carousel.prototype.buildDots = function() {
    var $btnDot, $clone, $container, count, dot, i, ref;
    if (this.opts.centerMode === 'false') {
      count = this.opts.slidesCount;
      $container = $("<div class='carousel__dots'></div>");
      $btnDot = $("<span class='carousel__dots-item js-carousel-dot'></span>");
      for (dot = i = 0, ref = count - 1; 0 <= ref ? i <= ref : i >= ref; dot = 0 <= ref ? ++i : --i) {
        $clone = $btnDot.clone();
        $clone.addClass("js-carousel-dot-" + dot);
        if (dot === 0) {
          $clone.addClass('active');
        }
        $container.append($clone);
      }
      this.opts.frame.append($container);
    }
  };

  Carousel.prototype.setTrackWidth = function() {
    $(this.opts.track).css('width', this.opts.slideWidth * (this.opts.slidesCount + 4));
  };

  Carousel.prototype.setSlideWidth = function() {
    if (this.opts.responsive === 'true') {
      $(this.opts.frame).find('.js-carousel-slide').css('width', window.innerWidth);
    } else {
      $(this.opts.frame).find('.js-carousel-slide').css('width', this.opts.width);
    }
  };

  Carousel.prototype.setNavWidth = function() {
    var $navs, navWidth;
    $navs = $('.js-carousel-nav');
    if ($navs.length > 0) {
      navWidth = ($(this.opts.frame).outerWidth() - this.opts.slideWidth) / 2;
      $navs.css("width", navWidth);
    }
  };

  Carousel.prototype.setInitialProps = function() {
    this.opts.track = this.opts.frame.find('.js-carousel-track')[0];
    this.opts.slidesCount = this.opts.frame.find('.js-carousel-slide').length - 4;
    this.opts.slideWidth = this.opts.frame.find('.js-carousel-slide').outerWidth(true);
    this.opts.left = -(calculateDistance(this.opts.frame, this.opts.slideWidth) + this.opts.slideWidth);
    this.opts.distance = this.opts.slideWidth;
    this.defaultNearLeft = -(calculateDistance(this.opts.frame, this.opts.slideWidth) + this.opts.slideWidth);
    this.defaultFarLeft = -(calculateDistance(this.opts.frame, this.opts.slideWidth) + this.opts.slideWidth * this.opts.slidesCount);
  };

  Carousel.prototype.setFrameHeight = function() {
    if (this.opts.responsive === 'true') {
      $(this.opts.frame).css('height', $(this.opts.frame).find('.js-carousel-slide').first().height());
    } else {
      $(this.opts.frame).css('height', this.opts.height);
    }
  };

  Carousel.prototype.setInitialLeft = function() {
    var left;
    left = calculateDistance(this.opts.frame, this.opts.slideWidth);
    $(this.opts.track).css('left', -(left + this.opts.slideWidth) + 'px');
  };

}());
