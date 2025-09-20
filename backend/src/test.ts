import { test, expect } from 'azle/test';
import { getCanister } from 'azle/canister';

/**
 * Unit tests for the Study Platform canister
 */
test('should register a new user', async () => {
    const canister = getCanister('study_platform_backend');
    
    const result = await canister.registerUser(
        'testuser',
        'test@example.com',
        ['Computer Science', 'Mathematics'],
        'intermediate'
    );
    
    expect(result).toBe('User testuser registered successfully with 100 study tokens!');
});

test('should create a study group', async () => {
    const canister = getCanister('study_platform_backend');
    
    const result = await canister.createStudyGroup(
        'Test Group',
        'A test study group',
        'Computer Science',
        'intermediate',
        10
    );
    
    expect(result).toContain('Study group "Test Group" created successfully!');
});

test('should get platform statistics', async () => {
    const canister = getCanister('study_platform_backend');
    
    const stats = await canister.getPlatformStats();
    
    expect(stats.totalUsers).toBeGreaterThanOrEqual(0);
    expect(stats.totalGroups).toBeGreaterThanOrEqual(0);
    expect(stats.totalResources).toBeGreaterThanOrEqual(0);
    expect(stats.totalSessions).toBeGreaterThanOrEqual(0);
});
