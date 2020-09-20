export interface BallotFactoryContract {
    generateBallot(subject: string): void;
    isBallotExist(subject: string): boolean; 
}
