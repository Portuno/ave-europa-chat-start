# 🔐 UUID System for MABOT Chat

## Overview

The chat system now uses proper **UUID v4** identifiers for each chat session, ensuring unique and standardized identification for MABOT integration.

## 🆔 What is a UUID?

**UUID** (Universally Unique Identifier) is a 128-bit identifier that follows the RFC 4122 standard. Each chat session gets a unique UUID that looks like:

```
550e8400-e29b-41d4-a716-446655440000
```

## 🏗️ Implementation Details

### UUID Generation

The system uses two methods to generate UUIDs:

1. **Primary**: `crypto.randomUUID()` (native browser API)
2. **Fallback**: Custom UUID v4 implementation

```typescript
private generateChatId(): void {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    this.chatId = crypto.randomUUID();
  } else {
    this.chatId = this.generateUUIDv4();
  }
}
```

### UUID Validation

All generated UUIDs are validated using regex to ensure they follow the correct format:

```typescript
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
```

## 📋 UUID Format Breakdown

```
xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
│        │    │    │    │
│        │    │    │    └─ Random (12 chars)
│        │    │    └────── Variant (1 char, 8-9, a-b)
│        │    └─────────── Version (1 char, 4)
│        └───────────────── Time High (4 chars)
└────────────────────────── Time Low (8 chars)
```

## 🔄 Chat Session Lifecycle

1. **Session Start**: New UUID generated automatically
2. **Message Exchange**: Same UUID used for all messages in session
3. **Session Reset**: New UUID generated, old one discarded
4. **MABOT Integration**: UUID sent with every API call

## 🛠️ Debug Tools

### Development Mode

In development, you can access the debug panel (bottom-right corner) to:

- **View Current UUID**: See the active chat session ID
- **Copy UUID**: Copy UUID to clipboard for testing
- **Reset Chat**: Generate new UUID and clear session
- **Monitor Changes**: Watch UUID updates in real-time

### Console Logging

UUID generation is logged to the console:

```
Generated chat ID (UUID): 550e8400-e29b-41d4-a716-446655440000
```

## 🔒 Security & Privacy

- **Unique per session**: Each chat gets a different UUID
- **No personal data**: UUIDs contain no user information
- **Temporary**: UUIDs are discarded when sessions end
- **Random**: Impossible to predict or reverse-engineer

## 📡 MABOT API Integration

### Request Payload

```typescript
{
  platform: 'web',
  chat_id: '550e8400-e29b-41d4-a716-446655440000',
  platform_chat_id: '550e8400-e29b-41d4-a716-446655440000',
  messages: [...],
  bot_username: 'aveeuropa'
}
```

### Response Handling

MABOT returns the same UUID in responses, maintaining session consistency.

## 🧪 Testing UUIDs

### Valid UUID Examples

```typescript
// ✅ Valid UUIDs
'550e8400-e29b-41d4-a716-446655440000'
'6ba7b810-9dad-11d1-80b4-00c04fd430c8'
'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'

// ❌ Invalid UUIDs
'not-a-uuid'
'550e8400-e29b-41d4-a716'  // Too short
'550e8400-e29b-41d4-a716-446655440000-extra'  // Too long
```

### UUID Validation

```typescript
import { UUID_REGEX } from '@/lib/types/mabot';

const isValid = UUID_REGEX.test(uuid);
```

## 🚀 Benefits

1. **Standards Compliant**: Follows RFC 4122 specification
2. **Globally Unique**: Extremely low collision probability
3. **MABOT Compatible**: Matches expected format
4. **Debug Friendly**: Easy to track and troubleshoot
5. **Future Proof**: Industry standard identifier

## 🔧 Configuration

No additional configuration needed. UUIDs are generated automatically when:

- Chat interface initializes
- Chat session resets
- New chat starts

## 📚 References

- [RFC 4122 - UUID Specification](https://tools.ietf.org/html/rfc4122)
- [MDN - crypto.randomUUID()](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID)
- [UUID Version 4](https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_4_(random))

---

The UUID system ensures that every chat session is uniquely identifiable and follows industry standards for MABOT integration. 🎯 