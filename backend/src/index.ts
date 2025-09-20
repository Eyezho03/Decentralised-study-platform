import { Canister, query, update, text, nat64, nat32, bool, Vec, Record, Principal, Opt, StableBTreeMap, ic } from 'azle';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

/**
 * User profile information stored on the blockchain
 */
const UserProfile = Record({
    id: Principal,
    username: text,
    email: text,
    subjects: Vec(text),
    skillLevel: text, // 'beginner', 'intermediate', 'advanced'
    studyTokens: nat64,
    studyStreak: nat32,
    achievements: Vec(text),
    createdAt: nat64,
    lastActiveAt: nat64
});

/**
 * Study group data structure
 */
const StudyGroup = Record({
    id: text,
    name: text,
    description: text,
    subject: text,
    skillLevel: text,
    maxMembers: nat32,
    currentMembers: nat32,
    members: Vec(Principal),
    creator: Principal,
    resources: Vec(Resource),
    studySessions: Vec(StudySession),
    createdAt: nat64,
    isActive: bool
});

/**
 * Study resource (documents, videos, etc.)
 */
const Resource = Record({
    id: text,
    title: text,
    description: text,
    type: text, // 'document', 'video', 'link', 'quiz'
    ipfsHash: text,
    uploader: Principal,
    uploadDate: nat64,
    downloads: nat32,
    rating: nat32
});

/**
 * Study session information
 */
const StudySession = Record({
    id: text,
    groupId: text,
    title: text,
    description: text,
    scheduledAt: nat64,
    duration: nat32, // in minutes
    participants: Vec(Principal),
    resources: Vec(text),
    completed: bool,
    notes: text
});

/**
 * Study match result for AI-powered matching
 */
const StudyMatch = Record({
    userId: Principal,
    groupId: text,
    compatibilityScore: nat32, // 0-100
    reasons: Vec(text)
});

/**
 * Achievement data
 */
const Achievement = Record({
    id: text,
    name: text,
    description: text,
    icon: text,
    points: nat32,
    requirements: Vec(text)
});

// ============================================================================
// STORAGE
// ============================================================================

// User profiles storage
const userProfiles = StableBTreeMap(Principal, UserProfile, 0);

// Study groups storage
const studyGroups = StableBTreeMap(text, StudyGroup, 1);

// Resources storage
const resources = StableBTreeMap(text, Resource, 2);

// Study sessions storage
const studySessions = StableBTreeMap(text, StudySession, 3);

// Achievements storage
const achievements = StableBTreeMap(text, Achievement, 4);

// User study tokens balance
const userTokens = StableBTreeMap(Principal, nat64, 5);

// ============================================================================
// MAIN CANISTER
// ============================================================================

export default Canister({
    // ========================================================================
    // USER MANAGEMENT
    // ========================================================================

    /**
     * Register a new user profile
     */
    registerUser: update([text, text, Vec(text), text], text, (username, email, subjects, skillLevel) => {
        const caller = ic.caller();
        
        // Check if user already exists
        if (userProfiles.contains(caller)) {
            return `User ${username} already exists`;
        }

        // Validate skill level
        const validSkillLevels = ['beginner', 'intermediate', 'advanced'];
        if (!validSkillLevels.includes(skillLevel)) {
            return 'Invalid skill level. Must be: beginner, intermediate, or advanced';
        }

        // Create user profile
        const userProfile: typeof UserProfile = {
            id: caller,
            username,
            email,
            subjects,
            skillLevel,
            studyTokens: 100n, // Starting tokens
            studyStreak: 0,
            achievements: [],
            createdAt: ic.time(),
            lastActiveAt: ic.time()
        };

        userProfiles.insert(caller, userProfile);
        userTokens.insert(caller, 100n);

        return `User ${username} registered successfully with 100 study tokens!`;
    }),

    /**
     * Get user profile by principal
     */
    getUserProfile: query([Principal], Opt(UserProfile), (userId) => {
        return userProfiles.get(userId);
    }),

    /**
     * Update user profile
     */
    updateUserProfile: update([text, Vec(text), text], text, (username, subjects, skillLevel) => {
        const caller = ic.caller();
        const userProfile = userProfiles.get(caller);

        if (userProfile.Some) {
            const updatedProfile = {
                ...userProfile.Some,
                username,
                subjects,
                skillLevel,
                lastActiveAt: ic.time()
            };
            userProfiles.insert(caller, updatedProfile);
            return `Profile updated successfully for ${username}`;
        }

        return 'User profile not found';
    }),

    // ========================================================================
    // STUDY GROUP MANAGEMENT
    // ========================================================================

    /**
     * Create a new study group
     */
    createStudyGroup: update([text, text, text, text, nat32], text, (name, description, subject, skillLevel, maxMembers) => {
        const caller = ic.caller();
        const userProfile = userProfiles.get(caller);

        if (userProfile.None) {
            return 'User must be registered to create study groups';
        }

        const groupId = `group_${ic.time()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const studyGroup: typeof StudyGroup = {
            id: groupId,
            name,
            description,
            subject,
            skillLevel,
            maxMembers,
            currentMembers: 1,
            members: [caller],
            creator: caller,
            resources: [],
            studySessions: [],
            createdAt: ic.time(),
            isActive: true
        };

        studyGroups.insert(groupId, studyGroup);
        
        // Award tokens for creating a group
        const currentTokens = userTokens.get(caller).Some || 0n;
        userTokens.insert(caller, currentTokens + 50n);

        return `Study group "${name}" created successfully! You earned 50 study tokens.`;
    }),

    /**
     * Join a study group
     */
    joinStudyGroup: update([text], text, (groupId) => {
        const caller = ic.caller();
        const group = studyGroups.get(groupId);
        const userProfile = userProfiles.get(caller);

        if (group.None) {
            return 'Study group not found';
        }

        if (userProfile.None) {
            return 'User must be registered to join study groups';
        }

        const groupData = group.Some;
        
        if (groupData.currentMembers >= groupData.maxMembers) {
            return 'Study group is full';
        }

        if (groupData.members.includes(caller)) {
            return 'You are already a member of this group';
        }

        // Add user to group
        const updatedGroup = {
            ...groupData,
            members: [...groupData.members, caller],
            currentMembers: groupData.currentMembers + 1
        };

        studyGroups.insert(groupId, updatedGroup);

        // Award tokens for joining
        const currentTokens = userTokens.get(caller).Some || 0n;
        userTokens.insert(caller, currentTokens + 25n);

        return `Successfully joined study group "${groupData.name}"! You earned 25 study tokens.`;
    }),

    /**
     * Get all study groups
     */
    getAllStudyGroups: query([], Vec(StudyGroup), () => {
        return studyGroups.values();
    }),

    /**
     * Get study groups by subject
     */
    getStudyGroupsBySubject: query([text], Vec(StudyGroup), (subject) => {
        return studyGroups.values().filter(group => group.subject === subject);
    }),

    /**
     * Get user's study groups
     */
    getUserStudyGroups: query([Principal], Vec(StudyGroup), (userId) => {
        return studyGroups.values().filter(group => group.members.includes(userId));
    }),

    // ========================================================================
    // RESOURCE MANAGEMENT
    // ========================================================================

    /**
     * Upload a study resource
     */
    uploadResource: update([text, text, text, text, text], text, (title, description, type, ipfsHash) => {
        const caller = ic.caller();
        const userProfile = userProfiles.get(caller);

        if (userProfile.None) {
            return 'User must be registered to upload resources';
        }

        const resourceId = `resource_${ic.time()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const resource: typeof Resource = {
            id: resourceId,
            title,
            description,
            type,
            ipfsHash,
            uploader: caller,
            uploadDate: ic.time(),
            downloads: 0,
            rating: 0
        };

        resources.insert(resourceId, resource);

        // Award tokens for uploading
        const currentTokens = userTokens.get(caller).Some || 0n;
        userTokens.insert(caller, currentTokens + 30n);

        return `Resource "${title}" uploaded successfully! You earned 30 study tokens.`;
    }),

    /**
     * Get all resources
     */
    getAllResources: query([], Vec(Resource), () => {
        return resources.values();
    }),

    /**
     * Get resources by type
     */
    getResourcesByType: query([text], Vec(Resource), (type) => {
        return resources.values().filter(resource => resource.type === type);
    }),

    /**
     * Download a resource (increments download count)
     */
    downloadResource: update([text], text, (resourceId) => {
        const resource = resources.get(resourceId);

        if (resource.None) {
            return 'Resource not found';
        }

        const resourceData = resource.Some;
        const updatedResource = {
            ...resourceData,
            downloads: resourceData.downloads + 1
        };

        resources.insert(resourceId, updatedResource);

        return `Resource "${resourceData.title}" downloaded successfully!`;
    }),

    // ========================================================================
    // STUDY SESSION MANAGEMENT
    // ========================================================================

    /**
     * Create a study session
     */
    createStudySession: update([text, text, text, text, nat64, nat32, Vec(text)], text, (groupId, title, description, scheduledAt, duration, resourceIds) => {
        const caller = ic.caller();
        const group = studyGroups.get(groupId);

        if (group.None) {
            return 'Study group not found';
        }

        const groupData = group.Some;
        
        if (!groupData.members.includes(caller)) {
            return 'Only group members can create study sessions';
        }

        const sessionId = `session_${ic.time()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const studySession: typeof StudySession = {
            id: sessionId,
            groupId,
            title,
            description,
            scheduledAt,
            duration,
            participants: [caller],
            resources: resourceIds,
            completed: false,
            notes: ''
        };

        studySessions.insert(sessionId, studySession);

        // Add session to group
        const updatedGroup = {
            ...groupData,
            studySessions: [...groupData.studySessions, studySession]
        };
        studyGroups.insert(groupId, updatedGroup);

        return `Study session "${title}" created successfully!`;
    }),

    /**
     * Join a study session
     */
    joinStudySession: update([text], text, (sessionId) => {
        const caller = ic.caller();
        const session = studySessions.get(sessionId);

        if (session.None) {
            return 'Study session not found';
        }

        const sessionData = session.Some;
        
        if (sessionData.participants.includes(caller)) {
            return 'You are already participating in this session';
        }

        const updatedSession = {
            ...sessionData,
            participants: [...sessionData.participants, caller]
        };

        studySessions.insert(sessionId, updatedSession);

        return `Successfully joined study session "${sessionData.title}"!`;
    }),

    /**
     * Complete a study session
     */
    completeStudySession: update([text, text], text, (sessionId, notes) => {
        const caller = ic.caller();
        const session = studySessions.get(sessionId);

        if (session.None) {
            return 'Study session not found';
        }

        const sessionData = session.Some;
        
        if (!sessionData.participants.includes(caller)) {
            return 'Only session participants can complete the session';
        }

        const updatedSession = {
            ...sessionData,
            completed: true,
            notes
        };

        studySessions.insert(sessionId, updatedSession);

        // Award tokens to all participants
        for (const participant of sessionData.participants) {
            const currentTokens = userTokens.get(participant).Some || 0n;
            userTokens.insert(participant, currentTokens + 40n);
        }

        return `Study session completed! All participants earned 40 study tokens.`;
    }),

    // ========================================================================
    // AI-POWERED STUDY MATCHING
    // ========================================================================

    /**
     * Find study matches for a user based on subjects and skill level
     */
    findStudyMatches: query([Principal], Vec(StudyMatch), (userId) => {
        const userProfile = userProfiles.get(userId);
        
        if (userProfile.None) {
            return [];
        }

        const user = userProfile.Some;
        const matches: typeof StudyMatch[] = [];

        for (const group of studyGroups.values()) {
            if (group.isActive && group.currentMembers < group.maxMembers && !group.members.includes(userId)) {
                let compatibilityScore = 0;
                const reasons: string[] = [];

                // Subject match
                if (user.subjects.includes(group.subject)) {
                    compatibilityScore += 40;
                    reasons.push(`Same subject: ${group.subject}`);
                }

                // Skill level match
                if (user.skillLevel === group.skillLevel) {
                    compatibilityScore += 30;
                    reasons.push(`Same skill level: ${group.skillLevel}`);
                } else {
                    // Partial skill level match
                    const skillLevels = ['beginner', 'intermediate', 'advanced'];
                    const userLevelIndex = skillLevels.indexOf(user.skillLevel);
                    const groupLevelIndex = skillLevels.indexOf(group.skillLevel);
                    
                    if (Math.abs(userLevelIndex - groupLevelIndex) === 1) {
                        compatibilityScore += 15;
                        reasons.push(`Compatible skill levels: ${user.skillLevel} and ${group.skillLevel}`);
                    }
                }

                // Group activity (based on recent sessions)
                const recentSessions = group.studySessions.filter(session => 
                    ic.time() - session.scheduledAt < 7 * 24 * 60 * 60 * 1000 * 1000 * 1000 // 7 days
                );
                if (recentSessions.length > 0) {
                    compatibilityScore += 20;
                    reasons.push('Active group with recent sessions');
                }

                // Group size preference
                if (group.currentMembers >= 3) {
                    compatibilityScore += 10;
                    reasons.push('Well-established group');
                }

                if (compatibilityScore >= 50) {
                    matches.push({
                        userId,
                        groupId: group.id,
                        compatibilityScore,
                        reasons
                    });
                }
            }
        }

        // Sort by compatibility score
        return matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    }),

    // ========================================================================
    // TOKEN SYSTEM AND ACHIEVEMENTS
    // ========================================================================

    /**
     * Get user's study tokens balance
     */
    getUserTokens: query([Principal], nat64, (userId) => {
        return userTokens.get(userId).Some || 0n;
    }),

    /**
     * Transfer study tokens between users
     */
    transferTokens: update([Principal, nat64], text, (recipient, amount) => {
        const caller = ic.caller();
        const callerTokens = userTokens.get(caller).Some || 0n;
        const recipientTokens = userTokens.get(recipient).Some || 0n;

        if (callerTokens < amount) {
            return 'Insufficient study tokens';
        }

        userTokens.insert(caller, callerTokens - amount);
        userTokens.insert(recipient, recipientTokens + amount);

        return `Transferred ${amount} study tokens successfully!`;
    }),

    /**
     * Update study streak
     */
    updateStudyStreak: update([Principal], text, (userId) => {
        const userProfile = userProfiles.get(userId);

        if (userProfile.None) {
            return 'User profile not found';
        }

        const user = userProfile.Some;
        const now = ic.time();
        const oneDay = 24 * 60 * 60 * 1000 * 1000 * 1000; // 1 day in nanoseconds

        let newStreak = user.studyStreak;
        
        if (now - user.lastActiveAt <= oneDay) {
            newStreak += 1;
        } else {
            newStreak = 1; // Reset streak
        }

        const updatedProfile = {
            ...user,
            studyStreak: newStreak,
            lastActiveAt: now
        };

        userProfiles.insert(userId, updatedProfile);

        // Award tokens for streaks
        if (newStreak % 7 === 0) {
            const currentTokens = userTokens.get(userId).Some || 0n;
            userTokens.insert(userId, currentTokens + 100n);
            return `Study streak updated to ${newStreak} days! You earned 100 bonus tokens for your ${newStreak}-day streak!`;
        }

        return `Study streak updated to ${newStreak} days!`;
    }),

    /**
     * Get user achievements
     */
    getUserAchievements: query([Principal], Vec(text), (userId) => {
        const userProfile = userProfiles.get(userId);
        
        if (userProfile.None) {
            return [];
        }

        return userProfile.Some.achievements;
    }),

    // ========================================================================
    // STATISTICS AND ANALYTICS
    // ========================================================================

    /**
     * Get platform statistics
     */
    getPlatformStats: query([], Record({
        totalUsers: nat32,
        totalGroups: nat32,
        totalResources: nat32,
        totalSessions: nat32,
        totalTokensDistributed: nat64
    }), () => {
        const totalUsers = userProfiles.len();
        const totalGroups = studyGroups.len();
        const totalResources = resources.len();
        const totalSessions = studySessions.len();
        
        let totalTokensDistributed = 0n;
        for (const tokens of userTokens.values()) {
            totalTokensDistributed += tokens;
        }

        return {
            totalUsers,
            totalGroups,
            totalResources,
            totalSessions,
            totalTokensDistributed
        };
    }),

    /**
     * Get user statistics
     */
    getUserStats: query([Principal], Record({
        studyTokens: nat64,
        studyStreak: nat32,
        groupsJoined: nat32,
        resourcesUploaded: nat32,
        sessionsParticipated: nat32,
        achievements: nat32
    }), (userId) => {
        const userProfile = userProfiles.get(userId);
        const tokens = userTokens.get(userId).Some || 0n;
        
        if (userProfile.None) {
            return {
                studyTokens: 0n,
                studyStreak: 0,
                groupsJoined: 0,
                resourcesUploaded: 0,
                sessionsParticipated: 0,
                achievements: 0
            };
        }

        const user = userProfile.Some;
        const groupsJoined = studyGroups.values().filter(group => group.members.includes(userId)).length;
        const resourcesUploaded = resources.values().filter(resource => resource.uploader === userId).length;
        const sessionsParticipated = studySessions.values().filter(session => session.participants.includes(userId)).length;

        return {
            studyTokens: tokens,
            studyStreak: user.studyStreak,
            groupsJoined,
            resourcesUploaded,
            sessionsParticipated,
            achievements: user.achievements.length
        };
    })
});
