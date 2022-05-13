import DAL from '@dal/DAL';

const surfaceConfig = [
  { frontend: 'coords', backend: 'surface_geo' },
  { frontend: 'name', backend: 'surface_description' },
  { frontend: 'address', backend: 'surface_address' },
  { frontend: 'available', backend: 'vg_available', },
  { frontend: 'SURFACEID', backend: 'SURFACEID' },
  { frontend: 'NETWORKID', backend: 'NETWORKID' },
  { frontend: 'OTS_info', backend: 'OTS_info' },
  { frontend: 'PPV_day', backend: 'PPV_day' },
  { frontend: 'PPV_night', backend: 'PPV_night' },
  { frontend: 'img', backend: 'surface_img' },
  { frontend: 'city_id', backend: 'CITYID' },
  { frontend: 'id', backend: 'id' },
  { frontend: 'GRP', backend: 'GRP' },
  { frontend: 'door', backend: 'door' },
  { frontend: 'type', backend: 'surface_type' },
  { frontend: 'is_vertical', backend: 'is_vertical' },
  { frontend: 'CPT_supported', backend: 'CPT_supported' },
  { frontend: 'PPV_supported', backend: 'PPV_supported' },
  { frontend: 'last_request_at', backend: 'last_request_at' },
  { frontend: 'media_params_strict', backend: 'media_params_strict' },
  { frontend: 'resolution', backend: 'media_params_exploded' },
  { frontend: 'neededDuration', backend: 'media_params_exploded' },
  { frontend: 'checkIfSelected' },
  { frontend: 'format' },
];
const multiSurfaceConfig = [
  ...surfaceConfig,
  { frontend: 'site_id', backend: 'site_id' },
  { frontend: 'side', backend: 'side' },
];

const parserFunctions = {
  neededDuration: value => value && value.duration_ms / 1000,
  resolution: value => value && value.res,

  format: (_, __, item) => parseSufraceFormat(item),
  coords: value => value.split(','),
  checkIfSelected: () => true,
  available: value => !!value,
  id: value => Number(value),
};

export const multiscreensDAL = new DAL(multiSurfaceConfig, parserFunctions);
export const indoorSurfaceDAL = new DAL(surfaceConfig, parserFunctions);
export const surfaceDAL = new DAL(surfaceConfig, parserFunctions);

/**
 * Определение поля 'Формат' по данным поверхности
 * @param {Object} surface Сама поверхность
 */
export function parseSufraceFormat(surface) {
  if (surface.door === 'indoor') {
    return Number(surface.is_vertical)
      ? 'Вертикальный'
      : 'Горизонтальный';
  }
  return surface.outdoor_format;
};
