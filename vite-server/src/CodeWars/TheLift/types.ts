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
