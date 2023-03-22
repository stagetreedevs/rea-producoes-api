/* eslint-disable prettier/prettier */
import { initializeApp } from 'firebase/app';

export function initializeFirebaseApp() {
    const serviceAccount = {
        apiKey: "AIzaSyBhSgJt8qA5yNNkAvMHXQfgUsPXhB-B4lo",
        authDomain: "reaproducoes-31713.firebaseapp.com",
        projectId: "reaproducoes-31713",
        storageBucket: "reaproducoes-31713.appspot.com",
        messagingSenderId: "1030329546371",
        appId: "1:1030329546371:web:835ec1763a2d89e7cb8db6",
        measurementId: "G-FE7WL2BFKL"
    };

    initializeApp(serviceAccount);
}