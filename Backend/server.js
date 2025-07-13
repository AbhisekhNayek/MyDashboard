import { app } from "./app.js";

// Simple health check route to verify server is running
app.get('/', (req, res) => {
  res.end(`My Dashboard is Running...`);
});

// Start the Express server on the port specified in environment variables
app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
