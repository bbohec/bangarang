<script lang="ts">
    import ClaimAgainstButton from "../Buttons/ClaimAgainstButton.svelte"
    import ClaimForButton from "../Buttons/ClaimForButton.svelte"
    export let peopleClaimed:number=0
    export let peopleFor:number=0
    export let peopleAgainst:number=0
    const retreivePercentage = (total:number,part:number):number => (total>0)?part/total*100:0
</script>
<main class="flex flex-col">
    <p class="text-center text-bangarang-darkEmphasis">{peopleClaimed}<br>people claimed</p>
    <section class="flex justify-around">
        <section class="flex flex-col">
            <ClaimAgainstButton/>
            <p class="text-center text-bangarang-darkEmphasis">{retreivePercentage(peopleClaimed,peopleAgainst)}%</p>
        </section>
        <section class="flex flex-col">
            <ClaimForButton/>
            <p class="text-center text-bangarang-darkEmphasis">{retreivePercentage(peopleClaimed,peopleFor)}%</p>
        </section>
    </section>
</main>