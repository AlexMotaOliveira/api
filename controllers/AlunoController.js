const RestRepository = require('../repositories/RestRepository.js');
const { MongoClient, ObjectId } = require('mongodb');
const MongoDbRepository = require('../repositories/MongoDbRepository.js');
const AlunosRepository = require('../repositories/AlunosRepository.js');


const apiUrl = 'http://localhost:3000';

exports.inserirAluno = async (req, h) => {
  const repoLancamentos = new RestRepository(apiUrl, '/aluno');
  return repoLancamentos.insert(lancamento);
}

exports.atualizarLancamento = async (req, h) => {
  const repoLancamentos = new RestRepository(apiUrl, '/lancamentos');
  return repoLancamentos.update(req.params.id, req.payload);
}

exports.apagarLancamento = async (req, h) => {
  const repoLancamentos = new RestRepository(apiUrl, '/lancamentos');
  return repoLancamentos.delete(req.params.id);
}

exports.insertAluno = async (req, h) => {
  const db = req.server.plugins['hapi-mongodb'].db;
  const repositorio = new AlunosRepository(db);
  return repositorio.list();
}
