import {markdownToHTML} from '@nick/comrak';

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
      }
    };

    // Begin reading the file as text data
    reader.readAsText(file);
  }
});
