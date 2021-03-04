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
  const repoLancamentos = new RestRepository(apiUrl, '/alunos');
  return repoLancamentos.delete(req.params.id);
}

exports.insertAluno = async (req, h) => {
  const db = req.server.plugins['hapi-mongodb'].db;
  const repositorioAluno = new AlunosRepository(db);
  const repoAlunosCursos = new MongoDbRepository(db, 'alunos_cursos');

  const respostaInsert = await repositorioAluno.insertAluno(req.payload);
  const respostaAlunosCursos = await repoAlunosCursos.insert({'id_curso':'1','id_aluno':respostaInsert.id});

  return {
    'id_aluno':respostaInsert.id,
    'objetoAluno':respostaInsert.objetoCriado,
    'id_relacaoAlunoCurso':respostaAlunosCursos._id,
    'objetoCurso': respostaAlunosCursos};
}

exports.listAluno = async (req, h) => {
  const db = req.server.plugins['hapi-mongodb'].db;
  const repositorio = new AlunosRepository(db);
  return repositorio.list();
}

exports.deleteAluno = async (req,h)=>{
  const db = req.server.plugins['hapi-mongodb'].db;
  const repositorio = new AlunosRepository(db);
  console.log("ID que recebemos da req: "+req.params.id);
  return repositorio.delete(req.params.id);
}


