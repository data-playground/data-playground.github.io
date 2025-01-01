    import { FilterUpdateType, SheetType, TableauEventType } from 'https://public.tableau.com/javascripts/api/tableau.embedding.3.latest.js';
    (async () => {
      const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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


      tabConfig.functions.selectSheet = function (viz, sheetName) {
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

        tabConfig.data.dashboard = dashboard;
        tabConfig.data.worksheet = worksheet;
      }

      tabConfig.functions.getDatesInRange = function (startDate, endDate) {
        let dates = [];
        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
          dates.push(new Date(currentDate).toISOString().slice(0, 10));
          currentDate.setDate(currentDate.getDate() + 1);
        }
		
        tabConfig.data.dates = dates;
      }

      tabConfig.functions.processDates = async function () {
        while (tabConfig.data.dates.length > 0 & tabConfig.data.keepRunning) {
			let date = tabConfig.data.dates.shift()
			await tabConfig.data.worksheet.applyFilterAsync("Game Date", [date], FilterUpdateType.Replace); // Process the date
			await wait(1000); // Wait for 2 seconds before moving to the next date
        }

		document.querySelector("#tableauEmbed #pause-btn").click();
      }

      tabConfig.functions.runProc = function () {
        tabConfig.data.sheetName = 'Using Filter - Chart';
		
        tabConfig.functions.selectSheet(tabConfig.data.viz, tabConfig.data.sheetName);

        let startDate = new Date('2024-10-22');
		tabConfig.data.startDate = startDate;
        let endDate = new Date('2024-12-21') // Day after last available date;
        tabConfig.data.endDate = endDate;
				
        tabConfig.functions.getDatesInRange(startDate, endDate);
				
        tabConfig.functions.processDates();		
      }

      /* tabConfig.functions.runProc(); */

      document.querySelector("#tableauEmbed #start-btn").addEventListener("click", function(e) {		
		tabConfig.data.keepRunning = true;
		
		document.querySelector("#tableauEmbed #start-btn").classList.add('disabled');
		document.querySelector("#tableauEmbed #pause-btn").classList.remove('disabled');
		document.querySelector("#tableauEmbed #restart-btn").classList.add('disabled');
		
		document.querySelector("#tableauEmbed #start-btn").disabled = true;
		document.querySelector("#tableauEmbed #pause-btn").disabled = false;
		document.querySelector("#tableauEmbed #restart-btn").disabled = true;
				
		if (tabConfig.data.dates.length === 0){
			tabConfig.functions.runProc();			
		} else {
			tabConfig.functions.processDates();
		}
	  })

      document.querySelector("#tableauEmbed #pause-btn").addEventListener("click", function(e) {
		tabConfig.data.keepRunning = false;
		
		document.querySelector("#tableauEmbed #start-btn").classList.remove('disabled');
		document.querySelector("#tableauEmbed #pause-btn").classList.add('disabled');
		document.querySelector("#tableauEmbed #restart-btn").classList.remove('disabled');
		
		document.querySelector("#tableauEmbed #start-btn").disabled = false;
		document.querySelector("#tableauEmbed #pause-btn").disabled = true;
		document.querySelector("#tableauEmbed #restart-btn").disabled = false;
	  })
	  
      document.querySelector("#tableauEmbed #restart-btn").addEventListener("click", function(e) {
		tabConfig.data.keepRunning = true;
		
		document.querySelector("#tableauEmbed #start-btn").classList.add('disabled');
		document.querySelector("#tableauEmbed #pause-btn").classList.remove('disabled');
		document.querySelector("#tableauEmbed #restart-btn").classList.add('disabled');
		
		document.querySelector("#tableauEmbed #start-btn").disabled = true;
		document.querySelector("#tableauEmbed #pause-btn").disabled = false;
		document.querySelector("#tableauEmbed #restart-btn").disabled = true;
		
		tabConfig.functions.runProc();
	  })

      // *** Insert your code below! ***
    })();
