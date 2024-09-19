// === v2 ===

window.addEventListener('load', () => {
    // input
    const word_size_input = document.getElementById('word_size')
    const possible_letters_input = document.getElementById('possible_letters')
    const included_letters_input = document.getElementById('included_letters')
    const not_included_letters_input = document.getElementById('not_included_letters')
    const number_of_displayed_input = document.getElementById('number_of_displayed')

    // output
    const used_field = document.getElementById('used_text')
    const suggestion_field = document.getElementById('suggestion_text')

    // === settings ===
    let total_foundset = [], partial_foundset = [], used_foundset = []
    let number_of_displayed = number_of_displayed_input.value
    let word_size
    let possible_letters = [], included_letters = [], not_included_letters = []
    
    // === get list ===
    fetch('../ngerman')
        .then((rawData) => rawData.text())
        .then((data) => (total_foundset = data.split("\n")))
        // .then(total_foundset.forEach((word) => {
        //     word.toUpperCase()
        // }))
        .then(create_suggestion())

    // === display suggestion list === 
    var suggestion_title_field = document.getElementById('suggestion_title')
    var suggestion_title = "Suggestion(s)"
    function update_suggestion_display () {
        // set title
        // console.log(partial_foundset.length)
        suggestion_title_field.innerHTML = `${suggestion_title}: ${partial_foundset.length} / ${total_foundset.length}`

        // clear suggestions display
        suggestion_field.innerHTML = ''
        
        // display suggestions
        number_of_displayed = parseInt(number_of_displayed_input.innerHTML)
        if (partial_foundset.length < number_of_displayed) {
            number_of_displayed = partial_foundset.length
        }
        for (let i = 0; i < number_of_displayed; i++) {
            suggestion_field.innerHTML+=`<div class="word unselectable" id"suggestion_${i}">${partial_foundset[i]}</div>`
        }

        // make words focusable
        const suggested_words = Array.from(document.getElementsByClassName("word"))
        suggested_words.forEach((word)=>{
            word.addEventListener("click", () => {
                word.focus() // is not working currently

                used_foundset.push(word.innerHTML)
                update_used()
            })
        })
    }

    // === display used list ===
    var used_title_field = document.getElementById('used_title')
    var used_title = 'Used'
    function update_used () {
        // set title
        used_title_field.innerHTML = `${used_title}: ${used_foundset.length}`

        // clear used word display
        used_field.innerHTML = ''

        // setup used word display
        let index = 0
        used_foundset.forEach((word)=>{
            used_field.innerHTML+=`<div class="word unselectable" id="used_${index}">${word}</div>`
            index++
        })
    }

    // === submit button ===
    const submit_btn = document.getElementById('submit_btn')
    submit_btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        create_suggestion()
        update_suggestion_display()
    })
    
    // === reload button ===
    const reload_btn = document.getElementById('reload_btn')
    reload_btn.addEventListener('click', () => {
        number_of_displayed = parseInt(number_of_displayed_input.value)
        update_suggestion_display()
    })

    // === reset button ===
    const reset_btn = document.getElementById('reset_btn')
    reset_btn.addEventListener('click', () => {
        // clear inputs
        word_size_input.value = 0
        possible_letters_input.value = ''
        included_letters_input.value = ''
        not_included_letters_input.value = ''

        // clear foundsets
        used_foundset = []
        partial_foundset = []
        
        // clear output and restart
        update_used()
        // create_suggestion()
    })


    function filter_word_size () {
        // console.log('Word Size: ' + word_size)

        let tmp_arr = new Array
        for (let i = 0, n = partial_foundset.length; i < n; i++) {
            
            if (partial_foundset[i].length == word_size) { tmp_arr.push(partial_foundset[i]) }
        
        }
        partial_foundset = tmp_arr
    }

    function filter_possible_letters () {
        console.log('Possible Letter(s): ' + possible_letters + ` (${possible_letters.length})`)

        let tmp_arr = new Array
        word_loop: for (let i = 0, n = partial_foundset.length; i < n; i++) {
            tmp_letter_list = new Array(); tmp_letter_list = possible_letters
            tmp_string = new Array(); tmp_string = partial_foundset[i]

            letter_loop: for (let j = 0, n = tmp_letter_list.length; j < n; j++) {
                if ( tmp_string.length == 0 ) {
                    tmp_arr.push(partial_foundset[i])
                    console.log(`Add: ${partial_foundset[i]} (${itterations})\nletter: ${tmp_letter_list}; string: ${tmp_string}`)
                    continue word_loop
                }
                else if ( tmp_letter_list[j] == tmp_string[0] ) {
                    tmp_letter_list.splice(j, 1)
                    tmp_string.shift()
                    j = 0
                }
            }
        }
        partial_foundset = tmp_arr
    }

    function filter_included_letters () {
        // console.log('Included Letter(s): ' + included_letters + ` (${included_letters.length})`)
        
        let tmp_arr = new Array
        word_loop: for (let i = 0, n = partial_foundset.length; i < n; i++) {
            letter_loop: for (let j = 0, n = included_letters.length; j < n; j++) {

                if ( partial_foundset[i].includes(included_letters[j]) ) {
                    continue letter_loop
                }
                else {
                    continue word_loop
                }
            }
            tmp_arr.push(partial_foundset[i])
        }
        partial_foundset = tmp_arr
    }

    function filter_not_included_letters () {
        // console.log('Not Included Letter(s): ' + not_included_letters + ` (${not_included_letters.length})`)

        let tmp_arr = new Array
        word_loop: for (let i = 0, n = partial_foundset.length; i < n; i++) {
            letter_loop: for (let j = 0, n = not_included_letters.length; j < n; j++) {

                if ( partial_foundset[i].includes(not_included_letters[j]) ) {
                    continue word_loop
                }
            }
            tmp_arr.push(partial_foundset[i])
        }
        partial_foundset = tmp_arr
    }


    // create partial_foundset
    function create_suggestion () {
        // reset foundset
        partial_foundset = []
        total_foundset.forEach((word) => {
            partial_foundset.push(word.toUpperCase())
        })
        
        // word size is changing to greater than 0
        word_size = parseInt(word_size_input.value)
        if ( word_size ) {
            filter_word_size()
        }
        
        // if possible letters changed
        possible_letters = possible_letters_input.value.toUpperCase()
        if ( possible_letters.length ) {
            possible_letters_input.value = possible_letters // pass it back so it is uppercase
            filter_possible_letters()
        }
        
        // if included letters changed
        included_letters = included_letters_input.value.toUpperCase()
        if ( included_letters.length ) {
            included_letters_input.value = included_letters // pass it back so it is uppercase
            filter_included_letters()
        }

        // if not included letters changed and is longer 0
        not_included_letters = not_included_letters_input.value.toUpperCase()
        if ( not_included_letters.length ) {
            not_included_letters_input.value = not_included_letters // pass it back so it is uppercase
            filter_not_included_letters()
        }
    }

})

    

