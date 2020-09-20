"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ballotFactory = void 0;
exports.ballotFactory = {
    isBallotExist(subject) { return ballotFactoryRepository.some(ballot => ballot.subject === subject); },
    generateBallot(subject) { ballotFactoryRepository.push({ subject }); }
};
const ballotFactoryRepository = [];
//# sourceMappingURL=ballotFactory.js.map