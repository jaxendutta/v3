%% -----------------------------------------------------------
%% ieee-portfolio.cls
%% Custom IEEE wrapper class for portfolio case analyses
%% -----------------------------------------------------------
\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{ieee-portfolio}[2026/04/20 Custom IEEE Portfolio Class]

% Pass all remaining options to the base IEEEtran class
\DeclareOption*{\PassOptionsToClass{\CurrentOption}{IEEEtran}}
\ProcessOptions\relax

% Load the base IEEEtran class in conference mode
\LoadClass[conference]{IEEEtran}

%% -----------------------------------------------------------
%% Standard Package Imports
%% -----------------------------------------------------------
\RequirePackage{amsmath,amstext}
\RequirePackage{graphicx}
\RequirePackage{float}
\RequirePackage{cuted}
\RequirePackage{parskip}
\RequirePackage{tabularx}
\RequirePackage{listings}
\RequirePackage{booktabs}
\RequirePackage{pdflscape}
\RequirePackage[table]{xcolor}
\RequirePackage{xurl}
\RequirePackage[hidelinks]{hyperref}
\RequirePackage{microtype}
\RequirePackage{fancyhdr}
\RequirePackage{orcidlink}

%% Vertical centering for tabularx X columns
\renewcommand{\tabularxcolumn}[1]{>{\raggedright\arraybackslash}m{#1}}

%% -----------------------------------------------------------
%% Custom Variable Definitions
%% -----------------------------------------------------------
% Short Title
\newcommand{\@shorttitle}{}
\newcommand{\shorttitle}[1]{\renewcommand{\@shorttitle}{#1}}

% Header Author (Plain text name for the header to avoid IEEE block formatting)
\newcommand{\@headerauthor}{}
\newcommand{\headerauthor}[1]{\renewcommand{\@headerauthor}{#1}}

% Custom tiny paragraph command
\newcommand{\tinypara}[1]{\vspace{0.5ex}\noindent\textbf{\textit{#1}}}

%% -----------------------------------------------------------
%% Geometry & Spacing Adjustments
%% -----------------------------------------------------------
\AtBeginDocument{
    \setlength{\headheight}{6pt}
    \setlength{\headsep}{24pt}
    \addtolength{\topmargin}{42pt}
    \addtolength{\textheight}{-54pt}
}

%% -----------------------------------------------------------
%% Header and Footer Configurations
%% -----------------------------------------------------------
\pagestyle{fancy}
\fancyhf{} % Clear defaults

% Page 2+ Headers & Footers
\fancyhead[L]{\textit{\@shorttitle}}
\fancyhead[R]{\@headerauthor\, \orcidlink{0009-0002-5088-4679}}
\fancyfoot[L]{\textit{\@date}}
\fancyfoot[R]{\thepage}
\renewcommand{\headrulewidth}{0pt}

% First Page Footers (Plain style)
\fancypagestyle{plain}{
    \fancyhf{}
    \fancyfoot[L]{\textit{\@date}}
    \fancyfoot[R]{\thepage}
    \renewcommand{\headrulewidth}{0pt}
}

% Automatically force the first page to use our custom plain style
% after IEEEtran tries to clear it during \maketitle
\let\oldmaketitle\maketitle
\renewcommand{\maketitle}{%
  \oldmaketitle
  \thispagestyle{plain}%
}

\endinput
