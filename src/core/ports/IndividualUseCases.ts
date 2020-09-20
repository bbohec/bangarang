import { Ballot } from "./Ballot";
export interface IndividualUseCases {
    retreiveBallotBySubject(subject: string): Ballot;
}
