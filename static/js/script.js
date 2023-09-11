//VARIABLE PREDEFINED
  let story_data = [];
  let storySave = 1;
  let storyNextId = 1;

  let timeline_data = [];
  let timelineSave = 1;

  let timelineNextId = 1;
  let currentRowId = null;
  


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
  // If you have an element to show the JSON, use this. Otherwise, you can remove this function.
  const jsonOutputElem = document.getElementById("storyTextArea");
  if (jsonOutputElem) {
      jsonOutputElem.value = JSON.stringify(story_data, null, 2);
  }
}

//story table add
document.getElementById("addStoryRow").addEventListener("click", function () {
  const newRow = document.createElement('tr');
  newRow.id = `row-${storyNextId}`;

  ['summary', 'rationale', 'story'].forEach(key => {
    const cell = newRow.insertCell(-1);
    cell.setAttribute('data-key', key);
    cell.contentEditable = 'true';
  });

  const actionCell = newRow.insertCell(-1);
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.className = 'btn btn-danger';
  deleteButton.dataset.id = storyNextId;
  actionCell.appendChild(deleteButton);

  document.getElementById("storyTableBody").appendChild(newRow);

  story_data.push({id: storyNextId, Summary: '', Rationale: '', Story: ''});
  storyNextId++;
  updateJSONDisplay();
});

//story table edit
document.getElementById("storyTableBody").addEventListener('input', function (e) {
  if (e.target && e.target.matches("[data-key]")) {
    const key = e.target.getAttribute('data-key');
    const id = parseInt(e.target.parentElement.id.replace("row-", ""), 10);
    const dataObj = story_data.find(x => x.id === id);
    if (dataObj) {
      dataObj[key.charAt(0).toUpperCase() + key.slice(1)] = e.target.textContent;
    }
    updateJSONDisplay();
  }
});

//story table delete
document.getElementById("storyTableBody").addEventListener('click', function (e) {
  if (e.target && e.target.matches(".btn-danger")) {
    const id = parseInt(e.target.dataset.id, 10);
    e.target.parentElement.parentElement.remove();

    const index = story_data.findIndex(x => x.id === id);
    if (index !== -1) {
      story_data.splice(index, 1);
    }
    updateJSONDisplay();
  }
});

//story history save
$('#story-history-button').click(function() {
  let headingVar = "storyHeading" + storySave;
  let collapseVar = "storyCollapse" + storySave;
  
  let formattedStoryData = '';
  
  for (let i = 0; i < story_data.length; i++) {
    for (let key in story_data[i]) {
      formattedStoryData += `<strong>${key}:</strong> ${story_data[i][key]}<br/>`;
    }
    formattedStoryData += '<hr>';
  }
  
  let html_data = `
    <div class="accordion-item">
      <h2 class="accordion-header" id="${headingVar}">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseVar}" aria-expanded="false" aria-controls="${collapseVar}">
          Accordion Item #${storySave}
        </button>
      </h2>
      <div id="${collapseVar}" class="accordion-collapse collapse" aria-labelledby="${headingVar}" data-bs-parent="#accordionExample">
        <div class="accordion-body">
          ${formattedStoryData}
        </div>
      </div>
    </div>
  `;
  
  document.getElementById("accordionExample").innerHTML += html_data;
  storySave++;
  
 }
 
 );



///////////////////////////TIMELINE//////////////////////////
document.addEventListener("DOMContentLoaded", function() {

  const linkedDataModal = document.getElementById("editModal");
  const closeLinkedData = document.getElementById("closeLinkedData");

  function updateJSONDisplay() {
      // If you have an element to show the JSON, use this. Otherwise, you can remove this function.
      const jsonOutputElem = document.getElementById("jsonOutput");
      if (jsonOutputElem) {
          jsonOutputElem.value = JSON.stringify(timeline_data, null, 2);
      }
  }

  document.getElementById("addBlankRowBtn").addEventListener("click", function() {
      timeline_data.push({
          id: timelineNextId,
          time: "",
          event: "",
          dataItems: null,
          linkedData: []
      });

      const newRow = `
          <tr id="row-${timelineNextId}">
              <td data-key="time" contenteditable="true"></td>
              <td data-key="event" contenteditable="true"></td>
              <td>
                  <button id="dataItemBtn-${timelineNextId}" onclick="toggleDataItem(${timelineNextId})">Add</button>
              </td>
              <td>
                  <button class="btn btn-danger" onclick="deleteRow(${timelineNextId})">Delete</button>
              </td>
          </tr>
      `;

      document.getElementById("timelineTableBody").innerHTML += newRow;
      timelineNextId++;
      updateJSONDisplay();
  });

  document.getElementById("timelineTableBody").addEventListener("blur", function(event) {
      const target = event.target;
      if (target.hasAttribute("data-key")) {
          const rowId = parseInt(target.parentElement.getAttribute("id").split("-")[1]);
          const obj = timeline_data.find(obj => obj.id === rowId);

          if (target.getAttribute("data-key") === "time") {
              obj["time"] = target.textContent;
          } else if (target.getAttribute("data-key") === "event") {
              obj["event"] = target.textContent;
          }
          updateJSONDisplay();
      }
  }, true);

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

  window.deleteRow = function(rowId) {
      timeline_data = timeline_data.filter(obj => obj.id !== rowId);
      const rowElement = document.getElementById("row-" + rowId);
      if (rowElement) {
          rowElement.remove();
      }
      updateJSONDisplay();
  }

  // current focus
  function populateLinkedDataModal(rowId) {
    const obj = timeline_data.find(o => o.id === rowId);
    let tableContent = "";
    if (obj && obj.linkedData) {
      obj.linkedData.forEach(data => {
        tableContent += `
          <tr>
            <td contenteditable="true">${data.dataPath}</td>
            <td contenteditable="true">${data.exampleData}</td>
            <td>
              <select class="standard-dropdown">
                <option value="standard1">Standard 1</option>
                <option value="standard2">Standard 2</option>
                <!-- Add other standards here -->
              </select>
            </td>
            <td>
              <button class="btn btn-danger" onclick="deleteLinkedDataRow(this)">Delete</button>
            </td>
          </tr>
        `;
      });
    }
    document.getElementById("linkedDataTableBody").innerHTML = tableContent;
  }
  

  window.resetLinkedData = function() {
    const obj = timeline_data.find(o => o.id === currentRowId);
    if (obj) {
        obj.linkedData = [];  // Reset the linked data for the row
    }
    const btn = document.getElementById("dataItemBtn-" + currentRowId);
    if (btn) {
        btn.innerText = "Add";  // Change the button back to 'Add'
    }
    linkedDataModal.style.display = "none";  // Close the modal
    updateJSONDisplay();
}

closeLinkedData.onclick = function() {
  linkedDataModal.style.display = "none";
  saveLinkedDataToJSON();
  updateJSONDisplay();
}

  function saveLinkedDataToJSON() {
  const obj = timeline_data.find(o => o.id === currentRowId);
  const rows = document.getElementById("linkedDataTableBody").querySelectorAll("tr");
  obj.linkedData = [];
  rows.forEach(row => {
    const cells = row.querySelectorAll("td");
    const standardDropdown = row.querySelector(".standard-dropdown");
    obj.linkedData.push({
      dataPath: cells[0].textContent,
      exampleData: cells[1].textContent,
      standard: standardDropdown ? standardDropdown.value : ''
    });
  });
}


  document.getElementById("linkedDataTableBody").addEventListener("blur", function(event) {
      saveLinkedDataToJSON();
      updateJSONDisplay();
  }, true);

  window.addLinkedDataRow = function() {
    const newRow = `
      <tr>
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>
        <td>
          <select class="standard-dropdown">
            <option value="standard1">Standard 1</option>
            <option value="standard2">Standard 2</option>
            <!-- Add other standards here -->
          </select>
        </td>
        <td>
          <button class="btn btn-danger" onclick="deleteLinkedDataRow(this)">Delete</button>
        </td>
      </tr>
    `;
    document.getElementById("linkedDataTableBody").innerHTML += newRow;
  }
  

  linkedDataModal.addEventListener("click", function(event) {
    if (event.target === linkedDataModal) {  // This ensures we're clicking on the modal background and not on its content
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