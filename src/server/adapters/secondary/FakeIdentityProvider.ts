import type { InteractWithIdentityProvider } from "../../core/ports/InteractWithIdentityProvider";
import type { IndividualContract } from "../../core/ports/IndividualContract";
import { userDontExist } from "../../core/ports/Errors";
export class FakeIdentityProvider implements InteractWithIdentityProvider {
    constructor(private individuals:Array<IndividualContract>) {}
    isIndividualSubscribed(individualIdentifier: string): boolean {return this.individuals.some(individual=>individual.identifier === individualIdentifier)}
    subscribeIndividual(individual: IndividualContract): void {this.individuals.push(individual)}
    retreiveIndividual(individualIdentifier:string):IndividualContract {
        const individual = this.individuals.find(individual => individual.identifier === individualIdentifier);
        if (individual) return individual;
        throw userDontExist(individualIdentifier)
    }
};


