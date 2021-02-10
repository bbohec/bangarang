<script lang="ts">
    const stage = "pre-alpha"
    const message:string= `Bangarang is currently on <b>${stage}</b> stage. If you want to be informed about the next stages, you can provide your email on the following Google Form.<br>Thanks.`
    const googleFormUrl:string="https://forms.gle/H7FWYyG4HcHYthy99"
</script>
<div class="border rounded my-6 border-bangarang-failed bg-bangarang-light flex flex-col items-center">
    <p class="m-1 text-bangarang-lightEmphasis flex-grow text-center text-xs">{@html message}</p>
    <a href={googleFormUrl} target="_blank" class=" m-1 underline text-bangarang-darkEmphasis text-sm">Bangarang contact form.</a>
</div>