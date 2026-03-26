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

  // --- Props (Svelte 5 Runes) ---
  let { show = true } = $props<{ show: boolean }>();

  // --- State Lokal ---
  let activeSection = $state("section2");

  // Daftar navigasi
  const navItems = [
    { id: "section2", icons: [faHomeUser], label: "Home" },
    { id: "section3", icons: [faPerson, faPersonDress], label: "Mempelai" },
    { id: "section4", icons: [faCalendarCheck], label: "Acara" },
    { id: "section5", icons: [faImage], label: "Galeri" },
    { id: "section6", icons: [faRectangleList], label: "RSVP" },
  ];

  function handleNavClick(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Kita pakai threshold yang agak ketat agar perpindahan menu terasa pas
          if (entry.isIntersecting) {
            activeSection = entry.target.id;
          }
        });
      },
      {
        rootMargin: "-20% 0px -20% 0px", // Memicu perubahan saat section di tengah layar
        threshold: 0.2,
      },
    );

    navItems.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  });
</script>

{#if show}
  <nav
    class="fixed bottom-0 z-50 w-full bg-white/80 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] backdrop-blur-sm flex justify-center border-t border-pink-100"
  >
    <ul class="flex w-full max-w-lg justify-around items-center px-2 py-2">
      {#each navItems as { id, icons, label }}
        <li>
          <button
            onclick={() => handleNavClick(id)}
            class="group flex flex-col items-center justify-center p-2 transition-all duration-300 relative"
            class:text-pink-600={activeSection === id}
            class:text-gray-400={activeSection !== id}
          >
            {#if activeSection === id}
              <div
                class="absolute bottom-1 w-full h-0.5 lg:h-1 bg-pink-600 rounded-full animate-pulse"
              ></div>
            {/if}

            <div
              class="flex items-center justify-center gap-0.5 mb-1 transition-transform duration-300 group-hover:-translate-y-1"
            >
              {#each icons as ic, i}
                <FontAwesomeIcon
                  icon={ic}
                  class="text-xl md:text-2xl {i === 1
                    ? 'text-pink-300 -ml-2'
                    : ''} {activeSection === id ? 'scale-110' : ''}"
                />
              {/each}
            </div>

            <span
              class="uppercase font-poppins font-bold text-[8px] md:text-[10px] tracking-wider transition-colors duration-300"
            >
              {label}
            </span>
          </button>
        </li>
      {/each}
    </ul>
  </nav>
{/if}

<style>
  /* Menghilangkan scrollbar pada navigasi jika item terlalu banyak di mobile */
  :global(.scrollbar-hide)::-webkit-scrollbar {
    display: none;
  }
  :global(.scrollbar-hide) {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
