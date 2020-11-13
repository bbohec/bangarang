import { BallotContract } from "../../core/ports/BallotContract";
import { InteractWithBallotProvider } from "../../core/ports/InteractWithBallotProvider";
export class FakeBallotRepositoryProvider implements InteractWithBallotProvider {
    constructor(private ballotRepository:Array<BallotContract>){}
    isBallotExist(subject: string):boolean {return this.ballotRepository.some((ballot) => ballot.subject === subject);}
    generateBallot(subject: string):void {this.ballotRepository.push({ subject });}
}