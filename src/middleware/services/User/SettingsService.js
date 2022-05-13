import webClient from '@mdw/WebClient';

export default {
  /**
   * Сохранение настроек пользователя
   * @param {Object} data Настройки пользователя
   */
  saveSettings(data) {
    return webClient.post('settings', data, {
      operation: 'set',
    });
  },
  /**
   * Загрузка настроек пользователей
   * @param {String} id ID пользователя
   */
  getSettings(id) {
    return webClient.get('settings', {
      operation: 'get',
      setting_id: id,
    });
  },
};