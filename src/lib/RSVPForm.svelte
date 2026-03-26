<script lang="ts">
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import {
    faPaperPlane,
    faCheckCircle,
    faUsers,
    faHeart,
    faUser,
  } from "@fortawesome/free-solid-svg-icons";

  // --- State Svelte 5 (Runes) ---
  let status = $state("idle"); // idle, loading, success, error
  let selectedPresence = $state("Ya"); // Default: Hadir

  // --- Fungsi: Pengiriman Formulir (RSVP) ke Google Sheets ---
  async function handleSubmit(event: Event) {
    event.preventDefault();
    status = "loading";

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      // Pastikan URL Action sesuai dengan deployment Google Apps Script kamu
      await fetch(form.action, {
        method: "POST",
        body: formData,
        mode: "no-cors", // Penting untuk Apps Script agar tidak kena CORS error
      });

      // Karena no-cors, kita tidak bisa baca respon, diasumsikan sukses
      status = "success";
      form.reset(); // Bersihkan form
      selectedPresence = "Ya"; // Reset radio button

      // Sembunyikan pesan sukses setelah 5 detik
      setTimeout(() => (status = "idle"), 5000);
    } catch (err) {
      console.error("Gagal mengirim form:", err);
      status = "error";
      // Sembunyikan pesan error setelah 5 detik
      setTimeout(() => (status = "idle"), 5000);
    }
  }
</script>

<section
  id="section6"
  class="relative flex min-h-screen items-center justify-center px-4 py-20"
>
  <div
    class="relative z-10 w-full max-w-2xl rounded-3xl bg-white/40 p-8 md:p-12 shadow-2xl backdrop-blur-md border border-white/20"
  >
    <div class="mb-10 text-center">
      <h2
        class="font-poppins uppercase text-7xl font-bold text-pink-700 tracking-tighter lg:text-8xl opacity-90"
      >
        rsvp
      </h2>
      <div class="flex items-center justify-center gap-2 mt-2">
        <div class="h-px w-10 bg-pink-200"></div>
        <p class="font-lora text-sm md:text-base text-gray-700 italic">
          Konfirmasi Kehadiran Anda
        </p>
        <div class="h-px w-10 bg-pink-200"></div>
      </div>
    </div>

    {#if status === "success"}
      <div
        class="mb-8 flex items-center gap-3 rounded-2xl bg-green-50 p-4 text-green-700 border border-green-200 shadow-inner"
      >
        <FontAwesomeIcon icon={faCheckCircle} class="text-2xl" />
        <p class="font-medium">
          Terima kasih! Konfirmasi kehadiran Anda telah kami terima.
        </p>
      </div>
    {:else if status === "error"}
      <div
        class="mb-8 flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-red-700 border border-red-200 shadow-inner"
      >
        <p class="font-medium">
          Maaf, terjadi kesalahan saat mengirim data. Silakan coba lagi.
        </p>
      </div>
    {/if}

    <form
      onsubmit={handleSubmit}
      action="https://script.google.com/macros/s/AKfycbxQeSggLMDWB0lx_gE-p6XLetYiIltGw7hsBO-pH_me5EdRxKinD4m8TRmFEl36IsXn/exec"
      class="space-y-8 flex flex-col"
    >
      <div class="relative">
        <label
          for="nama_rsvp"
          class="block text-sm font-medium text-pink-900 font-poppins mb-1.5 ml-1"
          >Nama Lengkap</label
        >
        <div class="relative">
          <FontAwesomeIcon
            icon={faUser}
            class="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300"
          />
          <input
            type="text"
            id="nama_rsvp"
            name="Nama"
            placeholder="Contoh: Budi Santoso"
            required
            class="w-full rounded-2xl border border-gray-100 bg-white/60 p-4 pl-12 text-gray-800 shadow-inner placeholder:text-gray-300 focus:border-pink-300 focus:ring-1 focus:ring-pink-300 focus:outline-none focus:bg-white transition-all duration-300"
          />
        </div>
      </div>

      <div>
        <p
          class="block text-sm font-medium text-pink-900 font-poppins mb-2.5 ml-1"
        >
          Apakah Anda akan hadir?
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label class="radio-card group">
            <input
              type="radio"
              name="Kehadiran"
              value="Ya"
              bind:group={selectedPresence}
              class="sr-only"
            />
            <div
              class="card-content flex items-center gap-4 p-5 rounded-2xl border border-gray-100 bg-white/60 cursor-pointer transition-all duration-300 group-hover:bg-white active:scale-95 shadow-inner"
            >
              <div class="custom-radio-circle"></div>
              <span class="font-medium text-gray-700 group-hover:text-pink-800"
                >Ya, saya akan hadir</span
              >
            </div>
          </label>

          <label class="radio-card group">
            <input
              type="radio"
              name="Kehadiran"
              value="Tidak"
              bind:group={selectedPresence}
              class="sr-only"
            />
            <div
              class="card-content flex items-center gap-4 p-5 rounded-2xl border border-gray-100 bg-white/60 cursor-pointer transition-all duration-300 group-hover:bg-white active:scale-95 shadow-inner"
            >
              <div class="custom-radio-circle"></div>
              <span class="font-medium text-gray-700 group-hover:text-gray-900"
                >Maaf, saya tidak bisa hadir</span
              >
            </div>
          </label>
        </div>
      </div>

      <div
        class="grid grid-cols-1 md:grid-cols-2 gap-8 transition-all duration-500 {selectedPresence ===
        'Ya'
          ? 'opacity-100 visible h-auto'
          : 'opacity-0 invisible h-0'}"
      >
        <div>
          <label
            for="jumlah_rsvp"
            class="block text-sm font-medium text-pink-900 font-poppins mb-1.5 ml-1"
            >Jumlah Hadirin (Maks. 2)</label
          >
          <div class="relative">
            <FontAwesomeIcon
              icon={faUsers}
              class="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300"
            />
            <input
              type="number"
              id="jumlah_rsvp"
              name="Jumlah"
              min="1"
              max="2"
              placeholder="Jumlah pax"
              required={selectedPresence === "Ya"}
              class="w-full rounded-2xl border border-gray-100 bg-white/60 p-4 pl-12 text-gray-800 shadow-inner placeholder:text-gray-300 focus:border-pink-300 focus:outline-none focus:bg-white transition-all duration-300"
            />
          </div>
        </div>

        <div class="md:col-span-2 relative">
          <label
            for="doa_rsvp"
            class="block text-sm font-medium text-pink-900 font-poppins mb-1.5 ml-1"
            >Ucapan & Doa</label
          >
          <div class="relative">
            <FontAwesomeIcon
              icon={faHeart}
              class="absolute left-4 top-5 text-pink-300"
            />
            <textarea
              id="doa_rsvp"
              name="Pesan"
              rows="4"
              placeholder="Tuliskan doa terbaik Anda untuk mempelai..."
              class="w-full rounded-2xl border border-gray-100 bg-white/60 p-4 pl-12 pt-4 text-gray-800 shadow-inner placeholder:text-gray-300 focus:border-pink-300 focus:outline-none focus:bg-white transition-all duration-300"
            ></textarea>
          </div>
        </div>
      </div>

      <div class="text-center pt-4 flex justify-center">
        <button
          type="submit"
          disabled={status === "loading"}
          class="flex w-full md:w-fit items-center justify-center gap-3 rounded-full bg-pink-600 px-12 py-4 font-poppins font-semibold text-white shadow-lg transition-all duration-300 hover:bg-pink-700 hover:scale-105 hover:cursor-pointer hover:shadow-pink-200 focus:outline-none focus:ring-4 focus:ring-pink-200 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100"
        >
          {#if status === "loading"}
            <div
              class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
            ></div>
            Mengirim...
          {:else}
            Kirim Konfirmasi
            <FontAwesomeIcon
              icon={faPaperPlane}
              class="transition-transform group-hover:translate-x-1"
            />
          {/if}
        </button>
      </div>
    </form>
  </div>
</section>

<style>
  /* Styling khusus untuk Radio Card agar estetik */
  .radio-card input[type="radio"]:checked + .card-content {
    background-color: white;
    border-color: #f9a8d4; /* pink-300 */
    box-shadow: 0 0 15px rgba(236, 72, 153, 0.1);
  }

  .custom-radio-circle {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid #d1d5db; /* gray-300 */
    position: relative;
    transition: all 0.3s ease;
  }

  /* Lingkaran radio saat dipilih */
  .radio-card input[type="radio"]:checked + .card-content .custom-radio-circle {
    border-color: #db2777; /* pink-600 */
    background-color: #db2777;
  }

  /* Titik putih di dalam lingkaran saat dipilih */
  .radio-card
    input[type="radio"]:checked
    + .card-content
    .custom-radio-circle::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    background-color: white;
    border-radius: 50%;
  }
</style>
