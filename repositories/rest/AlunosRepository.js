const RestRepository = require('../RestRepository.js');


// TODO: Migrar as regras de negocios para o Repository
class AlunosRepository extends RestRepository {
  constructor(apiUrl) {
    super(apiUrl, '/alunos');
  }


  async criarAluno(body) {
    let matricula=0;
    let listaAlunos = await this.list();
    if (listaAlunos.lenght>0){
    matricula = listaAlunos.reduce((acumulador, aluno)=>{
      return acumulador = (parseInt(aluno.matricula)>acumulador) ? parseInt(aluno.matricula) : acumulador;
    },0)+1;
    }
    matricula = matricula<=1 ? parseInt(new Date().getFullYear().toString()+"0001") : matricula;

    Object.assign(body,{'matricula':matricula});
    return await this.insert(body);
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
