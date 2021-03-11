const MongoDbRepository = require('../MongoDbRepository.js');


// TODO: Migrar as regras de negocios para o Repository
class AlunosRepository extends MongoDbRepository {
  constructor(db) {
	super(db, 'alunos');
  }

  async insertAluno(body) {
	// METODO PARA GERAR MATRICULA AQUI()
	const resultado = await this.collection.insertOne(body);
	return {
    'linhas':resultado.insertedCount,
    'id':resultado.insertedId,
    'objetoCriado':resultado.ops
  };
  }

  async listAlunos(){
    const resultado = await this.collection.list();
    return {'status':'OK','resultado':resultado.toarray()}
  }

  async criarAluno(body) {
    let matricula=0;
    let listaAlunos = await this.list();
    matricula = listaAlunos.reduce((acumulador, aluno)=>{
      return acumulador = (parseInt(aluno.matricula)>acumulador) ? parseInt(aluno.matricula) : acumulador;
    },0)+1;
    matricula = matricula<=1 ? parseInt(new Date().getFullYear().toString()+"0001") : matricula;

    Object.assign(body,{'matricula':matricula});
    let resultado = await this.collection.insertOne(body)
    return {
      'linhas':resultado.insertedCount,
      'id':resultado.insertedId,
      'objetoCriado':resultado.ops
    };
  }

  async alterarAluno(req) {
    let retornoALuno = await this.collection.findOne({'matricula':parseInt(req.params.matricula)});
    const respostaUpdate = await this.update(retornoALuno._id.toString(),req.payload); 
    if(!respostaUpdate){ return {"ERRO":"deu falha"}}
    return {
      'linhas_modificadas':respostaUpdate.modifiedCount,
      'objetoAluno':req.payload
      };
  }

  async apagarAluno (req) {
    const respostaDelete = await this.collection.deleteOne({'matricula':parseInt(req.params.matricula)});
    return respostaDelete.result;
  }

  async buscarAluno(req) {
    return await this.collection.findOne({'matricula':parseInt(req.params.matricula)});

  }
}

module.exports = AlunosRepository;
