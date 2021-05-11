const list_contents = document.getElementById("list_contents");
const searchBar = document.getElementById("searchBar");
const sortBox = document.getElementById("sortBox");

let useDate = (noteTime) => {
    let diff = new Date().getTime() - noteTime;
    if(diff < 60000){ //1분 이내
        return 'Last edited a few seconds ago'
    }else if ( diff < 3600000){ //1시간 이내
        return `Last edited ${Math.floor(diff/60000)} minutes ago`
    }else if ( diff < 86400000){ //1일 이내
        return `Last edited ${Math.floor(diff/3600000)} hours ago`
    } else{
        return `Last edited ${Math.floor(diff/86400000)} days ago`
    }
    // 1000ms = 1초
    // 60 000mx = 1분
    // 3600 000ms = 1시간
    // 86400 000ms = 1일
}

searchBar.addEventListener("change", (e)=>{
    listInit(e.target.value, sortBox.selectedIndex);
})

sortBox.addEventListener("change", () =>{
    listInit(searchBar.value, sortBox.selectedIndex);
})

let attachOneNote=(thisNote)=>{
    let oneNote = document.createElement('div');
    oneNote.setAttribute("class", "oneNote");
    oneNote.setAttribute("OnClick", `location.href = 'createnote.html?${thisNote.saveTime}'`)

    let title = document.createElement('h4');
    title.innerText = thisNote.title;
    let body = document.createElement('p');
    body.innerText = useDate(thisNote.saveTime);

    oneNote.appendChild(title);
    oneNote.appendChild(body);
    list_contents.appendChild(oneNote);
}

let listInit = (searchKeyword,sort) =>{
    while(list_contents.hasChildNodes()){
        list_contents.removeChild(list_contents.firstChild);
    }
    
    if(localStorage.length==0){
        list_contents.innerHTML= "<p style = 'text-align : center'>No results</p>";
    }else{
        let arr = JSON.parse(localStorage.getItem('notes'));
        let ParsedArr = arr.map((note)=>{
            return JSON.parse(note);
        })
        console.log(ParsedArr);
        ParsedArr
            .filter(note => note.title.includes(searchKeyword))
            .sort((a, b)=>{
                switch(sort){
                    case 0: {// 최신순
                        return b.saveTime - a.saveTime;
                    }case 1: { // 오래된 순
                        return a.saveTime - b.saveTime;
                    }case 2 : { // 알파벳 순
                        return a.title.localeCompare(b.title);
                    }
                }
            })
            .map((note)=>{
                attachOneNote(note);
            })
    }
}

listInit("", 0);