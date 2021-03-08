const MongoDbRepository = require('./MongoDbRepository.js');

// TODO: Criar buscar de matricula para poder cadastrar novos alunos sem repetir
// TODO: Criar inserção de um aluno em um curso.
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

}

module.exports = AlunosRepository;
