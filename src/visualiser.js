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
        //Size and width of graph
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

        //Node and Edge Objects
        this.currentNode = new Object();
        this.currentEdge = new Object();

        //ID and position variables
        this.currentNodeID = 1;
        this.currentEdgeID = 1;
        this.currentEmailLevel = 1;
        this.currentPasswordLevel = 1;
        this.currentEmailPOS = 20;
        this.currentPasswordPOS = 20;
        this.nodeInfoNeeded = "none";
        this.nodeLinkA = [];
        this.nodeLinkB = [];
        
        //Drag Variables
        this.validDrag = false;
        
        //Variables for Undo and Redo
        this.Actions = [];
        this.Undos =[];
        
    } 
    
    /**
     * Adds Node to  graph of specified type
     * 
     * @param {type} name
     * @param {type} type
     * @return {Graph.addNode.account}
     */
    addNode(name, type, icon, x, y, clickToAdd)
    {
        var xpos;
        var ypos;
        var color;
        
        if (type === "email")
        {
            if (clickToAdd === true){
                xpos = x;
                ypos = y;
            }else{
                xpos = this.currentEmailPOS;
                ypos = (this.height*0.2);
            }
            color = "blue";
            this.currentEmailPOS = this.currentEmailPOS + 120;
        } else if (type === "password")
        {
            if (clickToAdd === true){
                xpos = x;
                ypos = y;
            }else{
                xpos = this.currentPasswordPOS;
                ypos = (this.height*0.7);
            }
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
    
    /**
     * Modifies Node Position
     * 
     * @param {type} id
     * @param {type} x
     * @param {type} y
     * @return {Array}
     */
    modifyNodePOS(id, x, y)
    {
        var pos = this.Accounts.map(function(e) { return e.id; }).indexOf(id);
        
        this.Accounts[pos].x_axis = x;
        this.Accounts[pos].y_axis = y;
        
        return this.Accounts[pos];
    }
    
    /**
     * Finds nodes near coordinate
     * 
     * @param {type} x
     * @param {type} y
     * @return {undefined}
     */
    getNodesNearCoords(x, y)
    {
        var foundNodes;
        var nodeRadius = 30;
        
        var foundXNodes = this.Accounts.filter(node => (node.x_axis <= (x+nodeRadius) && node.x_axis >= (x-nodeRadius)));
        foundNodes = foundXNodes.filter(node => (node.y_axis <= (y+nodeRadius) && node.y_axis >= (y-nodeRadius)));
        
        return foundNodes;
    }

    /**
     * Removes a link with the specified ID
     * 
     * @param {type} linkID
     * @return {Array}
     */
    deleteLink(linkID)
    {
        var pos = this.Links.map(function(e) { return e[0].id; }).indexOf(linkID);
        this.Links.splice(pos);
        this.Edges.splice(pos);
        
        return true;
    }
    
    /**
     * Modifies a link with a specified ID
     * 
     * @param {type} linkID
     * @param {type} x1
     * @param {type} y1
     * @param {type} x2
     * @param {type} y2
     * @return {Array}
     */
    modifyLink(linkID, x1, y1, x2, y2)
    {
        var pos = this.Links.map(function(e) { return e[0].id; }).indexOf(linkID);
        
        this.Links[pos][1].x = x1;
        this.Links[pos][1].y = y1;
        this.Links[pos][2].x = x2;
        this.Links[pos][2].y = y2;
        
        return this.Links[pos];
    }
    
    /**
     * Modifies a links Source with a specified ID
     * 
     * @param {type} linkID
     * @param {type} x
     * @param {type} y
     * @return {Array}
     */
    modifyLinkSource(linkID, x, y)
    {
        var pos = this.Links.map(function(e) { return e[0].id; }).indexOf(linkID);

        this.Links[pos][1].x = x;
        this.Links[pos][1].y = y;
        
        return this.Links[pos];
    }
    
    /**
     * Modifies a links Target with a specified ID
     * 
     * @param {type} linkID
     * @param {type} x
     * @param {type} y
     * @return {Array}
     */
    modifyLinkTarget(linkID, targetID, x, y)
    {
        var pos = this.Links.map(function(e) { return e[0].id; }).indexOf(linkID);

        this.Links[pos][2].TargetID = targetID;
        this.Links[pos][2].x = x;
        this.Links[pos][2].y = y;
        
        return this.Links[pos];
    }
    
    undo()
    {
        
    }
    
    redo()
    {
        
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

        //Initialises D3 SVG container
        //Container will be located in "graph" div on html page
        var svgContainer = d3.select("#graph")
            .append("svg")
            .on('click', ()=> this.click())
            .attr("width", this.width)
            .attr("height", this.height)
            /*
            .call(d3.zoom().on("zoom", function () {
                svgContainer.attr("transform", d3.event.transform);
            }))
            */
            .append("g");
     
        var defs = svgContainer.append("defs");

        defs.append("marker")
            .attr("id", "arrow")
            .attr("viewBox","0 -5 10 10")
            .attr("refX",5)
            .attr("refY",0)
            .attr("markerWidth",4)
            .attr("markerHeight",4)
            .attr("orient","auto")
      
            .append("path")
                    .attr("d", "M0,-5L10,0L0,5")
                    .attr("class","arrowHead");
            
            
        var line = d3.line()
            .x(function (d) { return d.x; })
            .y(function (d) { return d.y; });
    
        //This section add edges based on Links array
        for (var i=0; i < edgeData.length; i++) 
            {
                svgContainer.append("line")
                    .attr("x1", edgeData[i][1].x)     // x position of the first end of the line
                    .attr("y1", edgeData[i][1].y)      // y position of the first end of the line
                    .attr("x2", edgeData[i][2].x)     // x position of the second end of the line
                    .attr("y2", edgeData[i][2].y)    // y position of the second end of the line    
                    .attr("class", "arrow")
                    .attr("marker-end", "url(#arrow)")
                    .style("stroke", "black")
                    .attr("stroke-width", 2); 
            
                console.log(edgeData); 
            }
        
        var circle = svgContainer.selectAll("circle")
            .data(data)
            .enter()
            .append('circle');

        //Used for Nodes
        //Data pulled from Accounts array
        var node = svgContainer.selectAll("node")
            .data(data)
            .enter()
            .append('text');
            

        //Add the SVG Text Element to the svgContainer
        var label = svgContainer.selectAll("label")
            .data(data)
            .enter()
            .append("text");
     
        var circleAttributes = circle
            .attr("cx", function (d) { return d.x_axis + 8; })
            .attr("cy", function (d) { return d.y_axis - 6; })
            .attr("r", '12px')
            .style("fill", function(d) { return d.color; });

        var nodeAttributes = node
            .attr("x", function (d) { return d.x_axis; })
            .attr("y", function (d) { return d.y_axis; })
            .attr("id", function (d) { return d.id; })
            
            //Used to determine what icon to use
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
                })     // Specify your icon in unicode
            
            //Drag Attributes
            .call(d3.drag()
                //Calls functions based on where the drag is
                .on("start", (d)=> this.dragstarted(d))
                .on("drag", ()=> this.dragged())
                .on("end", ()=> this.dragended()));


        //Add SVG Text Element Attributes for icons
        var textLabels = label
                        .attr("x", function(d) { return d.x_axis; })
                        .attr("y", function(d) { return d.y_axis - 20; })
                        .text( function (d) { console.log(d.name); return d.name; })
                        .attr("font-family", "sans-serif")
                        .attr("font-size", "10px")
                        .attr("fill", "black");    
    }
    
    /**
     * Click Event Function
     * 
     * Used to add nodes
     * 
     * @return {undefined|Boolean}
     */
    click()
    {
        // Ignore the click event if it was suppressed
        if (d3.event.defaultPrevented) return;

        // Extract the click location\    
        var point = d3.mouse(d3.event.currentTarget), 
        px = {x: point[0]},
        py = {y: point[1]};
        if(document.getElementById('type').elements.type.value === "email")
        {
            var name = document.getElementById('addemail').elements.emailname.value;
            var icon = document.getElementById('addemail').elements.icon.value;
            var type = "email";
        }else if (document.getElementById('type').elements.type.value === "password")
        {
            var name = document.getElementById('addpassword').elements.passwordname.value;
            var icon = "password";
            var type = "password";
        }
        this.addNode(name, type, icon, px.x, py.y, true);
        this.refreshGraph();
        
        return true;
    }
    
    /**
     * Carried out when a drag is started
     * 
     * starts a link
     * 
     * @param {type} startNode
     * @return {undefined}
     */
    dragstarted(startNode)
    {
        this.addLink(startNode.id, 0, startNode.x_axis, startNode.y_axis, startNode.x_axis, startNode.y_axis);
    }
    
    /**
     * Carried out mid drag
     * 
     * Continues link and changes target
     * 
     * @return {undefined}
     */
    dragged()
    {
        var point = d3.mouse(graph), 
        px = {x: point[0]},
        py = {y: point[1]};
        
        var pos = this.Links.map(function(e) { return e[2].TargetID; }).indexOf(0);
        
        this.modifyLinkTarget(this.Links[pos][0].id, 0, px.x, py.y);
        
        this.refreshGraph();
    }
    
    /**
     * Carried out after a drag is finished
     * 
     * Determines whether or not edge lands on a node or not
     * 
     * @return {undefined}
     */
    dragended()
    {
        var point = d3.mouse(graph), 
        px = {x: point[0]},
        py = {y: point[1]};

        var nodes = this.getNodesNearCoords(px.x, py.y);
        var pos = this.Links.map(function(e) { return e[2].TargetID; }).indexOf(0);
        var linkID = this.Links[pos][0].id;
        console.log(linkID);

        if (!nodes.length)
        {
            this.deleteLink(linkID);
        }else
        {
            this.modifyLinkTarget(linkID, nodes[0].id, px.x, py.y);
        }

        this.refreshGraph();
    }
    
    ctrlDrag()
    {
        
    }

    /**
     * Used to retrieve Form elements for email Node
     * 
     * @return {Boolean}
     */
    addEmailNode(){
        var name = document.getElementById('addemail').elements.emailname.value;
        var icon = document.getElementById('addemail').elements.icon.value;
        this.addNode(name, "email", icon, 0, 0, false);
        this.refreshGraph();
        
        return true;
    }

    /**
     * Used to retrieve Form elements for password Node
     * 
     * @return {Boolean}
     */
    addPasswordNode(){
        var name = document.getElementById('addpassword').elements.passwordname.value;
        this.addNode(name, "password", "password", 0, 0, false);
        this.refreshGraph();
        
        return true;
    }

    /**
     * Refreshes Graph
     * 
     * @return {Boolean}
     */
    refreshGraph()
    {
        d3.select("svg").remove();
        this.exportJSON();
        this.drawGraph();
        
        return true;
    }

    /**
     * Exports graph JSON
     * 
     * Stores it in browser localstorage
     * 
     * @return {undefined}
     */
    exportJSON(){
        this.JSON = {
            "nodes": this.Nodes,
            "edges": this.Edges
        };

        localStorage.setItem("jsongraph", JSON.stringify(this.JSON));
    }
    
    
    /*
     * 
     * Legacy Methods for Adding Edges to graph
     * 
     */
    
    
    /**
     * 
     * @return {Boolean}
     */
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
}