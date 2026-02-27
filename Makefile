.PHONY: build
build:
	@echo "Building ts code..."
	rm -rf dist
	pnpm tsc -p tsconfig.build.json

.PHONY: test
test:
	rm -rf dist
	pnpm tsc -p tsconfig.json
	pnpm nyc -a --reporter=html --reporter=text \
		mocha \
		--require jsdom-global/register \
		"dist/tests/**/*.test.js" \
		--timeout 300000 \
		--exit

.PHONY: lint
lint:
	@echo "Linting code..."
	./node_modules/.bin/eslint ./src --ext .js,.ts
