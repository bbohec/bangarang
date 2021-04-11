import axios, { AxiosError, AxiosRequestConfig } from "axios";
import type { ApiPrefix } from "../../server";
export class RestInteractor {
    constructor (restEndpointConfiguration:RestEndpointConfiguration){
        if(!(restEndpointConfiguration.scheme === "http" || restEndpointConfiguration.scheme === "https") ||
            restEndpointConfiguration.endpointFullyQualifiedDomainName === undefined
        ) throw new Error (`restEndpointConfiguration not supported: ${JSON.stringify(restEndpointConfiguration)} `)
        const ressourceName = `${restEndpointConfiguration.endpointFullyQualifiedDomainName}${(restEndpointConfiguration.port)?`:${restEndpointConfiguration.port}`:``}`
        this.baseUrl = `${restEndpointConfiguration.scheme}://${ressourceName}/${restEndpointConfiguration.apiPrefix}`   
    }
    public get<T>(request:string,queryParams?:Record<string, string>):Promise<T|Error> {
        const axiosRequestConfig:AxiosRequestConfig = {
            params:new URLSearchParams(queryParams),
            headers:{'Access-Control-Allow-Origin':'*'}
        }
        return axios.get<T>(`${this.baseUrl}${request}`,axiosRequestConfig)
            .then(response => (response.status===200)?response.data:new Error(response.statusText))
            .catch((error:AxiosError)=> this.axiosErrorToError(error))
    }
    public post(request: string, data: any): Promise<void | Error> {
        const axiosRequestConfig:AxiosRequestConfig={
            url:`${this.baseUrl}${request}`,
            method:'POST',
            headers:{'Access-Control-Allow-Origin':'*'},
            data
        }
        return axios(axiosRequestConfig)
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
    endpointFullyQualifiedDomainName:string|undefined,
    port:string|undefined,
    scheme:string|undefined
    apiPrefix:ApiPrefix,

}