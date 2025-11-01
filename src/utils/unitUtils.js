export function cToF(c) {
return (c * 9) / 5 + 32;
}


export function fToC(f) {
return ((f - 32) * 5) / 9;
}


export function round(val, decimals = 0) {
const mult = 10 ** decimals;
return Math.round(val * mult) / mult;
}


export function formatTemp(val, units = 'metric') {
if (val == null) return '-';
return `${Math.round(units === 'metric' ? val : cToF(val))}°${units === 'metric' ? 'C' : 'F'}`;
}


export function formatWindUnit(units = 'metric') {
return units === 'metric' ? 'm/s' : 'mph';
}


export function windDirToCompass(deg) {
if (deg == null) return '';
const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
const idx = Math.round((deg % 360) / 22.5) % 16;
return dirs[idx];
}