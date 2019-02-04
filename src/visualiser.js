/**
 * visualiser.js backend for Account Visualiser App
 * 
 * @author Craig Hutcheon
 */
class Graph { 
    
    /**
     * Constructor
     * 
     * @return {Graph}
     */
    constructor() 
    { 
        this.width = 1000;
        this.height = 400;
        //Used for Visualisation (Bipartite Graph)
        this.Accounts = new Array();
        this.Passwords = new Array();
        this.Links = new Array();

        //Used to create JSON
        this.JSON = new Object();
        this.Nodes = new Array();
        this.Edges = new Array();

        this.currentNode = new Object();
        this.currentEdge = new Object();

        this.currentNodeID = 1;
        this.currentEdgeID = 1;
        this.currentEmailLevel = 1;
        this.currentPasswordLevel = 1;
        this.currentEmailPOS = 20;
        this.currentPasswordPOS = 20;
        this.nodeInfoNeeded = "none";
        this.nodeLinkA = [];
        this.nodeLinkB = [];
    } 
    
    /**
     * Adds Node to  graph of specified type
     * 
     * @param {type} name
     * @param {type} type
     * @return {Graph.addNode.account}
     */
    addNode(name, type)
    {
        var xpos;
        var color;
        
        if (type == "email")
        {
            xpos = this.currentEmailPOS;
            color = "blue";
            this.currentEmailPOS = this.currentEmailPOS + 120;
        } else if (type == "password")
        {
            xpos = this.currentPasswordPOS;
            color = "red";
            this.currentPasswordPOS = this.currentPasswordPOS + 120;
        }
        
        var account = {
            "id": this.currentNodeID,
            "x_axis":xpos,
            "y_axis":(this.height*0.2),
            "type": type,
            "name": name,
            "color":color
        };
        
        this.currentNodeID++;
        
        this.Accounts.push(account);
        return account;
    }

    // add account to left hand side of the graph 
    addEmail(name) 
    { 
        var account = {
            "id": this.currentNodeID,
            "x_axis":this.currentEmailPOS,
            "y_axis":(this.height*0.2),
            "name":name,
            "color":"red"
        };

        this.Accounts.push(account);

        this.currentNode = {
            "id": this.currentNodeID,
            "label": name,
            "x": this.currentEmailLevel,
            "y": 1,
            "size": 10,
            "type": "star",
            "color": "#f00"
        };

        this.Nodes.push(this.currentNode);
        this.JSON.nodes = (this.Nodes);
        this.currentNode = {};

        this.currentEmailLevel = this.currentEmailLevel+1;
        this.currentNodeID++;
        this.currentEmailPOS = this.currentEmailPOS + 120;
        
        return account;
    } 

    // add vertex to the right hand side of the graph
    addPassword(name) 
    { 
        var account = {
            "id": this.currentNodeID,
            "x_axis":this.currentPasswordPOS,
            "y_axis":(this.height*0.7),
            "name":name,
            "color":"blue"
        };

        this.Accounts.push(account);
        this.Passwords.push(account);

        this.currentPassword = {
            "id": this.currentNodeID,
            "label": name,
            "x": this.currentPasswordLevel,
            "y": 2,
            "size": 10,
            "color": "#f00"
        };

        this.Nodes.push(this.currentPassword);
        this.JSON.nodes = (this.Nodes);
        this.currentPassword = {};

        this.currentPasswordLevel = this.currentPasswordLevel+1; 
        this.currentNodeID++;
        this.currentPasswordPOS = this.currentPasswordPOS + 120;
        
        return account;
    }

    /**
     * Adds Link to Graph
     * 
     * @param {type} sourceID
     * @param {type} targetID
     * @param {type} x1
     * @param {type} y1
     * @param {type} x2
     * @param {type} y2
     * @return {Array|Graph.addLink.Link}
     */
    addLink(sourceID, targetID, x1, y1, x2, y2) 
    { 
        var link1 = {
            "SourceID": sourceID,
            "x": x1 + 40,
            "y": y1 + 20
        };

        var link2 = {
            "TargetID": targetID,
            "x": x2 + 40,
            "y": y2 + 20
        };

        var Link = [];
        Link.push(link1);
        Link.push(link2);
        this.Links.push(Link);

        this.currentEdge = {
            "id": this.currentEdgeID,
            "source": sourceID,
            "target": targetID,
            "type": "arrow",
            "color": "#FF0000",
            "label": "",
            "size": 2
        };

        this.Edges.push(this.currentEdge);
        this.JSON.nodes = (this.Edges);
        this.currentEdge = {};

        this.currentEdgeID++;
        
        return Link;
    }
    
    /**
     * Deletes Node on Graph
     * 
     * @param {type} id
     * @return {Array}
     */
    deleteNode(id)
    {
        var pos = this.Accounts.map(function(e) { return e.id; }).indexOf(id);
        this.Accounts.splice(pos);
        
        return this.Accounts[pos];
    }
    
    /**
     * Modifies Node Label
     * 
     * @param {type} id
     * @param {type} newlabel
     * @return {Array}
     */
    modifyNode(id, newlabel)
    {  
        var pos = this.Accounts.map(function(e) { return e.id; }).indexOf(id);
        
        this.Accounts[pos].name = newlabel;
        
        return this.Accounts[pos];
    }

    deleteLink(sourceID, targetID)
    {

        return false;
    }

    
    
    /*
     * 
     * HTML Specific Funtions
     * 
     * 
     */ 

    
    /**
     * 
     * @return {undefined}
     */
    drawGraph() 
    { 
        var height = 400;

        var data = this.Accounts;

        var edgeData = this.Links;

        var svgContainer = d3.select("#graph")
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .call(d3.zoom().on("zoom", function () {
                svgContainer.attr("transform", d3.event.transform);
            }))
            .append("g");

        var line = d3.line()
            .x(function (d) { return d.x; })
            .y(function (d) { return d.y; });

        for (var i=0; i < edgeData.length; i++) 
            {
                svgContainer.append("path")
                    .attr("class", "line")
                    .datum(edgeData[i])
                    .attr("d", line)
                    .attr("stroke", "black")
                    .attr("stroke-width", 2);

                console.log(edgeData[i]);  
            }

        var rectangle = svgContainer.selectAll("rect")
            .data(data)
            .enter()
            .append("rect");


        rectangle.on('click', datum => {
            this.nodeClicked=datum; // the datum for the clicked circle
            if (this.nodeInfoNeeded === "end")
            {
                var ID = this.nodeClicked.id;
                console.log(ID);
                var x = this.nodeClicked.x_axis;
                var y = this.nodeClicked.y_axis;

                this.getSecondNodeInfo(ID,x,y);
            }
            if (this.nodeInfoNeeded === "start")
            {
                var ID = this.nodeClicked.id;
                var x = this.nodeClicked.x_axis;
                var y = this.nodeClicked.y_axis;

                this.getFirstNodeInfo(ID,x,y);                           
            }

            this.nodeClicked = {};
        });

        var rectangleAttributes = rectangle
            .attr("x", function (d) { return d.x_axis; })
            .attr("y", function (d) { return d.y_axis; })
            .attr("width", 80)
            .attr("height", 40)
            .attr("rx", 6)
            .attr("ry", 6)
            .style("fill", function(d) { return d.color; });

        //Add the SVG Text Element to the svgContainer
        var text = svgContainer.selectAll("text")
                                .data(data)
                                .enter()
                                .append("text");

        //Add SVG Text Element Attributes
        var textLabels = text
                         .attr("x", function(d) { return d.x_axis + 20; })
                         .attr("y", function(d) { return d.y_axis + 25; })
                         .text( function (d) { return d.name; })
                         .attr("font-family", "sans-serif")
                         .attr("font-size", "10px")
                         .attr("fill", "white");                
    }

    startLink()
    {
        this.nodeInfoNeeded = "start";
        
        return true;
    }

    getFirstNodeInfo(ID,x,y)
    {
        this.nodeLinkA = [ID,x,y];
        this.nodeInfoNeeded = "end";
        
        return true;
    }

    getSecondNodeInfo(ID,x,y)
    {
        this.nodeLinkB = [ID,x,y];
        this.addLink(this.nodeLinkB[0], this.nodeLinkA[0], this.nodeLinkA[1], this.nodeLinkA[2], this.nodeLinkB[1], this.nodeLinkB[2]);
        this.nodeInfoNeeded = "none";
        this.nodeLinkA = [];
        this.nodeLinkB = [];
        this.refreshGraph();
        
        return true;
    }

    addEmailNode(){
        var name = document.getElementById('addemail').elements.emailname.value;
        this.addNode(name, "email");
        this.refreshGraph();
        
        return true;
    }

    addPasswordNode(){
        var name = document.getElementById('addpassword').elements.passwordname.value;
        this.addPassword(name, "password");
        this.refreshGraph();
        
        return true;
    }

    refreshGraph()
    {
        d3.select("svg").remove();
        this.exportJSON();
        this.drawGraph();
        
        return true;
    }

    exportJSON(){
        this.JSON = {
            "nodes": this.Nodes,
            "edges": this.Edges
        };

        localStorage.setItem("jsongraph", JSON.stringify(this.JSON));
    }
}