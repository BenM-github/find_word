// === v3 ===

window.addEventListener('load', () => {

    // === class ===
    class LETTER {
        pos;
        not_pos = []
        constructor (char) {
            this.char = char
        }

        setPos (pos) {
            this.not_pos = []
            this.pos = pos
        }

        setNotPos (not_pos) {
            if (this.pos === undefined)
                this.not_pos.push(not_pos)
        }
    }

    class WORD {
        letters = []
        newWord (letters = []) {
            letters.forEach(char => {
                this.letters.push(new LETTER(char))
            });
            this.length = letters.length
        }

        print () {
            let word = ''
            
            letters.forEach((char) => {
                word += char
            })

            return word
        }
    } 


    // === output ===
    var total_foundset = [], total_foundset_length
    var suggestion_foundset = [], suggestion_foundset_length
    const suggestion_field = document.getElementById('suggestion_text')
    var used_foundset = [], used_foundset_length
    const used_field = document.getElementById('used_text')


    // === init ===
    var isListLoaded = false
    fetch('../ngerman')
        .then((rawData) => rawData.text())
        .then((data) => (total_foundset = data.split("\n")))
        .then(setupData())

    function setupData () {        
        total_foundset.forEach((word) => { 
            // convert to uppercase so they can be compared later
            word.toUpperCase() 
            // convert them to word classes so we can store information about each letter
            // word = new WORD(word)
            word = "lorem"
            console.log('convert')
        });
        
        isListLoaded = true
    }
    
    
    // === input ===
    const word_size_input = document.getElementById('word_size')
    let word_size = parseInt(word_size_input.value)
    
    const possible_letters_input = document.getElementById('possible_letters')
    let possible_letters = []
    
    const included_letters_input = document.getElementById('included_letters')
    let included_letters = []
    
    const not_included_letters_input = document.getElementById('not_included_letters')
    let not_included_letters = []
    
    const number_of_displayed_input = document.getElementById('number_of_displayed')
    const DEFAULT_DISPLAYED = 100
    let number_of_displayed = parseInt(number_of_displayed_input.innerHTML)
    
    
    // === main functions ===
    // --- get input ---
    function getInput () {
        let tmp_word_size = parseInt(word_size_input.value)
        let tmp_possible_letters = possible_letters_input.value.toUpperCase()
        let tmp_included_letters = included_letters_input.value.toUpperCase()
        let tmp_not_included_letters = not_included_letters_input.value.toUpperCase()
        
        console.log(`Start Function: getInput()
            word_size:              ${tmp_word_size}
            possible letters:       ${tmp_possible_letters}
            included letters:       ${tmp_included_letters}
            not included letters:   ${tmp_not_included_letters}`)


            // console.log(total_foundset[0].print())
    }

    // --- filter input ---
    function filterInput () {
        console.log(`total_foundset: ${total_foundset}`)
        suggestion_foundset = total_foundset
    }

    // --- display suggestions ---
    function displaySuggestions () {
        // update display number: if found list is smaller just display thouse
        if (parseInt(number_of_displayed_input.innerHTML) < DEFAULT_DISPLAYED)
            number_of_displayed = parseInt(number_of_displayed_input.innerHTML)
        else
            number_of_displayed = DEFAULT_DISPLAYED
        if (number_of_displayed > suggestion_foundset.length) 
            number_of_displayed = suggestion_foundset.length
        
        // clear displayed list and setup again
        suggestion_field.innerHTML = ""
        for (let i = 0; i < number_of_displayed; i++) {
            suggestion_field.innerHTML += `<div class="word" word="${suggestion_foundset[i]}">${suggestion_foundset[i]}</div>`
        }

        setupEventListner_suggestions()
    }

    function setupEventListner_suggestions () {
        const suggested_words = Array.from(document.querySelectorAll("#suggestion_text .word"))

        suggested_words.forEach((word)=>{
            word.addEventListener("click", (e) => {
                used_foundset.push(word.getAttribute('word'))
                displayUsed()
            })
        })
    }
    
    function displayUsed () {
        used_field.innerHTML = ""

        // build word html

        // build list html
        for (let i = 0, n = used_foundset.length; i < n; i++) {
            used_field.innerHTML += `<div class="word" word="${used_foundset[i]}">${used_foundset[i]}</div>`
        }
    }

    function setupEventListner_used () {
        const suggested_words = Array.from(document.querySelectorAll("#used_text .word"))

        suggested_words.forEach((word)=>{
            word.addEventListener("click", (e) => {
                console.log(word.getAttribute('word'))
            })
        })
    }                  
})