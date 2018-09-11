'use strict';

// Location of data files
const trialsFile = "./data/experiments.csv";

const b4d1 = "./data/b4d1.csv";
const b4d2 = "./data/b4d2.csv";
const b4d3 = "./data/b4d3.csv";
const b8d1 = "./data/b8d1.csv";
const b8d2 = "./data/b8d2.csv";
const b8d3 = "./data/b8d3.csv";


// Global variables
var menu;
var trialsData = [];
var numTrials = 0;
var currentTrial = 1;
var radialMenuTree = null;
var markingMenub4d1 = [];
var markingMenub4d2 = [];
var markingMenub4d3 = [];
var markingMenub8d1 = [];
var markingMenub8d2 = [];
var markingMenub8d3 = [];

var radialMenub4d1 = [];
var radialMenub4d2 = [];
var radialMenub4d3 = [];
var radialMenub8d1 = [];
var radialMenub8d2 = [];
var radialMenub8d3 = [];
var tracker = new ExperimentTracker();
var markingMenuSubscription = null;
var radialMenuSvg = null;

var radialNumSelectsInCurrentTrial = 0;
var markingNumSelectsInCurrentTrial = 0;

// Load CSV files from data and return text
function getData(relativePath) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", relativePath, false);
	xmlHttp.send(null);
	return xmlHttp.responseText;
}


// Loads the CSV data files on page load and store it to global variables
function initExperiment() {

	var url = window.location.href;
	console.log("URL: ", url);

	// Get Trails (Tasks for users)
	var data = getData(trialsFile);

	var records = data.split("\n");
	numTrials = records.length - 1;
	for (var i = 1; i <= numTrials; i++) {
		if (records[i].trim() == "") {
			continue;
		}
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
	var menuDatab4d1 = getData(b4d1);
	var menuDatab4d2 = getData(b4d2);
	var menuDatab4d3 = getData(b4d3);
	var menuDatab8d1 = getData(b8d1);
	var menuDatab8d2 = getData(b8d2);
	var menuDatab8d3 = getData(b8d3);

	// Format CSV Menu to respective Menu structures
	markingMenub4d1 = formatMarkingMenuData(menuDatab4d1);
	markingMenub4d2 = formatMarkingMenuData(menuDatab4d2);
	markingMenub4d3 = formatMarkingMenuData(menuDatab4d3);
	markingMenub8d1 = formatMarkingMenuData(menuDatab8d1);
	markingMenub8d2 = formatMarkingMenuData(menuDatab8d2);
	markingMenub8d3 = formatMarkingMenuData(menuDatab8d3);

	radialMenub4d1 = formatRadialMenuData(menuDatab4d1);
	radialMenub4d2 = formatRadialMenuData(menuDatab4d2);
	radialMenub4d3 = formatRadialMenuData(menuDatab4d3);
	radialMenub8d1 = formatRadialMenuData(menuDatab8d1);
	radialMenub8d2 = formatRadialMenuData(menuDatab8d2);
	radialMenub8d3 = formatRadialMenuData(menuDatab8d3);

	//Start the first trial
	nextTrial();
}

// Wrapper around nextTrial() to prevent click events while loading menus
function loadNextTrial(e) {
	e.preventDefault();
	// if (document.getElementById("targetItem").innerHTML.trim() == document.getElementById("selectedItem").innerHTML.trim()) {
		$("#targetItem").css("background-color", "#444444");
		nextTrial();
	// } else {
	// 	// Show error
	// 	$("#targetItem").css("background-color", "red");
	// 	tracker.attempt++;
	// }
	console.log("TRACKER: ", tracker);
}

// Move to next trial and record events
function nextTrial() {
	// Reset action counter
	radialNumSelectsInCurrentTrial = 0;
	markingNumSelectsInCurrentTrial = 0;
	
	if (currentTrial <= numTrials) {
		if (!trialsData[currentTrial]) {
			currentTrial++;
		}
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

			initializeMarkingMenu();;

			if (menuBreadth == 4) {
				if (menuDepth == 1) {
					menu = MarkingMenu(markingMenub4d1, document.getElementById('marking-menu-container'));
				} else if (menuDepth == 2) {
					menu = MarkingMenu(markingMenub4d2, document.getElementById('marking-menu-container'));
				} else if (menuDepth == 3) {
					menu = MarkingMenu(markingMenub4d3, document.getElementById('marking-menu-container'));
				}
			} else if (menuBreadth == 8) {
				if (menuDepth == 1) {
					menu = MarkingMenu(markingMenub8d1, document.getElementById('marking-menu-container'));
				} else if (menuDepth == 2) {
					menu = MarkingMenu(markingMenub8d2, document.getElementById('marking-menu-container'));
				} else if (menuDepth == 3) {
					menu = MarkingMenu(markingMenub8d3, document.getElementById('marking-menu-container'));
				}
			}
			// if (menuDepth == 1 && menuBreadth == 4) {
			// 	menu = MarkingMenu(markingMenub4d1, document.getElementById('marking-menu-container'));
			// } else if (menuDepth == 2 && menuBreadth == 4) {
			// 	menu = MarkingMenu(markingMenub4d2, document.getElementById('marking-menu-container'));
			// } else if (menuDepth == 3 && menuBreadth == 4) {
			// 	menu = MarkingMenu(markingMenub4d3, document.getElementById('marking-menu-container'));
			// } else if (menuDepth == 1 && menuBreadth == 8) {
			// 	console.log("MARKING B8D1");
			// 	menu = MarkingMenu(markingMenub8d1, document.getElementById('marking-menu-container'));
			// } else if (menuDepth == 2 && menuBreadth == 8) {
			// 	console.log("MARKING B8D2");
			// 	menu = MarkingMenu(markingMenub8d2, document.getElementById('marking-menu-container'));
			// } else if (menuDepth == 3 && menuBreadth == 8) {
			// 	console.log("MARKING B8D3");
			// 	menu = MarkingMenu(markingMenub8d3, document.getElementById('marking-menu-container'));
			// }

			markingMenuSubscription = menu.subscribe(
				(selection) => {
					markingNumSelectsInCurrentTrial++;
					markingMenuOnSelect(selection);
				}
			);

		} else if (menuType === "Radial") {

			initializeRadialMenu();
			if (menuDepth == 1 && menuBreadth == 4) {
				menu = createRadialMenu(radialMenub4d1);
			}
			else if (menuDepth == 2 && menuBreadth == 4) {
				menu = createRadialMenu(radialMenub4d2);
			} else if (menuDepth == 3 && menuBreadth == 4) {
				menu = createRadialMenu(radialMenub4d3);
			} else if (menuDepth == 1 && menuBreadth == 8) {
				menu = createRadialMenu(radialMenub8d1);
			}
			else if (menuDepth == 2 && menuBreadth == 8) {
				menu = createRadialMenu(radialMenub8d2);
			} else if (menuDepth == 3 && menuBreadth == 8) {
				menu = createRadialMenu(radialMenub8d3);
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
	console.log("RECORDS: ", records)
	console.log("NUMRECORDS : ", numRecords);

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
	console.log("MENU ITEMS: ", menuItems);

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
	console.log("HERE: ", menuItemsList);
	console.log("=====================================");
	return menuItemsList;
}

// Function to start tracking timer on mouse down
function markingMenuOnMouseDown() {
	markingNumSelectsInCurrentTrial++;
	tracker.startTimer();
}

//Function to start tracking timer on mouse down
function markingMenuOnSelect(selectedItem) {
	markingNumSelectsInCurrentTrial++;
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
			radialNumSelectsInCurrentTrial = 1;
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
	radialNumSelectsInCurrentTrial++;
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
