const MongoDbRepository = require('./MongoDbRepository.js');


class AlunosRepository extends MongoDbRepository {
  constructor(db) {
	super(db, 'alunos');
  }

  async insertAluno() {
	// METODO PARA GERAR MATRICULA AQUI()
	const resultado = await this.collection.insertOne(
	  {
		nome: "VARIAVEL NOME",
		cpf: "123cpf",
		email: "aluno@email.com",
		matricula: "Que foi gerada",
		endereco: "json/objeto de endereco"
	  });
	  console.log(
		`${resultado.insertedCount} documents were inserted with the _id: ${resultado.insertedId}`,
	  );
	return resultado;
  }
}

module.exports = AlunosRepository;
