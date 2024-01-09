"use strict";
/**
 * Polyfill functions.
 *
 * @since 0.9.5beta
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.entries = exports.forEach = void 0;
// NodeList.prototype.forEach
var forEach = function (callback, thisArg) {
    thisArg = thisArg || window;
    for (var i = 0; i < this.length; i++) {
        callback.call(thisArg, this[i], i, this);
    }
};
exports.forEach = forEach;
// Object.entries
var entries = function (obj) {
    var ownProps = Object.keys(obj);
    var i = ownProps.length, resArray = new Array(i); // preallocate the Array
    while (i--) {
        resArray[i] = [ownProps[i], obj[ownProps[i]]];
    }
    return resArray;
};
exports.entries = entries;
