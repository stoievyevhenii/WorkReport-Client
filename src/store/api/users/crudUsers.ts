import { ApiResponse, User, UserAddRequest } from '../../../global/index';
import { users } from '../../../routes/api';
import { axiosConfig } from '../axios.config';

export async function getUsers(): Promise<User[]> {
  const response = await axiosConfig.get(users());
  return response.data.values;
}

export async function getUserById(id: number): Promise<UserAddRequest> {
  const response = await axiosConfig.get(`${users()}/${id}`);
  return response.data.values[0];
}

export async function postUser(data: UserAddRequest): Promise<ApiResponse> {
  const response = await axiosConfig.post(users(), {
    login: data.login,
    password: data.password,
    firstName: data.firstName,
    lastName: data.lastName,
    userTypeID: data.userTypeID,
  });

  return response.data.values;
}

export async function deleteUser(id: number): Promise<ApiResponse> {
  const response = await axiosConfig.delete(`${users()}/?id=${id}`);
  return response.data.values;
}

export async function putUser(data: UserAddRequest): Promise<ApiResponse> {
  const response = await axiosConfig.put(users(), {
    id: data.id,
    login: data.login,
    password: data.password,
    firstName: data.firstName,
    lastName: data.lastName,
    userTypeID: data.userTypeID,
  });

  return response.data.values;
}

export async function blockUser(id: number): Promise<ApiResponse> {
  const response = await axiosConfig.put(users(), {
    id: id,
    isLocked: true,
  });

  return response.data.values;
}

export async function unblockUser(id: number): Promise<ApiResponse> {
  const response = await axiosConfig.put(users(), {
    id: id,
    isLocked: false,
  });

  return response.data.values;
}
