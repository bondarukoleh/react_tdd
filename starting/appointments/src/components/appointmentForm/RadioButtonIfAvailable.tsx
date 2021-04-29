import * as React from "react";

export const RadioButtonIfAvailable = ({availableTimeSlots, date, timeSlot}) => {
  const mergeDateAndTime = (date, timeSlot) => {
    const time = new Date(timeSlot);
    return new Date(date).setHours(
      time.getHours(),
      time.getMinutes(),
      time.getSeconds(),
      time.getMilliseconds()
    );
  };
  const startsAt = mergeDateAndTime(date, timeSlot);
  if (availableTimeSlots.some(timeSlot => timeSlot.startsAt === startsAt)) {
    return <input name="startsAt" type="radio" value={startsAt} />;
  }
  return null;
};
