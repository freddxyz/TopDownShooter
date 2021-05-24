var socket = io("https://TopDownShooterServer.frederikdavidso.repl.co");

let plr = new Player();
plr.setParent(ROOT);
let gun = new GameObject();
let helmet = new GameObject();
helmet.setParent(plr);
gun.setParent(plr);
//let inputManager = new InputManager();
//inputManager.connect();

var clientId = 0;

window.setInterval(()=>{
	socket.emit('move', {position: plr.position});
}, 33.3334);

socket.on('setupRequest', ()=>{
	socket.emit('setupResponse', {username: username});
	clientId = socket.id;
});

socket.on('join', (data)=>{
	if(data.id != clientId){
		let plr = new ReplicatedPlayer(data.id, data.username);
	}
});

socket.on('move', (data)=>{
	if(data.player.id == clientId) return;
	var inList = false;
	players.forEach((plr)=>{
		if(plr.id == data.player.id){
			plr.position.x = data.position.x;
			plr.position.y = data.position.y;
			//console.log('found it');
			inList = true;
			return;
		}
	});
	if(inList) return;
	console.log('made new player', data.player.username);
	let plr = new ReplicatedPlayer(data.player.id, data.player.username);
});

socket.on('leave', (data)=>{
	console.log('someone left')
	if(data.player.id == clientId){
		alert('disconnected, reloading the page')
		location.reload();
	};
	players.forEach((plr)=>{
		if(plr.id == data.player.id){
			var i = players.indexOf(plr);
			players.splice(i,1);
			ROOT.removeChild(plr);
			return;
		}
	});
});

socket.on('checkup', ()=>{
	socket.emit('checkup');
});

var username = prompt("Enter a name");

window.addEventListener("beforeunload", function(){
	socket.emit('leave');
});




function setup(){
	textAlign(CENTER);
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
