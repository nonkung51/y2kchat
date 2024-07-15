<script>
  import { auth } from '$lib/firebase';
  import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

  let email = '';
  let password = '';

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // The user will be automatically added to Firestore by the auth listener
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };
</script>

<h2>Login / Signup</h2>
<form>
  <input type="email" bind:value={email} placeholder="Email" />
  <input type="password" bind:value={password} placeholder="Password" />
  <button on:click|preventDefault={handleLogin}>Login</button>
  <button on:click|preventDefault={handleSignup}>Signup</button>
</form>
