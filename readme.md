# Advance CAT commands

## General Syntax:
`node cat.js [options] [filepaths] [key]`

option to remove big line break (`-s`)<br>
option to add line number to non empty lines (`-b`)<br>
option to add line numbers to all lines (`-n`)<br>
option to encrypt the file (`-e`) (AES-128 bit)<br>
option to encrypt the file (`-de`) (AES-128 bit)<br>

## Commands:
<br>
`node cat.js filepath` => displays content of the file in the terminal 🗄
<br>`node cat.js filepath1 filepath2 filepath3...` => displays content of all files in the terminal in (contactinated form) in the given order. 🗃
<br>`node cat.js -s filepath` => convert big line breaks into a singular line break 📜
<br>`node cat.js -n filepath` => give numbering to all the lines 🔢
<br>`node cat.js -b filepath` => give numbering to non-empty lines 📜🔢
<br>`node cat.js -e filepath key` => encrypt file with Military Grade(AES-128) bit encryption 🔒
<br>`node cat.js -de filepath key` => decrypt file with Military Grade(AES-128) bit encryption 🔓
<br>We can mix and match the options.

## Edge cases:
<br>
1- If file entered is not found then it gives file does not exist error.<br>
2- `-n` and `-b` are 2 options which are mutually exclusive so if user types both of them together only the first enter option should work.<br>
3- `-s` and any or both `-n` and `-b` present then `-s` will be executed first and then `-n` and `-b` according second rule<br>
4- Advanced options like encryption/decryption can not be mixed matched.<br>
5- for Encryption and decryption 16 character (128 bit) key is required.