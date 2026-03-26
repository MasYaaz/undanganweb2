<script lang="ts">
  import { onMount } from "svelte";
  import "./app.css";

  import Hero from "./lib/SectionUndangan/Hero.svelte";
  import RSVPForm from "./lib/SectionUndangan/RSVPForm.svelte";
  import Cover from "./lib/SectionUndangan/Cover.svelte";
  import Story from "./lib/SectionUndangan/Story.svelte";
  import EventDetail from "./lib/SectionUndangan/EventDetail.svelte";
  import Gallery from "./lib/SectionUndangan/Gallery.svelte";
  import Navbar from "./lib/Component/Navbar.svelte";
  import MusicPlayer from "./lib/Component/MusicPlayer.svelte";

  // --- Variabel State Reaktif ---
  let targetSection: HTMLDivElement;
  let hasEntered: boolean = false;
  let showHero: boolean = true;

  // --- Navigasi dan Observasi Bagian ---
  let activeSection: string = "section2";
  const sections: string[] = ["section2", "section3", "section4", "section5"];

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
      options,
    );

    sections.forEach((id: string) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
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
  });
</script>

<main>
  <!-- SECTION 1: Hero dengan Countdown dan Tombol Scroll -->
  <Cover {showHero} {hasEntered} onEnter={enterInvitation} />
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
      <!-- Section 2 - Welcome -->
      <Hero />
      <!-- Section 3 - Quotes & Groom/Bride -->
      <Story />
    </div>

    <!-- Section 4 sampai 6 -->
    <div
      class="relative overflow-hidden"
      style="background-image: url('./images/back2.webp'); background-size: cover; background-position: center;"
    >
      <!-- Overlay semi-transparan -->
      <div
        class="absolute inset-0 z-0 bg-gradient-to-t from-white/20 via-white/30 to-white/100"
      ></div>
      <!-- Section 4 - Calendar & Flipcard -->
      <EventDetail />

      <!-- SECTION 5 -->
      <Gallery />
      <!-- RSVP Form -->
      <RSVPForm />
    </div>
  </div>
</main>
