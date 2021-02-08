<script lang="ts">
    const stage = "pre-alpha"
    const message:string= `Bangarang is currently on <b>${stage}</b> stage. If you want to be informed about the next stages, you can provide your email on the following Google Form.<br>Thanks.`
    const googleFormUrl:string="https://forms.gle/H7FWYyG4HcHYthy99"
</script>
<div class="border rounded m-4 p-1 border-bangarang-failed bg-bangarang-lightEmphasis flex flex-col items-center">
    <p class="m-1 text-bangarang-dark flex-grow text-center text-xs">{@html message}</p>
    <a href={googleFormUrl} target="_blank" class=" m-1 underline text-bangarang-dark text-sm">Bangarang contact form.</a>
</div>