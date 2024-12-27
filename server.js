import { connectToDb } from "./db.js";
import app from "./app.js";
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    connectToDb()
  console.log(`Serving on PORT ${PORT}`);
});
