import { BigString } from './BigString'


beforeAll(() => {
  BigString.lengthLimit = 10 // for test
})

test('length', () => {
  const str = 'abcdefg'
  const s = new BigString([str]);
  expect(s.length).toBe(str.length);
})

test('charCodeAt', () => {
  const str = 'Hello'
  const s = new BigString(['Hello']);
  expect(s.charCodeAt(0)).toBe(str.charCodeAt(0));
  expect(s.charCodeAt(s.length - 1)).toBe(str.charCodeAt(str.length - 1));
  expect(s.charCodeAt(s.length + 1)).toBe(str.charCodeAt(str.length +1));
})

test('charAt', () => {
  const str = 'Hello'
  const s = new BigString(['Hello']);
  expect(s.charAt(0)).toBe(str.charAt(0));
  expect(s.charAt(s.length - 1)).toBe(str.charAt(str.length - 1));
  expect(s.charAt(s.length + 1)).toBe(str.charAt(str.length + 1));
})

test('append', () => {
  const str = 'Hello'
  const str2 = ' World'
  const s = new BigString(['Hello']);
  s.append(str2);
  expect(s.charCodeAt(0)).toBe(str.charCodeAt(0));
  expect(s.charCodeAt(10)).toBe((str + str2).charCodeAt(10));
})

test('append BigString', () => {
  const str = 'Hello'
  const str2 = ' World!'
  const str3 = ' My name is...........'
  const str4 = 'BigString!'
  const s = new BigString([str]);
  s.append(str2);
  const s2 = new BigString([str3, str4]);
  s.append(s2)
  expect(s.toString()).toBe(str + str2 + str3 + str4);
})

test('clear', () => {
  const s  =new BigString(['Hello']);
  s.clear();
  expect(s.length).toBe(0);
})

test('slice', () => {
  const s = new BigString();
  const str = 'Hello World! My name is Big String'
  s.append(str.slice(0,10));
  s.append(str.slice(10,20));
  s.append(str.slice(20,30));
  s.append(str.slice(30,40));
  const newBs = s.slice(6, 15);
  const newStr = str.slice(6, 15)
  expect(newBs.charCodeAt(0)).toBe(newStr.charCodeAt(0));
  expect(newBs.charCodeAt(8)).toBe(newStr.charCodeAt(8));
})

test('lastIndexOf', () => {
  const s = new BigString()
  const str = 'Hello World! My name is Big String'
  s.append(str.slice(0,10));
  s.append(str.slice(10,20));
  s.append(str.slice(20,30));
  s.append(str.slice(30,40));
  expect(s.lastIndexOf('S')).toBe(str.lastIndexOf('S'))
  expect(s.lastIndexOf('o', 5)).toBe(str.lastIndexOf('o', 5))
})

test('indexOf', () => {
  const s = new BigString()
  const str = 'Hello World! My name is Big String'
  s.append(str.slice(0,10));
  s.append(str.slice(10,20));
  s.append(str.slice(20,30));
  s.append(str.slice(30,40));
  expect(s.indexOf('S')).toBe(str.indexOf('S'))
  expect(s.indexOf('e', 4)).toBe(str.indexOf('e', 4))
})

test('substring', () => {
  const s = new BigString()
  const str = 'Hello World! My name is Big String'
  s.append(str.slice(0,10));
  s.append(str.slice(10,20));
  s.append(str.slice(20,30));
  s.append(str.slice(30,40));
  const s2 = s.slice(10)
  const str2 = str.slice(10)
  // expect(s.substring(0).indexOf('name')).toBe(str.substring(0).indexOf('name'))
  // expect(s.substring(10, 20).indexOf('name')).toBe(str.substring(10,20).indexOf('name'))
  expect(s.substring(15, 25).toString()).toBe(str.substring(15,25).toString())
})

test('toJson, basic', () => {
  const bs = new BigString()
  const obj = {
    a: 'Hello',
    b: 'World'
  }
  const s = JSON.stringify(obj)
  bs.append(s.slice(0,10))
  bs.append(s.slice(10,20))
  bs.append(s.slice(20,30))
  expect(bs.toJson()).toEqual(obj)
})

test('toJson, number', () => {
  const bs = new BigString()
  const obj = {
    a: 12345,
    b: 54321
  }
  const s = JSON.stringify(obj)
  bs.append(s.slice(0,10))
  bs.append(s.slice(10,20))
  bs.append(s.slice(20,30))
  expect(bs.toJson()).toEqual(obj)
})

test('toJson, nest', () => {
  const bs = new BigString()
  const obj = {
    a: 12345,
    b: {
      c: 'Hello',
    }
  }
  const s = JSON.stringify(obj)
  bs.append(s.slice(0,10))
  bs.append(s.slice(10,20))
  bs.append(s.slice(20,30))
  bs.append(s.slice(30,40))
  expect(bs.toJson()).toEqual(obj)
})

test('toJson, keyword', () => {
  const bs = new BigString()
  const obj = {
    a: true,
    b: null,
    c: false
  }
  const s = JSON.stringify(obj)
  bs.append(s.slice(0,10))
  bs.append(s.slice(10,20))
  bs.append(s.slice(20,30))
  bs.append(s.slice(30,40))
  expect(bs.toJson()).toEqual(obj)
})

test('toJson, mix', () => {
  const bs = new BigString()
  const obj = {
    a: "Hello",
    b: 12345,
    c: false,
    d: {
      e: 'World',
      f: 54321,
      g: true,
      h: {
        i: 'Big String',
        j: null,
      }
    }
  }
  const s = JSON.stringify(obj)
  for(let i =0;i<s.length;i+= BigString.lengthLimit){
    bs.append(s.slice(i,i+ BigString.lengthLimit))
  }
  expect(bs.toJson()).toEqual(obj)
})
