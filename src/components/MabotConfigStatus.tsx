import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { getMabotConfigStatus } from '../config/mabot';

const MabotConfigStatus = () => {
  const [configStatus, setConfigStatus] = useState<{
    apiUrl: string;
    botUsername: string;
    email: string;
    password: string;
    isValid: boolean;
  }>({
    apiUrl: '',
    botUsername: '',
    email: '',
    password: '',
    isValid: false,
  });

  useEffect(() => {
    const checkConfig = () => {
      const config = getMabotConfigStatus();
      const { apiUrl, botUsername, email, password } = config;
      
      const isValid = !!(apiUrl && botUsername && email && password);
      
      setConfigStatus({
        apiUrl,
        botUsername,
        email,
        password,
        isValid,
      });
    };

    checkConfig();
  }, []);

  if (configStatus.isValid) {
    return (
      <Alert className="mb-4 border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          MABOT configuration is complete and valid.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="mb-4 border-red-200 bg-red-50">
      <XCircle className="h-4 w-4 text-red-600" />
      <AlertDescription className="text-red-800">
        <div className="space-y-2">
          <div className="font-semibold">MABOT configuration is incomplete:</div>
          <div className="text-sm space-y-1">
            <div>
              <span className="font-mono">MABOT_API_URL:</span>{' '}
              {configStatus.apiUrl ? (
                <span className="text-green-600">✓ Set</span>
              ) : (
                <span className="text-red-600">✗ Missing</span>
              )}
            </div>
            <div>
              <span className="font-mono">MABOT_BOT_USERNAME:</span>{' '}
              {configStatus.botUsername ? (
                <span className="text-green-600">✓ Set</span>
              ) : (
                <span className="text-red-600">✗ Missing</span>
              )}
            </div>
            <div>
              <span className="font-mono">MABOT_EMAIL:</span>{' '}
              {configStatus.email ? (
                <span className="text-green-600">✓ Set</span>
              ) : (
                <span className="text-red-600">✗ Missing</span>
              )}
            </div>
            <div>
              <span className="font-mono">MABOT_PASSWORD:</span>{' '}
              {configStatus.password ? (
                <span className="text-green-600">✓ Set</span>
              ) : (
                <span className="text-red-600">✗ Missing</span>
              )}
            </div>
          </div>
          <div className="text-xs mt-2">
            Please check your <code className="bg-gray-100 px-1 rounded">.env.local</code> file.
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default MabotConfigStatus; 