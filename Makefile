# current git branch
BRANCH := $(shell git rev-parse --abbrev-ref HEAD)

DOCS_DIR=./docs/

init:
	pip install -r requirements.txt

submodule:
	git submodule update --init --recursive --remote

render: copy assets
	python3 render.py

clean::
	rm -rf $(DOCS_DIR)
	mkdir -p $(DOCS_DIR)

copy:
	cp -r static/images $(DOCS_DIR)

local: assets
	mkdir -p $(DOCS_DIR)
	python3 render.py --local

LOCAL_FRONTEND := frontend

assets/css:
	mkdir -p $(DOCS_DIR)/stylesheets
	cd $(LOCAL_FRONTEND) && gulp stylesheets
	rsync -r $(LOCAL_FRONTEND)/digital_land_frontend/static/stylesheets/ $(DOCS_DIR)/stylesheets/

assets/js:
	mkdir -p $(DOCS_DIR)/javascripts
	cd $(LOCAL_FRONTEND) && gulp js

	rsync -r $(LOCAL_FRONTEND)/digital_land_frontend/static/javascripts/ $(DOCS_DIR)/javascripts/

assets/images:
	mkdir -p $(DOCS_DIR)/images
	rsync -r $(LOCAL_FRONTEND)/digital_land_frontend/static/govuk/assets/images/ $(DOCS_DIR)/images/

assets:: assets/css assets/js assets/images

status:
	git status --ignored

commit-docs::
	git add docs
	git diff --quiet && git diff --staged --quiet || (git commit -m "Rebuilt docs $(shell date +%F)"; git push origin $(BRANCH))
