import type { ClaimContract, ClaimContractWithMemberPreviousClaimChoice } from "../port/ClaimContract";
import type { BangarangAdaptersContract } from "../port/BangarangAdaptersContract";
import type { UserContract } from "../port/UserContact";
import { alreadySignedInSigningInNotification, badCredentialsSigningInNotification, successSigningInNotification } from "../port/interactors/SigningInUserNotificationInteractorContract";
import { claimAlreadyExistDeclaringClaimUserNotification, claimWithoutTitleDeclaringClaimUserNotification, claimWithoutTypeDeclaringClaimUserNotification, successDeclaringClaimUserNotification } from "../port/interactors/DeclaringClaimUserNotificationInteractorContract";
import { claimNotDeclaredRetrievingClaimUserNotification, successRetrievingClaimUserNotification } from "../port/interactors/RetrievingClaimUserNotificationInteractorContract";
import { successSearchingClaimsUserNotification } from "../port/interactors/SearchingClaimsUserNotificationInteractorContract";
import { claimNotDeclaredClaimingUserNotification, multipleTimesClaimingUserNotification, mustBeSignedInClaimingUserNotification, successClaimingUserNotification } from "../port/interactors/ClaimingUserNotificationInteractorContract";
import type { ClaimChoice } from "../port/ClaimChoice";
import { StaticView } from "../port/interactors/BangarangUserInterfaceInteractor";
import { Claim } from "./Claim";
export class User implements UserContract  {
    constructor(userContract: UserContract, bangarangAdapters: BangarangAdaptersContract) {
        this.username = userContract.username;
        this.fullname = userContract.fullname;
        this.password = userContract.password;
        this.bangarangAdapters = bangarangAdapters;
    }
    public claiming(claimTitle: string, claimChoice: ClaimChoice):void {
        const retreivedClaim = this.bangarangAdapters.bangarangClaimInteractor.claimByTitle(claimTitle)
        const isUserHasPreviouslyMadeTheSameClaimChoice=(previousClaimChoice:ClaimChoice,claimChoice:ClaimChoice):boolean => previousClaimChoice !==undefined && previousClaimChoice === claimChoice
        if (retreivedClaim instanceof Error) 
            this.bangarangAdapters.claimingUserNotificationInteractor.notify(claimNotDeclaredClaimingUserNotification(claimTitle))
        else if (!this.isSignedIn()){
            this.bangarangAdapters.claimingUserNotificationInteractor.notify(mustBeSignedInClaimingUserNotification)
            this.bangarangAdapters.bangarangUserInterfaceInteractor.goToView(StaticView.SigningInMenu)
        }
        else{
            const previousClaimChoice = this.bangarangAdapters.bangarangMembersInteractor.memberHasClaimedOnClaim(this.username, claimTitle)
            if (isUserHasPreviouslyMadeTheSameClaimChoice(previousClaimChoice,claimChoice))
                this.bangarangAdapters.claimingUserNotificationInteractor.notify(multipleTimesClaimingUserNotification(claimChoice))
            else {
                const updatedClaim = new Claim(retreivedClaim)
                updatedClaim
                    .increasePeopleClaimedWhenNoPreviousClaimChoice(previousClaimChoice)
                    .removePreviousClaimOnClaim(previousClaimChoice)
                    .increaseClaimChoiseFromClaimChoice(claimChoice)
                    .save(this.bangarangAdapters.bangarangClaimInteractor,this.bangarangAdapters.bangarangMembersInteractor,this.username,claimChoice)
                this.bangarangAdapters.claimingUserNotificationInteractor.notify(successClaimingUserNotification)
            }
        }
    }
    public searchClaims(searchCriteria: string):void {
        enum Order {
            keep=0,
            change=-1
        }
        const wordSeparator = " ";
        const sentenceIntoWords = (sentence: string, wordSeparator: string): string[] => sentence.split(wordSeparator);
        function claimSortEngine(nextClaim:ClaimContract, currentClaim:ClaimContract,searchCriteria:string):Order {
            const sentenceWordsNotInOtherSentence = (sentence: string, otherSentence: string): string[] => sentenceIntoWords(sentence, wordSeparator)
                .filter(titleWord => !sentenceIntoWords(otherSentence, wordSeparator).includes(titleWord));
            const sentenceWordsInOtherSentence = (sentence: string, otherSentence: string): string[] => sentenceIntoWords(sentence, wordSeparator)
                .filter(titleWord => sentenceIntoWords(otherSentence, wordSeparator).includes(titleWord));
            const titlesMatchSearchCriteria = (currentClaimTitle: string, nextClaimTitle: string, searchCriteria: string): boolean => {
                const claimTitleWithoutWordsThatAreNotInSearchCriteria = (claimTitle: string, searchCriteria: string): string => sentenceWordsNotInOtherSentence(claimTitle, sentenceWordsNotInOtherSentence(claimTitle, searchCriteria).join(wordSeparator)).join(wordSeparator);
                return claimTitleWithoutWordsThatAreNotInSearchCriteria(currentClaimTitle, searchCriteria) === claimTitleWithoutWordsThatAreNotInSearchCriteria(nextClaimTitle, searchCriteria);
            };
            const isNextClaimHaveMoreSearchCriteriaWordsThanCurrentClaim=()=> sentenceWordsInOtherSentence(searchCriteria.toLowerCase(), currentClaim.title.toLowerCase()).length < sentenceWordsInOtherSentence(searchCriteria.toLowerCase(), nextClaim.title.toLowerCase()).length;
            if (isNextClaimHaveMoreSearchCriteriaWordsThanCurrentClaim()) return Order.change
            if (currentClaim.title.includes(searchCriteria)) return Order.keep;
            if (titlesMatchSearchCriteria(currentClaim.title.toLowerCase(), nextClaim.title.toLowerCase(), searchCriteria.toLowerCase()))return Order.keep;
            if (sentenceWordsNotInOtherSentence(currentClaim.title, searchCriteria).length > 0)return Order.change;
            return Order.keep;
        }
        const retreivedClaims = this.bangarangAdapters.bangarangClaimInteractor
            .findClaimsThatContainInNotCaseSensitiveTitleOneOrMoreSearchCriteriaWords(sentenceIntoWords(searchCriteria.toLowerCase(),wordSeparator))
            .sort((nextClaim,previousClaim)=>claimSortEngine(nextClaim,previousClaim,searchCriteria))
        this.bangarangAdapters
            .searchingClaimsUserNotificationInteractor
            .notify(successSearchingClaimsUserNotification(retreivedClaims))
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
                this.bangarangAdapters.bangarangClaimInteractor.saveClaim(claim)
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
