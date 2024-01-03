export const  compareObjectAsJson = (item1: any, item2: any): boolean => {
  return JSON.stringify(item1) === JSON.stringify(item2)
}
