let obj = new GameObject();
let inputManager = new InputManager();
inputManager.connect();

function setup(){
	createCanvas(window.innerWidth, window.innerHeight);
}

function draw() {
	//obj.velocity = new Vector2(.5,0)
	background(0);
	obj.update();
	obj.size = new Vector2(100,100)
}

function windowResized() {
	resizeCanvas(window.innerWidth, window.innerHeight);
}
