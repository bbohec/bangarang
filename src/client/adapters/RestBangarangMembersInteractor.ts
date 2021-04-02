//import { bangarangMemberNotFoundError, BangarangMembersInteractorContract } from "../port/interactors/BangarangMembersInteractorContract";
import type { MemberClaim } from "../port/MemberClaim";
import type { UserContract } from "../port/UserContact";
//import { Credentials, credentialsMissing } from "../port/bangarangMemberCredential";
import type { ClaimChoice } from "../port/ClaimChoice";
import axios, { AxiosError } from 'axios';
import type { BangarangMembersInteractorContract } from "../port/interactors/BangarangMembersInteractorContract";
import type { Credentials } from "../port/bangarangMemberCredential";
export class RestBangarangMembersInteractor implements BangarangMembersInteractorContract {
    public isMemberExistWithUsername(username: string): Promise<boolean|Error> {
        const apiCall = `http://localhost:3000/api/isMemberExistWithUsername/${username}`;
        return axios
            .get<{ isMemberExistWithUsername?: boolean }>(apiCall)
            .then(response => (response.data.isMemberExistWithUsername !== undefined)?response.data.isMemberExistWithUsername:new Error ("isMemberExistWithUsername missing on body."))
            .catch((error:AxiosError)=> this.handleAxiosError(apiCall,error))
    }
    private handleAxiosError(apiCall:string,error: AxiosError): Error {
        console.log(apiCall)
        console.log(error.response?.data)
        return error
    }
    public isSignedIn(username: string): Promise<boolean|Error> {
        const apiCall = `http://localhost:3000/api/isSignedIn/${username}`;
        return axios
            .get<{ isSignedIn?: boolean }>(apiCall)
            .then(response =>(response.data.isSignedIn !== undefined)?response.data.isSignedIn:new Error ("isSignedIn missing on body."))
            .catch((error:AxiosError)=> this.handleAxiosError(apiCall,error))
    }
    public retrievePreviousMemberClaimChoiceOnClaim(username:string,claimTitle:string): Promise<ClaimChoice|Error> {
        const apiCall=(`http://localhost:3000/api/retrievePreviousMemberClaimChoiceOnClaim/${username}/${claimTitle}`)
        return axios
            .get<{ retrievePreviousMemberClaimChoiceOnClaim?: ClaimChoice }>(`http://localhost:3000/api/retrievePreviousMemberClaimChoiceOnClaim/${username}/${claimTitle}`)
            .then(response => response.data.retrievePreviousMemberClaimChoiceOnClaim)
            .catch((error:AxiosError)=> this.handleAxiosError(apiCall,error))
    }
    public saveCredentials(credentials: Credentials): Promise<void|Error> {
        return this.axiosPost(`http://localhost:3000/api/saveCredentials`, credentials)
    }
    public saveMember(userContract: UserContract): Promise<void|Error> {
        return this.axiosPost(`http://localhost:3000/api/saveMember`, userContract)
    }
    public saveMemberClaim(memberClaim: MemberClaim): Promise<void|Error> {
        return this.axiosPost(`http://localhost:3000/api/saveMemberClaim`, memberClaim)
    }
    public signingIn(credentials: Credentials):Promise<void|Error> {
        return this.axiosPost(`http://localhost:3000/api/signingIn`, credentials)
    }
    private axiosPost(url: string, data: any): Promise<void | Error> {
        return axios({url,method:'POST',data})
            .then(response => {if (response.status !== 204)throw new Error(response.statusText);})
            .catch((error: AxiosError) => this.handleAxiosError(url, error));
    }
}
