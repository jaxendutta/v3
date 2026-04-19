%% custom revtex.cls
\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{customrevtex}[2026/04/19 Custom RevTeX wrapper]

% 1. Force the twocolumn option by default
\PassOptionsToClass{twocolumn}{revtex4-2}

% 2. Pass any other provided options directly to revtex4-2
\DeclareOption*{\PassOptionsToClass{\CurrentOption}{revtex4-2}}
\ProcessOptions\relax

% 3. Load the base RevTeX class
\LoadClass{revtex4-2}

% 4. Load the STIX2 font
\RequirePackage{stix2}
% Override default line height scaling
\linespread{0.9}

% 5. Add more space around the title
\def\frontmatter@title@above{\vspace*{1.5in}} 
\def\frontmatter@title@below{\vspace*{0.375in}}

% 6. Title Formatting: Make it larger, normal weight, and explicitly centered
\def\frontmatter@title@format{\LARGE\normalfont\centering}

% 7. Override the References section
\renewcommand{\bibsection}{%
  \section*{\refname}%
}

% 8. Override the abstract font size AND restrict width to 0.8\textwidth
\def\frontmatter@abstractfont{%
  \normalsize
  \setlength{\leftskip}{0.05\textwidth}%
  \setlength{\rightskip}{0.05\textwidth}%
}

% 9. Add vertical space above the abstract block
\let\oldabstractheading\frontmatter@abstractheading
\def\frontmatter@abstractheading{%
  \vspace*{0.5cm}% Adjust this value to get exactly the gap you want!
  \oldabstractheading
}

% 10. Safely add space above affiliations using an invisible strut
\let\oldaffiliation\affiliation
\renewcommand{\affiliation}[1]{\oldaffiliation{\rule{0pt}{0.2in}#1}}

% 11. Safely add space above the date using an invisible strut
\let\olddate\date
\renewcommand{\date}[1]{\olddate{\rule{0pt}{0.2in}#1}}
\date{\today} % Sets the default with the strut included

\endinput