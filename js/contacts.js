document.addEventListener('DOMContentLoaded', function(){
  var mainRegion = document.getElementById("main-region");
  var listBody = document.getElementsByTagName("tbody")[0];
  var contactTemplate = document.getElementById("contact-list-item");
  var textArea = document.getElementsByClassName("textarea")[0];
  var contacts = [
      { id: 1, firstName: "Alice", lastName: "Arten",
        phoneNumber: "(415) 555-0184" },
      { id:2, firstName: "Bob", lastName: "Brigham",
        phoneNumber: "(415) 555-0163" },
      { id:3, firstName: "Charlie", lastName: "Campbell",
        phoneNumber: "(415) 555-0129" }
    ];
  var events = {
    "click .js-delete": function deleteClicked(e){
      var item  = findItemIndex(this, contacts);
      contacts = contacts.slice(0, item).concat(contacts.slice(item+1));
      listBody.innerHTML = "";
      addContactsToDom(contacts, contactTemplate, listBody, events);
    },
    "click .js-import": function importClicked(e){
      var importArray = textArea.value.split(" ");
      for(var i=0; i<importArray.length; i+=4){
        var item = {};
        item.firstName = importArray[i];
        item.lastName = importArray[i+1];
        item.phoneNumber = importArray[i+2] + " " + importArray[i+3];
        contacts.push(item);
      }
      listBody.innerHTML = "";
      addContactsToDom(contacts, contactTemplate, listBody, events);
    },
    "click .js-export": function exportClicked(e){
      var collection = this;
      var exportString = ""
      for(var i=0; i<collection.length; i++){
        var item = collection[i];
        var entry = item.firstName + " " + item.lastName + " " + item.phoneNumber;
        exportString += entry;
      };
      textArea.textContent = exportString;
    },
    "click .js-clear": function clearClicked(e){
      textArea.textContent = "";
    }
  };

  bindListeners(mainRegion, events, contacts, true);
  addContactsToDom(contacts, contactTemplate, listBody, events);
});
