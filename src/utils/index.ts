export function cloneArray(array: any[]) {
  return array.map((item) => ({ ...item }));
}
