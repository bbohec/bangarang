import type { MemberClaim } from "../port/MemberClaim";
import type { UserContract } from "../port/UserContact";
import type { ClaimChoice } from "../port/ClaimChoice";
import type { BangarangMembersInteractorContract } from "../port/interactors/BangarangMembersInteractorContract";
import type { Credentials } from "../port/bangarangMemberCredential";
import type { RestInteractor } from "./RestInteractor";
export class RestBangarangMembersInteractor implements BangarangMembersInteractorContract {
    constructor(restInteractor:RestInteractor) {
        this.restInteractor= restInteractor
    }
    public isMemberExistWithUsername(username: string): Promise<boolean|Error> {
        return this.restInteractor.get<{ isMemberExistWithUsername?: boolean }>(`/isMemberExistWithUsername/${username}`)
            .then(data => (data instanceof Error)
                    ?data:(data.isMemberExistWithUsername !== undefined)
                    ?data.isMemberExistWithUsername:new Error ("isMemberExistWithUsername missing on body.")
            )
    }
    public isSignedIn(username: string): Promise<boolean|Error> {
        return this.restInteractor.get<{ isSignedIn?: boolean }>(`/isSignedIn/${username}`)
            .then(data =>(data instanceof Error)
                ?data:(data.isSignedIn !== undefined)
                ?data.isSignedIn:new Error ("isSignedIn missing on body.")
            )
    }
    public retrievePreviousMemberClaimChoiceOnClaim(username:string,claimId:string): Promise<ClaimChoice|Error> {
        return this.restInteractor.get<{ retrievePreviousMemberClaimChoiceOnClaim?: ClaimChoice }>(`/retrievePreviousMemberClaimChoiceOnClaim/${username}/${claimId}`)
            .then(data => (data instanceof Error)?data:data.retrievePreviousMemberClaimChoiceOnClaim)
    }
    public saveCredentials(credentials: Credentials): Promise<void|Error> {
        return this.restInteractor.post(`/saveCredentials`, credentials)
    }
    public saveMember(userContract: UserContract): Promise<void|Error> {
        return this.restInteractor.post(`/saveMember`, userContract)
    }
    public saveMemberClaim(memberClaim: MemberClaim): Promise<void|Error> {
        return this.restInteractor.post(`/saveMemberClaim`, memberClaim)
    }
    public signingIn(credentials: Credentials):Promise<void|Error> {
        return this.restInteractor.post(`/signingIn`, credentials)
    }
    public specificReset():Promise<void> {
        return this.restInteractor.post(`/reset`,{})
            .then(result => {if(result instanceof Error) throw result})
    }
    private restInteractor:RestInteractor 
}