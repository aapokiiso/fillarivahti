const { gaussianSmoothen } = require('./gaussianSmoothen')

test('too little data', () => {
  const data = [1, 2, 3]

  expect(gaussianSmoothen(data, 2).map(Math.round)).toEqual(data)
})

test('simple Gaussian smoothen', () => {
  const data = [266, 145, 183, 119, 180, 168, 231, 224, 192, 122, 336, 185, 194, 149, 210, 273, 191, 287, 226, 303, 289, 421, 264, 342, 339, 440, 315, 439, 401, 437, 575, 407, 682, 475, 581, 646]
  const expected = [266, 145, 175, 172, 177, 185, 194, 200, 204, 207, 209, 207, 205, 207, 214, 225, 239, 254, 271, 289, 307, 322, 334, 345, 358, 373, 390, 410, 434, 461, 489, 516, 538, 556, 581, 646]

  expect(gaussianSmoothen(data, 2).map(Math.round)).toEqual(expected)
})
