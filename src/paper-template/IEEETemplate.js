const IEEELatex = (content) => {
  return `
  \\documentclass[conference]{IEEEtran}
  \\usepackage{graphicx}
  \\begin{document}

  \\title{${content.Title || "Your Title Here"}}
  \\author{Your Name \\\
  Your Institution}

  \\maketitle

  \\begin{abstract}
  ${content.Abstract || "Your abstract here..."}
  \\end{abstract}

  \\section{Introduction}
  ${content.Introduction || "Introduction text here..."}

  \\section{Literature Review}
  ${content["Literature Review"] || "Literature review content here..."}

  \\section{Methodology}
  ${content.Methodology || "Methodology content here..."}

  \\section{Results & Discussion}
  ${content["Results & Discussion"] || "Results and discussion content here..."}

  \\section{Conclusion}
  ${content.Conclusion || "Conclusion text here..."}

  \\section{Future Work}
  ${content["Future Work"] || "Future work content here..."}

  \\section{Citations}
  ${content.Citations || "Citations go here..."}

  \\end{document}
  `;
};

export default IEEELatex;
