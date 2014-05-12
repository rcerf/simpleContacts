document.addEventListener('DOMContentLoaded', function(){
  var contacts = [
      { id: 1, firstName: "Alice", lastName: "Arten",
        phoneNumber: "(415) 555-0184" },
      { id:2, firstName: "Bob", lastName: "Brigham",
        phoneNumber: "(415) 555-0163" },
      { id:3, firstName: "Charlie", lastName: "Campbell",
        phoneNumber: "(415) 555-0129" }
    ];
  var Contact = {
    id: window.localStorage.getItem("Contacts:index"),

    $region: document.getElementById("main-region"),
    $list: document.getElementsByTagName("tbody")[0],
    $form: document.getElementsByClassName("textarea")[0],
    $contactTemplate: document.getElementById("contact-list-item"),
    $button_import: document.getElementsByClassName("js-import"),
    $button_discard: document.getElementsByClassName("js-discard"),

    events:  {
      "click .js-delete": function deleteClicked(e){
        var item  = helpers.findItemIndex(this, contacts);
        contacts = contacts.slice(0, item).concat(contacts.slice(item+1));
        Contact.$list.innerHTML = "";
        helpers.addContactsToDom(contacts, Contact.$contactTemplate, Contact.$list, Contact.events);
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
        helpers.addContactsToDom(contacts, Contact.$contactTemplate, Contact.$list, Contact.events);
      },
      "click .js-export": function exportClicked(e){
        var collection = this;
        var exportString = ""
        for(var i=0; i<collection.length; i++){
          var item = collection[i];
          var entry = item.firstName + " " + item.lastName + " " + item.phoneNumber + ",\n";
          exportString += entry;
        };
        textArea.value = exportString;
      },
      "click .js-clear": function clearClicked(e){
        textArea.textContent = "";
      }
    },

    init: function(){
      if(!Contact.index){
        window.localStorage.setItem("Contacts:index", Contact.index = 1);
      }
      // ititialize form buttons
      helpers.bindListeners(this.$region, this.events, contacts, true);
      // initialize list
      helpers.addContactsToDom(contacts, this.$contactTemplate, this.$list, this.events);
    },

    storeAdd: function(entry){},
    storeEdit: function(entry){},
    storeRemove: function(entry){},

    listAdd: function(entry){},
    listEdit: function(entry){},
    listDelete: function(entry){}
  };

  Contact.init();
});
