const reverseObject = (data) => {
    return Object.entries(data).reduce((res, [key, values]) => {
        values.forEach((value) => {
            res[value.toLowerCase()] = key;
        });
        return res;
    }, {});
};

module.exports = {
    reverseObject,
};
