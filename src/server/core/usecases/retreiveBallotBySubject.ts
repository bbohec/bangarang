import type { BallotServiceProvider } from "../serviceProviders/BallotServiceProvider";
import type { BallotContract } from "../ports/BallotContract";
export const retreiveBallotBySubject = (subject:string,ballotSystemInteractor:BallotServiceProvider):BallotContract => {
    if (!ballotSystemInteractor.isBallotExist(subject)) ballotSystemInteractor.generateBallot(subject);
    return { subject };
}