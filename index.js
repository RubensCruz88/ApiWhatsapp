const venom = require('venom-bot');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('config');

venom
	.create(
		config.get("whatsApp.nomeSessao"),
		undefined,
		(statusSession, session) => {
			// return: isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken
			console.log('Status Session: ', statusSession);
			// create session wss return "serverClose" case server for close
			console.log('Session name: ', session);
		},
		undefined,
		{
			headless: false,
			useChrome: true,
			logQR: false
		}
	)
	.then((client) => start(client))
	.catch((error) => console.log(error));


function start(client) {
	const roteador = require('./api/rotas/envio');

	app.use(bodyParser.json());

	//adicionamos o objeto client na requisição
	app.use( (req, res, next) => {
		req.client = client;
		next();
	})

	app.listen(config.get('api.porta'), () => console.log('A Api está funcionando'));

	app.use('/api/envio',roteador);

	app.post('/mensagem',(req, res) => {
		const body = req.body;
	
		if (body.mensagem == undefined){
			res.status(400).send("mensagem não informada");
			return
		}else if (body.telefone == undefined){
			res.status(400).send("telefone não informado");
			return
		}
	
	});

	// In case of being logged out of whatsapp web
	// Force it to keep the current session
	// State change
	client.onStateChange((state) => {
		console.log(state);
		const conflits = [
		venom.SocketState.CONFLICT,
		venom.SocketState.UNPAIRED,
		venom.SocketState.UNLAUNCHED,
		];
		if (conflits.includes(state)) {
		client.useHere();
		}
	});

	// Catch ctrl+C
	process.on('SIGINT', function() {
		client.close();
	});

}
