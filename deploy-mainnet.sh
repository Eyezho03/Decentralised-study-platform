#!/bin/bash

# Mainnet Deployment Script for Decentralized Study Platform
echo "🚀 Starting mainnet deployment..."

# Check if dfx is installed
if ! command -v dfx &> /dev/null; then
    echo "❌ dfx is not installed. Please install dfx first."
    echo "Visit: https://internetcomputer.org/docs/current/developer-docs/setup/install/"
    exit 1
fi

# Check if user is logged in
if ! dfx identity whoami &> /dev/null; then
    echo "❌ Please log in to dfx first:"
    echo "dfx identity new <your-identity-name>"
    echo "dfx identity use <your-identity-name>"
    exit 1
fi

echo "✅ dfx is ready"

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed"

# Deploy to mainnet
echo "🌐 Deploying to Internet Computer mainnet..."
dfx deploy --network ic

if [ $? -eq 0 ]; then
    echo "🎉 Deployment successful!"
    echo ""
    echo "📱 Your decentralized study platform is now live on mainnet!"
    echo "🌐 Frontend URL: https://$(dfx canister id study_platform_frontend --network ic).ic0.app"
    echo "🔧 Backend Canister ID: $(dfx canister id study_platform_backend --network ic)"
    echo ""
    echo "🔐 Users can now:"
    echo "  • Login with Internet Identity"
    echo "  • Create and join study groups"
    echo "  • Upload and share resources"
    echo "  • Earn study tokens"
    echo "  • Participate in study sessions"
    echo ""
    echo "🎯 Ready for real users!"
else
    echo "❌ Deployment failed"
    exit 1
fi
