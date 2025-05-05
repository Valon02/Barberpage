import express from "express";
import cors from "cors";

import slotsRouter from "./routes/slots"; // 👈 denna måste vara default-export från slots.ts
import setRoleRoute from "./routes/setRole";
import bookingsRoute from "./routes/bookings";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/api/slots", slotsRouter);
app.use("/api", setRoleRoute);
app.use("/api/bookings", bookingsRoute);

app.listen(PORT, () => {
  console.log(`🚀 Servern körs på http://localhost:${PORT}`);
});
