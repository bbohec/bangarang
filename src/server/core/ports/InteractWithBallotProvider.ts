export interface InteractWithBallotProvider {
    isBallotExist(subject: string): boolean;
    generateBallot(subject: string): void;
}
