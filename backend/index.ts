import express from "express";
import cors from "cors";
import slotsRouter from "./routes/slots";
import bookingsRouter from "./routes/bookings";
import setRoleRouter from "./routes/setRole";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ROUTER-ANSLUTNINGAR
app.use("/api/slots", slotsRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/set-role", setRoleRouter);

// TESTROUTE (för felsökning)
app.get("/api/test", (_req, res) => {
  res.send("✅ API fungerar!");
});

app.listen(PORT, () => {
  console.log(`🚀 Servern körs på http://localhost:${PORT}`);
});
