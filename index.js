const venom = require('venom-bot');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('config');

venom
	.create(
		config.get("whatsApp.nomeSessao"),
		(base64Qr, asciiQR, attempts, urlCode) => {
			console.log(asciiQR); // Optional to log the QR in the terminal
			var matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
				response = {};
		
			if (matches.length !== 3) {
				return new Error('Invalid input string');
			}
			response.type = matches[1];
			response.data = new Buffer.from(matches[2], 'base64');
		
			var imageBuffer = response;
			require('fs').writeFile(
				'./tokens/' + config.get("whatsApp.nomeSessao") + '/' + config.get("api.imagemQrCode") + '.png',
				imageBuffer['data'],
				'binary',
				function (err) {
					if (err != null) {
						console.log(err);
					}
				}
			);
		},
		(statusSession, session) => {
			// return: isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken
			console.log('Status Session: ', statusSession);
			// create session wss return "serverClose" case server for close
			console.log('Session name: ', session);
		},
		{
			logQR: false,
			disableSpins: true,
			disableWelcome: true
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
