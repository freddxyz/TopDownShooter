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

class InputManager {
	constructor(){
		this.keysDown = {};
	}
	connect(){
		document.addEventListener('keydown', this.onKeyDown)
		document.addEventListener('keyup', this.onKeyUp);
	}
	onKeyDown(evnt){
		console.log(this.keysDown)
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
		}else{
			return false;
		} 
	}
}

class GameObject {
	constructor(){
		this.position = new Vector2(0,0);
    	this.size = new Vector2(1,1);
    	this.formFactor = "Rectangle";
		this.velocity = new Vector2(100,100);
		this.rotation = 0;
		this.friction = 2;
	}
	update(){
		rect(this.position.x,this.position.y,this.size.x,this.size.y);
		let dt = deltaTime/1000;
		let ratio = 1/(1+(dt*this.friction));
		this.velocity =  this.velocity.multiplyScalar(ratio)
		this.position = this.position.add(this.velocity.multiplyScalar(dt));
	}
	addforce(force){
		this.velocity = this.velocity.add(force)
	}
}

class Player extends GameObject {
	constructor(){
		super()
	}
}