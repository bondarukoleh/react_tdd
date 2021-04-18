const today = new Date();
const at = hours => today.setHours(hours, 0);

import {makeId} from "../helpers/general";

export const sampleAppointments = [
  {startsAt: at(9), customer: {firstName: 'Charlie'}, id: makeId()},
  {startsAt: at(10), customer: {firstName: 'Frankie'}, id: makeId()},
  {startsAt: at(11), customer: {firstName: 'Casey'}, id: makeId()},
  {startsAt: at(12), customer: {firstName: 'Ashley'}, id: makeId()},
  {startsAt: at(13), customer: {firstName: 'Jordan'}, id: makeId()},
  {startsAt: at(14), customer: {firstName: 'Jay'}, id: makeId()},
  {startsAt: at(15), customer: {firstName: 'Alex'}, id: makeId()},
  {startsAt: at(16), customer: {firstName: 'Jules'}, id: makeId()},
  {startsAt: at(17), customer: {firstName: 'Stevie', id: makeId()}}
];
