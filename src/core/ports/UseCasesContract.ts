import { BallotServiceProvider } from "../serviceProviders/BallotServiceProvider";
import { BallotContract } from "./BallotContract";
export interface UseCasesContract {
    retreiveBallotBySubject(subject: string): BallotContract;
}
