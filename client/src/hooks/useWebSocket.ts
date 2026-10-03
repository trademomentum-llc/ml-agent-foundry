import { useEffect, useRef, useState } from "react";

interface WebSocketMessage {
  type: string;
  data?: any;
  timestamp?: number;
}


function sanitizeForLog(value: unknown, maxLen = 120): string {
  if (value == null) return "";
  const raw = typeof value === "string" ? value : String(value);
  return raw.replace(/[\u0000-\u001F\u007F\u2028\u2029]/g, "").slice(0, maxLen);
}

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("disconnected");
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setConnectionStatus("connecting");
    
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    try {
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        setConnectionStatus("connected");
        
        // Clear any existing reconnect timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      wsRef.current.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
        setConnectionStatus("disconnected");
        
        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setConnectionStatus("disconnected");
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          // Do not log raw payload (CodeQL js/log-injection); type only, sanitized.
          console.log("WebSocket message received type=%s len=%s", sanitizeForLog(message?.type, 64), String(typeof event.data === "string" ? event.data.length : 0));
          
          // Handle different message types
          switch (message.type) {
            case "connected":
              console.log("WebSocket connection confirmed");
              break;
            case "pong":
              console.log("WebSocket ping successful");
              break;
            default:
              // Dispatch custom event for other components to listen to
              window.dispatchEvent(
                new CustomEvent("websocket-message", {
                  detail: message,
                })
              );
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };
    } catch (error) {
      console.error("Error creating WebSocket connection:", error);
      setConnectionStatus("disconnected");
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setIsConnected(false);
    setConnectionStatus("disconnected");
  };

  const sendMessage = (message: WebSocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not connected. Cannot send message type=%s", sanitizeForLog(message?.type, 64));
    }
  };

  const ping = () => {
    sendMessage({ type: "ping" });
  };

  useEffect(() => {
    connect();
    
    // Ping every 30 seconds to keep connection alive
    const pingInterval = setInterval(ping, 30000);
    
    return () => {
      clearInterval(pingInterval);
      disconnect();
    };
  }, []);

  return {
    isConnected,
    connectionStatus,
    sendMessage,
    ping,
    connect,
    disconnect,
  };
}
