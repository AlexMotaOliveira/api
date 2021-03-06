const LinguagemController = require('./controllers/LinguagemController.js');
// Sem RestController
// const LancamentosController = require('./controllers/LancamentosController.js');
// Com RestController:
const LancamentosController = require('./controllers/LancamentosController2.js');
const AutorizacaoController = require('./controllers/AutorizacaoController.js');
const AlunosController = require('./controllers/AlunoController.js');
const CursosController = require('./controllers/CursoController.js');
const DisciplinasController = require('./controllers/DisciplinaController.js');
const NotasController = require('./controllers/NotaController.js');
// TODO:Configurar o status do retorno, 200,201...
module.exports = [
  {
    method: 'POST',
    path: '/api/v1/token',
    handler: AutorizacaoController.token,
  },
  {
    method: 'POST',
    path: '/api/v1/alunos',
    handler: AlunosController.insertAluno
  },
  {
    method: 'GET',
    path: '/api/v1/alunos',
    handler: AlunosController.listAluno
  },
  {
    method: 'DELETE',
    path: '/api/v1/alunos/{id}',
    handler: AlunosController.deleteAluno
  },
  {
    method: 'PUT',
    path: '/api/v1/alunos/{id}',
    handler: AlunosController.updateAluno
  },
  {
    method: 'GET',
    path: '/api/v1/alunos/{id}',
    handler: AlunosController.getAluno
  },
  {
    method: 'POST',
    path: '/api/v1/cursos',
    handler: CursosController.insertCurso
  },
  {
    method: 'GET',
    path: '/api/v1/cursos',
    handler: CursosController.listCurso
  },
  {
    method: 'DELETE',
    path: '/api/v1/cursos/{id}',
    handler: CursosController.deleteCurso
  },
  {
    method: 'PUT',
    path: '/api/v1/cursos/{id}',
    handler: CursosController.updateCurso
  },
  {
    method: 'GET',
    path: '/api/v1/cursos/{id}',
    handler: CursosController.getCurso
  },
  {
    method: 'POST',
    path: '/api/v1/disciplinas',
    handler: DisciplinasController.insertDisciplina
  },
  {
    method: 'GET',
    path: '/api/v1/disciplinas',
    handler: DisciplinasController.listDisciplina
  },
  {
    method: 'DELETE',
    path: '/api/v1/disciplinas/{id}',
    handler: DisciplinasController.deleteDisciplina
  },
  {
    method: 'PUT',
    path: '/api/v1/disciplinas/{id}',
    handler: DisciplinasController.updateDisciplina
  },
  {
    method: 'GET',
    path: '/api/v1/disciplinas/{id}',
    handler: DisciplinasController.getDisciplina
  },
  {
    method: 'POST',
    path: '/api/v1/notas',
    handler: NotasController.insertNota
  },
  {
    method: 'GET',
    path: '/api/v1/notas',
    handler: NotasController.listNota
  },
  {
    method: 'GET',
    path: '/api/v1/notas/{id}',
    handler: NotasController.getNota
  },
  {
    method: 'DELETE',
    path: '/api/v1/notas/{id}',
    handler: NotasController.deleteNota
  },
  {
    method: 'PUT',
    path: '/api/v1/notas/{id}',
    handler: NotasController.updateNota
  },
  {
    method: [ 'GET', 'POST','DELETE','PUT' ],// TODO: Podemos retornar a lista de endpoits disponíveis
    path: '/{any*}',
    handler: (request, h) => {
      return h.response({'mensagem':'Parece que o endpoint que você busca está em outro castelo!'}).code(404)
    }
  }
];
