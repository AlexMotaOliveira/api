const fetch = require('node-fetch');

class RestRepository {
  /**
   * @param {string} apiUrl URL base da API
   * @param {string} resourcePath caminho do resource iniciando com '/'
   */
  constructor(apiUrl, resourcePath) {
    this.apiUrl = apiUrl;
    this.resourcePath = resourcePath;
  }

  async list() {
    const url = `${this.apiUrl}${this.resourcePath}`;
    const res = await fetch(url);
    return res.json();
  }

  async getById(id) {
    const url = `${this.apiUrl}${this.resourcePath}/${id}`;
    const res = await fetch(url);
    return res.json();
  }

  async insert(obj) {
    const url = `${this.apiUrl}${this.resourcePath}`;

    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(obj)
    });
    return res.json();
  }

  async update(id, obj) {
    const url = `${this.apiUrl}${this.resourcePath}/${id}`;

    const res = await fetch(url, {
      method: 'PATCH',
      body: JSON.stringify(obj)
    });
    return res.json();
  }

  async delete(id) {
    const url = `${this.apiUrl}${this.resourcePath}/${id}`;
    const res = await fetch(url, {
      method: 'DELETE'
    });
    return res.json();
  }
}

module.exports = RestRepository;