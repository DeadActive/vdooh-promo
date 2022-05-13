import TranslationsAll from "@/views/Translations/TranslationsAll";

export default [
  {
    path: ":id/edit",
    name: "translation.edit",
    props: route => ({ id: Number(route.params.id) }),
    component: () =>
      import ( /* webpackChunkName: "translationsmodify" */ "@/views/Translations/TranslationsModify"),
    meta: {
      title: { en: '', ru: "Просмотр рекламной кампании" },
      requiresAuth: true,
      header: {
        link: '/translations/1',
        withNotification: true,
        isBack: true,
      },
    },
  },
  {
    path: ":id/edit/allbb",
    name: "translation.edit.allbb",
    props: route => ({
      id: Number(route.params.id),
      allbb: true,
    }),
    component: () =>
      import ( /* webpackChunkName: "translationsmodify" */ "@/views/Translations/TranslationsModify"),
    meta: {
      title: { en: '', ru: "Создание рекламной кампании" },
      requiresAuth: true,
      header: {
        link: '/translations/1',
        withNotification: true,
        isBack: true,
      },
    },
  },
  {
    path: ":id/auction/:type",
    name: "translation.auction",
    props: route => ({
      id: Number(route.params.id),
      type: route.params.type,
    }),
    component: () =>
      import ( /* webpackChunkName: "translationsauction" */ "@/views/Translations/TranslationsAuction"),
    meta: {
      title: { en: '', ru: "Настройка ставок рекламной кампании" },
      requiresAuth: true,
      header: {
        link: '/translations/1',
        isBack: true,
      },
    },
  },
  {
    path: "new",
    name: "translation.new",
    component: () =>
      import ( /* webpackChunkName: "translationsmodify" */ "@/views/Translations/TranslationsModify"),
    meta: {
      title: { en: '', ru: "Создание рекламной кампании" },
      requiresAuth: true,
      header: {
        link: '/translations/1',
        withNotification: true,
        isBack: true,
      },
    },
  },

  {
    path: '',
    redirect: '1',
  },
  {
    path: ":page",
    name: "translations.all",
    component: TranslationsAll,
    meta: {
      title: { en: '', ru: "Рекламные кампании" },
      requiresAuth: true,
      header: {
        to: '/translations/new',
        action: 'Создать кампанию',
      }
    },
  },
];
