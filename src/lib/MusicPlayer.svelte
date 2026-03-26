<script lang="ts">
  import {
    faVolumeHigh,
    faVolumeMute,
  } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";

  let isPlaying = $state(false);
  let hasTriedAutoplay = $state(false);

  let { show = false } = $props<{ show?: boolean }>();
  let audioRef = $state<HTMLAudioElement | null>(null);

  // Coba autoplay hanya sekali saat `show` pertama kali true

  $effect(() => {
    // Svelte 5 akan otomatis melacak perubahan pada 'show' dan 'audioRef'
    if (show && audioRef && !isPlaying && !hasTriedAutoplay) {
      audioRef
        .play()
        .then(() => {
          isPlaying = true;
          hasTriedAutoplay = true;
        })
        .catch((e) => {
          console.warn("Autoplay blocked:", e);
          // Tetap set true agar tidak terus-menerus mencoba (loop) saat gagal
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
      audioRef
        .play()
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
    class="fixed top-4 right-4 z-50 bg-black text-pink-200 rounded-full h-10 w-10 shadow-lg hover:bg-gray-900 transition hover:cursor-pointer duration-300 hover:scale-105"
    onclick={toggleMusic}
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
