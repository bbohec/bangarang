import type { ClaimChoice } from "./ClaimChoice";
export interface ClaimContract {
    type: ClaimType;
    title: ClaimTitle;
    peopleClaimed:PeopleClaimed;
    peopleClaimedFor:PeopleClaimedFor;
    peopleClaimedAgainst:PeopleClaimedAgainst;
    id:Identifier
}
export type ClaimType = "Simple"
export type ClaimTitle = string
export type Identifier = string
export type PeopleClaimed=number
export type PeopleClaimedFor=number
export type PeopleClaimedAgainst=number


export interface ClaimContractWithMemberPreviousClaimChoice extends ClaimContract {
    previousUserClaimChoice:ClaimChoice
}
