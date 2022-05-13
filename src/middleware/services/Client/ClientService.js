import webClient from '@mdw/WebClient';

export default {
  /**
   * Получение клиента по его ID
   * @param {String} CLIENTID ID клиента
   */
  loadClient(CLIENTID) {
    return webClient.get('load_clientid', { CLIENTID });
  },

  /**
   * Заведение нового клиента в систему
   * @param {Strign} name Имяя клиента
   * @param {Number} minBalance Возможный овердрафт клиента
   */
  createClient(name, minBalance) {
    return webClient.post('create_clientid', {
      min_balance_RUR: -Math.abs(minBalance),
      client_name: name,
    });
  },
  /**
   * Изменение конкретного клиента
   * @param {String} CLIENTID ID клиента
   * @param {Object} client Данные клиента
   */
  updateClient(CLIENTID, client) {
    return webClient.post('update_clientid', {
      CLIENTID,
      ...client
    })
  },
  /**
   * Привязка пользователей к клиентам
   * @param {String} CLIENTID ID клиента
   * @param {String} USERID ID пользователя
   * @param {Number} status Статус добавления (1) или открепления (0)
   */
  manageClientUser(CLIENTID, USERID, status) {
    return webClient.post('manage_clientid', {
      add: status,
      CLIENTID,
      USERID,
    });
  },

  /**
   * Загрузка данных о банке по БИК клиента
   * @param {String} bic Банковский идентификационный код
   */
  loadBankDataByBic(bic) {
    return webClient.request({
      url: 'https://bik-info.ru/api.html?type=json&bik=' + bic,
      method: 'get',
    });
  },

    /**
   * Загрузка данных о клиенте по ИНН
   * @param {String} inn Банковский идентификационный код
   */
    loadCompanyDataByInn(inn) {
      return webClient.request({
        url: 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party',
        method: 'post',
        headers: { 'Authorization': 'Token 4e1e7137ccbbf4713f90f8ce1248e5cbe8d51abc' },
        data: {
          query: inn,
          branch_type: "MAIN"
        }
      });
    },

        /**
   * Загрузка данных о клиенте по названию
   * @param {String} name название
   */
         loadCompanyDataByName(name) {
          return webClient.request({
            url: 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party',
            method: 'post',
            headers: { 'Authorization': 'Token 4e1e7137ccbbf4713f90f8ce1248e5cbe8d51abc' },
            data: {
              query: name
            }
          });
        },

  /**
   * Пополнение счета клиента
   * @param {Number} value_RUR Сумма пополнения
   */
  upToBalance(value_RUR) {
    return webClient.get('invoice.create', { value_RUR });
  },
};
