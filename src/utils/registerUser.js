import { auth, database } from '../database/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';

export const registerUser = async ({ fullname, job, email, password }) => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save extra user info in Realtime Database
    await set(ref(database, 'users/' + user.uid), {
      fullname,
      job,
      email,
      createdAt: new Date().toISOString(),
    });

    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};