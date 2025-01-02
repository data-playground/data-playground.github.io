    import { FilterUpdateType, SheetType, TableauEventType } from 'https://public.tableau.com/javascripts/api/tableau.embedding.3.latest.js';
    (async () => {
      const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
/*
      window.tabConfig = window.tabConfig || {};

      tabConfig.functions = tabConfig.functions || {};
      tabConfig.data = tabConfig.data || {};

      tabConfig.data.dates = tabConfig.data.dates || [];
      tabConfig.data.keepRunning = false;

      // Get the viz object from the HTML web component
      const viz = document.querySelector('tableau-viz, tableau-authoring-viz');

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
	  viz.iframe.style.height = "100%"
          resolve();
        });

        viz.addEventListener(TableauEventType.VizLoadError, (error) => {
          const message = JSON.parse(error.detail.message);
          const errorMessage = JSON.parse(message.errorMessage);

          const displayMessage = `ca-error-${errorMessage.result.errors[0].code}`;
          reject(displayMessage);
        });
      });

      tabConfig.data.viz = viz;
*/

      const viz = tabConfig['NBA2024StatRace____UsingFilter'].data.viz;	    

      tabConfig['NBA2024StatRace____UsingFilter'].functions.selectSheet = function (viz, sheetName) {
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

        tabConfig['NBA2024StatRace____UsingFilter'].data.dashboard = dashboard;
        tabConfig['NBA2024StatRace____UsingFilter'].data.worksheet = worksheet;
      }

      tabConfig['NBA2024StatRace____UsingFilter'].functions.getDatesInRange = function (startDate, endDate) {
        let dates = [];
        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
          dates.push(new Date(currentDate).toISOString().slice(0, 10));
          currentDate.setDate(currentDate.getDate() + 1);
        }
		
        tabConfig['NBA2024StatRace____UsingFilter'].data.dates = dates;
      }

      tabConfig['NBA2024StatRace____UsingFilter'].functions.processDates = async function () {
        while (tabConfig['NBA2024StatRace____UsingFilter'].data.dates.length > 0 & tabConfig['NBA2024StatRace____UsingFilter'].data.keepRunning) {
			let date = tabConfig['NBA2024StatRace____UsingFilter'].data.dates.shift()
			await tabConfig['NBA2024StatRace____UsingFilter'].data.worksheet.applyFilterAsync("Game Date", [date], FilterUpdateType.Replace); // Process the date
			await wait(1000); // Wait for 2 seconds before moving to the next date
        }

		document.querySelector("#tableauEmbed #pause-btn").click();
      }

      tabConfig['NBA2024StatRace____UsingFilter'].functions.runProc = function () {
        tabConfig['NBA2024StatRace____UsingFilter'].data.sheetName = 'Using Filter - Chart';
		
        tabConfig['NBA2024StatRace____UsingFilter'].functions.selectSheet(tabConfig['NBA2024StatRace____UsingFilter'].data.viz, tabConfig['NBA2024StatRace____UsingFilter'].data.sheetName);

        let startDate = new Date('2024-10-22');
		tabConfig['NBA2024StatRace____UsingFilter'].data.startDate = startDate;
        let endDate = new Date('2024-12-21') // Day after last available date;
        tabConfig['NBA2024StatRace____UsingFilter'].data.endDate = endDate;
				
        tabConfig['NBA2024StatRace____UsingFilter'].functions.getDatesInRange(startDate, endDate);
				
        tabConfig['NBA2024StatRace____UsingFilter'].functions.processDates();		
      }

      /* tabConfig['NBA2024StatRace____UsingFilter'].functions.runProc(); */

      document.querySelector("#tableauEmbed #start-btn").addEventListener("click", function(e) {		
		tabConfig['NBA2024StatRace____UsingFilter'].data.keepRunning = true;
		
		document.querySelector("#tableauEmbed #start-btn").classList.add('disabled');
		document.querySelector("#tableauEmbed #pause-btn").classList.remove('disabled');
		document.querySelector("#tableauEmbed #restart-btn").classList.add('disabled');
		
		document.querySelector("#tableauEmbed #start-btn").disabled = true;
		document.querySelector("#tableauEmbed #pause-btn").disabled = false;
		document.querySelector("#tableauEmbed #restart-btn").disabled = true;
				
		if (tabConfig['NBA2024StatRace____UsingFilter'].data.dates.length === 0){
			tabConfig['NBA2024StatRace____UsingFilter'].functions.runProc();			
		} else {
			tabConfig['NBA2024StatRace____UsingFilter'].functions.processDates();
		}
	  })

      document.querySelector("#tableauEmbed #pause-btn").addEventListener("click", function(e) {
		tabConfig['NBA2024StatRace____UsingFilter'].data.keepRunning = false;
		
		document.querySelector("#tableauEmbed #start-btn").classList.remove('disabled');
		document.querySelector("#tableauEmbed #pause-btn").classList.add('disabled');
		document.querySelector("#tableauEmbed #restart-btn").classList.remove('disabled');
		
		document.querySelector("#tableauEmbed #start-btn").disabled = false;
		document.querySelector("#tableauEmbed #pause-btn").disabled = true;
		document.querySelector("#tableauEmbed #restart-btn").disabled = false;
	  })
	  
      document.querySelector("#tableauEmbed #restart-btn").addEventListener("click", function(e) {
		tabConfig['NBA2024StatRace____UsingFilter'].data.keepRunning = true;
		
		document.querySelector("#tableauEmbed #start-btn").classList.add('disabled');
		document.querySelector("#tableauEmbed #pause-btn").classList.remove('disabled');
		document.querySelector("#tableauEmbed #restart-btn").classList.add('disabled');
		
		document.querySelector("#tableauEmbed #start-btn").disabled = true;
		document.querySelector("#tableauEmbed #pause-btn").disabled = false;
		document.querySelector("#tableauEmbed #restart-btn").disabled = true;
		
		tabConfig['NBA2024StatRace____UsingFilter'].functions.runProc();
	  })
      // *** Insert your code below! ***
    })();
