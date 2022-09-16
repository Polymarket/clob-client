.PHONY: build
build:
	@echo "Building ts code..."
	rm -rf dist
	tsc --module commonjs

.PHONY: test
test:
	yarn nyc -a \
		--reporter=html \
		--reporter=text mocha './test' \
		--require esm \
		--require jsdom-global/register \
		--require ts-node/register 'test/**/*.test.ts' \
		--require tsconfig-paths/register \
		--timeout 10000 \
		--exit

.PHONY: lint
lint:
	@echo "Linting code..."
	./node_modules/.bin/eslint ./src --ext .js,.ts