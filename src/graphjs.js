'use strict';

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

var GraphJs = function (el){
	this.canvas		= null;
	this.context 	= null;
	this.circles	= [];
	this.lines		= [];
	this._h			= null;

	el = get(el);
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
	circle : function (data) {
		this.circles.push(data);
		return data;
	},
	connected: function (obj, obj_outher) {
		if (type(obj)!="object" && type(obj_outher)!="object") {
			throw("Arguments invalid!");
			return false;
		}
		var data =  [
		{
			x: obj['x'],
			y: obj['y']
		},
		{
			x: obj_outher['x'],
			y: obj_outher['y']	
		}];

		this.lines.push(data);
		return data;
	},
	render: function () {
		if(type(this.lines) != "array") {
			throw("Arguments invalid!");
		}

		if(this.lines.length > 0){
			for(var line in this.lines){
				if (typeof this.lines[line] == "object") {
					this.ctx.beginPath();
						this.ctx.moveTo(this.lines[line][0]['x'], this.lines[line][0]['y']);
						this.ctx.lineTo(this.lines[line][1]['x'], this.lines[line][1]['y']);
						this.ctx.strokeStyle = "#b2b19d";
						this.ctx.lineWidth = 4;
						this.ctx.stroke();
					this.ctx.closePath();
				}
			}
		}

		for(var obj in this.circles){
			this.ctx.beginPath();
				if (this.circles[obj]['radius']) {
					this._h = this.circles[obj]['radius'];
				}
				else {
					this._h = 50;
				}

				this.ctx.fillStyle = this.circles[obj]['color'];
				this.ctx.arc(this.circles[obj]['x'], this.circles[obj]['y'], this._h, 0, 2*Math.PI);

				if(this.circles[obj]['border'])
					this.ctx.strokeStyle = this.circles[obj]['border'];
				else
					this.ctx.strokeStyle = "black";

				if(this.circles[obj]['borderWidth'])
					this.ctx.lineWidth = this.circles[obj]['borderWidth'];
				else
					this.ctx.lineWidth = 2;

				this.ctx.stroke();
				this.ctx.fill();
			this.ctx.closePath();
		
			this.ctx.beginPath();
				this.ctx.font = "bold 10pt Verdana";
				this.ctx.fillStyle = "#fff";
				if(this.circles[obj]['label']){
					var text_length = (this.circles[obj]['label'].length*4);

					this.ctx.fillText(this.circles[obj]['label'], (this.circles[obj]['x'] - text_length), (this.circles[obj]['y']+5));
				}
			this.ctx.closePath();
		}
		this._drawVignette();
	},
	toString: function () {
		return "[object Graph.js]";
	}
};