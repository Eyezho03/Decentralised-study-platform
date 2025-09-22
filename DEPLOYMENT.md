# 🚀 Mainnet Deployment Guide

## Prerequisites

1. **Install DFX SDK**
   ```bash
   sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
   ```

2. **Create DFX Identity**
   ```bash
   dfx identity new mainnet-identity
   dfx identity use mainnet-identity
   ```

3. **Get ICP Tokens**
   - Visit [NNS Frontend](https://nns.ic0.app/)
   - Create a wallet and get some ICP tokens for canister deployment

## Deployment Steps

### 1. Build the Project
```bash
npm run build
```

### 2. Deploy to Mainnet
```bash
./deploy-mainnet.sh
```

Or manually:
```bash
dfx deploy --network ic
```

### 3. Get Your URLs
After deployment, you'll get:
- **Frontend URL**: `https://<canister-id>.ic0.app`
- **Backend Canister ID**: `<canister-id>`

## Environment Configuration

The platform automatically detects the environment:
- **Development**: Uses mock authentication and local canister
- **Production**: Uses Internet Identity and mainnet canister

## Features Available on Mainnet

✅ **Real Internet Identity Authentication**
✅ **Blockchain-based User Profiles**
✅ **Decentralized Study Groups**
✅ **Token-based Incentive System**
✅ **Real-time Data Persistence**
✅ **AI-powered Study Matching**
✅ **Gamification System**
✅ **Resource Management**
✅ **Session Scheduling**
✅ **Analytics Dashboard**

## Post-Deployment

1. **Test the platform** with Internet Identity login
2. **Create your first study group**
3. **Upload resources** and earn tokens
4. **Invite users** to join your platform

## Support

- **Documentation**: [Internet Computer Docs](https://internetcomputer.org/docs/)
- **Community**: [DFINITY Forum](https://forum.dfinity.org/)
- **Discord**: [ICP Developer Discord](https://discord.gg/jnjVVQaE2C)

---

🎉 **Your decentralized study platform is now live on the Internet Computer!**
