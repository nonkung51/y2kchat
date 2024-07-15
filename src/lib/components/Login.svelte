<script>
  import { auth } from "$lib/firebase";
  import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
  } from "firebase/auth";

  let email = "";
  let password = "";

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // The user will be automatically added to Firestore by the auth listener
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };
</script>

<div class="window">
  <div class="title-bar">
    <div class="title-bar-text">Sign In</div>
    <div class="title-bar-controls">
      <button aria-label="Minimize"></button>
      <button aria-label="Maximize"></button>
      <button aria-label="Close"></button>
    </div>
  </div>
  <div class="window-body">
    <div class="field-row">
      <label for="email">Email:</label>
      <input type="text" bind:value={email} placeholder="Email" />
    </div>
    <div class="field-row">
      <label for="password">Password:</label>
      <input type="password" bind:value={password} placeholder="Password" />
    </div>
    <div class="buttons">
      <button on:click|preventDefault={handleLogin}>Sign In</button>
      <button on:click|preventDefault={handleSignup}>Sign Up</button>
    </div>
  </div>
</div>

<style>
  .window {
    width: 300px;
  }
  .title-bar {
    background: linear-gradient(90deg, navy, #1084d0);
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
    flex-direction: column;
    padding: 11px;
    background-color: #c0c0c0;
  }
  .field-row {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 6px;
  }
  .field-row label {
    margin-right: 6px;
  }
  .field-row input {
    flex-grow: 1;
    max-width: 200px;
  }
  .buttons {
    display: flex;
    justify-content: center;
    margin-top: 12px;
  }
  .buttons button {
    min-width: 70px;
    margin: 0 4px;
  }
</style>
