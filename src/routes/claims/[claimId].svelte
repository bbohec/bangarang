<script lang="ts" context="module">
	export async function preload(page, session) {
        const { claimId } = page.params;
        const claim:ClaimContract=retreiveClaimById(claimId)
		return { claim };
	}
</script>
<script lang="ts">
    import ClaimFooter from "../../client/components/Footers/ClaimFooter.svelte"
    import ClaimHeader from "../../client/components/Headers/ClaimHeader.svelte"
    import ClaimMain from "../../client/components/Mains/ClaimMain.svelte"
    import { retreiveClaimById } from "../../client/logic/retreiveClaimById";
    import type { ClaimContract } from "../../client/interfaces/ClaimContract";
    export let claim:ClaimContract
</script>
<ClaimHeader title={claim.title}/>
<ClaimMain 
    peopleClaimed={claim.peopleClaimed} 
    peopleFor={claim.peopleFor} 
    peopleAgainst={claim.peopleAgainst}
/>
<ClaimFooter/>


