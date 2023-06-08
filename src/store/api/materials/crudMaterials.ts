import { ApiResponse, Material, MaterialRequest } from '../../../global/index';
import { materials } from '../../../routes/api';
import { axiosConfig } from '../axios.config';

export async function getMaterials(): Promise<Material[]> {
  const response = await axiosConfig.get(materials());
  return response.data.values;
}

export async function getMaterialsById(id: number): Promise<Material[]> {
  const response = await axiosConfig.get(`${materials()}/${id}`);
  return response.data.values;
}

export async function editMaterial(
  material: MaterialRequest
): Promise<Material[]> {
  const response = await axiosConfig.put(materials(), {
    id: material.id,
    name: material.name,
    description: material.description,
    count: material.count,
  });
  return response.data.values;
}

export async function postMaterials(
  name: string,
  description: string,
  count: number,
  unit: number
): Promise<ApiResponse> {
  const response = await axiosConfig.post(materials(), {
    name: name,
    description: description,
    count: count,
    unit: unit,
  });

  return response.data.values;
}

export async function deleteMaterials(ids: number[]): Promise<ApiResponse> {
  const response = await axiosConfig.delete(materials(), { data: ids });
  return response.data.values;
}
