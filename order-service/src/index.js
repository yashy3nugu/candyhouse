/* Assuming that the order-service is using Express and that there is an existing 'app' declared in this file. If not, we will add one. */

// Add GET /health endpoint in the Express app.
// We'll search for where app is defined, and then append the route handler.

// ... existing code ...

// At the end of your configuration for your Express app, add the following:
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// ... existing code ... 