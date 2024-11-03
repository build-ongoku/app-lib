.PHONY: npm-publish

npm-publish:
	@echo "Installing..."
	yarn install
	@echo "Building..."
	rm -rf dist
	yarn build
	@echo "Commiting changes..."
	git add -A
	git commit -m "make npm-publish"
	@echo "Pushing to git..."
	git push
	@echo "Publishing to npm..."
	npm version patch
	npm adduser
	npm publish
	@echo "Pushing to git..."
	git push
	@echo "Done."
