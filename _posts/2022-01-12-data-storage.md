---
title: "Data Storage"
categories: 
  - en
date: 2022-01-12T17:00:00+00:00

---

<div id="tableauEmbed">
  <div id="tableauBtn">
    <button id="start-btn" type="button" class="btn btn-outline-dark">
      <span class="material-symbols-outlined">play_arrow</span>
      Start
    </button>
    <button id="continue-btn" type="button" class="btn btn-outline-dark" style="display:none">
      <span class="material-symbols-outlined">resume</span>
      Continue
    </button>
    <button id="pause-btn" type="button" class="btn btn-outline-dark disabled">
      <span class="material-symbols-outlined">pause</span>
      Pause
    </button>  
	<button id="play-pause-btn" type="button" class="btn btn-outline-dark" style="display:none">
      <span class="material-symbols-outlined">play_pause</span>
      Play/Pause
    </button>  
	<button id="restart-btn" type="button" class="btn btn-outline-dark disabled">
      <span class="material-symbols-outlined">repeat</span>
      Restart
    </button>
  </div>
  <tableau-viz
    src="https://public.tableau.com/views/NBA2024StatRace/UsingFilter?:language=en-US&publish=yes&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link"
    device="tablet"
    hide-tabs
    height="800px"
    toolbar="hidden"
  >
  </tableau-viz>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
  <script type="module">
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
  </script>  
  <style>
    #tableauEmbed {
      width: 100%;
      height: 100%;
      margin-bottom: 75px;
    }    
	
	#tableauEmbed tableau-viz {
      height: 850px;
    }

	#tableauEmbed #tableauBtn {
	  display: flex;
      gap: 2%;
	}

	#tableauEmbed #tableauBtn button {
	  display: flex;
      padding: .275rem .5rem;
      flex-direction: column;
      align-content: center;
      align-items: center;
	}

	#tableauEmbed #tableauBtn button.disabled {
	  pointer-events: none;
	  cursor: not-allowed;
	}
  </style>
</div>

# What is Data Storage?

Data Storage is the the act of storing data (duh!). Data Storage is to decide where you are going to keep the data for your process. The decision to how and where the data is kept can be done based on multiple reasons: ease of access, security, size...

More often than not we are going to see very common data storage strategies, like the best friend/worst enemy of every analyst, Excel. Excel is easy to access and to share, since most people have the necessary program to use it. It is also very user friendly, with no coding/scripting/querying knowledge necessary. If you are starting your analytics journey, definitely expect a lot of data to come on Excel format (.xls, .xlsx)

Another very common format to receive and store data is the "delimiter-separated values" files. The format most often is the csv (comma-separated values), where each column is separate by a comma and, usually, lines are separated by a new line. Another format commonly used is tsv (tab-separated values), but many other characters can be used to separate data.

When we start to store and communicate with a large amount of data (a million rows is usually when Excel start to give problems), it is probably smart to store that data in databases using management tools that can communicate with that database even when the numer of rows increase. There are many different types of database with the most common approach being the SQL (Structured Query Language) based databases. To use this type of storage you need to understand some to of querying language. 

As you start to see different flavors of databases, you will see differences on the languages, but they have many similarities between tools of the same type. Much like in our human languages, where, as we travel to different places, even if they speak the same language they have differences on how they speak and which words they use to describe the same thing, querying language also differs from one another as we travel between the available tools, but they tends to have the same backbone that are very much relatable between them.

## What Data Playground will use?

As we mentioned before, a lot of datasets are available in Excel and csv files, so at Data Playground we will use a lot of sets based on those format. Even some of the datasets created by us by gathering data, we will save on those two formats just for ease of use.

In other projects, the amount of data starts to become to big for Excel and would demand breaking the data in mutiple files, which could lead to errors. For those projects, we will use a Rational Database tool, called MySQL. MySQL is an open-source tool that can be downloaded and installed for free with a giant community, which helps us find solutions for some of the problems we may find as we go through the journey.

## What do I need to do?

### Excel

For Excel files, there is the Microsoft Excel path, that most professional and personal computers currently have. If you do not have the full Office version you can sign up for free to use the online version of Excel.

Other free versions of excel file readers are Google Sheets, Apache OpenOffice Calc and LibreOffice Calc. All those options are fairly good to read the data, all with its small differences from the Microsoft product.

### CSV and other delimiter-separated files

For most delimiter separated files, Excel readers are very reliable and do a good job to read the data and even transform in Excel-like files.

For some more complex data, like when the separator may appear in a text column (e.g. a comma-separated file with a full address column that one of the rows read "20 W 34th St, New York, NY 10001"), Excel file readers may not work as well and you may want to see the file in its raw format. For that Notepad (or TextEdit for Mac users) is available in most computers.

An option I personally like to have is Notepad++. Notepad++ is source code editor that support many different extensions (we will definitely talk more about it as we go through our projects). It not only provides usual text editor capabilities, but more complex ones like find and replace for regular expressions, line numbers etc that facilitates the cleaning and fixing on some data and coding sources.

Unfortunately, Notepad++ is only available for Windows, but Mac users can find very good alternatives like Brackets that provides pretty much the same capabilties (you may see Brackets some times here as well).

### Database

There a lot of different providers for database management solutions, some on premise (in a computer you have access to) while others in the cloud (a third party hosting the solution). Microsoft SQL Server, Oracle RDBMS, SAP Sybase ASE and IBM DB2 are some on premise tools, while AmazonRDS is a great example of cloud-based data management tool.

All the example above are commercial tools that you need a license or a paid account to use. As we intend to make our lives easier and available to everyone at Data Playground, we will use an open-source free-to-use on-premise tool called MySQL that is very similar to other relational SQL tools in the market. Other examples of open-source tools that we may see in future projects are PostgreSQL, MariaDB and MongoDB (all with its small peculiarities, but very similar to each other)

If you decide to follow us and use MySQL, please download the [MySQL Community Edition](https://dev.mysql.com/downloads/installer/)

## Why Data Storage?

Data is always stored somewhere somehow and we will be exposed to it if we decide to go on this analytics journey. At Data Playground, we will go through a variety of projects with data being sourced from different locations. This will give us a great understanding on why this topic is so important and a baseline for many companies when hiring data analysts, engineers and scientists.



I hope this helped to clarify all the different types of data sources you may encounter during our journey. 

Any questions or requests, please contact us at dataplayground.contact@gmail.com
