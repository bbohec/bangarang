import { IndividualContract } from "./IndividualContract";
export interface InteractWithIdentityProvider {
    isIndividualSubscribed(individualIdentifier:string):boolean;
    subscribeIndividual(individualIdentifier: string): void;
    retreiveIndividual(individualIdentifier: string): IndividualContract;
}

