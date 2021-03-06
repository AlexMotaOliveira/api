const MongoDbRepository = require('./MongoDbRepository.js');

// TODO: Criar buscar de matricula para poder cadastrar novos alunos sem repetir
// TODO: Criar inserção de um aluno em um curso.
class NotasRepository extends MongoDbRepository {
  constructor(db) {
	super(db, 'notas');
  }

  async insertNota(body) {
	const resultado = await this.collection.insertOne(body);
	return {
    'linhas':resultado.insertedCount,
    'id':resultado.insertedId,
    'objetoCriado':resultado.ops
  };
  }

  async listNotas(){
    const resultado = await this.collection.list();
    return {'status':'OK','resultado':resultado.toarray()}
  }
}

module.exports = NotasRepository;
