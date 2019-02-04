/*
 * Jasmine Unit tests
 */
describe("Adding Nodesl", function() {
    var test = new Graph();
    
    it("It adds an email called name", function() {
      expect(test.addEmail("name")).toBe("name");
    });
    
    it("It adds a password called name", function() {
      expect(test.addPassword("name")).toBe("name");
    });
});




