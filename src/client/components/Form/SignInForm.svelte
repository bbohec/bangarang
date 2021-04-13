<script lang="ts">
    import { signingIn } from "../../logic/signingIn";
    import GenericTextField from "./Fields/GenericTextField.svelte"
    import GenericPasswordField from "./Fields/GenericPasswordField.svelte"
    import GenericSubmitField from "./Fields/GenericSubmitField.svelte"
    import {signingInNotificationStore} from "../../stores/signInStore"
    interface targetForm {
            username: { value: string };
            password: { value: string };
        }
    const eventHandler:svelte.JSX.FormEventHandler<HTMLFormElement> =(event: Event & {currentTarget: EventTarget & HTMLFormElement;})=> {
        const target = event.target as typeof event.target & {
            username: { value: string };
            password: { value: string };
        };
        signingIn(target.username.value,target.password.value)
    }
</script>
<form on:submit|preventDefault={eventHandler} class="form-example flex flex-col">
    <GenericTextField fieldId=username fieldName=Username: isRequired={true} isReadOnly={$signingInNotificationStore.status !== "Idle"}/>
    <GenericPasswordField fieldId=password fieldName=Password: isRequired={true} isReadOnly={$signingInNotificationStore.status !== "Idle"}/>
    <GenericSubmitField fieldId=signin fieldName="Sign In" isReadOnly={$signingInNotificationStore.status !== "Idle"}/>
</form>