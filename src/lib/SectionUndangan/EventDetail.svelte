<script lang="ts">
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import Countdown from "../Countdown.svelte";
  import Flipcard from "../Flipcard.svelte";
  import { faCalendarAlt } from "@fortawesome/free-regular-svg-icons";
  import {
    faMosque,
    faPlaceOfWorship,
  } from "@fortawesome/free-solid-svg-icons";

  // --- Data Acara ---
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

  // --- Tanggal Target Hitung Mundur ---
  const targetDate: Date = new Date("2025-06-15T10:00:00");
</script>

<section
  id="section4"
  class="relative flex min-h-screen items-center justify-center bg-gradient-to-br p-15 px-4"
>
  <div class="relative flex flex-col justify-center z-10 lg:pt-10 text-center">
    <FontAwesomeIcon icon={faCalendarAlt} size="5x" class="fa-5x mb-5" />
    <div class="lg:mb-20">
      <h2 class="font-cinzeldeco text-2xl font-semibold lg:mb-2 lg:text-5xl">
        Rangkaian acara
      </h2>
      <h2 class="font-cinzeldeco mb-5 text-xl font-semibold lg:text-4xl">
        diselenggarakan Pada
      </h2>
    </div>
    <div class="lg:mb-10">
      <h3
        class="font-poppins mb-1 text-5xl font-bold tracking-[3px] uppercase lg:text-8xl"
      >
        Sabtu
      </h3>
      <h3
        class="font-poppins mb-5 text-2xl font-semibold tracking-[3px] lg:text-5xl"
      >
        15 Juni 2025
      </h3>
      <!-- Komponen Countdown -->
      <Countdown {targetDate} />
    </div>
    <h2 class="font-cinzeldeco mt-25 text-2xl font-semibold lg:text-5xl">
      Rincian Acara
    </h2>
    <div class="mt-5 flex flex-col gap-15 lg:mt-20 lg:flex-row">
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
