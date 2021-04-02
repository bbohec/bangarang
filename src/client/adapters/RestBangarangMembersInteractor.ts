import type { MemberClaim } from "../port/MemberClaim";
import type { UserContract } from "../port/UserContact";
import type { ClaimChoice } from "../port/ClaimChoice";
import type { BangarangMembersInteractorContract } from "../port/interactors/BangarangMembersInteractorContract";
import type { Credentials } from "../port/bangarangMemberCredential";
import axios, { AxiosError } from 'axios';
export class RestBangarangMembersInteractor implements BangarangMembersInteractorContract {
    public specificWithUrlPrefix(apiPrefix: string) {
        this.apiPrefix = apiPrefix
    }
    public isMemberExistWithUsername(username: string): Promise<boolean|Error> {
        return this.axiosGet<{ isMemberExistWithUsername?: boolean }>(`/isMemberExistWithUsername/${username}`)
            .then(data => (data instanceof Error)
                    ?data:(data.isMemberExistWithUsername !== undefined)
                    ?data.isMemberExistWithUsername:new Error ("isMemberExistWithUsername missing on body.")
            )
    }
    public isSignedIn(username: string): Promise<boolean|Error> {
        return this.axiosGet<{ isSignedIn?: boolean }>(`/isSignedIn/${username}`)
            .then(data =>(data instanceof Error)
                ?data:(data.isSignedIn !== undefined)
                ?data.isSignedIn:new Error ("isSignedIn missing on body.")
            )
    }
    public retrievePreviousMemberClaimChoiceOnClaim(username:string,claimTitle:string): Promise<ClaimChoice|Error> {
        return this.axiosGet<{ retrievePreviousMemberClaimChoiceOnClaim?: ClaimChoice }>(`/retrievePreviousMemberClaimChoiceOnClaim/${username}/${claimTitle}`)
            .then(data => (data instanceof Error)?data:data.retrievePreviousMemberClaimChoiceOnClaim)
    }
    public saveCredentials(credentials: Credentials): Promise<void|Error> {
        return this.axiosPost(`/saveCredentials`, credentials)
    }
    public saveMember(userContract: UserContract): Promise<void|Error> {
        return this.axiosPost(`/saveMember`, userContract)
    }
    public saveMemberClaim(memberClaim: MemberClaim): Promise<void|Error> {
        return this.axiosPost(`/saveMemberClaim`, memberClaim)
    }
    public signingIn(credentials: Credentials):Promise<void|Error> {
        return this.axiosPost(`/signingIn`, credentials)
    }
    public specificReset():Promise<void> {
        return this.axiosPost(`/reset`,{})
            .then(result => {if(result instanceof Error) throw result})
    }
    private axiosGet<T>(method:string):Promise<T|Error> {
        const url = `${this.scheme}://${this.endpointFullyQualifiedDomainName}:${this.port}/${this.apiPrefix}${method}`
        return axios.get<T>(url)
            .then(response => (response.status===200)?response.data:new Error(response.statusText))
            .catch((error:AxiosError)=> error)
    }
    private axiosPost(request: string, data: any): Promise<void | Error> {
        const url = `${this.scheme}://${this.endpointFullyQualifiedDomainName}:${this.port}/${this.apiPrefix}${request}`
        return axios({url,method:'POST',data})
            .then(response => {if (response.status !== 200)throw new Error(response.statusText)})
            .catch((error: AxiosError) => error);
    }
    private endpointFullyQualifiedDomainName:string = 'localhost'
    private port:string='3000'
    private apiPrefix:string='fake'
    private scheme:"http"|"https"="http"
}
