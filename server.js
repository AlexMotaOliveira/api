const Hapi = require('@hapi/hapi');
const rotas = require('./routes.js');
const AutorizacaoMiddleware = require('./middlewares/AutorizacaoMiddleware.js');
const MongoDbMiddleware = require('./middlewares/MongoDBMiddleware.js');
const swaggered = require('hapi-swaggered');
const swaggeredUI = require('hapi-swaggered-ui');
const vision = require('vision');
const inert = require('inert');

(async function() {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost'
  });

  //await AutorizacaoMiddleware(server);
  await MongoDbMiddleware(server);

 

  rotas.forEach(rota => server.route(rota));

  await server.start();
  console.log('Nosso servidor está rodando e esperando requisições!', server.info.uri);

})()



