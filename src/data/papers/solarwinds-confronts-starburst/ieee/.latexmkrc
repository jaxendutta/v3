# ieee/.latexmkrc
$out_dir = 'out';
$pdf_mode = 1;

# Point to the bibliography database and image folders
ensure_path('BIBINPUTS', '../');
ensure_path('TEXINPUTS', '../figures//');

# Keep glossary compilation if you are using glossaries-extra
add_cus_dep('glo', 'gls', 0, 'run_makeglossaries');
add_cus_dep('acn', 'acr', 0, 'run_makeglossaries');

sub run_makeglossaries {
    my ($base_name, $path) = fileparse($_[0]);
    pushd($path);
    my $return = system("makeglossaries \"$base_name\"");
    popd();
    return $return;
}
