import { Ballot } from "../../core/ports/Ballot";
import { InteractWithBallotProvider } from "../../core/ports/InteractWithBallotProvider";
export class FakeBallotRepositoryInteractor implements InteractWithBallotProvider {
    constructor(private ballotRepository:Array<Ballot>){}
    isBallotExist(subject: string):boolean {return this.ballotRepository.some((ballot) => ballot.subject === subject);}
    generateBallot(subject: string):void {this.ballotRepository.push({ subject });}
}