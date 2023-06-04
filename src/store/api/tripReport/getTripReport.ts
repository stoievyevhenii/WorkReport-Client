import fileDownload from 'js-file-download';
import { tripReport } from '../../../routes/api';
import { axiosConfig } from '../axios.config';

export async function getTripsReport() {
  await axiosConfig
    .get(`${tripReport()}?type=xlsx`, {
      responseType: 'blob',
    })
    .then((res) => {
      fileDownload(res.data, 'tripReport.xlsx');
    });
}
