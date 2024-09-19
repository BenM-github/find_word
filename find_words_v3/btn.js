
function submit (e) {
    console.log('submit')

    e.preventDefault()

        if ( ! isListLoaded ) {
            console.log(`Error: Data is not loaded yet!`)
            return
        }

        getInput()
        filterInput()
        displaySuggestions()

}


function reset () {
    console.log('reset');
    
}

function reload () {
    console.log('reload');
    
}

function addUsed () {
    console.log('add');

}


// --- add word used ---
function addWord_used () {
    console.log(`Start Function: addWord_used()`)
}
        
// --- set letter pos used ---
function setLetterPos_used (idWord, idLetter) {
    console.log(`Start Function: setLetterPos_used(${idWord}, ${idLetter})
        Used edit: `)
}
            
// --- edit word used ---
function editWord_used (id) {
    console.log(`Start Function: editWord_used(${id})
        Used edit: `)
}
                
// --- delete word used ---
function deleteWord_used (id) {
    console.log(`Start Function: deleteWord_used(${id})
        Used deleted: `)
}  


// === btn ===
// --- submit ---
// const submit_btn = document.getElementById('submit_btn')
// submit_btn.addEventListener('click', (e) => {
//     e.preventDefault()

//     if ( ! isListLoaded ) {
//         console.log(`Error: Data is not loaded yet!`)
//         return
//     }

//     getInput()
//     filterInput()
//     displaySuggestions()
// })

// --- reset ---
// const reset_btn = document.getElementById('reset_btn')
// reset_btn.addEventListener('click', () => {
//     resetSearch()
// })

// --- reload ---
// const reload_btn = document.getElementById('reload_btn')
// reload_btn.addEventListener('click', () => {
//     displaySuggestions()
// })

// --- add ---
// const add_btn = document.getElementById('add_btn')
// add_btn.addEventListener('click', () => {
//     addWord_used()
// })