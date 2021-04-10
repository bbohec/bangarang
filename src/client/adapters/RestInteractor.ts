import axios, { AxiosError } from "axios";
import type { ApiPrefix } from "../../server";
export class RestInteractor {
    constructor (restEndpointConfiguration:RestEndpointConfiguration){
        this.baseUrl = `${restEndpointConfiguration.scheme}://${restEndpointConfiguration.endpointFullyQualifiedDomainName}:${restEndpointConfiguration.port}/${restEndpointConfiguration.apiPrefix}`
    }
    public get<T>(request:string,queryParams?:Record<string, string>):Promise<T|Error> {
        return axios.get<T>(`${this.baseUrl}${request}`,{params:new URLSearchParams(queryParams)})
            .then(response => (response.status===200)?response.data:new Error(response.statusText))
            .catch((error:AxiosError)=> this.axiosErrorToError(error))
    }
    public post(request: string, data: any): Promise<void | Error> {
        return axios({url:`${this.baseUrl}${request}`,method:'POST',data})
            .then(response => {if (response.status !== 200)throw new Error(response.statusText)})
            .catch((error: AxiosError) => this.axiosErrorToError(error));
    }
    private axiosErrorToError (axiosError:AxiosError):Error|AxiosError {
        if (axiosError.response?.status === 500 && axiosError.response?.data?.error) return new Error(axiosError.response?.data?.error)
        return axiosError
    }
    private baseUrl:string
}
interface RestEndpointConfiguration {
    endpointFullyQualifiedDomainName:string,
    port:string,
    scheme:"http"|"https"
    apiPrefix:ApiPrefix,

}