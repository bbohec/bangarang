<script lang="ts">
    import { searchingClaimsUserNotificationStore } from "../../stores/searchingClaimsStore";
    import GenericTaskNotification from './GenericTaskNotification.svelte'
</script>
<GenericTaskNotification taskNotification={$searchingClaimsUserNotificationStore}/>
