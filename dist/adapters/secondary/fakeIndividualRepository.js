"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fakeIndividualRepository = void 0;
exports.fakeIndividualRepository = {
    retreiveIndividual(individualIdentifier) {
        const individual = inMemoryIndividualRepository.find(individual => individual.identifier === individualIdentifier);
        if (individual)
            return individual;
        else
            throw "retreiveIndividual - individual not found on individual repository";
    }
};
const inMemoryIndividualRepository = [
    {
        identifier: "Bob"
    }
];
//# sourceMappingURL=fakeIndividualRepository.js.map