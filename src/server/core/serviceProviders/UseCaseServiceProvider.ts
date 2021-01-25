import type { BallotContract } from "../ports/BallotContract";
import type { UseCasesContract } from "../ports/UseCasesContract";
import type { BallotServiceProvider } from "./BallotServiceProvider";
import { retreiveBallotBySubject } from "../usecases/retreiveBallotBySubject";
export class UseCaseServiceProvider implements UseCasesContract {
    constructor(private ballotServiceProvider: BallotServiceProvider){}
    retreiveBallotBySubject(subject: string): BallotContract {return retreiveBallotBySubject(subject,this.ballotServiceProvider)}
}