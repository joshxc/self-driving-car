// linear interpolation - returns a value between A and B, depending on t (A and B inclusive)
//* https://en.wikipedia.org/wiki/Linear_interpolation
function lerp(A, B, t) {
  // When t = 0, return A
  // when t = 1, return B (A's cancel)
  return A + (B - A) * t;
}
