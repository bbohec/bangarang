import { Ballot } from "../ports/Ballot";
import { UseCasesContract } from "../ports/UseCasesContract";
import { retreiveBallotBySubject } from "../usecases/retreiveBallotBySubject";
import { BallotServiceProvider } from "./BallotServiceProvider";
export class UseCaseServiceProvider implements UseCasesContract {
    constructor(private ballotServiceProvider: BallotServiceProvider){}
    retreiveBallotBySubject(subject: string): Ballot {return retreiveBallotBySubject(subject,this.ballotServiceProvider)}
}