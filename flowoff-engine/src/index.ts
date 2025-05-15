import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express, { Request, Response } from "express";
import cors from "cors";

admin.initializeApp();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.post("/", async (req: Request, res: Response) => {
  const { walletAddress } = req.body;

  if (!walletAddress || typeof walletAddress !== "string") {
    return res.status(400).send("Wallet inválida");
  }

  try {
    const uid = `wallet:${walletAddress.toLowerCase()}`;

    // Cria o user se não existir
    await admin.auth().getUser(uid).catch(async () => {
      await admin.auth().createUser({ uid });
    });

    const token = await admin.auth().createCustomToken(uid);
    return res.status(200).json({ token });
  } catch (error) {
    console.error("🔥 Erro no /api/auth:", error);
    return res.status(500).send("Erro interno do ritual");
  }
});

exports.auth = functions.https.onRequest(app);
