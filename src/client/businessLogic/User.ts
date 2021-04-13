import type { ClaimContract, ClaimContractWithMemberPreviousClaimChoice, ClaimTitle, ClaimType, Identifier } from "../port/ClaimContract";
import type { BangarangAdaptersContract } from "../port/BangarangAdaptersContract";
import type { UserContract } from "../port/UserContact";
import { alreadySignedInSigningInNotification, badCredentialsSigningInNotification, SigningInUserNotificationContract, SigningInUserNotificationInteractorContract, successSigningInNotification } from "../port/interactors/SigningInUserNotificationInteractorContract";
import { claimAlreadyExistDeclaringClaimUserNotification, claimWithoutTitleDeclaringClaimUserNotification, claimWithoutTypeDeclaringClaimUserNotification, successDeclaringClaimUserNotification } from "../port/interactors/DeclaringClaimUserNotificationInteractorContract";
import { claimNotDeclaredRetrievingClaimUserNotification, RetrievingClaimUserNotificationContract, successRetrievingClaimUserNotification, unexpectedErrorRetrievingClaimUserNotification } from "../port/interactors/RetrievingClaimUserNotificationInteractorContract";
import { successSearchingClaimsUserNotification, unexpectedErrorSearchingClaimsUserNotification } from "../port/interactors/SearchingClaimsUserNotificationInteractorContract";
import { ClaimingUserNotificationContract, claimNotDeclaredClaimingUserNotification, multipleTimesClaimingUserNotification, mustBeSignedInClaimingUserNotification, successClaimingUserNotification, unexpectedErrorClaimingUserNotification } from "../port/interactors/ClaimingUserNotificationInteractorContract";
import type { ClaimChoice } from "../port/ClaimChoice";
import { Claim } from "./Claim";
import { alreadyMemberRegisteringUserNotification, badEmailRegisteringUserNotification, RegisteringUserNotificationContract, successRegisteringUserNotification, unsecurePasswordRegisteringUserNotification } from "../port/interactors/RegisteringUserNotificationInteractorContract";
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
                if(isMemberExistWithUsername) throw alreadyMemberRegisteringUserNotification
                if(!this.bangarangAdapters.passwordInteractor.isPasswordSecure(password)) throw unsecurePasswordRegisteringUserNotification
                if(!this.bangarangAdapters.emailInteractor.isEmailValid(this.email)) throw badEmailRegisteringUserNotification
                return this.bangarangAdapters.bangarangMembersInteractor.saveMember({username:this.username,fullname:this.fullname,email:this.email})
            })
            .then(result=>{
                if (result instanceof Error ) throw result
                return this.bangarangAdapters.bangarangMembersInteractor.saveCredentials({username:this.username,password})
            })
            .then(result =>{
                if (result instanceof Error ) throw result
                this.bangarangAdapters.registeringUserNotificationInteractor.notify(successRegisteringUserNotification)
            })
            .catch((result:RegisteringUserNotificationContract|Error) => {
                if(result instanceof Error) throw result
                this.bangarangAdapters.registeringUserNotificationInteractor.notify(result)
            })
        
    }
    public claiming(claimId: string, claimChoice: ClaimChoice):Promise<void> {
        return this.bangarangAdapters.bangarangMembersInteractor.isSignedIn(this.username)
            .then(isSignedIn=>{
                if (!isSignedIn){
                    this.bangarangAdapters.bangarangUserInterfaceInteractor.goToSigningInMenu()
                    throw mustBeSignedInClaimingUserNotification
                }
                return Promise.all([
                    this.bangarangAdapters.bangarangClaimInteractor.claimById(claimId),
                    this.bangarangAdapters.bangarangMembersInteractor.retrievePreviousMemberClaimChoiceOnClaim(this.username, claimId)
                ])
            })
            .then(([retreivedClaim,previousClaimChoice])=> {
                const isUserHasPreviouslyMadeTheSameClaimChoice=(previousClaimChoice:ClaimChoice,claimChoice:ClaimChoice):boolean => previousClaimChoice !==undefined && previousClaimChoice === claimChoice
                if (retreivedClaim instanceof Error) throw claimNotDeclaredClaimingUserNotification(claimId)
                if (previousClaimChoice instanceof Error) throw unexpectedErrorClaimingUserNotification(previousClaimChoice)
                else if (isUserHasPreviouslyMadeTheSameClaimChoice(previousClaimChoice,claimChoice))throw multipleTimesClaimingUserNotification(claimChoice)
                return new Claim(retreivedClaim)
                    .increasePeopleClaimedWhenNoPreviousClaimChoice(previousClaimChoice)
                    .removePreviousClaimOnClaim(previousClaimChoice)
                    .increaseClaimChoiseFromClaimChoice(claimChoice)
                    .claiming(this.bangarangAdapters.bangarangClaimInteractor,this.bangarangAdapters.bangarangMembersInteractor,this.username,claimChoice)
            })
            .then(claimingResult=> {
                if(claimingResult instanceof Error) throw unexpectedErrorClaimingUserNotification(claimingResult)
                this.bangarangAdapters.claimingUserNotificationInteractor.notify(successClaimingUserNotification)
            })
            .catch((notification:ClaimingUserNotificationContract) => this.bangarangAdapters.claimingUserNotificationInteractor.notify(notification))
    }
    public searchingClaims(searchCriteria: string):Promise<void> {
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
        return this.bangarangAdapters.bangarangClaimInteractor
            .retrieveClaimsThatContainInIncensitiveCaseTitleOneOrMoreIncencitiveCaseSearchCriteriaWords(searchCriteria)
            .then(retreivedClaims => {
                if (retreivedClaims instanceof Error) {this.bangarangAdapters.searchingClaimsUserNotificationInteractor.notify(unexpectedErrorSearchingClaimsUserNotification(retreivedClaims))}
                else {
                    retreivedClaims.sort((nextClaim,previousClaim)=>claimSortEngine(nextClaim,previousClaim,searchCriteria))
                    this.bangarangAdapters.searchingClaimsUserNotificationInteractor.notify(successSearchingClaimsUserNotification(retreivedClaims))
                }
            })
    }
    public retrievingClaimById(claimId: string):Promise<void> {
        let claim:ClaimContract
        return this.bangarangAdapters.bangarangClaimInteractor.claimById(claimId)
            .then(claimById => {
                if (claimById instanceof Error)  throw (claimNotDeclaredRetrievingClaimUserNotification)
                claim = claimById
                return this.bangarangAdapters.bangarangMembersInteractor.retrievePreviousMemberClaimChoiceOnClaim(this.username, claimId)
            })
            .then(previousMemberClaimChoiceOnClaim => {
                if(previousMemberClaimChoiceOnClaim instanceof Error) throw unexpectedErrorRetrievingClaimUserNotification(previousMemberClaimChoiceOnClaim)
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
            .catch((notification:RetrievingClaimUserNotificationContract)=>this.bangarangAdapters.retrievingClaimUserNotificationInteractor.notify(notification))
    }
    public declaringClaim(claimTitle:ClaimTitle,claimType:ClaimType,claimId:Identifier):Promise<void> {
        const shouldSaveClaimWhenClaimDontExistByTitleUpperCase=(isClaimExistByTitleUpperCase:boolean):Promise<boolean>=> {
            if (!isClaimExistByTitleUpperCase) return new Claim({title:claimTitle,type:claimType,peopleClaimed:0,peopleClaimedFor:0,peopleClaimedAgainst:0,id:claimId})
                .save(this.bangarangAdapters.bangarangClaimInteractor)
                .then(result=> {
                    if (result instanceof Error) throw new Error (`MISSIGN SPECS : ${result}`)
                    this.bangarangAdapters.declaringClaimUserNotificationInteractor.notify(successDeclaringClaimUserNotification)
                    return isClaimExistByTitleUpperCase
                })
            this.bangarangAdapters.declaringClaimUserNotificationInteractor.notify(claimAlreadyExistDeclaringClaimUserNotification(claimTitle))
            return Promise.resolve(isClaimExistByTitleUpperCase)
        }
        if (claimTitle === "") {
            this.bangarangAdapters.declaringClaimUserNotificationInteractor.notify(claimWithoutTitleDeclaringClaimUserNotification)
            return Promise.resolve()
        }
        else return this.bangarangAdapters.bangarangClaimInteractor.isClaimExistByTitleIncensitiveCase(claimTitle)
            .then(isClaimExistByTitleUpperCase => {
                if (isClaimExistByTitleUpperCase instanceof Error) throw new Error (`MISSIGN SPECS : ${isClaimExistByTitleUpperCase}`)
                return shouldSaveClaimWhenClaimDontExistByTitleUpperCase(isClaimExistByTitleUpperCase)
            })
            .then(isClaimExistByTitleUpperCase => (isClaimExistByTitleUpperCase)?
                this.bangarangAdapters.bangarangClaimInteractor.claimByTitleIncencitiveCase(claimTitle):
                this.bangarangAdapters.bangarangClaimInteractor.claimById(claimId)
            )
            .then(claim => {
                if (claim instanceof Error) this.bangarangAdapters.retrievingClaimUserNotificationInteractor.notify(claimNotDeclaredRetrievingClaimUserNotification)
                else this.bangarangAdapters.bangarangUserInterfaceInteractor.goToClaim(claim.id)
            })
    }
    public signingIn(password:string):Promise<void> {
        return this.bangarangAdapters.bangarangMembersInteractor.isSignedIn(this.username)
            .then(isSignedIn=> {
                if(isSignedIn instanceof Error)  throw new Error (`MISSIGN SPECS : ${isSignedIn}`)
                else if(isSignedIn === true) throw alreadySignedInSigningInNotification
                return this.bangarangAdapters.bangarangMembersInteractor.signingIn({username:this.username,password})
            })
            .then(signingIn=>{
                if (signingIn) throw(badCredentialsSigningInNotification)
                else return this.bangarangAdapters.signingInUserNotificationInteractor.notify(successSigningInNotification)
            })
            .catch((notification:SigningInUserNotificationContract)=>this.bangarangAdapters.signingInUserNotificationInteractor.notify(notification))
    }
    public username: string;
    public fullname: string;
    public email:string;
    private bangarangAdapters: BangarangAdaptersContract;
}
