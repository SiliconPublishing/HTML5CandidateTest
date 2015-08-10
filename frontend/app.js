(function() {

    'use strict';
    /**********************************************************************************
     *  okay guys, pretend i used browserify or requirejs and split things up by file
     *  wherever there are these long comment things. i just didn't have time to set the
     *  project up with it.
     **********************************************************************************/

    var layoutServices = (function () {
        var serviceRoot = "http://localhost:3000";

        function getManifest() {
            return $.get(serviceRoot + "/manifest");
        }

        function getLayout(filename) {
            return $.get(serviceRoot + "/layouts/" + filename);
        }

        return {
            getManifest: getManifest,
            getLayout: getLayout
        };
    })();

    /**************** pretend this is Manifest.js *******************************/

    function Manifest(data) {
        this.data = data;
    }

    Manifest.prototype.getFilenames = function () {
        var length = 0;
        var filenames = [];

        if (this.data && this.data.LayoutBookMap && this.data.LayoutBookMap.layoutRefs) {
            length = this.data.LayoutBookMap.layoutRefs.length;
        }

        for (var i = 0; i < length; i++) {
            var length2 = 0;
            if (this.data.LayoutBookMap.layoutRefs[i].LayoutRef) {
                length2 = this.data.LayoutBookMap.layoutRefs[i].LayoutRef.length;
            }

            for (var j = 0; j < length2; j++) {
                var shorthandFnSelector = this.data.LayoutBookMap.layoutRefs[i].LayoutRef[i].$;
                if (shorthandFnSelector && shorthandFnSelector.assetSource != null) {
                    filenames.push(shorthandFnSelector.assetSource);
                }
            }
        }
        return filenames;
    };

    /*************** make believe this is Template.js ********************************/

    function Template(data) {
        this.data = data;
    }

    Template.prototype.getAttrs = function() {
        return this.data.Template.$;
    };

    Template.prototype.getDims = function () {
        var width = this.data.Template.$.width;
        var height = this.data.Template.$.height;
        return {width: width, height: height};
    };

    Template.prototype.getImagesInfo = function () {
        return this.data.Template.imageAssets[0].ImageAsset;
    };

    Template.prototype.getPages = function () {
        return this.data.Template.pages;
    };

    // maybe a little small for it's own pretend file
    function Page(data) {
        this.data = data;
    }

    Page.prototype.getPageItemBlock = function (index) {
        return this.data.Page.PageItemBlock[index];
    };

    function Image(data) {
        this.data = data.$;
        this.filename = this.data.webFilename;
        this.thumbFilename = this.data.thumbnailFilename;
    }

    /***********************************************
    /* template rendering (jquery/dom manip)
    ***********************************************/
    var render = (function() {
        // putting this here, may want to use it in other fxns
        var svgRoot = null;
        // Place the SVG namespace in a variable to easily reference it.
        var xmlns = "http://www.w3.org/2000/svg";

        function drawTemplate(template) {
            $("#template")
                .css({
                    width: "100%",
                    maxWidth: template.getDims().width + "px",
                    height: template.getDims().height + "px",
                    border: "1px solid black",
                    position: "relative"
                });

            $("#template-caption").text(template.getAttrs().projectName);
        }

        function drawImageAssets(imageAssets) {
            imageAssets.forEach(function(item, i) {
                var img = new Image(item);

                var fullImg = "<img src='" + img.filename + "'>";

                $("#image-assets-carousel")
                    .append("<div id='img" + i + "' class='carousel-img' data-toggle='tooltip' data-placement='bottom'>" +
                            "<img src='" + img.thumbFilename + "'></div>")
                    .children("#img" + i)
                    .click(function() {
                        previewImage(img);
                    });
            });
        }

        function previewImage(img) {
            $("#img-preview").attr('src', img.filename).show();
        }

        function clearImagePreview() {
            $("#img-preview-clear").click(function() {
                $("#img-preview").hide();
            });
        }

        function createPath(pageItemBlock) {
            var elem = document.createElementNS(xmlns, "path");

            var xOffset = pageItemBlock.RasterBlock[0].Frame[0].$.xOffset;
            var yOffset = pageItemBlock.RasterBlock[0].Frame[0].$.yOffset;
            var width = pageItemBlock.RasterBlock[0].Frame[0].$.width;
            var height = pageItemBlock.RasterBlock[0].Frame[0].$.height;
            var pathData = pageItemBlock.RasterBlock[0].Frame[0].Mask[0].$.data;
            var fillColor = pageItemBlock.RasterBlock[0].Frame[0].Mask[0].$.fillColor;

            elem.setAttributeNS(null, "x", xOffset);
            elem.setAttributeNS(null, "y", yOffset);
            elem.setAttributeNS(null, "height", height);
            elem.setAttributeNS(null, "width", width);
            elem.setAttributeNS(null, "d", pathData);
            elem.setAttributeNS(null, "fill", fillColor || "#8EC9FF");
            elem.setAttributeNS(null, "stroke", "black");
            elem.setAttributeNS(null, "stroke-width", "1px");

            return elem;
        }

        function drawSvg(page) {
            var pageItemBlocks = page.data.Page[0].PageItemBlock;

            pageItemBlocks.forEach(function(item, i) {
                var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                var svgId = "svg-" + item.$.id;
                svg.setAttributeNS(null, "id", svgId);
                svg.setAttributeNS(null, "width", page.data.Page[0].$.width);
                svg.setAttributeNS(null, "height", page.data.Page[0].$.height);

                $("#svg-container").append("<div class='layer'>" + item.$.layer + "</div>");
                document.getElementById("svg-container").appendChild(svg);

                var path = createPath(item);
                document.getElementById(svgId).appendChild(path);
            });
        }

        return {
            drawTemplate: drawTemplate,
            drawImageAssets: drawImageAssets,
            addImageClearListener: clearImagePreview,
            drawSvg: drawSvg
        };
    })();

    /***********************************************
    /* doc ready and functions used in async fetching
    /* of data to render the view
    ***********************************************/

    $(document).ready(function () {
        render.addImageClearListener();

        layoutServices.getManifest().done(getManifestCb);
    });

    function getManifestCb(data) {
        var manifest = new Manifest(data);

        // it's an array so there might be more than one?
        var fns = manifest.getFilenames();

        fetchLayouts(fns);
    }

    function fetchLayouts(fns) {
        var promises = [];

        fns.forEach(function (item, index) {
            // collect all the promises first
            promises.push(layoutServices.getLayout(item));
        });

        // wait till they're all done then do something with them
        $.when(promises).always(function (resolved) {
            $.each(resolved, function (key, value) {
                processTemplate(value);
            });
        });
    }

    function processTemplate(promise) {
        promise.then(promiseSuccess, promiseFailure);

        function promiseFailure(jqxhr, textStatus, errorThrown) {
            // i don't really have anything great to do with the error rt now
            // so just pretend i did something really good here
            console.log(errorThrown);
        }

        function promiseSuccess(data, textStatus, jqxhr) {
            // successes
            var template = new Template(data);

            var pageDims = template.getDims();
            var val = template.getPages();
            var imagesInfo = template.getImagesInfo();

            render.drawTemplate(template);
            render.drawImageAssets(imagesInfo);

            for (var i = 0; i < val.length; i++) {
                render.drawSvg(new Page(val[i]));
            }
        }
    }
})();
