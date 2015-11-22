'use strict';

var Helper = (function (window, document, pluginName, undefined){
	function get (seletor,seletor_aux) {
		if(typeof(seletor)=="string" && seletor.indexOf("#")==0 && seletor.indexOf(" ")==-1) {
			return document.getElementById(seletor.substr(1))
		}
		if(typeof(seletor)=="string") {
			return document.getElementById(seletor);
		}
		if(typeof(seletor)=="object" && seletor instanceof HTMLCanvasElement) {
			return seletor;
		}
		if(typeof(document.querySelector)!="undefined" && document.querySelector) {
			return document.querySelector(seletor)
		}
		else { 
			var els=document.querySelectorAll(seletor);
			if(els && els.length>0){
				return els[0];
			}
			else { 
				return null;
			}
		}
	}

	function type (obj) {
		if(typeof obj == "undefined")
			return "undefined";
		if(obj == null)
			return "null";
		return Object.prototype.toString.call(obj).match(/^\[object\s(.*)\]$/)[1].toLowerCase();
	}

	function drawText (context, text, x, y, fill) {
		context.font = "bold 10pt Verdana";
	    context.fillStyle = fill;
	    context.fillText(text, x, y);
	}

	function drawCircle (context, x, y, radius, fill, Width, line) {
		context.arc(x, y, radius, 0, 2*Math.PI);
		context.fillStyle = fill;
		context.fill();
		context.strokeStyle = line;
		context.lineWidth = Width ? Width : 2;
		context.stroke();
	}

	function drawLine (context, x1, y1, x2, y2) {
		context.moveTo(x1, y1);
		context.lineTo(x2, y2);
		context.strokeStyle = "#C5C5C5";
		context.lineWidth = 4;
		context.stroke();
	}

	return {
		get: get,
		type: type,
		drawText: drawText,
		drawCircle: drawCircle,
		drawLine: drawLine
	}

})(window, document);


var GraphJs = function (el){
	this.canvas	 = null;
	this.context = null;
	this.nodes = [];
	this.lines	 = [];
	this._h		 = null;

	el = Helper.get(el);
	this._init(el);
};

GraphJs.prototype = {
	VERSION: '0.0.1',
	about : {
		author: "Wellington Eugenio dos Santos",
		created: "Nov 2015"
	},
	_init: function(canvas) {
		if(!canvas || !canvas.getContext){
			throw("[GraphJs] invalid canvas element.");
			return false;
		}
		
		this.canvas	= canvas || false;
		this.ctx	= this.canvas.getContext("2d");
		this.width	= Math.max(this.canvas.width, this.canvas.clientWidth);
		this.height	= Math.max(this.canvas.height, this.canvas.clientHeight);
		
		return true;
	},
	_play: function () {
		this._update();
		this._draw();

		window.requestAnimationFrame(this._play);
	},
	_update: function () {
		this.ctx.clearRect(0, 0, canvas.width, canvas.height);
	},
	_draw: function () {
	
	},
	_drawVignette:function(){
		var w = this.canvas.width,
			h = this.canvas.height,
			r = 10,
			_vignette = null;

		this.ctx.beginPath();
			if (!_vignette){
				var top = this.ctx.createLinearGradient(0, 0, 0, r);
					top.addColorStop(0, "white");
					top.addColorStop(.7, "rgba(255, 255, 255, 0)");

				var bot = this.ctx.createLinearGradient(0, h-r, 0, h);
					bot.addColorStop(0, "rgba(255, 255, 255, 0)");
					bot.addColorStop(1, "white");

				_vignette = {top:top, bot:bot}
			}
			this.ctx.fillStyle = _vignette.top;
			this.ctx.fillRect(0, 0, w, r);

			this.ctx.fillStyle = _vignette.bot;
			this.ctx.fillRect(0, h-r, w, r);
	
		this.ctx.closePath();
	},
	addNode : function (data) {
		this.nodes.push(data);
		return data;
	},
	addVertice: function (startNode, endNode) {
		if(startNode == null){
			throw("[GraphJs] StartNode was not selected"); 
			return false;
		}
		if(endNode == null){
			throw("[GraphJs] EndNode was not selected"); 
			return false;
		}
		if (Helper.type(startNode)!="object" && Helper.type(endNode)!="object") {
			throw("[GraphJs] Arguments invalid!");
			return false;
		}
		
		var data =  [
		{
			x: startNode['x'],
			y: startNode['y']
		},
		{
			x: endNode['x'],
			y: endNode['y']	
		}];

		console.log(data);

		this.lines.push(data);
		return data;
	},
	render: function () {
		if(Helper.type(this.lines) != "array") {
			throw("Arguments invalid!");
		}

		if(this.lines.length > 0){
			for(var line in this.lines){
				if (typeof this.lines[line] == "object") {
					Helper.drawLine(
						this.ctx,
						this.lines[line][0]['x'],
						this.lines[line][0]['y'],
						this.lines[line][1]['x'],
						this.lines[line][1]['y']
					);
				}
			}
		}

		for(var obj in this.nodes){
			var strokeStyle = null,
				lineWidth   = null;

			this.ctx.beginPath();
				if (this.nodes[obj]['radius'])
					this._h = this.nodes[obj]['radius'];
				else
					this._h = 50;

				if(this.nodes[obj]['border'])
					strokeStyle = this.nodes[obj]['border'];
				else
					strokeStyle = "black";

				if(this.nodes[obj]['borderSize'])
					lineWidth = this.nodes[obj]['borderSize'];
				else
					lineWidth = 2;

				this.ctx.fillStyle = this.nodes[obj]['color'];
				
				Helper.drawCircle(
					this.ctx, 
					this.nodes[obj]['x'], 
					this.nodes[obj]['y'], 
					this._h, 
					this.nodes[obj]['color'], 
					lineWidth, 
					this.nodes[obj]['border']
				);

				if(this.nodes[obj]['label']){
					var text_length = (this.nodes[obj]['label'].length*4);

					Helper.drawText(
						this.ctx,
						this.nodes[obj]['label'],
						(this.nodes[obj]['x'] - text_length),
						(this.nodes[obj]['y']+5),
						"#fff"
					);
				}
			this.ctx.closePath();
		}
		this._drawVignette();
	},
	toString: function () {
		return "[object Graph.js]";
	}
};