var socket = io("https://TopDownShooterServer.frederikdavidso.repl.co");

var events = [];

class NetworkEvent {
	constructor(name){
		this.name = name;
		events.push(this);
	}
	fire(data){
		socket.emit(this.name,data)
	}
}

function registerEvents(){
	socket.emit('EVENT_REGISTER', events);
}