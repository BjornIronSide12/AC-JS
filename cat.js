const fs = require("fs");

//Command Syntax: node cat.js -[option] [filepath]
// OPTIONS
//-s: removes extra spaces between lines
//-n: enumerate
//-b: enumerate except empty lines
//-c: compress(huffman)
//-d: decompress
//-e: encrypt(AES-128)
//-de: decrypt
//-touch: new file
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
    for(let i=indx; i<command.length; i++){
        filepaths.push(command[i]);
    }
    if(filepaths.length == 0) {
        console.log("Filepath not found");
        return;
    }

    options = optionsConflictResolver(optionArray);
    for(let i=0; i<filepaths.length; i++){
        if (fs.existsSync(filepaths[i])) runCommands(options, filepaths[i])
        else console.log(`File: ${filepaths[i]} does not exist.`);
    }
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

    if(options.length == 1) {
        switch (options[0]){
            case "-r":
                printContentFromArray(getContent(file));
                break;
            case "-e":
                console.log("Encryption: Coming Soon");
                break;
            case "-de":
                console.log("Decryption: Coming Soon");
                break;
            case "-c":
                console.log("Compression: Coming Soon");
                break;
            case "-r":
                console.log("Decompression: Coming Soon");
                break;
            case "-touch" :
                console.log("Decompression: Coming Soon");
                break;
            default :
                console.log("Wrong Option");
        }
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