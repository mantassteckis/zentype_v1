/**
 * Firestore Security Rules Test Suite
 *
 * Tests the security rules to ensure proper access control.
 * Run with: node scripts/test-firestore-rules.js
 */

const { initializeTestEnvironment, assertFails, assertSucceeds } = require('@firebase/rules-unit-testing');
const fs = require('fs');

async function testRules() {
  console.log('🔐 Firestore Security Rules Test Suite');
  console.log('========================================\n');

  let testEnv;

  try {
    // Initialize test environment
    testEnv = await initializeTestEnvironment({
      projectId: 'solotype-23c1f',
      firestore: {
        host: '127.0.0.1',
        port: 8080,
        rules: fs.readFileSync('firestore.rules', 'utf8')
      }
    });

    console.log('✅ Test environment initialized\n');

    // Test 1: Unauthenticated user cannot read profiles
    console.log('Test 1: Unauthenticated user cannot read profiles');
    const unauthedDb = testEnv.unauthenticatedContext().firestore();
    await assertFails(unauthedDb.collection('profiles').doc('user123').get());
    console.log('✅ PASS: Unauth user cannot read profiles\n');

    // Test 2: Authenticated user can read own profile
    console.log('Test 2: Authenticated user can read own profile');
    const aliceDb = testEnv.authenticatedContext('alice').firestore();
    await assertSucceeds(aliceDb.collection('profiles').doc('alice').get());
    console.log('✅ PASS: User can read own profile\n');

    // Test 3: User cannot read another user's profile
    console.log('Test 3: User cannot read another user\'s profile');
    await assertFails(aliceDb.collection('profiles').doc('bob').get());
    console.log('✅ PASS: User cannot read other profiles\n');

    // Test 4: User can create own test result
    console.log('Test 4: User can create own test result');
    await assertSucceeds(aliceDb.collection('testResults').add({
      userId: 'alice',
      wpm: 50,
      accuracy: 95,
      errors: 5,
      timeTaken: 60,
      textLength: 100,
      userInput: 'test input',
      testType: 'practice',
      difficulty: 'Medium',
      testId: 'test123',
      createdAt: new Date()
    }));
    console.log('✅ PASS: User can create own test result\n');

    // Test 5: User cannot create test result for another user
    console.log('Test 5: User cannot create test result for another user');
    await assertFails(aliceDb.collection('testResults').add({
      userId: 'bob',
      wpm: 50,
      accuracy: 95
    }));
    console.log('✅ PASS: User cannot create test result for others\n');

    // Test 6: Unauthenticated user cannot read test contents
    console.log('Test 6: Unauthenticated user cannot read test contents');
    await assertFails(unauthedDb.collection('test_contents').doc('test1').get());
    console.log('✅ PASS: Unauth user cannot read test contents\n');

    // Test 7: Authenticated user can read test contents
    console.log('Test 7: Authenticated user can read test contents');
    await assertSucceeds(aliceDb.collection('test_contents').doc('test1').get());
    console.log('✅ PASS: Auth user can read test contents\n');

    // Test 8: Non-admin user cannot write to test_contents
    console.log('Test 8: Non-admin user cannot write to test_contents');
    await assertFails(aliceDb.collection('test_contents').add({
      text: 'test',
      difficulty: 'Easy'
    }));
    console.log('✅ PASS: Non-admin cannot write test contents\n');

    // Test 9: Admin user can write to test_contents
    console.log('Test 9: Admin user can write to test_contents');
    const adminDb = testEnv.authenticatedContext('admin', { admin: true }).firestore();
    await assertSucceeds(adminDb.collection('test_contents').add({
      text: 'test',
      difficulty: 'Easy'
    }));
    console.log('✅ PASS: Admin can write test contents\n');

    // Test 10: Leaderboards are read-only for regular users
    console.log('Test 10: Users cannot write to leaderboards directly');
    await assertFails(aliceDb.collection('leaderboard_all_time').doc('alice').set({
      avgWpm: 999
    }));
    console.log('✅ PASS: Users cannot write to leaderboards\n');

    // Test 11: Users can read leaderboards
    console.log('Test 11: Authenticated users can read leaderboards');
    await assertSucceeds(aliceDb.collection('leaderboard_all_time').get());
    console.log('✅ PASS: Users can read leaderboards\n');

    // Test 12: Only admins can read performance logs
    console.log('Test 12: Non-admin cannot read performance logs');
    await assertFails(aliceDb.collection('performance_logs').get());
    console.log('✅ PASS: Non-admin cannot read performance logs\n');

    console.log('========================================');
    console.log('✅ ALL FIRESTORE RULES TESTS PASSED!');
    console.log('========================================\n');

    process.exit(0);

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    process.exit(1);
  } finally {
    if (testEnv) {
      await testEnv.cleanup();
    }
  }
}

// Run tests
testRules().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
