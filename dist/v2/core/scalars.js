// Convert string YYYY-MM-DD to Date
export var NewDateFromYYYYMMDD = function (str) {
    var _a = str.split('-').map(Number), year = _a[0], month = _a[1], day = _a[2];
    return new Date(year, month - 1, day);
};
