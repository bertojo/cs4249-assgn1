// Class used to track experiment
class ExperimentTracker {


	constructor() {
		this.trials = [];
		this.attempt = 0;
		this.trial = null;
		this.menuType = null;
		this.menuDepth = null;
		this.menuBreadth = null;
		this.isUsingMouse = true;
		this.targetItem = null;
		this.selectedItem = null;
		this.startTime = null;
		this.endTime = null;
		this.numActions = 0;
	}
	
	resetTimers(){
		this.startTime = null;
		this.endTime = null;
	}

	startTimer() {
		this.startTime = Date.now();
	}

	recordSelectedItem(selectedItem) {
		this.selectedItem = selectedItem;
		this.stopTimer();
	}

	stopTimer() {
		this.endTime = Date.now();
		this.trials.push([this.trial, this.attempt, this.menuType, this.menuDepth, this.menuBreadth, this.isUsingMouse, this.targetItem, this.selectedItem, this.startTime, this.endTime, this.endTime - this.startTime]);
		this.resetTimers();
		this.attempt++;
	}

	recordTrial() {
		this.trials.push([this.trial, this.attempt, this.menuType, this.menuDepth, this.menuBreadth, this.isUsingMouse, this.targetItem, this.selectedItem, this.startTime, this.endTime, this.endTime - this.startTime]);
	}

	recordNumActions(num) {
		this.numActions = num;
	}

	newTrial() {
		this.attempt = 1;
	}

	toCsv() {
		var csvFile = "Trial,Attempt,Menu Type,Menu Depth, Menu Breadth, Using Mouse,Target Item,Selected Item,Start Time, End Time, Elapsed Time, Number of Actions\n";


		for (var i = 0; i < this.trials.length; i++) {
			csvFile += this.trials[i].join(',');
			csvFile += "\n";
		}

		var hiddenLink = document.createElement('a');
		hiddenLink.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvFile);
		hiddenLink.target = '_blank';
		hiddenLink.download = 'experiment.csv';
		document.body.appendChild(hiddenLink);
		hiddenLink.click();
	}


}