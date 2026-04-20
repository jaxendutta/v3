%% essay.cls
\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{essay}[2026/04/19 Essay class]

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
\def\frontmatter@title@above{\vspace*{1.25in}} 
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

% 11. Strip out the "Dated:" prefix and the RRAP parentheses
\RequirePackage{etoolbox}
\def\Dated@name{} % This completely removes the word "Dated: "
\patchcmd{\frontmatter@RRAP@format}{(}{}{}{} % Secretly deletes the left parenthesis
\patchcmd{\frontmatter@RRAP@format}{)}{}{}{} % Secretly deletes the right parenthesis

% 12. Safely add space above the date using an invisible strut
\let\olddate\date
\renewcommand{\date}[1]{\olddate{\rule{0pt}{0.2in}#1}}
\date{\today} % Sets the default with the strut included

% 13. Bibliography style (default ACM Reference Format, can override in .tex)
% revtex4-2 intercepts \bibliographystyle, so we set \@bibstyle directly 
% or just call it in the preamble.
\bibliographystyle{../../../shared/acm-assets/ACM-Reference-Format}

% Disable revtex4-2 from making the whole bibliography item a hyperlink
% If using apsrev4-2.bst, the title is linked. But since we forced ACM,
% we don't need to disable natbib hooks. Let's just restore them.
\RequirePackage{etoolbox}


% 14. Glossaries setup (can override \glossaryfile in .tex)
\RequirePackage[colorlinks=true,citecolor=blue,linkcolor=blue,urlcolor=blue]{hyperref}
\RequirePackage[acronym,nomain,nogroupskip]{glossaries-extra}
\providecommand{\glossaryfile}{../glossaries}
\IfFileExists{\glossaryfile.tex}{\input{\glossaryfile}}{}
\makenoidxglossaries

% Custom acronym display: indent acronym entries in the list
\setabbreviationstyle[acronym]{long-short-desc}

% Reduce space above the acronym glossary header by patching the heading style
\glssetcategoryattribute{acronym}{noindex}{true} % just in case, does not affect spacing
\renewcommand*{\acronymname}{Acronyms}
\renewcommand*{\glossarysection}[2][]{{\vspace*{-1em}\section*{#2}}}

% 15. Print all glossaries before bibliography by default
\pretocmd{\bibsection}{%
  \glsaddall
  \printnoidxglossaries
}{}{}

% 16. URL breaking in bibliography and everywhere
% (hyperref loads url, so don't load it again)
\def\UrlBreaks{\do\-\do\/\do\_\do\%\do\&\do\#\do\?\do\=\do\:}
\hypersetup{breaklinks=true}
\def\UrlFont{\ttfamily\small}
\def\bibfont{\small}
\def\Urlmuskip{0mu plus 1mu}

% 17. Custom headers/footers using fancyhdr and add vertical page padding
\RequirePackage{fancyhdr}


% Safe, expandable versions of title/author/date for headers/footers
\newcommand{\essaysafedtitle}{}
\newcommand{\essaysafedauthor}{}
\newcommand{\essaysafeddate}{}
\let\oldtitle\title
\renewcommand{\title}[1]{\oldtitle{#1}\renewcommand{\essaysafedtitle}{#1}}
\let\oldauthor\author
\renewcommand{\author}[1]{\oldauthor{#1}\renewcommand{\essaysafedauthor}{#1}}
\let\olddatecmd\date
\renewcommand{\date}[1]{\olddatecmd{#1}\renewcommand{\essaysafeddate}{#1}}

% Macro to remove \\ and \newline from a string (for header/footer only)
\newcommand{\removenewlines}[1]{%
  \begingroup
    \let\\\space
    \let\newline\space
    #1
  \endgroup
}

\fancypagestyle{essay}{%
  \fancyhf{}% clear all fields
  % Top left: Title (\small, newlines removed)
  \fancyhead[L]{\small\nouppercase{\removenewlines{\essaysafedtitle}}}
  % Top right: Author (\small, newlines removed)
  \fancyhead[R]{\small\nouppercase{\removenewlines{\essaysafedauthor}}}
  % Bottom left: Date (\small, italics, newlines removed)
  \fancyfoot[L]{\small\textit{\removenewlines{\essaysafeddate}}}
  % Bottom right: Page number (normal size)
  \fancyfoot[R]{\thepage}
  % Remove header line
  \renewcommand{\headrulewidth}{0pt}
  % Remove footer line
  \renewcommand{\footrulewidth}{0pt}
}

% Apply custom pagestyle from page 2 onwards and add vertical page padding
\AtBeginDocument{%
  % Vertically center text block after reducing textheight
  \newlength{\origtextheight}
  \setlength{\origtextheight}{\textheight}
  \setlength{\textheight}{0.925\origtextheight}% Reduce text area by 10%
  \addtolength{\topmargin}{0.5\dimexpr\origtextheight-\textheight}\relax
  % Add a bit of padding above the footer
  \addtolength{\footskip}{0.75em}
  % No header/footer on first page
  \thispagestyle{empty}%
  % Use custom style for subsequent pages
  \pagestyle{essay}%
}
\endinput