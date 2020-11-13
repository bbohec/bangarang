import { FakeBallotRepositoryProvider } from "../../adapters/secondary/FakeBallotProvider";
import { BallotServiceProvider } from "../serviceProviders/BallotServiceProvider";
import { BallotContract } from "../ports/BallotContract";
export const retreiveBallotBySubject = (subject:string,ballotSystemInteractor:BallotServiceProvider):BallotContract => {
    if (!ballotSystemInteractor.isBallotExist(subject)) ballotSystemInteractor.generateBallot(subject);
    return { subject };
}