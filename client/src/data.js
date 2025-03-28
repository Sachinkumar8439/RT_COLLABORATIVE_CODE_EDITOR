export const monacoFormatLang = [
  {
    id: 0,
    name: "select language",
    defaultCode: "// Please select a language",
  },
  {
    id: 45,
    name: "assembly",
    defaultCode: "; Assembly example\nsection .data\nsection .text\nmain:",
  },
  { id: 46, name: "shell", defaultCode: "#!/bin/bash\necho 'Hello, World!'" },
  { id: 47, name: "basic", defaultCode: "10 PRINT 'Hello, World!'\n20 END" },
  {
    id: 104,
    name: "c",
    defaultCode:
      '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
  },
  {
    id: 76,
    name: "cpp",
    defaultCode:
      '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
  },
  { id: 86, name: "clojure", defaultCode: '(println "Hello, World!")' },
  {
    id: 51,
    name: "csharp",
    defaultCode:
      'using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}',
  },
  {
    id: 77,
    name: "cobol",
    defaultCode:
      "IDENTIFICATION DIVISION.\nPROGRAM-ID. HelloWorld.\nPROCEDURE DIVISION.\n    DISPLAY 'Hello, World!'.\n    STOP RUN.",
  },
  { id: 55, name: "lisp", defaultCode: '(format t "Hello, World!~%")' },
  {
    id: 90,
    name: "dart",
    defaultCode: "void main() {\n    print('Hello, World!');\n}",
  },
  {
    id: 56,
    name: "d",
    defaultCode:
      'import std.stdio;\n\nvoid main() {\n    writeln("Hello, World!");\n}',
  },
  { id: 57, name: "elixir", defaultCode: 'IO.puts "Hello, World!"' },
  {
    id: 58,
    name: "erlang",
    defaultCode:
      '-module(hello).\n-export([start/0]).\n\nstart() -> io:format("Hello, World!~n").',
  },
  { id: 44, name: "plaintext", defaultCode: "Hello, World!" },
  { id: 87, name: "fsharp", defaultCode: 'printfn "Hello, World!"' },
  {
    id: 59,
    name: "fortran",
    defaultCode:
      "program HelloWorld\n    print *, 'Hello, World!'\nend program HelloWorld",
  },
  {
    id: 60,
    name: "go",
    defaultCode:
      'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}',
  },
  { id: 88, name: "groovy", defaultCode: "println 'Hello, World!'" },
  { id: 61, name: "haskell", defaultCode: 'main = putStrLn "Hello, World!"' },
  {
    id: 96,
    name: "java",
    defaultCode:
      'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
  },
  { id: 63, name: "javascript", defaultCode: "console.log('Hello, World!');" },
  {
    id: 78,
    name: "kotlin",
    defaultCode: 'fun main() {\n    println("Hello, World!")\n}',
  },
  { id: 64, name: "lua", defaultCode: 'print("Hello, World!")' },
  {
    id: 79,
    name: "objective-c",
    defaultCode:
      '#import <Foundation/Foundation.h>\n\nint main() {\n    @autoreleasepool {\n        NSLog(@"Hello, World!");\n    }\n    return 0;\n}',
  },
  { id: 65, name: "ocaml", defaultCode: 'print_endline "Hello, World!"' },
  { id: 66, name: "octave", defaultCode: "disp('Hello, World!')" },
  {
    id: 67,
    name: "pascal",
    defaultCode:
      "program HelloWorld;\nbegin\n    writeln('Hello, World!');\nend.",
  },
  { id: 85, name: "perl", defaultCode: 'print "Hello, World!\\n";' },
  { id: 68, name: "php", defaultCode: "<?php\necho 'Hello, World!';\n?>" },
  {
    id: 69,
    name: "prolog",
    defaultCode:
      ":- initialization(main).\nmain :- write('Hello, World!'), nl.",
  },
  { id: 70, name: "python", defaultCode: 'print("Hello, World!")' },
  { id: 80, name: "r", defaultCode: 'cat("Hello, World!\\n")' },
  { id: 72, name: "ruby", defaultCode: "puts 'Hello, World!'" },
  {
    id: 73,
    name: "rust",
    defaultCode: 'fn main() {\n    println!("Hello, World!");\n}',
  },
  {
    id: 81,
    name: "scala",
    defaultCode: 'object Main extends App {\n    println("Hello, World!")\n}',
  },
  {
    id: 82,
    name: "sql",
    defaultCode: "-- SQL Example\nSELECT 'Hello, World!';",
  },
  { id: 83, name: "swift", defaultCode: 'print("Hello, World!")' },
  { id: 74, name: "typescript", defaultCode: "console.log('Hello, World!');" },
  {
    id: 84,
    name: "vb",
    defaultCode:
      'Module Hello\n    Sub Main()\n        Console.WriteLine("Hello, World!")\n    End Sub\nEnd Module',
  },
  {
    id: 111,
    name: "html",
    defaultCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello, World!</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <script>
        console.log("Hello, World!");
    </script>
</body>
</html>`,
  },
];

export const editorOptions = {
  padding: { top: 5, bottom: 5 }, // Add padding to top and bottom
  fontSize: 15, // Font size
  lineHeight: 0, // Line height for better readability
  minimap: { enabled: false }, // Disable minimap for a cleaner look

  // Word Wrapping and Scrolling
  wordWrap: "on", // Enable word wrapping
  scrollBeyondLastLine: false, // Prevent scrolling past the last line
  smoothScrolling: true, // Smooth scrolling for better UX

  // Cursor and Line Highlighting
  cursorBlinking: "smooth", // Smooth cursor blinking
  cursorStyle: "line", // Cursor style (block/line/underline)
  cursorWidth: 1, // Cursor width (for line style)
  // renderLineHighlight: "all",       // Highlight both gutter and line
  // renderWhitespace: "boundary",     // Show whitespaces only at boundaries

  // Code Folding and Guides
  folding: true, // Enable code folding
  foldingHighlight: true, // Highlight folded regions
  guides: {
    // indentation: true,              // Indentation guides
    bracketPairs: true, // Highlight bracket pairs
  },

  // Suggestion and IntelliSense
  suggestOnTriggerCharacters: true, // Enable suggestions on typing
  quickSuggestions: {
    // Enable quick suggestions
    other: true,
    comments: true,
    strings: true,
  },
  parameterHints: { enabled: true }, // Enable parameter hints
  wordBasedSuggestions: true, // Word-based auto-completions
  acceptSuggestionOnEnter: "on", // Accept suggestion with Enter key

  // Scrollbar Customization
  scrollbar: {
    verticalScrollbarSize: 8, // Vertical scrollbar size
    horizontalScrollbarSize: 8, // Horizontal scrollbar size
  },

  // Miscellaneous
  autoIndent: "full", // Maintain proper indentation
  // tabSize: 2,                       // Tab size
  insertSpaces: true, // Use spaces instead of tabs
  renderControlCharacters: false, // Avoid showing control characters
  renderFinalNewline: true, // Ensure final newline is visible
};

export const monaceThemes = [
  { id: 0, name: "Select Theme" },
  { id: 1, name: "vs" },
  { id: 2, name: "vs-dark" },
  { id: 3, name: "hc-black" },
  { id: 4, name: "monokai" },
  { id: 5, name: "solarized-light" },
  { id: 6, name: "solarized-dark" },
  { id: 7, name: "github" },
  { id: 8, name: "dracula" },
  { id: 9, name: "nord" },
  { id: 10, name: "night-owl" },
];
