import { ApiResponse, Trip, WorkersTripRequest } from "../../../global/index";
import { trips } from "../../../routes/api";
import { axiosConfig } from "../axios.config";

export async function getTrips(): Promise<Trip[]> {
    const response = await axiosConfig.get(trips());
    return response.data.values;
}

export async function postTrip(
    description: string,
    customer: number,
    startDate: string,
    endDate: string,
    workersTrip: WorkersTripRequest[]
): Promise<ApiResponse> {
    const response = await axiosConfig.post(trips(), {
        description: description,
        customer: customer,
        startDate: startDate,
        endDate: endDate,
        workersTrip: workersTrip
    })

    return response.data.values;
}

export async function deleteTrip(ids: number[]): Promise<ApiResponse> {
    const response = await axiosConfig.delete(trips(), { data: ids })
    return response.data.values;
}