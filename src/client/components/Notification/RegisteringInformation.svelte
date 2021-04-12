<script lang="ts">
    import { registeringUserNotificationStore } from "../../stores/registeringStore";
    import GenericTaskNotification from './GenericTaskNotification.svelte'
</script>
<GenericTaskNotification taskNotification={$registeringUserNotificationStore}/>