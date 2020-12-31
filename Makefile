# current git branch
BRANCH := $(shell git rev-parse --abbrev-ref HEAD)

DOCS_DIR=./docs/

init: submodule
	pip install -r requirements.txt
	cd frontend && pip install -e . && npm install

submodule:
	git submodule update --init --recursive --remote

render: assets copy
	mkdir -p $(DOCS_DIR)
	python3 render.py

clean::
	rm -rf $(DOCS_DIR)
	mkdir -p $(DOCS_DIR)

copy:
	cp -r static/ $(DOCS_DIR)

local: assets
	mkdir -p $(DOCS_DIR)
	python3 render.py --local

STATIC_DIR := docs
LOCAL_FRONTEND := frontend

assets/css:
	mkdir -p $(STATIC_DIR)/stylesheets
	cd $(LOCAL_FRONTEND) && gulp stylesheets
	rsync -r $(LOCAL_FRONTEND)/digital_land_frontend/static/stylesheets/ $(STATIC_DIR)/stylesheets/

assets/js:
	mkdir -p $(STATIC_DIR)/javascripts
	cd $(LOCAL_FRONTEND) && gulp js
	rsync -r $(LOCAL_FRONTEND)/digital_land_frontend/static/javascripts/ $(STATIC_DIR)/javascripts/

assets:: assets/css assets/js

commit-docs::
	git add docs
	git diff --quiet && git diff --staged --quiet || (git commit -m "Rebuilt docs $(shell date +%F)"; git push origin $(BRANCH))