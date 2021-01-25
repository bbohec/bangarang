import type { IndividualContract } from "./IndividualContract";
export interface InteractWithIdentityProvider {
    isIndividualSubscribed(individualIdentifier:string):boolean;
    subscribeIndividual(individual: IndividualContract): void;
    retreiveIndividual(individualIdentifier: string): IndividualContract;
}

