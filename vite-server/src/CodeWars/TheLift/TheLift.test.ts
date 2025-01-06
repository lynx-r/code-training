import { expect } from "chai";
import { describe, it } from "vitest";
import { theLift } from "./solution";
import { QUEUES_1 } from "./testConstants";

describe("Example Tests", function () {
  it("up", function () {
    let queues = [
      [], // G
      [], // 1
      [5, 5, 5], // 2
      [], // 3
      [], // 4
      [], // 5
      [], // 6
    ];
    let result = theLift(queues, 5);
    expect(result).to.have.members([0, 2, 5, 0]);
  });

  it("down", function () {
    let queues = [
      [], // G
      [], // 1
      [1, 1], // 2
      [], // 3
      [], // 4
      [], // 5
      [], // 6
    ];
    let result = theLift(queues, 5);
    expect(result).to.have.members([0, 2, 1, 0]);
  });

  it("up and up", function () {
    let queues = [
      [], // G
      [3], // 1
      [4], // 2
      [], // 3
      [5], // 4
      [], // 5
      [], // 6
    ];
    let result = theLift(queues, 5);
    expect(result).to.have.members([0, 1, 2, 3, 4, 5, 0]);
  });

  it("down and down", function () {
    let queues = [
      [], // G
      [0], // 1
      [], // 2
      [], // 3
      [2], // 4
      [3], // 5
      [], // 6
    ];
    let result = theLift(queues, 5);
    expect(result).to.have.members([0, 5, 4, 3, 2, 1, 0]);
  });

  it("up and down", function () {
    let queues = [
      [6], // G
      [3], // 1
      [4], // 2
      [1], // 3
      [5], // 4
      [3], // 5
      [], // 6
    ];
    let result = theLift(queues, 5);
    expect(result).to.have.members([0, 1, 2, 3, 4, 5, 6, 5, 3, 1, 0]);
  });

  it("yo-yo", function () {
    let queues = [
      [], // G
      [], // 1
      [4, 4], // 2
      [], // 3
      [2, 2], // 4
      [], // 5
      [], // 6
    ];
    let result = theLift(queues, 1);
    expect(result).to.have.members([0, 2, 4, 2, 4, 2, 0]);
  });

  it("lift full (up)", function () {
    let queues = [
      [3, 3], // G
      [], // 1
      [], // 2
      [], // 3
      [], // 4
      [], // 5
      [], // 6
    ];
    let result = theLift(queues, 1);
    expect(result).to.have.members([0, 3, 0, 3, 0]);
  });

  it("lift full (down)", function () {
    let queues = [
      [3], // G
      [3, 3], // 1
      [], // 2
      [1, 1, 1], // 3
      [], // 4
      [], // 5
      [], // 6
    ];
    let result = theLift(queues, 1);
    expect(result).to.have.members([+0, 1, 3, 1, 3, 1, 3, 1, +0]);
  });

  it("lift full (up and down)", function () {
    let queues = [
      [3, 3], // G
      [], // 1
      [], // 2
      [5, 5], // 3
      [], // 4
      [4, 4], // 5
      [], // 6
    ];
    let result = theLift(queues, 1);
    expect(result).to.have.members([+0, 3, 5, 4, +0, 3, 5, 4, +0]);
  });

  it("tricky queues", function () {
    let queues = [
      [1, 1], // G
      [5], // 1
      [], // 2
      [], // 3
      [], // 4
      [6, 1], // 5
      [5], // 6
    ];
    let result = theLift(queues, 1);
    expect(result).to.have.members([+0, 1, 5, 6, 5, 1, +0, 1, +0]);
  });

  it("highlander", function () {
    let queues = [
      [], // G
      [2, 2], // 1
      [3, 3, 3], // 2
      [], // 3
      [], // 4
      [], // 5
      [], // 6
    ];
    let result = theLift(queues, 1);
    expect(result).to.have.members([+0, 1, 2, 3, 1, 2, 3, 2, 3, +0]);
  });

  it("fire drill!", function () {
    expect(true).to.be.true;
    let queues = [
      [6, 5, 4, 3, 2, 1], // G
      [0, 3], // 1
      [1, 5], // 2
      [2, 5, 1], // 3
      [3, 2, 1], // 4
      [4, 3, 6, 2, 1], // 5
      [5, 4, 3, 2, 1], // 6
    ];
    let result = theLift(queues, 2);
    expect(result).to.have.members([
      0, 1, 2, 3, 5, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1, 0, 1,
      2, 3, 5, 6, 5, 4, 3, 1, 5, 4, 2, 1, 4, 1, 0,
    ]);
  });

  it("out of band at top floor", function () {
    let queues = [
      [], // G
      [], // 1
      [3], // 2
      [1], // 3
    ];
    let result = theLift(queues, 5);
    expect(result).to.have.members([0, 2, 3, 1, 0]);
  });

  it("example", function () {
    let queues = [
      [], // G
      [6, 5, 2], // 1
      [4], // 2
      [], // 3
      [0, 0, 0], // 4
      [], // 5
      [], // 6
      [3, 6, 4, 5, 6], // 7
      [], // 8
      [1, 10, 2], // 9
      [1, 4, 3, 2], // 10
    ];
    let result = theLift(queues, 5);
    expect(result).to.have.members([
      0, 1, 2, 4, 5, 6, 9, 10, 9, 7, 4, 3, 2, 1, 0, 9, 7, 6, 5, 4, 3, 2, 0, 7,
      6, 0,
    ]);
  });

  it("empty", function () {
    let queues = [
      [], // G
      [], // 1
      [], // 2
      [], // 3
      [], // 4
      [], // 5
      [], // 6
    ];
    let result = theLift(queues, 5);
    expect(result).to.have.members([0]);
  });

  let i = 0,
    floors = 15,
    people = 20,
    liftHolds = 1;

  it(`R#${i}: ${floors}, ${people} people, lift holds ${liftHolds}`, function () {
    let queues = QUEUES_1; // generateQueues(floors, people);

    let result = theLift(queues, liftHolds);
    expect(result).to.have.members([
      0, 1, 6, 8, 10, 12, 14, 10, 6, 1, 0, 1, 6, 10, 13, 14, 10, 6, 3, 0, 1, 6,
      10, 14, 13, 10, 7, 6, 1, 0, 1, 6, 7, 10, 13, 10, 8, 6, 5, 0, 1, 6, 9, 10,
      14, 10, 1, 3, 6, 12, 0,
    ]);
  });
});
