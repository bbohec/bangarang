import type { ClaimContract, ClaimTitle, ClaimType, Identifier } from "../../port/ClaimContract";
import type { BangarangAdaptersContract } from "../../port/BangarangAdaptersContract";
import type { UserContract } from "../../port/UserContact";
import type { ClaimChoice } from "../../port/ClaimChoice";
import type { CommandName } from "../../port/Command";
import { Registering } from "../commands/registering";
import { Claiming } from "../commands/claiming";
import { SearchingClaims } from "../commands/searchingClaims";
import { RetrievingClaimById } from "../commands/retrievingClaimById";
import { DeclaringClaim } from "../commands/declaringClaim";
import { SigningIn } from "../commands/signingIn";
export class User  {
    constructor(bangarangAdapters: BangarangAdaptersContract) {
        this.bangarangAdapters = bangarangAdapters;
    }
    public registering(userContract:UserContract,password:string):Promise<void> {
        this.registerUserContract=userContract
        this.password=password
        return this.executeCommand("Registering")
    }
    public claiming(claimId: string, claimChoice: ClaimChoice):Promise<void> {
        this.currentClaimId = claimId
        this.currentClaimChoice = claimChoice
        return this.executeCommand("Claiming")
    }
    public searchingClaims(searchCriteria: string):Promise<void> {
        this.searchCriteria = searchCriteria
        return this.executeCommand("Searching Claims")
    }
    public retrievingClaimById(claimId: string):Promise<void> {
        this.currentClaimId = claimId
        return this.executeCommand("Retrieving Claim By Id")
    }
    public declaringClaim(claimTitle:ClaimTitle,claimType:ClaimType,claimId:Identifier):Promise<void> {
        this.claimToDeclare={title:claimTitle,type:claimType,peopleClaimed:0,peopleClaimedFor:0,peopleClaimedAgainst:0,id:claimId}
        return this.executeCommand("Declaring Claim")
    }
    public signingIn(username:string,password:string):Promise<void> {
        this.username=username
        this.password=password
        return this.executeCommand("Signing In")
    }
    public retrieveSignedInUserContract():UserContract|undefined {
        return this.bangarangAdapters.bangarangUserInterfaceInteractor.retrieveSignedInUserContract()
    }
    private executeCommand(commandName:CommandName):Promise<void> {
        const commands = [
            new Registering(this.bangarangAdapters,this.registerUserContract,this.password),
            new Claiming(this.bangarangAdapters,this.currentClaimId,this.currentClaimChoice),
            new SearchingClaims(this.bangarangAdapters,this.searchCriteria),
            new RetrievingClaimById(this.bangarangAdapters,this.currentClaimId),
            new DeclaringClaim(this.bangarangAdapters,this.claimToDeclare),
            new SigningIn(this.bangarangAdapters,this.username,this.password)
        ]
        const command = commands.find(command=>command.name===commandName)
        if(command === undefined) return Promise.reject("NOT IMPLEMENTED")
        return command.execute()
    }
    private registerUserContract : UserContract|undefined = undefined
    private username: string | undefined = undefined
    private password:string|undefined = undefined
    private currentClaimId:string|undefined = undefined
    private currentClaimChoice:ClaimChoice|undefined = undefined
    private searchCriteria:string|undefined = undefined
    private claimToDeclare:ClaimContract|undefined = undefined
    private bangarangAdapters: BangarangAdaptersContract;
}
