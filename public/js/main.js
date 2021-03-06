/**
 * Scripts for mail rate app
 */

let mailElem = document.querySelector('#mail');
let inputElements = document.querySelector('#inputElements');
let elems = {
    "sender_zip_label": {
      "type": "label",
      "for": "sender_zip",
      "value": "Sender Zip code:"
    },
    "sender_zip": {
      "type": "text",
    },
    "recipient_zip_label": {
      "type": "label",
      "for": "recipient_zip",
      "value": "Recipient Zip code:"
    },
    "recipient_zip": {
      "type": "text",
    }
}
if (mailElem.value === 'first_class_package_service') {
    createFormElementsFromJSON(Object.entries(elems), inputElements);  
}
mailElem.onchange = (e) => {
  
  if (mailElem.value === 'first_class_package_service') {
    createFormElementsFromJSON(Object.entries(elems), inputElements);  
  }
  else {
    removeElementsFromParent(Object.entries(elems), inputElements);
  }
  
};

function createFormElementsFromJSON(object, parentElem) {
  let elemsToAdd = [];
  let temp = null;
  object.forEach(values => {
    if (values[1]['type'] === 'label') {
      temp = document.createElement('label');
      temp.setAttribute('for', values[1]['for'])
      temp.innerHTML = values[1]['value'];
    }
    else {
      temp = document.createElement('input');
      temp.setAttribute('type', values[1]['type']);
      temp.setAttribute('placeholder', 'XXXXX');
      temp.setAttribute('pattern', '^([0-9]{5})$');
      temp.name = values[0];
      temp.required = true;
    }
    temp.id = values[0];
    elemsToAdd.push(temp);
  });
  addElementsFromArrayToParent(elemsToAdd, parentElem);
}

function addElementsFromArrayToParent(arrayElem, parentElem) {
  arrayElem.forEach(elem => {
    parentElem.appendChild(elem);
  })
}

function removeElementsFromParent(arrayElem, parentElem) {
  let temp = null;
  arrayElem.forEach(elem => {
    temp = document.getElementById(elem[0]);
    console.log(elem[0]);
    if (temp) {
      parentElem.removeChild(temp);
    }
  })
}