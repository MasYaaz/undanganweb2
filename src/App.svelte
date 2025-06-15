<script lang="ts">
  import { onMount } from "svelte";
  import Countdown from "./lib/Countdown.svelte";
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import Navbar from "./lib/Navbar.svelte";
  import MusicPlayer from "./lib/MusicPlayer.svelte";
  import Flipcard from "./lib/Flipcard.svelte";
  import "./app.css";

  // --- Icon Font Awesome ---
  import { faEnvelopeOpen } from "@fortawesome/free-regular-svg-icons";
  import {
    faCalendarAlt,
    faCheck,
    faMosque,
    faPaperPlane,
    faPlaceOfWorship,
  } from "@fortawesome/free-solid-svg-icons";

  // --- Variabel State Reaktif ---
  let targetSection: HTMLDivElement;
  let hasEntered: boolean = false;
  let showHero: boolean = true;
  let initialLoad: boolean = true;
  let selected: string = "Ya";

  // --- Navigasi dan Observasi Bagian ---
  let activeSection: string = "section2";
  const sections: string[] = ["section2", "section3", "section4", "section5"];

  // --- State Galeri Gambar ---
  export let images: string[] = [
    "./images/galeri/foto1.webp",
    "./images/galeri/foto2.webp",
    "./images/galeri/foto3.webp",
    "./images/galeri/foto4.webp",
    "./images/galeri/foto5.webp",
  ];
  let activeIndex: number = 0; // Mengindikasikan indeks gambar yang sedang ditampilkan di galeri (0 = gambar pertama).
  let container: HTMLDivElement; // Referensi ke elemen div utama yang membungkus semua slide galeri.
  let containerWidth: number = 800; // Lebar wadah galeri dalam piksel.
  let translateX: number = 0; // Nilai transform CSS `translateX()` yang digunakan untuk menggeser kumpulan slide secara horizontal.

  // --- State Sentuh/Geser untuk Galeri ---
  let isDragging: boolean = false; // Menandakan apakah pengguna sedang melakukan drag
  let startX: number = 0; // Posisi X awal sentuhan saat drag dimulai
  let currentTranslate: number = 0; // Posisi translateX saat drag dimulai (nilai awal sebelum digeser)
  const swipeThreshold: number = 50; // Batas minimal gerakan horizontal untuk berpindah slide setelah drag berakhir

  let animationFrameId: number | null = null; // ID untuk requestAnimationFrame

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

  // --- Fungsi: Navigasi Galeri ---
  /**
   * Mengatur indeks gambar aktif dan kemudian memperbarui posisi visual galeri.
   * Ini adalah fungsi inti yang dipanggil oleh showPrevious, showNext, atau updateSizes.
   */
  function setActiveSlide(newIndex: number): void {
    activeIndex = Math.max(0, Math.min(newIndex, images.length - 1));
    updateTranslateX(); // Panggil updateTranslateX setelah activeIndex diubah.
  }

  /**
   * Menggeser galeri untuk menampilkan gambar sebelumnya.
   */
  function showPrevious(): void {
    setActiveSlide(activeIndex - 1);
  }

  /**
   * Menggeser galeri untuk menampilkan gambar berikutnya.
   */
  function showNext(): void {
    setActiveSlide(activeIndex + 1);
  }

  /**
   * Mengkalkulasi nilai `translateX` yang diperlukan untuk memusatkan gambar aktif.
   * Ini memastikan gambar yang sedang aktif selalu berada di tengah-tengah wadah galeri.
   */
  function updateTranslateX(): void {
    if (!container || images.length === 0) {
      translateX = 0; // Reset jika tidak ada container atau gambar
      return;
    }

    const slideItems =
      container.querySelectorAll<HTMLDivElement>(".slide-item");
    if (slideItems.length === 0) {
      translateX = 0;
      return;
    }

    const activeSlideElement = slideItems[activeIndex];
    if (!activeSlideElement) {
      translateX = 0;
      return;
    }

    containerWidth = container.clientWidth;
    const containerCenter = containerWidth / 2;

    // Lebar total semua slide termasuk margin
    const totalContentWidth = Array.from(slideItems).reduce((acc, item) => {
      const style = getComputedStyle(item);
      const marginRight = parseFloat(style.marginRight);
      return acc + item.clientWidth + marginRight;
    }, 0);

    // Jika semua gambar muat dalam container, pusatkan saja semuanya
    if (totalContentWidth <= containerWidth) {
      translateX = (containerWidth - totalContentWidth) / 2;
      return;
    }

    // Hitung posisi tengah dari elemen slide yang aktif RELATIF TERHADAP container geser
    const activeSlideCenterInFlex =
      activeSlideElement.offsetLeft + activeSlideElement.clientWidth / 2;

    // Nilai translateX yang dibutuhkan untuk memusatkan slide aktif
    let newTranslateX = containerCenter - activeSlideCenterInFlex;

    // --- Penanganan Batas yang Disesuaikan ---

    // Batas Kanan:
    // Jika geser ke kanan (translateX positif), batasi agar slide pertama tidak melewati tengah.
    // slideItems[0].offsetLeft adalah posisi awal slide pertama.
    const firstSlideCenterInFlex =
      slideItems[0].offsetLeft + slideItems[0].clientWidth / 2;
    const maxAllowedTranslateX = containerCenter - firstSlideCenterInFlex;

    if (newTranslateX > maxAllowedTranslateX) {
      newTranslateX = maxAllowedTranslateX;
    }

    // Batas Kiri:
    // minAllowedTranslateX adalah posisi terjauh ke kiri agar slide terakhir masih terlihat sepenuhnya di kanan container.
    const lastSlideCenterInFlex =
      slideItems[images.length - 1].offsetLeft +
      slideItems[images.length - 1].clientWidth / 2;
    const minAllowedTranslateX = containerCenter - lastSlideCenterInFlex;

    if (newTranslateX < minAllowedTranslateX) {
      newTranslateX = minAllowedTranslateX;
    }

    translateX = newTranslateX;
  }

  /**
   * Memperbarui ukuran wadah galeri dan lebar slide secara dinamis.
   */
  let resizeTimeout: ReturnType<typeof setTimeout>;

  function updateSizes(): void {
    clearTimeout(resizeTimeout);

    resizeTimeout = setTimeout(() => {
      if (!container) return;

      const currentContainerWidth = container.clientWidth;
      if (currentContainerWidth !== containerWidth) {
        // Cek hanya jika lebar container berubah
        containerWidth = currentContainerWidth;
      }
      updateTranslateX(); // Selalu panggil updateTranslateX saat ukuran berubah
    }, 200);
  }

  // --- Fungsi: Handler Sentuh/Geser untuk Galeri ---
  /**
   * Merekam koordinat X awal saat sentuhan dimulai dan menginisialisasi state drag.
   * @param event Objek TouchEvent dari peristiwa 'touchstart'.
   */
  function handleTouchStart(event: TouchEvent): void {
    isDragging = true;
    startX = event.touches[0].clientX;
    currentTranslate = translateX; // Simpan posisi translateX saat ini sebagai dasar
    // Hentikan transisi CSS sementara saat drag dimulai agar gerakan responsif
    const slider = container.querySelector<HTMLDivElement>(".flex");
    if (slider) {
      slider.style.transition = "none";
    }
  }

  /**
   * Memperbarui posisi galeri secara real-time saat jari digeser.
   * Menggunakan `requestAnimationFrame` untuk performa animasi yang mulus.
   * @param event Objek TouchEvent dari peristiwa 'touchmove'.
   */
  function handleTouchMove(event: TouchEvent): void {
    if (!isDragging) return;

    const currentX = event.touches[0].clientX;
    const deltaX = currentX - startX;

    let newTranslateX = currentTranslate + deltaX;

    // --- Penanganan Batas untuk Dragging ---
    const totalContentWidth =
      container.querySelector<HTMLDivElement>(".flex")?.scrollWidth || 0;
    const minAllowedTranslateX = containerWidth - totalContentWidth;

    // Efek "tarikan elastis" saat di batas kanan (geser ke kanan melewati awal)
    if (newTranslateX > 0) {
      newTranslateX = newTranslateX * 0.3; // Lebih sedikit dari 1.0 agar terasa elastis
    }
    // Efek "tarikan elastis" saat di batas kiri (geser ke kiri melewati akhir)
    else if (newTranslateX < minAllowedTranslateX) {
      newTranslateX =
        minAllowedTranslateX + (newTranslateX - minAllowedTranslateX) * 0.3;
    }

    translateX = newTranslateX;
  }

  /**
   * Menentukan slide berikutnya berdasarkan seberapa jauh jari digeser
   * dan mengembalikan transisi CSS setelah drag selesai.
   * @param event Objek TouchEvent dari peristiwa 'touchend'.
   */
  function handleTouchEnd(event: TouchEvent): void {
    if (!isDragging) return;
    isDragging = false;

    const deltaX = event.changedTouches[0].clientX - startX; // Total pergeseran dari awal sentuhan

    // Kembalikan transisi CSS
    const slider = container.querySelector<HTMLDivElement>(".flex");
    if (slider) {
      slider.style.transition = "transform 0.7s ease-in-out";
    }

    // Tentukan slide yang akan dituju setelah drag berakhir
    let targetIndex = activeIndex;
    if (deltaX < -swipeThreshold && activeIndex < images.length - 1) {
      // Geser ke kiri (gambar berikutnya)
      targetIndex++;
    } else if (deltaX > swipeThreshold && activeIndex > 0) {
      // Geser ke kanan (gambar sebelumnya)
      targetIndex--;
    }

    // Pindah ke slide target atau kembali ke slide aktif jika tidak ada pergeseran signifikan
    setActiveSlide(targetIndex);
  }

  // --- Fungsi: Masuk Halaman dan Kontrol Gulir ---
  function enterInvitation(): void {
    hasEntered = true;

    document.body.classList.remove("scroll-hidden");
    document.body.classList.add("scroll");

    setTimeout(() => {
      showHero = false;
      targetSection.scrollIntoView({ behavior: "smooth" });
    }, 1000);
  }

  // --- Fungsi: Observasi Bagian untuk Navbar ---
  function observeSections(): void {
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: "0px",
      threshold: 0.6,
    };

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry: IntersectionObserverEntry) => {
          if (entry.isIntersecting) {
            activeSection = entry.target.id;
          }
        });
      },
      options
    );

    sections.forEach((id: string) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  }

  // --- Fungsi: Pengiriman Formulir (RSVP) ---
  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
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
  }

  // --- Hook Siklus Hidup Svelte: onMount ---
  onMount(() => {
    if (!hasEntered) {
      document.body.classList.add("scroll-hidden");
    } else {
      document.body.classList.remove("scroll-hidden");
      document.body.classList.add("scroll");
    }

    observeSections();

    updateSizes(); // Panggil sekali saat mount
    window.addEventListener("resize", updateSizes); // Tambahkan event listener

    const rsvpForm = document.getElementById("RSVP") as HTMLFormElement | null;
    if (rsvpForm) {
      rsvpForm.addEventListener("submit", handleSubmit);
    }

    return () => {
      window.removeEventListener("resize", updateSizes);
      clearTimeout(resizeTimeout);
      if (animationFrameId) cancelAnimationFrame(animationFrameId); // Penting: bersihkan requestAnimationFrame
      if (rsvpForm) {
        rsvpForm.removeEventListener("submit", handleSubmit);
      }
    };
  });
</script>

<main>
  <!-- SECTION 1: Hero dengan Countdown dan Tombol Scroll -->
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
      style="background-image: url('./images/back2.webp'); background-size: cover; background-position: center;"
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
            class="my-6 h-content w-80 overflow-hidden rounded-t-[100px] md:h-content md:w-100 justify-center"
          >
            <img
              src="./images/duo.webp"
              width="400"
              height="400"
              alt="foto berdua"
              loading="lazy"
            />
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
            src="./images/place1.webp"
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
                <img
                  width="400"
                  height="400"
                  loading="eager"
                  src="./images/laki.webp"
                  alt="laki-laki"
                />
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
                <img
                  width="400"
                  height="400"
                  loading="lazy"
                  src="./images/perempuan.webp"
                  alt="perempuan"
                />
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
      style="background-image: url('./images/back2.webp'); background-size: cover; background-position: center;"
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

      <!-- SECTION 5 -->
      <section
        id="section5"
        class="flex min-h-screen flex-col items-center justify-center py-16"
        on:touchstart|passive={handleTouchStart}
        on:touchmove|passive={handleTouchMove}
        on:touchend|passive={handleTouchEnd}
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
                style="width: 300px; margin-right: 20px;"
              >
                <button
                  type="button"
                  on:click={() => {
                    // Saat diklik, pastikan bukan hasil dari drag yang gagal
                    if (!isDragging) {
                      // Hanya panggil jika tidak dalam mode drag
                      if (i < activeIndex) showPrevious();
                      else if (i > activeIndex) showNext();
                    }
                  }}
                  class="focus:outline-none"
                  aria-label={`Lihat foto ${i + 1}`}
                >
                  <img
                    src={img}
                    alt={`Foto ${i + 1}`}
                    width={i === activeIndex ? 300 : 200}
                    height={i === activeIndex ? 500 : 350}
                    loading="lazy"
                    class={`rounded-xl object-cover transition-all duration-500
                ${
                  i === activeIndex
                    ? "z-10 h-[500px] w-[300px] border-4 border-white shadow-2xl"
                    : "h-[350px] w-[200px] opacity-0 blur-md brightness-50"
                }
              `}
                  />
                </button>
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

  /* Perbaikan dan penyesuaian CSS untuk galeri */
  /* Pastikan overflow: hidden ada pada container utama galeri */
  .gallery-container {
    /* Ini merujuk pada div dengan bind:this={container} */
    /* ... properti yang sudah ada ... */
    overflow: hidden; /* Pastikan ini ada dan berfungsi untuk menyembunyikan konten di luar batas */
    position: relative; /* Penting untuk z-index dan posisi absolut */
  }

  .slide-item {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 300px;
    margin-right: 20px;
  }

  /* CSS untuk gambar di dalam slide item */
  .slide-item img {
    /* Kelas TailwindCSS sudah cukup banyak, tapi pastikan ini */
    object-fit: cover;
    /* Transisi untuk properti yang berubah (ukuran, opasitas, blur) */
    transition: all 0.5s ease-in-out;
  }

  .slide-item:last-child {
    margin-right: 0;
  }

  /* Kelas kustom untuk gambar yang tidak aktif */
  /* Ini menggantikan bagian TailwindCSS di `img` jika Anda ingin lebih banyak kontrol */
  /* .slide-item img:not(.active) { */
  /* opacity: 0; /* <-- Pastikan ini 0 untuk menyembunyikan sepenuhnya */
  /* filter: blur(8px) brightness(50%); */
  /* width: 200px; */
  /* height: 350px; */
  /* } */

  /* .slide-item img.active { */
  /* opacity: 1; */
  /* filter: none; */
  /* width: 300px; */
  /* height: 500px; */
  /* z-index: 10; */
  /* } */
</style>
