import { CheckDirection, CheckDirectionFromFloor, Direction } from "./types";

export const personWantsUp: CheckDirection = (targetFloor, queueFloor) =>
  targetFloor > queueFloor;

export const personWantsDown: CheckDirection = (targetFloor, queueFloor) =>
  targetFloor < queueFloor;

export const personWantsUpFrom: CheckDirectionFromFloor =
  (floor) => (targetFloor) =>
    targetFloor > floor;

export const personWantsDownFrom: CheckDirectionFromFloor =
  (floor) => (targetFloor) =>
    targetFloor < floor;

export const doLeaveDirection = (
  queue: number[],
  floor: number,
  direction: CheckDirection
) => {
  if (!queue.length) {
    return false;
  }
  return queue.some((targetFloor: number): boolean =>
    direction(targetFloor, floor)
  );
};

export const getOppositeDirection = (direction: Direction): Direction => {
  switch (direction) {
    case "up": {
      return "down";
    }
    case "down": {
      return "up";
    }
  }
};

export const addFloorToVisitedFactory =
  (visitedFloors: number[]) =>
  (floor: number): void => {
    if (visitedFloors.at(-1) === floor) {
      return;
    }
    visitedFloors.push(floor);
  };
