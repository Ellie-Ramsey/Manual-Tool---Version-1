//VARIABLE PREDEFINED
let story_data = { "Summary": "", "Rationale": "", "Story": ""};
let storySave = 1;
let timeline_data = {};
let timelineSave = 1;
let currentRowId = null;
let timelineNextId = 1;

  


//////////////////////////NAVBAR//////////////////////////
//MUltiple Tab Code
function openPage(pageName,elmnt,color) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].style.backgroundColor = "";
    }

    document.getElementById(pageName).style.display = "block";
    elmnt.style.backgroundColor = color;
  }
  document.getElementById("defaultOpen").click();


///////////////////////////STORY//////////////////////////
//story text area update
function updateJSONDisplay() {
  document.getElementById('storyTextArea').textContent = JSON.stringify(story_data, null, 2);
}

//story story_data variable update
document.getElementById("storyTableBody").addEventListener('input', function (e) {
  if (e.target && e.target.matches("[data-key]")) {
    const key = e.target.getAttribute('data-key');
    // Since story_data is an object, directly update its property
    story_data[key] = e.target.textContent;
    updateJSONDisplay();
  }
});
 

//story history save
$('#story-history-button').click(function() {
  let headingVar = "storyHeading" + storySave;
  let collapseVar = "storyCollapse" + storySave;
  
  let formattedStoryData = '';
  
  // Assuming story_data is a single object
  for (let key in story_data) {
    if (story_data.hasOwnProperty(key)) { // Check if the key exists in the object
      formattedStoryData += `<strong>${key}:</strong> ${story_data[key]}<br/>`;
    }
  }
  
  let html_data = `
    <div class="accordion-item">
      <h2 class="accordion-header" id="${headingVar}">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseVar}" aria-expanded="false" aria-controls="${collapseVar}">
          Accordion Item #${storySave}
        </button>
      </h2>
      <div id="${collapseVar}" class="accordion-collapse collapse" aria-labelledby="${headingVar}" data-bs-parent="#accordionStory">
        <div class="accordion-body">
          ${formattedStoryData}
        </div>
      </div>
    </div>
  `;
  
  document.getElementById("accordionStory").innerHTML += html_data;
  storySave++;
});


// THIS WILL BE THE TIMELINE HISTORY SAVE
$('#timeline-history-button').click(function() {
  let headingVar = "timelineHeading" + timelineSave;
  let collapseVar = "timelineCollapse" + timelineSave;

  let formattedTimelineData = formatTimelineDataForDisplay(timeline_data);

  let html_data = `
    <div class="accordion-item">
      <h2 class="accordion-header" id="${headingVar}">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseVar}" aria-expanded="false" aria-controls="${collapseVar}">
          Accordion Item #${timelineSave}
        </button>
      </h2>
      <div id="${collapseVar}" class="accordion-collapse collapse" aria-labelledby="${headingVar}" data-bs-parent="#accordionTimeline">
        <div class="accordion-body">
          ${formattedTimelineData}
        </div>
      </div>
    </div>
  `;

  document.getElementById("accordionTimeline").innerHTML += html_data;
  timelineSave++;
});





function formatTimelineDataForDisplay(data, indent = 0) {
  let formattedData = '';
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      if (typeof data[key] === 'object' && data[key] !== null) {
        formattedData += `${" ".repeat(indent)}<strong>${key}:</strong><br/>`;
        formattedData += formatTimelineDataForDisplay(data[key], indent + 2);
      } else {
        formattedData += `${" ".repeat(indent)}<strong>${key}:</strong> ${data[key]}<br/>`;
      }
    }
  }
  return formattedData;
}










///////////////////////////TIMELINE//////////////////////////
document.addEventListener("DOMContentLoaded", function() {

  const linkedDataModal = document.getElementById("editModal");
  const closeLinkedData = document.getElementById("closeLinkedData");

  function updateJSONDisplay() {
    const jsonOutputElem = document.getElementById("jsonOutput");
    if (jsonOutputElem) {
      jsonOutputElem.value = JSON.stringify(timeline_data, null, 2);
    }
  }

  document.getElementById("addBlankRowBtn").addEventListener("click", function() {
    timeline_data[timelineNextId] = {
      id: timelineNextId,
      time: "",
      event: "",
      dataItems: null,
      linkedData: []
    };
    
    const newRow = `
      <tr id="row-${timelineNextId}">
        <td data-key="time" contenteditable="true"></td>
        <td data-key="event" contenteditable="true"></td>
        <td>
          <button id="dataItemBtn-${timelineNextId}" onclick="toggleDataItem(${timelineNextId})">Add</button>
        </td>
        <td>
          <button class="btn btn-danger delete-row">Delete</button>
        </td>
      </tr>
    `;

    document.getElementById("timelineTableBody").innerHTML += newRow;
    timelineNextId++;
    updateJSONDisplay();
  });

  document.getElementById("timelineTableBody").addEventListener("click", function(event) {
    if (event.target && event.target.matches(".delete-row")) {
      const rowElement = event.target.closest("tr");
      if (rowElement && rowElement.id) {
        const rowId = parseInt(rowElement.id.split("-")[1]);
        delete timeline_data[rowId];
        rowElement.remove();
        updateJSONDisplay();
      }
    }
  });
  

  window.toggleDataItem = function(rowId) {
    const btn = document.getElementById("dataItemBtn-" + rowId);
    if (btn.innerText === "Add" || btn.innerText === "Edit") {
      btn.innerText = "Edit";
      currentRowId = rowId;
      linkedDataModal.style.display = "block"; 
      populateLinkedDataModal(rowId);
    } else {
      btn.innerText = "Add";
      currentRowId = null;
    }
  }

  document.getElementById("timelineTableBody").addEventListener("input", function(event) {
    const cell = event.target.closest("td");
    if (cell && cell.hasAttribute("data-key")) {
      const key = cell.getAttribute("data-key");
      const rowElement = cell.closest("tr");
      if (rowElement && rowElement.id) {
        const rowId = parseInt(rowElement.id.split("-")[1]);
        timeline_data[rowId][key] = cell.textContent;
        updateJSONDisplay();
      }
    }
  });

  window.deleteRow = function(rowId) {
    delete timeline_data[rowId];
    const rowElement = document.getElementById("row-" + rowId);
    if (rowElement) {
      rowElement.remove();
    }
    updateJSONDisplay();
  }

function populateLinkedDataModal(rowId) {
  const obj = timeline_data[rowId];
  let tableContent = "";
  if (obj && obj.linkedData) {
    tableContent = `
      <tr>
        <td contenteditable="true">${obj.linkedData.dataPath || ''}</td>
        <td contenteditable="true">${obj.linkedData.exampleData || ''}</td>
        <td>
          <button class="btn btn-danger" onclick="deleteLinkedDataRow(this)">Delete</button>
        </td>
      </tr>
    `;
  }
  document.getElementById("linkedDataTableBody").innerHTML = tableContent;
}

window.resetLinkedData = function() {
  const obj = timeline_data[currentRowId];
  if (obj) {
    obj.linkedData = [];
    obj.dataItems = null;
    delete obj.standard;
  }
  const btn = document.getElementById("dataItemBtn-" + currentRowId);
  if (btn) {
    btn.innerText = "Add";
  }
  linkedDataModal.style.display = "none";
  updateJSONDisplay();
}

closeLinkedData.onclick = function() {
  linkedDataModal.style.display = "none";
  saveLinkedDataToJSON();
  updateJSONDisplay();
}

function saveLinkedDataToJSON() {
  const obj = timeline_data[currentRowId];
  const rows = document.getElementById("linkedDataTableBody").querySelectorAll("tr");
  obj.linkedData = {};
  rows.forEach(row => {
    const cells = row.querySelectorAll("td");
    obj.linkedData["dataPath"] = cells[0].textContent;
    obj.linkedData["exampleData"] = cells[1].textContent;
  });
}

document.getElementById("linkedDataTableBody").addEventListener("blur", function(event) {
  saveLinkedDataToJSON();
  updateJSONDisplay();
}, true);

window.addLinkedDataRow = function() {
  const newRow = `
  <tr id="row-${timelineNextId}">
      <td data-key="time" contenteditable="true"></td>
      <td data-key="event" contenteditable="true"></td>
      <td>
          <button id="dataItemBtn-${timelineNextId}" onclick="toggleDataItem(${timelineNextId})">Add</button>
      </td>
      <td>
          <button class="btn btn-danger delete-row">Delete</button>
      </td>
  </tr>
`;

  document.getElementById("linkedDataTableBody").innerHTML += newRow;
}

linkedDataModal.addEventListener("click", function(event) {
  if (event.target === linkedDataModal) {
    linkedDataModal.style.display = "none";
  }
});

window.deleteLinkedDataRow = function(buttonElem) {
  buttonElem.parentElement.parentElement.remove();
  saveLinkedDataToJSON();
  updateJSONDisplay();
}

document.getElementById("linkedDataTableBody").addEventListener("change", function(event) {
  if (event.target && event.target.matches(".standard-dropdown")) {
    saveLinkedDataToJSON();
    updateJSONDisplay();
  }
}, true);

});
