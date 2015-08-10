"use strict";

// Get the app scope or create a local variable
// We don't want to put this on the global scope
var printApp = printApp || {};

// LayoutBookMap Class
// Inherits from XMLObject
var LayoutBookMap = function () {};
LayoutBookMap.prototype = Object.create(XMLObject.prototype);
LayoutBookMap.prototype.constructor = LayoutBookMap;

// Accessibility methods
LayoutBookMap.prototype.getLayouts = function () {
    return (this.layoutRefs) ? this.layoutRefs.LayoutRef : null;
};

// Assign LayoutBookMap to our app scope
printApp.LayoutBookMap = LayoutBookMap;