// Every model exposes Mongo's ObjectId _id under the field name the frontend
// already expects (user_id, product_id, ride_id...) instead of making the
// frontend learn Mongo's naming. Attach with schema.set('toJSON', idField('x_id')).
export function idField(name, { hide = [] } = {}) {
  return {
    virtuals: false,
    versionKey: false,
    transform(doc, ret) {
      ret[name] = ret._id.toString();
      delete ret._id;
      hide.forEach((f) => delete ret[f]);
      return ret;
    },
  };
}
