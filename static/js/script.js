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



// 

document.getElementById("addStoryRow").addEventListener("click", function() {
  // Generate a new row
  const newRow = `
      <tr id="row-${nextId}">
          <td data-key="summary" contenteditable="true"></td>
          <td data-key="rationale" contenteditable="true"></td>
          <td data-key="story" contenteditable="true"></td>
          <td>
              <button class="btn btn-danger" onclick="deleteRow(${nextId})">Delete</button>
          </td>
      </tr>
  `;

  document.getElementById("tableBody").innerHTML += newRow;


  nextId++;
});


function deleteRow(id) {
  const row = document.getElementById("row-" + id);
  row.parentNode.removeChild(row);
  
}




function updateJSONDisplay() {
  // If you have an element to show the JSON, use this. Otherwise, you can remove this function.
  const jsonOutputElem = document.getElementById("storyTextArea");
  if (jsonOutputElem) {
      jsonOutputElem.value = JSON.stringify(story_data, null, 2);
  }
}