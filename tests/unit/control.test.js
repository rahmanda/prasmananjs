var expect = chai.expect;

var view = {
  template: '<div class="container"><ul class="cards">' +
            '<li id="card-1" class="card"></li>' +
            '<li id="card-2" class="card"></li></ul></div>' +
            '<div class="cards__control control--prev"></div>' +
            '<div class="cards__control control--next"></div>',
  el: document.getElementById('fixtures'),
  render: function() {
    this.el.innerHTML = this.template;
  },
  empty: function() {
    this.el.innerHTML = '';
  }
}

var config = null;
var prasmanan = null;

describe("Prasmanan", function() {
  beforeEach(function() {
    view.render();
    config = {
      container   : document.getElementsByClassName('container')[0],
      cardsCount  : 2,
      cardMargin  : 20,
      cardWidth   : 0.75,
      card        : document.getElementsByClassName('card'),
      cards       : document.getElementsByClassName('cards')[0],
      prevControl : document.getElementsByClassName('control--prev')[0],
      nextControl : document.getElementsByClassName('control--next')[0]
    };
    prasmanan = new Prasmanan(config);
    prasmanan.serve();
  });

  afterEach(function() {
    view.empty();
    config = null;
    delete prasmanan;
  });

  describe("constructor", function() {
    it("should initialize properties", function() {
      expect(prasmanan.containerWidth).to.not.equal(null);
      expect(prasmanan.cardWidth).to.not.equal(null);
      expect(prasmanan.cardsWidth).to.not.equal(null);
      expect(prasmanan.cardsControlWidth).to.not.equal(null);
    });

    it("should set containerWidth value properly", function() {
      container = document.getElementsByClassName('container')[0];
      expect(prasmanan.containerWidth).to.equal(container.offsetWidth);
    });
  });

  describe("counter", function() {
    it("should increase counter when next() is called", function() {
      prasmanan.next();
      expect(prasmanan.counter).to.equal(1);
    });

    it("should decrease counter when previous() is called", function() {
      prasmanan.next();
      prasmanan.previous();
      expect(prasmanan.counter).to.equal(0);
    });

    it("shouldn't increase counter if next() is called and counter > cardsCount - 1", function() {
      prasmanan.next();
      prasmanan.next();
      expect(prasmanan.counter).to.equal(1);
    });

    it("shouldn't decrease counter if previous() is called and counter <= 0", function() {
      prasmanan.previous();
      expect(prasmanan.counter).to.equal(0);
    });
  });

});