<script lang="ts">
    import { registering } from "../../logic/registering";
    import { registeringUserNotificationStore } from "../../stores/registeringStore";
    import GenericTextField from "./Fields/GenericTextField.svelte"
    import GenericPasswordField from "./Fields/GenericPasswordField.svelte"
    import GenericSubmitField from "./Fields/GenericSubmitField.svelte"
    import { Message } from "../../logic/language";
import { registerFormEmailMessage, registerFormFullnameMessage, registerFormPasswordMessage, registerFormSubmitMessage, registerFormUsernameMessage } from "../../logic/messages";
import { languageStore } from "../../stores/languageStore";
    const eventHandler:svelte.JSX.FormEventHandler<HTMLFormElement> = (event: Event & {currentTarget: EventTarget & HTMLFormElement;})=> {
        const target = event.target as typeof event.target & {
            username: { value: string };
            fullname: { value: string };
            email: { value: string };
            password: { value: string };
        };
        registering({username:target.username.value,fullname:target.fullname.value,email:target.email.value},target.password.value)
    }
</script>
<form on:submit|preventDefault={eventHandler} class="form-example flex flex-col">
    <GenericTextField 
        fieldId=username
        fieldName={new Message(registerFormUsernameMessage).getMessage($languageStore)}
        isReadOnly={$registeringUserNotificationStore.status !== "Idle"} 
        isRequired={true}
    />
    <GenericTextField
        fieldId=fullname
        fieldName={new Message(registerFormFullnameMessage).getMessage($languageStore)}
        isReadOnly={$registeringUserNotificationStore.status !== "Idle"}
        isRequired={true}
    />
    <GenericTextField
        fieldId=email
        fieldName={new Message(registerFormEmailMessage).getMessage($languageStore)}
        isReadOnly={$registeringUserNotificationStore.status !== "Idle"}
        isRequired={true}
    />
    <GenericPasswordField
        fieldId=password
        fieldName={new Message(registerFormPasswordMessage).getMessage($languageStore)}
        isReadOnly={$registeringUserNotificationStore.status !== "Idle"}
        isRequired={true}
    />
    <GenericSubmitField
        fieldId=register
        fieldName={new Message(registerFormSubmitMessage).getMessage($languageStore)}
        isReadOnly={$registeringUserNotificationStore.status !== "Idle"}
        buttonType="Contained Button"
    />
</form>