.PHONY: all build git npm-publish

all: build git npm-publish

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
	git commit -m "make npm-publish"
	@echo "Pushing to git..."
	git push

npm-publish:
	@echo "Publishing to npm..."
	npm version patch
	npm adduser
	npm publish
	@echo "Pushing to git..."
	git push
	@echo "Done."



