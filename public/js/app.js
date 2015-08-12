"use strict";

// Create our namespace
var printApp = printApp || {};

var layoutBookMap;
var layoutTemplate;

// On page load, make an AJAX call to API to retrieve manifest
$(function () {
    // Initialize the application objects
    layoutBookMap = new printApp.LayoutBookMap();
    layoutTemplate = new printApp.LayoutTemplate();

    // AJAX call to retreive manifest
    $.get('/api/xml/manifest')
        .done(function (data) {
            // Build the layoutBookMap object from the xml data
            layoutBookMap.build(data);

            // Get the layouts from the manifest and make AJAX calls to the API
            // to retreive the layout data
            var layouts = layoutBookMap.getLayouts();
            if (layouts instanceof Array) {
                // TODO: Process multiple layouts
            } else {
                // Remove file extension from the assetSource for our AJAX call
                var layoutFile = layouts.assetSource.replace(/\.[^/.]+$/, '');

                // AJAX call to retrieve layout data
                $.get('/api/xml/' + layoutFile)
                    .done(function (data) {
                        // Build the layoutTemplate object from the xml data
                        layoutTemplate.build(data);

                        // Set the title of our project on the page
                        setTitle(layoutTemplate.projectName);

                        // Get the first page and output it to page
                        // TODO: Remove hardcoded page number and process multiple pages
                        drawPage(layoutTemplate.getPage(1));
                    })
                    .fail(function (jqXHR) {
                        // Check the response for status code and display appropriate error
                        if(jqXHR.status === 404) {
                            addErrorToPage('Couldn\'t find the layout file.');
                        } else {
                            addErrorToPage('Unknown error while loading the layout file.');
                        }
                    });
            }
        })
        .fail(function (jqXHR) {
            // Check the response for status code and display appropriate error
            if(jqXHR.status === 404) {
                addErrorToPage('Couldn\'t find the manifest file.');
            } else {
                addErrorToPage('Unknown error while loading the manifest file.');
            }
        });
});

function setTitle(title) {
    $('#title').text(title);
}

// Draw the page output with jQuery
// TODO: Use a templating engine
function drawPage(page) {
    // Store the selectors so it doesn't have to keep finding them in the loops
    var $imageAssets = $('#imageAssets');
    var $itemBlocks = $('#itemBlocks');

    // Get our assets
    var imageAssets = layoutTemplate.getImages();
    var itemBlocks = layoutTemplate.getPageItemBlocks(page.number);

    // Output Image Assets
    $imageAssets.append(
        $('<h2>').text('Image Assets')
    );
    for (var i = 0, len = imageAssets.length; i < len; i++) {
        $imageAssets.append(
            $('<a>').attr('href', imageAssets[i].webFilename).append(
                $('<img>').attr('src', imageAssets[i].thumbnailFilename).addClass('img-thumbnail')
            )
        );
    }

    // Output Item Blocks
    $itemBlocks.append(
        $('<h2>').text('Item Blocks')
    );
    for (var i = 0, len = itemBlocks.length; i < len; i++) {
        $itemBlocks.append(
            $('<div>').addClass('col-xs-12').html(
                $('<legend>').text(itemBlocks[i].designerLabel)
            )
        );

        // Iterate through the keys and output all the strings
        // If we want to output objects then we need to make a recursive function to do that
        for (var key in itemBlocks[i]) {
            if (itemBlocks[i].hasOwnProperty(key) && typeof itemBlocks[i][key] === 'string') {
                $itemBlocks.append(
                    $('<div>').addClass('col-xs-2').text(key),
                    $('<div>').addClass('col-xs-10').html(
                        $('<label>').text(itemBlocks[i][key])
                    )
                );
            }
        }
    }
}

function addErrorToPage(message) {
    $('#errorMessage').addClass('alert alert-danger').text(message);
}