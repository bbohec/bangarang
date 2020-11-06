import { BallotServiceProvider } from "../serviceProviders/BallotServiceProvider";
import { Ballot } from "./Ballot";
export interface UseCasesContract {
    retreiveBallotBySubject(subject: string): Ballot;
}
