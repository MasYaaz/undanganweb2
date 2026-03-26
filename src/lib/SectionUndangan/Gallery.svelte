<script lang="ts">
  import { onMount } from "svelte";

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
  let pendingTranslateX: number = 0; // Nilai translateX yang akan di-render di frame berikutnya

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

    // Pastikan tidak ada requestAnimationFrame yang tertunda dari interaksi sebelumnya
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
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

    const slider = container.querySelector<HTMLDivElement>(".flex");
    if (!slider) return;

    const slideItems =
      container.querySelectorAll<HTMLDivElement>(".slide-item");
    if (slideItems.length === 0) {
      pendingTranslateX = 0;
      return;
    }

    const firstSlide = slideItems[0];
    const lastSlide = slideItems[images.length - 1];

    if (!firstSlide || !lastSlide) return;

    const totalContentWidth = lastSlide.offsetLeft + lastSlide.clientWidth;
    const maxScrollLeft = totalContentWidth - container.clientWidth; // Gunakan container.clientWidth untuk lebar wadah

    // Batasan untuk newTranslateX
    if (newTranslateX > 0) {
      newTranslateX = newTranslateX * 0.3; // Efek "tarikan elastis" di batas kanan
    } else if (newTranslateX < -maxScrollLeft && maxScrollLeft > 0) {
      // Pastikan maxScrollLeft positif
      newTranslateX = -maxScrollLeft + (newTranslateX - -maxScrollLeft) * 0.3; // Efek "tarikan elastis" di batas kiri
    } else if (maxScrollLeft <= 0) {
      // Jika semua konten muat dalam container, tidak perlu geser
      newTranslateX = 0;
    }

    pendingTranslateX = newTranslateX;

    // Hanya minta frame baru jika belum ada yang tertunda
    if (!animationFrameId) {
      animationFrameId = requestAnimationFrame(updateGalleryPosition);
    }
  }

  /**
   * Fungsi yang dipanggil oleh requestAnimationFrame untuk memperbarui translateX.
   */
  function updateGalleryPosition(): void {
    translateX = pendingTranslateX;
    animationFrameId = null; // Reset ID agar frame berikutnya bisa diminta
  }

  /**
   * Menentukan slide berikutnya berdasarkan seberapa jauh jari digeser
   * dan mengembalikan transisi CSS setelah drag selesai.
   * @param event Objek TouchEvent dari peristiwa 'touchend'.
   */
  function handleTouchEnd(event: TouchEvent): void {
    if (!isDragging) return;
    isDragging = false;

    // Batalkan setiap requestAnimationFrame yang tertunda karena drag sudah selesai
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }

    const deltaX = event.changedTouches[0].clientX - startX; // Total pergeseran dari awal sentuhan

    // Kembalikan transisi CSS
    const slider = container.querySelector<HTMLDivElement>(".flex");
    if (slider) {
      slider.style.transition = "transform 0.7s ease-in-out";
    }

    // Tentukan slide yang akan dituju setelah drag berakhir
    let targetIndex = activeIndex;

    if (Math.abs(deltaX) > swipeThreshold) {
      if (deltaX < 0 && activeIndex < images.length - 1) {
        // Geser ke kiri (gambar berikutnya)
        targetIndex++;
      } else if (deltaX > 0 && activeIndex > 0) {
        // Geser ke kanan (gambar sebelumnya)
        targetIndex--;
      }
    } else {
      // Jika pergeseran tidak signifikan, cari slide terdekat dari posisi saat ini
      const slideItems =
        container.querySelectorAll<HTMLDivElement>(".slide-item");
      if (slideItems.length === 0) return;

      const currentOffset = translateX; // Posisi saat ini

      let closestIndex = 0;
      let minDistance = Infinity;

      for (let i = 0; i < slideItems.length; i++) {
        const slideElement = slideItems[i];
        const slideCenterInFlex =
          slideElement.offsetLeft + slideElement.clientWidth / 2;
        const containerCenter = container.clientWidth / 2;

        // Posisi translateX yang ideal untuk memusatkan slide ini
        const idealTranslateX = containerCenter - slideCenterInFlex;

        const distance = Math.abs(currentOffset - idealTranslateX);

        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = i;
        }
      }
      targetIndex = closestIndex;
    }

    // Pindah ke slide target atau kembali ke slide aktif jika tidak ada pergeseran signifikan
    setActiveSlide(targetIndex);
  }

  // --- Hook Siklus Hidup Svelte: onMount ---
  onMount(() => {
    updateSizes(); // Panggil sekali saat mount
    window.addEventListener("resize", updateSizes); // Tambahkan event listener

    return () => {
      window.removeEventListener("resize", updateSizes);
      clearTimeout(resizeTimeout);
      if (animationFrameId) cancelAnimationFrame(animationFrameId); // Penting: bersihkan requestAnimationFrame
      if (animationFrameId) cancelAnimationFrame(animationFrameId); // Penting: bersihkan requestAnimationFrame
    };
  });
</script>

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

<style>
  .section-hero {
    transform: translateY(0);
    transition: transform 1s ease-in-out;
  }

  .hidden-slide {
    transform: translateY(-100%);
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
</style>
