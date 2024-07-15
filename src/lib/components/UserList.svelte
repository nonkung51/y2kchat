<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { db, auth } from "$lib/firebase";
  import {
    collection,
    getDocs,
    addDoc,
    query,
    where,
  } from "firebase/firestore";

  let users = [];
  const dispatch = createEventDispatcher();

  onMount(async () => {
    const usersSnapshot = await getDocs(collection(db, "users"));
    users = usersSnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((user) => user.id !== auth.currentUser.uid);
  });

  const startChat = async (userId) => {
    const currentUserId = auth.currentUser.uid;

    // Check if a group already exists
    const groupQuery = query(
      collection(db, "groups"),
      where("members", "array-contains", currentUserId),
      where("type", "==", "dm")
    );

    const groupSnapshot = await getDocs(groupQuery);
    let existingGroup = null;

    groupSnapshot.forEach((doc) => {
      const groupData = doc.data();
      if (groupData.members.includes(userId)) {
        existingGroup = { id: doc.id, ...groupData };
      }
    });

    let groupId;

    if (existingGroup) {
      groupId = existingGroup.id;
    } else {
      // Create a new group if one doesn't exist
      const newGroupRef = await addDoc(collection(db, "groups"), {
        members: [currentUserId, userId],
        type: "dm",
      });
      groupId = newGroupRef.id;
    }

    dispatch("selectChat", groupId);
  };
</script>

<div class="buddy-list">
  <div class="buddy-header">CHAT BUDDIES</div>
  {#each users as user}
    <button class="buddy-item" on:click={() => startChat(user.id)}>
      <div class="buddy-avatar default-avatar">
        {user.email ? user.email[0].toUpperCase() : "?"}
      </div>
      <div class="buddy-info">
        <div class="buddy-name">{user.email.toUpperCase()}</div>
        <!-- <div class="buddy-location">LOCATION UNKNOWN</div> -->
      </div>
    </button>
  {/each}
  <!-- <button class="add-buddy" on:click={() => }>ADD BUDDY</button> -->
</div>

<style>
  .buddy-list {
    width: 220px;
    background-color: #c0c0c0;
    border-right: 2px solid #dfdfdf;
    overflow-y: auto;
  }
  .buddy-header {
    background-color: #c0c0c0;
    padding: 5px;
    font-weight: bold;
    border-bottom: 1px solid #808080;
  }
  .buddy-item {
    display: flex;
    width: 100%;
    align-items: start;
    justify-content: start;
    padding: 5px;
    border-bottom: 1px solid #808080;
  }
  .buddy-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 8px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #808080;
    color: white;
    font-weight: bold;
  }
  .buddy-info {
    flex-grow: 1;
  }
  .buddy-name {
    font-weight: bold;
    font-size: 10px;
  }
  .buddy-location {
    font-size: 0.8em;
  }
</style>
