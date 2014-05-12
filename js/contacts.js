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
    currentContact: null,

    $region: document.getElementById("main-region"),
    $list: document.getElementsByTagName("tbody")[0],
    $form: document.getElementsByTagName("textarea")[0],
    $contactTemplate: document.getElementById("contact-list-item"),
    $button_import: document.getElementsByClassName("js-import"),
    $button_discard: document.getElementsByClassName("js-discard"),

    events:  {
      "click .js-delete": function deleteClicked(e){
        Contact.listDelete(this);
      },
      "click .js-edit": function(e){
        Contact.listEdit(this);
      },
      "click .js-import": function importClicked(e){
        Contact.listAdd();
      },
      "click .js-export": function exportClicked(e){
        Contact.listExport(this);
      },
      "click .js-clear": function clearClicked(e){
        Contact.formClear();
      },
      "click .js-discard": function discarded(e){
        if(!Contact.currentContact){
          Contact.formClear();
        }
        Contact.listDelete(Contact.currentContact);
        Contact.currentContact = null;
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

    listAdd: function(entry){
      var importArray = Contact.$form.value.split(" ");
        for(var i=0; i<importArray.length; i+=4){
          var item = {};
          item.firstName = importArray[i];
          item.lastName = importArray[i+1];
          item.phoneNumber = importArray[i+2] + " " + importArray[i+3];
          contacts.push(item);
        }
        Contact.$list.innerHTML = "";
        helpers.addContactsToDom(contacts, Contact.$contactTemplate, Contact.$list, Contact.events);
    },
    listEdit: function(entry){
      var exportString = entry.firstName + " " + entry.lastName + " " + entry.phoneNumber;
      Contact.$form.value = "";
      Contact.$form.value = exportString;
      Contact.listDelete(entry);
    },
    listDelete: function(entry){
      var item  = helpers.findItemIndex(entry, contacts);
      contacts = contacts.slice(0, item).concat(contacts.slice(item+1));
      Contact.$list.innerHTML = "";
      helpers.addContactsToDom(contacts, Contact.$contactTemplate, Contact.$list, Contact.events);
    },
    listExport: function(collection){
      var exportString = "";
      for(var i=0; i<collection.length; i++){
        var item = collection[i];
        var entry = item.firstName + " " + item.lastName + " " + item.phoneNumber + ",\n";
        exportString += entry;
      };
      textArea.value = exportString;
    },
    formClear: function(){
      Contact.$form.value = "";
    }
  };

  Contact.init();
});
