<script lang="ts">
    import {signingInNotificationStore} from "../../stores/signInStore"
    import GenericTaskNotification from './GenericTaskNotification.svelte'
</script>
<GenericTaskNotification taskNotification={$signingInNotificationStore}/>
