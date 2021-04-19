export const makeId = () => Math.floor(Math.random() * 1_000_000_000);

export const appointmentTimeOfDay = startsAt => {
  const [h, m] = new Date(startsAt).toTimeString().split(':');
  return `${h}:${m}`;
};
