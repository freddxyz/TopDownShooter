var socket = io("https://TopDownShooterServer.frederikdavidso.repl.co");
let defaultGun = new Gun(.01, 1000, .1, .5);
defaultGun.size = new Vector2(80,20);
defaultGun.position = new Vector2(50,0);
defaultGun.color = new Color(100,100,100);
let player = new Player(defaultGun.clone());
console.log(player.gun)
player.setParent(ROOT);
//let inputManager = new InputManager();
//inputManager.connect();

var clientId = 0;

window.setInterval(()=>{
	socket.emit('move', {position: player.position, rotation: player.rotation});
}, 33.3334);

socket.on('setupRequest', ()=>{
	socket.emit('setupResponse', {username: username});
	clientId = socket.id;
});

socket.on('join', (data)=>{
	if(data.id != clientId){
		console.log(defaultGun);
		let plr = new ReplicatedPlayer(defaultGun.clone(), data.id, data.username);
		console.log(plr.username);
	}
});

socket.on('move', (data)=>{
	if(data.player.id == clientId) return;
	var inList = false;
	players.forEach((plr)=>{
		if(plr.id == data.player.id){
			plr.position.x = data.position.x;
			plr.position.y = data.position.y;
			plr.rotation = data.rotation;
			inList = true;
			return;
		}
	});
	if(inList) return;
	console.log('made new player', data.player.username);
	let plr = new ReplicatedPlayer(defaultGun.clone(), data.player.id, data.player.username);
});

socket.on('leave', (data)=>{
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

socket.on('playerKilled', (data)=>{
	console.log('playerKilled');
	if(data.player.id == clientId){
		player.position = new Vector2(0,0);
	}
})

var username = prompt("Enter a name");
if(!username) username ='No Name';


window.addEventListener("beforeunload", function(){
	socket.emit('leave');
});




function setup(){
	textAlign(CENTER);
	rectMode(CENTER);
	noStroke();
	createCanvas(window.innerWidth, window.innerHeight);
	
	player.color = new Color(255,255,0,255);
	player.size = new Vector2(100,100);
	player.formFactor = "ELLIPSE";

	player.friction = 7;
	player.speed = 50;
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
