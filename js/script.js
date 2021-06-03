let defaultGun = new Gun(.1, 2000, .01, 1);
//fireRate, bulletSpeed, kick, bulletLife
defaultGun.size = new Vector2(80,20);
defaultGun.position = new Vector2(50,0);
defaultGun.color = new Color(100,100,100);
let player = new Player(defaultGun.clone());
player.setParent(ROOT);
//let inputManager = new InputManager();
//inputManager.connec

let testUi = new TextButton("UI Test");
testUi.position = new UDIM(.5,0,0.5,0);
testUi.size = new UDIM(.25,0,.25,0);

function connectToServer(url){
	var username = prompt("Enter a name");
	if(!username) username ='No Name';

	establishSocketConnection("https://TopDownShooterServer.frederikdavidso.repl.co");

	socket.on('setupRequest', ()=>{
		socket.emit('setupResponse', {username: username});
		clientId = socket.id;
	});
	
	socket.on('join', (data)=>{
		if(data.id != clientId){
			let plr = new ReplicatedPlayer(defaultGun.clone(), data.id, data.username);
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
		if(data.player.id == clientId){
			player.position = new Vector2(50,5);
		}
	})
	
	socket.on('projectile',(data)=>{
		if(data.plrId == clientId) return;
		let proj = new Bullet(data.lifeTime);
		proj.formFactor = "ELLIPSE";
		proj.position = new Vector2(data.position.x, data.position.y);
		proj.size = new Vector2(20,20);
		proj.color = new Color(0,255,0);
		proj.active = false;
		proj.velocity = new Vector2(data.velocity.x, data.velocity.y);
		proj.friction = 0;
		proj.setParent(ROOT);
	})

	window.setInterval(()=>{
		socket.emit('move', {position: player.position, rotation: player.rotation});
	}, 33.3334);

	window.addEventListener("beforeunload", function(){
		socket.emit('leave');
	});
}

function setup(){
	connectToServer('https://topdownshooterserver.frederikdavidso.repl.co/%27')
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
	background(255);
	drawObjects();
	testUi.update();
	//plr.addForce(new Vector2(1,1))
}

function windowResized() {
	resizeCanvas(window.innerWidth, window.innerHeight);
}
