function getDelta(){
	return deltaTime/1000;
}

class Vector2 {
  	constructor(x,y){
    	this.x = x;
    	this.y = y;
  	}
  	get magnitude(){
    	return Math.sqrt(this.x * this.x + this.y * this.y);
 		}
  	add(vec2){
    	return new Vector2(this.x+vec2.x, this.y+vec2.y);
  	}
		sub(vec2){
    	return new Vector2(this.x-vec2.x, this.y-vec2.y);
  	}  
  	multiplyScalar(scalar){
    	return new Vector2(this.x*scalar, this.y*scalar);
  	}
  	divideScalar(scalar){
    	return this.multiplyScalar(1/scalar);
  	}
	normalize(){
		return this.divideScalar(this.magnitude || 1);
	}
}

class Color {
	constructor(r,g,b,a=255){
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}
	setColor(){
		fill(this.r,this.g,this.b,this.a)
	}
}

class InputManager {
	constructor(){
		this.keysDown = {bruh:"moment"};
		this.keysDown = {};
		this.mouseButtonsDown = {};
	}
	connect(){
		document.addEventListener('keydown', evnt => this.onKeyDown(evnt));
		document.addEventListener('keyup', evnt => this.onKeyUp(evnt));
		document.addEventListener('mousedown', evnt => this.onMouseButtonDown(evnt));
		document.addEventListener('mouseup', evnt => this.onMouseButtonUp(evnt));
	}
	onKeyDown(evnt){
		this.keysDown[evnt.keyCode] = true;
	}
	onKeyUp(evnt){
		if(this.keysDown[evnt.keyCode]){
			this.keysDown[evnt.keyCode] = false
		}
	}
	getKeyDown(code){
		if(this.keysDown[code]){
			return true;
		}
		return false;
	}
	onMouseButtonDown(evnt){
		this.mouseButtonsDown[evnt.button] = true;
	}
	onMouseButtonUp(evnt){
		this.mouseButtonsDown[evnt.button] = false;
	}
	getMouseButtonDown(btn){
		if(this.mouseButtonsDown[btn]){
			return true;
		}
		return false;
	}
	get mousePos(){
		return new Vector2(mouseX, mouseY);
	}
}

var input = new InputManager();
input.connect();

class BaseObject {
	constructor(){
		this.position = new Vector2(0,0);
		this.rotation = 0;
		this.pivot = new Vector2(0,0)
		this.children = [];
		this.parent;
	}
	setParent(parent){
		this.parent = parent;
		this.parent.updateChildren(this);
	}
	removeChild(child){
		var i = this.children.indexOf(child);
		this.children.splice(i,1);
		
	}
	updateChildren(child){
		if(!this.children[child]){
			this.children.push(child);
		}
	}
	getGlobalPosition(){
		return this.position.add(this.parent.position);
	}
}

const ROOT = new BaseObject();

class GameObject extends BaseObject {
	constructor(){
		super();
		this.color = new Color(255,255,255);
    	this.size = new Vector2(1,1);
    	this.formFactor = "RECT";
		this.velocity = new Vector2(0,0);
		this.friction = 2;
	}
	
	update(){
		let dt = deltaTime/1000;
		let ratio = 1/(1+(dt*this.friction));
		this.velocity =  this.velocity.multiplyScalar(ratio)
		this.position = this.position.add(this.velocity.multiplyScalar(dt));
		push();
		this.color.setColor();
		
		if(this.parent){
			translate(this.parent.position.x, this.parent.position.y);
			rotate(this.parent.rotation);
		}
		translate(this.position.x,this.position.y);
		rotate(this.rotation);
		switch(this.formFactor){
			case "RECT":
				rect(this.pivot.x,this.pivot.y,this.size.x,this.size.y);
				break;
			case "ELLIPSE":
				ellipse(this.pivot.x,this.pivot.y,this.size.x,this.size.y);
				break;
		}
		
		pop();
	}
	addForce(force){
		this.velocity = this.velocity.add(force)
	}
}

class Bullet extends GameObject {
	constructor(timeToLive){
		super();
		this.timeToLive = timeToLive;
		this.ticker = 0;
		this.setParent(ROOT);
	}
	update(){
		super.update();
		this.ticker += getDelta();
		if(this.ticker >= this.timeToLive){
			ROOT.removeChild(this);
		}
	}
}

class Player extends GameObject {
	constructor(){
		super();
		this.speed = 10;

		this.fireRate = .1;
		this.fireTicker = 0;
		this.canFire = true;

		this.knockBack = .1;		
		this.bulletSpeed = 2000;
		this.bulletLife = .5;

		this.muzzle;
	}
	update(){
		super.update();
		this.fireTicker += getDelta();
		if(this.fireTicker > this.fireRate) this.canFire = true;
		super.update();
		this.rotation = atan2(mouseY - this.position.y, mouseX - this.position.x)
		if(input.getKeyDown(87)){
			//w
			this.velocity.y -= this.speed;
		}if (input.getKeyDown(83)){
			//s
			this.velocity.y += this.speed;
		}if (input.getKeyDown(65)){
			//a
			this.velocity.x -= this.speed;
		}if (input.getKeyDown(68)){
			//d
			this.velocity.x += this.speed;
		}
		if(input.getMouseButtonDown(0)){
			this.fire();
		}
	}
	fire(){
		if(this.canFire){
			this.fireTicker = 0;
			this.canFire = false;
		}else{
			return;
		}
		let proj = new Bullet(.5);
		proj.position = this.position;
		
		proj.size.x = 40;
		proj.size.y = 15;
		proj.rotation = this.rotation;
		proj.pivot = this.muzzle.position;
		proj.formFactor = "ELLIPSE";
		proj.color = new Color(255,0,0,255)
		if(this.muzzle){
			proj.velocity = new Vector2(cos(proj.rotation), sin(proj.rotation)).multiplyScalar(this.bulletSpeed)//this.muzzle.getGlobalPosition().sub(input.mousePos).normalize().multiplyScalar(-1000);
			this.addForce(proj.velocity.multiplyScalar(-this.knockBack))
		}
		proj.friction = 0;
	}
}

function drawChildren(item){
	item.children.forEach(child => {
		child.update();
		drawChildren(child);
	});
}

function drawObjects(){
	drawChildren(ROOT);
}