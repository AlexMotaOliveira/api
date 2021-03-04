const LinguagemController = require('./controllers/LinguagemController.js');
// Sem RestController
// const LancamentosController = require('./controllers/LancamentosController.js');
// Com RestController:
const LancamentosController = require('./controllers/LancamentosController2.js');
const AutorizacaoController = require('./controllers/AutorizacaoController.js');
const AlunosController = require('./controllers/AlunoController.js');

module.exports = [
  {
    method: 'PUT',
    path: '/javascript',
    handler: LinguagemController.javascript,
  },
  {
    method: 'POST',
    path: '/python',
    handler: LinguagemController.python
  },
  {
    method: 'GET',
    path: '/lancamentos',
    handler: LancamentosController.listarLancamentos
  },
  {
    method: 'GET',
    path: '/lancamentos/{id}',
    handler: LancamentosController.obterLancamento
  },
  {
    method: 'POST',
    path: '/lancamentos',
    handler: LancamentosController.inserirLancamento
  },
  {
    method: 'PATCH',
    path: '/lancamentos/{id}',
    handler: LancamentosController.atualizarLancamento
  },
  {
    method: 'DELETE',
    path: '/lancamentos/{id}',
    handler: LancamentosController.apagarLancamento
  },
  {
    method: 'GET',
    path: '/lancamentos/saldo',
    handler: LancamentosController.obterSaldo
  },,
  {
    method: 'GET',
    path: '/lancamentos/receitas',
    handler: LancamentosController.listarReceitas
  },
  {
    method: 'GET',
    path: '/lancamentos/despesas',
    handler: LancamentosController.listarDespesas
  },
  {
    method: 'GET',
    path: '/lancamentos/por-categoria',
    handler: LancamentosController.agruparPorCategoria
  },
  {
    method: 'POST',
    path: '/token',
    handler: AutorizacaoController.token,
  },
  {
    method: 'POST',
    path: '/alunos',
    handler: AlunosController.insertAluno
  },
  {
    method: 'GET',
    path: '/alunos',
    handler: AlunosController.listAluno
  },
  {
    method: 'DELETE',
    path: '/alunos/{id}',
    handler: AlunosController.deleteAluno
  },
];// TODO: Terminar o endpoint de update e focar no relacionamento depois
