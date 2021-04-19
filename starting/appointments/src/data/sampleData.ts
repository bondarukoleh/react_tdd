import { name, phone, lorem } from 'faker';
import {makeId} from "../helpers/general";

const unique = (value, index, arr) => arr.indexOf(value) === index;
const getRandomElem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const today = new Date();
const at = hours => today.setHours(hours, 0);

const stylists = [0, 1, 2, 3, 4, 5, 6]
  .map(() => name.firstName())
  .filter(unique);

const services = [
  'Cut',
  'Blow-dry',
  'Cut & color',
  'Beard trim',
  'Cut & beard trim',
  'Extensions'
];

const generateFakeCustomer = () => ({
  firstName: name.firstName(),
  lastName: name.lastName(),
  phoneNumber: phone.phoneNumberFormat(1)
});

const generateFakeAppointment = () => ({
  customer: generateFakeCustomer(),
  stylist: getRandomElem(stylists),
  service: getRandomElem(services),
  notes: lorem.paragraph()
});

export const sampleAppointments = [
  { startsAt: at(9), id: makeId(), ...generateFakeAppointment() },
  { startsAt: at(10), id: makeId(), ...generateFakeAppointment() },
  { startsAt: at(11), id: makeId(), ...generateFakeAppointment() },
  { startsAt: at(12), id: makeId(), ...generateFakeAppointment() },
  { startsAt: at(13), id: makeId(), ...generateFakeAppointment() },
  { startsAt: at(14), id: makeId(), ...generateFakeAppointment() },
  { startsAt: at(15), id: makeId(), ...generateFakeAppointment() },
  { startsAt: at(16), id: makeId(), ...generateFakeAppointment() },
  { startsAt: at(17), id: makeId(), ...generateFakeAppointment() }
];
