# current git branch
BRANCH := $(shell git rev-parse --abbrev-ref HEAD)

DOCS_DIR=./docs/

render: copy
	mkdir -p $(DOCS_DIR)/map
	python3 render.py

init: 
	pip install -r requirements.txt

clean::
	rm -rf $(DOCS_DIR)
	mkdir -p $(DOCS_DIR)

copy:
	cp -r static/images $(DOCS_DIR)

status:
	git status --ignored

commit-docs::
	git add docs
	git diff --quiet && git diff --staged --quiet || (git commit -m "Rebuilt docs $(shell date +%F)"; git push origin $(BRANCH))
