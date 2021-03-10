const RestRepository = require('../repositories/rest/RestRepository.js');
const { MongoClient, ObjectId } = require('mongodb');
const MongoDbRepository = require('../repositories/MongoDbRepository.js');
const CursosRepository = require('../repositories/CursosRepository.js');
const DisciplinasRepository = require('../repositories/DisciplinasRepository.js');


const apiUrl = 'http://localhost:3000';

exports.insertCurso = async (req, h) => {
  const db = req.server.plugins['hapi-mongodb'].db;
  const repositorioCursos = new CursosRepository(db);
  
  const respostaInsert = await repositorioCursos.insertCurso(req.payload);


  return{
    'id_curso':respostaInsert.id,
    'objetoCurso':respostaInsert.objetoCriado
  }
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
  };
}

exports.relacionarCursoDisciplina = async (req,h) =>{//localhost/api/v1/curso/{codigo_curso}/disciplina/{codigo_disciplina}
  const db = req.server.plugins['hapi-mongodb'].db;
  const repositorioCursos = new CursosRepository(db);
  const repositorioDisciplinas = new DisciplinasRepository(db);
  const repoDisciplinasCursos = new MongoDbRepository(db, 'disciplinas_cursos');
  

  let respostaCurso = await repositorioCursos.get({'codigo':req.params.codigo_curso});
  let respostaDisciplina = await repositorioDisciplinas.get({'codigo':req.params.codigo_disciplina});

  if (!respostaCurso|| !respostaDisciplina) {
    throw "Erro: Curso ou disciplina não encontrada";
  }

  let respostaCursoDisciplina = await repoDisciplinasCursos.get({'id_curso':respostaCurso._id,'id_disciplina':respostaDisciplina._id});

  if(respostaCursoDisciplina){
    throw "Erro: Essa relação já existe"
  }

  let respostaInsert = await repoDisciplinasCursos.insert({'id_curso':respostaCurso._id,'id_disciplina':respostaDisciplina._id});

  return{
    'id_curso':respostaInsert.id,
    'objetoCurso':respostaInsert.objetoCriado
  }
}

exports.desrelacionarCursoDisciplina = async (req,h) =>{//localhost/api/v1/curso/{codigo_curso}/disciplina/{codigo_disciplina}
  const db = req.server.plugins['hapi-mongodb'].db;
  const repositorioCursos = new CursosRepository(db);
  const repositorioDisciplinas = new DisciplinasRepository(db);
  const repoDisciplinasCursos = new MongoDbRepository(db, 'disciplinas_cursos');
  

  let respostaCurso = await repositorioCursos.get({'codigo':req.params.codigo_curso});
  let respostaDisciplina = await repositorioDisciplinas.get({'codigo':req.params.codigo_disciplina});

  if (!respostaCurso|| !respostaDisciplina) {
    throw "Erro: Curso ou disciplina não encontrada";
  }

  let respostaCursoDisciplina = await repoDisciplinasCursos.get({'id_curso':respostaCurso._id,'id_disciplina':respostaDisciplina._id});

  if(!respostaCursoDisciplina){
    throw "Erro: Essa relação não existe"
  }


  return  await repoDisciplinasCursos.delete(respostaCursoDisciplina._id.toString());
}
