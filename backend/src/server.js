import "dotenv/config"; 
import app from "./app.js";
import connectDB from "./config/db.js";

connectDB();

app.listen(9000, () => {
  console.log("Server running on 9000");
});
