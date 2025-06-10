<script lang="ts">
  import { onMount } from "svelte";
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import {
    faPerson,
    faPersonDress,
    faCalendarCheck,
    faImage,
    faRectangleList,
    faEnvelopeOpen,
    faHomeUser,
  } from "@fortawesome/free-solid-svg-icons";

  export let show = true;
  let activeSection = "section2";

  // Daftar navigasi
  const navItems = [
    { id: "section2", icon: [faHomeUser], label: "Home" },
    { id: "section3", icon: [faPerson, faPersonDress], label: "Mempelai" },
    { id: "section4", icon: [faCalendarCheck], label: "Acara" },
    { id: "section5", icon: [faImage], label: "Galeri" },
    { id: "section6", icon: [faRectangleList], label: "RSVP" },
  ];

  // Klik tombol nav → scroll ke section target
  function handleNavClick(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  // Aktifkan observer saat halaman dimuat
  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activeSection = entry.target.id;
          }
        }
      },
      { rootMargin: "0px 0px -40% 0px", threshold: 0.1 }
    );

    navItems.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  });
</script>

{#if show}
  <!-- Navbar Atas -->
  <nav class="fixed top-0 z-50 w-full bg-white/30 shadow-md backdrop-blur-md px-6 py-2 md:py-4 flex justify-center">
    <h1 class="text-lg font-lora uppercase font-bold">
      <FontAwesomeIcon icon={faEnvelopeOpen} /> Undangan Digital
    </h1>
  </nav>

  <!-- Navbar Bawah -->
<nav class="fixed bottom-0 z-50 w-full bg-white/30 shadow-lg backdrop-blur-md overflow-x-auto scrollbar-hide flex justify-center">
  <ul class="w-max flex gap-6 lg:gap-20 px-4 py-3">
    {#each navItems as { id, icon, label }}
      <li class="shrink-0">
        <button
          on:click={() => handleNavClick(id)}
          class="flex flex-col xl:flex-row items-center transition duration-300 hover:scale-105"
          class:text-pink-600={activeSection === id}
          class:font-bold={activeSection === id}
          class:scale-105={activeSection === id}
        >
          <!-- Ikon -->
          <div class="flex xl:py-2 xl:px-1">
            {#each icon as ic, i}
              <FontAwesomeIcon icon={ic} class="text-2xl md:text-2xl xl:text-4xl {i === 1 ? 'text-red-300' : ''}" />
            {/each}
          </div>

          <!-- Label -->
          <span class="uppercase mt-1 xl:p-1 font-bold font-poppins text-[9px] xl:text-3xl">
            {label}
          </span>
        </button>
      </li>
    {/each}
  </ul>
</nav>

{/if}
