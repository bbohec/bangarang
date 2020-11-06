import { InteractWithIdentityProvider } from "../ports/InteractWithIdentityProvider";
import { UserContract } from "../ports/UserContract";
import { BallotServiceProvider } from "./BallotServiceProvider";
import { User } from "../entities/User";
import { UseCaseServiceProvider } from "./UseCaseServiceProvider";
import { individualAlreadySubscribed } from "../ports/individualAlreadySubscribed";
export class UserServiceProvider {
    constructor(private interactWithIdentityProvider: InteractWithIdentityProvider,private ballotServiceProvider:BallotServiceProvider) {}
    public suscribeIndividual(individualIdentifier: string):void {
        if(this.interactWithIdentityProvider.isIndividualSubscribed(individualIdentifier)) throw individualAlreadySubscribed
        return this.interactWithIdentityProvider.subscribeIndividual(individualIdentifier)
    }
    public retreiveIndividual(individualName: string):UserContract {return new User(this.interactWithIdentityProvider.retreiveIndividual(individualName),new UseCaseServiceProvider(this.ballotServiceProvider))}
}