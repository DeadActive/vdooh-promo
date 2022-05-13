import webClient from '@mdw/WebClient';

export default {
  /**
   * Загрузка пользователей
   * @param {UserResponseData} responseData Объект для фильтрации и пагинации 
   */
  loadUsers(responseData) {
    return webClient.post('get_users_with_status', responseData);
  },
  /**
   * Смена статуса активности пользователя
   * @param {String} USERID ID пользователя
   * @param {Number} active Активен пользователь (1) или нет (0)
   */
  setUserActive(USERID, active) {
    return webClient.post('user_active', {
      USERID,
      active,
    });
  },
  /**
   * Получение данных конкретного пользователя
   * @param {String} USERID ID пользователя
   */
  getUser(USERID) {
    return webClient.get('get_user_info', { USERID });
  },

  /**
   * Создание нового пользователя
   * @param {String} USERID ID пользователя
   * @param {String} password Пароль для пользователя
   * @param {String} name Имя нового пользователя
   * @param {Array} clients Список клиентов, которые прикрепляются к пользователю
   * @param {Boolean} is_admin Имеет ли пользователь админские права
   * @param {Boolean} is_readonly Имеет ли пользователь права только на чтение
   * @param {Boolean} send_notifications Подписывается ли пользователь на рассылку
   */
  createUser(USERID, password, name, clients, is_admin, is_readonly, send_notifications) {
    return webClient.post('user_create', {
      send_notifications,
      CLIENTID: clients,
      user_name: name,
      is_readonly,
      password,
      is_admin,
      USERID,
    })
  },
  /**
   * Изменение данных пользователя
   * @param {String} USERID ID пользователя
   * @param {Object} user Новые данные пользователя
   */
  updateUser(USERID, user) {
    return webClient.post('userdata', {
      USERID,
      ...user,
    });
  },

  /**
   * Смена админских прав пользователя
   * @param {String} USERID ID пользователя
   * @param {Number} isAdmin Имеет ли пользователь админские права (1) или нет (0)
   */
  addAdminRights(USERID, isAdmin) {
    return webClient.post('user_admin', {
      is_admin: isAdmin,
      USERID,
    });
  },
  /**
   * Смена прав только на чтение пользователя
   * @param {String} USERID ID пользователя
   * @param {Number} isAdmin Имеет ли пользователь права только на чтение (1) или нет (0)
   */
  addReadonlyRights(USERID, isReadonly) {
    return webClient.post('user_readonly', {
      is_readonly: isReadonly,
      USERID,
    });
  },
};
