const MongoDbRepository = require('./MongoDbRepository.js');

class DisciplinasRepository extends MongoDbRepository {
  constructor(db) {
	super(db, 'disciplinas');
  }

  async insertDisciplina(body) {
	const resultado = await this.collection.insertOne(body);
	return {
    'linhas':resultado.insertedCount,
    'id':resultado.insertedId,
    'objetoCriado':resultado.ops
  };
  }

  async listDisciplinas(){
    const resultado = await this.collection.list();
    return {'status':'OK','resultado':resultado.toarray()}
  }


}

module.exports = DisciplinasRepository;
