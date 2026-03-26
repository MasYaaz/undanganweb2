<script lang="ts">
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import {
    faCalendarAlt,
    faMosque,
    faPlaceOfWorship,
  } from "@fortawesome/free-solid-svg-icons";
  import Countdown from "./Countdown.svelte";
  import Flipcard from "./Flipcard.svelte";

  // Menerima props targetDate dari App.svelte
  let { targetDate } = $props<{ targetDate: Date }>();

  // Data Acara dimasukkan ke sini agar App.svelte ringkas
  const eventCards = [
    {
      title: "Akad nikah",
      imageSrc: "https://img.icons8.com/glyph-neue/256/newlyweds.png",
      day: "Sabtu",
      date: "15 Juni 2025",
      time: "09.00 - Selesai",
      venue: "Masjid Al-Akbar Surabaya",
      address:
        "Jl. Masjid Al-Akbar Timur No.1, Pagesangan, Kec. Jambangan, Surabaya, Jawa Timur 60274, Indonesia",
      icon: faMosque,
      mapQuery: "Masjid Al Akbar Surabaya",
    },
    {
      title: "Resepsi nikah",
      imageSrc:
        "https://img.icons8.com/external-glyphons-amoghdesign/256/external-celebrate-st-patricks-day-glyphons-amoghdesign.png",
      day: "Sabtu",
      date: "15 Juni 2025",
      time: "20.00 - Selesai",
      venue: "Graha Adi",
      address:
        "Jl. Balas Klumprik No.156, Balas Klumprik, Kec. Wiyung, Surabaya, Jawa Timur 60222, Indonesia",
      icon: faPlaceOfWorship,
      mapQuery: "Graha Adi",
    },
  ];
</script>

<section
  id="section4"
  class="relative flex min-h-screen items-center justify-center bg-white px-4 py-20"
>
  <div class="relative z-10 flex flex-col items-center text-center">
    <div class="mb-10 flex flex-col items-center">
      <div
        class="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-pink-100 text-pink-600"
      >
        <FontAwesomeIcon icon={faCalendarAlt} class="text-4xl" />
      </div>

      <h2
        class="font-cinzeldeco text-2xl font-semibold lg:text-5xl text-gray-800"
      >
        Rangkaian Acara
      </h2>
      <h3
        class="font-cinzeldeco mt-2 text-xl font-medium lg:text-3xl text-pink-700"
      >
        Diselenggarakan Pada
      </h3>
    </div>

    <div class="mb-16">
      <h3
        class="font-poppins text-5xl font-bold tracking-[4px] uppercase lg:text-8xl text-gray-900"
      >
        Sabtu
      </h3>
      <h3
        class="font-poppins mt-2 text-2xl font-semibold tracking-[2px] lg:text-5xl text-pink-600"
      >
        15 Juni 2025
      </h3>

      <div class="mt-8">
        <Countdown {targetDate} />
      </div>
    </div>

    <h2
      class="font-cinzeldeco mb-10 text-2xl font-semibold lg:text-4xl text-gray-800"
    >
      Rincian Acara
    </h2>

    <div class="flex flex-col gap-10 lg:flex-row lg:gap-16">
      {#each eventCards as item}
        <Flipcard
          judulCinzel={item.title}
          srcImage={item.imageSrc}
          hari={item.day}
          tanggal={item.date}
          waktu={item.time}
          tempat={item.venue}
          alamat={item.address}
          logo={item.icon}
          alamatMap={item.mapQuery}
        />
      {/each}
    </div>
  </div>
</section>

<style>
  /* Tambahkan styling khusus jika diperlukan, 
     sebagian besar sudah di-handle oleh Tailwind */
</style>
