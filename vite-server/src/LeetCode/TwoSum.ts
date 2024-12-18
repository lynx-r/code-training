export function twoSum(nums: number[], target: number): number[] {
  if (nums.length < 2) {
    throw new Error("nums length must be more then 2 digits");
  }

  if (nums.length > 10 ** 4) {
    throw new Error("nums length must be less then 10^4 digits");
  }

  if (target < -(10 ** 9) || target > 10 ** 9) {
    throw new Error(
      "target must be greater then -10^9 and less then 10^9 digits"
    );
  }

  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }

  return [];
}
