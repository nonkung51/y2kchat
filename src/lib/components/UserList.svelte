<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { db, auth } from '$lib/firebase';
  import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';

  let users = [];
  const dispatch = createEventDispatcher();

  onMount(async () => {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  });

  const startChat = async (userId) => {
    const currentUserId = auth.currentUser.uid;
    
    // Check if a group already exists
    const groupQuery = query(
      collection(db, 'groups'),
      where('members', 'array-contains', currentUserId),
      where('type', '==', 'dm')
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
      const newGroupRef = await addDoc(collection(db, 'groups'), {
        members: [currentUserId, userId],
        type: 'dm'
      });
      groupId = newGroupRef.id;
    }

    dispatch('selectChat', groupId);
  };
</script>

<h2>Users</h2>
<ul>
  {#each users as user}
    <li>
      {user.email}
      <button on:click={() => startChat(user.id)}>Start Chat</button>
    </li>
  {/each}
</ul>
