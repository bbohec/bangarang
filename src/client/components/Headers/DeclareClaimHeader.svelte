<script lang="ts">
    import { declareClaimHeaderMessage } from "../../logic/messages";
    import HeaderTitle from "../Titles/HeaderTitle.svelte"
</script>
<header class={"flex flex-col mx-auto px-1 justify-end items-center max-w-screen-md"}>
    <HeaderTitle message={declareClaimHeaderMessage}/>
</header>