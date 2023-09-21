const reverseObject = (data) => {
    return Object.entries(data).reduce((res, [key, values]) => {
        values.filter(Boolean).forEach((value) => {
            res[value.toLowerCase()] = key;
        });
        return res;
    }, {});
};

const getAliases = (measure, excludedUnits) => Object.keys(measure).reduce((prev, curr) => {
        if (!(excludedUnits && excludedUnits.includes(curr))) {
            if (measure[curr].aliases) {
                prev = prev.concat(measure[curr].aliases);
            }
            prev.push(curr);
        }

        return prev;
    }, []).filter((item, index, arr) => arr.indexOf(item) === index);

module.exports = {
    reverseObject,
    getAliases
};
