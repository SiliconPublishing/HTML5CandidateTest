"use strict";

// XMLObject Class
var XMLObject = function XMLObject(xml) {
    // If there is data supplied, process it
    if (xml) {
        this.build(xml);
    }
};

XMLObject.prototype.build = function (xml) {
    // Get the document element to parse all the child nodes
    if (xml.documentElement) {
        var docEl = xml.documentElement;

        // Get the node list and assign it to the object
        var nodes = this.createNodeList(docEl);
        for (var node in nodes) {
            this[node] = nodes[node];
        }
    }
};

// This function creates an object from XML data
// that has all its attributes and child Element nodes assigned
// and then returns it
XMLObject.prototype.createNodeList = function (node) {
    var list = {};

    // If there are attributes, assign them to our list object
    if (node.attributes) {
        for (var i = 0, len = node.attributes.length; i < len; i++) {
            list[node.attributes[i].name] = node.attributes[i].value;
        }
    }

    // Get the nodeName and assign it to our list object
    // This is useful for the root node as it will not be named
    if (node.nodeName) {
        list.nodeName = node.nodeName;
    }

    // If there are child Elements, iterate through them and assign to our list object
    if (node.childElementCount > 0) {
        for (var n = node.firstElementChild; n; n = n.nextElementSibling) {
            var index = n.nodeName;

            // If there are multiple occurrences of the nodeName
            // then create an array for that specific nodeName
            // otherwise store it as an object
            if (list[index]) {
                if (list[index] instanceof Array) {
                    // Already an array, just append it
                    list[index][list[index].length] = this.createNodeList(n);
                } else {
                    // Create the array
                    list[index] = [list[index], this.createNodeList(n)];
                }
            } else {
                // Store it as an object
                list[index] = this.createNodeList(n);
            }
        }
    }

    return list;
};