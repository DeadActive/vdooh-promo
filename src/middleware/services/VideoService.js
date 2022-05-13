import webClient from '@mdw/WebClient';

export default {
  /**
   * Загрузка видео
   * @param {String} filter Объект фильтрации
   * @param {String} resolution Разрешение видео
   * @param {Object} filterIt Объект для пагинации
   */
  getVideos(filter, resolution, filterIt) {
    if (resolution) return webClient.post('videos', {
      only_approved: true,
      res: resolution,
    });

    if (filter === 'rk') {
      return webClient.post('videos', {
        not_only_approved: true,
        filterIt,
      });
    }

    return webClient.post('videos', {
      only_approved: true,
    });
  },
};
