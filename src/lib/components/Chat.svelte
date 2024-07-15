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

<div>
  <div class="messages">
    {#each messages as message}
      <div class={message.senderId === auth.currentUser.uid ? 'sent' : 'received'}>
        {message.text}
      </div>
    {/each}
  </div>
  <form on:submit|preventDefault={sendMessage}>
    <input bind:value={newMessage} placeholder="Type a message...">
    <button type="submit">Send</button>
  </form>
</div>

<style>
  .messages {
    height: 300px;
    overflow-y: auto;
  }
  .sent {
    text-align: right;
    color: blue;
  }
  .received {
    text-align: left;
    color: green;
  }
</style>
