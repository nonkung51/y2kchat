<script>
  import { onMount } from 'svelte';
  import { auth } from '$lib/firebase';
  import Login from '$lib/components/Login.svelte';
  import UserList from '$lib/components/UserList.svelte';
  import Chat from '$lib/components/Chat.svelte';

  let user = null;
  let selectedChat = null;

  onMount(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      user = currentUser;
    });
    return unsubscribe;
  });
</script>

{#if !user}
  <Login />
{:else}
  <h1>Chat App</h1>
  <UserList on:selectChat={(event) => selectedChat = event.detail} />
  {#if selectedChat}
    <Chat groupId={selectedChat} />
  {/if}
{/if}
