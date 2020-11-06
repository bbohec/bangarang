import { BallotContract } from "../ports/BallotContract";
import { UseCasesContract } from "../ports/UseCasesContract";
import { retreiveBallotBySubject } from "../usecases/retreiveBallotBySubject";
import { BallotServiceProvider } from "./BallotServiceProvider";
export class UseCaseServiceProvider implements UseCasesContract {
    constructor(private ballotServiceProvider: BallotServiceProvider){}
    retreiveBallotBySubject(subject: string): BallotContract {return retreiveBallotBySubject(subject,this.ballotServiceProvider)}
}