//VARIABLE PREDEFINED
  let story_data = [];
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



// 

function updateStoryJSON() {

  const rows = document.querySelectorAll("#tableBody tr");
  rows.forEach(row => {
      const id = parseInt(row.id.replace("row-", ""), 10);
      const summaryCell = row.querySelector("[data-key='summary']");
      const rationaleCell = row.querySelector("[data-key='rationale']");
      const storyCell = row.querySelector("[data-key='story']");

      // Find the story_data entry by id or create a new one if it doesn't exist
      let dataObj = story_data.find(x => x.id === id);
      if (!dataObj) {
          dataObj = { id: id };
          story_data.push(dataObj);
      }

      dataObj.Summary = summaryCell.textContent;
      dataObj.Rationale = rationaleCell.textContent;
      dataObj.Story = storyCell.textContent;
  });
  console.log(story_data);
  updateJSONDisplay();
}

document.getElementById("addStoryRow").addEventListener("click", function () {
  const newRow = `
      <tr id="row-${nextId}">
          <td data-key="summary" contenteditable="true" oninput="updateStoryJSON()"></td>
          <td data-key="rationale" contenteditable="true" oninput="updateStoryJSON()"></td>
          <td data-key="story" contenteditable="true" oninput="updateStoryJSON()"></td>
          <td>
              <button class="btn btn-danger" onclick="deleteRow(${nextId})">Delete</button>
          </td>
      </tr>
  `;

  document.getElementById("tableBody").innerHTML += newRow;
  nextId++;
  updateStoryJSON();
  updateJSONDisplay();
});

function deleteRow(id) {
  const row = document.getElementById("row-" + id);
  row.parentNode.removeChild(row);

  // Remove the object with the corresponding id from the story_data array
  const index = story_data.findIndex(x => x.id === id);
  if (index !== -1) {
      story_data.splice(index, 1);
  }

  updateStoryJSON();
  updateJSONDisplay();
}

function updateJSONDisplay() {
  // If you have an element to show the JSON, use this. Otherwise, you can remove this function.
  const jsonOutputElem = document.getElementById("storyTextArea");
  if (jsonOutputElem) {
      jsonOutputElem.value = JSON.stringify(story_data, null, 2);
  }
}