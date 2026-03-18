.PHONY: help dev build test lint typecheck clean install seed

# Default target
help: ## Show available targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

dev: ## Start Next.js dev server
	npm run dev

build: ## Production build
	npm run build

test: ## Run tests (no tests yet)
	@echo "No tests yet."

lint: ## Run ESLint across src/
	npx eslint src/

typecheck: ## Type-check without emitting (tsc --noEmit)
	npx tsc --noEmit

clean: ## Remove .next/ and node_modules/
	rm -rf .next node_modules

install: ## Install dependencies
	npm install

# Requires POSTGRES_URL, ADMIN_USERNAME, and ADMIN_PASSWORD in environment.
# Example: POSTGRES_URL=... ADMIN_USERNAME=admin ADMIN_PASSWORD=... make seed
seed: ## Seed the database (reads env vars: POSTGRES_URL, ADMIN_USERNAME, ADMIN_PASSWORD)
	npx tsx scripts/seed.ts
