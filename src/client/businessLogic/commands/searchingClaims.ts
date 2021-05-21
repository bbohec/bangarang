import type { BangarangAdaptersContract } from "../../port/BangarangAdaptersContract";
import type { ClaimContract } from "../../port/ClaimContract";
import type { Command, CommandName } from "../../port/Command";
import { unexpectedErrorSearchingClaimsUserNotification, successSearchingClaimsUserNotification } from "../../port/interactors/SearchingClaimsUserNotificationInteractorContract";
export class SearchingClaims implements Command {
    constructor(
        private bangarangAdapters:BangarangAdaptersContract,
        private searchCriteria:string|undefined
    ){}
    execute(): Promise<void> {
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
        if(this.searchCriteria === undefined) {
            this.bangarangAdapters.searchingClaimsUserNotificationInteractor.notify(unexpectedErrorSearchingClaimsUserNotification(new Error("searchCriteria is undefined.")))
            return Promise.resolve()
        } 
        const searchCriteria = this.searchCriteria
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
    readonly name: CommandName = "Searching Claims"
    
}