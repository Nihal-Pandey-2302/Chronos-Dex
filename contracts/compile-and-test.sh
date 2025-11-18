#!/bin/bash

# CHRONOS DEX - Compilation & Testing Script
# Run this from your chronos-dex/contracts directory

set -e  # Exit on error

echo "🚀 CHRONOS DEX - Compilation Script"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if CashScript is installed
if ! command -v cashc &> /dev/null; then
    echo -e "${RED}❌ CashScript compiler not found!${NC}"
    echo "Installing CashScript..."
    npm install -g cashc
fi

echo -e "${YELLOW}📦 CashScript version:${NC}"
cashc --version
echo ""

# Clean previous builds
echo -e "${YELLOW}🧹 Cleaning previous builds...${NC}"
rm -f *.json
rm -f *.debug
echo "✓ Cleaned"
echo ""

# Compile PoolFactory
echo -e "${YELLOW}📝 Compiling PoolFactory.cash...${NC}"
if cashc PoolFactory.cash -o PoolFactory.json; then
    echo -e "${GREEN}✅ PoolFactory.cash compiled successfully!${NC}"
    ls -lh PoolFactory.json
else
    echo -e "${RED}❌ PoolFactory.cash compilation failed!${NC}"
    exit 1
fi
echo ""

# Compile LiquidityPool
echo -e "${YELLOW}📝 Compiling LiquidityPool.cash...${NC}"
if cashc LiquidityPool.cash -o LiquidityPool.json; then
    echo -e "${GREEN}✅ LiquidityPool.cash compiled successfully!${NC}"
    ls -lh LiquidityPool.json
else
    echo -e "${RED}❌ LiquidityPool.cash compilation failed!${NC}"
    exit 1
fi
echo ""

# Compile GamificationVault
echo -e "${YELLOW}📝 Compiling GamificationVault.cash...${NC}"
if cashc GamificationVault.cash -o GamificationVault.json; then
    echo -e "${GREEN}✅ GamificationVault.cash compiled successfully!${NC}"
    ls -lh GamificationVault.json
else
    echo -e "${RED}❌ GamificationVault.cash compilation failed!${NC}"
    exit 1
fi
echo ""

# Compile SwapRouter
echo -e "${YELLOW}📝 Compiling SwapRouter.cash...${NC}"
if cashc SwapRouter.cash -o SwapRouter.json; then
    echo -e "${GREEN}✅ SwapRouter.cash compiled successfully!${NC}"
    ls -lh SwapRouter.json
else
    echo -e "${RED}❌ SwapRouter.cash compilation failed!${NC}"
    exit 1
fi
echo ""


# Display contract info
echo -e "${GREEN}✅ ALL CONTRACTS COMPILED SUCCESSFULLY!${NC}"
echo ""
echo "📊 Contract Artifacts:"
echo "====================="
for file in *.json; do
    if [ -f "$file" ]; then
        size=$(wc -c < "$file")
        echo "  $file: $size bytes"
    fi
done
echo ""

# Extract bytecode sizes
echo "📏 Bytecode Sizes:"
echo "=================="
for file in *.json; do
    if [ -f "$file" ]; then
        bytecode=$(jq -r '.bytecode' "$file" 2>/dev/null || echo "")
        if [ ! -z "$bytecode" ]; then
            bytecode_len=$((${#bytecode} / 2))
            echo "  ${file%.json}: $bytecode_len bytes"
        fi
    fi
done
echo ""

# Next steps
echo -e "${YELLOW}🎯 Next Steps:${NC}"
echo "1. All contracts compiled!"
echo "2. Write frontend logic (React + CashScript SDK)"
echo ""
echo -e "${GREEN}Contract development complete! 🚀${NC}"