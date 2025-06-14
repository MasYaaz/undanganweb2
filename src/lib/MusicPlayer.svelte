<script lang="ts">
  import { faVolumeHigh, faVolumeMute } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import { afterUpdate } from "svelte";

  let isPlaying = false;
  export let show: boolean = false;
  let audioRef: HTMLAudioElement;

  // Coba autoplay hanya sekali saat `show` pertama kali true
  let hasTriedAutoplay = false;

  afterUpdate(() => {
    if (show && audioRef && !isPlaying && !hasTriedAutoplay) {
      audioRef.play()
        .then(() => {
          isPlaying = true;
          hasTriedAutoplay = true;
        })
        .catch((e) => {
          console.warn("Autoplay blocked:", e);
          hasTriedAutoplay = true;
        });
    }
  });

  function toggleMusic() {
    if (!audioRef) return;
    if (isPlaying) {
      audioRef.pause();
      isPlaying = false;
    } else {
      audioRef.play()
        .then(() => {
          isPlaying = true;
        })
        .catch((e) => {
          console.warn("Play error:", e);
        });
    }
  }
</script>

{#if show}
  <button
    class="fixed bottom-[13px] lg:bottom-2 left-3 lg:left-6 z-50 bg-pink-200 text-black rounded-[18px] p-2 lg:p-3 shadow-lg hover:bg-pink-100 transition hover:cursor-pointer duration-300 hover:scale-105 "
    on:click={toggleMusic}
  >
    {#if isPlaying}
      <FontAwesomeIcon icon={faVolumeHigh} />
    {:else}
      <FontAwesomeIcon icon={faVolumeMute} />
    {/if}
  </button>

  <audio bind:this={audioRef} loop>
    <source src="./music.mp3" type="audio/mpeg" />
  </audio>
{/if}
