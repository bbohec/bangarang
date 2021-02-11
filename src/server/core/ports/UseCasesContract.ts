import type { BallotContract } from "./BallotContract";
export interface UseCasesContract {
    retreiveBallotBySubject(subject: string): BallotContract;
}
