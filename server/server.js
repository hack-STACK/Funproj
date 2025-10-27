

import express from "express";
import admin from "firebase-admin";
import cors from "cors"; // supaya bisa diakses dari Postman / web front-end

// === Inisialisasi Firebase Admin SDK ===
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore(); // koneksi ke Firestore
const app = express();

app.use(cors());
app.use(express.json());

// === ROUTE TESTING SERVER ===
app.get("/", (req, res) => {
  res.send("Server aktif ✅");
});

// === ROUTE TAMBAH USER ===
app.post("/add-user", async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Nama dan email wajib diisi!" });
  }

  try {
    await db.collection("users").add({
      name,
      email,
      createdAt: new Date(),
    });
    res.status(200).json({ message: "User berhasil ditambahkan!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal menyimpan data ke Firestore" });
  }
});

// === ROUTE AMBIL SEMUA USER ===
app.get("/users", async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();
    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengambil data" });
  }
});

// === JALANKAN SERVER ===
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server jalan di port ${PORT}`));
