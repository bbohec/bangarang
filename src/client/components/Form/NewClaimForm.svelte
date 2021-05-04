<script lang="ts">
    import type { ClaimType } from "../../port/ClaimContract";
    import { declaringClaim } from "../../logic/declaringNewClaim";
    import { declaringClaimUserNotificationStore } from "../../stores/declaringClaimStore";
    import ClaimAsProposalRadioButton from "../Inputs/ClaimAsProposalRadioButton.svelte"
    import GenericTextAreaField from "./Fields/GenericTextAreaField.svelte"
    import GenericSubmitField from "./Fields/GenericSubmitField.svelte"
    import { Message } from "../../logic/language";
    import { claimTitleFieldNameMessage, claimTitlePlaceholderMessage, claimTypeMessage, declareClaimSubmitMessage } from "../../logic/messages";
    import { languageStore } from "../../stores/languageStore";
    let claimChoice:ClaimType="Simple"
    const eventHandler:svelte.JSX.FormEventHandler<HTMLFormElement> = (event: Event & {currentTarget: EventTarget & HTMLFormElement;})=> {
        const target = event.target as typeof event.target & {
            claimTitle: { value: string };
        };
        declaringClaim(target.claimTitle.value)
    }
</script>
<form class="flex flex-col w-full h-full justify-evenly" on:submit|preventDefault={eventHandler}>
    <GenericTextAreaField 
        fieldId=claimTitle 
        fieldName={new Message(claimTitleFieldNameMessage).getMessage($languageStore)} 
        placeholder={new Message(claimTitlePlaceholderMessage).getMessage($languageStore)} 
        isRequired={true} 
        isReadOnly={$declaringClaimUserNotificationStore.status !== "Idle"}
    />
    <section>
        <fieldset>
            <legend class="text-bangarang-lightEmphasis">{new Message(claimTypeMessage).getMessage($languageStore)}</legend>
            <ClaimAsProposalRadioButton/>
        </fieldset>
    </section>
    
    <GenericSubmitField 
        fieldId=declare 
        fieldName= {new Message(declareClaimSubmitMessage).getMessage($languageStore)}
        isReadOnly={$declaringClaimUserNotificationStore.status !== "Idle"}
    />
</form>