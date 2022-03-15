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

	req.client
	.sendText('55' + body.telefone + '@c.us', body.mensagem)
	.then((result) => { res.send('Mensagem enviada com sucesso')})
	.catch((erro) => { res.status(erro.status).send(erro.text) })

})

module.exports = roteador;