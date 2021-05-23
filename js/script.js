let plr = new Player();
plr.setParent(ROOT);
let gun = new GameObject();
let helmet = new GameObject();
helmet.setParent(plr);
gun.setParent(plr);
//let inputManager = new InputManager();
//inputManager.connect();

function setup(){
	rectMode(CENTER);
	noStroke();
	createCanvas(window.innerWidth, window.innerHeight);
	
	plr.color = new Color(255,255,0,255);
	plr.size = new Vector2(100,100);
	plr.formFactor = "ELLIPSE";

	plr.friction = 7;
	plr.speed = 50;

	plr.knockBack = .05;
	plr.fireRate = .05;
	plr.bulletLife = .5;
	plr.bulletSpeed = 2000;

	plr.muzzle = gun;

	gun.size = new Vector2(80,20);
	gun.position.x = 50;
	gun.position.y = 0;
	gun.color = new Color(128,128,128);
	gun.formFactor = "RECT"

	helmet.size = new Vector2(50,50);
	helmet.color = new Color(200,200,200);
	helmet.formFactor = "ELLIPSE";
}

function draw() {
	//plr.velocity = new Vector2(.5,0)
	background(0);
	drawObjects();
	//plr.addForce(new Vector2(1,1))
}

function windowResized() {
	resizeCanvas(window.innerWidth, window.innerHeight);
}
