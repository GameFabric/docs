#!/bin/bash

# validate-pr-title.sh
# Script to validate PR titles against Conventional Commits specification
# Usage: ./validate-pr-title.sh "your pr title here"

if [ -z "$1" ]; then
    echo "Usage: $0 \"PR title to validate\""
    echo ""
    echo "Example: $0 \"docs: add new guide\""
    exit 1
fi

PR_TITLE="$1"

# Regex from lint.yml workflow
# Allowed types: build|chore|ci|docs|feat|fix|perf|refactor|breaking|revert|style|test
# Format: type(optional-scope): description OR Merge ...
REGEX='^((build|chore|ci|docs|feat|fix|perf|refactor|breaking|revert|style|test)(\([-a-zA-Z0-9]+\))?(!)?(: [ /\\_\.a-zA-Z0-9-]+))|(Merge [ /\\_\.a-zA-Z0-9-]+)$'

if [[ "$PR_TITLE" =~ $REGEX ]]; then
    echo "✅ PR title is valid!"
    echo ""
    echo "Title: $PR_TITLE"
    exit 0
else
    echo "❌ PR title does not follow Conventional Commits format"
    echo ""
    echo "Current title: $PR_TITLE"
    echo ""
    echo "Expected format:"
    echo "  type(optional-scope): description"
    echo ""
    echo "Allowed types:"
    echo "  - build    : Changes to build system or dependencies"
    echo "  - chore    : Routine tasks, maintenance"
    echo "  - ci       : CI/CD configuration changes"
    echo "  - docs     : Documentation changes"
    echo "  - feat     : New features"
    echo "  - fix      : Bug fixes"
    echo "  - perf     : Performance improvements"
    echo "  - refactor : Code refactoring"
    echo "  - breaking : Breaking changes"
    echo "  - revert   : Revert previous changes"
    echo "  - style    : Code style/formatting changes"
    echo "  - test     : Test additions or modifications"
    echo ""
    echo "Examples:"
    echo "  ✅ docs: add API authentication guide"
    echo "  ✅ docs(glossary): link Cordoned term to Site entry"
    echo "  ✅ feat: add new multiplayer server configuration"
    echo "  ✅ fix(api): correct endpoint response format"
    echo ""
    echo "See https://www.conventionalcommits.org/en/v1.0.0/ for more details"
    exit 1
fi
