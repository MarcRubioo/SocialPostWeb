import { initializeApp } from 'firebase/app';

export const enviroment = {
  firebase: {
    apiKey: "AIzaSyB6sjfyGU9KgP_olEaTYAJ6UmmbceWmgGs",
    authDomain: "social-post-m13.firebaseapp.com",
    projectId: "social-post-m13",
    storageBucket: "social-post-m13.appspot.com",
    messagingSenderId: "516807333726",
    appId: "1:516807333726:web:7e11c787ddcb5e55d621cf",
    measurementId: "G-1TLN53RQ7X"
  }
};

const temp = initializeApp(enviroment.firebase);

export const app = temp;
