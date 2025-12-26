.PHONY: build
build:
	@echo "Building ts code..."
	rm -rf dist
	pnpm tsc -p tsconfig.build.json

.PHONY: test
test:
	pnpm nyc -a \
		--reporter=html \
		--reporter=text mocha './tests' \
		--require jsdom-global/register \
		'tests/**/*.test.ts' \
		--timeout 300000 \
		--exit

.PHONY: lint
lint:
	@echo "Linting code..."
	./node_modules/.bin/eslint ./src --ext .js,.ts