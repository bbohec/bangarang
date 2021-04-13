<script lang="ts">
    import type { ClaimType } from "../../port/ClaimContract";
    import { declaringClaim } from "../../logic/declaringNewClaim";
    import { declaringClaimUserNotificationStore } from "../../stores/declaringClaimStore";
    import ClaimAsProposalRadioButton from "../Inputs/ClaimAsProposalRadioButton.svelte"
    import GenericTextAreaField from "./Fields/GenericTextAreaField.svelte"
    import GenericSubmitField from "./Fields/GenericSubmitField.svelte"
    let claimChoice:ClaimType="Simple"
    const eventHandler:svelte.JSX.FormEventHandler<HTMLFormElement> = (event: Event & {currentTarget: EventTarget & HTMLFormElement;})=> {
        const target = event.target as typeof event.target & {
            claimTitle: { value: string };
        };
        declaringClaim(target.claimTitle.value)
    }
</script>
<form class="w-full flex flex-col items-center" on:submit|preventDefault={eventHandler}>
    <GenericTextAreaField placeholder="Describe the claim ..." fieldId=claimTitle fieldName="Claim Title" isRequired={true} isReadOnly={$declaringClaimUserNotificationStore.status !== "Idle"}/>
    <fieldset>
        <legend class="text-bangarang-lightEmphasis">Claim type</legend>
        <ClaimAsProposalRadioButton/>
    </fieldset>
    <GenericSubmitField fieldId=declare fieldName=Declare isReadOnly={$declaringClaimUserNotificationStore.status !== "Idle"}/>
</form>