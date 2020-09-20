import { Ballot } from "../ports/Ballot";
import { BallotFactoryContract } from "../ports/BallotFactoryContract";

export const ballotFactory: BallotFactoryContract = {
    isBallotExist(subject) {
        return ballotFactoryRepository.some((ballot) => ballot.subject === subject);
    },
    generateBallot(subject) {
        ballotFactoryRepository.push({ subject });
    },
};
const ballotFactoryRepository: Array<Ballot> = [];
