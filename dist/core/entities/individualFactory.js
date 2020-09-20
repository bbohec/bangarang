"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.individualFactory = void 0;
const retreiveBallotBySubject_1 = require("../usecases/retreiveBallotBySubject");
class individualFactory {
    constructor(individualRepositoryInteractor) {
        this.individualRepositoryInteractor = individualRepositoryInteractor;
    }
    retreiveIndividual(individualName) {
        return {
            identifier: this.individualRepositoryInteractor.retreiveIndividual(individualName).identifier,
            individualUseCases: { retreiveBallotBySubject: retreiveBallotBySubject_1.retreiveBallotBySubject }
        };
    }
}
exports.individualFactory = individualFactory;
;
//# sourceMappingURL=individualFactory.js.map