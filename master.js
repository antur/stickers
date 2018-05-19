var stickies;
window.onload = init;

function init() {
  stickies = document.getElementById("simpleList");
  bindHandlers();
  renderItems();
}

function bindHandlers() {
  document.getElementById("add_button").addEventListener("click", createSticky);
  document.getElementById("clear_button").addEventListener("click", clearStorage);
}

function renderItems(arr) {
    arr = arr || getStickies();
    stickies.innerHTML = "";
    arr.forEach(addStickyToDOM);
}

function getStickies() {
  var json = localStorage.getItem("stickiesArray") || "[]";
  return JSON.parse(json);
}

function addStickyToDOM(item) {
  var sticky = document.createElement("li");
  var span = document.createElement("div");
  var butClose = document.createElement("input");

  var setColor = document.createElement("select");
  setColor.setAttribute('class', 'note_color')
  setColor.innerHTML = getOptionsHtml(item.color);
  sticky.appendChild(setColor);

  setColor.addEventListener('change', function changeEventHandler(setColor){
    if(!setColor.target.value)
      alert('Please Select One');
    else
      updateStickies(arr => {
        let zametochka = arr.find(z => z.key == item.key);
        zametochka.color = setColor.target.value;
        return arr;
      });
  });

  sticky.setAttribute("id", item.key);
  sticky.setAttribute("data-id", sticky.id);
  sticky.setAttribute("class", "sticky_item");
  span.setAttribute("class", "sticky");
  butClose.setAttribute("type", "button");
  butClose.setAttribute("class", "buttonClose");
  butClose.setAttribute("value", "X");
  span.innerHTML = item.value;
  sticky.appendChild(butClose);
  sticky.appendChild(span);
  stickies.appendChild(sticky);

  butClose.addEventListener("click", deleteSticky.bind(this, item.key));
  span.addEventListener('click', selectSticky.bind(this,item));

  sticky.style.backgroundColor = item.color;

}

// function getOptionsHtml(selectedColor) {
//   return '<option ' + (selectedColor == "grey" ? "selected" : "") + ' value="grey">grey</option>' +
//     '<option ' + (selectedColor == "yellow" ? "selected" : "") + ' value="yellow">yellow</option>' +
//     '<option ' + (selectedColor == "green" ? "selected" : "") + ' value="green">green</option>' +
//     '<option ' + (selectedColor == "red" ? "selected" : "") + ' value="red">red</option>' +
//     '<option ' + (selectedColor == "orange" ? "selected" : "") + ' value="orange">orange</option>';
// }

var colors = ["white","grey", "yellow", "green", "red", "orange"];
function getOptionsHtml(selectedColor) {
  var options = colors.map(color =>
    `<option ${selectedColor == color ? "selected" : ""} value="${color}"> ${color} </option>`);
  return options.join("");
};

function createSticky() {
  updateStickies(arr => arr.concat({
    key: "sticky_" + Date.now(),
    value: document.getElementById("note_text").value,

  }));
}

function deleteSticky(key) {
  updateStickies((arr => arr.filter((item) => key != item.key)))
}

function updateStickies(updateFunction) {
  var newArray = updateFunction(getStickies());
  localStorage.setItem("stickiesArray", JSON.stringify(newArray));
  renderItems();
}

function clearStorage() {
  updateStickies(arr => []);
}

var myGlobalEditor;
ClassicEditor.create(document.querySelector( '#editor' ))
.then(function(editor){
  myGlobalEditor = editor;
});
function selectSticky(item){
  myGlobalEditor.setData(item.value);
};

// Simple list
Sortable.create(simpleList, {
  animation: 150,
  store: {

    get: function(){
      return getStickies().map( (item) => item.key );
      },


  		set: function (sortable) {
        var o = sortable.toArray();
        updateStickies( p => o.map( k => p.find( i => i.key == k ) ) );

  			// var order = sortable.toArray();
        // updateStickies( prevStickies =>
        //   order.map( key =>
        //     prevStickies.find( item => item.key == key ) ) );
  		}
  }
});

// Search list

var filterInput = document.querySelector('#search');

filterInput.addEventListener('keyup', onFilterInputKeyUp);
function onFilterInputKeyUp(evt) {
    let valueF = evt.target.value.trim();
    if (valueF.length == 0) {
    renderItems();
    return;
    }
    let allStickies = getStickies();
    function stickyValueEquals(sticky){

      return isMatching(sticky.value, valueF);
    }

    let filteredStick = allStickies.filter(stickyValueEquals);


  renderItems(filteredStick);
}

function isMatching(full, chunk) {
    var lfull = full.toLowerCase();
    var lchunk = chunk.toLowerCase();

    return lfull.indexOf(lchunk) !== -1;
}
