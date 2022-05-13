import moment from 'moment';
import DAL from '@dal/DAL';

const fullHoursArray = new Array(24).fill(null).map((_, index) => index);
const mockActiveHours = {
  'monday'   : fullHoursArray.slice(),
  'tuesday'  : fullHoursArray.slice(),
  'wednesday': fullHoursArray.slice(),
  'thursday' : fullHoursArray.slice(),
  'friday'   : fullHoursArray.slice(),
  'saturday' : fullHoursArray.slice(),
  'sunday'   : fullHoursArray.slice(),
};
export const detailWeek = [
  { type: 'workdays', title: 'Понедельник', value: 'monday',    hours: fullHoursArray.slice() },
  { type: 'workdays', title: 'Вторник',     value: 'tuesday',   hours: fullHoursArray.slice() },
  { type: 'workdays', title: 'Среда',       value: 'wednesday', hours: fullHoursArray.slice() },
  { type: 'workdays', title: 'Четверг',     value: 'thursday',  hours: fullHoursArray.slice() },
  { type: 'workdays', title: 'Пятница',     value: 'friday',    hours: fullHoursArray.slice() },
  { type: 'weekdays', title: 'Суббота',     value: 'saturday',  hours: fullHoursArray.slice() },
  { type: 'weekdays', title: 'Воскресенье', value: 'sunday',    hours: fullHoursArray.slice() },
];
export const notDetailWeek = [
  { title: 'Будни',     value: 'workdays',  hours: fullHoursArray.slice() },
  { title: 'Выходные',  value: 'weekdays',  hours: fullHoursArray.slice() },
];

const translationConfig = [
  { frontend: 'id',                   backend: 'id'                 },
  { frontend: 'billExactPrice',       backend: 'bill_exact_price'   },
  { frontend: 'title',                backend: 'title'              },
  { frontend: 'dummy',                backend: 'dummy'              },
  { frontend: 'group',                backend: 'deal_group'         },
  { frontend: 'previewVideos',        backend: 'videos'             },
  { frontend: 'auctionMode',          backend: 'auction_mode'       },
  { frontend: 'status',               backend: 'status'             },
  { frontend: 'proof',                backend: 'proof'              },
  { frontend: 'book',                 backend: 'vg_booked'          },
  { frontend: 'archived',             backend: 'archived'           },
  { frontend: 'strategyAuto',         backend: 'strategy_auto'      },
  { frontend: 'city',                 backend: 'CITYID'             },
  { frontend: 'doorSurface',          backend: 'surface_type'       },
  { frontend: 'orientationVertical',  backend: 'is_vertical'        },
  { frontend: 'doorType',             backend: 'door'               },
  { frontend: 'review_per_video',     backend: 'review_per_video'   },
  { frontend: 'format',               backend: 'outdoor_format'     },
  { frontend: 'frequency',            backend: 'frequency_hz'       },
  { frontend: 'minIntervalSecs',      backend: 'min_interval_secs'  },
  { frontend: 'dayBudget',            backend: 'day_budget_RUR'     },
  { frontend: 'costPPVday',           backend: 'PPV_cost_day_RUR'   },
  { frontend: 'costPPVnight',         backend: 'PPV_cost_night_RUR' },
  { frontend: 'budget',               backend: 'budget_RUR'         },
  { frontend: 'cost',                 backend: 'OTS_cost_RUR'       },
  { frontend: 'dayPlanOTS',           backend: 'day_plan_OTS'       },
  { frontend: 'endDate',              backend: 'date_to'            },
  { frontend: 'startDate',            backend: 'date_from'          },
  { frontend: 'videoID',              backend: 'video_id'           },
  { frontend: 'activeHours',          backend: 'hours_active'       },
  { frontend: 'selectedSurfaces',     backend: 'resources'          },
  { frontend: 'addedSurfaces',        backend: 'resources'          },
  { frontend: 'strategyAuto',         backend: 'strategy_auto'      },
  { frontend: 'strategyAutoMode',     backend: 'strategy_auto_mode' },
  { frontend: 'intervalK',            backend: 'interval_K'         },
  { frontend: 'limitControlMode',     backend: 'limit_control_mode' },
  { frontend: 'dayPlanShows',         backend: 'day_plan_shows'     },
  { frontend: 'displayCost',          backend: 'PPV_cost_day_RUR'   },
  { frontend: 'trackingURLs',         backend: 'clicks'             },
  { frontend: 'planShows',        },
  { frontend: 'selectedNetworks'  },
  { frontend: 'notDetailWeek'     },
  { frontend: 'detailWeek'        },
  { frontend: 'inDetailPeriod'    },
];

const parserFunctions = {
  format: (value, _, translation) => parseTranslationFormat(value, translation),
  orientationVertical: value => parseIsVertical(value),
  doorSurface: value => parseDoorSurfaces(value),
  previewVideos: value => fomattingVideo(value),
  city: value => cityParse(value),

  intervalK: value => parseFloat(value).toFixed(2),

  endDate: value => value || moment().subtract(-2, 'days').format("YYYY-MM-DD"),
  startDate: value => value || moment().format("YYYY-MM-DD"),

  notDetailWeek: () => notDetailWeek.slice(),
  detailWeek: () => detailWeek.slice(),

  selectedSurfaces: value => Array.isArray(value) ? value.slice() : [],
  addedSurfaces: value => parseAddedSurfaces(value),
  videoID: value => value ? JSON.parse(value) : [],
  trackingURLs: value =>
    (value && value.length)
      ? value
      : [],

  costPPVnight: value => parsePrice(value, 2),
  costPPVday: value => parsePrice(value, 2),
  dayBudget: value => parsePrice(value, 2),
  budget: value => parsePrice(value, 2),
  cost: value => parsePrice(value, 2) || 1,

  strategyAutoMode: value => Number(value),
  limitControlMode: value => Number(value),
  minIntervalSecs: value => Number(value),
  billExactPrice: value => Number(value),
  dayPlanShows: value => Number(value),
  displayCost: value => Number(value),
  dummy: value => !!Number(value),
  proof: value => !!Number(value),

  selectedNetworks: () => [],
  inDetailPeriod: () => true,

  activeHours: value => value
    ? JSON.parse(value)
    : mockActiveHours,
  status: (value, _, translation) => value !== 'stopped'
    ? translation.status
    : 'stop',
};

export const translationDAL = new DAL(translationConfig, parserFunctions);

/**
 * Парсинг списка городов
 * @param {String} CITYID ID города
 */
function cityParse(CITYID) {
  if (!CITYID) return ['MOSCOW'];
  if (CITYID[0] === '[') return JSON.parse(CITYID);
  return [CITYID];
};

/**
 * Парсер типа поверхности
 * @param {String} surfaceType Тип поверхности
 */
function parseDoorSurfaces(surfaceType) {
  if (Array.isArray(surfaceType)) {
    return surfaceType.splice();
  }
  return surfaceType ? JSON.parse(surfaceType) : [];
};
/**
 * Парсер ориентации indoor поверхности
 * @param {String} isVertical Значение ориентации поверхности
 */
function parseIsVertical(isVertical) {
  return isVertical ? JSON.parse(isVertical) : [];
};
/**
 * Парсинг формата рекламной кампании
 * @param {String} outdoorFormat Формат outdoor РК
 * @param {Object} translation Рекламная кампания
 */
function parseTranslationFormat(outdoorFormat, translation) {
  if (Array.isArray(outdoorFormat)) {
    return outdoorFormat.splice();
  }
  if (outdoorFormat) {
    return JSON.parse(outdoorFormat);
  }

  const surfaces = translation.addedSurfaces || translation.resources;
  const format = new Set(surfaces.map(surface => surface.sd.outdoor_format));
  return [...format];
};

/**
 * Форматирование видео для их превью
 * @param {Array} videos Список видео
 */
function fomattingVideo(videos) {
  return videos.map(video => {
    const resolution = video.media_params.split(',')[1];
    return {
      filename: video.video_filename,
      resolution,
      ...video
    };
  })
};

/**
 * Парсинг цены
 * @param {Number} price Цена
 * @param {Number} numberOfDigits Количество знаков осле запятых
 */
function parsePrice(price, numberOfDigits) {
  return price
    ? parseFloat(price).toFixed(numberOfDigits)
    : 0;
};

/**
 * Парсинг добавленных поверхностей
 * @param {Array} surfaces Массив поверхностей
 */
function parseAddedSurfaces(surfaces) {
  return surfaces.map(surface => ({
    neededDuration: surface.sd && surface.sd.media_params_exploded && surface.sd.media_params_exploded.duration_ms / 1000,
    resolution: surface.sd && surface.sd.media_params_exploded && surface.sd.media_params_exploded.res,

    format: surface.format || surface.sd.outdoor_format,
    ...surface.sd,
    ...surface,
  }))
}
