import { FakeBallotRepositoryInteractor } from "../../adapters/secondary/FakeBallotProvider";
import { BallotServiceProvider } from "../serviceProviders/BallotServiceProvider";
import { Ballot } from "../ports/Ballot";
export const retreiveBallotBySubject = (subject:string,ballotSystemInteractor:BallotServiceProvider):Ballot => {
    if (!ballotSystemInteractor.isBallotExist(subject)) ballotSystemInteractor.generateBallot(subject);
    return { subject };
}