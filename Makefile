.PHONY: npm-publish

npm-publish:
	@echo "Building..."
	yarn build
	@echo "Publishing to npm..."
	npm adduser
	npm publish
	@echo "Done."
