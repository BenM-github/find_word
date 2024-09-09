#! /bin/bash

# TODO check at start if fzf is accessable
# TODO unknown word lenth
# TODO reset
# TODO pattern
# TODO possible letters (that dont have to be in the word | but the word can not contain different letters)
# TODO adding not listed words: gries
# TODO download ngerman (maybe different languages) to run the script without access to it


filePath='/usr/share/dict/ngerman'


# === var's ===
total_foundset=()
partial_foundset=()
total_foundset_size=0
partial_foundset_size=0

word_size=0
included_letters=()
not_included_letters=()


# === sub functions ===
print_infos () {
  echo "Info's:"
  
  if [[ $word_size -gt 0 ]]; then 
    echo -e "- Word size: ${word_size}"
  else echo -e "- No word size set!"; fi

  echo -e "- Included letters: ${included_letters[@]} (${#included_letters[@]})"
  echo -e "- Not included letter: ${not_included_letters[@]} (${#not_included_letters[@]})"
  echo -e "- Foundset size: ${partial_foundset_size}/${total_foundset_size}"
}

# === process info's ===
sort_size () {
  if [[ $word_size -gt 0 ]]; then
    tmp_arr=()
    for i in ${partial_foundset[@]}; do
      if [[ ${#i} == $word_size ]]; then
        tmp_arr+=("${i}")
      fi
    done
    partial_foundset=(${tmp_arr[@]})
    partial_foundset_size=${#partial_foundset[@]}
  fi
}

sort_included () {
  if [[ ${#included_letters[@]} -gt 0 ]]; then
    tmp_arr=()
    for string in ${partial_foundset[@]}; do
      for letter in ${included_letters[@]}; do
        # jump to next word if it does not contain this letter
        if [[ ! "${string[*]}" == *$letter* ]]; then continue 2; fi
      done
      tmp_arr+=("${string}")
    done
    partial_foundset=(${tmp_arr[@]})
    partial_foundset_size=${#partial_foundset[@]}
  fi
}

sort_not_included () {
  if [[ ${#not_included_letters[@]} -gt 0 ]]; then
    tmp_arr=()
    for string in ${partial_foundset[@]}; do
      for letter in ${not_included_letters[@]}; do
        # jump to next word if it contains this letter
        if [[ "${string[*]}" == *"$letter"* ]]; then continue 2; fi
      done
      tmp_arr+=("${string}")
    done
    partial_foundset=(${tmp_arr[@]});
    partial_foundset_size=${#partial_foundset[@]};
  fi
}

sort_all () {
  partial_foundset=(${total_foundset[@]}) && 
    sort_size && 
    sort_included && 
    sort_not_included
} 


# === main ===
main () {
  # init foundset
  readarray -t total_foundset < $filePath;
  total_foundset_size=${#total_foundset[@]};
  
  # convert all strings to uppercase
  tmp_arr=()
  for i in ${total_foundset[@]}; do tmp_arr+=("${i^^}"); done
  total_foundset=(${tmp_arr[@]}); partial_foundset=(${tmp_arr[@]});

  # user options
  while true; do
    print_infos;

    # --- options ---
    options=("print" "word size" "pattern" "included letter" "not included letter" "reset" "exit")
    input=$(printf "%s\n" "${options[@]}" | fzf --cycle --header="Input" --height=~100% --info=inline --border --margin=1 --padding=1 --layout=reverse) 
    echo -e "\nInput: ${input}"

    # --- input ---
    case $input in
      "exit")
        exit 0
        ;;

      "word size")
        read -p "Set word size: " word_size
        sort_all
        ;;

      "included letter")
        read -e -p "Input: " -i "${included_letters[*]}" letters
        letters=${letters^^}; # convert to uppercase
        
        tmp_arr=()
        for i in `echo $letters | fold -w1`; do
          if [[ ! "${not_included_letters[*]}" =~ $i ]]; then
            tmp_arr+=("${i}")
          fi
        done
        included_letters=($(printf "%s\n" ${tmp_arr[@]} | sort)) && sort_included
        ;;

      "not included letter")
        read -e -p "Input: " -i "${not_included_letters[*]}" letters
        letters=${letters^^} # convert to uppercase
        
        tmp_arr=()
        for i in `echo $letters | fold -w1`; do
          if [[ ! "${included_letters[*]}" =~ $i ]]; then
            tmp_arr+=("${i}")
          fi
        done
        not_included_letters=($(printf "%s\n" ${tmp_arr[@]} | sort )) && sort_not_included
        ;;

      "print")
        if [[ ${#partial_foundset[@]} -gt 0 ]]; then
          printf "%s\n" "${partial_foundset[@]}" | fzf --cycle --header="Foundset" --height=~100% --info=inline --border --margin=1 --padding=1 --layout=reverse
        else
          echo -e "No words found yet. Change infos!"
        fi
        ;;

      "pattern")
        echo "comming soon"
        ;;

      "reset")
        echo "comming soon"
        ;;

      *)
        echo "Error: this option is not given!"
        ;;
    esac

    # --- seperator ---
    echo "================"
  done 
}

main
