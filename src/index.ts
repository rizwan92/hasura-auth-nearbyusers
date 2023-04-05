import express, { Request, Response } from "express";
import { generateJWT } from "./jwt.js";

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.post("/api/auth", (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (username && password) {
    const token = generateJWT({ userId: username });
    console.log(token);
    res.json({ token });
  } else {
    res.status(400).json({ error: "Invalid username or password" });
  }
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
