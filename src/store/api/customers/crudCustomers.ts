import { ApiResponse, Customer } from "../../../global/index";
import { сustomers } from "../../../routes/api";
import { axiosConfig } from "../axios.config";

export async function getCustomers(): Promise<Customer[]> {
    const response = await axiosConfig.get(сustomers());
    return response.data.values;
}

export async function getCustomersById(id: number): Promise<Customer[]> {
    const response = await axiosConfig.get(`${сustomers()}/${id}`);
    return response.data.values;
}

export async function postCustomers(name: string): Promise<ApiResponse> {
    const response = await axiosConfig.post(сustomers(), {
        name: name,
    })

    return response.data.values;
}

export async function deleteCustomers(ids: number[]): Promise<ApiResponse> {
    const response = await axiosConfig.delete(сustomers(), { data: ids })
    return response.data.values;
}

export async function editCustomer(customer: Customer): Promise<ApiResponse> {
    const response = await axiosConfig.put(сustomers(), {
        id: customer.id,
        name: customer.name
    })
    return response.data.values;
}