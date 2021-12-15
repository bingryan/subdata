const Chance = require("chance");

const chance = new Chance(Math.random);

/**
 * return custom type from definition
 *
 * @param definition {Object} custom data type object
 * @param type {string} the type of config choice
 */
function customType(definition, type) {
    return definition[type][Math.floor(Math.random() * definition[type].length)];
}

/**
 * valid custom type
 *
 * @param definition {Object} custom data type object
 * @param type {string} the type of config choice
 */
function isCustomType(definition, type) {
    return definition[type]
}

/**
 * set value
 *
 * @param definition {Object} custom data type object
 * @param type {string} the type of config choice
 */
function setValue(definition, type) {
    if (isCustomType(definition, type)) {
        return customType(definition, type)
    }
    if (typeof type === "object" && !Array.isArray(type) && type != null) {
        return fakeData(type);
    }
    try {
        return chance[type]();
    } catch (exception) {
        return null;
    }
}

/**
 * create fake data
 *
 * @param datatype {Object} custom data type object
 * @param params {Object} the type of config define
 */
function fakeData(datatype, params) {
    const res = {};
    Object.keys(params).map(function (key, index) {
        res[key] = setValue(datatype, params[key]);
    });
    return res;
}

module.exports = fakeData;
