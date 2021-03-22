<script lang="ts">
    export let claim:ClaimContractWithMemberPreviousClaimChoice;
    import ClaimFooter from "../components/Footers/ClaimFooter.svelte"
    import ClaimHeader from "../components/Headers/ClaimHeader.svelte"
    import ClaimMain from "../components/Mains/ClaimMain.svelte"
    import type { ClaimContractWithMemberPreviousClaimChoice } from "../port/ClaimContract";
</script>
<ClaimHeader title={claim.title}/>
<ClaimMain 
    peopleClaimed={claim.peopleClaimed} 
    peopleFor={claim.peopleClaimedFor} 
    peopleAgainst={claim.peopleClaimedAgainst}
    claimId = {claim.id}
    userClaimingChoice = {claim.previousUserClaimChoice}
/>
<ClaimFooter/>