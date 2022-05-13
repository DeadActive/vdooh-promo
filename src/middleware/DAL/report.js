export function reportDAL(response) {
  if (!response.report) return {};
  const {
    gotMoreLines,
    reportData,
    report,
    state,
  } = response;

  const data = { total: {}, };
  const total = report.grand_total;
  if (total) {
    data.total.averageDisplayCost = Math.abs(parseFloat(total.average_display_cost_RUR).toFixed(2));
    data.total.total = Number(parseFloat(Math.abs(total.total_RUR)).toFixed(2)).toLocaleString('ru');
    data.total.averageOTS = Number(total.average_OTS);
    data.total.fillrate = Number(total.fill_rate);
    data.total.rowCount = Number(total.row_count);
    data.total.totalOTS = Number(total.total_OTS);
  }

  const pacifier = {
    priceThousandContacts: 0,
    priceOneShow: 0,
    request_qnt: 0,
    NETWORKID: '',
    SURFACEID: '',
    show_qnt: 0,
    video_id: 0,
    expense: 0,
    period: 0,
    goal: '0%',
    ots: 0,
  }

  const reportItems = report.atomic.map(
    item => {
      if (!item) return;
      let newItem = {
        NETWORKID: item.group.NETWORKID || '',
        SURFACEID: item.group.SURFACEID,

        priceThousandContacts: parseFloat(item.total.OTS_per_mille).toFixed(2),
        priceOneShow: parseFloat(Math.abs(item.total.average_display_cost_RUR)).toFixed(2),

        expense: parseFloat(item.total.total_RUR).toFixed(2),
        requestQnt: item.total.row_count,
        showQnt: item.total.row_count,
        videoId: item.group.video_id,
        ots: item.total.total_OTS,

        period: item.date,
      };
      if (item.surface_network_data) {
        const surfaceData = item.surface_network_data;
        newItem.surfaceLocation = normalType(surfaceData.surface_type, state);
        newItem.surfaceFormat = surfaceData.outdoor_format;
        newItem.address = surfaceData.surface_address;
        newItem.CITYID = getCities(surfaceData.CITYID, state);
      }

      const translationDataItem = item.translation_data;
      if (translationDataItem) {
        const translationData = {
          budget: parseFloat(translationDataItem.budget_RUR || 0).toFixed(2),
          translationId: translationDataItem.id,
          title: translationDataItem.title,
          goal: translationDataItem.fill_budget
            ? parseFloat(translationDataItem.fill_budget.split('%')[0]).toFixed(2)
            : 0,
        };
        newItem = {...newItem, ...translationData };
      }
      return newItem;
    }
  );

  if ((gotMoreLines || reportItems.length) && reportData.row_offset) {
    const length = reportData.row_offset + reportData.row_limit;
    
    data.reportItems = Array.apply(null, Array(length)).map(() => pacifier);
    if (!reportData.row_offset) {
      data.reportItems.splice(0, 0, ...reportItems);
    }
    else {
      data.reportItems.splice(reportData.row_offset, 0, ...reportItems);
    }
    data.reportItems.push(pacifier);
    if (reportItems.length < reportData.row_offset) data.reportItems.length = reportData.row_offset + reportItems.length;
    }
  else data.reportItems = reportItems;
  return data;
};

export function clientReportDAL({ report, clients }) {
  if (!report) return [];
  const total = {
    totalSystems: parseFloat(report.grand_total.total_systems_RUR).toFixed(2),
    expense: parseFloat(report.grand_total.total_operators_RUR).toFixed(2),
    income: parseFloat(report.grand_total.total_RUR).toFixed(2),
  };

  
  const reportItems = report.atomic.map(item => {
    const CLIENTID = item.group.CLIENTID;
    const clientName = clients[CLIENTID].client_name;

    return ({
      totalSystems: parseFloat(item.total.total_systems_RUR).toFixed(2),
      expense: parseFloat(item.total.total_operators_RUR).toFixed(2),
      income: parseFloat(item.total.total_RUR).toFixed(2),
      period: item.date,
      displayName: `${clientName} (${CLIENTID})`,
      clientName,
      CLIENTID,
    })
  });

  return {
    reportItems,
    total,
  };
};

function normalType(value, state) {
  if (!value) return;
  const type = state.types.indoorFormat.find(f => f.value === value);
  return (type && type.name) || value;
};
function getCities(CITYID, state) {
  if (!CITYID) return;
  const city = state.types.cities.find(f => f.CITYID === CITYID);
  return (city && city.nameRu) || CITYID;
};
