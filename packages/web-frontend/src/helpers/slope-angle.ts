/**
 * Angle (in radians) between two slopes.
 *
 * @param {Number} slope1
 * @param {Number} slope2
 * @returns {Number}
 */
const slopeAngle = function (slope1: number, slope2: number): number {
    return Math.atan((slope1 - slope2) / (1 + slope1 * slope2));
};

export default slopeAngle;
