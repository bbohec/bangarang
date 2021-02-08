<script lang="ts">
    import ClaimAgainstButton from "../Buttons/ClaimAgainstButton.svelte"
    import ClaimForButton from "../Buttons/ClaimForButton.svelte"
    export let peopleClaimed:number=0
    export let peopleFor:number=0
    export let peopleAgainst:number=0
    const retreivePercentage = (total:number,part:number):number => (total>0)?part/total*100:0
</script>
<main class="flex flex-col my-2">
    <p class="text-center text-bangarang-darkEmphasis my-2">{peopleClaimed}<br>people claimed</p>
    <section class="flex justify-between my-1 mx-4">
        <section class="flex flex-col w-1/3">
            <ClaimAgainstButton/>
            <p class="text-center text-bangarang-darkEmphasis">{retreivePercentage(peopleClaimed,peopleAgainst).toFixed(2)}%</p>
        </section>
        <section class="flex flex-col w-1/3">
            <ClaimForButton/>
            <p class="text-center text-bangarang-darkEmphasis">{retreivePercentage(peopleClaimed,peopleFor).toFixed(2)}%</p>
        </section>
    </section>
</main>