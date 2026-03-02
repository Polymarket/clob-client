.PHONY: build
build:
	@echo "Building ts code..."
	rm -rf dist
	pnpm tsc -p tsconfig.build.json

.PHONY: test
test:
	pnpm tsc -p tsconfig.test.json --noEmit
	pnpm vitest run --coverage

.PHONY: lint
lint:
	@echo "Linting code..."
	./node_modules/.bin/eslint ./src --ext .js,.ts
