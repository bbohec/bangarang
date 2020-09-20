import { Individual } from "./Individual";
export interface InteractWithIndividualRepository {
    retreiveIndividual(individualIdentifier: string): Individual;
}

