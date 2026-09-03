// Tiny id generator so we don't need a database's auto-increment / ObjectId.
// Produces ids like "prod_13", "ride_8", "msg_6" - same style the frontend's
// preview-mode mock data already uses, so records look identical either way.
const counters = {};

export function generateId(prefix) {
  const key = prefix.replace(/_$/, '');
  counters[key] = (counters[key] || 0) + 1;
  return `${prefix}${counters[key]}`;
}

// Let a starting counter be set once seed data is loaded, so new ids never
// collide with seeded ones (e.g. seed already has prod_1..prod_12).
export function seedCounter(prefix, startValue) {
  const key = prefix.replace(/_$/, '');
  counters[key] = startValue;
}
