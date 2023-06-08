import fileDownload from 'js-file-download';
import { ReportRequest } from '../../../global';
import { materialReport } from '../../../routes/api';
import { axiosConfig } from '../axios.config';

export async function getMaterialsReport(request: ReportRequest) {
  await axiosConfig
    .get(
      `${materialReport()}?type=xlsx&reportType=${
        request.reportType
      }&StartDate=${request.StartDate}&EndDate=${request.EndDate}`,
      {
        responseType: 'blob',
      }
    )
    .then((res) => {
      fileDownload(res.data, 'materils-report.xlsx');
    });
}
