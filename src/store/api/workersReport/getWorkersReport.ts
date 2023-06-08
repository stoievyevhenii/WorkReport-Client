import fileDownload from 'js-file-download';
import { ReportRequest } from '../../../global';
import { tripReport } from '../../../routes/api';
import { axiosConfig } from '../axios.config';

export async function getTripsReport(request: ReportRequest) {
  await axiosConfig
    .get(
      `${tripReport()}?type=xlsx&reportType=${request.reportType}&StartDate=${
        request.StartDate
      }&EndDate=${request.EndDate}`,
      {
        responseType: 'blob',
      }
    )
    .then((res) => {
      fileDownload(res.data, 'workers-report.xlsx');
    });
}
