'use strict';

// Location of data files
const trialsFile = "./data/experiments.csv";
const menuL1File = "./data/menu_depth_1.csv";
const menuL2File = "./data/menu_depth_2.csv";
const menuL3File = "./data/menu_depth_3.csv";

const b4d1 = "./data/b4d1.csv";
const b4d2 = "./data/b4d2.csv";
const b4d3 = "./data/b4d3.csv";
const b6d1 = "./data/b6d1.csv";
const b6d2 = "./data/b6d2.csv";
const b6d3 = "./data/b6d3.csv";


// Global variables
var menu;
var trialsData = [];
var numTrials = 0;
var currentTrial = 1;
var radialMenuTree = null;
var b4d1Menu = [];
var b4d2Menu = [];
var b4d3Menu = [];
var b6d1Menu = [];
var b6d1Menu = [];
var b6d1Menu = [];
var tracker = new ExperimentTracker();
var markingMenuSubscription = null;
var radialMenuSvg = null;

// Load CSV files from data and return text
function getData(relativePath) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", relativePath, false);
	xmlHttp.send(null);
	return xmlHttp.responseText;
}


// Loads the CSV data files on page load and store it to global variables
function initExperiment() {

	// Get Trails (Tasks for users)
	var data = getData(trialsFile);

	var records = data.split("\n");
	numTrials = records.length - 1;
	for (var i = 1; i <= numTrials; i++) {
		var cells = records[i].split(",");
		var menuType = cells[0].trim();
		var menuDepth = cells[1].trim();
		var targetItem = cells[2].trim();
		var menuBreadth = cells[3].trim();
		var isUsingMouse = cells[4].trim();
		trialsData[i] = {
			'Menu Type': menuType,
			'Menu Depth': menuDepth,
			'Target Item': targetItem,
			'Menu Breadth': menuBreadth,
			'Control Device': isUsingMouse === "true" ? "Mouse" : "Trackpad"
		};
	}

	// Get Menus
	var menuData1 = getData(b4d1);
	var menuData2 = getData(b4d2);
	var menuData3 = getData(b4d3);
	var menuData4 = getData(b6d1);
	var menuData5 = getData(b6d2);
	var menuData6 = getData(b6d3);

	// Format CSV Menu to respective Menu structures
	markingMenub4d1 = formatMarkingMenuData(menuData1);
	markingMenub4d2 = formatMarkingMenuData(menuData2);
	markingMenub4d3 = formatMarkingMenuData(menuData3);
	markingMenub6d1 = formatMarkingMenuData(menuData4);
	markingMenub6d2 = formatMarkingMenuData(menuData5);
	markingMenub6d3 = formatMarkingMenuData(menuData6);

	radialMenub4d1 = formatRadialMenuData(menuData1);
	radialMenub4d2 = formatRadialMenuData(menuData2);
	radialMenub4d3 = formatRadialMenuData(menuData3);
	radialMenub6d1 = formatRadialMenuData(menuData4);
	radialMenub6d2 = formatRadialMenuData(menuData5);
	radialMenub6d3 = formatRadialMenuData(menuData6);

	//Start the first trial
	nextTrial();
}

// Wrapper around nextTrial() to prevent click events while loading menus
function loadNextTrial(e) {
	e.preventDefault();
	nextTrial();

}

// Move to next trai and record events
function nextTrial() {
	if (currentTrial <= numTrials) {

		var menuType = trialsData[currentTrial]['Menu Type'];
		var menuDepth = trialsData[currentTrial]['Menu Depth'];
		var targetItem = trialsData[currentTrial]['Target Item'];
		var menuBreadth = trialsData[currentTrial]['Menu Breadth'];
		var isUsingMouse = trialsData[currentTrial]['Control Device'];

		document.getElementById("trialNumber").innerHTML = String(currentTrial) + "/" + String(numTrials);
		document.getElementById("menuType").innerHTML = menuType;
		document.getElementById("menuDepth").innerHTML = menuDepth;
		document.getElementById("targetItem").innerHTML = targetItem;
		document.getElementById("selectedItem").innerHTML = "&nbsp;";
		// Set IV3 state over here
		document.getElementById("controlDevice").innerHTML = isUsingMouse;
		document.getElementById("menuBreadth").innerHTML = menuBreadth;

		tracker.newTrial();
		tracker.trial = currentTrial;
		tracker.menuType = menuType;
		tracker.menuDepth = menuDepth;
		tracker.targetItem = targetItem;
		tracker.isUsingMouse = isUsingMouse;
		tracker.menuBreadth = menuBreadth;

		if (menuType === "Marking") {

			initializeMarkingMenu();

			if (menuDepth == 1 && menuBreadth == 4) {
				menu = MarkingMenu(markingMenub4d1, document.getElementById('marking-menu-container'));
			}
			else if (menuDepth == 2 && menuBreadth == 4) {
				menu = MarkingMenu(markingMenub4d2, document.getElementById('marking-menu-container'));
			} else if (menuDepth == 3 && menuBreadth == 4) {
				menu = MarkingMenu(markingMenub4d3, document.getElementById('marking-menu-container'));
			} else if (menuDepth == 1 && menuBreadth == 6) {
				menu = MarkingMenu(markingMenub6d1, document.getElementById('marking-menu-container'));
			} else if (menuDepth == 2 && menuBreadth == 6) {
				menu = MarkingMenu(markingMenub6d2, document.getElementById('marking-menu-container'));
			} else if (menuDepth == 3 && menuBreadth == 6) {
				menu = MarkingMenu(markingMenub6d3, document.getElementById('marking-menu-container'));
			}

			markingMenuSubscription = menu.subscribe((selection) => markingMenuOnSelect(selection));

		} else if (menuType === "Radial") {

			initializeRadialMenu();
			if (menuDepth == 1 && menuBreadth == 4) {
				menu = createRadialMenu(radialMenub4d1);
			}
			else if (menuDepth == 2 && menuBreadth == 4) {
				menu = createRadialMenu(radialMenub4d2);
			} else if (menuDepth == 3 && menuBreadth == 4) {
				menu = createRadialMenu(radialMenub4d3);
			} else if (menuDepth == 1 && menuBreadth == 6) {
				menu = createRadialMenu(radialMenub6d1);
			}
			else if (menuDepth == 2 && menuBreadth == 6) {
				menu = createRadialMenu(radialMenub6d2);
			} else if (menuDepth == 3 && menuBreadth == 6) {
				menu = createRadialMenu(radialMenub6d3);
			}


		}

		currentTrial++;
	} else {
		// Download CSV Results
		var nextButton = document.getElementById("nextButton");
		nextButton.innerHTML = "Done";
		tracker.toCsv();
	}
}





/*Functions related to MarkingMenu*/

// Reconstructs marking menu container
function initializeMarkingMenu() {

	//Unload Radial Menu
	var radialMenuContainer = document.getElementById('radial-menu-container');
	if (radialMenuContainer != null) {
		radialMenuContainer.parentNode.removeChild(radialMenuContainer);
	}

	// Load Marking Menu
	var interactionContainer = document.getElementById('interaction-container');
	if (markingMenuSubscription != null) {
		markingMenuSubscription.unsubscribe();
	}
	var markingMenuContainer = document.getElementById('marking-menu-container');
	if (markingMenuContainer == null) {
		interactionContainer.innerHTML += "<div id=\"marking-menu-container\" style=\"height:100%;width:100%\" onmousedown=\"markingMenuOnMouseDown()\" oncontextmenu=\"preventRightClick(event)\"></div>";
	}
}

//Formats csv menu data in the structure accepted by radial menu
// Assumes menu csv is sorted by Id and Parent both Ascending
function formatMarkingMenuData(data) {
	var records = data.split("\n");
	var numRecords = records.length;
	var menuItems = {}

	// Parse through the records and create individual menu items
	for (var i = 1; i < numRecords; i++) {
		var items = records[i].split(',');
		var id = items[0].trim();
		var label = items[2].trim();
		menuItems[id] = {
			'name': label,
			'children': []
		};
	}

	for (var i = numRecords - 1; i >= 1; i--) {
		var items = records[i].split(',');
		var id = items[0].trim();
		var parent = items[1].trim();
		if (parent === '0') {
			continue;
		} else {
			var children = menuItems[parent]['children'];
			children.push(menuItems[id]);
			delete menuItems[id]
			menuItems[parent]['children'] = children;
		}
	}

	var menuItemsList = [];
	for (var key in menuItems) {
		menuItemsList.push(menuItems[key]);
	}

	return menuItemsList;
}

// Function to start tracking timer on mouse down
function markingMenuOnMouseDown() {

	tracker.startTimer();
}

//Function to start tracking timer on mouse down
function markingMenuOnSelect(selectedItem) {

	tracker.recordSelectedItem(selectedItem.name);
	document.getElementById("selectedItem").innerHTML = selectedItem.name;
}

function preventRightClick(e) {
	e.preventDefault();
}


/*Functions related to RadialMenu*/

// Reconstructs radial menu container
function initializeRadialMenu() {

	// Unload Marking Menu
	if (markingMenuSubscription != null) {
		markingMenuSubscription.unsubscribe();
	}
	var markingMenuContainer = document.getElementById('marking-menu-container');
	if (markingMenuContainer != null) {
		markingMenuContainer.parentNode.removeChild(markingMenuContainer);
	}



	// Reload Radial Menu
	var interactionContainer = document.getElementById('interaction-container');
	var radialMenuContainer = document.getElementById('radial-menu-container');
	if (radialMenuContainer == null) {
		interactionContainer.innerHTML += "<div id=\"radial-menu-container\" style=\"height:100%;width:100%\" oncontextmenu=\"toggleRadialMenu(event)\"></div>";
	}

}

// Create radial menu svg element
function createRadialMenu(radialMenuL) {

	var radialmenuElement = document.getElementById('radialmenu');
	if (radialmenuElement != null) {
		radialmenuElement.parentNode.removeChild(radialmenuElement);
	}


	var w = window.innerWidth;
	var h = window.innerHeight;
	var radialMenuSvgElement = document.getElementById('radial-menu-svg');
	if (radialMenuSvgElement != null) {
		radialMenuSvgElement.parentNode.removeChild(radialMenuSvgElement);
	}
	radialMenuSvg = d3.select("#radial-menu-container").append("svg").attr("width", w).attr("height", h).attr("id", "radial-menu-svg");
	radialMenuTree = radialMenuL;
	return radialMenuSvg;
}

// Toggle radial menu on right click
function toggleRadialMenu(e) {

	if (tracker.startTime == null) {

		if (radialMenuTree != null) {
			menu = module.exports(radialMenuTree, {
				x: e.clientX,
				y: e.clientY
			}, radialMenuSvg);

			// Start timing once menu appears
			tracker.startTimer();
		}
	} else {

		// Record previous item
		tracker.recordSelectedItem(null);

		if (radialMenuTree != null) {
			menu = module.exports(radialMenuTree, {
				x: e.clientX,
				y: e.clientY
			}, radialMenuSvg);

			// Start timing once menu appears
			tracker.startTimer();
		}
	}
	e.preventDefault();
}

//Callback for radialmenu when a leaf node is selected
function radialMenuOnSelect() {

	tracker.recordSelectedItem(this.id);
	var radialmenu = document.getElementById('radialmenu');
	radialmenu.parentNode.removeChild(radialmenu);

	document.getElementById("selectedItem").innerHTML = this.id;
}

//Formats csv menu data in the structure accepted by radial menu
// Assumes menu csv is sorted by Id and Parent both Ascending
function formatRadialMenuData(data) {

	var records = data.split("\n");
	var numRecords = records.length;
	var menuItems = {}



	// Parse through the records and create individual menu items
	for (var i = 1; i < numRecords; i++) {
		var items = records[i].split(',');
		var id = items[0].trim();
		var label = items[2].trim();
		menuItems[id] = {
			'id': label,
			'fill': "#39d",
			'name': label,
			'_children': []
		};
	}

	for (var i = numRecords - 1; i >= 1; i--) {
		var items = records[i].split(',');
		var id = items[0].trim();
		var parent = items[1].trim();
		if (parent === '0') {
			continue;
		} else {
			var _children = menuItems[parent]['_children'];
			if (menuItems[id]['_children'].length == 0) {
				menuItems[id]['callback'] = radialMenuOnSelect;
			}
			_children.push(menuItems[id]);
			delete menuItems[id];
			menuItems[parent]['_children'] = _children;
		}
	}


	var menuItemsList = [];
	for (var key in menuItems) {
		if (menuItems[key]['_children'].length == 0) {
			delete menuItems[key]['_children'];
			menuItems[key]['callback'] = radialMenuOnSelect;
		} else {
			delete menuItems[key]['callback'];
		}
		menuItemsList.push(menuItems[key]);
	}

	return {
		'_children': menuItemsList
	};

}
