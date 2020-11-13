import { Bangarang } from "../../adapters/primary/Bangarang";
import { IndividualContract } from "../../core/ports/IndividualContract";
export function retrieveUser(bangarang:Bangarang,individual:IndividualContract|undefined): IndividualContract|undefined {
    try {
        if (individual) return bangarang.userServiceProvider.retreiveUserByIdentifer(individual.identifier).individual
        return undefined
    } catch (error) {
        console.log(error)
        return undefined
    } 
}
