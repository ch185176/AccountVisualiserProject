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
    
    it("It adds an email called 'name' with node ID of 1, to position x=1 y=1", function() {
        var result = test.addNode("name", "email", "test", 1, 1, true);
        
        expect(result.id).toBe(1);
        expect(result.name).toBe("name");
    });
    
    it("It adds a password called 'name' with node ID of 2, to position x=2 y=1", function() {
        var result = test.addNode("name", "password", "test", 2, 2, true);
        
        expect(result.id).toBe(2);
        expect(result.name).toBe("name");
    });
    
    it("Removes a password with ID of 2", function() {
        var id = 2;
        expect(test.deleteNode(id)).toBe(undefined);
    });
    
    it("Changes an email's label with ID of 1 to 'email'", function() {
        var id = 1;
        
        modifiedNode = test.modifyNode(id, "email");
        
        expect(modifiedNode.name).toBe("email");
    });
    
    it("Changes an email's position to 5,6", function() {
        var id = 1;
        
        modifiedNode = test.modifyNodePOS(id, 5, 6);
        
        expect(modifiedNode.x_axis).toBe(5);
        expect(modifiedNode.y_axis).toBe(6);
    });
    
    it("Finds an email near position 5,6", function() {
        var x=5;
        var y=6;
        testNode = test.addNode("name", "email", "test", 50, 50, true);
        output = test.getNodesNearCoords(x, y);

        test.deleteNode(3);
        expect(output[0].id).toBe(1);
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
        var node1 = test.addNode("name", "email", "test");
        var node2 = test.addNode("name", "password", "test");
        
        var link = test.addLink(node1.id, node2.id, node1.x_axis, node1.y_axis, node2.x_axis, node2.y_axis);
        
        expect(link[1].x).toBe(node1.x_axis);
        expect(link[2].y).toBe(node2.y_axis);
        expect(link[1].SourceID).toBe(node1.id);
        expect(link[2].TargetID).toBe(node2.id);
        
    });
    
    it("It modifies an edge with a specified ID", function() {
        var id = 1;
        
        var link = test.modifyLink(id, 1, 2, 3, 4);
        
        expect(link[1].x).toBe (1);
        expect(link[1].y).toBe (2);
        expect(link[2].x).toBe (3);
        expect(link[2].y).toBe (4);
        
    });
    
        it("It modifies an edge source with a specified ID", function() {
        var id = 1;
        
        var link = test.modifyLinkSource(id, 5, 6);
        
        expect(link[1].x).toBe (5);
        expect(link[1].y).toBe (6);
        
    });
    
    it("It modifies an edge target with a specified ID", function() {
        var id = 1;
        
        var link = test.modifyLinkTarget(id, 2, 7, 8);
        
        expect(link[2].x).toBe (7);
        expect(link[2].y).toBe (8);
        
    });
    
    it("Removes an edge given an edge ID", function() {
        var id = 1;
        
        var link = test.deleteLink(id);
        
        expect(link).toBe(true);
    });
    
});



