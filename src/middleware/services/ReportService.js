import webClient from "@mdw/WebClient";
import { clientReportDAL, reportDAL } from "@dal/report";

export default {
  /**
   * Загрузка общего отчета
   * @param {Object} reportData Конфигурация отчета
   * @param {Object} state VueX состояние
   */
  async loadReport(reportData, state) {
    const {
      got_more_lines: gotMoreLines,
      report_data: report,
      xlsx_url: url
    } = (await webClient.post("report", reportData)).data.report;

    if (reportData.file !== undefined) {
      return url;
    }

    return reportDAL({
      gotMoreLines,
      reportData,
      report,
      state
    });
  },
  /**
   * Загрузка данных по охвату конкретной РК
   * @param {Number} translationId ID РК
   */
  loadReachChart(translationId) {
    return webClient.get("dmp_wrapper.reachChart", { translationId });
  },

  /**
   * Загрузка списка отчетов по показам
   * @param {String} CLIENTID ID клиента
   * @param {FilterIt} filterIt Объект для пагинации отчета
   */
  loadReportByDisplay(CLIENTID, filterIt) {
    return webClient.post("report.detailed.list", {
      CLIENTID,
      filterIt
    });
  },
  /**
   * Генерирование нового отчета по показам
   * @param {String} CLIENTID ID клиента
   * @param {String} startDate Дата начала периода
   * @param {String} endDate Дата конца периода
   */
  generateReport(CLIENTID, startDate, endDate) {
    return webClient.post("report.detailed.create", {
      period_from: startDate,
      period_to: endDate,
      CLIENTID
    });
  },

  /**
   * Загрузка отчета по клиентам
   * @param {String} CLIENTID ID клиента
   * @param {Strign} startDate Дата начала периода
   * @param {Strign} endDate Дата конца периода
   */
  async loadReportByClients(CLIENTID, startDate, endDate) {
    const { __c_to_name: clients, report_data: report } = (await webClient.post(
      "report",
      {
        report_CLIENTID: CLIENTID,
        group_display: "CLIENTID",
        group_period: "month",
        report_for: "agency",
        start_on: startDate,
        end_on: endDate,
        all: 1
      }
    )).data.report;

    return clientReportDAL({ clients, report });
  },

  /**
   * Загрузка отчета план/факт
   * @param {Object} reponseData Объект для пагинации и фильтрации
   */
  async loadPlanFact(reponseData) {
    return webClient.post("vg.plan_fact", reponseData);
  },

  /**
   * Загрузка медиаплана план/факт
   * @param {Object} id ID РК
   */
  async loadMediaplan(id) {
    return webClient.post("vg.mp", { id });
  },

  /**
   * Загрузка фотоотчета
   * @param {Number} id ID РК
   */
  loadPhotoReport(id) {
    return webClient.post("translations.get_proofs", { id });
  },

  /**
   * Загрузка данных по сегментам аудитории конкретной РК
   * @param {Number} translationId ID РК
   * @param {Strign} startsOn Дата начала периода
   * @param {Strign} endsOn Дата конца периода
   */
  loadAudienceSegments(translationId, startsOn, endsOn) {
    return webClient.get("dmp_wrapper.translationAudience", {
      translationId,
      startsOn,
      endsOn
    });
  },

  /**
   * Загрузка списка отчетов по сегментам аудитории конкретной РК
   * @param {FilterIt} filterIt Объект для пагинации отчета
   */
  loadAudienceSegmentsTasks(filterIt) {
    return webClient.post("clientid.audience_tasks", {
      filterIt
    });
  },

  /**
   * Удаление отчета по сегментам из списка 
   * @param {Number} id ID записи
   */
   deleteReport(id) {
    return webClient.post("clientid.audience_tasks.delete", {
      id
    });
  }
};
