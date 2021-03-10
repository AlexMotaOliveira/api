const RestRepository = require('./RestRepository.js');


// TODO: Migrar as regras de negocios para o Repository
class AlunosRepository extends RestRepository {
  constructor(apiUrl) {
    super(apiUrl, '/alunos');
  }


  async criarAluno(body) {
   
    return await this.insert(body);
  }

  async alterarAluno(req) {// TODO: Implementar um retorno de sucesso
    let restornoMatricula = await this.get2Uri(req.params.matricula,'matricula');
    if (restornoMatricula.error ==='Matricula não localizada') {
      return restornoMatricula;
    }
      await this.updateSemRetorno(restornoMatricula.id,req.payload);
    return "Alterado com sucesso"
  }

  async apagarAluno (req) {
    let restornoMatricula = await this.get2Uri(req.params.matricula,'matricula');
    if (restornoMatricula.error ==='Matricula não localizada') {
      return restornoMatricula;
    }
      await this.deleteSemRetorno(restornoMatricula.id);
    return "Deletado com sucesso"
  }

  async buscarAluno(req) {
    return await this.get2Uri(req.params.matricula,'matricula');

  }
}

module.exports = AlunosRepository;
