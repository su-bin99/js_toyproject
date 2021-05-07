const doneBtn = document.getElementById("doneBtn");
const rmvBtn = document.getElementById("rmvBtn");
const title = document.getElementById("noteTitle");
const text = document.getElementById("noteText");
const editTime = document.getElementById("editTime");

let NoteId = '';
let indextoModify = undefined;

let init = () => {
    temp = location.href.split("?");
    if (temp[1] != undefined) {
        NoteId = temp[1];

        let arr = JSON.parse(localStorage.getItem('notes'));
        arr = arr.map(note => JSON.parse(note));
        indextoModify = arr.findIndex(note => note.saveTime == NoteId);
        let NotetoModify = arr[indextoModify];
        let saveDate = NotetoModify.saveDate;

        editTime.innerText = `SAVED AT ${saveDate[0]}.${saveDate[1]+1}.${saveDate[2]} ${saveDate[3]} : ${saveDate[4]} `;
        title.value = NotetoModify.title;
        text.value = NotetoModify.body;
    }
}
init();

doneBtn.addEventListener("click", () => {
    if (NoteId != '') { // 수정일 경우 
        modifyNotes();
    } else { // 새 노트를 작성하는 경우
        if (text.value != '' && title.value != '') {
            saveNotes();
        } else {
            alert("제목과 내용을 모두 채우시오");
        }
    }
});

rmvBtn.addEventListener("click", () =>{
    deleteNotes();
})

const deleteNotes = () =>{
    let arr = JSON.parse(localStorage.getItem('notes'));
    arr.splice(indextoModify, 1);
    localStorage.setItem('notes', JSON.stringify(arr));
}

const modifyNotes = () => {
    let date = new Date();
    let dateArr = [date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()];

    let notes = {
        body: text.value,
        title: title.value,
        saveDate: dateArr,
        saveTime: date.getTime(),
    }

    let arr = JSON.parse(localStorage.getItem('notes'));
    arr[indextoModify] = JSON.stringify(notes);
    localStorage.setItem('notes', JSON.stringify(arr));
}

const saveNotes = () => {
    let date = new Date();
    let dateArr = [date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()];

    let notes = {
        body: text.value,
        title: title.value,
        saveDate: dateArr,
        saveTime: date.getTime(),
    }

    if (localStorage.length < 1) {
        console.log("아무것도 없는 상태")
        let arr = [JSON.stringify(notes),];
        localStorage.setItem('notes', JSON.stringify(arr));
        console.log(arr);
    } else {
        console.log("있는상태에서 추가")
        let arr = JSON.parse(localStorage.getItem('notes'));
        arr.push(JSON.stringify(notes));
        localStorage.setItem('notes', JSON.stringify(arr));
        console.log(arr);
    }
}