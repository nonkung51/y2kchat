<script>
  import { onMount } from 'svelte';
  import { initializeAuthListener } from '$lib/firebase';

  onMount(() => {
    initializeAuthListener();
  });
</script>

<slot />
