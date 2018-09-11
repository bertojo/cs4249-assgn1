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
		this.name = null;
		this.age = null;
		this.gender = null;
		this.education = null;
		this.masterhand = null;
		this.windowsOrMac = null;
		this.computerUsage = null;
		this.controlDevicePreference = null;
		this.softwares = null;
		this.experienceMarkingMenu = null;
		this.experienceRadialMenu = null;
		this.markingConfidence = null;
		this.radialConfidence = null;
		this.markingDifficulty = null;
		this.radialDifficulty = null;
		this.fasterOpinion = null;
		this.accurateOpinion = null;
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
		this.trials.push([this.trial, this.attempt, this.menuType, this.menuDepth, this.menuBreadth, this.isUsingMouse, this.targetItem, this.selectedItem, this.startTime, this.endTime, this.endTime - this.startTime, this.name, this.age, this.gender, this.education, this.masterhand, this.windowsOrMac, this.computerUsage, this.controlDevicePreference, this.softwares, this.experienceMarkingMenu, this.experienceRadialMenu, this.markingConfidence, this.radialConfidence, this.markingDifficulty, this.radialDifficulty, this.fasterOpinion, this.accurateOpinion]);
		this.resetTimers();
		this.attempt++;
	}

	newTrial() {
		this.attempt = 1;
	}

	toCsv() {
		var csvFile = "Trial,Attempt,Menu Type,Menu Depth, Menu Breadth, Using Mouse,Target Item,Selected Item,Start Time, End Time, Elapsed Time, Name, Age, Gender, Education, Masterhand, Windows or Mac, Average Computer usage, Mouse or Trackpad Preference, Software usage, Marking Menu Experience, Radial Menu Experience, Marking Menu Confidence, Radial Menu Confidence, Marking Menu Difficulty, Radial Menu Difficulty, Faster Opinion, Accuracy Opinion\n";


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