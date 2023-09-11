//VARIABLE PREDEFINED
  let story_data = [];
  let storySave = 1;
  let storyNextId = 1;

  let timeline_data = [];
  let timelineSave = 1;
  


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
function updateJSONDisplay() {
  // If you have an element to show the JSON, use this. Otherwise, you can remove this function.
  const jsonOutputElem = document.getElementById("storyTextArea");
  if (jsonOutputElem) {
      jsonOutputElem.value = JSON.stringify(story_data, null, 2);
  }
}

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

  document.getElementById("tableBody").appendChild(newRow);

  story_data.push({id: storyNextId, Summary: '', Rationale: '', Story: ''});
  storyNextId++;
  updateJSONDisplay();
});

document.getElementById("tableBody").addEventListener('input', function (e) {
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

document.getElementById("tableBody").addEventListener('click', function (e) {
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

