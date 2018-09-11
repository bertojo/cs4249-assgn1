# cs4249 Assignment 1
This repository contains a basic interface and instrumentation to perform an empirical evaluation of Marking Menus and Radial Menus. You are expected to modify the code to perform the following tasks
1. Implement a new Independent Variable
2. Implement a new Dependent Variable
3. Modify tracking to record participant id, consent, pre-survey and post-survey questionnaires.

 You may fork this repository to your own Github account and clone your forked version for development. This will also help you use Github pages for hosting if you plan to conduct experiments online.
 
 ## Project Structure
 The interface is a static web project. However because of cross origin restrictions you will need a web server to run the experiment. Either turn on Github Pages(https://pages.github.com/) for your forked repository or setup a local server of your choice.
 
    ├── css                     # Style Sheets
         ├── external           
         ├── experiment.css    
    ├── js                      # Javascript
         ├── external          
         ├── experiment.js    
         ├── experiment-tracker.js
    ├── data           
         ├── experiment1.csv     # Contains arrangement of trials for participant 1
         ├── experiment2.csv     # Contains arrangement of trials for participant 2
         ├── experiment3.csv     # Contains arrangement of trials for participant 3
         ├── experiment4.csv     # Contains arrangement of trials for participant 4
         ├── experiment5.csv     # Contains arrangement of trials for participant 5
         ├── experiment6.csv     # Contains arrangement of trials for participant 6
         ├── experiment7.csv     # Contains arrangement of trials for participant 7
         ├── experiment8.csv     # Contains arrangement of trials for participant 8         
         ├── b4d1.csv   # Menu with breadth 4 & depth 1
         ├── b4d2.csv   # Menu with breadth 4 & depth 2
         ├── b4d2.csv   # Menu with breadth 4 & depth 3
         ├── b8d1.csv   # Menu with breadth 8 & depth 1
         ├── b8d2.csv   # Menu with breadth 8 & depth 2
         ├── b8d2.csv   # Menu with breadth 8 & depth 3
    ├── experiment.html    

### Changes
- Trial data is arranged in the csv file and read in via url parameter.
https://bertojo.github.io/cs4249-assgn1/experiment.html?1  -> the "?1" at the end refers to the first participant.
The ordering for the first participant will then be loaded.
- Participants have to correctly choose the target item to proceed. This is to measure attempts and first time success rate as DV
- Breadth of 4 and 8 for the menu is implemented. Originally wanted to add breadth of 6, but the changes to the library were too significant.
- Slight tweaks to the log file like "Elapsed Time" = End Time - Start Time, for convenience.

 ## Credits
This repository contains modified implementations of menus from the original contributors listed below.
1. Marking Menu : Forked from https://github.com/QuentinRoy/Marking-Menu
2. Radial Menu : Forked from https://github.com/lgrkvst/d3-sunburst-menu
