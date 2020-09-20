"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retreiveBallotBySubject = void 0;
const ballotFactory_1 = require("../entities/ballotFactory");
exports.retreiveBallotBySubject = (subject) => {
    if (!ballotFactory_1.ballotFactory.isBallotExist(subject))
        ballotFactory_1.ballotFactory.generateBallot(subject);
    return { subject };
};
//# sourceMappingURL=retreiveBallotBySubject.js.map