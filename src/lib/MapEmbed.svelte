<script lang="ts">
  export let alamatMap: string
  const encoded = encodeURIComponent(alamatMap);
  const mapUrl = `https://www.google.com/maps?q=${encoded}&hl=id&z=16&output=embed`;
</script>
<iframe
  class="w-full h-50 lg:h-70 rounded-xl shadow-lg"
  src={mapUrl}
  width="400"
  height="300"
  style="border:0;"
  loading="lazy"
  referrerpolicy="no-referrer-when-downgrade"
  title="Lokasi Acara"
></iframe>
