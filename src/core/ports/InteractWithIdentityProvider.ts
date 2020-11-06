import { IndividualContract } from "./IndividualContract";
export interface InteractWithIdentityProvider {
    subscribeIndividual(individualIdentifier: string): void;
    retreiveIndividual(individualIdentifier: string): IndividualContract;
}

