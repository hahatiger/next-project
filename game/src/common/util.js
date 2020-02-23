export function getBoundry(b) {
  var a, c;
  b.forEach(function (d) {
    if (!a && !c) {
      a = d.x;
      c = d.x
    } else {
      if (d.x < a) {
        a = d.x
      }
      if (d.x > c) {
        c = d.x
      }
    }
  });
  return {
    minX: a,
    maxX: c
  }
}
