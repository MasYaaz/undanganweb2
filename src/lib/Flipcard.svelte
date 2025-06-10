<script lang="ts">
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
  import MapEmbed from "./MapEmbed.svelte";

  export let judulCinzel: string;
  export let srcImage: string;
  export let hari: string;
  export let tanggal: string;
  export let waktu: string;
  export let tempat: string;
  export let alamat: string;
  export let logo: IconDefinition;
  export let alamatMap: string;

  let flipped = false;
  function toggleFlip() {
    flipped = !flipped;
    if (flipped) {
    }
  }
</script>

<button
  type="button"
  class="card-container transition-transform hover:scale-105 focus:outline-none"
  on:click={toggleFlip}
>
  <div class="card {flipped ? 'flipped' : ''}">
    <!-- Front -->
    <div class="card-face card-front flex flex-col items-center justify-center pt-3">
      <h2 class="font-jane text-xl lg:text-3xl">Acara</h2>
      <h2 class="font-cinzeldeco -mt-1 lg:mb-8 text-2xl lg:text-5xl font-semibold">
        {judulCinzel}
      </h2>
      <img
        width="180"
        height="180"
        src={srcImage}
        alt="Logo"
        class="lg:mt-5 lg:mb-5"
      />
      <h3 class="font-poppins lg:mb-1 text-4xl lg:text-6xl font-bold tracking-[3px] uppercase">
        {hari}
      </h3>
      <h3 class="font-poppins -mb-1 text-lg lg:text-3xl font-semibold tracking-[3px]">
        {tanggal}
      </h3>
      <h3 class="font-poppins mb-1 text-base lg:text-2xl tracking-widest uppercase">
        {waktu}
      </h3>
      <h3 class="font-poppins mt-2 lg:mt-20 text-[10px] lg:text-base tracking-widest">
        Tekan kartu untuk info lebih lanjut!
      </h3>
    </div>

    <!-- Back -->
    <div class="card-face card-back">
      <div class="px-6 p-6 text-center items-center justify-around flex flex-col">
        <div class="w-full flex flex-col">
          <FontAwesomeIcon icon={logo} class="text-4xl lg:text-8xl lg:p-3" />
        </div>
        <div class="w-60 lg:w-100">
          <p class="font-poppins font-bold text-xl lg:text-3xl uppercase mb-2">
            {tempat}
          </p>
          <p class="font-poppins font-thin tracking-widest text-[10px] lg:text-sm mb-2">
            {alamat}
          </p>
        </div>
        <MapEmbed {alamatMap} />
      </div>
    </div>
  </div>
</button>


<style>
  .card-container {
    perspective: 1000px;
    width: 100%;
    max-width: 480px;
    aspect-ratio: 3 / 4.2;
    cursor: pointer;
  }
  @media (min-width: 1024px) {
    .card-container {
      min-height: 640px;
    }
  }

  .card {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.8s;
  }

  .card.flipped {
    transform: rotateY(180deg);
  }

  .card-face {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 1rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  .card-front {
    background-color: #fce4ec;
  }

  .card-back {
    background-color: #f8bbd0;
    transform: rotateY(180deg);
  }
</style>
