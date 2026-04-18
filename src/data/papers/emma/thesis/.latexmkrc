# thesis/.latexmkrc
$out_dir = 'out';
$pdf_mode = 1;

# Tell BibTeX where to find .bib files regardless of working directory
ensure_path('BIBINPUTS', '../');   # from thesis/ — finds emma.bib one level up

add_cus_dep('glo', 'gls', 0, 'run_makeglossaries');
add_cus_dep('acn', 'acr', 0, 'run_makeglossaries');

sub run_makeglossaries {
    my ($base_name, $path) = fileparse($_[0]);
    pushd($path);
    my $return = system("makeglossaries \"$base_name\"");
    popd();
    return $return;
}