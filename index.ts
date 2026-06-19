import {markdownToHTML} from '@nick/comrak';

import.meta.hot.accept();
// I know a lot of this is just cursed. Apologies.
//This specfic function created with AI
function addPrintStyle(cssString) {
  const style = document.createElement('style');
  style.type = 'text/css';
  style.media = 'print'; // Target print media only
  style.appendChild(document.createTextNode(cssString));
  document.head.appendChild(style);
}
var scheme = "dark";
for (var i = 0; i < document.styleSheets.length; i++) {
  for (var j = 0; j < document.styleSheets[i].rules.length; j++) {
    if (document.styleSheets[i].rules[j].conditionText === `(prefers-color-scheme: ${scheme})`) {
      darkmodecss = document.styleSheets[i].rules[j].cssText.replace(`(prefers-color-scheme: ${scheme})`, "print").replace(`, [data-theme="${scheme}"]`, "");
      addPrintStyle(darkmodecss);
      break;
    }
  }
}
var hasFile: bool = false;
var alerted: bool = false;
var printed: bool = false;

var darkmodecss;
(
  document.getElementById('pdfGen') as HTMLButtonElement | null
)?.addEventListener('click', (event) => {
  (event as Event).preventDefault(); // Necessary
  alerted = false;
  if (hasFile && !printed) { 
    printed = true;
    window.print();
  } 
  else { if (!alerted) {
    alert("Please select a file"); 
    alerted = true; 

  }}
});

(
  document.getElementById('uploadBtn') as HTMLButtonElement | null
)?.addEventListener('click', () => {
  (document.getElementById('fileInput') as HTMLInputElement | null)?.click();
});

const fileInput = document.getElementById('fileInput') as HTMLInputElement;

fileInput.addEventListener('change', () => {
  const fileList: FileList | null = fileInput.files;

  if (fileList && fileList.length > 0) {
    const file: File = fileList[0] as File;
    hasFile = true;
    document.title = file.name as string;
    const reader = new FileReader();

    // Event triggers once the file loading successfully completes
    reader.onload = () => {
      const textContent = reader.result as string;
      //console.log('File Content:', textContent);
      const html = markdownToHTML(textContent, {
        extension: {
          autolink: true,
          descriptionLists: true,
          footnotes: true,
          inlineFootnotes: true,
          frontMatterDelimiter: '---',
          //headerIDs: "user-content-",
          table: true,
          tagfilter: false,
          tasklist: true,
          multilineBlockQuotes: true,
          alerts: true, // needs styling
          mathDollars: true,
          mathCode: true,
          //wikilinksTitleBeforePipe: true,
          underline: true,
          strikethrough: true,
          superscript: true,
          subscript: true,
          spoiler: true,
          greentext: true,
          shortcodes: true,
          cjkFriendlyEmphasis: true,
          subtext: true,
          highlight: true,
        },
        parse: {
          defaultInfoString: 'bash',
          smart: true,
          relaxedTasklistMatching: true,
          tasklistInTable: true,
          relaxedAutolinks: true,
          brokenLinkCallback: null,
          leaveFootnoteDefinitions: true,
          //escapedCharSpans: true,
        },
        render: {
          //escape: true,
          githubPreLang: true,
          hardbreaks: false,
          width: 10,
          unsafe: true,
          fullInfoString: true, // False?
          //listStyle: 'star',
          escapedCharSpans: true,
          gfmQuirks: true,
          //figureWithCaption: true,
          tasklistClasses: true,
        },
      });

      const divOutput = document.getElementById('markdown-body') as HTMLElement;
      //console.log(divOutput);
      if (divOutput instanceof HTMLElement) {
        divOutput.innerHTML = html;
        const bgColor = window.getComputedStyle(divOutput).backgroundColor;
        document.documentElement.style.backgroundColor = bgColor;
      }
    };

    // Begin reading the file as text data
    reader.readAsText(file);
  }
});
