//? linear interpolation
//? Returns: a value between A and B, depending on t (A and B inclusive)
//* https://en.wikipedia.org/wiki/Linear_interpolation
function lerp(A, B, t) {
  // When t = 0, return A
  // when t = 1, return B (A's cancel)
  return A + (B - A) * t;
}

//? Find the intersection between 2 segments, given four points
//? Returns: an object containing the x and y coordinates of the intersect, along with the offset, which is the distance from the car to the intersect
//* https://www.youtube.com/watch?v=fHOLQJo0FjQ
/*
  The system of equations below are simply the linear interpolation equation above
  Ix = Ax+(Bx-Ax)t = Cx(Dx-Cx)u   (intersection x coord)
  Iy = Ay+(By-Ay)t = Cy(Dy-Cy)u   (intersection y coord)

  Rearranging and factoring to solve for t we get:

          (Dx-Cx)(Ay-Cy) - (Dy-Cy)(Ax-Cx)        tTop
      t = -------------------------------   =  --------
          (Dy-Cy)(Bx-Ax) - (Dx-Cx)(By-Ay)       bottom
*/
function getIntersection(A, B, C, D) {
  // numerator for t
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  // numerator for u
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  // denominator
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  if (bottom != 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
        offset: t,
      };
    }
  }

  return null;
}

//? Find the intersection between 2 polygons and detect if the have come into contact with each other
function polysIntersect(poly1, poly2) {
  for (let i = 0; i < poly1.length; i++) {
    for (let j = 0; j < poly2.length; j++) {
      const touch = getIntersection(
        poly1[i],
        poly1[(i + 1) % poly1.length],
        poly2[j],
        poly2[(j + 1) % poly2.length]
      );
      if (touch) {
        return true;
      }
    }
  }
  return false;
}
