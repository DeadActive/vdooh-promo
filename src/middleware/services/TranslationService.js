import webClient from '@mdw/WebClient';

export default {
  /**
   * Загрузка списка рекламных кампаний
   * @param {Object} data Данные для фильтрации и пагинации списка
   */
  getTranslations(data) {
    return webClient.post('translations', data);
  },
  /**
   * Смена 
   * @param {Number} translation_id ID 
   * @param {String} status Новый статус
   */
  changeTranslationStatus(translation_id, status) {
    return webClient.post('action', {
      translation_id,
      action: status,
    });
  },
  /**
   * 
   * @param {Number} translation_id ID РК
   * @param {String} status Статус РК
   * @param {Boolean} archived Архивировать РК или нет
   */
  changeTranslationArchived(translation_id, status, archived) {
    return webClient.post('action', {
      archived: archived ? 1 : 0,
      translation_id,
      action: status,
    });
  },
  /**
   * Копирование РК
   * @param {Number} id ID РК
   */
  duplicateTranslation(id) {
    return webClient.post('tcopy', { id });
  },

  /**
   * Получение кокретной РК
   * @param {Number} id ID РК
   * @param {Boolean} expand_surfaces Необходимо ли получать развернутые
   * данные о поверхностях
   */
  getTranslation(id, expand_surfaces = true) {
    return webClient.get('translation_load', {
      expand_surfaces,
      id,
    });
  },

  /**
   * Сохранение новых ставок экранам
   * @param {Number} id ID рекламной кампании
   * @param {Array} selectedSurfaces Список поверхностей с измененными ставками
   */
  savePriceFloor({ id, selectedSurfaces }) {
    return webClient.post('translations.prices_update', { selectedSurfaces, id });
  },

  /**
   * Экспорт медиаплпна по РК
   * @param {Number} id ID РК
   */
  getTranslationMediaPlan(id) {
    return webClient.get('translation_load', {
      as_mediaplan: true,
      id,
    });
  },
  /**
   * Генерирование ссылки на список поверхностей
   * @param {Array} basket_value Список ID поверхностей
   */
  generateLink(basket_value) {
    return webClient.post('na.new_basket', {
      basket_value,
    });
  },

  /**
   * Сохранение рекламной кампании
   * @param {Object} translation Значения рекламной кампании
   */
  saveTranslation(translation) {
    return webClient.post('save', translation);
  },
  /**
   * Заведение новой рекламной кампании
   */
  newTranslation() {
    return webClient.post('new_translation');
  },
};
