const MongoDbRepository = require('./MongoDbRepository.js');

// TODO: Criar buscar de matricula para poder cadastrar novos alunos sem repetir
// TODO: Criar inserção de um aluno em um curso.
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
