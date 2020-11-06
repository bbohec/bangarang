import { InteractWithIdentityProvider } from "../../core/ports/InteractWithIdentityProvider";
import { IndividualContract } from "../../core/ports/IndividualContract";
import { userDontExist } from "../../core/ports/Errors";
export class FakeIdentityProvider implements InteractWithIdentityProvider {
    constructor(private individuals:Array<IndividualContract>) {}
    isIndividualSubscribed(individualIdentifier: string): boolean {return this.individuals.some(individual=>individual.identifier === individualIdentifier)}
    subscribeIndividual(individualIdentifier: string): void {this.individuals.push({identifier:individualIdentifier})}
    retreiveIndividual(individualIdentifier:string):IndividualContract {
        const individual = this.individuals.find(individual => individual.identifier === individualIdentifier);
        if (individual) return individual;
        throw userDontExist(individualIdentifier)
    }
};


