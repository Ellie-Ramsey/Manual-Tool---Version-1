//VARIABLE PREDEFINED
  let story_data = [{"Summary":"","Rationale":"","Story":""}];
  let storySave = 1;

  let timeline_data = [];
  let timelineSave = 1;

  let nextId = 1;
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



//////////////////////////STORY//////////////////////////
//STORY - JSON FILE LOADING
$('#storyFileLoadButton').click(function() {

  const fileInput = document.getElementById('storyFileLoad');
  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
      story_data = e.target.result;

      var json_data = JSON.parse(story_data);
      
      var col = [];
      for (var i = 0; i < json_data.length; i++) {
          for (var key in json_data[i]) {
              if (col.indexOf(key) === -1) {
                  col.push(key);
              }
          }
      }
              
      var table = document.getElementById("storyJsonTable");
      var tr = table.insertRow(-1);                  
              
      for (var i = 0; i < col.length; i++) {
          var th = document.createElement("th");      
          th.innerHTML = col[i];
          tr.appendChild(th);
      }
              
      for (var i = 0; i < json_data.length; i++) {
          tr = table.insertRow(-1);
          for (var j = 0; j < col.length; j++) {
              var tabCell = tr.insertCell(-1);
              tabCell.innerHTML = json_data[i][col[j]];
              tabCell.contentEditable = true;
          }
      }

  };
  reader.readAsText(file);
 });

//STORY - JSON TABLE UPDATE VARIABLE
document.getElementById("storyJsonTable").oninput = function() {
  var table = document.getElementById("storyJsonTable");
  var json_data = [];

  for (var i = 1, row; row = table.rows[i]; i++) {
      var row_data = {};

      for (var j = 0, col; col = row.cells[j]; j++) {
          row_data[table.rows[0].cells[j].innerText] = col.innerText;
      }

      json_data.push(row_data);
  }

  story_data = JSON.stringify(json_data, null, 2);
};

//STORY - history save
$('#story-history-button').click(function() {
    let headingVar = "storyHeading" + storySave;
    let collapseVar = "storyCollapse" + storySave;

    let story_data_json = JSON.parse(story_data);
    
    let html_data = '';
    for (let i = 0; i < story_data_json.length; i++) {
      let formattedStoryData = '';
      for (let key in story_data_json[i]) {
        formattedStoryData += `<strong>${key}:</strong> ${story_data_json[i][key]}<br/>`;
      }

      html_data += `
        <div class="accordion-item">
          <h2 class="accordion-header" id="${headingVar + i}">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseVar + i}" aria-expanded="false" aria-controls="${collapseVar + i}">
              Accordion Item #${storySave + i}
            </button>
          </h2>
          <div id="${collapseVar + i}" class="accordion-collapse collapse" aria-labelledby="${headingVar + i}" data-bs-parent="#accordionExample">
            <div class="accordion-body">
              ${formattedStoryData}
            </div>
          </div>
        </div>
      `;
    }
  
    $('#storyHistoryContent').append(html_data);
  
    storySave = storySave + 1;
  
   });




   
//  MANUAL TIMELINE CODE
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
          id: nextId,
          time: "",
          event: "",
          dataItems: null,
          linkedData: []
      });

      const newRow = `
          <tr id="row-${nextId}">
              <td data-key="time" contenteditable="true"></td>
              <td data-key="event" contenteditable="true"></td>
              <td>
                  <button id="dataItemBtn-${nextId}" onclick="toggleDataItem(${nextId})">Add</button>
              </td>
              <td>
                  <button class="btn btn-danger" onclick="deleteRow(${nextId})">Delete</button>
              </td>
          </tr>
      `;

      document.getElementById("tableBody").innerHTML += newRow;
      nextId++;
      updateJSONDisplay();
  });

  document.getElementById("tableBody").addEventListener("blur", function(event) {
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

  function populateLinkedDataModal(rowId) {
      const obj = timeline_data.find(o => o.id === rowId);
      let tableContent = "";
      if (obj && obj.linkedData) {
          obj.linkedData.forEach(data => {
              tableContent += `
                  <tr>
                      <td contenteditable="true">${data.dataPath}</td>
                      <td contenteditable="true">${data.exampleData}</td>
                      <td contenteditable="true">${data.standard}</td>
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
          obj.linkedData.push({
              dataPath: cells[0].textContent,
              exampleData: cells[1].textContent,
              standard: cells[2].textContent
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
              <td contenteditable="true"></td>
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

});





