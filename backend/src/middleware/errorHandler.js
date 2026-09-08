// Catch-all for anything a route/controller throws (including via asyncHandler).
// Must be registered LAST, after all routes, and must take 4 args for
// Express to recognize it as an error handler.
export function errorHandler(err, req, res, next) {
  console.error(err);

  // Mongoose gives structured errors for common cases - surface them as 4xx
  // instead of a generic 500 so the frontend's toast messages stay useful.
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: Object.values(err.errors).map((e) => e.message).join(', ') });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ message: `Invalid ${err.path}` });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: 'A record with that value already exists' });
  }

  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message || 'Internal server error' });
}

export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}
