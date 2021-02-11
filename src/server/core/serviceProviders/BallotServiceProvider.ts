import type { InteractWithBallotProvider } from "../ports/InteractWithBallotProvider";
export class BallotServiceProvider {
    constructor(private interactWithBallotProvider: InteractWithBallotProvider){}
    isBallotExist(subject:string):boolean {return this.interactWithBallotProvider.isBallotExist(subject)}
    generateBallot(subject:string):void {return this.interactWithBallotProvider.generateBallot(subject)}
};