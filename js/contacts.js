document.addEventListener('DOMContentLoaded', function(){
  var Contact = {
    id: window.localStorage.getItem("Contacts:index"),
    defaults: [
      { firstName: "Alice", lastName: "Arten",
        phoneNumber: "(415) 555-0184" },
      { firstName: "Bob", lastName: "Brigham",
        phoneNumber: "(415) 555-0163" },
      { firstName: "Charlie", lastName: "Campbell",
        phoneNumber: "(415) 555-0129" }
    ],

    $region: document.getElementById("main-region"),
    $list: document.getElementsByTagName("tbody")[0],
    $form: document.getElementsByTagName("textarea")[0],
    $contactTemplate: document.getElementById("contact-list-item"),
    $button_import: document.getElementsByClassName("js-import"),
    $button_discard: document.getElementsByClassName("js-discard"),

    events:  {
      "click .js-delete": function deleteClicked(e){
        var count = window.localStorage.getItem("Metrics:deleteButton");
        document.querySelector(".js-deleteButton").innerHTML = count;
        window.localStorage.setItem("Metrics:deleteButton", ++count);
        Contact.listDelete(this);
      },
      "click .js-edit": function(e){
        var count = window.localStorage.getItem("Metrics:editButton");
        document.querySelector(".js-editButton").innerHTML = count;
        window.localStorage.setItem("Metrics:editButton", ++count);
        Contact.listEdit(this);
      },
      "click .js-import": function importClicked(e){
        var count = window.localStorage.getItem("Metrics:addButton");
        document.querySelector(".js-addButton").innerHTML = count;
        window.localStorage.setItem("Metrics:addButton", ++count);
        if(Contact.listAdd()){
          Contact.$form.value = "";
        }
      },
      "click .js-export": function exportClicked(e){
        var count = window.localStorage.getItem("Metrics:exportButton");
        document.querySelector(".js-exportButton").innerHTML = count;
        window.localStorage.setItem("Metrics:exportButton", ++count);
        Contact.listExport(Contact.contacts);
      },
      "click .js-clear": function clearClicked(e){
        var count = window.localStorage.getItem("Metrics:clearButton");
        document.querySelector(".js-clearButton").innerHTML = count;
        window.localStorage.setItem("Metrics:clearButton", ++count);
        Contact.formClear();
      },
      "click .js-replace": function replaceContacts(e){
        var count = window.localStorage.getItem("Metrics:importButton");
        document.querySelector(".js-importButton").innerHTML = count;
        window.localStorage.setItem("Metrics:importButton", ++count);
        if(!Contact.checkEntries(Contact.$form.value.trim().split(" "))) return;
        window.localStorage.clear();
        Contact.contacts = [];
        Contact.listAdd(this, true);
      },
      "click .js-th": function(e){
        e.preventDefault();
        var name = e.target.innerText;
        var legend = { "First Name": "firstName",
                    "Last Name": "lastName",
                    "Phone Number": "phoneNumber"};
        Contact.sortContacts(legend[name]);
        Contact.$list.innerHTML = "";
        helpers.addContactsToDom(Contact.contacts, Contact.$contactTemplate, Contact.$list, Contact.events);
      }
    },

    init: function(){
      // ititialize form buttons
      helpers.bindListeners(this.$region, this.events, null, true);

      if(!Contact.index){
        window.localStorage.setItem("Metrics:addButton", buttonCount = 1);
        window.localStorage.setItem("Metrics:importButton", buttonCount = 1);
        window.localStorage.setItem("Metrics:exportButton", buttonCount = 1);
        window.localStorage.setItem("Metrics:clearButton", buttonCount = 1);
        window.localStorage.setItem("Metrics:editButton", buttonCount = 1);
        window.localStorage.setItem("Metrics:deleteButton", buttonCount = 1);
        window.localStorage.setItem("Contacts:index", Contact.index = 1);
      }

      if(window.localStorage.length - 1){
        Contact.contacts = [];
        for(var i=0; i<window.localStorage.length; i++){
          var key = window.localStorage.key(i);
          if(/Contacts:\d+/.test(key)){
            Contact.contacts.push(JSON.parse(window.localStorage.getItem(key)));
          }
        }
        if(Contact.contacts.length){
          Contact.sortContacts("lastName");
        }
      }
      if(Contact.contacts && !Contact.contacts.length > 0){
        // no contacts in LocalStorage, save defaults and post to DOM
        Contact.addDefaults();
      }
      // initialize list
      helpers.addContactsToDom(Contact.contacts, this.$contactTemplate, this.$list, this.events);
    },

    addDefaults: function(){
      Contact.contacts = [];
      for(var i=0; i<Contact.defaults.length; i++){
        var contact = Contact.defaults[i];
        Contact.storeAdd(contact);
        Contact.contacts.push(contact);
      }
    },

    checkEntries: function(importArray){
      if(Contact.$form.value.length <= 1) return;
      if(document.querySelector(".js-wrong-format")){
        var warning = document.querySelector(".js-wrong-format");
        warning.parentNode.removeChild(warning);
      }
      if(importArray[3][3] !== "-"){
        Contact.$form.insertAdjacentHTML("afterend", "<p class='js-wrong-format'> Please correct the format of your entry before importing.</p>");
        return false;
      }
      if(document.querySelector(".js-duplicate")){
        var warning = document.querySelector(".js-duplicate");
        warning.parentNode.removeChild(warning);
      }
      return true;
    },

    checkForDuplicate: function(item){
      for(var i=0; i<Contact.contacts.length; i++){
        var contact = Contact.contacts[i];
        if(contact.firstName === item.firstName && contact.lastName === item.lastName){
          Contact.$form.insertAdjacentHTML("afterend", "<p class='js-duplicate'> Please remove duplicates from the form before importing.</p>");
          return true;
        }
      }
      return false;
    },

    sortContacts: function(parameter){
      secondParameter = parameter === "lastName" ? "firstName" : "lastName";
      Contact.contacts.sort(function(a, b){
        return a[parameter] < b[parameter] ? -1 : (a[parameter] > b[parameter] ? 1: (a[secondParameter] < b[secondParameter] ? -1 : 0));
      })
    },

    storeAdd: function(entry){
      entry.id = Contact.index;
      window.localStorage.setItem("Contacts:" + entry.id, JSON.stringify(entry));
      window.localStorage.setItem("Contacts:index", ++Contact.index);
    },

    storeRemove: function(entry){
      window.localStorage.removeItem("Contacts:"+ entry.id);
    },

    listAdd: function(entry, importButton){
      var importArray = Contact.$form.value.trim().split(" ");
      if(importArray.length === 1) return;
      if(!Contact.checkEntries(importArray))  return false;
      for(var i=0; i<importArray.length; i+=4){
        var item = {};
        var end = importArray[i+3][importArray[i+3].length-1] === "," ? importArray[i+3].slice(0, -1) : importArray[i+3];
        item.firstName = importArray[i];
        item.lastName = importArray[i+1];
        item.phoneNumber = importArray[i+2] + " " + end;
        if(!importButton){
          if(Contact.checkForDuplicate(item)) return false;
        }
        Contact.contacts.push(item);
        Contact.storeAdd(item);
      }
      Contact.$list.innerHTML = "";
      helpers.addContactsToDom(Contact.contacts, Contact.$contactTemplate, Contact.$list, Contact.events);
    },

    listEdit: function(entry){
      var exportString = entry.firstName + " " + entry.lastName + " " + entry.phoneNumber;
      Contact.$form.value = "";
      Contact.$form.value = exportString;
      Contact.listDelete(entry);
      Contact.storeRemove(entry);
    },

    listDelete: function(entry){
      var item  = helpers.findItemIndex(entry, Contact.contacts);
      Contact.storeRemove(entry);
      Contact.contacts = Contact.contacts.slice(0, item).concat(Contact.contacts.slice(item+1));
      Contact.$list.innerHTML = "";
      helpers.addContactsToDom(Contact.contacts, Contact.$contactTemplate, Contact.$list, Contact.events);
    },

    listExport: function(collection){
      var exportString = "";
      for(var i=0; i<collection.length; i++){
        var item = collection[i];
        var entry = item.firstName + " " + item.lastName + " " + item.phoneNumber + ", \n";
        exportString += entry;
      };
      Contact.$form.value = exportString;
    },

    formClear: function(){
      Contact.$form.value = "";
      if(document.querySelector(".js-wrong-format")){
        var warning = document.querySelector(".js-wrong-format");
        warning.parentNode.removeChild(warning);
      }
      if(document.querySelector(".js-duplicate")){
        var warning = document.querySelector(".js-duplicate");
        warning.parentNode.removeChild(warning);
      }
    }
  };

  Contact.init();
});
