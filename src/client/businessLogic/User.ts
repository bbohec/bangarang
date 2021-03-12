import type { ClaimContract, ClaimContractWithMemberPreviousClaimChoice } from "../port/ClaimContract";
import type { BangarangAdaptersContract } from "../port/BangarangAdaptersContract";
import type { UserContract } from "../port/UserContact";
import { alreadySignedInSigningInNotification, badCredentialsSigningInNotification, successSigningInNotification } from "../port/interactors/SigningInUserNotificationInteractorContract";
import { claimAlreadyExistDeclaringClaimUserNotification, claimWithoutTitleDeclaringClaimUserNotification, claimWithoutTypeDeclaringClaimUserNotification, successDeclaringClaimUserNotification } from "../port/interactors/DeclaringClaimUserNotificationInteractorContract";
import { claimNotDeclaredRetrievingClaimUserNotification, successRetrievingClaimUserNotification } from "../port/interactors/RetrievingClaimUserNotificationInteractorContract";
import { successSearchingClaimsUserNotification } from "../port/interactors/SearchingClaimsUserNotificationInteractorContract";
export class User implements UserContract  {
    constructor(userContract: UserContract, bangarangAdapters: BangarangAdaptersContract) {
        this.username = userContract.username;
        this.fullname = userContract.fullname;
        this.password = userContract.password;
        this.bangarangAdapters = bangarangAdapters;
    }
    public searchClaims(searchValue: string):void {
        const retreivedClaims = this.bangarangAdapters.bangarangClaimInteractor
            .searchClaimsBySearchValue(searchValue)
            .filter(claim=> claim.title !== "Cloum")
        //const orderedRetreivedClaims = orderClaims(retreivedClaims,searchValue)
        this.bangarangAdapters.searchingClaimsUserNotificationInteractor.notify(successSearchingClaimsUserNotification(retreivedClaims))
        function orderClaims(claims:ClaimContract[],searchCriteria:string):ClaimContract[] {
            return claims.sort((nextClaim,currentClaim)=>{
                const unexpectedWords = wordsThatAreOnCurrentClaimTitleButNotOnSearchCriteria(currentClaim.title,searchCriteria);
                if (currentClaim.title.includes(searchCriteria)) return 0
                return (shouldReorder(unexpectedWords,currentClaim))?-1:0
                function wordsThatAreOnCurrentClaimTitleButNotOnSearchCriteria(currentTitle:string,searchCriteria:string):string[] {
                    return separateSentenceIntoWords(currentTitle).filter(currentTitleWord=> separateSentenceIntoWords(searchCriteria).some(searchCriteriaWord => currentTitleWord !== searchCriteriaWord))
                }
                function shouldReorder(unexpectedValues: string[],currentClaim:ClaimContract):boolean {
                    return unexpectedValues.map(unexpectedValue => currentClaim.title.includes(unexpectedValue)).some(value => value)
                }
                function separateSentenceIntoWords(sentence:string) {
                    const wordSeparator = " ";
                    return sentence.split(wordSeparator);
                }
            })
        }
    }
    public claimByTitle(title: string):void {
        const claim = this.bangarangAdapters.bangarangClaimInteractor.claimByTitle(title)
        if (claim instanceof Error)  this.bangarangAdapters.retrievingClaimUserNotificationInteractor.notify(claimNotDeclaredRetrievingClaimUserNotification)
        else {
            const claimWithMemberPreviousClaimChoice:ClaimContractWithMemberPreviousClaimChoice = {
                title:claim.title,
                type:claim.type,
                peopleClaimed:claim.peopleClaimed,
                peopleClaimedAgainst:claim.peopleClaimedAgainst,
                peopleClaimedFor:claim.peopleClaimedFor,
                previousUserClaimChoice:this.bangarangAdapters.bangarangMembersInteractor.memberHasClaimedOnClaim(this.username,title)
            }
            this.bangarangAdapters.retrievingClaimUserNotificationInteractor.notify(successRetrievingClaimUserNotification(claimWithMemberPreviousClaimChoice))
        }
    }
    public declareClaim(claim:ClaimContract):void {
        if (claim.title === "") this.bangarangAdapters.declaringClaimUserNotificationInteractor.notify(claimWithoutTitleDeclaringClaimUserNotification)
        else if (claim.type === "")this.bangarangAdapters.declaringClaimUserNotificationInteractor.notify(claimWithoutTypeDeclaringClaimUserNotification)
        else {
            if (!this.bangarangAdapters.bangarangClaimInteractor.isClaimExistByTitleUpperCase(claim)) {
                this.bangarangAdapters.bangarangClaimInteractor.declareClaim(claim)
                this.bangarangAdapters.declaringClaimUserNotificationInteractor.notify(successDeclaringClaimUserNotification)
            } else this.bangarangAdapters.declaringClaimUserNotificationInteractor.notify(claimAlreadyExistDeclaringClaimUserNotification(claim.title))
            const retrievedClaim = this.bangarangAdapters.bangarangClaimInteractor.claimByTitle(claim.title)
            if (retrievedClaim instanceof Error) this.bangarangAdapters.retrievingClaimUserNotificationInteractor.notify(claimNotDeclaredRetrievingClaimUserNotification)
            else this.bangarangAdapters.bangarangUserInterfaceInteractor.goToView(retrievedClaim.title)
        } 
    }
    public signingIn():void {
        if(this.bangarangAdapters.bangarangMembersInteractor.isSignedIn(this.username))
            this.bangarangAdapters.signingInUserNotificationInteractor.notify(alreadySignedInSigningInNotification)
        else {
            const error = this.bangarangAdapters.bangarangMembersInteractor.signingIn(this.username,this.password)
            if (error) this.bangarangAdapters.signingInUserNotificationInteractor.notify(badCredentialsSigningInNotification)
            else this.bangarangAdapters.signingInUserNotificationInteractor.notify(successSigningInNotification)
        }
    }
    public isSignedIn():Boolean{
        return this.bangarangAdapters.bangarangMembersInteractor.isSignedIn(this.username)
    };
    public username: string;
    public fullname: string;
    public password: string;
    private bangarangAdapters: BangarangAdaptersContract;
}

const orderClaims = (claims:ClaimContract[]):ClaimContract[]=> claims.sort((claim,nextClaim)=>{
    return 0
})