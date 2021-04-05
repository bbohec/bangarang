import axios, { AxiosError } from "axios";
export class RestInteractor {
    public specificWithUrlPrefix(apiPrefix: string) {
        this.apiPrefix = apiPrefix
    }
    public get<T>(method:string):Promise<T|Error> {
        const url = `${this.scheme}://${this.endpointFullyQualifiedDomainName}:${this.port}/${this.apiPrefix}${method}`
        return axios.get<T>(url)
            .then(response => (response.status===200)?response.data:new Error(response.statusText))
            .catch((error:AxiosError)=> error)
    }
    public post(request: string, data: any): Promise<void | Error> {
        const url = `${this.scheme}://${this.endpointFullyQualifiedDomainName}:${this.port}/${this.apiPrefix}${request}`
        return axios({url,method:'POST',data})
            .then(response => {if (response.status !== 200)throw new Error(response.statusText)})
            .catch((error: AxiosError) => error);
    }
    private apiPrefix:string='fake'
    private port:string='3000'
    private endpointFullyQualifiedDomainName:string = 'localhost'
    private scheme:"http"|"https"="http"
}