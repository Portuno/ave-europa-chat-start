# MABOT Integration for Ave Europa Chat

This document explains how to set up and use the MABOT integration in the Ave Europa chat application.

## Overview

The integration connects your Ave Europa chat interface to a MABOT instance, allowing users to interact with your configured bot through the web interface. **This is configured as a public demo where all users can chat without needing to log in.**

## Prerequisites

1. **MABOT Instance**: You need access to a MABOT instance with your bot "aveeuropa" already created
2. **MABOT Credentials**: Email and password for your MABOT account (configured in environment variables)
3. **Bot Configuration**: Your bot should be properly configured with chat flows, states, and actions

## Setup

### 1. Environment Variables

Copy the `env.example` file to `.env.local` and configure:

```bash
# MABOT API URL (your MABOT instance URL)
MABOT_API_URL=https://your-mabot-instance.com

# MABOT Bot Username (should be "aveeuropa")
MABOT_BOT_USERNAME=aveeuropa

# MABOT Credentials (for public demo)
MABOT_EMAIL=your-email@example.com
MABOT_PASSWORD=your-password
```

### 2. MABOT Bot Configuration

Ensure your bot "aveeuropa" in MABOT has:
- Proper input/output modalities configured
- Chat flows set up
- States and actions configured
- The bot is deployed and active

## How It Works

### Authentication Flow

1. **Automatic Authentication**: Credentials are pre-configured in environment variables
2. **Seamless Experience**: Users can start chatting immediately without any login process
3. **Token Management**: Access and refresh tokens are managed automatically in the background
4. **Auto-refresh**: Tokens are automatically refreshed when needed

### Chat Flow

1. **Message Input**: User types a message
2. **Automatic Authentication**: System automatically handles MABOT authentication
3. **UUID Generation**: Unique chat ID (UUID v4) generated for each session
4. **API Call**: Message sent to MABOT `/io/input` endpoint with UUID
5. **Bot Processing**: MABOT processes message through configured chat flows
6. **Response**: Bot response displayed in chat interface

### Error Handling

- **Authentication Errors**: Redirects to login modal
- **API Errors**: Displays error messages in chat
- **Network Issues**: Graceful fallback with retry options

## Features

### Real-time Chat
- Direct integration with MABOT bot responses
- No simulated responses
- Full chat history maintained

### Authentication Management
- Secure token storage
- Automatic token refresh
- **No login required** - credentials pre-configured
- Session persistence

### User Experience
- Loading states during API calls
- **Always connected** status indicator
- Quick help questions (available immediately)
- Chat reset functionality
- **Unique Chat IDs**: Each chat session gets a proper UUID v4 identifier

## API Endpoints Used

- `POST /auth/login` - User authentication
- `POST /auth/refresh` - Token refresh
- `POST /io/input` - Send messages to bot
- `GET /bot/{username}` - Get bot information

## Security Considerations

- **Pre-configured Credentials**: MABOT credentials are stored in environment variables for public demo
- **Token Security**: Access tokens stored in localStorage with expiration
- **HTTPS Required**: Production should use HTTPS for secure communication
- **Token Refresh**: Automatic token refresh prevents session expiration
- **Public Access**: All users can access the chat without authentication barriers

## Troubleshooting

### Common Issues

1. **"Authentication required" error**
   - Check if MABOT credentials are correctly set in environment variables
   - Verify bot username matches configuration
   - Ensure bot is active and deployed

2. **"Failed to send message" error**
   - Check MABOT API URL configuration
   - Verify network connectivity
   - Check MABOT instance status

3. **Token refresh failures**
   - Clear localStorage and re-authenticate
   - Check MABOT instance availability
   - Verify refresh token validity

### Debug Mode

Enable browser console logging to see detailed API calls and responses.

## Development

### Local Development

1. Set up environment variables (including MABOT credentials)
2. Ensure MABOT instance is accessible
3. Test automatic authentication
4. Verify chat functionality
5. **Debug Tools**: Use the debug panel to view current chat UUID and reset sessions

### Testing

- Test automatic authentication on app startup
- Test message sending and receiving
- Test token refresh scenarios
- Test error handling

## Production Deployment

1. **Environment Variables**: Set production MABOT API URL
2. **HTTPS**: Ensure secure communication
3. **Monitoring**: Monitor API response times and errors
4. **Backup**: Regular MABOT bot configuration backups

## Support

For MABOT-specific issues, refer to your MABOT instance documentation.
For integration issues, check the browser console for error details. 