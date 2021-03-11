const RestRepository = require('../repositories/rest/RestRepository.js');
const { MongoClient, ObjectId } = require('mongodb');
const fetch = require('node-fetch');
const MongoDbRepository = require('../repositories/MongoDbRepository.js');
const NotasRepository = require('../repositories/NotasRepository.js');
const AlunosRepository = require('../repositories/AlunosRepository.js');
const DisciplinaRepository = require('../repositories/DisciplinasRepository.js');
const CursosRepository = require('../repositories/CursosRepository.js');

const apiUrl = 'http://localhost:3000';

exports.insertNota = async (req, h) => {
  const db = req.server.plugins['hapi-mongodb'].db;
  const repositorioNota = new NotasRepository(db);
  const repoDisciplina = new MongoDbRepository(db, 'disciplinas');
  const repoAluno = new MongoDbRepository(db, 'alunos');

  const respostaDisciplina = await repoDisciplina.get({'codigo':req.payload.disciplina});
  const respostaAluno = await repoAluno.get({'matricula':parseInt(req.params.matricula)});

  if(!respostaDisciplina || !respostaAluno ){
    return h.response("Erro: Disciplina ou matricula não localizada").code(404);
  }

  const respostaNota = await repositorioNota.list({'aluno':respostaAluno._id});


  if(respostaNota){
    respostaNota.forEach(nota => {
      if (nota.disciplina.equals(respostaDisciplina._id)  && nota.aluno.equals(respostaAluno._id) && nota.tipoNota === req.payload.tipoNota) {
        return h.response("Erro : Essa nota já está cadastrada para esse(a) aluno(a)").code(400);
      }
    });
  }

  req.payload.disciplina= respostaDisciplina._id;
  Object.assign(req.payload,{'aluno':respostaAluno._id});
  const respostaInsert = await repositorioNota.insertNota(req.payload);

  return {
    'id_nota':respostaInsert.id,
    'objetoNota':respostaInsert.objetoCriado
  }
}

exports.listNota = async (req, h) => {
  const db = req.server.plugins['hapi-mongodb'].db;
  const repositorioAluno = new AlunosRepository(db);
  let listaDeAlunos = await repositorioAluno.list();
  let resposta =[];
  let teste;
  for (let index = 0; index < listaDeAlunos.length; index++) {

    teste= await   fetch(apiUrl+`/api/v1/notas/aluno/${listaDeAlunos[index].matricula}`)
    .then((data)=> {
      return data
    })
    .catch((error)=> {
      console.log(error)
    });
    resposta.push(await teste.json());
  }
  return resposta;
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

exports.verificarMedia = async (req,h)=> {
  const db = req.server.plugins['hapi-mongodb'].db;
  const repositorioNota = new NotasRepository(db);
  const repositorioAluno = new AlunosRepository(db);
  const repositorioDisciplina = new DisciplinaRepository(db);
  const repositorioCursos = new CursosRepository(db);
  const repoAlunosDisciplinas = new MongoDbRepository(db, 'alunos_disciplinas');
  const repoAlunosCurso = new MongoDbRepository(db, 'alunos_cursos');
 

  const respostaAluno = await repositorioAluno.get({'matricula':parseInt(req.params.matricula)});
  const respostaAlunosCursos = await repoAlunosCurso.get({'id_aluno':respostaAluno._id});
  const respostaCurso = await repositorioCursos.get({'_id':respostaAlunosCursos.id_curso})
  let respostaAlunosDisciplinas = await repoAlunosDisciplinas.list({'id_alunoCurso':respostaAlunosCursos._id});

  const respostaNota = await repositorioNota.list({'aluno':respostaAluno._id});
  const listaDeDisciplinas = await repositorioDisciplina.list();

  let retorno ={};

  let disciplinas=[];

  respostaAlunosDisciplinas.forEach(disciplina => {
    let nomeDisciplina;
    let vetorNotas;
    let media;
    listaDeDisciplinas.forEach(nomes=>{
      if(nomes._id.equals(disciplina.id_disciplina)){
        nomeDisciplina = nomes.disciplina;
      }
      vetorNotas=respostaNota.reduce((acumulador,nota)=>{
        if (nota.disciplina.equals(disciplina.id_disciplina)) {
          acumulador.push({'tipoNota':nota.tipoNota,'valorNota':nota.valorNota});
        }
        return acumulador
      },[])
    })
    media = (vetorNotas.reduce((a,n)=>{return a+n.valorNota},0)/vetorNotas.length);

    disciplinas.push({
      'nomeDisciplina': nomeDisciplina,
      'media': media,
      'status': media>=6 ? 'Aprovado' : 'Reprovado',
      'notas':vetorNotas})
  });


  retorno = {
    'nome':respostaAluno.nome,
    'matricula':respostaAluno.matricula,
    'curso':respostaCurso.curso,
    'disciplinas':disciplinas
  }

  return retorno;
}



async function buscarNotaAluno(matricula) {
  fetch(apiUrl+`/api/v1/notas/aluno/${matricula}`)
    .then((data)=> {
      return data
    })
    .catch((error)=> {
      console.log(error)
    });
}

