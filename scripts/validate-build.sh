#!/bin/bash
# PRE-DEPLOY VALIDATION - Run before deploying to catch issues

echo "🔍 Running Pre-Deploy Validation..."

# 1. Check index.html exists and has content
if [ ! -f "dist/public/client/index.html" ]; then
    echo "❌ FAIL: index.html not found"
    exit 1
fi

INDEX_SIZE=$(stat -f%z "dist/public/client/index.html" 2>/dev/null || stat -c%s "dist/public/client/index.html")
if [ "$INDEX_SIZE" -lt 1000 ]; then
    echo "❌ FAIL: index.html too small ($INDEX_SIZE bytes)"
    exit 1
fi
echo "✅ index.html OK ($INDEX_SIZE bytes)"

# 2. Check JS bundle exists
JS_BUNDLE=$(find dist/public -name "index-*.js" 2>/dev/null | head -1)
if [ -z "$JS_BUNDLE" ]; then
    echo "❌ FAIL: No JS bundles found"
    exit 1
fi
echo "✅ JS bundles OK"

# 3. Check assets folder
if [ ! -d "dist/public/assets" ]; then
    echo "❌ FAIL: assets folder missing"
    exit 1
fi
echo "✅ assets folder OK"

# 4. Check for critical errors in build output
if grep -q "error" dist/public/client/index.html 2>/dev/null; then
    echo "⚠️  WARNING: 'error' found in index.html"
fi

echo "✅ All validations passed!"
exit 0

