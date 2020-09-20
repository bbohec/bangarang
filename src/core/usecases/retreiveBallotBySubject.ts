import { ballotFactory } from "../entities/ballotFactory";
import { Ballot } from "../ports/Ballot";
export const retreiveBallotBySubject = (subject:string):Ballot => {
    if (!ballotFactory.isBallotExist(subject)) ballotFactory.generateBallot(subject);
    return { subject };
}