const Service = require('node-windows').Service;
const path = require('path');
const config = require('config');
const argv = process.argv;

var svc = new Service({
	name: config.get('servico.nome'),
	description: config.get('servico.descricao'),
	script: path.join(__dirname,config.get('servico.arquivo'))
})


if (argv[2] === 'instalar'){
	svc.on('install',function(){
		console.log('instalalação efetuada com sucesso.');
	});

	svc.install();

}else if (argv[2] === 'desinstalar'){
	svc.on('uninstall',function(){
		console.log('Desinstalação efetuada com sucesso.');
	});

	svc.uninstall();

}
