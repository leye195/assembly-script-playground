// 짝수를 필터링하는 함수
export function filterEvenNumbers(arr: Array<i32>): Array<i32> {
  return arr.filter((value) => value % 2 == 0);
}

// 홀수를 필터링하는 함수
export function filterOddNumbers(arr: Array<i32>): Array<i32> {
  return arr.filter((value) => value % 2 != 0);
}

// 문자열 길이가 0보다 큰 문자열을 필터링하는 함수
export function filterEmptyStrings(arr: Array<string>): Array<string> {
  return arr.filter((value) => value.length > 0);
}
