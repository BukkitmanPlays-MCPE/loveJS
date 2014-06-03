//Create an object.
obj = {};
//Preload the image
//love.graphics.preload(url);
love.graphics.preload("pyramid.png");
//Preload the audio
//love.audio.preload(url);
love.audio.preload("bounce.ogg");
//Get a new font
//love.graphics.newFont(name,size);
obj.font = love.graphics.newFont("arial",12);
//All the other properties
obj.x = 200;
obj.y = 250;
obj.r = 1;
obj.sx = 1;
obj.sy = 1;
obj.dir = 1;
obj.speed = 100;

//Called when the preloading is done
love.load = function () {
	obj.image = love.graphics.newImage("pyramid.png");
	obj.bounce = love.audio.newSource("bounce.ogg");
}

//The main updater
love.update = function (dt) {
	//Move the pyramid
	obj.x += obj.speed * obj.dir * dt;

	//Make him bounce off the walls
	if (obj.x > 800) {
		obj.dir = -obj.dir;
		obj.x = 800;
		//Play a sound as he bounces
		love.audio.stop(obj.bounce);
		love.audio.play(obj.bounce);
	}

	if (obj.x<0) {
		obj.dir = -obj.dir;
		obj.x = 0;
		love.audio.stop(obj.bounce);
		love.audio.play(obj.bounce);
	}

	//Spin the pyramid
	obj.r += 3 * dt;

	//Scale the pyramid down as he gets closer to the center
	obj.sx = 4*((400-obj.x)/400);
	obj.sy = 4*((400-obj.x)/400);

	//Speed up the pyramid's movement
	if (love.keyboard.isDown("w","up")) {
		obj.speed += 300 * dt;
	}

	//Slow down the pyramid's movement
	if (love.keyboard.isDown("s","down")) {
		obj.speed -= 300 * dt;
	}

}

//The draw loop
love.draw = function () {
	//Set the font
	love.graphics.setFont(obj.font);
	//Prevent images of being blurry
	love.graphics.setDefaultFilter("nearest");
	//Draw the pyramid
	love.graphics.draw(obj.image,obj.x,obj.y,obj.r,obj.sx,obj.sy,49,42);
	//Draw the description
	love.graphics.printf("l o v e J S     D e m o     v 0 . 0 2",400,30,800,"center");
	love.graphics.print("A/Up to speed up",10,55);
	love.graphics.print("S/Down to slow down",10,75);
	love.graphics.print("Space to invert direction",10,95);
	love.graphics.print("Click to position pyramid",10,115);
}

love.config = function (t) {
	//Set the width/height of the canvas
	t.width = 800;
	t.height = 600;
}

//If a key is pressed
love.keypressed = function (key) {
	//If the key pressed is spacebar
	if (key==" ") {
		//Change the direction of the pyramid
		obj.dir = - obj.dir;
	}
}

//If a mousebutton is pressed
love.mousepressed = function (x,y,button) {
	//If the left mousebutton is pressed
	if (button=="l") {
		//Position the pyramid
		obj.y = y;
		obj.x = x;
	}
}

//Initialize love
love.run();

