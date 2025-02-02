import express from "express";
import routes from "./app/routes/routes.js";
import cors from "cors";
import { config } from "dotenv"

config();

const app = express();
const port = process.env.PORT || 3001;
const host = process.env.HOST;

const corsOptions = {
  origin: "*",
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.get("/", function (req, res) {
  res.send(
    `<h2 style="display: flex; justify-content: center; align-items: center;">Mahati Backend</h2>`
  );
});

app.use("/storage/uploads", express.static("./storage/uploads/"));
app.use("/api", routes);

// comment when running tests
app.listen(port, () => {
  console.log(`Server is running on port ${port} http://${host}:${port}`);
});

export default app;