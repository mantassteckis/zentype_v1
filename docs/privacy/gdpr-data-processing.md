# GDPR Data Processing Documentation

**Last Updated**: 2025-11-13
**Document Type**: Data Processing Details & Compliance Reference

---

## 📋 OVERVIEW

This document provides complete transparency about ZenType's data processing activities, storage locations, third-party processors, and legal compliance requirements under GDPR (General Data Protection Regulation).

---

## 🗄️ DATA WE COLLECT

### 1. Strictly Necessary Data (No Consent Required)

#### User Authentication Data
| Data Field | Purpose | Legal Basis | Retention |
|-----------|---------|-------------|-----------|
| Firebase UID | Unique user identifier | Legitimate interest (account management) | Until account deleted |
| Email Address | Account login, communication | Contract (service provision) | Until account deleted |
| Password (hashed) | Account security | Contract (service provision) | Until account deleted |
| Display Name | User profile | Contract (service provision) | Until account deleted |
| Account Creation Date | Account management | Legitimate interest | Until account deleted |
| Last Sign-In Date | Security, session management | Legitimate interest | Until account deleted |

**Storage Location**: Firebase Authentication (Global with EU data residency)
**Data Processor**: Google LLC

---

### 2. Performance Data (Requires Consent)

#### Test Results
| Data Field | Purpose | Legal Basis | Retention |
|-----------|---------|-------------|-----------|
| Test ID | Unique test identifier | Consent (analytics) | Until account deleted |
| Words Per Minute (WPM) | Performance tracking | Consent (analytics) | Until account deleted |
| Accuracy (%) | Performance tracking | Consent (analytics) | Until account deleted |
| Test Duration | Performance tracking | Consent (analytics) | Until account deleted |
| Test Mode | Performance tracking | Consent (analytics) | Until account deleted |
| Language | Test configuration | Consent (analytics) | Until account deleted |
| Timestamp | Historical tracking | Consent (analytics) | Until account deleted |

**Storage Location**: Firestore `/testResults/{UID}` (europe-west1, Belgium)
**Data Processor**: Google Cloud Platform

---

### 3. Functional Data (Requires Consent)

#### User Preferences
| Data Field | Purpose | Legal Basis | Retention |
|-----------|---------|-------------|-----------|
| Theme (dark/light) | User experience | Consent (functional) | Until account deleted |
| Language preference | User experience | Consent (functional) | Until account deleted |
| Sound effects enabled | User experience | Consent (functional) | Until account deleted |
| Key press sounds | User experience | Consent (functional) | Until account deleted |

**Storage Location**: Firestore `/users/{UID}/preferences` (europe-west1, Belgium)
**Data Processor**: Google Cloud Platform

#### AI-Generated Tests
| Data Field | Purpose | Legal Basis | Retention |
|-----------|---------|-------------|-----------|
| Test ID | Unique test identifier | Consent (functional) | Until account deleted |
| Test Content | Custom test text | Consent (functional) | Until account deleted |
| Generation Parameters | Test configuration | Consent (functional) | Until account deleted |
| Created Date | Test management | Consent (functional) | Until account deleted |

**Storage Location**: Firestore `/aiTests/{UID}` (europe-west1, Belgium)
**Data Processor**: Google Cloud Platform

---

### 4. Analytics Data (Requires Consent)

#### Google Analytics (If Enabled)
| Data Type | Purpose | Legal Basis | Retention |
|-----------|---------|-------------|-----------|
| Page views | Usage analytics | Consent (analytics) | 26 months |
| Events (clicks, interactions) | Usage analytics | Consent (analytics) | 26 months |
| Device information | Usage analytics | Consent (analytics) | 26 months |
| Browser type | Usage analytics | Consent (analytics) | 26 months |
| IP Address (anonymized) | Usage analytics | Consent (analytics) | 26 months |

**Storage Location**: Google Analytics (US/Global)
**Data Processor**: Google LLC
**Note**: IP anonymization enabled, no personally identifiable information collected

---

### 5. Log Data (Security & Operations)

#### Application Logs
| Data Type | Purpose | Legal Basis | Retention |
|-----------|---------|-------------|-----------|
| Correlation IDs | Request tracing | Legitimate interest (security) | 90 days |
| Error logs | Debugging, security | Legitimate interest (security) | 90 days |
| API access logs | Security monitoring | Legitimate interest (security) | 90 days |
| Performance metrics | System optimization | Legitimate interest (operations) | 90 days |

**Storage Location**: Cloud Functions Logs (europe-west1, Belgium)
**Data Processor**: Google Cloud Platform
**Auto-Deletion**: After 90 days

---

## 🌍 DATA STORAGE LOCATIONS

### Primary Storage: European Union (GDPR Compliant)

| Service | Location | Region Code | GDPR Status |
|---------|----------|-------------|-------------|
| **Firestore Database** | Belgium | `europe-west1` | ✅ EU Data Residency |
| **Cloud Functions** | Belgium | `europe-west1` | ✅ EU Execution |
| **Firebase Authentication** | Global with EU residency | Multi-region | ✅ EU Data Residency Option Enabled |
| **Cloud Storage** | EU Multi-region | `eu` | ✅ EU Data Residency |
| **Application Hosting** | Belgium | `europe-west1` | ✅ EU Hosting |

### Secondary/Third-Party Storage

| Service | Location | Purpose | GDPR Status |
|---------|----------|---------|-------------|
| **Google Analytics** | US/Global | Analytics (if consent given) | ✅ Data Processing Agreement (DPA) |

**Important**: No user data is stored outside the EU except for anonymized analytics data (with user consent).

---

## 🏢 DATA PROCESSORS (Third Parties)

### Primary Data Processor: Google Cloud Platform / Firebase

**Legal Entity**: Google LLC  
**Address**: 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA  
**GDPR Status**: ✅ GDPR-compliant Data Processing Agreement (DPA)

#### What Google Processes
- **Firebase Authentication**: User accounts, email addresses, authentication tokens
- **Cloud Firestore**: All application data (user profiles, test results, preferences)
- **Cloud Functions**: Serverless code execution, application logic
- **Cloud Storage**: File storage (if applicable)
- **Firebase App Hosting**: Application hosting and deployment

#### Google's GDPR Compliance
- ✅ Standard Contractual Clauses (SCCs) in place
- ✅ EU Data Processing Addendum signed
- ✅ Data stored in EU data centers (europe-west1)
- ✅ ISO 27001, ISO 27017, ISO 27018 certified
- ✅ SOC 2 Type II compliant

**References**:
- [Google Cloud GDPR Compliance](https://cloud.google.com/privacy/gdpr)
- [Firebase Data Processing Terms](https://firebase.google.com/terms/data-processing-terms)

---

### Secondary Data Processor: Google Analytics (If Enabled)

**Legal Entity**: Google LLC  
**GDPR Status**: ✅ Data Processing Agreement (DPA)  
**User Consent**: Required before activation

#### What Google Analytics Processes
- Page views, events, user interactions
- Device information, browser type
- Anonymized IP addresses
- Session duration, bounce rates

#### Google Analytics GDPR Compliance
- ✅ IP Anonymization enabled
- ✅ Data Retention set to 26 months
- ✅ Data Sharing with Google disabled
- ✅ User ID tracking pseudonymized

**References**:
- [Google Analytics GDPR FAQ](https://support.google.com/analytics/answer/9019185)

---

## 🔐 DATA SECURITY MEASURES

### Encryption

| Data Type | Encryption at Rest | Encryption in Transit |
|-----------|--------------------|-----------------------|
| Firestore Data | ✅ AES-256 | ✅ TLS 1.3 |
| Authentication Tokens | ✅ AES-256 | ✅ TLS 1.3 |
| Cloud Storage | ✅ AES-256 | ✅ TLS 1.3 |
| API Communication | N/A | ✅ TLS 1.3 |

### Access Controls
- **Authentication**: Firebase Authentication (OAuth 2.0)
- **Authorization**: Firestore Security Rules (user-based access)
- **Admin Access**: Firebase Admin SDK (server-side only, not exposed to clients)
- **Logging**: All data access logged with correlation IDs

### Backup & Disaster Recovery
- **Firestore**: Automatic daily backups (retained for 30 days)
- **Authentication**: Managed by Firebase (redundant systems)
- **Recovery Time Objective (RTO)**: < 4 hours
- **Recovery Point Objective (RPO)**: < 1 hour

---

## 📜 LEGAL BASIS FOR DATA PROCESSING

### GDPR Article 6 - Lawful Basis

| Data Type | Legal Basis | Article | Explanation |
|-----------|-------------|---------|-------------|
| User Authentication | Contract | Art. 6(1)(b) | Necessary to provide the service |
| Test Results | Consent | Art. 6(1)(a) | User explicitly consents to tracking |
| User Preferences | Legitimate Interest | Art. 6(1)(f) | Necessary for user experience |
| Analytics Data | Consent | Art. 6(1)(a) | User explicitly consents via cookie banner |
| Security Logs | Legitimate Interest | Art. 6(1)(f) | Necessary for security and fraud prevention |

---

## 🔄 DATA RETENTION POLICY

| Data Type | Retention Period | Deletion Trigger | Auto-Delete |
|-----------|------------------|------------------|-------------|
| Active User Data | Indefinite (while account active) | Account deletion | No |
| Test Results | Indefinite (while account active) | Account deletion | No |
| AI-Generated Tests | Indefinite (while account active) | Account deletion | No |
| User Preferences | Indefinite (while account active) | Account deletion | No |
| Deleted Account Data | 30 days (backup retention) | Hard delete after 30 days | Yes |
| Analytics Data | 26 months | Google Analytics auto-delete | Yes |
| Application Logs | 90 days | Auto-delete | Yes |
| Security Logs | 90 days | Auto-delete | Yes |

### Account Deletion Process
1. **User initiates deletion**: Via `/api/v1/user/delete-account`
2. **Immediate deletion**: Firebase Admin SDK deletes authentication account
3. **Extension triggers**: Firebase Delete User Data Extension automatically:
   - Deletes `/users/{UID}` document
   - Deletes all `/testResults/{UID}` documents
   - Deletes all `/aiTests/{UID}` documents
   - Auto-discovers and deletes orphaned data where `userId = {UID}`
4. **Backup retention**: Data remains in backups for 30 days (disaster recovery)
5. **Hard delete**: After 30 days, data is permanently deleted from backups

---

## 📞 DATA CONTROLLER INFORMATION

**Data Controller**: ZenType (Your Company Name)  
**Contact Email**: privacy@zentype.com (update this)  
**Data Protection Officer**: (Designate if required)  
**Address**: (Your company address)

### Your Rights (Data Subject Rights)
- ✅ Right to Access (Article 15)
- ✅ Right to Rectification (Article 16)
- ✅ Right to Erasure (Article 17)
- ✅ Right to Restrict Processing (Article 18)
- ✅ Right to Data Portability (Article 20)
- ✅ Right to Object (Article 21)
- ✅ Rights related to Automated Decision Making (Article 22)
- ✅ Right to Withdraw Consent (Article 7)

**Exercise Your Rights**: Contact privacy@zentype.com or use in-app settings

---

## 🚨 DATA BREACH NOTIFICATION

### Our Commitment
In the event of a data breach affecting your personal data:
- **Notification to Authorities**: Within 72 hours (GDPR Article 33)
- **Notification to Affected Users**: Without undue delay (GDPR Article 34)
- **Information Provided**: Nature of breach, likely consequences, measures taken

---

## 🌐 INTERNATIONAL DATA TRANSFERS

### Transfers Outside EU
Currently: **NO** data is transferred outside the EU for primary operations.

If analytics are enabled:
- **Google Analytics**: Data may be transferred to US
- **Legal Mechanism**: Standard Contractual Clauses (SCCs)
- **User Consent**: Required via cookie consent banner

---

## ✅ GDPR COMPLIANCE CHECKLIST

- [x] Data Processing Agreement (DPA) with Google
- [x] EU data residency for primary storage (europe-west1)
- [x] Encryption at rest and in transit
- [x] Data retention policy defined
- [x] Account deletion mechanism (Firebase extension)
- [ ] Privacy policy published
- [ ] Cookie consent banner implemented
- [ ] Data access endpoint (download data)
- [ ] Data portability endpoint (export JSON)
- [ ] Privacy settings page

---

## 📚 REFERENCES & RESOURCES

### GDPR Official Resources
- [GDPR Full Text](https://gdpr-info.eu/)
- [European Data Protection Board](https://edpb.europa.eu/)
- [ICO (UK) GDPR Guidance](https://ico.org.uk/for-organisations/guide-to-data-protection/guide-to-the-general-data-protection-regulation-gdpr/)

### Google Cloud GDPR Resources
- [Google Cloud Privacy](https://cloud.google.com/privacy)
- [Firebase GDPR Compliance](https://firebase.google.com/support/privacy)
- [Google Cloud DPA](https://cloud.google.com/terms/data-processing-addendum)

### Firebase Extensions
- [Delete User Data Extension](https://github.com/firebase/extensions/tree/master/delete-user-data)
- [Extensions Marketplace](https://extensions.dev/)

---

**Last Updated**: 2025-11-13  
**Next Review**: Quarterly or upon significant changes to data processing activities
