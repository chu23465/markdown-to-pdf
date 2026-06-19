import {markdownToHTML} from '@nick/comrak';

import.meta.hot.accept();

// I know a lot of this is just cursed. Apologies.
// This specfic function created with AI

function addPrintStyle(cssString: string) {
  const style = document.createElement('style');
  style.type = 'text/css';
  style.media = 'print'; // Target print media only
  style.appendChild(document.createTextNode(cssString));
  document.head.appendChild(style);
}
const scheme = 'dark';
const stylesArray: StyleSheetList = document.styleSheets as StyleSheetList;

for (let i = 0; i < stylesArray.length; i++) {
  for (let j = 0; j < (stylesArray[i] as CSSStyleSheet).rules.length; j++) {
    if ('media' in ((stylesArray[i] as CSSStyleSheet).rules[j] as CSSRule)) {
      const tempCSSRule: CSSMediaRule = (stylesArray[i] as CSSStyleSheet).rules[
        j
      ] as CSSMediaRule;
      if (tempCSSRule.conditionText === `(prefers-color-scheme: ${scheme})`) {
        const themeCSS: string = tempCSSRule.cssText
          .replace(`(prefers-color-scheme: ${scheme})`, 'print')
          .replace(`, [data-theme="${scheme}"]`, '');
        addPrintStyle(themeCSS);
        break;
      }
    }
  }
}

let hasFile: boolean = false;
let alerted: boolean = false;
let printed: boolean = false;

(
  document.getElementById('pdfGen') as HTMLButtonElement | null
)?.addEventListener('click', event => {
  (event as Event).preventDefault(); // Necessary
  alerted = false;
  printed = false;
  if (hasFile && !printed) {
    printed = true;
    window.print();
  } else {
    if (!alerted) {
      alert('Please select a file');
      alerted = true;
    }
  }
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
