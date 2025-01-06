import getNextDirection from "./DirectionChooser";
import { Direction } from "./types";
import {
  addFloorToVisitedFactory,
  personWantsDownFrom,
  personWantsUpFrom,
} from "./utils";

export const theLift = (queues: number[][], capacity: number): number[] => {
  const nextFloorAndDirection = () => {
    stopFloor = getNextFloor(stopFloor, direction);
    direction = getNextDirection(direction, queues, lift, stopFloor);
  };

  let lift: number[] = [];
  let direction: Direction = "up";
  let stopFloor = 0;
  let isLiftEmpty = true;

  const visitedFloors: number[] = [];
  const addFloorToVisited = addFloorToVisitedFactory(visitedFloors);
  addFloorToVisited(0);

  let isQueuesEmpty = checkIfQueuesEmpty(queues);
  if (isQueuesEmpty) {
    return visitedFloors;
  }

  while (true) {
    const areGettingOff = !!(lift.length && lift.includes(stopFloor));
    if (areGettingOff) {
      lift = getNewLift(lift, stopFloor);
      addFloorToVisited(stopFloor);

      isLiftEmpty = !lift.length;
      isQueuesEmpty = checkIfQueuesEmpty(queues);
      const hasWorkDone = isLiftEmpty && isQueuesEmpty;
      if (hasWorkDone) {
        break;
      }

      direction = getNextDirection(direction, queues, lift, stopFloor);
    }

    const queue = queues[stopFloor];
    const areGettingOn = !!queue.length;
    if (!areGettingOn) {
      nextFloorAndDirection();
      continue;
    }
    const waitingPeople = getWaitingPeople(queue, stopFloor, direction);

    const areWaitingPeople = !!waitingPeople.length;
    if (!areWaitingPeople) {
      nextFloorAndDirection();
      continue;
    }

    const boardingPeople = getPeopleBoundedByCapacity(
      waitingPeople,
      lift.length,
      capacity
    );
    const isLoadingPeople = !!boardingPeople.length;
    if (!isLoadingPeople) {
      // When called, the Lift will stop at a floor even if it is full, although
      // unless somebody gets off nobody else can get on!
      addFloorToVisited(stopFloor);
      nextFloorAndDirection();
      continue;
    }

    lift.push(...boardingPeople);
    isLiftEmpty = !lift.length;
    queues[stopFloor] = getQueueWithoutBoardingPeople(queue, boardingPeople);

    addFloorToVisited(stopFloor);
    nextFloorAndDirection();
  }

  addFloorToVisited(0);
  return visitedFloors;
};

/**
 * Get a lift without people who get off on the {@link stopFloor}
 *
 * @param {number[]} lift - A current lift
 * @param {number} stopFloor - A floor where lift is stopped
 * @returns {number[]} A lift without people getting off on the {@link stopFloor}
 */
const getNewLift = (lift: number[], stopFloor: number): number[] => {
  return lift.filter((floor) => floor !== stopFloor);
};

const getNextFloor = (currentFloor: number, direction: Direction): number => {
  switch (direction) {
    case "up": {
      return currentFloor + 1;
    }
    case "down": {
      return currentFloor - 1;
    }
  }
};

const checkIfQueuesEmpty = (queues: number[][]): boolean => {
  return queues.every((queue) => !queue.length);
};

/**
 * Get a people queue bounded by a lift capacity
 *
 * @param {number[]} queue - People wanting to lift
 * @param {number} currentLiftLoad - A current lift load
 * @param {number} capacity - A lift capacity
 *
 * @returns {number[]} people from a queue witch a lift can get on
 */
const getPeopleBoundedByCapacity = (
  queue: number[],
  currentLiftLoad: number,
  capacity: number
): number[] => {
  if (currentLiftLoad === capacity) {
    return [];
  }
  const queueLength = queue.length;
  const newLiftCapacity = currentLiftLoad + queueLength;
  if (newLiftCapacity > capacity) {
    const rightSide = newLiftCapacity - capacity;
    const leftSide = queueLength - rightSide;
    return queue.slice(0, leftSide);
  }
  return queue;
};

/**
 * Get a new queue without getting on the lift people
 *
 * @param {number[]} queue - People from a current floor's queue
 * @param {number[]} people - People witch get on the lift
 * @returns {number[]} a new floor's queue without getting on the lift people
 */
const getQueueWithoutBoardingPeople = (
  queue: number[],
  people: number[]
): number[] => {
  const extraPeople = [...people];
  return queue.filter((floor) => {
    const idx = extraPeople.indexOf(floor);
    const isInQueue = idx !== -1;
    if (isInQueue) {
      extraPeople.splice(idx, 1);
    }
    return !isInQueue;
  });
};

/**
 * Get people from a queue for loading to a lift
 *
 * @param {number[]} queue - A queue of the floor
 * @param {number} stopFloor - A floor where a lift stopped to get on people
 * @param {Direction} direction - A direction of the lift traveling
 * @returns {number[]} a new queue of people on the way to the top/bottom
 */
const getWaitingPeople = (
  queue: number[],
  stopFloor: number,
  direction: Direction
): number[] => {
  switch (direction) {
    case "up": {
      return queue.filter(personWantsUpFrom(stopFloor));
    }
    case "down": {
      return queue.filter(personWantsDownFrom(stopFloor));
    }
  }
};
