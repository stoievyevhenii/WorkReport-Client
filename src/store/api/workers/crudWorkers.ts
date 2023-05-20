import { ApiResponse, Worker } from "../../../global/index";
import { } from "../../../global/Worker/Worker";
import { workers } from "../../../routes/api";
import { axiosConfig } from "../axios.config";

export async function getWorkers(): Promise<Worker[]> {
    const response = await axiosConfig.get(workers());
    return response.data.values;
}

export async function getWorkersById(id: number): Promise<Worker[]> {
    const response = await axiosConfig.get(`${workers()}/${id}`);
    return response.data.values;
}

export async function postWorker(name: string, lastName: string): Promise<ApiResponse> {
    const response = await axiosConfig.post(workers(), {
        lastName: lastName,
        name: name,
    })

    return response.data.values;
}

export async function deleteWorker(ids: number[]): Promise<ApiResponse> {
    const response = await axiosConfig.delete(workers(), { data: ids })
    return response.data.values;
}

export async function editWorker(worker: Worker): Promise<ApiResponse> {
    const response = await axiosConfig.put(workers(), {
        id: worker.id,
        lastName: worker.lastName,
        name: worker.name,
    })
    return response.data.values;
}
