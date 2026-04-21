# ieee/.latexmkrc
$out_dir = 'out';
$pdf_mode = 1;

# Define paths explicitly so MiKTeX/BibTeX can find them from inside 'out/'
$ENV{'BIBINPUTS'} = '../;' . $ENV{'BIBINPUTS'};
$ENV{'TEXINPUTS'} = '../figures//;../../../shared//;' . $ENV{'TEXINPUTS'};

# Glossaries compilation
add_cus_dep('glo', 'gls', 0, 'run_makeglossaries');
add_cus_dep('acn', 'acr', 0, 'run_makeglossaries');

sub run_makeglossaries {
    my ($base_name, $path) = fileparse($_[0]);
    pushd($path);
    my $return = system("makeglossaries \"$base_name\"");
    popd();
    return $return;
}
