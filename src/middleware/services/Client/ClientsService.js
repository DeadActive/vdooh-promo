import webClient from '@mdw/WebClient';

export default {
  /**
   * Получение списка клиентов агентства
   * @param {Object} responseData Данные для пагинации и фильрации клтентов
   */
  loadAgencyClients(responseData) {
    return webClient.post('clientid.agency_clients', responseData);
  },
  /**
   * Получение списка клиентов
   * @param {Number} version Указание версии списка клиентов
   */
  loadClients(version = 1) {
    return webClient.get('get_clientid', { version });
  },
  /**
   * Получение списка клиентов, доступных конкретному пользователю
   * @param {String} USERID ID пользователя
   */
  loadAvailableClients(USERID) {
    return webClient.get('get_clientid_arbtr_userid', { USERID });
  },

  /**
   * Получение списка клиентов Gallery
   * @param {String} search Строка поиска
   */
  loadGalleryClients(search = '') {
    return webClient.get('vg.objects', {
      search: search.split(' ').join('%20'),
      object: 'mediabuyer1',
      rows: 50,
    });
  },

  /**
   * Смена активности клиента
   * @param {String} CLIENTID ID клиента
   * @param {Boolean} active Актиен клиент или нет
   */
  setClientActive(CLIENTID, active) {
    return webClient.post('set_client_active', {
      CLIENTID,
      active,
    });
  },

  /**
   * Загрузить историю операций агентства
   * @param {String} type Тип операций
   * @param {String} startDate Дата начала периода
   * @param {String} endDate Дата конца периода
   */
  // loadBillingData(type, startDate, endDate) {
  //   return webClient.get('billing', {
  //     date_from: startDate,
  //     billing_type: "transfer",
  //     date_to: endDate,
  //   });
  // },
  loadBillingData(CLIENTID, startDate, endDate) {
    return webClient.get('finance.list', {
      period_from: `${startDate} 00:00:00`,
      period_to: `${endDate} 23:59:59`,
      agency_mode: 1,
      CLIENTID,
    });
  },
  /**
   * Перевод счета с одного клиента - другому
   * @param {String} from ID клиента-отправителя
   * @param {String} to ID клиента-получателя
   * @param {Number} amount Сумма перевода
   * @param {String} comment Комментарий к переводу
   */
  transferBudget(from, to, amount, comment) {
    return webClient.post('transfer_clientid', {
      from_CLIENTID: from,
      amount_RUR: amount,
      to_CLIENTID: to,
      comment: comment,
      copy_finance: 1,
    });
  },
};
