var helpers = {
  interpolateTemplate: function(model, template){
    var newNode = template.cloneNode(true);
    var content = newNode.text.trim();
    var interpolatingRegEx = /<%=([\s\S]+?)%>/g;

    var interpolatedString = content.replace(interpolatingRegEx, function(match, variable, offset){
      variable = variable.trim();
      var interp= model[variable];
      return interp;
    });
    return interpolatedString;
  },
  findItemIndex: function(model, collection){
    for(var i=0; i<collection.length; i++){
      var item = collection[i];
      if(item.id === model.id){
        return i;
      }
      console.log("model not found in collection");
    }
  },
  bindListeners: function(DOMTree, events, model, singleNode){
    var latest_child = DOMTree.lastChild;
    //iterate thru events
    for(var key in events){
      var typeAndSelector = key.split(" ");
      var type = typeAndSelector[0];
      var callback = model ? events[key].bind(model) : events[key];
      var selector = typeAndSelector[1];
      var targetNodes;
      if(singleNode){
        targetNodes = DOMTree.querySelectorAll(selector);
      }else{
       //find children elements of firstChild
       targetNodes = latest_child.querySelectorAll(selector);
      }
      // iterate thru childNodes & attach eventListeners
      for(var i=0; i<targetNodes.length; i++){
        var targetNode = targetNodes[i];
        targetNode.addEventListener(type, callback)
      }
    }
  },
  addContactsToDom: function(contacts, contactTemplate, region, events){
    for(var i=0; i<contacts.length; i++){
      var contact = contacts[i];
      var interpolatedString = this.interpolateTemplate(contact, contactTemplate);
      region.insertAdjacentHTML("beforeend", interpolatedString);
      this.bindListeners(region, events, contact);
    }
    document.querySelector(".js-total").innerHTML = contacts.length;
  }
};

