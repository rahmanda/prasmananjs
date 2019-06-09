(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*! Prasmanan.JS - v0.0.1 - 2016-01-29
 * https://github.com/rahmanda/prasmananjs
 *
 * Copyright (c) 2016-present, Rahmanda Wibowo
 * Licensed under MIT
 *
 * Example of using this plugin:
 * config = {
 *   container: $('#container').first(),
 *   cardsCount: 6,
 *   cardMargin: 20,
 *   cardWidth: 0.75,
 *   card: $('.card'),
 *   prevControl: $('.prev-control').first(),
 *   nextControl: $('.next-control').first()
 * };
 * prasmanan = new Prasmanan(config);
 * prasmanan.serve();
 * */
(function () {

  /*
   * Main plugin object
   */
  this.Prasmanan = function() {

    this.pointer           = 0;    // current cards position
    this.X                 = 0;
    this.counter           = 1;    // click counter
    this.containerWidth    = null; // container width
    this.cardsCount        = 0;
    this.cardWidth         = null; // card width
    this.cardsWidth        = null; // cards width
    this.cardsControlWidth = null; // prev/next width
    this.cardsControlWidthAlt = null;

    var defaults =  {
      container   : null,  // single DOM
      cardMargin  : 0,     // integer (optional)
      cardWidth   : 0.8,   // decimal between 0-1 (optional)
      card        : null,  // array of DOMs
      cards       : null,  // single DOM
      prevControl : null,  // single DOM
      nextControl : null,  // single DOM
      enableTouch : false, // boolean (optional)
      autoResize  : false  // boolean (optional)
    };

    if (arguments[0] && typeof arguments[0] === "object") {
      this.opts = _extendDefaults(defaults, arguments[0]);
    }

  };

  /*
   * Init function, must be called before use
   */
  Prasmanan.prototype.serve = function () {
    _initializeProperties.call(this);
    _initializeDOM.call(this);
    _initializeEvents.call(this);
  };

  /*
   * Slide-to-next mechanism, utilize css3 position
   */
  Prasmanan.prototype.next = function () {
    if (this.pointer > -(this.cardsWidth - this.containerWidth)) {

      if (_isPointerInMiddle(this.counter, this.cardsCount)) {
        this.pointer -= _calculateDistance(this.containerWidth,
                                           _calculateMiddleDistance(this.cardsControlWidth,
                                                                    this.opts.cardMargin));
      } else {
        this.pointer -= _calculateDistance(this.cardWidth, this.cardsControlWidth);
      }

      this.counter++;
      _repaintControl.call(this);
      _showOrHideControl.call(this);
      this.opts.cards.style.left = _toPixel(this.pointer);
    }
  };

  /*
   * Slide-to-previous mechanism, utilize css3 position
   */
  Prasmanan.prototype.previous = function () {
    if (this.pointer < 0) {

      if (_isPointerInMiddle(this.counter, this.cardsCount, true)) {
        this.pointer += _calculateDistance(this.containerWidth,
                                           _calculateMiddleDistance(this.cardsControlWidth,
                                                                    this.opts.cardMargin));
      } else {
        this.pointer += _calculateDistance(this.cardWidth, this.cardsControlWidth);
      }

      this.counter--;
      _repaintControl.call(this);
      _showOrHideControl.call(this);
      this.opts.cards.style.left = _toPixel(this.pointer);
    }
  };

  Prasmanan.prototype.move = function (showIndex, percent) {
    showIndex = Math.max(0, Math.min(showIndex, this.cardsCount - 1));
    percent = percent || 0;

    var className = this.opts.cards.className;
    var pos       = (this.cardsWidth / 100) * ((showIndex * 100) + percent);

    this.pointer = pos;
    this.opts.cards.style.left = _toPixel(this.pointer);
    // this.counter = showIndex;
  };

  Prasmanan.prototype.pan = function (event) {
    var percent = (100 / this.cardsWidth) * event.deltaX;
    switch (event.type) {
    case 'panmove':
      this.move(this.counter - 1, percent);
      break;
    case 'pancancel':
    case 'panend':
      if (Math.abs(percent) > 10) {
        this.counter += (percent < 0) ? -1 : 1;
      }
      percent = 0;
      this.move(this.counter - 1, percent);
      break;
    }
  };

  /*
   * Extend object that passed to main object
   */
  function _extendDefaults(source, properties) {
    var property;

    for (property in properties) {
      if (properties.hasOwnProperty(property)) {
        source[property] = properties[property];
      }
    }
    return source;
  }

  /*
   * Initialize event listener
   */
  function _initializeEvents() {
    if (this.opts.cards && this.opts.enableTouch) {
      var hammertime = new Hammer.Manager(this.opts.cards);

      hammertime.add(new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 10 }));
      hammertime.on('panstart panmove panend pancancel', Hammer.bindFn(this.pan, this));
    }

    if (this.opts.prevControl) {
      this.opts.prevControl.addEventListener('click', this.previous.bind(this));
    }

    if (this.opts.nextControl) {
      this.opts.nextControl.addEventListener('click', this.next.bind(this));
    }
  }

  /*
   * Initialize main object's properties
   */
  function _initializeProperties() {
    this.cardsCount        = _getCardsCount.call(this);
    this.containerWidth    = this.opts.container.offsetWidth;

    this.cardWidth         = this.containerWidth * this.opts.cardWidth;

    this.cardsWidth        = _calculateCardsWidth(this.cardWidth,
                                                  this.cardsCount,
                                                  this.opts.cardMargin);

    this.cardsControlWidth = _calculateCardsControlWidth(this.containerWidth,
                                                         this.cardWidth,
                                                         this.opts.cardMargin);
    this.cardsControlWidthAlt = _calculateCardsControlWidth(this.containerWidth,
                                                            this.cardWidth,
                                                            this.opts.cardMargin,
							                                              true);
  }

  /*
   * initialize DOM style
   */
  function _initializeDOM() {
    _applyWidth(this.opts.card, this.cardWidth, this.opts.cardMargin);
    _repaintControl.call(this);
    _showOrHideControl.call(this);
    _applyWidth(this.opts.cards, this.cardsWidth);
  }

  /*
   * Calculate distance to slide
   * @param {Number} containerWidth
   * @param {Number} space
   * @return {Number}
   */
  function _calculateDistance(containerWidth, space) {
    return containerWidth - space;
  }

  /*
   * Calculate distance to slide when slider is on the middle
   * @param {Number} controlWidth
   * @param {Number} margin
   * @return {Number}
   */
  function _calculateMiddleDistance(controlWidth, margin) {
    return 2 * controlWidth + margin;
  }

  /*
   * Calculate cards's width
   * @param {Number} cardWidth
   * @param {Number} cardsCount
   * @param {Number} margin
   * @return {Number}
   */
  function _calculateCardsWidth(cardWidth, cardsCount, cardMargin) {
    return (cardWidth * cardsCount) + cardMargin * (cardsCount - 1);
  }

  /*
   * Calculate cards control's width
   * @param {Number} containerWidth
   * @param {Number} cardWidth
   * @param {Number} cardMargin
   * @return {Number}
   */
  function _calculateCardsControlWidth(containerWidth, cardWidth, cardMargin, alt) {
    alt = typeof alt !== 'undefined' ? alt : false;

    if (alt) {
      return containerWidth - cardWidth - cardMargin;
    } else {
      return (containerWidth - cardWidth - 2 * cardMargin) / 2;
    }
  }

  /*
   * Check if slider is on the middle
   * @param {Number} counter
   * @param {Number} cardsCount
   * @param {Boolean | optional} prev
   * @return {Boolean}
   */
  function _isPointerInMiddle(counter, cardsCount, prev) {
    prev = typeof prev !== 'undefined' ? prev : false;

    if (prev) {
      return counter > 2 && counter < cardsCount;
    } else {
      return counter > 1 && counter < cardsCount - 1;
    }
  }

  /*
   * Apply width to DOM
   * @param {DOM|Array of DOM} $el
   * @param {Number} width
   * @param {Number} margin - optional
   */
  function _applyWidth($el, width, margin) {
    margin = typeof margin !== 'undefined' ? margin : false;

    var i;

    if (typeof $el.length !== 'undefined') {
      for (i = 0; i < $el.length; i++) {
        $el[i].style.width = _toPixel(width);

        if (margin && i < $el.length - 1) {
          $el[i].style.marginRight = _toPixel(margin);
        }
      }
    } else {
      $el.style.width = _toPixel(width);
    }
  }

  /*
   * Add pixel unit to integer
   * @param {Number} integer
   * @return {String}
   */
  function _toPixel(integer) {
    return String(integer) + 'px';
  }

  /*
   * Show or hide control based on counter
   */
  function _showOrHideControl() {
    if (this.counter === 1) {
      this.opts.prevControl.classList.add('hidden');
    } else if (this.counter === this.opts.cardsCount){
      this.opts.nextControl.classList.add('hidden');
    } else {
      this.opts.prevControl.classList.remove('hidden');
      this.opts.nextControl.classList.remove('hidden');
    }
  }

  /*
   * Repaint control
   */
  function _repaintControl(){
    var width, className;
    if (this.counter === 1 || this.counter === this.cardsCount) {
      width = this.cardsControlWidthAlt;
    } else {
      width = this.cardsControlWidth;
    }

    _applyWidth(this.opts.prevControl, width);
    _applyWidth(this.opts.nextControl, width);
  }

  /*
   * Get cards count
   */
  function _getCardsCount() {
    return this.opts.card.length;
  }


  /* test only */
  Prasmanan.prototype.test = {};
  Prasmanan.prototype.test.extendDefaults             = _extendDefaults;
  Prasmanan.prototype.test.isPointerInMiddle          = _isPointerInMiddle;

}());

},{}]},{},[1]);
