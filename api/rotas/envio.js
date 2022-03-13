const roteador = require('express').Router();

roteador.use('/',(req, res) => {
	const body = req.body;

	if (body.mensagem == undefined){
		res.status(400).send("mensagem não informada");
		return
	}else if (body.telefone == undefined){
		res.status(400).send("telefone não informado");
		return
	}

	client
	.sendText('55' + body.telefone + '@c.us', body.mensagem)
	.then((result) => { console.log('localização enviada com sucesso')})
	.catch((erro) => { console.error('Error when sending: ', erro) })

	res.send('Mensagem enviada com sucesso');
})

module.exports = roteador;