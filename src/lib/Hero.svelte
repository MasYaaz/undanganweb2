<script lang="ts">
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import { faEnvelopeOpen } from "@fortawesome/free-regular-svg-icons";

  // Menerima props dari App.svelte menggunakan Runes
  let { showHero, hasEntered, onEnter } = $props<{
    showHero: boolean;
    hasEntered: boolean;
    onEnter: () => void;
  }>();
</script>

{#if showHero}
  <section
    id="section1"
    style="background-image: url('./images/back1.webp'); background-size: cover; background-position: center;"
    class="section-hero fixed inset-0 z-50 flex flex-col items-center justify-center px-4 text-center transition-transform duration-1000 ease-in-out');"
    class:hidden-slide={hasEntered}
  >
    <!-- Overlay semi-transparan -->
    <div class="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>

    <!-- Konten utama -->
    <div class="relative z-10 flex flex-col items-center">
      <h3
        class="font-jane mt-5 mb-0 text-lg font-medium text-black md:mb-3 md:text-3xl"
      >
        - Wedding Invitation -
      </h3>

      <h2
        class="font-cinzeldeco mt-0 text-4xl font-[600] tracking-widest text-pink-700 drop-shadow md:mt-3 md:text-8xl"
      >
        MuhammaD
      </h2>
      <h2
        class="font-cinzeldeco mt-0 mb-5 text-3xl font-[600] tracking-widest text-pink-700 drop-shadow md:text-7xl"
      >
        & aishaH
      </h2>

      <img
        loading="eager"
        width="600"
        height="80"
        src="./images/place1.webp"
        alt="ornamen dekorasi"
        class="mb-50 h-auto w-60 md:w-150"
      />

      <!-- Tombol -->
      <button
        class="font-primary mt-10 flex w-fit items-center gap-2 rounded-full bg-pink-500 px-6 py-3 font-semibold text-white transition duration-300 hover:bg-pink-600 hover:cursor-pointer"
        onclick={onEnter}
      >
        Lihat Undangan
        <FontAwesomeIcon icon={faEnvelopeOpen} class="animate-bounce" />
      </button>
    </div>
  </section>
{/if}

<style>
  .section-hero {
    transform: translateY(0);
    transition: transform 1s ease-in-out;
  }

  .hidden-slide {
    transform: translateY(-100%);
  }
</style>
