const reverseObject = (data) => {
    return Object.entries(data).reduce((res, [key, values]) => {
        values.forEach((value) => {
            res[value.toLowerCase()] = key;
        });
        return res;
    }, {});
};

const getAliases = (measure, excludedUnits) => Object.keys(measure).reduce((prev, curr) => { 
    prev = excludedUnits && excludedUnits.includes(curr) ? prev : prev.concat(measure[curr].aliases);
    return prev;
}, []);

module.exports = {
    reverseObject,
    getAliases
};
