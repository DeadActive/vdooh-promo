import webClient from '@mdw/WebClient';

export default {
  /**
   * Загрузка уникальных MAC-адресов
   * @param {Number} translationId ID РК
   */
  loadUniqueMacs(translationId) {
    return webClient.get('dmp_wrapper.get_forecastTranslationReach', { translationId });
  },
  /**
   * Обновить прогноз указанной РК
   * @param {Number} translationId ID РК
   */
  updateCalculation(translationId) {
    return webClient.post('dmp_wrapper.forecastTranslationReach', null, { translationId });
  },
  /**
   * Загрузка прогноза
   * @param {Object} data 
   */
  async loadForecast(data) {
    try {
      const otsReach = (await webClient.post('vg.ots_reach', data)).data;
      return otsReach;
    } catch(e) {
      console.error(e);
    }
  },

  /**
   * Получение ID поверхностей, добавленных в корзину на сервере
   * @param {Number} basket_id ID корзины
   */
  getSurfaceIdsFromBasket(basket_id) {
    return webClient.get('na.get_basket', { basket_id });
  },
  /**
   * Загрузка поверхностей по списку их ID
   * @param {Array} surface_ids Массив id поверхностей
   * @param {Boolean} filtered Необходима фильтрация поверхностей или нет
   */
  getSurfacesByLink(surface_ids, filtered) {
    return webClient.post('surfaces', { surface_ids, filtered });
  },

  /**
   * Получение поверхностей
   * @param {Object} data Данные для фильтрации поверхностей
   * @param {String} type Тип поверхности (outdoor|indoor)
   */
  getSurfaces(data, type) {
    return webClient.post('surfaces', {
      ...data,
      type,
    });
  },

  /**
   * Получение ставок по ID поверхностей
   * @param {Array} surface_ids Список ID поверхностей
   */
  getFloorPrice(surface_ids) {
    return webClient.post('floor_price', { surface_ids });
  },

  /**
   * 
   * @param {String} door Тип поверхности (outdoor|indoor)
   * @param {String} CITYID ID города
   * @param {Number} PPV_supported Поддержка PPV аукциона (1/0)
   * @param {Number} CPT_supported Поддержка CPT аукциона (1/0)
   * @param {Bool} galmed Принадлежность к Galmed (1/0)
   */
  getNetworks(door, CITYID, PPV_supported, CPT_supported, galmed) {
    return webClient.post('networks', {
      PPV_supported,
      CPT_supported,
      CITYID,
      door,
      galmed
    });
  },
};
