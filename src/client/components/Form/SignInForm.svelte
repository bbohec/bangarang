<script lang="ts">
    import { signingIn } from "../../logic/signingIn";
    import GenericTextField from "./Fields/GenericTextField.svelte"
    import GenericPasswordField from "./Fields/GenericPasswordField.svelte"
    import GenericSubmitField from "./Fields/GenericSubmitField.svelte"
    import {signingInNotificationStore} from "../../stores/signInStore"
    import { Message } from "../../logic/language";
    import { signInFormPasswordMessage, signInFormSubmitMessage, signInFormUsernameMessage } from "../../logic/messages";
    import { languageStore } from "../../stores/languageStore";
    interface targetForm {
            username: { value: string };
            password: { value: string };
        }
    const eventHandler:svelte.JSX.FormEventHandler<HTMLFormElement> =(event: Event & {currentTarget: EventTarget & HTMLFormElement;})=> {
        const target = event.target as typeof event.target & targetForm
        signingIn(target.username.value,target.password.value)
    }
</script>
<form on:submit|preventDefault={eventHandler} class="form-example flex flex-col">
    <GenericTextField 
        fieldId=username 
        fieldName={new Message(signInFormUsernameMessage).getMessage($languageStore)}
        isRequired={true} 
        isReadOnly={$signingInNotificationStore.status !== "Idle"}
    />
    <GenericPasswordField 
        fieldId=password 
        fieldName={new Message(signInFormPasswordMessage).getMessage($languageStore)}
        isRequired={true} 
        isReadOnly={$signingInNotificationStore.status !== "Idle"
    }/>
    <GenericSubmitField 
        fieldId=signin 
        fieldName={new Message(signInFormSubmitMessage).getMessage($languageStore)}
        isReadOnly={$signingInNotificationStore.status !== "Idle"
    }/>
</form>