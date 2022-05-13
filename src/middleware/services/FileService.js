import webClient from '@mdw/WebClient';

export default {
  /**
   * Загрузка файлов
   */
  getFiles() {
    return webClient.get('files');
  },
  /**
   * Удаление файла
   * @param {String} id ID файла
   */
  removeFile(id) {
    return webClient.post('files_set_archive', { id });
  },
};
