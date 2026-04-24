# essay/.latexmkrc
$out_dir = 'out';
$pdf_mode = 1;

# Set BIBINPUTS to search parent directory for .bib files
$ENV{'BIBINPUTS'} = '../;' . $ENV{'BIBINPUTS'};
$ENV{'TEXINPUTS'} = '../../shared//;' . $ENV{'TEXINPUTS'};
