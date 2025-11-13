# Privacy & GDPR Compliance - Product Requirements Document

**Last Updated**: 2025-11-13
**Status**: In Progress
**Owner**: Privacy & Compliance

---

## Overview

This document defines the privacy and GDPR compliance requirements for ZenType, ensuring full compliance with EU General Data Protection Regulation (GDPR), transparency in data processing, and respect for user data rights.

---

## Objectives

1. **GDPR Compliance**: Implement all required data subject rights and legal obligations
2. **Transparency**: Clearly communicate what data is collected, how it's used, and where it's stored
3. **User Control**: Give users full control over their data (consent, access, deletion, portability)
4. **Cookie Compliance**: Implement proper cookie consent mechanism following best practices
5. **Data Minimization**: Collect only necessary data for core functionality
6. **Privacy by Design**: Build privacy protection into the architecture from the start

---

## GDPR Data Subject Rights

### 1. Right to Access (Article 15)
**Implementation**: Allow users to download all their personal data
- User profile information
- Test results and performance history
- AI-generated tests
- Account settings and preferences

### 2. Right to Rectification (Article 16)
**Implementation**: Allow users to update/correct their data
- Edit profile information
- Update email address
- Modify preferences

### 3. Right to Erasure ("Right to be Forgotten") (Article 17)
**Implementation**: Allow users to delete their account and all associated data
- Delete user profile
- Delete all test results
- Delete AI-generated tests
- Remove from leaderboards
- **Status**: ✅ Implemented via Firebase Delete User Data Extension

### 4. Right to Restrict Processing (Article 18)
**Implementation**: Allow users to pause data processing
- Temporarily disable analytics tracking
- Pause AI test generation

### 5. Right to Data Portability (Article 20)
**Implementation**: Allow users to export their data in machine-readable format
- JSON export of all user data
- Downloadable via API endpoint

### 6. Right to Object (Article 21)
**Implementation**: Allow users to object to certain processing
- Opt-out of analytics
- Opt-out of performance tracking

### 7. Rights Related to Automated Decision Making (Article 22)
**Implementation**: Transparency about AI/automated processing
- Disclose AI-generated test creation
- No automated decisions that significantly affect users

### 8. Right to Withdraw Consent (Article 7)
**Implementation**: Allow users to withdraw consent at any time
- Revoke cookie consent
- Revoke analytics consent
- Easy to withdraw as it was to give

---

## Data Processing Details

### What Data We Collect

#### Strictly Necessary (No consent required)
- **User ID**: Firebase Authentication UID
- **Email Address**: For account management
- **Display Name**: User profile
- **Account Creation Date**: Timestamp
- **Authentication State**: Session management

#### Performance/Analytics (Requires consent)
- **Test Results**: WPM, accuracy, test duration
- **Test Configuration**: Mode, duration, language
- **Performance Metrics**: Historical trends
- **Leaderboard Positions**: Rankings

#### Functional (Requires consent)
- **User Preferences**: Theme, language, settings
- **AI-Generated Tests**: Custom test content
- **Usage Patterns**: Feature usage frequency

---

## Data Processors (Third Parties)

### Google Cloud Platform / Firebase
**What they process**:
- All application data (stored in Firestore)
- User authentication (Firebase Auth)
- File storage (Cloud Storage)
- Application hosting (Firebase App Hosting)
- Cloud Functions execution

**Data Location**: 
- Primary: `europe-west1` (Belgium) - EU/GDPR compliant
- Firestore: EU multi-region
- Authentication: Global with EU data residency

**Legal Basis**: Data Processing Agreement (DPA) with Google
**Subprocessors**: Google Cloud infrastructure providers

### Google Analytics (If enabled)
**What they process**:
- Page views, events, user interactions
- Device information, browser type
- Anonymous usage patterns

**Legal Basis**: User consent (Analytics cookies)
**Opt-out**: Via cookie consent banner

---

## Cookie Categories (Following CookieYes Best Practices)

### 1. Strictly Necessary Cookies
**Cannot be disabled** - Required for core functionality
- `authToken`: Firebase Authentication session
- `userId`: User identification
- `sessionId`: Session management

### 2. Analytics Cookies
**User consent required**
- Google Analytics cookies (if enabled)
- Performance monitoring
- **Default**: Disabled until consent given

### 3. Functional Cookies
**User consent required**
- User preferences (theme, language)
- Feature toggles
- **Default**: Disabled until consent given

### 4. Advertising Cookies
**User consent required**
- Currently: **NOT USED**
- Future: If ads are added, explicit consent required

---

## Consent Mechanism

### Design Requirements
1. **Prominent Banner**: Appears on first visit
2. **Granular Control**: Allow/deny by category
3. **Easy Access**: Settings page to manage preferences
4. **Clear Language**: Plain English, no legalese
5. **Pre-ticked Boxes**: ILLEGAL - must be unchecked by default
6. **Withdraw Consent**: As easy as giving it

### Implementation
- Cookie consent banner on landing page
- Settings page: `/settings/privacy`
- Consent stored in Firestore under `/users/{UID}/consents`
- Timestamp all consent actions

---

## Data Retention Policy

| Data Type | Retention Period | Deletion Trigger |
|-----------|------------------|------------------|
| Active User Data | Indefinite (while account active) | Account deletion |
| Test Results | Indefinite (while account active) | Account deletion |
| AI-Generated Tests | Indefinite (while account active) | Account deletion |
| Deleted Account Data | 30 days (backup retention) | Hard delete after 30 days |
| Analytics Data | 26 months (Google Analytics default) | Auto-deletion |
| Logs | 90 days | Auto-deletion |

---

## Privacy Policy Requirements

### Must Include
1. **Data Controller**: Who we are (ZenType)
2. **Data Protection Officer**: Contact information
3. **Legal Basis**: Why we process each type of data
4. **Data Sharing**: Third parties (Firebase/Google)
5. **User Rights**: All 8 GDPR rights explained
6. **Complaints**: Right to complain to supervisory authority
7. **Updates**: How we notify of policy changes

---

## Implementation Checklist

### Phase 1: Core Privacy Infrastructure
- [x] Firebase Delete User Data Extension installed
- [x] Extension configured for EU data center (europe-west1)
- [ ] Privacy documentation created
- [ ] Data processing details documented

### Phase 2: Cookie Consent System
- [ ] Design cookie consent banner
- [ ] Implement consent storage (Firestore)
- [ ] Create consent management UI
- [ ] Integrate consent with analytics

### Phase 3: User Data Rights
- [ ] Implement data access (download all data)
- [ ] Implement data rectification (edit profile)
- [ ] Implement data erasure (account deletion API)
- [ ] Implement data portability (export JSON)
- [ ] Implement restrict processing (pause analytics)

### Phase 4: Privacy Policy & Documentation
- [ ] Draft comprehensive privacy policy
- [ ] Create privacy settings page
- [ ] Add privacy policy link to footer
- [ ] Create FAQ for privacy questions

### Phase 5: Testing & Verification
- [ ] Test account deletion flow
- [ ] Test data export functionality
- [ ] Verify consent banner works
- [ ] Verify data is deleted from all locations

---

## Success Criteria

✅ **GDPR Compliant**: All 8 data subject rights implemented
✅ **Transparent**: Clear privacy policy and cookie consent
✅ **User Control**: Users can manage all their data and preferences
✅ **Secure**: Data stored in EU data centers
✅ **Auditable**: All consent and deletion actions logged

---

## References

- [GDPR Official Text](https://gdpr-info.eu/)
- [CookieYes Best Practices](https://www.cookieyes.com/blog/gdpr-consent-form-examples/)
- [Firebase Delete User Data Extension](https://github.com/firebase/extensions/tree/master/delete-user-data)
- [Google Cloud GDPR Compliance](https://cloud.google.com/privacy/gdpr)

---

## Related Documentation

- `/docs/account-deletion/` - Account deletion implementation
- `/docs/privacy/privacy.scope.md` - Privacy scope and boundaries
- `/docs/privacy/privacy.current.md` - Current implementation status
