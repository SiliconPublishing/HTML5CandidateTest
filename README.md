# How to run the completed test
I setup an express backend to serve up the files. It's in the /backend folder.
Run that (app.js) with either nodemon or node or forever.

I used a yeoman generator that had a grunt build system with it, so you can run the app by going to the
/frontend folder and typing grunt serve (grunt build is an available task but i never tested that).

Hopefully that's enough to get the two connected and working together.

I included the node_modules and bower_components folders just in case. You should probably run bower install and npm
install I think (couldn't hurt).

I wasn't familiar with the schema of layout_1.xml so I just kinda winged it and connected some things here and there.
It uses jquery mostly for the DOM manipulation (but I use some straight js for the svg stuff). Other then that it's plain
javascript using a few different patterns (revealing module pattern, constructor pattern, IIFE's, also using promises in
 one spot). I could have split things up by file using browserify or requirejs but I didn't have enough time.

# HTML5CandidateTest
Test for potential HTML5 developers

# Instructions
Create a RESTful API in nodeJS to deliver manifest.XML and layout_1.xml. Request signatures can be anything you like.
Please use GET or POST requests. Create a client application which uses the API. In the client application, use the
response which delivers the manifest.XML document to load layout_1.xml

Provide some kind of visualization of the page items found in layout_1.xml. This could be as simple as a textual list,
or as complex as creating DOM elements to display the data.

The application should be data driven.

The application should demonstrate your knowledge of OOP including the creation of objects, object extension, and
separation of concerns using good encapsulation.

DRY code is appreciated.

Anonymous functions are frowned upon.

# Rules
You can use any resource you like, take as much time as you like (within reason), and incorporate any third party
libraries or frameworks you like. We do appreciate native JavaScript more than the use of third party libraries to some
extent.