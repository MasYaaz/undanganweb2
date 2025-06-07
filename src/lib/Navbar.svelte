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
  let buttonElements: HTMLButtonElement[] = [];
  
  let navContainer: HTMLUListElement;
  let navTranslateX = 0;

  const navItems = [
    { id: "section2", icon: [faHomeUser], label: "Home" },
    { id: "section3", icon: [faPerson, faPersonDress], label: "Mempelai" },
    { id: "section4", icon: [faCalendarCheck], label: "Acara" },
    { id: "section5", icon: [faImage], label: "Galeri" },
    { id: "section6", icon: [faRectangleList], label: "RSVP" },
  ];

  function scrollToSection(id: string) {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  }

  function updateNavTranslateX(index: number) {
    // Lebar tombol (harus sama dengan CSS, misal 100px)
    const itemWidth = 100;
    const visibleCount = 3;
    const containerWidth = itemWidth * visibleCount;

    // Hitung posisi translate agar item ke-index berada di tengah
    const offset = containerWidth / 2 - itemWidth / 2;
    navTranslateX = -index * itemWidth + offset;

    // Batasi translateX agar tidak kosong kiri/kanan
    const maxTranslate = 0;
    const minTranslate = -itemWidth * (navItems.length - visibleCount);
    if (navTranslateX > maxTranslate) navTranslateX = maxTranslate;
    if (navTranslateX < minTranslate) navTranslateX = minTranslate;
  }

  function handleNavClick(id: string, index: number) {
    scrollToSection(id);
    updateNavTranslateX(index); // geser tombol ke tengah
  }

  onMount(() => {
	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					activeSection = entry.target.id;
					const index = navItems.findIndex((item) => item.id === entry.target.id);
					updateNavTranslateX(index);
				}
			}
		},
		{ rootMargin: '0px 0px -40% 0px', threshold: 0.1 }
	);

	navItems.forEach((item) => {
		const section = document.getElementById(item.id);
		if (section) observer.observe(section);
	});
});
</script>

{#if show}
  <!-- Navbar Atas -->
  <nav
    class="fixed top-0 z-50 w-full bg-white/30 shadow-md backdrop-blur-md px-6 py-2 md:py-4 flex justify-center items-center"
  >
    <h1 class="text-lg font-lora uppercase font-bold">
      <FontAwesomeIcon icon={faEnvelopeOpen} /> Undangan Digital
    </h1>
  </nav>

  <!-- Navbar Bawah -->
  <nav
    class="fixed bottom-0 z-50 w-full bg-white/30 shadow-lg/100 backdrop-blur-md overflow-x-auto scrollbar-hide"
  >
    <ul
      class="w-screen justify-center flex gap-6 md:gap-20 text-center text-sm px-4 py-2 md:py-4 md:justify-center min-w-full"
    >
      {#each navItems as item, index}
        <li class="shrink-0">
          <button
            bind:this={buttonElements[index]}
            on:click={() => handleNavClick(item.id, index)}
            class={`flex flex-col lg:flex-row items-center transition-transform duration-300 hover:scale-105 hover:cursor-pointer
							${activeSection === item.id ? "text-pink-600 font-bold scale-105" : "text-black"}
						`}
          >
            <!-- Icon -->
            <div class="flex">
              {#each item.icon as ic, i}
                <FontAwesomeIcon
                  icon={ic}
                  class="fa-2x {i === 1 ? 'text-red-300' : 'text-inherit'}"
                />
              {/each}
            </div>

            <!-- Label -->
            <span
              class="uppercase mt-0.5 font-bold font-poppins text-[7px] md:mt-0 lg:text-2xl lg:ml-2"
            >
              {item.label}
            </span>
          </button>
        </li>
      {/each}
    </ul>
  </nav>
{/if}
