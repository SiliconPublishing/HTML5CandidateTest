// oohlala the revealing module pattern
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

function Manifest(data) {
    this.data = data;
}

Manifest.prototype.getFilenames = function() {
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

function Layout(data) {
    this.data = data;
}

$(document).ready(function() {
    layoutServices.getManifest().done(getManifestCb);
});

function getManifestCb(data) {
    var manifest = new Manifest(data);

    // it's an array so there might be more than one?
    var fns = manifest.getFilenames();

    fetchLayouts(fns).done(function(layouts) {
        console.log(layouts);
    });
}

function fetchLayouts(fns) {
    var deferred = $.Deferred();
    var promises = [];
    var layouts = [];

    fns.forEach(function (item, index) {
        // collect all the promises first
        promises.push(layoutServices.getLayout(item));
    });

    // wait till they're all done then do something with them
    // FIXME need to return all the promises or an array of layout objects
    $.when(promises).then(function(resolved) {
        resolved.forEach(function(item, i) {
            item.done(function(data) {

                layouts.push(new Layout(data));
                console.log(layouts);
            });
        });

        console.log(layouts);
        deferred.resolve(layouts);
    });

    return deferred.promise();
}
