require("babel-polyfill");

const intercept = require("intercept-stdout");
const expect = require("expect");
const stripAnsiFrom = require('strip-ansi');
const commandLineValidator = require("../../../dist/src/cli-validator/runValidator");

// for an explanation of the text interceptor, see the comments for the
// first test in expectedOutput.js

describe ("cli tool - test error handling", function() {

  let helpMessage = function() {
    console.log("\n  Usage: validate-swagger [options] <file>\n\n");
    console.log("  Options:\n");
    console.log("    -v, --print_validator_modules  print the validators that catch each error/warning");
    console.log("    -n, --no_colors                turn off output coloring");
    console.log("    -h, --help                     output usage information");
  }

  it ("should return an error when there is no filename given", async function() {

    let captured_text = [];
     
    let unhook_intercept = intercept(function(txt) {
      captured_text.push(stripAnsiFrom(txt));
      return '';
    });

    let program = {};
    program.args = [];
    program.help = helpMessage;

    let exitCode;
    try {
      exitCode = await commandLineValidator(program);
    }
    catch (err) {
      exitCode = err;
    }
    

    unhook_intercept();

    expect(exitCode).toEqual(2);
    expect(captured_text.length).toEqual(6);
    expect(captured_text[0]).toEqual("\nError Exactly one file must be passed as an argument. See usage details below:\n");
    expect(captured_text[1]).toEqual("\n  Usage: validate-swagger [options] <file>\n\n\n");
    expect(captured_text[2]).toEqual("  Options:\n\n");
    expect(captured_text[3]).toEqual("    -v, --print_validator_modules  print the validators that catch each error/warning\n");
    expect(captured_text[4]).toEqual("    -n, --no_colors                turn off output coloring\n");
    expect(captured_text[5]).toEqual("    -h, --help                     output usage information\n");
  });

  it ("should return an error when there is more than one filename given", async function() {

    let captured_text = [];
     
    let unhook_intercept = intercept(function(txt) {
      captured_text.push(stripAnsiFrom(txt));
      return '';
    });

    let program = {};
    program.args = ["first.json", "second.yml"];
    program.help = helpMessage;

    
    let exitCode;
    try {
      exitCode = await commandLineValidator(program);
    }
    catch (err) {
      exitCode = err;
    }

    unhook_intercept();

    expect(exitCode).toEqual(2);
    expect(captured_text.length).toEqual(6);
    expect(captured_text[0]).toEqual("\nError Exactly one file must be passed as an argument. See usage details below:\n");
    expect(captured_text[1]).toEqual("\n  Usage: validate-swagger [options] <file>\n\n\n");
    expect(captured_text[2]).toEqual("  Options:\n\n");
    expect(captured_text[3]).toEqual("    -v, --print_validator_modules  print the validators that catch each error/warning\n");
    expect(captured_text[4]).toEqual("    -n, --no_colors                turn off output coloring\n");
    expect(captured_text[5]).toEqual("    -h, --help                     output usage information\n");
  });

  it ("should return an error when there is no file extension", async function() {

    let captured_text = [];
     
    let unhook_intercept = intercept(function(txt) {
      captured_text.push(stripAnsiFrom(txt));
      return '';
    });

    let program = {};
    program.args = ["noExtension"];
    
    let exitCode;
    try {
      exitCode = await commandLineValidator(program);
    }
    catch (err) {
      exitCode = err;
    }

    unhook_intercept();

    expect(exitCode).toEqual(2);
    expect(captured_text.length).toEqual(2);
    expect(captured_text[0]).toEqual("\nError Files must have an extension!\n");
    expect(captured_text[1]).toEqual("Supported file types are JSON (.json) and YAML (.yml, .yaml)\n\n");
  });

  it ("should return an error when there is an invalid file extension", async function() {

    let captured_text = [];
     
    let unhook_intercept = intercept(function(txt) {
      captured_text.push(stripAnsiFrom(txt));
      return '';
    });

    let program = {};
    program.args = ["badExtension.jsor"];
    
    let exitCode;
    try {
      exitCode = await commandLineValidator(program);
    }
    catch (err) {
      exitCode = err;
    }

    unhook_intercept();

    expect(exitCode).toEqual(2);
    expect(captured_text.length).toEqual(2);
    expect(captured_text[0]).toEqual("\nError Invalid file extension: .jsor\n");
    expect(captured_text[1]).toEqual("Supported file types are JSON (.json) and YAML (.yml, .yaml)\n\n");
  });

  it ("should return an error when a file contains an invalid object", async function() {

    let captured_text = [];
     
    let unhook_intercept = intercept(function(txt) {
      captured_text.push(stripAnsiFrom(txt));
      return '';
    });

    let program = {};
    program.args = ["./test/cli-validator/mockFiles/badJson.json"];
    
    let exitCode;
    try {
      exitCode = await commandLineValidator(program);
    }
    catch (err) {
      exitCode = err;
    }

    unhook_intercept();

    expect(exitCode).toEqual(2);
    expect(captured_text.length).toEqual(2);
    expect(captured_text[0].trim()).toEqual("Error Invalid input file: badJson.json. See below for details.");
    expect(captured_text[1].trim()).toEqual("SyntaxError: Unexpected token ; in JSON at position 13");
  });

  it ("should return an error when a json file has duplicated key mappings", async function() {

    let captured_text = [];
     
    let unhook_intercept = intercept(function(txt) {
      captured_text.push(stripAnsiFrom(txt));
      return '';
    });

    let program = {};
    program.args = ["./test/cli-validator/mockFiles/duplicateKeys.json"];
    
    let exitCode;
    try {
      exitCode = await commandLineValidator(program);
    }
    catch (err) {
      exitCode = err;
    }

    unhook_intercept();

    expect(exitCode).toEqual(2);
    expect(captured_text.length).toEqual(2);
    expect(captured_text[0].trim()).toEqual("Error Invalid input file: duplicateKeys.json. See below for details.");
    expect(captured_text[1].trim()).toEqual("Syntax error: duplicated keys \"version\" near sion\": \"1.");
  });
});