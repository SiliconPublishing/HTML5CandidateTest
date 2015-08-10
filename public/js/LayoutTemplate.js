"use strict";

// Get the app scope or create a local variable
// We don't want to put this on the global scope
var printApp = printApp || {};

// LayoutBookMap Class
// Inherits from XMLObject
var LayoutTemplate = function () {};
LayoutTemplate.prototype = Object.create(XMLObject.prototype);
LayoutTemplate.prototype.constructor = LayoutTemplate;

// Accessibility methods
LayoutTemplate.prototype.getImages = function () {
    return (this.imageAssets) ? this.imageAssets.ImageAsset : null;
};

LayoutTemplate.prototype.getPages = function () {
    return (this.pages) ? this.pages.Page : null;
};

LayoutTemplate.prototype.getPage = function (pageNumber) {
    if (pageNumber) {
        var pages = this.getPages();

        // Make sure the pages variable is not null and is an actual object
        if(pages && typeof pages === 'object') {
            // Check if its an array of pages and iterate through them to find the page
            // otherwise just confirm the objects page number before returning
            if (pages instanceof Array) {
                for (var i = 0, len = pages.length; i < len; i++) {
                    if (pages[i].number == pageNumber) {
                        return pages[i];
                    }
                }
            } else if (pages.number == pageNumber) {
                return pages;
            }
        }
    }

    return null;
};

LayoutTemplate.prototype.getPagePanels = function (pageNumber) {
    var page;

    if (page = this.getPage(pageNumber)) {
        return (page.panels) ? page.panels.Panel : null;
    }

    return null;
};

LayoutTemplate.prototype.getPageItemBlocks = function (pageNumber) {
    var page;

    if(page = this.getPage(pageNumber)) {
        return page.PageItemBlock;
    }

    return null;
};

// Assign LayoutTemplate to our app scope
printApp.LayoutTemplate = LayoutTemplate;