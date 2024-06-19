all:
	pandoc \
	-tpdf \
	-fmarkdown+alerts \
	--pdf-engine=xelatex \
	--defaults='build_config.yaml' \
	--metadata date="`date +%d/%m/%Y`" \
	-o output.pdf \

latex-full:
	pandoc \
	-tlatex \
	-fmarkdown+alerts \
	--defaults='build_config.yaml' \
	--metadata date="`date +%d/%m/%Y`" \
	-s \
	-o output.tex \

latex-bare:
	pandoc \
	-tlatex \
	-fmarkdown+alerts \
	--defaults='build_config.yaml' \
	--metadata date="`date +%d/%m/%Y`" \
	-o output.tex \

clean:
	rm -r output.*
