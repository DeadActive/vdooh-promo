/**
 * Класс, реализующий слой доступа к данным
 */
class DAL {
  /**
   * Конструктор DAL объектов
   * @param {Array} config Соответствие значений фронтенда и бэкенда
   * @param {Object} parserFunctions Список парсинг функций
   */
  constructor(config, parserFunctions) {
    this.parserFunctions = parserFunctions;
    this.config = config;
  }

  /**
   * Возвращает значение, присваемое в новый объект, прогоняя
   * значение через парсинг-функцию из свойства parserFunctions
   * @param {String} valueName Название свойства
   * @param {*} value Значение свойства
   * @param {Object} item Элемент массива
   */
  returnNewValue(valueName, value, item) {
    const parserFunc = this.parserFunctions[valueName];
    if (typeof parserFunc === 'function') {
      return parserFunc(value, valueName, item);
    }
    return value;
  }

  /**
   * Конвертор значений объекта
   * @param {Array} array Значение, подлежайшее парсингу
   * @param {String} from Значение из чего парсить (frontend|backend)
   * @param {String} to Значение во что парсить (frontend|backend)
   * 
   * @returns {Object} Объект, содержащий новые, прошедшие парсинг значения
   */
  parser(item, from, to) {
    const newItem = {};

    this.config.forEach(configItem => {
      const value = item[configItem[from]];

      Object.assign(newItem, {
        [configItem[to]]: this.returnNewValue(configItem[to], value, item)
      });
    });
    return newItem;
  }

  /**
   * Конвертор массива объектов, получаемых от сервера
   * @param {Array} array Массив исходных значений
   */
  backendToFrontend(array) {
    return array.map(item => {
      return this.parser(item, 'backend', 'frontend');
    });
  }
  /**
   * Конвертор массива объектов, передаваемых серверу
   * @param {Array} array Массив исходных значений
   */
  frontendToBackend(array) {
    return array.map(item => {
      return this.parser(item, 'frontend', 'backend');
    });
  }
};

export default DAL;
