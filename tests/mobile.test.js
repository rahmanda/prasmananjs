/*global  */
var expect = chai.expect;

var view = {
  template: '<div class="container" style="width: 100%;"><ul class="cards">' +
            '<li id="card-1" class="card">Content</li>' +
            '<li id="card-2" class="card">Content</li>' +
            '<li id="card-3" class="card">Content</li>' +
            '<li id="card-4" class="card">Content</li>' +
            '<li id="card-5" class="card">Content</li></ul>' +
            '<div class="cards__control control--prev"><</div>' +
            '<div class="cards__control control--next">></div></div>',
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

var toNumber = function(string) {
  number = string.substring(0, string.length - 2);
  return Number(number);
}

var getFirstElement = function(className) {
  return document.getElementsByClassName(className)[0];
}

var getAllElements = function(className) {
  return document.getElementsByClassName(className);
}

describe("Prasmanan Mobile", function () {
  beforeEach(function () {
    view.render();
    config = {
      container   : getFirstElement('container'),
      cardMargin  : 20,
      cardWidth   : 0.75,
      card        : getAllElements('card'),
      cards       : getFirstElement('cards'),
      prevControl : getFirstElement('control--prev'),
      nextControl : getFirstElement('control--next')
    };
    prasmanan = new Prasmanan(config);
    prasmanan.serve();
  });

  afterEach(function () {
    view.empty();
    config = null;
    delete prasmanan;
  });

  describe("constructor", function () {
    it("should initialize properties", function () {
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
  });

  describe("counter", function () {
    
  });
});