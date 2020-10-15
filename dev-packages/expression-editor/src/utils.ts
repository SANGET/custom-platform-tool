/**
 * 比较两个 类型 值是否相等
 * @export
 * @param {*} x
 * @param {*} y
 * @returns boolean
 */
export function equals(x: any, y: any) {
  var f1 = x instanceof Object
  var f2 = y instanceof Object
  if (!f1 || !f2) {
      return x === y
  }
  if (Object.keys(x).length !== Object.keys(y).length) {
      return false
  }
  var newX = Object.keys(x)
  for (var p in newX) {
      p = newX[p];
      var a = x[p] instanceof Object;
      var b = y[p] instanceof Object;
      if (a && b) {
          equals(x[p], y[p])
      } else if (x[p] !== y[p]) {
          return false;
      }
  }
  return true
}
