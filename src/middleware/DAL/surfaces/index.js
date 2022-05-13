import {
    parseSufraceFormat,
    indoorSurfaceDAL,
    multiscreensDAL,
    surfaceDAL,
} from './config';

/**
 * DAL для outdoor поверхностей и мультиэкранов
 * @param {Array} surfaces Массив поверхностей
 * @param {Array} multiscreens Массив мультиэкранов
 */
export function surfacesWithMultiDAL(surfaces, multiscreens, otsPlayers) {
    const normalSurfaces = surfaceDAL.backendToFrontend(surfaces);

    let multiSurfaces = [];
    if (multiscreens.length) {
        multiSurfaces = multiscreens.map((surface) => ({
            players: multiscreensDAL.backendToFrontend(surface.players),
            available: surface.players.every((p) => !!p.vg_available),
            coords: surface.players[0].surface_geo.split(','),
            NETWORKID: surface.players[0].NETWORKID,
            key: surface.site_id,
            id: surface.site_id,
        }));
    }

    if (otsPlayers && otsPlayers.length) {
        otsPlayers.forEach((otsPlayer) => {
            const surface = normalSurfaces.find(
                (surface) => surface.SURFACEID === otsPlayer.playerId
            );
            if (surface) {
                // surface.ots = Number(otsPlayer.ots).toLocaleString('ru');
                surface.ots = otsPlayer.ots;
            } else {
                multiSurfaces.forEach((multiSurface) => {
                    const player = multiSurface.players.find(
                        (player) => player.SURFACEID === otsPlayer.playerId
                    );
                    if (player) {
                        // player.ots = Number(otsPlayer.ots).toLocaleString('ru');
                        player.ots = otsPlayer.ots;
                    }
                });
            }
        });
    }

    const filteredSurfaces = [...normalSurfaces, ...multiSurfaces].filter(
        (s) => s.coords.length === 2 && s.coords.every((c) => Number(c))
    );

    return filteredSurfaces;
}

/**
 * DAL для поверхностей в списке аукциона
 * @param {Array} surfaces Список поверхностей
 */
export function auctionSurfacesDAL(surfaces, floorData, doorType) {
    const mappedSurfaces = surfaces.map((surface) => ({
        description: surface.sd.surface_description,
        address: surface.sd.surface_address,
        is_vertical: surface.is_vertical,
        SURFACEID: surface.SURFACEID,
        NETWORKID: surface.NETWORKID,
        OTS_info: surface.OTS_info,
        CITYID: surface.sd.CITYID,
        GRP: surface.sd.GRP,
        last_request_at: surface.sd.last_request_at,
        selected: false,
        id: surface.id,
        format: surface.format,
        CPT: parseFloat(surface.CPT ? surface.CPT : floorData.cpt).toFixed(2),
        CPTRecommend: 0,

        PPVday: parseFloat(
            surface.PPVday ? surface.PPVday : floorData.ppvDay
        ).toFixed(2),
        PPVdayRecommend: 0,

        PPVnight: parseFloat(
            surface.PPVnight ? surface.PPVnight : floorData.ppvNight
        ).toFixed(2),
        PPVnightRecommend: 0,
    }));

    return mappedSurfaces;
}

/**
 * DAL для indoor поверхностей
 * @param {Array} surfaces Список поверхностей
 */
export function indoorSurfacesDAL(surfaces) {
    return indoorSurfaceDAL.backendToFrontend(surfaces);
}
