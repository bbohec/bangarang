<script lang="ts">
    import { Message } from "../../logic/language";
    import { claimAgainstMessage, claimForMessage, peopleClaimedMessage } from "../../logic/messages";
    import type { ClaimChoice } from "../../port/ClaimChoice";
    import { languageStore } from "../../stores/languageStore";
    import ClaimButton from "../Buttons/ClaimButton.svelte"
    export let peopleClaimed:number=0
    export let peopleFor:number=0
    export let peopleAgainst:number=0
    export let claimId:string=""
    export let userClaimingChoice:ClaimChoice=undefined
    const retreivePercentage = (total:number,part:number):number => (total>0)?part/total*100:0
</script>
<main class={"flex flex-col flex-grow m-auto p-1 justify-center items-center max-w-screen-md"}>
    <p class="text-center text-bangarang-lightEmphasis my-2">{peopleClaimed}<br>{new Message(peopleClaimedMessage).getMessage($languageStore)}</p>
    <section class="flex justify-between my-1 mx-4">
        <section class="flex flex-col w-1/3">
            <ClaimButton 
                {claimId} 
                {userClaimingChoice} 
                claimingChoice= "Against"
                claimingChoiceMessage={new Message(claimAgainstMessage).getMessage($languageStore)}
            />
            <p class="text-center text-bangarang-lightEmphasis">{retreivePercentage(peopleClaimed,peopleAgainst).toFixed(2)}%</p>
        </section>
        <section class="flex flex-col w-1/3">
            <ClaimButton 
                {claimId}
                {userClaimingChoice}
                claimingChoice="For"
                claimingChoiceMessage={new Message(claimForMessage).getMessage($languageStore)}
            />
            <p class="text-center text-bangarang-lightEmphasis">{retreivePercentage(peopleClaimed,peopleFor).toFixed(2)}%</p>
        </section>
    </section>
</main>