import axios, { AxiosError } from "axios";
import type { ApiPrefix } from "../../server";
export class RestInteractor {
    constructor (private apiPrefix:ApiPrefix){}
    public get<T>(method:string,queryParams?:Record<string, string>):Promise<T|Error> {
        const url = `${this.scheme}://${this.endpointFullyQualifiedDomainName}:${this.port}/${this.apiPrefix}${method}`
        return axios.get<T>(url,{params:new URLSearchParams(queryParams)})
            .then(response => (response.status===200)?response.data:new Error(response.statusText))
            .catch((error:AxiosError)=> this.axiosErrorToError(error))
    }
    public post(request: string, data: any): Promise<void | Error> {
        const url = `${this.scheme}://${this.endpointFullyQualifiedDomainName}:${this.port}/${this.apiPrefix}${request}`
        return axios({url,method:'POST',data})
            .then(response => {if (response.status !== 200)throw new Error(response.statusText)})
            .catch((error: AxiosError) => this.axiosErrorToError(error));
    }
    private axiosErrorToError (axiosError:AxiosError):Error|AxiosError {
        if (axiosError.response?.status === 500 && axiosError.response?.data?.error) return new Error(axiosError.response?.data?.error)
        return axiosError
    }
    private port:string='3000'
    private endpointFullyQualifiedDomainName:string = 'localhost'
    private scheme:"http"|"https"="http"
}