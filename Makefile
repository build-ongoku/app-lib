.PHONY: npm-publish

npm-publish:
	@echo "Installing..."
	yarn install
	@echo "Building..."
	yarn build
	@echo "Commiting changes..."
	git add -A
	git commit -m "make npm-publish"
	@echo "Pushing to git..."
	git push
	@echo "Publishing to npm..."
	npm adduser
	npm publish
	@echo "Done."
