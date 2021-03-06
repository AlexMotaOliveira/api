const RestRepository = require('../repositories/RestRepository.js');
const { MongoClient, ObjectId } = require('mongodb');
const MongoDbRepository = require('../repositories/MongoDbRepository.js');
const CursosRepository = require('../repositories/CursosRepository.js');


const apiUrl = 'http://localhost:3000';

exports.insertCurso = async (req, h) => {
  const db = req.server.plugins['hapi-mongodb'].db;
  const repositorioCursos = new CursosRepository(db);
  //const repoAlunosCursos = new MongoDbRepository(db, 'alunos_cursos');

  const respostaInsert = await repositorioCursos.insertCurso(req.payload);
  //const respostaAlunosCursos = await repoAlunosCursos.insert({'id_curso':respostaInsert.id,'id_aluno':'1'});

  return {
    'id_curso':respostaInsert.id,
    'objetoCurso':respostaInsert.objetoCriado};
}

exports.listCurso = async (req, h) => {
  const db = req.server.plugins['hapi-mongodb'].db;
  const repositorio = new CursosRepository(db);
  return repositorio.list();
}

exports.getCurso = async (req, h) => {
  const db = req.server.plugins['hapi-mongodb'].db;
  const repositorio = new CursosRepository(db);
  return repositorio.getById(req.params.id);
}

exports.deleteCurso = async (req,h)=>{
  const db = req.server.plugins['hapi-mongodb'].db;
  const repositorio = new CursosRepository(db);
  return repositorio.delete(req.params.id);
}


exports.updateCurso = async (req, h) => {
  const db = req.server.plugins['hapi-mongodb'].db;
  const repositorioCursos = new CursosRepository(db);
  const respostaInsert = await repositorioCursos.update(req.params.id,req.payload);

  return {
    'linhas_modificadas':respostaInsert.modifiedCount,
    'objetoCurso':req.payload
  }
}

