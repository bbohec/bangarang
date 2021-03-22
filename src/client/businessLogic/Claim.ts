import type { ClaimChoice } from "../port/ClaimChoice";
import type { ClaimContract, ClaimType } from "../port/ClaimContract";
import type { BangarangClaimInteractorContract } from "../port/interactors/BangarangClaimInteractorContract";
import type { BangarangMembersInteractorContract } from "../port/interactors/BangarangMembersInteractorContract";

export class Claim {
    constructor(claimContract:ClaimContract) {
        this.title=claimContract.title
        this.type=claimContract.type
        this.peopleClaimed=claimContract.peopleClaimed
        this.peopleClaimedFor=claimContract.peopleClaimedFor
        this.peopleClaimedAgainst=claimContract.peopleClaimedAgainst
        this.id=claimContract.id
    }
    public increasePeopleClaimedWhenNoPreviousClaimChoice(previousClaimChoice: string | undefined):Claim {
        if (!previousClaimChoice)this.peopleClaimed++;
        return this
    }
    public increaseClaimChoiseFromClaimChoice(claimChoice: string | undefined):Claim {
        (claimChoice === "For") ? this.peopleClaimedFor++ : this.peopleClaimedAgainst++;
        return this
    }
    public removePreviousClaimOnClaim(previousClaimChoice: ClaimChoice):Claim {
        if (previousClaimChoice)(previousClaimChoice === "For") ? this.peopleClaimedFor-- : this.peopleClaimedAgainst--;
        return this
    }
    public save(
        bangarangClaimInteractor: BangarangClaimInteractorContract, 
        bangarangMembersInteractor: BangarangMembersInteractorContract, 
        username: string, 
        claimChoice: ClaimChoice):void|Error|Error[] {
        const saveClaim = bangarangClaimInteractor.saveClaim(this)
        const saveMemberClaim = bangarangMembersInteractor.saveMemberClaim({claimTitle:this.title, memberUsername:username, claimChoice})
    }
    public type: ClaimType;
    public title: string;
    public peopleClaimed: number;
    public peopleClaimedFor: number;
    public peopleClaimedAgainst: number;
    public id:string
}