/*
 * Jasmine Unit tests
 */
describe("Adding and Removing Nodes", function() {
    var test = new Graph();
    
    it("It adds an email called name with node id of 1", function() {
        var result = test.addEmail("name");
        
        expect(result.id).toBe(1);
        expect(result.name).toBe("name");
    });
    
    it("It adds a password called name with node id of 2", function() {
        var result = test.addPassword("name");
        
        expect(result.id).toBe(2);
        expect(result.name).toBe("name");
    });
    
    it("Removes a password with id of 2", function() {
        var id = 2;
        expect(test.deleteNode(id)).toBe(true);
    });
    
    it("Changes an email's label with id of 1 to 'email'", function() {
        var id = 1;
        expect(test.modifyNode(id, "email")).toBe(true);
    });
        
    it("Removes an email with id of 1", function() {
        var id = 1;
        expect(test.deleteNode(id)).toBe(true);
    });
});




