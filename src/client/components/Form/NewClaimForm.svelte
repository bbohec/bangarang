<script lang="ts">
    import NewClaimTitleInput from "../Inputs/NewClaimTitleInput.svelte"
    import DeclareNewClaimSubmitButton from "../Inputs/DeclareNewClaimSubmitButton.svelte"
    import ClaimAsProposalRadioButton from "../Inputs/ClaimAsProposalRadioButton.svelte"
    import type { ClaimType } from "../../interfaces/ClaimType";
    import { declaringClaim } from "../../logic/declaringNewClaim";
    let claimTitle:string
    let claimChoice:ClaimType="Claim as proposal"
    const declareNewClaim = ():void => {declaringClaim(claimTitle) }
</script>
<form class="w-full flex flex-col items-center" on:submit|preventDefault={declareNewClaim}>
    <NewClaimTitleInput bind:value={claimTitle}/>
    <fieldset>
        <legend class="text-bangarang-lightEmphasis">Claim type</legend>
        <ClaimAsProposalRadioButton/>
    </fieldset>
    {#if claimTitle!== ""}
        <DeclareNewClaimSubmitButton/>
    {/if}
</form>