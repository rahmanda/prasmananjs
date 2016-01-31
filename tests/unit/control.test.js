var expect = chai.expect;

describe("COW", function() {
  describe("constructor", function() {
    it("should have a default name", function() {
      var prasmanan = new Prasmanan();
      expect(prasmanan.pointer).to.equal(0);
    });
  });
});