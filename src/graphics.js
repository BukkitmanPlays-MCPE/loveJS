//Graphics

love.graphics = {};

love.graphics.images = {};

love.graphics.color = {r:255,g:255,b:255,a:255};

love.graphics.backgroundColor = {r:0,g:0,b:0};

love.graphics.pointSize = 1;

love.graphics.fontSize = 10;

love.graphics.defaultFilter = "linear";

love.graphics.font = {};

love.graphics.preload = function (a) {
	for (var i = 0; i < arguments.length; i++) {
		var name = arguments[i];
		var img;
		img = new Image();
		img.src = name;
		img.onload = function(){
			love._assetsLoaded++;
		}
		this.images[name] = img;
		love._assetsToBeLoaded++;
		
	};
}


//Drawing functions

love.graphics.rectangle = function (mode,x,y,w,h) {
	this.ctx.fillRect(x,y,w,h);
	love.graphics.mode(mode);
}

love.graphics.circle = function (mode,x,y,r) {
	this.ctx.beginPath();
	this.ctx.arc(x,y,Math.abs(r),0,2*Math.PI);
	love.graphics.mode(mode)
}

love.graphics.arc = function (mode,x,y,r,a1,a2) {
	this.ctx.beginPath();
	this.ctx.lineTo(x,y);
	this.ctx.arc(x,y,Math.abs(r),a1,a2);
	this.ctx.lineTo(x,y);
	love.graphics.mode(mode);
}

love.graphics.clear = function () {
	this.ctx.fillStyle = this.rgb(this.backgroundColor.r,this.backgroundColor.b,this.backgroundColor.g);
	this.background();
	this.ctx.fillStyle = this.rgb(this.color.r,this.color.b,this.color.g);
}

love.graphics.line = function () {
	this.ctx.beginPath();
	if (typeof(arguments[0]) == "object") {
		this.ctx.moveTo(verts[0],verts[1]);
		for (var i = 0; i < verts.length-2; i+=2) {
			this.ctx.lineTo(verts[i+2],verts[i+3]);
			this.ctx.stroke();
		};
		
	}
	else {
		this.ctx.moveTo(arguments[0],arguments[1]);
		for (var i = 0; i < arguments.length-2; i+=2) {
			this.ctx.lineTo(arguments[i+2],arguments[i+3]);
			this.ctx.stroke();
		};
	}
	this.ctx.closePath();
}

love.graphics.point = function (x,y) {
	this.ctx.beginPath();
	this.ctx.arc(x,y,Math.abs(this.pointSize),0,2*Math.PI);
	love.graphics.mode("fill")
}

love.graphics.polygon = function (mode, verts) {
	this.ctx.beginPath();
	this.ctx.moveTo(verts[0],verts[1]);
	for (var i = 0; i < verts.length-2; i+=2) {
		this.ctx.lineTo(verts[i+2],verts[i+3]);
		this.ctx.stroke();
	};
	this.ctx.closePath();
	love.graphics.mode(mode);
}

love.graphics.print = function (t,x,y,r,sx,sy,ox,oy) {

	x = x || 0;
	y = y || 0;
	r = r || 0;
	sx = sx || 1;
	sy = sy || 1;
	ox = ox || 0;
	oy = oy || 0;
	this.ctx.save();
	this.ctx.translate(x,y);
	this.ctx.scale(sx,sy);
	this.ctx.rotate(r);
	this.ctx.fillText(t, -ox, -oy);
	this.ctx.restore();
}

//Note: Doesn't work perfect yet with rotation.
love.graphics.printf = function (t,x,y,limit,align,r,sx,sy,ox,oy) {
	x = x || 0;
	y = y || 0;
	r = r || 0;
	sx = sx || 1;
	sy = sy || 1;
	ox = ox || 0;
	oy = oy || 0;
	this.ctx.textAlign=align;
	
	var words = t.split(' ');
    var line = '';
	
	for(var i = 0; i < words.length; i++) {
      var testLine = line + words[i] + ' ';
      var metrics = this.ctx.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > limit && i > 0) {
      	this.ctx.save();
		this.ctx.translate(x,y);
		this.ctx.scale(sx,sy);
		this.ctx.rotate(r);
      	this.ctx.fillText(line, -ox,-oy);
		this.ctx.restore();

        line = words[i] + ' ';
        y += this.fontSize+10*sy;
      }
      else {
        line = testLine;
      }
    }

 	this.ctx.save();
	this.ctx.translate(x,y);
	this.ctx.scale(sx,sy);
	this.ctx.rotate(r);
  	this.ctx.fillText(line, -ox,-oy);
	this.ctx.restore();
	this.ctx.textAlign="left";
}

love.graphics._draw = function (img,x,y,r,sx,sy,ox,oy,kx,ky,quad) {
	if (x == null) {
		x = 0;
	}
	if (y == null) {
		y = 0;
	}
	if (r == null) {
		r = 0;
	}
	if (sx == null) {
		sx = 1;
	}
	if (sy == null) {
		sy = sx;
	}
	if (ox == null) {
		ox = 0;
	}
	if (oy == null) {
		oy = 0;
	}
	if (kx == null) {
		kx = 0;
	}
	if (ky == null) {
		ky = 0;
	}

	if (img.filter != "default") {
		this.ctx.imageSmoothingEnabled = img.filter == "linear";
	}
	else {
		this.ctx.imageSmoothingEnabled = this.defaultFilter;
	}
	this.ctx.save();
	this.ctx.transform(1,ky,kx,1,0,0);
	this.ctx.translate(x,y);
	this.ctx.scale(sx,sy);
	this.ctx.rotate(r);
	if (quad) {
		this.ctx.drawImage(love.graphics.images[img.url],quad.viewport.sx,quad.viewport.sy,quad.viewport.sw,quad.viewport.sh,-ox,-oy,quad.viewport.sw,quad.viewport.sh);
	}
	else{
		this.ctx.drawImage(love.graphics.images[img.url],-ox,-oy);
	}
	this.ctx.restore();
	this.ctx.imageSmoothingEnabled = this.defaultFilter == "linear";
}

love.graphics.draw = function (img,quad,x,y,r,sx,sy,ox,oy,kx,ky) {
	if (typeof(quad) != "object") {
		love.graphics._draw(img,quad,x,y,r,sx,sy,ox,oy,kx,ky);
	}
	else{
		love.graphics._draw(img,x,y,r,sx,sy,ox,oy,kx,ky,quad);
	}
}



//New functions
love.graphics.newImage = function (url) {
	var img;
	img = {};
	img.url = url;
	img.filter = "default";
	img.wrap = "clamp"

	img.typeOf = function (type) {
		return type == "Object" || type == "Drawable" || type == "Texture" || type == "Image";
	}

	img.type = function () {
		return "Image";
	}

	img.getFilter = function () {
		return (this.filter=="default") ? love.graphics.defaultFilter : this.filter;
	}
	
	img.getDimensions = function () {
		return [this.width,this.height];
	}

	img.getWidth = function () {
		return this.width;
	}

	img.getHeight = function () {
		return this.height;
	}

	img.getWrap = function () {
		return this.wrap;
	}

	img.getData = function () {

	}

	img.setFilter = function (filter) {
		switch (filter) {
			case "nearest":
			    this.filter = "nearest";
			    break;
			case "linear":
			    this.filter = "linear";
			    break;
			case null:
				this.filter = "default";
				break;
			default:
				throw("Invalid filter mode: " + filter)
				break;
		}
	}

	img.setWrap = function (wrap) {
		switch (wrap) {
			case "clamp":
			    this.wrap = "clamp";
			    break;
			case "repeat":
			    this.wrap = "repeat";
			    break;
			case null:
				this.wrap = "clamp";
				break;
			default:
				throw("Invalid filter mode: " + filter)
				break;
		}
	}

	return img;
}


love.graphics.newQuad = function (x,y,w,h,sw,sh,adw,adh) {
	var quad = {};
	quad.viewport = {sx:x,sy:y,sw:w,sh:h}

	quad.typeOf = function (type) {
		return type == "Object" || type == "Quad";
	}

	quad.type = function () {
		return "Quad";
	}

	quad.getViewport = function () {
		return [this.viewport.sx,this.viewport.sy,this.viewport.sw,this.viewport.sh];
	}

	quad.setViewport = function (x,y,w,h) {
		this.viewport = {sx:x,sy:y,sw:w,sh:h};
	}
	return quad;
}


love.graphics.newFont = function (fnt,size) {
	font = {};
	font.size = size;
	font.name = fnt;
	font.filter = "default";

	font.typeOf = function (type) {
		return type == "Object" || type == "Font";
	}

	font.type = function () {
		return "Font";
	}

	font.getFilter = function () {
		return (this.filter=="default") ? love.graphics.defaultFilter : this.filter;
	}

	font.setFilter = function (filter) {
		switch (filter) {
			case "nearest":
			    this.filter = "nearest";
			    break;
			case "linear":
			    this.filter = "linear";
			    break;
			case null:
				this.filter = "default";
				break;
			default:
				throw("Invalid filter mode: " + filter)
				break;
		}
	}

	return font;
}


//Set functions

love.graphics.setDefaultFilter = function (filter) {
	switch (filter) {
	case "nearest":
	    this.defaultFilter = "nearest";
	    break;
	case "linear":
	    this.defaultFilter = "linear";
	    break;
	default:
		throw("Invalid filter mode: " + filter)
		break;
	}
	this.ctx.imageSmoothingEnabled = this.defaultFilter == "linear";
}


love.graphics.setColor = function (r,g,b,a) {
	//TODO: Accept arrays
	if (typeof(r)=="object") {
		this.color.r = r[0] || this.color.r;
		this.color.g = g[0] || this.color.g;
		this.color.b = b[0] || this.color.b;
		this.color.a = a[0] || this.color.a;
	}
	else {
		this.color.r = r;
		this.color.g = g;
		this.color.b = b;
		this.color.a = a;
	}
	
	
	this.ctx.fillStyle = this.rgb(r,g,b);
	this.ctx.strokeStyle = this.rgb(r,g,b);
	love.graphics.ctx.globalAlpha = a/255;
}

love.graphics.setBackgroundColor = function (r,g,b) {
	this.backgroundColor.r = r.toString(16);
	this.backgroundColor.g = g.toString(16);
	this.backgroundColor.b = b.toString(16);
	if (this.backgroundColor.r.length == 1){
		this.backgroundColor.r = this.backgroundColor.r + '0';
	}
	if (this.backgroundColor.g.length == 1){
		this.backgroundColor.g = this.backgroundColor.g + '0';
	}
	if (this.backgroundColor.b.length == 1){
		this.backgroundColor.b = this.backgroundColor.b + '0';
	}
}

love.graphics.setLineWidth = function (s) {
	this.ctx.lineWidth = s+1;
}

love.graphics.setPointSize = function (s) {
	this.pointSize = s;
}

love.graphics.setFont = function (fnt) {
	this.font = fnt;
	this.ctx.font = this.font.size + "pt " + this.font.name
}

love.graphics.setBlendMode = function (mode) {
	this.ctx.globalCompositeOperation = mode;
}


//Get functions
love.graphics.getDefaultFilter = function () {
	if (this.ctx.imageSmoothingEnabled) {
		return "linear";
	}
	else {
		return "nearest";
	}
}

love.graphics.getColor = function () {
	return [this.color.r,this.color,g,this.color.b,this.color.a];
}

love.graphics.getBackgroundColor = function () {
	return [parseInt(this.backgroundColor.r,16),parseInt(this.backgroundColor.g,16),parseInt(this.backgroundColor.b,16)];
}

love.graphics.getLineWidth = function () {
	return this.ctx.lineWidth;
}

love.graphics.getPointSize = function () {
	return this.pointsize;
}

love.graphics.getFont = function () {
	return this.font;
}



//Coordinate System
love.graphics.origin = function () {
	this.ctx.setTransform(1, 0, 0, 1, 0, 0);
}

love.graphics.translate = function (x,y) {
	this.ctx.translate(x,y);
}

love.graphics.rotate = function (r) {
	this.ctx.rotate(r);
}

love.graphics.scale = function (sx,sy) {
	this.ctx.scale(sx,sy)
}

love.graphics.shear = function (kx,ky) {
	this.ctx.transform(1,ky,kx,1,0,0);
}

love.graphics.push = function () {
	this.ctx.save();
}

love.graphics.pop = function () {
	this.ctx.restore();
}



//Utils

love.graphics.mode = function (mode) {
	if (mode=="fill") {
		this.ctx.fill();
	}
	else if (mode=="line") {
		this.ctx.stroke();
	}
}

love.graphics.clearScreen = function () {
	this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
}

love.graphics.background = function () {
	this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
}

love.graphics.rgb = function (r,g,b) {
	var x = ((r << 16) | (g << 8) | b).toString(16);
	return "#000000".substring(0, 7 - x.length) + x;
}