const RestRepository = require('../repositories/RestRepository.js');
const { MongoClient, ObjectId } = require('mongodb');
const MongoDbRepository = require('../repositories/MongoDbRepository.js');
const NotasRepository = require('../repositories/NotasRepository.js');


const apiUrl = 'http://localhost:3000';

exports.insertNota = async (req, h) => {
  const db = req.server.plugins['hapi-mongodb'].db;
  const repositorioNota = new NotasRepository(db);
  //const repoAlunosCursos = new MongoDbRepository(db, 'alunos_cursos');

  const respostaInsert = await repositorioNota.insertNota(req.payload);
  //const respostaAlunosCursos = await repoAlunosCursos.insert({'id_curso':'1','id_aluno':respostaInsert.id});

  return {
    'id_nota':respostaInsert.id,
    'objetoNota':respostaInsert.objetoCriado
  }
}

exports.listNota = async (req, h) => {
  const db = req.server.plugins['hapi-mongodb'].db;
  const repositorio = new NotasRepository(db);
  return repositorio.list();
}

exports.getNota = async (req, h) => {
  const db = req.server.plugins['hapi-mongodb'].db;
  const repositorio = new NotasRepository(db);
  return repositorio.getById(req.params.id);
}

exports.deleteNota = async (req,h)=>{
  const db = req.server.plugins['hapi-mongodb'].db;
  const repositorio = new NotasRepository(db);
  return repositorio.delete(req.params.id);
}


exports.updateNota = async (req, h) => {
  const db = req.server.plugins['hapi-mongodb'].db;
  const repositorioNota = new NotasRepository(db);
  const respostaInsert = await repositorioNota.update(req.params.id,req.payload);

  return {
    'linhas_modificadas':respostaInsert.modifiedCount,
    'objetoNota':req.payload
  }
}

