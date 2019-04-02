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
        //Get Screen Resolution Variables
        var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight|| e.clientHeight|| g.clientHeight;
        
        //Size and width of graph
        this.width = x/12*6; //Based upon bootstrap col size, in this case a col-6
        this.height = y/10*9; 
        
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
        this.dragLeft = false;
        this.dragRight = false;
        this.dragStartNode = null;
        
        //Variables for Undo and Redo
        this.Actions = [];
        this.Undos =[];
        
        //Variables for delete
        this.focusNode = null;
        this.focusLink = null;
        
        //Graph Color Variables
        //Retrieved from Color picker http://colorbrewer2.org/#type=sequential&scheme=BuGn&n=3
        this.linkColors = ["#000000", "#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a"];
        this.nodeColors = ["#7f3b08", "#b35806", "#e08214", "#fdb863", "#fee0b6", "#d8daeb", "#b2abd2", "#8073ac", "#542788", "#2d004b"];
        
    } 
    
    /**
     * Adds Node to graph of specified type
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
        
        //TODO:::Refactor code and find better method of seperating node types
        if (type === "login")
        {
            if (clickToAdd === true){
                xpos = x;
                ypos = y;
            }else{
                xpos = this.currentEmailPOS;
                ypos = (this.height*0.2);
            }
            color = this.nodeColors[0];
        }
        else if (type === "email")
        {
            if (clickToAdd === true){
                xpos = x;
                ypos = y;
            }else{
                xpos = this.currentEmailPOS;
                ypos = (this.height*0.2);
            }
            color = this.nodeColors[1];
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
            color = this.nodeColors[2];
            this.currentPasswordPOS = this.currentPasswordPOS + 120;
        } else if (type === "device")
        {
            if (clickToAdd === true){
                xpos = x;
                ypos = y;
            }else{
                xpos = this.currentEmailPOS;
                ypos = (this.height*0.7);
            }
            color = this.nodeColors[3];
        } else if (type === "biometric")
        {
            if (clickToAdd === true){
                xpos = x;
                ypos = y;
            }else{
                xpos = this.currentEmailPOS;
                ypos = (this.height*0.7);
            }
            color = this.nodeColors[4];
        } else if (type === "shopping")
        {
            if (clickToAdd === true){
                xpos = x;
                ypos = y;
            }else{
                xpos = this.currentEmailPOS;
                ypos = (this.height*0.7);
            }
            color = this.nodeColors[5];
        } else if (type === "social")
        {
            if (clickToAdd === true){
                xpos = x;
                ypos = y;
            }else{
                xpos = this.currentEmailPOS;
                ypos = (this.height*0.7);
            }
            color = this.nodeColors[6];
        } else if (type === "banking")
        {
            if (clickToAdd === true){
                xpos = x;
                ypos = y;
            }else{
                xpos = this.currentEmailPOS;
                ypos = (this.height*0.7);
            }
            color = this.nodeColors[7];
        } else if (type === "crypto")
        {
            if (clickToAdd === true){
                xpos = x;
                ypos = y;
            }else{
                xpos = this.currentEmailPOS;
                ypos = (this.height*0.7);
            }
            color = this.nodeColors[8];
        } else if (type === "2fa")
        {
            if (clickToAdd === true){
                xpos = x;
                ypos = y;
            }else{
                xpos = this.currentEmailPOS;
                ypos = (this.height*0.7);
            }
            color = this.nodeColors[9];
        }
        
        var account = {
            "id": this.currentNodeID,
            "x_axis":xpos,
            "y_axis":ypos,
            "type": type,
            "name": name,
            "color":color,
            "icon":icon,
            "outline":"none"
        };
        
         var action = {
            "action": "addNode",
            "nodeid": this.currentNodeID,
            "x_axis":xpos,
            "y_axis":ypos,
            "type": type,
            "name": name,
            "color":color,
            "icon":icon
        };
        
        this.Actions.push(action);
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
            "label": "",
            "color":"#000000",
            "colorType": 0
        };
        
        var link1 = {
            "SourceID": sourceID,
            "x": x1,
            "y": y1
        };

        var link2 = {
            "TargetID": targetID,
            "x": x2,
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
        var edgesTo = this.Links.filter(edge=>(edge[2].TargetID === id));
        var edgesFrom = this.Links.filter(edge=>(edge[1].SourceID === id));      
        
        var action = {
        "action": "deleteNode",
        "nodeid": this.Accounts[pos].id,
        "x_axis":this.Accounts[pos].x_axis,
        "y_axis":this.Accounts[pos].y_axis,
        "type": this.Accounts[pos].type,
        "name": this.Accounts[pos].name,
        "color":this.Accounts[pos].color,
        "icon":this.Accounts[pos].icon,
        "linksTo": edgesTo,
        "linksFrom": edgesFrom
        };
        this.Actions.push(action);
        
        edgesTo.forEach((edge)=>{
            this.deleteLink(edge[0].id);
        });
        
        edgesFrom.forEach((edge)=>{
            this.deleteLink(edge[0].id);
        });
        
        this.Accounts.splice(pos, 1);
        
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
        this.Links.splice(pos, 1);
        this.Edges.splice(pos, 1);
        
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
    
    /**
     * Changes Link Color to next specified color
     * 
     * @param {type} linkID
     * @return {undefined}
     */
    changeLinkColor(linkID)
    {
        var pos = this.Links.map(function(e) { return e[0].id; }).indexOf(linkID);
        
        var colorAmount = this.linkColors.length - 1;
        
        var currentColor = this.Links[pos][0].colorType;
        
        if (colorAmount === currentColor)
        {
            this.Links[pos][0].colorType = 0;
        }else
        {
            this.Links[pos][0].colorType++;
        }

        this.Links[pos][0].color = this.linkColors[currentColor];
        console.log(this.Links[pos][0].color);
    }
    
    /**
     * Undo Function
     * 
     * Uses a stack to determine what function needs undone next
     * 
     * @return {undefined}
     */
    undo()
    {
        var undo = this.Actions.pop();
        this.Actions.push(undo);
        var type = undo.action;
        
        if (type === "addNode")
        {
            this.deleteNode(undo.nodeid);
            var undo = this.Actions.pop();
            this.Undos.push(undo);
            this.Actions.pop();
        }else if (type === "deleteNode")
        {
            var node = this.addNode(undo.name, undo.type, undo.icon, undo.x_axis, undo.y_axis, true);
            try{
                var pos1 = this.Actions.map(function(e) { return e.nodeid; }).indexOf(undo.nodeid);
                this.Actions[pos1].nodeid = node.id;
                
            }catch(err)
            {
                console.log("No Action");
            } 
            
            var linksTo = undo.linksTo;
            var linksFrom = undo.linksFrom;
            
            linksTo.forEach((links)=>{
                this.addLink(links[1].SourceID, node.id, links[1].x, links[1].y, links[2].x, links[2].y);
            });
            
            linksFrom.forEach((links)=>{
                this.addLink(node.id, links[2].TargetID, links[1].x, links[1].y, links[2].x, links[2].y);
            });
            
            this.Actions.pop();
            var undo = this.Actions.pop();
            undo.nodeid = node.id;
            undo.action = "addNode";
            this.Undos.push(undo);
        }else if (type === "addEdge")
        {
            this.deleteLink(undo.edgeid);
          
            var action = {
                "action": "deleteEdge",
                "edgeid": undo.edgeid,
                "label": "",
                "SourceID": undo.SourceID,
                "x1": undo.x1,
                "y1": undo.y1,
                "TargetID": undo.targetID,
                "x2": undo.x2,
                "y2": undo.y2
            };
            
            this.Actions.push(action);
            var undo = this.Actions.pop();
            this.Undos.push(undo);
            this.Actions.pop();
            
        }else if (type === "deleteEdge")
        {
            var link = this.addLink(undo.SourceID, undo.TargetID, undo.x1, undo.y1, undo.x2, undo.y2);
            var edgeID = link[0].id;
            var sourceID = link[1].SourceID;
            var x1 = link[1].x;
            var y1 = link[1].y;
            var targetID = link[2].TargetID;
            var x2 = link[2].x;
            var y2 = link[2].y;
            
            var action = {
                "action": "addEdge",
                "edgeid": edgeID,
                "label": "",
                "SourceID": sourceID,
                "x1": x1,
                "y1": y1,
                "TargetID": targetID,
                "x2": x2,
                "y2": y2
            };
            
            this.Actions.push(action);
            var undo = this.Actions.pop();
            this.Undos.push(undo);
            this.Actions.pop();
        }
        console.log(this.Undos);
    }
    
    /**
     * Redo function
     * 
     * Uses same principles as previous function
     * 
     * @return {undefined}
     */
    redo()
    {
        var redo = this.Undos.pop();
        this.Undos.push(redo);
        console.log(this.Undos);
        var type = redo.action;
        
        if (type === "addNode")
        {
            this.deleteNode(redo.nodeid);
            this.Undos.pop();
        }else if (type === "deleteNode")
        {
            var node = this.addNode(redo.name, redo.type, redo.icon, redo.x_axis, redo.y_axis, true);

            try{
                var pos1 = this.Actions.map(function(e) { return e.nodeid; }).indexOf(redo.nodeid);
                this.Actions[pos1].nodeid = node.id;
                
            }catch(err)
            {
                console.log("No Action");
            } 
            
            var linksTo = redo.linksTo;
            var linksFrom = redo.linksFrom;
            
            linksTo.forEach((links)=>{
                this.addLink(links[1].SourceID, node.id, links[1].x, links[1].y, links[2].x, links[2].y);
            });
            
            linksFrom.forEach((links)=>{
                this.addLink(node.id, links[2].TargetID, links[1].x, links[1].y, links[2].x, links[2].y);
            });
        }else if (type === "addEdge")
        {
            this.deleteLink(redo.edgeid);
            var pos1 = this.Actions.map(function(e) { return e.edgeid; }).indexOf(redo.edgeid);
            
            var action = {
                "action": "deleteEdge",
                "edgeid": redo.edgeid,
                "label": "",
                "SourceID": redo.SourceID,
                "x1": redo.x1,
                "y1": redo.y1,
                "TargetID": redo.targetID,
                "x2": redo.x2,
                "y2": redo.y2
            };
            
            this.Undos.push(action);
        }else if (type === "deleteEdge")
        {
            var link = this.addLink(redo.SourceID, redo.TargetID, redo.x1, redo.y1, redo.x2, redo.y2);
            var edgeID = link[0].id;
            var sourceID = link[1].SourceID;
            var x1 = link[1].x;
            var y1 = link[1].y;
            var targetID = link[2].TargetID;
            var x2 = link[2].x;
            var y2 = link[2].y;
            
            var action = {
                "action": "addEdge",
                "edgeid": edgeID,
                "label": "",
                "SourceID": sourceID,
                "x1": x1,
                "y1": y1,
                "TargetID": targetID,
                "x2": x2,
                "y2": y2
            };
            
            this.Undos.push(action);
        }      
        var redo = this.Undos.pop();
    }
    
    
    /*
     * 
     * HTML Specific Funtions
     * 
     * These functions retrieve DOM elements from the html page to be manipulated
     * 
     */ 

    
    /**
     * Main function
     * 
     * Draws D3 SVG graph based on the data from arrays
     * 
     * @return {undefined}
     */
    drawGraph() 
    { 
        var height = 400;

        var data = this.Accounts;

        var edgeData = this.Links;
                       
        var body = d3.select("body")
            .attr('tabindex', '0')
            .attr('focusable', 'true')
            .on("keydown", ()=>
            {
                //If key pressed === ctrl
                if (d3.event.keyCode === 17)
                {
                    if(this.focusNode !== null)
                    {
                        this.deleteNode(this.focusNode);
                        this.focusNode = null;
                        this.Undos = [];
                        this.refreshGraph();
                    }else if(this.focusLink !== null)
                    {
                        var pos = this.Links.map(function(e) { return e[0].id; }).indexOf(this.focusLink);;
                        var link = this.Links[pos];
                        console.log(link);
                        var action = {
                            "action": "deleteEdge",
                            "edgeid": link[0].id,
                            "label": "",
                            "SourceID": link[1].SourceID,
                            "x1": link[1].x,
                            "y1": link[1].y,
                            "TargetID": link[2].TargetID,
                            "x2": link[2].x,
                            "y2": link[2].y
                        };
                        this.deleteLink(this.focusLink);
                        this.Undos = [];
                        this.Actions.push(action);
                        console.log(this.Actions);
                        this.focusLink = null;
                        this.refreshGraph();
                    }
                }
                if (d3.event.keyCode === 16)
                {
                    if(this.focusLink !== null)
                    {
                        this.changeLinkColor(this.focusLink);
                        this.refreshGraph();
                    }
                }
                
            });
    
    
        //Initialises D3 SVG container
        //Container will be located in "graph" div on html page
        var svgContainer = d3.select("#graph")
            .append("svg")
            .on('click', ()=> this.click())
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("class", "graph-svg-component")
            
            .on("contextmenu", function (d, i) {
                    d3.event.preventDefault();
                   // react on right-clicking
                })
                //Allows for panning and zooming 
                //TODO:::Currently position resets on refresh
            .call(d3.zoom().on("zoom", function () {
                svgContainer.attr("transform", d3.event.transform);
            }))
            .append("g");
        
        //Arrow heads for Edges
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
            
        
        //Used for Edges
        //Data pulled from edgeData array
        var line = svgContainer.selectAll("line")
            .data(edgeData)
            .enter()
            .append('line');
           
        var lineAttributes = svgContainer.selectAll("line")
            .attr("x1", function(d) {return d[1].x;})     // x position of the first end of the line
            .attr("y1", function(d) {return d[1].y;})     // y position of the first end of the line
            .attr("x2", function(d) {return d[2].x;})     // x position of the second end of the line
            .attr("y2", function(d) {return d[2].y;})   // y position of the second end of the line    
            .attr("class", "arrow")
            .attr("marker-end", "url(#arrow)")
            .style("stroke", function(d) {return d[0].color;})
            .attr("stroke-width", 2)
            .on('mouseover', (d)=> this.onHoverEdge(d))
            .on('mouseout', (d)=> this.offHoverEdge(d))
            .on('click', function(){console.log("click");});
        
        
        //Circle elements behind nodes
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
            
            .style("fill", function(d) { return d3.rgb(d.color); })
            .style("stroke", function(d) 
                { 
                    if (d.outline === "none")
                    {
                        return d.color; 
                    }else
                    {
                        return d.outline;
                    }
                })
            .attr("stroke-width", 2)
            .on('mouseover', (d)=> this.onHoverNode(d))
            .on('mouseout', (d)=> this.offHoverNode(d));

        var nodeAttributes = node
            .attr("x", function (d) { return d.x_axis; })
            .attr("y", function (d) { return d.y_axis; })
            .attr("id", function (d) { return d.id; })
            /*
             * Manually add icons here
             * 
             * type taken from html page
             * 
             * TODO:::Find a better way of adding icons to nodes
             * 
             * BUG:::Icons are not centered on Nodes
             * 
             */
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
                    else if (type === "lock")
                    {
                        return "fas";
                    }
                    else if (type === "swipe")
                    {
                        return "fas";
                    }
                    else if (type === "mobile")
                    {
                        return "fas";
                    }
                    else if (type === "computer")
                    {
                        return "fas";
                    }
                    else if (type === "laptop")
                    {
                        return "fas";
                    }
                    else if (type === "tablet")
                    {
                        return "fas";
                    }
                    else if (type === "fingerprint")
                    {
                        return "fas";
                    }
                    else if (type === "irus")
                    {
                        return "far";
                    }
                    else if (type === "amazon")
                    {
                        return "fab";
                    }
                    else if (type === "cart")
                    {
                        return "fas";
                    }
                    else if (type === "appstore")
                    {
                        return "fab";
                    }
                    else if (type === "facebook")
                    {
                        return "fab";
                    }
                    else if (type === "twitter")
                    {
                        return "fab";
                    }
                    else if (type === "instagram")
                    {
                        return "fab";
                    }
                    else if (type === "social")
                    {
                        return "fas";
                    }
                    else if (type === "dollar")
                    {
                        return "fas";
                    }
                    else if (type === "card")
                    {
                        return "far";
                    }
                    else if (type === "bill")
                    {
                        return "fas";
                    }
                    else if (type === "bitcoin")
                    {
                        return "fab";
                    }
                    else if (type === "ethereum")
                    {
                        return "fab";
                    }
                    else if (type === "coins")
                    {
                        return "fas";
                    }
                    else if (type === "sms")
                    {
                        return "fas";
                    }
                    else if (type === "famail")
                    {
                        return "fas";
                    }
                    else if (type === "shield")
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
                    else if (type === "lock")
                    {
                        return '\uf13e';
                    }
                    else if (type === "swipe")
                    {
                        return '\uf0a6';
                    }
                    else if (type === "mobile")
                    {
                        return '\uf3cd';
                    }
                    else if (type === "computer")
                    {
                        return '\uf108';
                    }
                    else if (type === "laptop")
                    {
                        return '\uf109';
                    }
                    else if (type === "tablet")
                    {
                        return '\uf3fa';
                    }
                    else if (type === "fingerprint")
                    {
                        return '\uf577';
                    }
                    else if (type === "irus")
                    {
                        return '\uf06e';
                    }
                    else if (type === "amazon")
                    {
                        return '\uf270';
                    }
                    else if (type === "cart")
                    {
                        return '\uf07a';
                    }
                    else if (type === "appstore")
                    {
                        return '\uf36f';
                    }
                    else if (type === "facebook")
                    {
                        return '\uf082';
                    }
                    else if (type === "twitter")
                    {
                        return '\uf081';
                    }
                    else if (type === "instagram")
                    {
                        return '\uf16d';
                    }
                    else if (type === "social")
                    {
                        return '\uf2bd';
                    }
                    else if (type === "card")
                    {
                        return '\uf09d';
                    }
                    else if (type === "bill")
                    {
                        return '\uf53a';
                    }
                    else if (type === "dollar")
                    {
                        return '\uf155';
                    }
                    else if (type === "bitcoin")
                    {
                        return '\uf15a';
                    }
                    else if (type === "ethereum")
                    {
                        return '\uf42e';
                    }
                    else if (type === "coins")
                    {
                        return '\uf51e';
                    }
                    else if (type === "sms")
                    {
                        return '\uf7cd';
                    }
                    else if (type === "famail")
                    {
                        return '\uf674';
                    }
                    else if (type === "shield")
                    {
                        return '\uf3ed';
                    }
                    else if (type === "default")
                    {
                        return '\uf2b6';
                    }
                })     // Specify your icon in unicode
                        .on('click', (d) => console.log("test"))
            .on('mouseover', (d)=> this.onHoverNode(d))
            .on('mouseout', (d)=> this.offHoverNode(d))
            //Drag Attributes
            .call(d3.drag()
                .filter(['touchstart'])
                //Calls functions based on where the drag is
                .on("start", (d)=> this.dragstarted(d))
                .on("drag", ()=> this.dragged())
                .on("end", ()=> this.dragended()));
        

        //Add SVG Text Element Attributes for icons
        var textLabels = label
                        .attr("x", function(d) { return d.x_axis; })
                        .attr("y", function(d) { return d.y_axis - 20; })
                        .text( function (d) { return d.name; })
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
        if(document.getElementById('accordion').children[0].attributes[4].nodeValue === "true")
        {
            var name = document.getElementById('addlogin').elements.loginname.value;
            var icon = document.getElementById('addlogin').elements.icon.value;
            var type = "login";
        }else if(document.getElementById('accordion').children[6].attributes[4].nodeValue === "true")
        {
            var name = document.getElementById('addemail').elements.emailname.value;
            var icon = document.getElementById('addemail').elements.icon.value;
            var type = "email";
        }else if (document.getElementById('accordion').children[2].attributes[4].nodeValue === "true")
        {
            var name = document.getElementById('addsecurity').elements.passwordname.value;
            var icon = document.getElementById('addsecurity').elements.icon.value;
            var type = null;
            if((icon==='password')||(icon==='lock')||(icon==='swipe'))
            {
                type = "password";
                console.log(type);
            }else if ((icon==='sms')||(icon==='famail')||(icon==='shield'))
            {
                type = "2fa";
                console.log(type);
            }else if ((icon==='fingerprint')||(icon==='irus'))
            {
                type = "biometric";
                console.log(type);
            }
        }else if (document.getElementById('accordion').children[4].attributes[4].nodeValue === "true")
        {
            var name = document.getElementById('adddevice').elements.devicename.value;
            var icon = document.getElementById('adddevice').elements.icon.value;
            var type = "device";
        }else if (document.getElementById('accordion').children[8].attributes[4].nodeValue === "true")
        {
            var name = document.getElementById('addshopping').elements.shoppingname.value;
            var icon = document.getElementById('addshopping').elements.icon.value;
            var type = "shopping";
        }else if (document.getElementById('accordion').children[10].attributes[4].nodeValue === "true")
        {
            var name = document.getElementById('addsocial').elements.socialname.value;
            var icon = document.getElementById('addsocial').elements.icon.value;
            var type = "social";
        }else if (document.getElementById('accordion').children[12].attributes[4].nodeValue === "true")
        {
            var name = document.getElementById('addcurrency').elements.bankingname.value;
            var icon = document.getElementById('addcurrency').elements.icon.value;
            var type = null;
            if((icon === 'card')||(icon ==='bill')||(icon ==='dollar'))
            {
                type = "banking";
            }else if ((icon ==='bitcoin')||(icon ==='ethereum')||(icon ==='coins'))
            {
                type = "crypto";
            }
        }
        
        this.Undos = [];
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
        this.dragStartNode = startNode;
        if (d3.event.sourceEvent.buttons === 1) 
        {
            this.addLink(startNode.id, 0, startNode.x_axis, startNode.y_axis - 5, startNode.x_axis, startNode.y_axis);
            this.dragLeft = true;         
        }else if (d3.event.sourceEvent.buttons === 2)
        {
            this.dragRight = true;  
        }
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

        var linksTo = [];
        var linksFrom = [];
        
        var id = this.dragStartNode.id;
        
        this.Links.forEach(function(res){
            if(res[2].TargetID === id)
            {
                linksTo.push(res);
            }
            if(res[1].SourceID === id)
            {
                linksFrom.push(res);
            }
            
        });
        
        
        if (this.dragLeft === true) 
        {
            var pos = this.Links.map(function(e) { return e[2].TargetID; }).indexOf(0);

            this.modifyLinkTarget(this.Links[pos][0].id, 0, px.x, py.y);
        } else if (this.dragRight === true)
        {
            this.modifyNodePOS(id, px.x, py.y);
            for (var i = 0, len = linksFrom.length; i < len; i++) {
                this.modifyLinkSource(linksFrom[i][0].id, px.x, py.y);
            }
            
            //Used to decide on edge end point positioning
            //TODO:::Make this much more accurate
            for (var i = 0, len = linksTo.length; i < len; i++) {
                var newx;
                var newy;
                
                if (px.x > linksTo[i][1].x)
                {
                    newx = px.x - 6;
                }
                else
                {
                    newx = px.x + 6;
                }
                
                if (py.y > linksTo[i][1].y)
                {
                    newy = py.y - 6;
                }
                else
                {
                    newy = py.y + 6;
                }
                
                
                this.modifyLinkTarget(linksTo[i][0].id, linksTo[i][2].TargetID, newx, newy);
                
            }
        }
        
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

        if (this.dragLeft === true) 
        {
            var nodes = this.getNodesNearCoords(px.x, py.y);
            var pos = this.Links.map(function(e) { return e[2].TargetID; }).indexOf(0);
            var linkID = this.Links[pos][0].id;

            if (!nodes.length)
            {
                this.deleteLink(linkID);
            }else
            {
                var link = this.modifyLinkTarget(linkID, nodes[0].id, px.x, py.y);

                var edgeID = link[0].id;
                var sourceID = link[1].SourceID;
                var x1 = link[1].x;
                var y1 = link[1].y;
                var targetID = link[2].TargetID;
                var x2 = link[2].x;
                var y2 = link[2].y;

                var action = {
                    "action": "addEdge",
                    "edgeid": edgeID,
                    "label": "",
                    "SourceID": sourceID,
                    "x1": x1,
                    "y1": y1,
                    "TargetID": targetID,
                    "x2": x2,
                    "y2": y2
                };
                this.Undos = [];
                this.Actions.push(action);
            }
        }else if (this.dragRight === true)
        {
            
        }
        this.refreshGraph();
        this.dragLeft = false;
        this.dragRight = false;
        this.dragStartNode = null;
    }
    
    /**
     * Triggered when a node is hovered over
     * 
     * @param {type} node
     * @return {undefined}
     */
    onHoverNode(node){
        var id = node.id;
        var pos = this.Accounts.map(function(e) { return e.id; }).indexOf(id);
        
        this.Accounts[pos].outline = "white";
        this.focusNode = id;
        
        this.refreshGraph();
    }
    
    /**
     * Triggered when focus is taken off a node
     * 
     * @param {type} node
     * @return {undefined}
     */
    offHoverNode(node){
        try{
            var id = node.id;
            var pos = this.Accounts.map(function(e) { return e.id; }).indexOf(id);

            this.Accounts[pos].outline = "none"; 
        }
        catch(err)
        {
            console.log("Node No Longer Exists");
        }
        this.focusNode = null;
        
        
        this.refreshGraph();
    }
    
    /**
     * Triggered when an edge is hovered over
     * 
     * @param {type} edge
     * @return {undefined}
     */
    onHoverEdge(edge){
        try{
            var id = edge[0].id;
            var pos = this.Links.map(function(e) { return e[0].id; }).indexOf(id);

            this.Links[pos][0].color = "white";
            this.focusLink = id;
        }
        catch(err)
        {
            console.log("Link No Longer Exists");
        }
        
        this.refreshGraph();
    }
    
    /**
     * Triggered once focus has been taken off of an edge
     * 
     * @param {type} edge
     * @return {undefined}
     */
    offHoverEdge(edge){
        try{
            var id = edge[0].id;
            var pos = this.Links.map(function(e) { return e[0].id; }).indexOf(id);
            this.Links[pos][0].color = this.linkColors[this.Links[pos][0].colorType];
        }
        catch(err)
        {
            console.log("Link No Longer Exists");
        }
        this.focusLink = null;
        
        this.refreshGraph();
    }
    
    /**
     * Experemental node clicked function
     * 
     * TODO:::Get click functions working on individual elements
     * 
     * @param {type} node
     * @return {undefined}
     */
    nodeClick(node){
        var id = node.id;
        
        console.log(id);
        
        this.deleteNode(id);
        
        this.refreshGraph();
    }
    

    /**
     * Called to add a node
     * 
     * @return {Boolean}
     */
    addEmailNode(){
        var name = document.getElementById('addemail').elements.emailname.value;
        var icon = document.getElementById('addemail').elements.icon.value;
        this.addNode(name, "email", icon, 0, 0, false);
        this.Undos = [];
        this.refreshGraph();
        
        return true;
    }

    /**
     * Called to add a password node
     * 
     * @return {Boolean}
     */
    addPasswordNode(){
        var name = document.getElementById('addpassword').elements.passwordname.value;
        this.addNode(name, "password", "password", 0, 0, false);
        this.Undos = [];
        this.refreshGraph();
        
        return true;
    }
    
    /**
     * Called when Undo Button is clicked
     * 
     * @return {undefined}
     */
    undoButton(){
        this.undo();
        this.refreshGraph();
    }
    
    /**
     * Called when Redo Button is clicked
     * 
     * @return {undefined}
     */
    redoButton(){
        this.redo();
        this.refreshGraph();
    }

    /**
     * Refreshes Graph
     * 
     * @return {Boolean}
     */
    refreshGraph()
    {
        if(this.Actions.length === 0)
        {
            document.getElementById("undo").disabled = true;
        }else
        {
            document.getElementById("undo").disabled = false;
        }
        if(this.Undos.length === 0)
        {
            document.getElementById("redo").disabled = true;
        }else
        {
            document.getElementById("redo").disabled = false;
        }
        d3.select("svg").remove();
        this.drawGraph();
        
        return true;
    }
    
    /**
     * Clears Graph
     * 
     * @return {undefined}
     */
    clearGraph()
    {
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
        
        //Variables for Undo and Redo
        this.Actions = [];
        this.Undos =[];
        
        this.refreshGraph();
    }

    /**
     * Exports graph JSON
     * 
     * Not compatable with older browsers
     * 
     * @return {undefined}
     */
    exportJSON(){
        this.JSON = {
            "currentNodeID": this.currentNodeID,
            "currentEdgeID": this.currentEdgeID,
            "nodes": this.Accounts,
            "edges": this.Links
        };
        
        var element = document.createElement('a');
        element.setAttribute('href', 'data:json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.JSON)));
        element.setAttribute('download', 'GraphJSON.json');

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);

        localStorage.setItem("jsongraph", JSON.stringify(this.JSON));
    }
    
    /**
     * Imports graph JSON
     * 
     * Not compatable with older browsers or safari
     * 
     * TODO:::Relies on html localstorage to operate, must be a better way
     * 
     * @return {undefined}
     */
    importJSON(){
        this.clearGraph();
        var f = document.getElementById('jsonUpload').files[0];

        var contents;
        
        var r = new FileReader();
        r.onload = (e)=> 
        { 
            contents = e.target.result;
            localStorage.setItem("jsongraph", contents);
        };
        r.readAsText(f);
        
        var output = JSON.parse(localStorage.getItem("jsongraph"));
        
        
        this.currentNodeID = output.currentNodeID;
        this.currentEdgeID = output.currentEdgeID;
        this.Accounts = output.nodes;
        this.Links = output.edges;
        
        localStorage.setItem("jsongraph", null);
        
        this.refreshGraph();
    }
    
    
    /*
     * 
     * Legacy Methods for Adding Nodes and Edges to graph
     * 
     * USED FOR TESTING ONLY
     * 
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