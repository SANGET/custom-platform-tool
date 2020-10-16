import { getDataSourceDetail } from "@provider-app/services";

/**
 * 提取由后端返回的，前端需要的 columns
 */
export const takeColumnsData = (columns: any[]): PD.Column[] => {
  return columns.map((column) => {
    return {
      id: column.id,
      name: column.name,
      dataType: column.dataType,
    };
  });
};

/**
 * 从后端返回的数据提取前端需要用到的数据
 */
export const takeDatasourceField = (datasourceData): PD.Datasource => {
  return {
    name: datasourceData.name,
    id: datasourceData.id,
    type: datasourceData.type,
    moduleId: datasourceData.moduleId,
    columns: takeColumnsData(datasourceData.columns)
  };
};

/**
 * 通过 datasourceId 包装 request 请求
 */
export const dataSourceDetailWrapper = (dataSourcesFromRemote: any[] = []) => {
  const getDataPromise: Promise[] = [];
  dataSourcesFromRemote.forEach((dataS) => {
    const p = getDataSourceDetail(dataS.datasourceId);
    getDataPromise.push(p);
  });
  return Promise.all([...getDataPromise]);
};

/**
 * 通过 datasourceId 从远端获取完整的包括 columns 的数据
 * @param dataSourcesFromRemote
 */
export const takeDatasources = (dataSourcesFromRemote: any[]): Promise<PD.Datasources> => {
  return new Promise((resolve, reject) => {
    dataSourceDetailWrapper(dataSourcesFromRemote)
      .then((remoteDSData) => {
        const nextState: PD.Datasources = [];
        remoteDSData.length > 0 && remoteDSData.forEach((data) => {
          if (data) nextState.push(takeDatasourceField(data));
        });
        resolve(nextState);
      })
      .catch(reject);
  });
};
