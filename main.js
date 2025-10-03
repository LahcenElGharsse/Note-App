let form= document.querySelector(".form");
let overlay= document.querySelector(".overlay");
let showformBtn=document.querySelector("#showFormBtn");

//*//*<------------ Function : show form------------->

function showForm(){
  showformBtn.addEventListener("click",()=>{
  overlay.classList.add("showOverlay");
  form.style.bottom="0%";
});
}
showForm();

//*<------------ Function : hideform------------->

function hideForm(){
   overlay.classList.remove("showOverlay")
   form.style.bottom="-100%"
}
overlay.addEventListener('click',()=>{hideForm();})

//*<------------ Function : genarate Id ------------->

function generateId(len = 10) {
  const dataset = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < len; i++) {
    id += dataset[Math.floor(Math.random() * dataset.length)];
  }
  return id; 
}    

//*<------------Add note------------->
let noteContainer=document.querySelector(".notes-container");
let addNoteBtn=document.querySelector("#addNoteBtn")
let data=[];
let textarea=document.querySelector("textarea") 

//^ function : Verify text and create obj info note
function CreatObjInfoNote(text){
  if(!text.trim()){
    return;
  }
  return {
    note: text,
    status: "pending",
    dateCreation: new Date().toISOString().slice(0, 19).replace("T", " "),
    id: generateId()
  }
};
//^ function : Create note / add to DOM / modify number of done, pending and all notes
function AddNewNote(data){
  let allNotes = document.querySelector(".btn-gray > span:first-child");
  let doneNotes=document.querySelector(".btn-green > span:first-child");
  let pandingNotes=document.querySelector(".btn-yellow > span:first-child");

  //& Update the number of done, pending and all notes

  allNotes.textContent=data.length;
  doneNotes.textContent=data.filter(note=>note.status=="done").length;
  pandingNotes.textContent=data.filter(note=>note.status=="pending").length;
 
  //&  add each note to the DOM

  noteContainer.innerHTML=""
  data.forEach(note=>{
   let htmlNote=`
       <div class="note ${note.status == "pending" ? "note-pending" : "note-done" }" id="${note.id}">
          <p>${note.note}</p>
          <button onclick="ChangeStatu(this)"></button>
          <span>${note.dateCreation}</span>
          <bitton class="btn-delete" onclick="deleteNote(this)"><i class="bi bi-trash"></i></button>
       </div>`;
    noteContainer.innerHTML+=htmlNote;
  });
};
//^ event : Add note to the DOM and update counters 
addNoteBtn.addEventListener('click',function (){
 
  let text=textarea.value;
  let newobjnote=CreatObjInfoNote(text);
  if(!newobjnote){
    return ;
  }
  data.push(newobjnote)
  localStorage.setItem("my_notes", JSON.stringify(data));
  AddNewNote(data);
  textarea.value="";
  hideForm();
 
})
//*<------------ event : Change Note statu and  update DOM and update counters  ------------->
//^function : change statu 
function ChangeStatu(note){
  let noteId=note.parentElement.id;
  console.log(noteId)
  data=data.map(el=>{
    if(el.id==noteId){
      if(el.status=="pending"){
        return {...el,status:"done"}
      }
       return {...el,status:"pending"}
    }
    return {...el}
  })
 
localStorage.setItem("my_notes", JSON.stringify(data));
  AddNewNote(data);
  
};



//*<------------ event : search   ------------->
let search_inp=document.querySelector(".search_input")
search_inp.addEventListener("input",()=>{
    let input_value=search_inp.value;
    let result_search= data.filter(el=>{
        let regex=new RegExp(input_value,"i")
        return regex.test(el.note)
    })
    AddNewNote(result_search)
})

//*<------------ Function : restore data   ------------->
function restoreData() {
  data = JSON.parse(localStorage.getItem("my_notes"));
  AddNewNote(data);
}
restoreData();

//*<------------ Function :  supprimer  note    ------------->
function deleteNote(deleteBtn) {
  if(confirm("Are you sure you want to delete this note?")){
    let note_id=deleteBtn.parentElement.id;
    data = data.filter((note) => note.id !== note_id);
    localStorage.setItem("my_notes", JSON.stringify(data));
    AddNewNote(data);
  }
  
}











  