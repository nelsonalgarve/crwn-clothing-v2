import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyCj9OxF8t_NOSbEpTVtlnHDBp36qBVu4Yw',
	authDomain: 'crw-clothing-db-e2c89.firebaseapp.com',
	projectId: 'crw-clothing-db-e2c89',
	storageBucket: 'crw-clothing-db-e2c89.appspot.com',
	messagingSenderId: '799062605557',
	appId: '1:799062605557:web:dda911f40a2ec16f824fbc',
};

const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
	prompt: 'select_account',
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);
export const signInWithGoogleRedirect = () => signInWithRedirect(auth, googleProvider);

export const db = getFirestore();

export const createUserDocumentFromAuth = async (userAuth, additionalInformation = {}) => {
	if (!userAuth) return;

	const userDocRef = doc(db, 'users', userAuth.uid);

	const userSnapshot = await getDoc(userDocRef);

	if (!userSnapshot.exists()) {
		const { displayName, email } = userAuth;
		const createdAt = new Date();

		try {
			await setDoc(userDocRef, {
				displayName,
				email,
				createdAt,
				...additionalInformation,
			});
		} catch (error) {
			console.log('error creating the user', error.message);
		}
	}

	return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
	if (!email || !password) return;

	return await createUserWithEmailAndPassword(auth, email, password);
};
