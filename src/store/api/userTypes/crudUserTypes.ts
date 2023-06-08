import { UserType } from '../../../global/index';
import { userTypes } from '../../../routes/api';
import { axiosConfig } from '../axios.config';

export async function getUserTypes(): Promise<UserType[]> {
  const response = await axiosConfig.get(userTypes());
  return response.data.values;
}
