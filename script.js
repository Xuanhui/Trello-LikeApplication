var cardNumber=0; var columnNumber=0; var selectCard=false;
function createNode(element) {
    return document.createElement(element);
}
function createNodeWithClass(element,nameForClass){
    let newElement=document.createElement(element);
    newElement.className=nameForClass;
    return newElement;
}
function append(parent, el) {
  return parent.appendChild(el);
}

var tablebody=document.getElementById("cardList").getElementsByTagName('tr')[0];
 const urlForColumn = 'http://localhost:3000/columns';
 fetch(urlForColumn)
.then((resp) => resp.json())
.then(function(data) {
    console.log(data.length);
    columnNumber=data.length;
  let columns = data;
  return columns.map(function(column) {
    let td= createNode('td');
    let div=document.createElement('div');
    div.setAttribute('class','card');
    div.id='column'+column.id;
    div.style='width: 18rem;'
    let divForColumn=document.createElement('div');
    divForColumn.className='card-header';
    divForColumn.innerHTML=column.title;

     
       append(div,divForColumn);
       append(td,div);
       append(tablebody,td);
  })
})
.catch(function(error) {
  console.log(error);
});    
 const urlForCards='http://localhost:3000/cards';
fetch(urlForCards)
.then((resp) => resp.json())
.then(function(data) {
  let cards = data;
  cardNumber=data.length;
  return cards.map(function(card) {
let specificColumn=document.getElementById('column'+card.columnId);
let ul=createNodeWithClass('ul','list-group list-group-flush');
let li=createNodeWithClass('li','list-group-item');
//let cardDiv=createNodeWithClass('div','card');
let cardDiv=document.createElement('div');
cardDiv.className='card';
cardDiv.id=card.id;
let cardHeaderDiv=document.createElement('div');
cardHeaderDiv.className='card-header';
cardHeaderDiv.id="heading"+card.id;
let h5=createNodeWithClass('h5','mb-0');
let button=document.createElement('button');
button.id='cardTitle'+card.id;
button.className='btn btn-link collapsed';button.setAttribute('data-toggle','collapse');
button.setAttribute('data-target','#collapse'+card.id);
button.setAttribute('aria-expanded','false');
button.setAttribute('aria-controls','collapse'+card.id);
button.innerHTML=card.title;
let divForDes=document.createElement('div');
divForDes.className='collapse';
divForDes.id='collapse'+card.id;
divForDes.setAttribute('aria-labelledby','heading'+card.id);
divForDes.setAttribute('data-parent','#accordion');
let cardBody=document.createElement('div');
cardBody.className='card-body';
cardBody.id='card-body'+card.id;
cardBody.innerHTML=card.description;
 let linkDiv=document.createElement('div'); 
 linkDiv.innerHTML = `<a onClick="onEdit(this)">Edit</a>
 <a onClick="onDelete(this)">Delete</a>`;
append(h5,button);
append(cardHeaderDiv,h5);
append(divForDes,cardBody);
append(cardDiv,cardHeaderDiv);
append(cardDiv,divForDes);
append(cardDiv,linkDiv);
append(li,cardDiv);
append(ul,li);
append(specificColumn,ul);

  })
})
.catch(function(error) {
  console.log(error);
});     

function readFormData() {
    var formData = {};
    if(selectCard==true){
        formData["id"]=document.getElementById("id").value;  
    }else{formData["id"]=(cardNumber+1).toString();}
        formData["title"] = document.getElementById("title").value;
    formData["description"] = document.getElementById("description").value;
    formData["columnId"] = document.getElementById("columnId").value;
    return formData;
}
function validate() {
    
    isTitleValid = true; isColumnIdValid=true;
    if (document.getElementById("title").value == "") {
        isTitleValid = false;
        document.getElementById("titleValidationError").classList.remove("hide");
    } else {
        isTitleValid = true;
        if (!document.getElementById("titleValidationError").classList.contains("hide"))
            document.getElementById("titleValidationError").classList.add("hide");
    }
    if (document.getElementById("columnId").value == "") {
        isColumnIdValid = false;
        document.getElementById("columnIdValidationError").classList.remove("hide");
    } else {
        isColumnIdValid = true;
        if (!document.getElementById("columnIdValidationError").classList.contains("hide"))
            document.getElementById("columnIdValidationError").classList.add("hide");
    }
    return isTitleValid&&isColumnIdValid;
}
function resetForm() {
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("columnId").value = "";
   window.location.reload(true);
    selectCard = false;
}

 function onFormSubmit() {
    if (validate()) {
        var formData = readFormData();
        if (selectCard == false)
            {insertNewRecord(urlForCards,formData)
            /*  .then(data=>console.log(data))
            .catch(error=>console.error(error)); */ }
        else{          
            updateRecord(formData);}
            resetForm();
  
    }
} 
 function insertNewRecord(url,data) {
    return fetch(url, {
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, same-origin, *omit
        method: 'POST', // 'GET', 'PUT', 'DELETE', etc.
        body: JSON.stringify(data), // Coordinate the body type with 'Content-Type'
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        mode: 'cors', // no-cors, cors, *same-origin
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // *client, no-referrer
      })
      /*  .then(response => response.json() ) */
  
} 
function onEdit(td) {
    let selectedcard = td.parentElement.parentElement;
    console.log(td.parentElement.parentElement)
   let column = td.parentElement.parentElement.parentElement.parentElement.parentElement;
   console.log(column);
   selectCard=true;

  
    console.log(selectCard);
   let title=document.getElementById('cardTitle'+selectedcard.id);
   let description=document.getElementById('card-body'+selectedcard.id);
   
    document.getElementById("title").value = title.innerHTML;
    document.getElementById("description").value = description.innerHTML;
   
   document.getElementById("id").value=selectedcard.id;
    document.getElementById("columnId").value =column.id.substring(6,7); 
  
}
function updateRecord(data){
    console.log('hh');
  var id=data["id"];
  console.log(id);
 
    return fetch(`http://localhost:3000/cards/${id}`, {
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, same-origin, *omit
        method: 'PUT', // 'GET', 'PUT', 'DELETE', etc.
        body: JSON.stringify(data), // Coordinate the body type with 'Content-Type'
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        mode: 'cors', // no-cors, cors, *same-origin
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // *client, no-referrer
      })
      .then(response => response.json())   
}

function onDelete(td) {
    if (confirm('Are you sure to delete this card?')) {
        let card = td.parentElement.parentElement;
      
        remove(card.id);
         resetForm();
        
    }
}
function remove(id){
    return fetch(`http://localhost:3000/cards/${id}`, {method: 'DELETE'})
    .then(res => res.json())
    .then(res => {
      console.log('Deleted:', res.message)
      return res
    })
    .catch(err => console.error(err))
}