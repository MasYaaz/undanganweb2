<script lang="ts">
  import { onMount } from "svelte";

  export let images: string[] = [];

  let activeIndex = 0;
  let container: HTMLDivElement;
  let translateX = 0;
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let pendingTranslateX = 0;
  let animationFrameId: number | null = null;
  const swipeThreshold = 50;

  function updateTranslateX() {
    if (!container || images.length === 0) return;
    const slideItems =
      container.querySelectorAll<HTMLDivElement>(".slide-item");
    if (slideItems.length === 0) return;

    const activeSlideElement = slideItems[activeIndex];
    const containerCenter = container.clientWidth / 2;
    const activeSlideCenterInFlex =
      activeSlideElement.offsetLeft + activeSlideElement.clientWidth / 2;

    let newTranslate = containerCenter - activeSlideCenterInFlex;

    // Boundary logic
    const lastSlide = slideItems[images.length - 1];
    const maxScroll =
      lastSlide.offsetLeft + lastSlide.clientWidth / 2 - containerCenter;

    if (newTranslate > containerCenter - slideItems[0].clientWidth / 2)
      newTranslate = containerCenter - slideItems[0].clientWidth / 2;
    if (newTranslate < -maxScroll) newTranslate = -maxScroll;

    translateX = newTranslate;
  }

  /**
   * Mengatur indeks gambar aktif dan kemudian memperbarui posisi visual galeri.
   * Ini adalah fungsi inti yang dipanggil oleh showPrevious, showNext, atau updateSizes.
   */
  function setActiveSlide(newIndex: number): void {
    activeIndex = Math.max(0, Math.min(newIndex, images.length - 1));
    updateTranslateX(); // Panggil updateTranslateX setelah activeIndex diubah.
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

  /**
   * Fungsi yang dipanggil oleh requestAnimationFrame untuk memperbarui translateX.
   */
  function updateGalleryPosition(): void {
    translateX = pendingTranslateX;
    animationFrameId = null; // Reset ID agar frame berikutnya bisa diminta
  }

  onMount(() => {
    updateTranslateX();
    window.addEventListener("resize", updateTranslateX);
    return () => window.removeEventListener("resize", updateTranslateX);
  });
</script>

<section
  id="section5"
  class="flex min-h-screen flex-col items-center justify-center py-16"
  on:touchstart|passive={handleTouchStart}
  on:touchmove|passive={handleTouchMove}
  on:touchend|passive={handleTouchEnd}
>
  <div class="relative mb-10 text-center">
    <h2
      class="text-4xl font-extrabold text-pink-700 sm:text-7xl uppercase tracking-wider"
    >
      Galeri
    </h2>
  </div>

  <div
    bind:this={container}
    class="relative w-full max-w-[900px] h-[600px] overflow-hidden"
  >
    <div
      class="flex transition-transform duration-700 ease-in-out"
      style="transform: translateX({translateX}px);"
    >
      {#each images as img, i}
        <div
          class="slide-item flex-shrink-0 flex items-center justify-center"
          style="width: 300px; margin-right: 20px;"
        >
          <img
            src={img}
            alt="Gallery"
            class="rounded-xl object-cover transition-all duration-500 {i ===
            activeIndex
              ? 'h-[500px] w-[300px] shadow-2xl'
              : 'h-[350px] w-[200px] blur-sm opacity-50'}"
          />
        </div>
      {/each}
    </div>
  </div>
</section>
