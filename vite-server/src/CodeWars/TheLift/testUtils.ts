import { Queue } from "./types";

const createArrayOfEmptyArrays = <T>(count: number): T[][] =>
  [...Array(count)].map((_) => []);

const generateArray = (count: number, maxValue: number): number[] =>
  [...Array(count)].map((_) => ~~(Math.random() * maxValue));

const randomNumber = (max: number) => ~~(Math.random() * max);

export const generateQueues = (floors: number, people: number): Queue[] => {
  const queues: Queue[] = createArrayOfEmptyArrays(floors);

  let peopleGenerated = 0;

  while (peopleGenerated < people) {
    const idx = randomNumber(floors);
    let peopleCount = randomNumber(~~(people / 4));
    const isPeopleOverflowed = peopleGenerated + peopleCount > people;
    if (isPeopleOverflowed) {
      peopleCount = people - peopleGenerated;
    }

    peopleGenerated += peopleCount;

    const queue = generateArray(peopleCount, floors);
    queues[idx].push(...queue);
  }

  return queues;
};
