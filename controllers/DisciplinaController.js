const RestRepository = require('../repositories/RestRepository.js');
const { MongoClient, ObjectId } = require('mongodb');
const MongoDbRepository = require('../repositories/MongoDbRepository.js');
const DisciplinasRepository = require('../repositories/DisciplinasRepository.js');


const apiUrl = 'http://localhost:3000';

exports.insertDisciplina = async (req, h) => {
  const db = req.server.plugins['hapi-mongodb'].db;
  const repositorioDisciplina = new DisciplinasRepository(db);
  //const repoAlunosCursos = new MongoDbRepository(db, 'alunos_cursos');

  const respostaInsert = await repositorioDisciplina.insertDisciplina(req.payload);
  //const respostaAlunosCursos = await repoAlunosCursos.insert({'id_curso':'1','id_aluno':respostaInsert.id});

  return {
    'id_disciplina':respostaInsert.id,
    'objetoDisciplina':respostaInsert.objetoCriado
  }
}

exports.listDisciplina = async (req, h) => {
  const db = req.server.plugins['hapi-mongodb'].db;
  const repositorio = new DisciplinasRepository(db);
  return repositorio.list();
}

exports.getDisciplina = async (req, h) => {
  const db = req.server.plugins['hapi-mongodb'].db;
  const repositorio = new DisciplinasRepository(db);
  return repositorio.getById(req.params.id);
}

exports.deleteDisciplina = async (req,h)=>{
  const db = req.server.plugins['hapi-mongodb'].db;
  const repositorio = new DisciplinasRepository(db);
  return repositorio.delete(req.params.id);
}


exports.updateDisciplina = async (req, h) => {
  const db = req.server.plugins['hapi-mongodb'].db;
  const repositorioDisciplina = new DisciplinasRepository(db);
  const respostaInsert = await repositorioDisciplina.update(req.params.id,req.payload);

  return {
    'linhas_modificadas':respostaInsert.modifiedCount,
    'objetoDisciplina':req.payload
  }
}

