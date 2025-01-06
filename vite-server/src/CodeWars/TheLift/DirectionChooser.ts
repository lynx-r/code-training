import {
  CheckDirection,
  CheckDirectionFromFloor,
  Direction,
  DirectionChooser,
  DirectionStrategies,
  DirectionStrategy,
  Queue,
} from "./types";
import {
  doLeaveDirection,
  getOppositeDirection,
  personWantsDown,
  personWantsDownFrom,
  personWantsUp,
  personWantsUpFrom,
} from "./utils";

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

export default getNextDirection;
