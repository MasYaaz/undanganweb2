<script lang="ts">
  import { onMount } from "svelte";
  import Countdown from "./lib/Countdown.svelte";
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import Navbar from "./lib/Navbar.svelte"; //Import Navbar Component
  import { faEnvelopeOpen } from "@fortawesome/free-regular-svg-icons";
  import {
    faCalendarAlt,
    faCheck,
    faMosque,
    faPaperPlane,
    faPlaceOfWorship,
  } from "@fortawesome/free-solid-svg-icons";
  import Flipcard from "./lib/Flipcard.svelte";
  import "./app.css";
  import MusicPlayer from "./lib/MusicPlayer.svelte"; //Buat player musik

  let targetSection: HTMLDivElement;
  let hasEntered = false; // Variabel untuk menunjukkan halaman utama
  let showHero = true;
  let initialLoad = true;
  let selected = "Ya";

  let activeSection = "section2";
  const sections = ["section2", "section3", "section4", "section5"];

  export let images: string[] = [
    "./images/galeri/foto1.jpg",
    "./images/galeri/foto2.jpg",
    "./images/galeri/foto3.jpg",
    "./images/galeri/foto4.jpg",
    "./images/galeri/foto5.jpg",
  ];

  let activeIndex = 0;
  let container: HTMLDivElement;
  let slideWidth = 260;
  let containerWidth = 800;
  let translateX = 0;

  let touchStartX = 0;
  let touchEndX = 0;
  const swipeThreshold = 50; // minimal px untuk deteksi swipe

  function showPrevious() {
    if (activeIndex > 0) activeIndex--;
    updateTranslateX();
  }

  function showNext() {
    if (activeIndex < images.length - 1) activeIndex++;
    updateTranslateX();
  }

  function updateTranslateX() {
    const offset = containerWidth / 2 - slideWidth / 2;
    translateX = -activeIndex * slideWidth + offset;
  }

  function updateSizes() {
    if (!container) return;
    containerWidth = container.clientWidth;
    const slide = container.querySelector<HTMLDivElement>(".slide-item");
    slideWidth = slide ? slide.clientWidth : 260;
    updateTranslateX();
  }

  function handleTouchStart(event: TouchEvent) {
    touchStartX = event.changedTouches[0].clientX;
  }

  function handleTouchEnd(event: TouchEvent) {
    touchEndX = event.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;

    if (Math.abs(deltaX) > swipeThreshold) {
      if (deltaX > 0) {
        showPrevious();
      } else {
        showNext();
      }
    }
  }

  const kartuAcara = [
    {
      judulCinzel: "Akad nikah",
      srcImage: "https://img.icons8.com/glyph-neue/256/newlyweds.png",
      hari: "Sabtu",
      tanggal: "15 Juni 2025",
      waktu: "09.00 - Selesai",
      tempat: "Masjid Al-Akbar Surabaya",
      alamat:
        "Jl. Masjid Al-Akbar Timur No.1, Pagesangan, Kec. Jambangan, Surabaya, Jawa Timur 60274, Indonesia",
      logo: faMosque,
      alamatMap: "Masjid Al Akbar Surabaya",
    },
    {
      judulCinzel: "Resepsi nikah",
      srcImage:
        "https://img.icons8.com/external-glyphons-amoghdesign/256/external-celebrate-st-patricks-day-glyphons-amoghdesign.png",
      hari: "Sabtu",
      tanggal: "15 Juni 2025",
      waktu: "20.00 - Selesai",
      tempat: "Graha Adi",
      alamat:
        "Jl. Balas Klumprik No.156, Balas Klumprik, Kec. Wiyung, Surabaya, Jawa Timur 60222, Indonesia",
      logo: faPlaceOfWorship,
      alamatMap: "Graha Adi",
    },
  ];

  function observeSections() {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.6, // Saat 60% terlihat, dianggap aktif
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeSection = entry.target.id;
        }
      });
    }, options);

    sections.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  }

  // Jalankan saat mount
  onMount(() => {
    if (!hasEntered) {
    document.body.classList.add("scroll-hidden");
  } else {
    document.body.classList.remove("scroll-hidden");
    document.body.classList.add("scroll"); // Optional, kalau kamu ingin mengatur overflow setelah masuk
  }

    observeSections();
    updateSizes();
    window.addEventListener("resize", updateSizes);

    const form = document.getElementById("RSVP") as HTMLFormElement | null;
    if (form) {
      form.addEventListener("submit", async (e: Event) => {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const formData = new FormData(target);
        try {
          await fetch(target.action, {
            method: "POST",
            body: formData,
          });
          alert("Data berhasil dikirim!");
        } catch (err) {
          console.error("Gagal mengirim form:", err);
          alert("Terjadi kesalahan saat mengirim data.");
        }
      });
    }

    return () => window.removeEventListener("resize", updateSizes);
  });

  const targetDate = new Date("2025-06-15T10:00:00"); // Variabel buat tanggal countdown

  // Fungsi agar tidak bisa masuk ke section1 (halaman utama) dan aktifkan fungsi scroll
  function enterInvitation() {
    hasEntered = true;

    // Aktifkan scroll
    document.body.classList.remove("scroll-hidden");
    document.body.classList.add("scroll");

    // Scroll & hilangkan hero
    setTimeout(() => {
      showHero = false;
      targetSection.scrollIntoView({ behavior: "smooth" });
    }, 1000);
  }
</script>

<main>
  <!-- SECTION 1: Hero dengan Countdown dan Tombol Scroll -->
  {#if showHero}
    <section
      id="section1"
      class="section-hero fixed inset-0 z-50 flex flex-col items-center justify-center bg-cover bg-center px-4 text-center transition-transform duration-1000 ease-in-out"
      style="background-image: url('./images/back1.jpg')"
      class:hidden-slide={hasEntered}
    >
      <!-- Overlay semi-transparan -->
      <div class="absolute inset-0 bg-white/50 backdrop-blur-sm"></div>

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
          src="./images/place1.png"
          alt="ornamen dekorasi"
          class="mb-50 h-auto w-60 md:w-150"
        />

        <!-- Tombol -->
        <button
          class="font-primary mt-10 flex w-fit items-center gap-2 rounded-full bg-pink-500 px-6 py-3 font-semibold text-white transition duration-300 hover:bg-pink-600 hover:cursor-pointer"
          on:click={enterInvitation}
        >
          Lihat Undangan
          <FontAwesomeIcon icon={faEnvelopeOpen} class="animate-bounce" />
        </button>
      </div>
    </section>
  {/if}
  <!-- NAVBAR -->

  <Navbar show={hasEntered} />
  <MusicPlayer show={hasEntered} />

  <!-- SECTION CONTAINER SCROLLABLE -->
  <div bind:this={targetSection} class="transition-all duration-1000">
    <!-- Section 2 dan 3 -->
    <div
      class="relative"
      style="background-image: url('./images/back2.jpg'); background-size: cover; background-position: center;"
    >
      <!-- Overlay semi-transparan -->
      <div
        class="absolute inset-0 z-0 bg-gradient-to-b from-white/20 via-white/30 to-white/100"
      ></div>
      <!-- SECTION 2 -->
      <section
        id="section2"
        class="relative flex min-h-screen items-center justify-center px-4 py-10 lg:py-20"
      >
        <!-- Konten utama -->
        <div
          class="relative z-10 flex flex-col items-center gap-y-0 text-center md:gap-y-6"
        >
          <!-- Paragraf atas -->
          <h3
            class="font-jane mt-4 mb-0 text-lg font-medium text-black md:mt-2 md:mb-3 md:text-3xl"
          >
            - Wedding Invitation -
          </h3>

          <h2
            class="font-cinzeldeco mt-0 text-4xl font-[600] tracking-widest text-pink-700 drop-shadow md:mt-3 md:text-7xl"
          >
            MuhammaD
          </h2>
          <h2
            class="font-cinzeldeco mt-0 text-3xl font-[600] tracking-widest text-pink-700 drop-shadow md:text-6xl"
          >
            & aishaH
          </h2>

          <!-- Kotak gambar tengah -->
          <div
            class="my-6 h-content w-80 overflow-hidden rounded-t-[100px] md:h-content md:w-100"
          >
            <img src="./images/duo.png" alt="foto berdua" />
          </div>

          <!-- Paragraf bawah -->
          <h3
            class="font-lora mt-0 text-lg font-[500] text-pink-700 uppercase drop-shadow md:text-3xl"
          >
            Sabtu, 15 Juni 2025
          </h3>

          <p
            class="font-lora mt-2 mb-4 max-w-xl text-sm font-[400] text-pink-700 uppercase drop-shadow md:text-xl"
          >
            "Terima kasih telah mau menjadi bagian di hari bahagia kami"
          </p>

          <img
            src="./images/place1.png"
            alt="Foto estetik"
            class="h-fit w-60 object-cover md:w-150"
          />
        </div>
      </section>

      <!-- SECTION 3 -->
      <section
        id="section3"
        class="h-min-screen relative flex items-center justify-center px-4 pb-15 md:pb-0"
      >
        <div class="relative z-10 mt-10 flex flex-col items-center lg:gap-10">
          <!-- Ayat Qur'an dan terjemahan -->
          <div
            class="mt-10 mb-0 flex max-w-xl flex-col items-center justify-center px-4 md:mt-20 md:mb-10 md:max-w-3xl"
          >
            <h3
              class="font-cinzeldeco mb-3 text-center text-xl font-bold md:text-2xl"
            >
              Qs. Az-Zariyat : 49
            </h3>
            <h2
              class="text-center text-xl leading-relaxed text-pink-700 md:text-4xl"
            >
              وَمِنْ كُلِّ شَيْءٍ خَلَقْنَا زَوْجَيْنِ لَعَلَّكُمْ تَذَكَّرُونَ
            </h2>
            <p
              class="font-lora mt-3 text-center text-sm text-gray-700 italic md:text-xl"
            >
              “Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu
              mengingat (kebesaran Allah).”
              <br />
              <span class="font-lora text-xs md:text-base"
                >(QS. Az-Zariyat: 49)</span
              >
            </p>
          </div>
          <div
            class="mt-10 flex w-80 flex-col items-center justify-center lg:w-200"
          >
            <h1 class="mb-4 text-2xl lg:text-3xl">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
            </h1>
            <h2 class="font-cinzeldeco mb-2 text-lg font-bold lg:text-2xl">
              Assalamu'alaikum Wr. Wb.
            </h2>
            <p
              class="font-lora justify-center text-center text-base lg:text-lg"
            >
              Maha suci Allah yang telah menciptakan mahluk-Nya
              berpasang-pasangan. Ya Allah, perkenankanlah kami merangkaikan
              kasih sayang yang Kau ciptakan diantara kami untuk mengikuti
              Sunnah Rasul-Mu dalam rangka membentuk keluarga yang sakinah,
              mawaddah, warahmah.
            </p>
          </div>
          <div
            class="flex flex-col justify-between gap-0 md:flex-row lg:gap-20 lg:p-20 lg:pt-0"
          >
            <div class="flex flex-col items-center">
              <!-- Kotak gambar -->
              <div
                class="my-3 h-60 w-60 overflow-hidden rounded-t-[100px] lg:h-100 lg:w-100"
              >
                <img src="./images/laki.png" alt="laki-laki" />
              </div>
              <h3 class="font-jane text-base md:text-lg">Muhammad bin Fulan</h3>
              <h2 class="font-cinzeldeco text-3xl font-bold md:text-4xl">
                MuhammaD
              </h2>
              <h3 class="font-lora text-xl font-bold md:text-2xl">
                - Surabaya -
              </h3>
            </div>

            <div class="flex flex-col items-center">
              <!-- Kotak gambar -->
              <div
                class="my-3 h-60 w-60 overflow-hidden rounded-t-[100px] lg:h-100 lg:w-100"
              >
                <img src="./images/perempuan.png" alt="perempuan" />
              </div>
              <h3 class="font-jane text-lg">Aishah Binti Fulan</h3>
              <h2 class="font-cinzeldeco text-3xl font-bold md:text-4xl">
                Aishah
              </h2>
              <h3 class="font-lora text-xl font-bold md:text-2xl">
                - Surabaya -
              </h3>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Section 4 sampai 6 -->
    <div
      class="relative"
      style="background-image: url('./images/back2.jpg'); background-size: cover; background-position: center;"
    >
      <!-- Overlay semi-transparan -->
      <div
        class="absolute inset-0 z-0 bg-gradient-to-t from-white/20 via-white/30 to-white/100"
      ></div>
      <!-- SECTION 4 -->
      <section
        id="section4"
        class="relative flex min-h-screen items-center justify-center bg-gradient-to-br p-15 px-4"
      >
        <div
          class="relative flex flex-col justify-center z-10 lg:pt-10 text-center"
        >
          <FontAwesomeIcon icon={faCalendarAlt} size="5x" class="fa-5x mb-5" />
          <div class="lg:mb-20">
            <h2
              class="font-cinzeldeco text-2xl font-semibold lg:mb-2 lg:text-5xl"
            >
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
            {#each kartuAcara as item}
              <Flipcard
                judulCinzel={item.judulCinzel}
                srcImage={item.srcImage}
                hari={item.hari}
                tanggal={item.tanggal}
                waktu={item.waktu}
                tempat={item.tempat}
                alamat={item.alamat}
                logo={item.logo}
                alamatMap={item.alamatMap}
              />
            {/each}
          </div>
        </div>
      </section>

      <!-- SECTION 5 -->
      <section
        id="section5"
        class="flex min-h-screen flex-col items-center justify-center py-16"
        on:touchstart={handleTouchStart}
        on:touchend={handleTouchEnd}
      >
        <div class="relative mb-10 lg:mb-20 px-4 text-center">
          <h2
            class="text-4xl font-extrabold text-pink-700 sm:text-7xl uppercase tracking-wider"
          >
            Galeri
          </h2>
          <p class="mt-2 text-lg text-pink-600 lg:text-xl">
            Geser untuk melihat momen momen spesial!
          </p>
        </div>

        <!-- Slide Container -->
        <div
          bind:this={container}
          class="relative w-full max-w-[900px] h-[800px] overflow-hidden"
        >
          <div
            class="flex transition-transform duration-700 ease-in-out"
            style="transform: translateX({translateX}px);"
          >
            {#each images as img, i}
              <div
                class="slide-item flex flex-shrink-0 items-center justify-center"
                style="width: 300px;"
              >
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
                <img
                  src={img}
                  alt={`Foto ${i + 1}`}
                  loading="lazy"
                  class={`cursor-pointer rounded-xl object-cover transition-all duration-500
              ${
                i === activeIndex
                  ? "z-10 h-[500px] w-[300px] border-4 border-white shadow-2xl"
                  : "h-[350px] w-[200px] opacity-60 blur-sm brightness-75"
              }
            `}
                  on:click={() => {
                    if (i < activeIndex) showPrevious();
                    else if (i > activeIndex) showNext();
                  }}
                />
              </div>
            {/each}
          </div>
        </div>
      </section>

      <!-- SECTION 6 -->
      <section
        id="section6"
        class="relative flex min-h-screen items-center justify-center px-4 py-12"
      >
        <div
          class="w-full flex flex-col max-w-2xl rounded-3xl bg-white/30 p-8 shadow-lg backdrop-blur-sm"
        >
          <div class="mb-6 text-center">
            <h2
              class="font-poppins uppercase text-7xl font-bold text-pink-700 lg:text-8xl"
            >
              rsvp
            </h2>
            <p class="font-poppins text-[12px] text-black lg:text-base">
              Silahkan isi konfirmasi kehadiran anda.
            </p>
          </div>

          <form
            method="POST"
            action="https://script.google.com/macros/s/AKfycbxQeSggLMDWB0lx_gE-p6XLetYiIltGw7hsBO-pH_me5EdRxKinD4m8TRmFEl36IsXn/exec"
            class="space-y-6 flex flex-col"
            id="RSVP"
          >
            <!-- Input Nama -->
            <div>
              <label
                for="nama"
                class="block text-sm font-medium text-gray-700 font-poppins"
                >Nama</label
              >
              <input
                type="text"
                id="nama"
                name="Nama"
                class="mt-1 w-full rounded-xl border border-gray-300 p-3 shadow-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500 focus:outline-none font-poppins"
                placeholder="Masukkan nama Anda"
              />
            </div>
            <!-- Input Kehadiran -->
            <div>
              <p
                class="mb-2 block text-sm font-medium text-gray-700 font-poppins"
              >
                Apakah Anda akan hadir?
              </p>
              <div class="flex items-center space-x-6">
                <label
                  class="radio-wrapper hover:scale-102 transition-transform"
                >
                  <input
                    type="radio"
                    name="Kehadiran"
                    value="Ya"
                    class="custom-radio"
                    bind:group={selected}
                  />
                  <span class="icon-wrapper">
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <span class="ml-2 text-gray-700 font-poppins"
                    >Ya, saya akan hadir</span
                  >
                </label>
                <label
                  class="radio-wrapper hover:scale-102 transition-transform"
                >
                  <input
                    type="radio"
                    name="Kehadiran"
                    value="Tidak"
                    class="custom-radio"
                    bind:group={selected}
                  />
                  <span class="icon-wrapper">
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <span class="ml-2 text-gray-700 font-poppins"
                    >Maaf, saya tidak bisa hadir</span
                  >
                </label>
              </div>
            </div>
            <!-- Input Jumlah Hadirin -->
            <div>
              <label
                for="Jumlah Hadirin"
                class="block text-sm font-medium text-gray-700"
                >Jumlah Hadirin</label
              >
              <input
                type="number"
                id="Jumlah Hadirin"
                name="Jumlah Hadirin"
                min="1"
                max="10"
                class="mt-1 w-full rounded-xl border border-gray-300 p-3 shadow-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500 focus:outline-none"
                placeholder="Masukkan jumlah yang akan hadir"
              />
            </div>
            <!-- Input Pesan dan Doa -->
            <div>
              <label
                for="Ucapan / Doa"
                class="block text-sm font-medium text-gray-700"
                >Ucapan / Doa</label
              >
              <textarea
                id="Ucapan / Doa"
                name="Ucapan / Doa"
                rows="4"
                class="mt-1 w-full rounded-xl border border-gray-300 p-3 shadow-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500 focus:outline-none"
                placeholder="Tuliskan ucapan atau doa Anda di sini..."
              ></textarea>
            </div>

            <div class="text-center flex justify-center">
              <button
                type="submit"
                class="gap-2 w-content rounded-full flex items-center justify-center bg-pink-600 px-8 py-3 text-white shadow-md transition-transform hover:scale-105 hover:cursor-pointer hover:bg-pink-700 focus:outline-none"
              >
                Kirim <FontAwesomeIcon
                  icon={faPaperPlane}
                  class="fa-md rotate-12"
                />
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  </div>
</main>

<style>
  .section-hero {
    transform: translateY(0);
    transition: transform 1s ease-in-out;
  }

  .hidden-slide {
    transform: translateY(-100%);
  }

  /* Custom radio */
  .radio-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    cursor: pointer;
  }

  .custom-radio {
    appearance: none;
    -webkit-appearance: none;
    width: 0px;
    height: 20px;
    position: relative;
    cursor: pointer;
  }

  .custom-radio:checked + .icon-wrapper {
    visibility: visible;
    color: red;
  }

  .icon-wrapper {
    visibility: visible; /* sembunyikan tapi tetap ambil ruang */
    color: grey;
    font-size: 16px;
    pointer-events: none;
    width: 16px; /* atur lebar tetap */
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin-left: 0;
  }

  .icon {
    position: absolute;
    color: white;
    font-size: 14px;
    pointer-events: none;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
