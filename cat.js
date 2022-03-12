const fs = require("fs");
var sha256 = require('js-sha256');
const AES = require('./AES.js')

//Command Syntax: node cat.js [option] [filepath] "[key]" //key is for encryption/decryption
// OPTIONS
//-s: removes extra spaces between lines
//-n: enumerate
//-b: enumerate except empty lines
//-c: compress(huffman)
//-d: decompress
//-e: encrypt(AES-128)
//-de: decrypt
//-touch: new file
//-help: command
//-organize
//-tree
//
// TODO: also include https://www.tecmint.com/13-basic-cat-command-examples-in-linux/


let command = process.argv; // input from user
// console.log(command);
readCommand(command.splice(2));

function readCommand(command){
    optionArray = [];
    filepaths = [];
    indx = 0;
    while (indx < command.length && command[indx][0] == "-") {
        optionArray.push(command[indx++]);
    }

    //If options are valid or not
    if(!validateOptions(optionArray)){
        console.log("Invalid option USE node cat.js -help");
        console.log("for help");
        return;
    }

    //Help option
    if(optionArray.includes("-help")){
        help();
        return;
    }

    for(let i=indx; i<command.length; i++){
        filepaths.push(command[i]);
    }
    if(filepaths.length == 0) {
        console.log("Filepath not found");
        return;
    }
    
    //Check if advance Options
    conditionOrOptions  = isAdvance(optionArray);
    if (typeof conditionOrOptions == "object"){
        advanceCatCommands(conditionOrOptions, filepaths);
        return;
    }

    options = optionsConflictResolver(optionArray);

    for(let i=0; i<filepaths.length; i++){
        if (fs.existsSync(filepaths[i])) runCommands(options, filepaths[i]);
        else console.log(`File: ${filepaths[i]} does not exist.`);
    }
}

function validateOptions(options) {
    const valids = ["-s", "-n", "-b", "-e", "-de", "-help", "-c", "-d", "-touch", "-organize", "-tree"];
    for(let i=0; i<options.length; i++) {
        if( !valids.includes(options[i]) ) {
            return false;
        }
    }
    return true;
}

function help() {
    console.log("Syntax:");
    console.log("node cat.js [option] [File Path/Folder Path] [key]");
    console.log("-s : Removes Extra spaces between lines and prints it.");
    console.log("-n: Enumerates the content of files and print it.");
    console.log("-b: Enumerates the content of files and print it.");
    console.log("-n: Enumerates the non-empty of files and print it.");
    console.log("-e: Encrypts the file with AES-128 bit and modifies the original file. Requires 16 character key");
    console.log("-e: Decrypts the file and modifies the original file. Requires 16 character key (key authentication is also performed before decrypting)");
    console.log("-help: Help");
}

function organize(folderpath) {
    //organizes the files in the folder into different types of folder
    const types = {
        media: ["mp4", "mkv", "mp3"],
        archives: ['zip', '7z', 'rar', 'tar', 'gz', 'ar', 'iso', "xz"],
        documents: ['docx', 'doc', 'pdf', 'xlsx', 'xls', 'odt', 'ods', 'odp', 'odg', 'odf', 'txt', 'ps', 'tex'],
        app: ['exe', 'dmg', 'pkg', "deb"],
        images: ['png','jpg','jpeg']
    }
    
    if(folderpath == undefined){
        folderpath = process.cwd();
        //Current working directory
    }
    let organisedFile = path.join(folderpath, "Organised Files");
    if ( fs.existsSync(organisedFile) == false ){
        fs.mkdirSync(organisedFile);
    }
    else {
        console.log("Folder Already exist");
        return;
    }
}

function isAdvance(optionArray) {
    if(optionArray.includes("-e") || optionArray.includes("-de") 
    || optionArray.includes("-organize")) {
        if (optionArray.length > 1) {
            console.log("Invalid options: [Advanced Option should be used alone]");
            return [];
        }
        if(optionArray.includes("-e")) return ["-e"];
        if(optionArray.includes("-de")) return ["-de"];
        if(optionArray.includes("-organize")) return ["-organize"];
    }
    return false;
}

function advanceCatCommands(options, filepaths) {
    if (options.length == 0) return;

    //Organise
    else if(optionArray.includes("-organise")) organize();

    // Encryption/Decryption
    else if(options.includes("-e") || options.includes("-de")) { 
        if (filepaths.length > 2) {
            console.log("Advanced Options can be applied on exactly one file at a time");
            return;
        }
        if (filepaths.length < 2) {
            console.log("Requires Filepath and key");
            return;
        }
        if (fs.existsSync(filepaths[0])) encryDecry(options, filepaths[0], filepaths[1]);
        else console.log(`File: ${filepaths[0]} does not exist.`);
        return;
    };
}

function optionsConflictResolver(optionArray) {
    //Combinations
    //if -n and -b then first one dominates
    //if -s and -n  or -s and -b togeather then first run -s then -n or -b.
    // if options arry consist of ency/decry or compress/decompress or touch then ignore other commands and dont read the file after words.
    // and try to give precedence to the option which comes first.

    // case -s with -b then both functions will run and output will look similar to only -b.
    if(optionArray.length == 0) {
        return ["-r"];
    }

    options = [];

    if (optionArray.includes("-s")) options.push("-s");
    if (optionArray.includes("-n") && optionArray.includes("-b")) {
        
        nindx = optionArray.indexOf("-n");
        bindx = optionArray.indexOf("-b");
        if(nindx < bindx) options.push("-n");
        else options.push("-b");
    }
    else if(optionArray.includes("-n")) options.push("-n");
    else if(optionArray.includes("-b")) options.push("-b");
    options.push("-r");
    return options;
}

function runCommands(options, file) {
    //TODO: add implementations of optionArray

    if(options.length == 0){
        return;
    }

    let content = getContent(file);

    for(let i=0; i<options.length; i++){
        
        switch(options[i]){
            case "-r" :
                printContentFromArray(content);
                break;
            case "-n" :
                content = enumerate(content);
                break;
            case "-b" :
                content = enumerate(content, space=true);
                break;
            case "-s" :
                content = spaceRemover(content);
                break;
            default :
                console.log("Wrong Option");
        }
    }
}

function getContent(filepath) {
    let c = fs.readFileSync(filepath, "utf-8");
    return c.split("\n");
}

function printContentFromArray(content) {
    //Print content from the error
    for(let i=0;i<content.length;i++){
        console.log(content[i]);
    }    
}

function spaceRemover(content) {
    let result = [];
    let indx = 0;

    while(indx < content.length && (content[indx] == "\r" || content[indx].trim() == "")) indx++; // Removes the starting extra lines

    while(indx < content.length) {
        if(content[indx] == "\r"){
            result.push(content[indx]);
            while(indx < content.length && (content[indx] == "\r" || content[indx].trim() == "")) indx++;
        }
        else {
            result.push(content[indx]);
            indx++;
        }
    }
    return result;
}

function enumerate(content, space=false) {
    let result = [];
    let number = 1;
    for(i=0; i<content.length; i++){
        if(space){
            if ((content[i] == "\r" || content[i].trim() == "")) {
                result.push(content[i]);
                continue;
            }
        }
        result.push(`${number} ${content[i]}`);
        number += 1;
    }
    return result;
}

function encryDecry(options, file, key) {
    if(key.length != 16) {
        console.log("Require 16 character key");
        return;
    }
    let obj = new AES(key);
    let hash = sha256.sha256(key);
    let filecontent = fs.readFileSync(file, "utf-8");
    let indx = 0;

    if(options[0] == "-de") {
        let index = 0;
        while(filecontent[index] != "\n" && index<filecontent.length) index++;
        let keydigest = filecontent.substring(0, index+1);
        //console.log( keydigest);
        try{
            const object = JSON.parse(keydigest);
            if(object["keydigest"] != hash){
                console("Key mismatch");
                return;
            }
            indx = index+1;
        }
        catch(err){
            console.log("Unable to authenticate the key");
            return;
        }
    }

    let finalmessage = "";
    
    while(indx < filecontent.length){
        let till = indx+16;
        let temp = filecontent.substring(indx, till);
        indx = till;
        let text = null;
        if(options[0] == "-e") {
            text = obj.encrypt(temp);
        }
        else if(options[0] == "-de") {
            text = obj.decrypt(temp);
        }
        //console.log(temp);
        //console.log(text);
        finalmessage += text;
    }
    //console.log(finalmessage);

    if(options[0] == "-e") {
        finalmessage = '{"keydigest":"'+hash+'"}\n'+finalmessage;
    }
    last = finalmessage.length;
    if(options[0] == "-de") {
        
        while(finalmessage.charCodeAt(last-1) == 0){
            last--;
        }
    }
    fs.writeFileSync(file, finalmessage.substring(0, last));
}