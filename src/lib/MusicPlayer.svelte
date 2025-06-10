<script lang="ts">
  import { faVolumeHigh, faVolumeMute } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import { afterUpdate } from "svelte";

  export let show = false;
  let audioRef: HTMLAudioElement;
  let isPlaying = false;
  let triedAutoplay = false;

  afterUpdate(() => {
    if (show && audioRef && !isPlaying && !triedAutoplay) {
      audioRef.play().then(() => {
        isPlaying = true;
      }).catch(() => {
        console.warn("Autoplay blocked");
      }).finally(() => {
        triedAutoplay = true;
      });
    }
  });

  const toggleMusic = () => {
    if (!audioRef) return;
    isPlaying ? audioRef.pause() : audioRef.play().catch(console.warn);
    isPlaying = !isPlaying;
  };
</script>

{#if show}
  <button
    on:click={toggleMusic}
    type="button"
    class="fixed bottom-2 left-4 lg:left-6 z-50 p-2 lg:p-3 rounded-[18px] bg-pink-200 text-black shadow-lg hover:bg-pink-100 transition duration-300 hover:scale-105 focus:outline-none"
  >
    <FontAwesomeIcon icon={isPlaying ? faVolumeHigh : faVolumeMute} />
  </button>

  <audio bind:this={audioRef} loop>
    <source src="./music.mp3" type="audio/mpeg" />
  </audio>
{/if}
