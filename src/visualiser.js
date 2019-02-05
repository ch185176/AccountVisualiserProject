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
    addNode(name, type, icon)
    {
        var xpos;
        var ypos;
        var color;
        
        if (type === "email")
        {
            xpos = this.currentEmailPOS;
            ypos = (this.height*0.2);
            color = "blue";
            this.currentEmailPOS = this.currentEmailPOS + 120;
        } else if (type === "password")
        {
            xpos = this.currentPasswordPOS;
            ypos = (this.height*0.7);
            color = "red";
            this.currentPasswordPOS = this.currentPasswordPOS + 120;
        }
        
        var account = {
            "id": this.currentNodeID,
            "x_axis":xpos,
            "y_axis":ypos,
            "type": type,
            "name": name,
            "color":color,
            "icon":icon
        };
        
        this.currentNodeID++;
        
        this.Accounts.push(account);
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
        var linkinfo = {
            "id": this.currentEdgeID,
            "label": ""
        };
        
        var link1 = {
            "SourceID": sourceID,
            "x": x1 + 10,
            "y": y1
        };

        var link2 = {
            "TargetID": targetID,
            "x": x2 + 10,
            "y": y2
        };

        var Link = [];
        Link.push(linkinfo);
        Link.push(link1);
        Link.push(link2);
        this.Links.push(Link);
        
        var LinkSanitised = [];
        LinkSanitised.push(link1);
        LinkSanitised.push(link2);
        
        this.Edges.push(LinkSanitised);

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

    deleteLink(linkID)
    {
        var pos = this.Links.map(function(e) { return e[0].id; }).indexOf(linkID);
        this.Links.splice(pos);
        this.Edges.splice(pos);
        
        return this.Links[pos];
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

        var edgeData = this.Edges;

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
                    .attr("class", "path")
                    .datum(edgeData[i])
                    .attr("d", line)
                    .attr('marker-end', 'url(#arrowhead)')
                    .attr("stroke", "black")
                    .attr("stroke-width", 2);

                console.log(edgeData[i]);  
            }
        
        var circle = svgContainer.selectAll("circle")
            .data(data)
            .enter()
            .append('circle');

        var node = svgContainer.selectAll("node")
            .data(data)
            .enter()
            .append('text');

        //Add the SVG Text Element to the svgContainer
        var label = svgContainer.selectAll("label")
            .data(data)
            .enter()
            .append("text");
       
        node.on('click', datum => {
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
     
        var circleAttributes = circle
            .attr("cx", function (d) { return d.x_axis + 8; })
            .attr("cy", function (d) { return d.y_axis - 6; })
            .attr("r", '12px')
            .style("fill", function(d) { return d.color; });
        
        var nodeAttributes = node
            .attr("x", function (d) { return d.x_axis; })
            .attr("y", function (d) { return d.y_axis; })
            .attr("class", function(d) 
                { 
                    var type = d.icon;
                    if (type === "google")
                    {
                        return "fab"; 
                    }
                    else if (type === "outlook")
                    {
                        return "fab";
                    }
                    else if (type === "yahoo")
                    {
                        return "fab";
                    }
                    else if (type === "password")
                    {
                        return "fas";
                    }
                    else if (type === "default")
                    {
                        return "far";
                    }
                })  // Give it the font-awesome class
            .attr("fill", "white")
            .text(function(d) 
                { 
                    var type = d.icon;
                    if (type === "google")
                    {
                        return '\uf1a0'; 
                    }
                    else if (type === "outlook")
                    {
                        return '\uf17a';
                    }
                    else if (type === "yahoo")
                    {
                        return '\uf19e';
                    }
                    else if (type === "password")
                    {
                        return '\uf084';
                    }
                    else if (type === "default")
                    {
                        return '\uf2b6';
                    }
                });      // Specify your icon in unicode


        //Add SVG Text Element Attributes
        var textLabels = label
                         .attr("x", function(d) { return d.x_axis; })
                         .attr("y", function(d) { return d.y_axis - 20; })
                         .text( function (d) { console.log(d.name); return d.name; })
                         .attr("font-family", "sans-serif")
                         .attr("font-size", "10px")
                         .attr("fill", "black");                
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
        var icon = document.getElementById('addemail').elements.icon.value;
        this.addNode(name, "email", icon);
        this.refreshGraph();
        
        return true;
    }

    addPasswordNode(){
        var name = document.getElementById('addpassword').elements.passwordname.value;
        this.addNode(name, "password", "password");
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