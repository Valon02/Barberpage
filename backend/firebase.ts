// backend/firebase.ts
import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

const decoded = Buffer.from(process.env.FIREBASE_KEY_BASE64!, 'base64').toString();
const serviceAccount = JSON.parse(decoded);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
