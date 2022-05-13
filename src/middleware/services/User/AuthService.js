import webClient from '@mdw/WebClient';

export default {
    /**
     * Авторизация пользователя
     * @param {String} username Логин пользователя
     * @param {String} password Пароль пользователя
     */
    login(username, password) {
        return webClient.post('authorize', {
            auth_login: username.trim().toLowerCase(),
            auth_password: password.trim(),
            origin: location.hostname,
        });
    },
    /**
     * Авторизация под указанного клиента
     * @param {String} CLIENTID ID клиента
     */
    authAsClient(CLIENTID) {
        return webClient.post('set_clientid', { CLIENTID });
    },
    /**
     * Получение баланса текущего пользователя
     */
    loadClientBalance() {
        return webClient.get('client_info');
    },

    /**
     * Регистрация как новый пользователь
     * @param {Object} user Данные пользователя
     */
    register(user) {
        return webClient.post('na.register', {
            origin: location.hostname,
            ...user,
        });
    },
    /**
     * Подтверждение электронной почты
     * @param {Stirng} USERID ID
     * @param {String} hash Хеш для подтверждения
     */
    confirmEmail(USERID, hash) {
        return webClient.post('na.regconfirm', {
            confirmation_hash: hash,
            USERID,
        });
    },

    /**
     * Запрос на восстановление пароля
     * @param {Object} user ID пользователя
     */
    requestToResetPassword(USERID) {
        return webClient.post('na.pwdreset', {
            host: location.hostname,
            USERID,
        });
    },
    /**
     * Сброс пароля пользователя
     * @param {String} USERID ID пользователя
     * @param {String} password Новый пароль пользователя
     * @param {String} hash Хэш для сброса пароля
     */
    resetPassword(USERID, password, hash) {
        return webClient.post('na.pwdnew', {
            confirmation_hash: hash,
            password: password,
            USERID,
        });
    },

    /**
     * Очищение сесии пользователя
     */
    logout() {
        localStorage.clear();
        return webClient.post('logout');
    },

    /**
     * Проверка сощуствования сессии пользователя
     * @param {Strign} token Токен сессии
     */
    checkSession(token) {
        return webClient.get('user.check_session', {
            origin: 'ui.gallerymedia.com',
            __token: token,
            token,
        });
    },
};
