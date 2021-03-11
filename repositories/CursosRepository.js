const MongoDbRepository = require('./MongoDbRepository.js');


class CursosRepository extends MongoDbRepository {
  constructor(db) {
	super(db, 'cursos');
  }

  async insertCurso(body) {

	const resultado = await this.collection.insertOne(body);
	return {
    'linhas':resultado.insertedCount,
    'id':resultado.insertedId,
    'objetoCriado':resultado.ops
  };
  }

  async listCursos(){
    const resultado = await this.collection.list();
    return {'status':'OK','resultado':resultado.toarray()}
  }


}

module.exports = CursosRepository;
