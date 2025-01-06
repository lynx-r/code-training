// types.ts

export type Queue = number[];

export type CheckDirection = (targetFloor: number, floor: number) => boolean;
export type CheckDirectionFromFloor = (
  fromFloor: number
) => (targetFloor: number) => boolean;
export type Direction = "up" | "down";

export interface DirectionChooser {
  chooseDirection(
    currentDirection: Direction,
    queues: Queue[],
    lift: Queue,
    stopFloor: number
  ): Direction;
}

export interface DirectionStrategy {
  getDirection(queues: Queue[], lift: Queue, stopFloor: number): Direction;
}

export type DirectionStrategies = Partial<Record<Direction, DirectionStrategy>>;

// TheLift.ts

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

// utils.ts

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

// DirectionChooser.ts

class DirectionChooserImpl implements DirectionChooser {
  directions: DirectionStrategies = {};

  use(direction: Direction, strategy: DirectionStrategy) {
    this.directions[direction] = strategy;
  }

  /**
   * Choose a direction based on rules from the task by inverting or
   * leaving it same
   *
   * The Lift never changes direction until there are no more people wanting
   *    to get on/off in the direction it is already traveling.
   *
   * When empty the Lift tries to be smart. For example,
   *    If it was going up then it will continue up to collect the highest
   *    floor person wanting to go down
   *    If it was going down then it will continue down to collect the lowest
   *    floor person wanting to go up
   *
   * @param {Queue[]} queues - A queues at a building floors
   * @param {Queue} lift - A lift with people
   * @param {number} stopFloor - A floor where a lift stopped
   * @returns {boolean} inverted or same direction
   */
  chooseDirection(
    direction: Direction,
    queues: Queue[],
    lift: Queue,
    stopFloor: number
  ): Direction {
    if (!this.directions[direction]) {
      throw new Error(`direction '${direction}' not implemented`);
    }
    return this.directions[direction]!.getDirection(queues, lift, stopFloor);
  }
}

abstract class AbstractDirectionStrategy implements DirectionStrategy {
  constructor(private currentDirection: Direction) {}

  protected abstract checkSameDirection: CheckDirection;
  protected abstract checkOppositeDirection: CheckDirection;
  protected abstract checkSameDirectionFromFloor: CheckDirectionFromFloor;

  protected abstract doLeaveDirection(
    queues: Queue[],
    fromFloor: number,
    checkDirection: CheckDirection
  ): boolean;

  /**
   * Get a direction based on the SameLiftDirection rule and
   * the SmartLiftDirection rule
   *
   * @param {Queue[]} queues - A queues at a building floors
   * @param {Queue} lift - A lift with people
   * @param {number} stopFloor - A floor where a lift stopped
   * @returns {boolean} inverted or same direction
   */
  getDirection(queues: Queue[], lift: Queue, stopFloor: number): Direction {
    const doLeaveBySameRule = this.doLeaveDirectionBySameRule(
      queues,
      lift,
      stopFloor
    );
    const doLeaveBySmartRule = this.doLeaveDirectionBySmartRule(
      queues,
      stopFloor
    );
    if (!doLeaveBySameRule && !doLeaveBySmartRule) {
      return getOppositeDirection(this.currentDirection);
    }
    return this.currentDirection;
  }

  /**
   * When empty the Lift tries to be smart. For example,
   *  If it was going up then it will continue up to collect the highest floor
   *    person wanting to go down
   *  If it was going down then it will continue down to collect the lowest floor
   *    person wanting to go up
   *
   * @param {Queue[]} queues - A queues at a building floors
   * @param {number} stopFloor - A floor where a lift stopped
   * @returns {boolean} whether to change direction
   */
  private doLeaveDirectionBySmartRule(
    queues: Queue[],
    stopFloor: number
  ): boolean {
    let doLeaveDirection = this.doLeaveDirection(
      queues,
      stopFloor,
      this.checkOppositeDirection
    );

    if (doLeaveDirection) {
      const isGround = stopFloor === 0;
      const isTop = stopFloor === queues.length - 1;
      if (isGround) {
        doLeaveDirection = false;
      } else if (isTop) {
        doLeaveDirection = false;
      }
    }
    return doLeaveDirection;
  }

  /**
   * The Lift never changes direction until there are no more people wanting
   * to get on/off in the direction it is already traveling
   *
   * @param {Queue[]} queues - A queues at a building floors
   * @param {Queue} lift - A lift with people
   * @param {number} stopFloor - A floor where a lift stopped
   * @returns {boolean} whether to change direction
   */
  private doLeaveDirectionBySameRule(
    queues: Queue[],
    lift: number[],
    stopFloor: number
  ): boolean {
    let doLeaveDirectionToGetOffLift = false;
    const isLiftFilled = !!lift.length;
    if (isLiftFilled) {
      doLeaveDirectionToGetOffLift = lift.some(
        this.checkSameDirectionFromFloor
      );
    }
    const doLeaveDirectionToGetOnLift = this.doLeaveDirection(
      queues,
      stopFloor,
      this.checkSameDirection
    );

    return doLeaveDirectionToGetOffLift || doLeaveDirectionToGetOnLift;
  }
}

class DirectionUp extends AbstractDirectionStrategy {
  protected checkSameDirection: CheckDirection = personWantsUp;
  protected checkOppositeDirection: CheckDirection = personWantsDown;
  protected checkSameDirectionFromFloor: CheckDirectionFromFloor =
    personWantsUpFrom;

  protected doLeaveDirection(
    queues: Queue[],
    fromFloor: number,
    checkDirection: CheckDirection
  ): boolean {
    for (let floor = fromFloor; floor < queues.length; floor++) {
      const queue = queues[floor];
      const doLeaveDir = doLeaveDirection(queue, floor, checkDirection);
      if (doLeaveDir) {
        return true;
      }
    }
    return false;
  }
}

class DirectionDown extends AbstractDirectionStrategy {
  protected checkSameDirection: CheckDirection = personWantsDown;
  protected checkOppositeDirection: CheckDirection = personWantsUp;
  protected checkSameDirectionFromFloor: CheckDirectionFromFloor =
    personWantsDownFrom;

  protected doLeaveDirection(
    queues: Queue[],
    fromFloor: number,
    checkDirection: CheckDirection
  ): boolean {
    for (let floor = fromFloor; floor >= 0; floor--) {
      const queue = queues[floor];
      const doLeaveDir = doLeaveDirection(queue, floor, checkDirection);
      if (doLeaveDir) {
        return true;
      }
    }
    return false;
  }
}

const DIRECTION_CHOOSER = new DirectionChooserImpl();

DIRECTION_CHOOSER.use("up", new DirectionUp("up"));
DIRECTION_CHOOSER.use("down", new DirectionDown("down"));

const getNextDirection = (
  currentDirection: Direction,
  queues: Queue[],
  lift: Queue,
  stopFloor: number
) => {
  return DIRECTION_CHOOSER.chooseDirection(
    currentDirection,
    queues,
    lift,
    stopFloor
  );
};
