
const MAP_MAX_KEY = 2 ** 24
export class BigMap<T> {
  private mapArray: Map<number, any>[] = []
  set(key: number, value: T) {
    const mainIndex = Math.floor(key / MAP_MAX_KEY)
    const offset = key % MAP_MAX_KEY
    this.mapArray[mainIndex] = this.mapArray[mainIndex] || new Map()
    this.mapArray[mainIndex].set(offset, value)
  }
  get(key: number) {
    const mainIndex = Math.floor(key / MAP_MAX_KEY)
    const offset = key % MAP_MAX_KEY
    return this.mapArray[mainIndex]?.get(offset) as T | undefined
  }
}
