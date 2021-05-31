var socket = null;
var clientId = null;
var connected = false;

function establishSocketConnection(serverUrl){
	socket = io(serverUrl);
	connected = true;
	return socket;
}
