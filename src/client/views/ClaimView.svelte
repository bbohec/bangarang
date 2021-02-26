<script lang="ts">
    export let claim:ClaimContract;
    import ClaimFooter from "../components/Footers/ClaimFooter.svelte"
    import ClaimHeader from "../components/Headers/ClaimHeader.svelte"
    import ClaimMain from "../components/Mains/ClaimMain.svelte"
    import type { ClaimContract } from "../interfaces/ClaimContract";
</script>
<ClaimHeader title={claim.title}/>
<ClaimMain 
    peopleClaimed={claim.peopleClaimed} 
    peopleFor={claim.peopleFor} 
    peopleAgainst={claim.peopleAgainst}
    claimId = {claim.id}
/>
<ClaimFooter/>