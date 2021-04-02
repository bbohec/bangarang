import type { ClaimContract, ClaimContractWithMemberPreviousClaimChoice, ClaimTitle, ClaimType, Identifier } from "../port/ClaimContract";
import type { BangarangAdaptersContract } from "../port/BangarangAdaptersContract";
import type { UserContract } from "../port/UserContact";
import { alreadySignedInSigningInNotification, badCredentialsSigningInNotification, SigningInUserNotificationContract, SigningInUserNotificationInteractorContract, successSigningInNotification } from "../port/interactors/SigningInUserNotificationInteractorContract";
import { claimAlreadyExistDeclaringClaimUserNotification, claimWithoutTitleDeclaringClaimUserNotification, claimWithoutTypeDeclaringClaimUserNotification, successDeclaringClaimUserNotification } from "../port/interactors/DeclaringClaimUserNotificationInteractorContract";
import { claimNotDeclaredRetrievingClaimUserNotification, successRetrievingClaimUserNotification, unexpectedErrorRetrievingClaimUserNotification } from "../port/interactors/RetrievingClaimUserNotificationInteractorContract";
import { successSearchingClaimsUserNotification, unexpectedErrorSearchingClaimsUserNotification } from "../port/interactors/SearchingClaimsUserNotificationInteractorContract";
import { ClaimingUserNotificationContract, claimNotDeclaredClaimingUserNotification, multipleTimesClaimingUserNotification, mustBeSignedInClaimingUserNotification, successClaimingUserNotification, unexpectedErrorClaimingUserNotification } from "../port/interactors/ClaimingUserNotificationInteractorContract";
import type { ClaimChoice } from "../port/ClaimChoice";
import { StaticView } from "../port/interactors/BangarangUserInterfaceInteractor";
import { Claim } from "./Claim";
import { alreadyMemberRegisteringUserNotification, badEmailRegisteringUserNotification, successRegisteringUserNotification, unsecurePasswordRegisteringUserNotification } from "../port/interactors/RegisteringUserNotificationInteractorContract";
export class User implements UserContract  {
    constructor(userContract: UserContract, bangarangAdapters: BangarangAdaptersContract) {
        this.username = userContract.username;
        this.fullname = userContract.fullname;
        this.email = userContract.email;
        this.bangarangAdapters = bangarangAdapters;
    }
    public registering(password:string):Promise<void> {
        return this.bangarangAdapters.bangarangMembersInteractor.isMemberExistWithUsername(this.username)
            .then(isMemberExistWithUsername => {
                if(isMemberExistWithUsername instanceof Error) throw new Error("NOT IMPLEMENTED")
                else if (isMemberExistWithUsername)
                    return Promise.resolve(this.bangarangAdapters.registeringUserNotificationInteractor.notify(alreadyMemberRegisteringUserNotification))
                else if(!this.bangarangAdapters.passwordInteractor.isPasswordSecure(password))
                    return Promise.resolve(this.bangarangAdapters.registeringUserNotificationInteractor.notify(unsecurePasswordRegisteringUserNotification))
                else if(this.bangarangAdapters.emailInteractor.isEmailValid(this.email)){
                    return this.bangarangAdapters.bangarangMembersInteractor.saveMember({username:this.username,fullname:this.fullname,email:this.email})
                        .then(result=>this.bangarangAdapters.bangarangMembersInteractor.saveCredentials({username:this.username,password}))
                        .then(result => this.bangarangAdapters.registeringUserNotificationInteractor.notify(successRegisteringUserNotification))
                } else return Promise.resolve(this.bangarangAdapters.registeringUserNotificationInteractor.notify(badEmailRegisteringUserNotification))
            })
        
    }
    public claiming(claimId: string, claimChoice: ClaimChoice):Promise<void> {
        const retreivedClaim = this.bangarangAdapters.bangarangClaimInteractor.claimById(claimId)
        if (retreivedClaim instanceof Error) return Promise.resolve(this.bangarangAdapters.claimingUserNotificationInteractor.notify(claimNotDeclaredClaimingUserNotification(claimId)))
        else{
            return this.bangarangAdapters.bangarangMembersInteractor.isSignedIn(this.username)
                .then(isSignedIn=>{
                    if (!isSignedIn){
                        this.bangarangAdapters.bangarangUserInterfaceInteractor.goToSigningInMenu()
                        throw mustBeSignedInClaimingUserNotification
                    }
                    return this.bangarangAdapters.bangarangMembersInteractor.retrievePreviousMemberClaimChoiceOnClaim(this.username, retreivedClaim.title)
                })
                .then(previousClaimChoice=> {
                    const isUserHasPreviouslyMadeTheSameClaimChoice=(previousClaimChoice:ClaimChoice,claimChoice:ClaimChoice):boolean => previousClaimChoice !==undefined && previousClaimChoice === claimChoice
                    if(previousClaimChoice instanceof Error) throw unexpectedErrorClaimingUserNotification(previousClaimChoice)
                    else if (isUserHasPreviouslyMadeTheSameClaimChoice(previousClaimChoice,claimChoice))throw multipleTimesClaimingUserNotification(claimChoice)
                    else {
                        new Claim(retreivedClaim)
                            .increasePeopleClaimedWhenNoPreviousClaimChoice(previousClaimChoice)
                            .removePreviousClaimOnClaim(previousClaimChoice)
                            .increaseClaimChoiseFromClaimChoice(claimChoice)
                            .save(this.bangarangAdapters.bangarangClaimInteractor,this.bangarangAdapters.bangarangMembersInteractor,this.username,claimChoice)
                        this.bangarangAdapters.claimingUserNotificationInteractor.notify(successClaimingUserNotification)
                    }
                }).catch((notification:ClaimingUserNotificationContract) => this.bangarangAdapters.claimingUserNotificationInteractor.notify(notification))
        }
    }
    public searchingClaims(searchCriteria: string):void {
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
            .retrieveClaimsThatContainInNotCaseSensitiveTitleOneOrMoreSearchCriteriaWords(sentenceIntoWords(searchCriteria.toLowerCase(),wordSeparator))
        if (retreivedClaims instanceof Error) {this.bangarangAdapters.searchingClaimsUserNotificationInteractor.notify(unexpectedErrorSearchingClaimsUserNotification(retreivedClaims))}
        else {
            retreivedClaims.sort((nextClaim,previousClaim)=>claimSortEngine(nextClaim,previousClaim,searchCriteria))
            this.bangarangAdapters.searchingClaimsUserNotificationInteractor.notify(successSearchingClaimsUserNotification(retreivedClaims))
        }
            
        
    }
    public retrievingClaimById(id: string):void {
        const claim = this.bangarangAdapters.bangarangClaimInteractor.claimById(id)
        if (claim instanceof Error)  this.bangarangAdapters.retrievingClaimUserNotificationInteractor.notify(claimNotDeclaredRetrievingClaimUserNotification)
        else {
            this.bangarangAdapters.bangarangMembersInteractor.retrievePreviousMemberClaimChoiceOnClaim(this.username, claim.title)
                .then(previousMemberClaimChoiceOnClaim => {
                    if(previousMemberClaimChoiceOnClaim instanceof Error)this.bangarangAdapters.retrievingClaimUserNotificationInteractor.notify(unexpectedErrorRetrievingClaimUserNotification(previousMemberClaimChoiceOnClaim))
                    else {
                            const claimWithMemberPreviousClaimChoice:ClaimContractWithMemberPreviousClaimChoice = {
                            title:claim.title,
                            type:claim.type,
                            peopleClaimed:claim.peopleClaimed,
                            peopleClaimedAgainst:claim.peopleClaimedAgainst,
                            peopleClaimedFor:claim.peopleClaimedFor,
                            previousUserClaimChoice:previousMemberClaimChoiceOnClaim,
                            id:claim.id
                        }
                        this.bangarangAdapters.retrievingClaimUserNotificationInteractor.notify(successRetrievingClaimUserNotification(claimWithMemberPreviousClaimChoice))
                    }
                })
        }
    }
    public declaringClaim(claimTitle:ClaimTitle,claimType:ClaimType,claimId:Identifier):void {
        if (claimTitle === "") this.bangarangAdapters.declaringClaimUserNotificationInteractor.notify(claimWithoutTitleDeclaringClaimUserNotification)
        //else if (claimType === "")this.bangarangAdapters.declaringClaimUserNotificationInteractor.notify(claimWithoutTypeDeclaringClaimUserNotification)
        else {
            const isClaimExistByTitleUpperCase = this.bangarangAdapters.bangarangClaimInteractor.isClaimExistByTitleUpperCase(claimTitle)
            if (!isClaimExistByTitleUpperCase) {
                this.bangarangAdapters.bangarangClaimInteractor.saveClaim({title:claimTitle,type:claimType,peopleClaimed:0,peopleClaimedFor:0,peopleClaimedAgainst:0,id:claimId})
                this.bangarangAdapters.declaringClaimUserNotificationInteractor.notify(successDeclaringClaimUserNotification)
            } else this.bangarangAdapters.declaringClaimUserNotificationInteractor.notify(claimAlreadyExistDeclaringClaimUserNotification(claimTitle))
            const retrievedClaim = (isClaimExistByTitleUpperCase)?this.bangarangAdapters.bangarangClaimInteractor.claimByTitleUpperCase(claimTitle):this.bangarangAdapters.bangarangClaimInteractor.claimById(claimId)
            if (retrievedClaim instanceof Error) this.bangarangAdapters.retrievingClaimUserNotificationInteractor.notify(claimNotDeclaredRetrievingClaimUserNotification)
            else this.bangarangAdapters.bangarangUserInterfaceInteractor.goToClaim(retrievedClaim.id)
        } 
    }
    public signingIn(password:string):Promise<void> {
        return this.bangarangAdapters.bangarangMembersInteractor.isSignedIn(this.username)
            .then(isSignedIn=> {
                if(isSignedIn instanceof Error)  throw new Error("NOT IMPLEMENTED")
                else if(isSignedIn === true) throw alreadySignedInSigningInNotification
                // this.bangarangAdapters.signingInUserNotificationInteractor.notify(alreadySignedInSigningInNotification)
                else return this.bangarangAdapters.bangarangMembersInteractor.signingIn({username:this.username,password})
            })
            .then(signingIn=>{
                if (signingIn) throw(badCredentialsSigningInNotification)
                //{
                    //this.bangarangAdapters.signingInUserNotificationInteractor.notify(badCredentialsSigningInNotification)
                    //return 
                //}
                else return this.bangarangAdapters.signingInUserNotificationInteractor.notify(successSigningInNotification)
            })
            .catch((notification:SigningInUserNotificationContract)=>this.bangarangAdapters.signingInUserNotificationInteractor.notify(notification))
        
    }
    /*
    public isSignedIn():boolean{
        const isSignedIn = this.bangarangAdapters.bangarangMembersInteractor.isSignedIn(this.username);
        if (isSignedIn instanceof Error)
        return isSignedIn
    };
    */
    public username: string;
    public fullname: string;
    public email:string;
    private bangarangAdapters: BangarangAdaptersContract;
}

const orderClaims = (claims:ClaimContract[]):ClaimContract[]=> claims.sort((claim,nextClaim)=>{
    return 0
})
