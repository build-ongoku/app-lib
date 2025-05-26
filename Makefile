.PHONY: all build git npm-publish-patch npm-publish-minor

all: 
	echo "Choose a specific target from the Makefile"
	exit 1

build:
	@echo "Installing..."
	yarn install
	@echo "Building..."
	rm -rf dist
	yarn build
	@echo "Done."

git:
	@echo "Commiting changes..."
	git add -A
	git commit -m "make npm-publish" || true
	@echo "Pushing to git..."
	git push

npm-version-patch:
	npm version patch

npm-version-minor:
	npm version minor

npm-publish:
	@echo "Publishing to npm..."
	npm adduser
	npm publish
	@echo "Pushing to git..."
	git push
	@echo "Done."

npm-publish-patch: build npm-version-patch npm-publish

npm-publish-minor: build npm-version-minor npm-publish


