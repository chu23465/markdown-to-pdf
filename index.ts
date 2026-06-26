import {markdownToHTML} from '@nick/comrak';

import.meta.hot.accept();

const rootElement = document.documentElement;

const savedTheme: string | null = localStorage.getItem('theme');
const systemPrefersDark: boolean = window.matchMedia(
  '(prefers-color-scheme: dark)',
).matches;
const toggleButton = document.getElementById('themeToggle') as HTMLElement;

const stylesArray: StyleSheetList = document.styleSheets as StyleSheetList;
const divOutput = document.getElementById('markdown-body') as HTMLElement;
const buttons: HTMLCollection =
  document.getElementsByClassName('buttonwithCSS');

let hasFile: boolean = false;
let alerted: boolean = false;
let printed: boolean = false;

const buttonsThemeLight = new Map<string, string>([
  ['color', 'rgb(37, 41, 46)'],
  ['background-color', 'rgb(246, 248, 250)'],
  ['border-color', 'rgb(209, 217, 224)'],
  ['box-shadow', 'rgba(31, 35, 40, 0.04) 0px 1px 0px 0px'],
]);
const buttonsThemeDark = new Map<string, string>([
  ['color', 'rgb(240, 246, 252)'],
  ['background-color', 'rgb(33, 40, 48)'],
  ['border-color', 'rgb(61, 68, 77)'],
  ['box-shadow', 'rgba(0, 0, 0, 0) 0px 0px 0px 0px'],
]);

if (savedTheme) {
  rootElement.setAttribute('data-theme', savedTheme);
  switchToTheme(savedTheme);
} else if (systemPrefersDark) {
  //Default to Dark Theme if none in storage
  rootElement.setAttribute('data-theme', 'dark');
  switchToTheme('dark');
}

// I know a lot of this is just cursed. Apologies.

function removeLastPrintStyle() {
  const headNodes: HTMLCollection = document.head.children;
  for (let i = 0; i < headNodes.length; i++) {
    if ((headNodes[i] as HTMLElement).localName === 'style') {
      (headNodes[i] as HTMLElement).remove();
      //console.log('Removed Style Node');
    }
  }
}

function addStyle(cssString: string, mediaString: string | null) {
  const style = document.createElement('style');
  style.type = 'text/css';
  if (mediaString) {
    style.media = mediaString;
  } // Target print media only
  style.appendChild(document.createTextNode(cssString));
  document.head.appendChild(style);
}

function matchPrintStyle(newTheme: string | null) {
  for (const i of stylesArray) {
    for (const j of (i as CSSStyleSheet).rules) {
      if ('media' in (j as CSSRule)) {
        const tempCSSRule: CSSMediaRule = j as CSSMediaRule;
        if (
          tempCSSRule.conditionText === `(prefers-color-scheme: ${newTheme})`
        ) {
          const mediaString: string = 'print';
          const themeCSS: string = tempCSSRule.cssText
            .replace(`(prefers-color-scheme: ${newTheme})`, mediaString)
            .replace(`, [data-theme="${newTheme}"]`, '');
          removeLastPrintStyle();
          removeLastPrintStyle();
          addStyle(themeCSS, mediaString);
          const forceLightMode = themeCSS
            .replace('@media print {', '')
            .replace('; }\n}', '; }');
          addStyle(forceLightMode, null);
        }
      }
    }
  }
}

function switchToTheme(newTheme: string) {
  //console.log(`Theme set to ${newTheme}`);
  rootElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  matchPrintStyle(newTheme);
  if (divOutput instanceof HTMLElement) {
    const bgColor = window.getComputedStyle(divOutput).backgroundColor;
    document.documentElement.style.backgroundColor = bgColor;
  }
  if (buttons) {
    for (const i of buttons) {
      for (const [key, value] of newTheme === 'dark'
        ? buttonsThemeDark
        : buttonsThemeLight)
        (i as HTMLElement).style.setProperty(key as string, value as string);
    }
  }
}

toggleButton.addEventListener('click', event => {
  (event as Event).preventDefault();
  const currentTheme = rootElement.getAttribute('data-theme');
  let newTheme = 'light';

  if (currentTheme === 'light') {
    newTheme = 'dark';
  }

  switchToTheme(newTheme);
});

matchPrintStyle(rootElement.getAttribute('data-theme'));

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
)?.addEventListener('click', event => {
  (event as Event).preventDefault();
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
      //console.log(divOutput);
      if (divOutput instanceof HTMLElement) {
        divOutput.innerHTML = html;
      }
    };

    // Begin reading the file as text data
    reader.readAsText(file);
  }
});
