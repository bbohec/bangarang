<script lang="ts">
    import { leanCanvasTitleMessage } from "../../logic/messages";
    import HeaderTitle from "../Titles/HeaderTitle.svelte"
</script>
<header class={"flex flex-col flex-grow mx-auto px-1 justify-center items-center max-w-screen-md"}>
    <HeaderTitle 
        message={leanCanvasTitleMessage}
    />
</header>