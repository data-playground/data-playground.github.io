import { FilterUpdateType, SheetType, TableauEventType } from 'https://public.tableau.com/javascripts/api/tableau.embedding.3.latest.js';

(async () => {
  // Create a wait process to be used later
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Set a dictionary to hold all the information we need for this process
  window.tabConfig = window.tabConfig || {};

  // Loop through all the Tableau visualizations to create the dictionary for each viz
  document.querySelectorAll('tableau-viz, tableau-authoring-viz').forEach((v) => {
    tabConfig[v.getAttribute('tab-name')] = tabConfig[v.getAttribute('tab-name')] || {};
    tabConfig[v.getAttribute('tab-name')].functions = tabConfig[v.getAttribute('tab-name')].functions || {};
    tabConfig[v.getAttribute('tab-name')].data = tabConfig[v.getAttribute('tab-name')].data || {};

    // Save the viz element into the dictionary
    tabConfig[v.getAttribute('tab-name')].data.viz = v;
  })

  // Define the name of the viz to be worked
  let vizName = "NBARaceChart__UsingFilter";

  // Pull the selected viz element and save into the "viz" variable
  let viz = tabConfig[vizName].data.viz;	

  tabConfig[vizName].data.dates = tabConfig[vizName].data.dates || [];

  // keepRunning variable will help with the process, providing the information if the loop should contiue to run or pause
  tabConfig[vizName].data.keepRunning = false;

  // Get the viz object from the HTML web component
  // window.token is the JWT generated using a Connected App configured with Direct Trust.
  // The value is generated and is only available when this code executes within the Embedding Playground.
  // See the Connected Apps documentation (https://sfdc.co/ca-direct) for more information.
  // See this repository (https://sfdc.co/ca-jwt) for samples in various languages.
  viz.token = window.token;

  // Wait for the viz to become interactive
  await new Promise((resolve, reject) => {
    // Add an event listener to verify the viz becomes interactive
    viz.addEventListener(TableauEventType.FirstInteractive, () => {
      console.log('Viz is interactive!');
      viz.iframe.style.height = "100%";
      resolve();
    });

    viz.addEventListener(TableauEventType.VizLoadError, (error) => {
      const message = JSON.parse(error.detail.message);
      const errorMessage = JSON.parse(message.errorMessage);

      const displayMessage = `ca-error-${errorMessage.result.errors[0].code}`;
      reject(displayMessage);
    });
  });

  // selectSheet function gathers details on which dashboard and worksheet the process should run
  tabConfig[vizName].functions.selectSheet = function (viz, sheetName) {
    let dashboard;
    let worksheet;
    if (viz.workbook.activeSheet.sheetType === SheetType.Dashboard) {
      dashboard = viz.workbook.activeSheet;

      // Provide the name of the worksheet you want to use from the dashboard
      worksheet = dashboard.worksheets.find((ws) => ws.name === sheetName);
    } else {
      // Active sheet is already a worksheet
      worksheet = viz.workbook.activeSheet;
    }

    tabConfig[vizName].data.dashboard = dashboard;
    tabConfig[vizName].data.worksheet = worksheet;
  }

  // getDatesInRange function makes a list of dates between two defined dates (to extract dates in dashboard)
  tabConfig[vizName].functions.getDatesInRange = function (startDate, endDate) {
    let dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate).toISOString().slice(0, 10));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    tabConfig[vizName].data.dates = dates;
  }

  // Run process for each date in date list defined by function getDatesInRange
  tabConfig[vizName].functions.processDates = async function () {
    while (tabConfig[vizName].data.dates.length > 0 & tabConfig[vizName].data.keepRunning) {
      let date = tabConfig[vizName].data.dates.shift();
      await tabConfig[vizName].data.worksheet.applyFilterAsync("Game Date", [date], FilterUpdateType.Replace); // Process the date
      await wait(1000); // Wait for 2 seconds before moving to the next date
    }

    // Mimics a click on the pause button to change button styles
    document.querySelector("#tableauEmbed #pause-btn").click();
  }

  // runProc function puts all the functions in the correct order. It is used to run the process from the beginning
  tabConfig[vizName].functions.runProc = function () {
    // Define the sheet name for the process
    tabConfig[vizName].data.sheetName = 'Using Filter - Chart';

    // Run the process to gather the objects for the selected sheet
    tabConfig[vizName].functions.selectSheet(tabConfig[vizName].data.viz, tabConfig[vizName].data.sheetName);

    // Define start and end dates for the process
    let startDate = new Date('2024-10-22'); // First date available in the dashboard
    tabConfig[vizName].data.startDate = startDate;
    let endDate = new Date('2024-12-21') // Day after last available date;
    tabConfig[vizName].data.endDate = endDate;
    
    // Create the list with dates between start and end dates
    tabConfig[vizName].functions.getDatesInRange(startDate, endDate);
    
    // Loops through dates within the list
    tabConfig[vizName].functions.processDates();		
  }

  // If the start button is clicked, run the process (from the beginning if date list is empty, continues if there are dates left to run)
  // Also, changes the style for buttons
  document.querySelector("#tableauEmbed #start-btn").addEventListener("click", function(e) {		
    tabConfig[vizName].data.keepRunning = true;
    
    document.querySelector("#tableauEmbed #start-btn").classList.add('disabled');
    document.querySelector("#tableauEmbed #pause-btn").classList.remove('disabled');
    document.querySelector("#tableauEmbed #restart-btn").classList.add('disabled');
    
    document.querySelector("#tableauEmbed #start-btn").disabled = true;
    document.querySelector("#tableauEmbed #pause-btn").disabled = false;
    document.querySelector("#tableauEmbed #restart-btn").disabled = true;
        
    if (tabConfig[vizName].data.dates.length === 0){
      tabConfig[vizName].functions.runProc();			
    } else {
      tabConfig[vizName].functions.processDates();
    }
  })

  // If the pause button is clicked, pause the process, allowing to later pick up from where it was stopped
  // Also, changes the style for buttons
  document.querySelector("#tableauEmbed #pause-btn").addEventListener("click", function(e) {
    tabConfig[vizName].data.keepRunning = false;
    
    document.querySelector("#tableauEmbed #start-btn").classList.remove('disabled');
    document.querySelector("#tableauEmbed #pause-btn").classList.add('disabled');
    document.querySelector("#tableauEmbed #restart-btn").classList.remove('disabled');
    
    document.querySelector("#tableauEmbed #start-btn").disabled = false;
    document.querySelector("#tableauEmbed #pause-btn").disabled = true;
    document.querySelector("#tableauEmbed #restart-btn").disabled = false;
  })

  // If the restart button is clicked, run the process from the beginning, independently if date list is empty or contains dates
  // Also, changes the style for buttons
  document.querySelector("#tableauEmbed #restart-btn").addEventListener("click", function(e) {
    tabConfig[vizName].data.keepRunning = true;
    
    document.querySelector("#tableauEmbed #start-btn").classList.add('disabled');
    document.querySelector("#tableauEmbed #pause-btn").classList.remove('disabled');
    document.querySelector("#tableauEmbed #restart-btn").classList.add('disabled');
    
    document.querySelector("#tableauEmbed #start-btn").disabled = true;
    document.querySelector("#tableauEmbed #pause-btn").disabled = false;
    document.querySelector("#tableauEmbed #restart-btn").disabled = true;
    
    tabConfig[vizName].functions.runProc();
  })
})();
