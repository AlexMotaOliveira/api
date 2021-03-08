const RestRepository = require('../repositories/RestRepository.js');
const { MongoClient, ObjectId } = require('mongodb');
const MongoDbRepository = require('../repositories/MongoDbRepository.js');
const AlunosRepository = require('../repositories/AlunosRepository.js');
const CursosRepository = require('../repositories/CursosRepository.js');
const DisciplinasRepository = require('../repositories/DisciplinasRepository.js');


const apiUrl = 'http://localhost:3000';
// TODO: Criar um verificar de "requisitos", para todos os endpoints de POST,PUT e DELETE
exports.insertAluno = async (req, h) => {
  const db = req.server.plugins['hapi-mongodb'].db;
  const repositorioAluno = new AlunosRepository(db);
  const repoAlunosCursos = new MongoDbRepository(db, 'alunos_cursos');// TODO: Criar endpoint para relacionar
  let matricula=0;
  let listaAlunos = await repositorioAluno.list();
  matricula = listaAlunos.reduce((acumulador, aluno)=>{
    debugger;
    return acumulador = (parseInt(aluno.matricula)>acumulador) ? parseInt(aluno.matricula) : acumulador;
  },0)+1;
  debugger;
  matricula = matricula<=1 ? parseInt(new Date().getFullYear().toString()+"0001") : matricula;

  Object.assign(req.payload,{'matricula':matricula});
  const respostaInsert = await repositorioAluno.insertAluno(req.payload);
  //const respostaAlunosCursos = await repoAlunosCursos.insert({'id_curso':'1','id_aluno':respostaInsert.id});

  return {
	'id_aluno':respostaInsert.id,
	'objetoAluno':respostaInsert.objetoCriado
	};
}

exports.listAluno = async (req, h) => {
  const db = req.server.plugins['hapi-mongodb'].db;
  const repositorio = new AlunosRepository(db);
  return repositorio.list();
}

exports.getAluno = async (req, h) => {
  const db = req.server.plugins['hapi-mongodb'].db;
  const repositorio = new AlunosRepository(db);
  return repositorio.getById(req.params.id);
}

exports.deleteAluno = async (req,h)=>{
  const db = req.server.plugins['hapi-mongodb'].db;
  const repositorio = new AlunosRepository(db);
  console.log("ID que recebemos da req: "+req.params.id);
  return repositorio.delete(req.params.id);// Verificar com Gustavo o STATUS
}


exports.updateAluno = async (req, h) => {
  const db = req.server.plugins['hapi-mongodb'].db;
  const repositorioAluno = new AlunosRepository(db);
  const respostaInsert = await repositorioAluno.update(req.params.id,req.payload);

  return {
	'linhas_modificadas':respostaInsert.modifiedCount,
	'objetoAluno':req.payload
  };// Verificar com Gustavo o Status
}

exports.relacionarAlunoCurso = async (req,h)=>{//localhost/api/v1/aluno/{matricula_aluno}/curso/{codigo_curso}
  const db = req.server.plugins['hapi-mongodb'].db;
  const repositorioCursos = new CursosRepository(db);
  const repositorioAluno = new AlunosRepository(db);
  const repoAlunosCursos = new MongoDbRepository(db, 'alunos_cursos');


  let resultadoAluno = await repositorioAluno.get({"matricula":parseInt(req.params.matricula_aluno)});// verificar se é null ou não
  let resultadoCurso = await repositorioCursos.get({"codigo":req.params.codigo_curso});

  if(!resultadoAluno || !resultadoCurso ){
    throw "Erro: curso ou matricula não localizada"
  }

  let respostaAlunosCursos = await repoAlunosCursos.get({'id_curso':resultadoCurso._id,'id_aluno':resultadoAluno._id});

  if(respostaAlunosCursos){
    throw "Erro: Essa relação já existe"
  }

  const respostaInsert= await repoAlunosCursos.insert({'id_curso':resultadoCurso._id,'id_aluno':resultadoAluno._id});

  return{
	'id_curso':respostaInsert.insertedCount,
	'objetoCurso':respostaInsert.ops}
}

exports.relacionarAlunoDisciplina = async (req,h)=>{//localhost/api/v1/aluno/{matricula_aluno}/curso/{codigo_curso}/disciplina/{codigo_disciplina}
  const db = req.server.plugins['hapi-mongodb'].db;
  const repositorioCursos = new CursosRepository(db);
  const repositorioAluno = new AlunosRepository(db);
  const repositorioDisciplina = new DisciplinasRepository(db);
  const repoAlunosCursos = new MongoDbRepository(db, 'alunos_cursos');
  const repoAlunosDisciplinas = new MongoDbRepository(db, 'alunos_disciplinas');


  let resultadoAluno = await repositorioAluno.get({"matricula":parseInt(req.params.matricula_aluno)});
  let resultadoCurso = await repositorioCursos.get({"codigo":req.params.codigo_curso});
  let resultadoDisciplina = await repositorioDisciplina.get({'codigo':req.params.codigo_disciplina});// TODO: criar relação de Curso Disciplina

  if(!resultadoAluno || !resultadoCurso || !resultadoDisciplina ){
    throw "Erro: curso, matricula ou disciplina não localizada"
  }

  let resultadoAlunoCurso = await repoAlunosCursos.get({'id_aluno':resultadoAluno._id,'id_curso':resultadoCurso._id}) 

  if(!resultadoAlunoCurso){
    throw "Erro: Aluno não matriculado no curso"
  }

  let resultadoAlunoDisciplina = await repoAlunosDisciplinas.get({'id_alunoCurso':resultadoAlunoCurso._id,'id_disciplina':resultadoDisciplina._id});

  if(!resultadoAlunoDisciplina){
    throw "Erro: Relacionamento já existente"
  }

  const respostaAlunosDisciplinas = await repoAlunosDisciplinas.insert({'id_alunoCurso':resultadoAlunoCurso._id,'id_disciplina':resultadoDisciplina._id});

  return{
	'id_curso':respostaAlunosDisciplinas.insertedCount,
	'objetoCurso':respostaAlunosDisciplinas.ops}
}

exports.desrelacionarAlunoCurso = async (req,h)=>{//localhost/api/v1/aluno/{matricula_aluno}/curso/{codigo_curso}
  const db = req.server.plugins['hapi-mongodb'].db;
  const repositorioCursos = new CursosRepository(db);
  const repositorioAluno = new AlunosRepository(db);
  const repoAlunosCursos = new MongoDbRepository(db, 'alunos_cursos');


  let resultadoAluno = await repositorioAluno.get({"matricula":parseInt(req.params.matricula_aluno)});// verificar se é null ou não
  let resultadoCurso = await repositorioCursos.get({"codigo":req.params.codigo_curso});

  if(!resultadoAluno || !resultadoCurso ){
    throw "Erro: curso ou matricula não localizada"
  }

  let respostaAlunosCursos = await repoAlunosCursos.get({'id_curso':resultadoCurso._id,'id_aluno':resultadoAluno._id});

  if(!respostaAlunosCursos){
    throw "Erro: Essa relação não existe"
  } 

  return  await repoAlunosCursos.delete(respostaAlunosCursos._id.toString());
}

exports.desrelacionarAlunoDisciplina = async (req,h)=>{//localhost/api/v1/aluno/{matricula_aluno}/curso/{codigo_curso}/disciplina/{codigo_disciplina}
  const db = req.server.plugins['hapi-mongodb'].db;
  const repositorioCursos = new CursosRepository(db);
  const repositorioAluno = new AlunosRepository(db);
  const repositorioDisciplina = new DisciplinasRepository(db);
  const repoAlunosCursos = new MongoDbRepository(db, 'alunos_cursos');
  const repoAlunosDisciplinas = new MongoDbRepository(db, 'alunos_disciplinas');


  let resultadoAluno = await repositorioAluno.get({"matricula":parseInt(req.params.matricula_aluno)});
  let resultadoCurso = await repositorioCursos.get({"codigo":req.params.codigo_curso});
  let resultadoDisciplina = await repositorioDisciplina.get({'codigo':req.params.codigo_disciplina});// TODO: criar relação de Curso Disciplina

  if(!resultadoAluno || !resultadoCurso || !resultadoDisciplina ){
    throw "Erro: curso, matricula ou disciplina não localizada"
  }

  let resultadoAlunoCurso = await repoAlunosCursos.get({'id_aluno':resultadoAluno._id,'id_curso':resultadoCurso._id}) 

  if(!resultadoAlunoCurso){
    throw "Erro: Aluno não matriculado no curso"
  }

  let resultadoAlunoDisciplina = await repoAlunosDisciplinas.get({'id_alunoCurso':resultadoAlunoCurso._id,'id_disciplina':resultadoDisciplina._id});

  if(!resultadoAlunoDisciplina){
    throw "Erro: Relacionamento não existe"
  }

  

  return await repoAlunosDisciplinas.delete(resultadoAlunoDisciplina._id.toString());
}