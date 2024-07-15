<script>
  import { onMount } from 'svelte';
  import { db, auth } from '$lib/firebase';
  import { collection, addDoc, query, where, getDocs, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

  export let groupId;

  let messages = [];
  let newMessage = '';

  onMount(() => {
    subscribeToMessages();
  });

  function subscribeToMessages() {
    const messagesQuery = query(
      collection(db, 'messages'),
      where('groupId', '==', groupId),
      orderBy('timestamp')
    );

    onSnapshot(messagesQuery, (snapshot) => {
      messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    });
  }

  async function sendMessage() {
    if (newMessage.trim() === '') return;

    try {
      await addDoc(collection(db, 'messages'), {
        groupId: groupId,
        senderId: auth.currentUser.uid,
        text: newMessage,
        timestamp: serverTimestamp()
      });

      newMessage = '';
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }
</script>

<div class="chat-window">
  <div class="chat-header"></div>
  <div class="chat-messages">
    {#each messages as message}
      <div class="message">
        <span class="message-sender {message.senderId === auth.currentUser.uid ? 'matheu' : 'kelli'}">{message.senderId === auth.currentUser.uid ? 'matheu' : 'kelli'}:</span> {message.text}
      </div>
    {/each}
  </div>
  <div class="chat-input">
    <input type="text" bind:value={newMessage} placeholder="type something here...">
    <button on:click={sendMessage}>return</button>
  </div>
</div>

<style>
  .chat-window {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      background-color: #ffffff;
      border-left: 2px solid #808080;
  }
  .chat-header {
      background-color: #000080;
      color: white;
      padding: 5px;
      font-weight: bold;
  }
  .chat-messages {
      flex-grow: 1;
      padding: 10px;
      overflow-y: auto;
  }
  .message {
      margin-bottom: 10px;
  }
  .message-sender {
      font-weight: bold;
  }
  .message-sender.matheu { color: #0000ff; }
  .message-sender.kelli { color: #ff0000; }
  .chat-input {
      display: flex;
      padding: 10px;
      background-color: #c0c0c0;
      border-top: 2px solid #808080;
  }
  .chat-input input {
      flex-grow: 1;
      margin-right: 10px;
  }
</style>
