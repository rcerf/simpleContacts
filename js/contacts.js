document.addEventListener('DOMContentLoaded', function(){
  var listBody = document.getElementsByTagName("tbody")[0];
  var contactTemplate = document.getElementById("contact-list-item");
  var contacts = [
      { id: 1, firstName: "Alice", lastName: "Arten",
        phoneNumber: "(415) 555-0184" },
      { id:2, firstName: "Bob", lastName: "Brigham",
        phoneNumber: "(415) 555-0163" },
      { id:3, firstName: "Charlie", lastName: "Campbell",
        phoneNumber: "(415) 555-0129" }
    ];

  var interpolateTemplate = function(model, template){
    var newNode = template.cloneNode(true);
    var content = newNode.text.trim();
    var interpolatingRegEx = /<%=([\s\S]+?)%>/g;

    var interpolatedString = content.replace(interpolatingRegEx, function(match, variable, offset){
      variable = variable.trim();
      var interp= model[variable];
      return interp;
    });
    return interpolatedString;
  }

  for(var i=0; i<contacts.length; i++){
    var contact = contacts[i];
    var interpolatedString = interpolateTemplate(contact, contactTemplate);
    listBody.innerHTML = listBody.innerHTML + " " + interpolatedString;
  }

});
