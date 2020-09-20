import { InteractWithIndividualRepository } from "../../core/ports/InteractWithIndividualRepository";
import { Individual } from "../../core/ports/Individual";

export const fakeIndividualRepository: InteractWithIndividualRepository = {
    retreiveIndividual(individualIdentifier) {
        const individual = inMemoryIndividualRepository.find(individual => individual.identifier === individualIdentifier);
        if (individual)
            return individual;
        else
            throw "retreiveIndividual - individual not found on individual repository";
    }
};
const inMemoryIndividualRepository: Array<Individual> = [
    {
        identifier: "Bob"
    }
];


