import { translationDAL } from "./config";

export function translationToFrontendDAL(translation, step) {
    const newTranslation = translationDAL.backendToFrontend([translation])[0];
    const isGuaranteed = translation.deal_group === "gallery!";

    newTranslation.stepper = step;
    newTranslation.translationType = isGuaranteed ? "guaranteed" : "auction";
    if (!isGuaranteed) {
        newTranslation.minIntervalSecs = newTranslation.minIntervalSecs;
    }

    newTranslation.hoursActive = {};
    Object.values(newTranslation.detailWeek).forEach((day) => {
        day.hours = newTranslation.activeHours[day.value] || [];
        newTranslation.hoursActive[day.value] = [];
    });

    newTranslation.withURLTracking =
        newTranslation.trackingURLs && newTranslation.trackingURLs.length;
    // newTranslation.proof = !!newTranslation.proof;

    if (newTranslation.detailWeek.some((d) => d.hours.length)) {
        const workdays = newTranslation.detailWeek.filter(
            (d) => d.type === "workdays"
        );
        const weekdays = newTranslation.detailWeek.filter(
            (d) => d.type === "weekdays"
        );

        const workdaysCount = workdays[0].hours.length;
        const weekdaysCount = weekdays[0].hours.length;

        if (
            workdays.every((d) => d.hours.length === workdaysCount) &&
            weekdays.every((d) => d.hours.length === weekdaysCount)
        ) {
            newTranslation.inDetailPeriod = false;
            newTranslation.notDetailWeek[0].hours = workdays[0].hours;
            newTranslation.notDetailWeek[1].hours = weekdays[0].hours;
        }
    }

    const resources = translation.resources;
    if (resources && resources.length) {
        newTranslation.city = [
            ...new Set(resources.map((r) => r.city_id || r.sd.CITYID)),
        ].filter((c) => !!c);
    }

    newTranslation.planShows = Math.round(
        Number(newTranslation.budget) / Number(newTranslation.displayCost)
    );
    newTranslation.planOTS =
        Math.round(newTranslation.budget / newTranslation.cost) * 1000;
    newTranslation.replaceVideos = !newTranslation.videoID.length;
    newTranslation.oldStartDate = newTranslation.startDate;
    newTranslation.oldEndDate = newTranslation.endDate;

    console.log(newTranslation);
    return newTranslation;
}
