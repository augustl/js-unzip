(function () {
    var hookEvent = function (element, event, callback) {
        element.addEventListener(event, function (e) {
            if (!callback()) {
                e.stopPropagation();
                e.preventDefault();
            }
        }, true);
    }

    var log = function (msg) {
        document.getElementById("log")
            .appendChild(document.createTextNode(msg + "\n"));
    }

    var getXhrObject = function () {
        try {
            var options = [
                function () { return new XMLHttpRequest() },
                function () { return new ActiveXObject("Microsoft.XMLHTTP") },
                function () { return new ActiveXObject("Msxml2.XMLHTTP.6.0") }
            ];

            for (var i = 0, il = options.length; i < il; i++) {
                try { return options[i]() } catch(e) {}
            }
        } catch(e) {
            log("Could not get XHR object.");
        }
    }

    var processZipFile = function (zip) {
        var zip = new JSUnzip(zip);
        log("Is Zip file: " + zip.isZipFile());

        log("Reading Zip file..");
        try {
            zip.readEntries();
        } catch(e) {
            log("Error when reading Zip file: " + (typeof(e) === "object" ? e.message : e));
        }
    }

    hookEvent(window, "load", function () {
        hookEvent(document.getElementById("run"), "click", function () {
            var xhr = getXhrObject();
            xhr.open("GET", "test.zip", true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.responseText === "") {
                        log("Could not get zip file. Create a test.zip and try again.");
                    } else {
                        processZipFile(xhr.responseText);
                    }
                }
            }
            xhr.send(null);
            return false;
        });
    });
}());