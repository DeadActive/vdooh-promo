import webClient from '@mdw/WebClient';

export default {
    /**
     * Загрузка форматов indoor-поверхностей неавторизованным
     */
    loadAnonimIndoorFormat() {
        return webClient.get('na.sur_type');
    },
    /**
     * Загрузка форматов indoor-поверхностей
     */
    loadIndoorFormat() {
        return webClient.get('surfaces.sur_type');
    },

    /**
     * Загрузка списка городов для неавторизованного пользователя
     * @param {String} door Тип поверхности (indoor|outdoor)
     */
    loadAnonimCities(door) {
        return webClient.get('na.cities', {
            with_active_surfaces: 1,
            door,
        });
    },
    /**
     * Загрузка списка городов для неавторизованного пользователя
     * @param {String} door Тип поверхности (indoor|outdoor)
     */
    loadCities(door, galmed) {
        return webClient.get('cities', {
            with_active_surfaces: 1,
            //active_g: 0,
            door,
        });
    },

    /**
     *
     * @param {Array} NETWORKID ID выбранных сетей
     * @param {Array} CITYID ID выбранных городов
     */
    getFormats(CITYID, NETWORKID) {
        return webClient.post('dict.available_formats', {
            NETWORKID,
            CITYID,
        });
    },
};
