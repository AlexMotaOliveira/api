const MongoDbRepository = require('./MongoDbRepository.js');


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


}


module.exports = AlunosRepository;
