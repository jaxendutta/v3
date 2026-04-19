# acm/.latexmkrc
$out_dir = 'out';
$pdf_mode = 1;

ensure_path('BIBINPUTS', '../');
ensure_path('TEXINPUTS', '../figures//');
ensure_path('TEXINPUTS', '../../../shared/acm-assets//');
ensure_path('BSTINPUTS', '../../../shared/acm-assets//');

add_cus_dep('glo', 'gls', 0, 'run_makeglossaries');
add_cus_dep('acn', 'acr', 0, 'run_makeglossaries');

sub run_makeglossaries {
    my ($base_name, $path) = fileparse($_[0]);
    pushd($path);
    my $return = system("makeglossaries \"$base_name\"");
    popd();
    return $return;
}