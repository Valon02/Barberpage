import * as admin from "firebase-admin";
import * as dotenv from "dotenv";

dotenv.config();

const decoded = Buffer.from(process.env.FIREBASE_KEY_BASE64!, "base64").toString("utf-8");
const serviceAccount = JSON.parse(decoded);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export { admin, db };
