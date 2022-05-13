import vdoohDev from './vdooh.dev';
import gallery from './gallery';
import galmed from './galmed';
import allbb from './allbb';
import desk from './desk';
import maer from './maer';
import glr from './glr';
import whl from './wl';

const defaultTheme = desk;

const themes = {
  'digital.all-billboards.ru': allbb,
  'allbb.vdooh.com': allbb,
  'wltest.vdooh.com': whl,
  'maer.vdooh.com': maer,
  'gallery.vdooh.com': gallery,
  'gallerymedia.vdooh.com': galmed,
  'ui.gallerymedia.com': galmed,
  'glr.vdooh.com': glr,
  'vdooh.dev': vdoohDev,
  'testdesk.vdooh.com': vdoohDev,
};

const getThemeItem =
  hostname => Object.assign(defaultTheme, themes[hostname]);

export const getTheme =
  hostname => getThemeItem(hostname).themes;

export const getImage =
  hostname => getThemeItem(hostname).image;

export const getLogo =
  hostname => getThemeItem(hostname).logo;

export const getWithoutRegistration =
  hostname => getThemeItem(hostname).withoutRegistration;

export const getTitle =
  hostname => getThemeItem(hostname).title;

export const getFooter =
  hostname => getThemeItem(hostname).footer;

export const getAppTitle =
  hostname => getThemeItem(hostname).appTitle;

export const getHrefPolitics =
  hostname => getThemeItem(hostname).hrefPolitics;

export const getSupportEmail =
  hostname => getThemeItem(hostname).supportEmail;

export const getTitleLogo =
  hostname => getThemeItem(hostname).titleLogo;

export const getLogoClass =
  hostname => getThemeItem(hostname).logoClass;

