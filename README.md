# 🎓 Decentralized Study Platform

A revolutionary decentralized learning platform built on Internet Computer (ICP) that enables students to collaborate, share resources, and earn tokens for their educational journey. This platform combines the power of blockchain technology with modern web development to create an incentivized, transparent, and community-driven learning ecosystem.

## ✨ Features

### 🚀 Core Features
- **Study Group Management**: Create, join, and manage study groups with like-minded learners
- **Token Incentive System**: Earn study tokens for participation, helping others, and maintaining study streaks
- **Resource Sharing**: Upload and share study materials with IPFS integration
- **Smart Study Matching**: AI-powered matching system connects you with perfect study partners
- **Progress Tracking**: Blockchain-based achievement system and study streak tracking
- **Decentralized Governance**: Community voting on platform improvements

### 🎯 Unique Features
1. **Token-based Incentive System** - Earn study tokens for participation and helping others
2. **Decentralized Resource Sharing** - Upload and share study materials with IPFS integration
3. **Smart Study Matching** - AI-powered matching based on subjects, skill levels, and availability
4. **Progress Tracking & Gamification** - Blockchain-based achievement system and study streaks
5. **Decentralized Governance** - Community voting on platform improvements

## 🏗️ Technology Stack

### Backend
- **Internet Computer (ICP)**: Decentralized blockchain platform
- **Azle**: TypeScript framework for ICP canisters
- **Candid**: Interface definition language for canister communication

### Frontend
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Lucide React**: Beautiful icon library

### Development Tools
- **dfx**: Internet Computer development environment
- **Vite**: Fast build tool and development server
- **ESLint & Prettier**: Code quality and formatting

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [dfx](https://internetcomputer.org/docs/current/developer-docs/setup/install/) (Internet Computer development environment)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/decentralized-study-platform.git
   cd decentralized-study-platform
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Start the local Internet Computer replica**
   ```bash
   dfx start --clean
   ```

4. **Deploy the canisters locally**
   ```bash
   dfx deploy
   ```

5. **Start the frontend development server**
   ```bash
   cd frontend
   npm start
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000` to view the application.

## 📱 Usage

### For Students

1. **Create Account**: Register with your email and select your subjects of interest
2. **Join Study Groups**: Browse and join study groups that match your learning goals
3. **Share Resources**: Upload study materials and earn tokens for valuable contributions
4. **Participate in Sessions**: Attend study sessions and collaborate with peers
5. **Track Progress**: Monitor your learning journey and earn achievements
6. **Earn Tokens**: Get rewarded for active participation and helping others

### For Study Group Creators

1. **Create Groups**: Set up study groups with specific subjects and skill levels
2. **Manage Members**: Invite and manage group members
3. **Schedule Sessions**: Plan and organize study sessions
4. **Share Resources**: Upload and organize study materials
5. **Track Engagement**: Monitor group activity and member participation

## 🔧 Development

### Project Structure

```
decentralized-study-platform/
├── backend/                 # Azle canister (TypeScript)
│   ├── src/
│   │   └── index.ts        # Main canister code
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── types/         # TypeScript type definitions
│   │   └── App.tsx        # Main app component
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
├── dfx.json               # DFX configuration
└── README.md
```

### Available Scripts

#### Root Level
```bash
npm run build          # Build both backend and frontend
npm run deploy:local   # Deploy to local replica
npm run deploy:mainnet # Deploy to mainnet
```

#### Backend
```bash
cd backend
npm run build         # Build the canister
npm run start         # Start development server
npm run deploy        # Deploy canister
npm run test          # Run tests
```

#### Frontend
```bash
cd frontend
npm start             # Start development server
npm run build         # Build for production
npm run test          # Run tests
npm run eject         # Eject from Create React App
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Internet Computer
REACT_APP_IC_HOST=http://localhost:8000
REACT_APP_CANISTER_ID=rrkah-fqaaa-aaaah-qcujq-cai

# Development
NODE_ENV=development
```

## 🌐 Deployment

### Local Development

1. **Start the local replica**:
   ```bash
   dfx start --clean
   ```

2. **Deploy canisters**:
   ```bash
   dfx deploy
   ```

3. **Start frontend**:
   ```bash
   cd frontend && npm start
   ```

### Mainnet Deployment

1. **Install Internet Identity**:
   - Visit [identity.ic0.app](https://identity.ic0.app)
   - Create an Internet Identity account

2. **Configure for mainnet**:
   ```bash
   dfx deploy --network ic
   ```

3. **Update frontend environment**:
   ```env
   REACT_APP_IC_HOST=https://ic0.app
   REACT_APP_CANISTER_ID=your-canister-id
   ```

4. **Build and deploy frontend**:
   ```bash
   cd frontend
   npm run build
   dfx deploy study_platform_frontend --network ic
   ```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Integration Tests
```bash
# Run end-to-end tests
npm run test:e2e
```

## 📊 API Documentation

### Canister Methods

#### User Management
- `registerUser(username, email, subjects, skillLevel)` - Register a new user
- `getUserProfile(userId)` - Get user profile information
- `updateUserProfile(username, subjects, skillLevel)` - Update user profile

#### Study Groups
- `createStudyGroup(name, description, subject, skillLevel, maxMembers)` - Create a study group
- `joinStudyGroup(groupId)` - Join a study group
- `getAllStudyGroups()` - Get all study groups
- `getStudyGroupsBySubject(subject)` - Get groups by subject
- `getUserStudyGroups(userId)` - Get user's groups

#### Resources
- `uploadResource(title, description, type, ipfsHash)` - Upload a study resource
- `getAllResources()` - Get all resources
- `downloadResource(resourceId)` - Download a resource

#### Study Sessions
- `createStudySession(groupId, title, description, scheduledAt, duration, resourceIds)` - Create a session
- `joinStudySession(sessionId)` - Join a study session
- `completeStudySession(sessionId, notes)` - Complete a session

#### Token System
- `getUserTokens(userId)` - Get user's token balance
- `transferTokens(recipient, amount)` - Transfer tokens
- `updateStudyStreak(userId)` - Update study streak

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow the existing code style
- Ensure all tests pass

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Internet Computer](https://internetcomputer.org/) for the decentralized platform
- [Azle](https://github.com/demergent-labs/azle) for the TypeScript framework
- [React](https://reactjs.org/) for the frontend framework
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework

## 📞 Support

If you have any questions or need help:

- Open an issue on GitHub
- Join our Discord community
- Email us at support@studyp platform.com

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ Basic study group management
- ✅ Token incentive system
- ✅ Resource sharing
- ✅ User profiles and authentication

### Phase 2 (Coming Soon)
- 🔄 Advanced AI matching algorithms
- 🔄 Video conferencing integration
- 🔄 Mobile app development
- 🔄 Advanced analytics dashboard

### Phase 3 (Future)
- 📅 NFT-based certificates
- 📅 Cross-chain token support
- 📅 Advanced governance features
- 📅 Enterprise partnerships

---

**Built with ❤️ on Internet Computer**

*Revolutionizing education through decentralized technology*
