import { UnitMeasurement } from '../../../global/index';
import { unitMeasurement } from '../../../routes/api';
import { axiosConfig } from '../axios.config';

export async function getUnitMeasurement(): Promise<UnitMeasurement[]> {
  const response = await axiosConfig.get(unitMeasurement());
  return response.data.values;
}
