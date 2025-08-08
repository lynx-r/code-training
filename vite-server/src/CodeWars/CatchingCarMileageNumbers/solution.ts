interface Command {
  exec(n: number): boolean;
}

class Monotone implements Command {
  // Any digit followed by all zeros: 100, 90000
  exec(n: number): boolean {
    return /^[1-9]{1}0{2,}$/i.test(n + "");
  }
}

class SameNumber implements Command {
  // Every digit is the same number: 1111
  exec(n: number): boolean {
    const uniq = new Set(n.toString().split(""));
    return uniq.size === 1;
  }
}

class SequentialDecremental implements Command {
  // The digits are sequential, decrementing‡: 4321
  exec(n: number): boolean {
    const num = n.toString();
    let isDec = true;
    for (let i = 0; i < num.length - 1; i++) {
      const cur = +num[i];
      const next = +num[i + 1];
      if (cur <= next || cur - next !== 1) {
        if (i === num.length - 2 && cur === 1 && next === 0) {
          break;
        }
        isDec = false;
        break;
      }
    }

    return isDec;
  }
}

class SequentialIncremental implements Command {
  // The digits are sequential, incementing†: 1234
  exec(n: number): boolean {
    const num = n.toString();
    let isInc = true;
    for (let i = 0; i < num.length - 1; i++) {
      const cur = +num[i];
      const next = +num[i + 1];
      if (cur >= next || next - cur !== 1) {
        if (i === num.length - 2 && cur === 9 && next === 0) {
          break;
        }
        isInc = false;
        break;
      }
    }

    return isInc;
  }
}

class Palindrome implements Command {
  // The digits are sequential, incementing†: 1234
  exec(n: number): boolean {
    const num = n.toString();
    const reversed = num.split("").reverse().join("");
    return num === reversed;
  }
}

function validateNumberRange(num: number, min: number, max: number) {
  // First, ensure the input is actually a number
  if (typeof num !== "number" || isNaN(num)) {
    return false; // Not a valid number
  }

  // Check if the number is greater than or equal to the minimum
  // AND less than or equal to the maximum
  return num >= min && num <= max;
}

export function isInteresting(n: number, awesomePhrases: number[]): number {
  // CODE HERE

  let monotone = new Monotone();
  let sameNumber = new SameNumber();
  let decSeq = new SequentialDecremental();
  let incSeq = new SequentialIncremental();
  let palindrome = new Palindrome();

  const checks = [monotone, sameNumber, decSeq, incSeq, palindrome];

  for (let i = 0; i < 3; i++) {
    for (let check of checks) {
      if (!validateNumberRange(n + i, 98, 1_000_000_000)) {
        return 0;
      }
      if (check.exec(n + i)) {
        if (!validateNumberRange(n, 100, 1_000_000_000)) {
          return 1;
        }
        return i == 0 ? 2 : 1;
      }
    }
  }

  for (let aws of awesomePhrases) {
    if (aws === n) {
      return 2;
    }
    if (n + 1 == aws || n + 2 === aws) {
      return 1;
    }
  }
  return 0;
}
