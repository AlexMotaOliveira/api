const RestRepository = require('../repositories/rest/RestRepository.js');
const { MongoClient, ObjectId } = require('mongodb');
const MongoDbRepository = require('../repositories/MongoDbRepository.js');
const NotasRepository = require('../repositories/NotasRepository.js');


const apiUrl = 'http://localhost:3000';

exports.insertNota = async (req, h) => {
  const db = req.server.plugins['hapi-mongodb'].db;
  const repositorioNota = new NotasRepository(db);
  const repoDisciplina = new MongoDbRepository(db, 'disciplinas');
  const repoAluno = new MongoDbRepository(db, 'alunos');

  const respostaDisciplina = await repoDisciplina.get({'codigo':req.payload.disciplina});
  const respostaAluno = await repoAluno.get({'matricula':parseInt(req.params.matricula)});

  if(!respostaDisciplina || !respostaAluno ){
    throw "Erro: Disciplina ou matricula não localizada"
  }

  const respostaNota = await repositorioNota.list({'aluno':respostaAluno._id});

  
  if(respostaNota){// Verificar com Gustavo esse throw
    respostaNota.forEach(nota => {
      if (nota.disciplina.equals(respostaDisciplina._id)  && nota.aluno.equals(respostaAluno._id)) {
        throw 'Erro : Essa nota já está cadastrada para esse(a) aluno(a)';// tratar erro
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
