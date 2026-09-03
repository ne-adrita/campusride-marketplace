// Catch-all for anything a route/controller throws (including via asyncHandler).
// Must be registered LAST, after all routes, and must take 4 args for
// Express to recognize it as an error handler.
export function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message || 'Internal server error' });
}

export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}
