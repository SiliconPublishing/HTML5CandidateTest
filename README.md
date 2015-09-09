# Instructions
1. Clone or download the repo
2. From the root directory of the repo, run: `npm install`
3. From the root directory of the repo, run: `bower install`
3. To launch the server, from the src/backend directory of the repo, run: `node index.js`
4. Open a browser and go to `http://localhost:8080`

#Remarks

### Test (jasmine)
There are some jasmine tests (end to end) to check the manifest and layout loading from the services that you can run using $ ./node_modules/.bin/jasmine-node --verbose ./spec/ You don't need to start the server, the tests will start and stop on port 8081

###Manifest
I use the manifest.xml just to get the assetSource data and load the layout, so manifest is used but not rendered. 

###Server
Instead of using Express I used Percolator, a library more oriented to manage restful services (anyway for this simple example make not much difference :)

###User Interface
I use AngularJS to build the interface. Just a view and controller though, but clean and easy. In service folder you can find all of the API calls in services.js, called from HomeController. I used the Angular Tree, a directive base on a recursive call to traverse complex Json objects and build a tree view

###RESTful API
For an easy follow, services are placed in two files: 

-**Backend:** src/backend/server.js, where all the calls are listed (Percolator will help when use become more complex)
-**FrontEnd:** src/frontend/service/services.js, where all client side calls are listed

###Adapt to different data
In order to test the mechanism, I include a manifest pointing to multiple layout instead of just one. You can find it on src/backend/multiple.zip. Just unzip to backend folder (warning: manifest will be overwrited, rename to keep) This manifest has many layouts that can be loaded and show



# HTML5CandidateTest
Test for potential HTML5 developers

# Instructions
Create a RESTful API in nodeJS to deliver manifest.XML and layout_1.xml. Request signatures can be anything you like. Please use GET or POST requests.
Create a client application which uses the API. In the client application, use the response which delivers the manifest.XML document to load layout_1.xml
Provide some kind of visualization of the page items found in layout_1.xml. This could be as simple as a textual list, or as complex as creating DOM elements to display the data.
The application should be data driven.
The application should demonstrate your knowledge of OOP including the creation of objects, object extension, and separation of concerns using good encapsulation.
DRY code is appreciated.
Anonymous function are frowned upon.

# Rules
You can use any resource you like, take as much time as you like (within reason), and incorporate any third party libraries or frameworks you like. We do appreciate native JavaScript more than the use of third party libraries to some extent.