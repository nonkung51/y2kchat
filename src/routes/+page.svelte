<script>
  import { onMount } from "svelte";
  import { auth } from "$lib/firebase";
  import UserList from "$lib/components/UserList.svelte";
  import Chat from "$lib/components/Chat.svelte";
  import Login from "../lib/components/Login.svelte";

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
  <div class="window">
    <div class="title-bar">
      <div class="title-bar-text">Chat Buddies</div>
      <div class="title-bar-controls">
        <button aria-label="Minimize"></button>
        <button aria-label="Maximize"></button>
        <button aria-label="Close"></button>
      </div>
    </div>
    <div class="window-body">
      <UserList on:selectChat={(event) => (selectedChat = event.detail)} />
      {#if selectedChat}
        <Chat groupId={selectedChat} />
      {/if}
    </div>
  </div>
{/if}

<style>
  .window {
    width: 800px;
    height: 600px;
    background-color: #c0c0c0;
    border: 2px solid #dfdfdf;
    border-top-color: #ffffff;
    border-left-color: #ffffff;
    box-shadow: inset -2px -2px 0 #808080;
  }
  .title-bar {
    background: linear-gradient(90deg, #000080, #1084d0);
    padding: 3px 2px 3px 3px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .title-bar-text {
    font-weight: bold;
    color: white;
    letter-spacing: 0;
    margin-right: 24px;
  }
  .title-bar-controls {
    display: flex;
  }
  .title-bar-controls button {
    width: 16px;
    height: 14px;
    margin-left: 2px;
  }
  .window-body {
    display: flex;
    height: calc(100% - 20px);
  }
</style>
