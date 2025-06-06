<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { calculateTimeLeft, type TimeLeft } from './countdown';

  export let targetDate: Date;

  let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

  // Menyimpan interval countdown (bisa number atau undefined tergantung browser)
  let intervalId: ReturnType<typeof setInterval>;

  const update = () => {
    timeLeft = calculateTimeLeft(targetDate);
  };

  onMount(() => {
    update();
    intervalId = setInterval(update, 1000);
  });

  onDestroy(() => {
    clearInterval(intervalId);
  });
</script>

<!-- Tampilan countdown -->
<div class="flex gap-1 lg:gap-3 justify-center">
  <!-- kotak Countdown -->
  <div class="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-white items-center justify-center flex flex-col" >
    <span class="font-primary text-2xl md:text-3xl font-bold">{timeLeft.days}</span>
    <span class="text-xs font-bold font-primary uppercase">Hari</span>
  </div>
  <div class="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-white items-center justify-center flex flex-col" >
    <span class="font-primary text-2xl md:text-3xl font-bold">{timeLeft.hours}</span>
    <span class="text-xs font-bold font-primary uppercase">jam</span>
  </div>
  <div class="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-white items-center justify-center flex flex-col" >
    <span class="font-primary text-2xl md:text-3xl font-bold">{timeLeft.minutes}</span>
    <span class="text-xs font-bold font-primary uppercase">menit</span>
  </div>
  <div class="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-white items-center justify-center flex flex-col" >
    <span class="font-primary text-2xl md:text-3xl font-bold">{timeLeft.seconds}</span>
    <span class="text-xs font-bold font-primary uppercase">detik</span>
  </div>
</div>
