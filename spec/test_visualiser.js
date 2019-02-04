/**
 * Jasmine Unit Tests for visualiser.js
 * Run by navigationg to account_visualiser/SpecRunner.html
 * 
 * @author Craig Hutcheon
 * @version Jasmine 3.3.0
 */

/**
 * Unit Tests for Node Functions
 */
describe("Adding and Removing Nodes", function() {
    var test = new Graph();
    
    it("It adds an email called 'name' with node id of 1", function() {
        var result = test.addNode("name", "email");
        
        expect(result.id).toBe(1);
        expect(result.name).toBe("name");
    });
    
    it("It adds a password called 'name' with node id of 2", function() {
        var result = test.addNode("name", "password");
        
        expect(result.id).toBe(2);
        expect(result.name).toBe("name");
    });
    
    it("Removes a password with id of 2", function() {
        var id = 2;
        expect(test.deleteNode(id)).toBe(undefined);
    });
    
    it("Changes an email's label with id of 1 to 'email'", function() {
        var id = 1;
        
        modifiedNode = test.modifyNode(id, "email");
        
        expect(modifiedNode.name).toBe("email");
    });
        
    it("Removes an email with id of 1", function() {
        var id = 1;
        expect(test.deleteNode(id)).toBe(undefined);
    });
});

/**
 * Unit Tests for Edge Functions
 */
describe("Adding and Removing Edges", function() {
    var test = new Graph();
    
    it("It adds an edge from a target node to a destination node", function() {
        var node1 = test.addNode("name", "email");
        var node2 = test.addNode("name", "password");
        
        var link = test.addLink(node1.id, node2.id, node1.x_axis, node1.y_axis, node2.x_axis, node2.y_axis);
        
        expect(link[0].x).toBe(node1.x_axis + 40);
        expect(link[1].y).toBe(node2.y_axis+ 20);
        expect(link[0].SourceID).toBe(node1.id);
        expect(link[1].TargetID).toBe(node2.id);
    });
});



