import { BigUint32Array } from './BigUint32Array'

const LENGTH_LIMIT = 2 ** 32 -1

test('type', () => {
  const array = new BigUint32Array(10)
  expect(array instanceof BigUint32Array).toBe(true)
})

test('under limit', () => {
  const array = new BigUint32Array(10)
  expect(array.length).toBe(10)
})

test('over v8 limit', () => {
  const length = LENGTH_LIMIT * 2
  const array = new BigUint32Array(length)
  expect(array.length).toBe(length)
})

test('set value', () => {
  const array = new BigUint32Array(10)
  array[2] = 12345
  expect(array[2]).toBe(12345)
})

test('max length of Uint32Array', () => {
  const length = LENGTH_LIMIT
  const array = new BigUint32Array(length)
  expect(array.length).toBe(length)
  array[length - 1] = 12345
  expect(array[length - 1]).toBe(12345)
})

test('over max length of Uint32Array', () => {
  const length = LENGTH_LIMIT * 3
  const array = new BigUint32Array(length)
  expect(array.length).toBe(length)
  const index = LENGTH_LIMIT * 2 +6666
  array[index] = 54321
  expect(array[index]).toBe(54321)
})

test('iterate', () => {
  const array = new BigUint32Array(10)
  array[2] = 12345
  array[3] = 54321
  array[4] = 12345
  array[5] = 54321
  array[6] = 12345
  array[7] = 54321
  array[8] = 12345
  array[9] = 54321
  let index = 0
  for (const value of array) {
    expect(value).toBe(array[index])
    index++
  }
})

