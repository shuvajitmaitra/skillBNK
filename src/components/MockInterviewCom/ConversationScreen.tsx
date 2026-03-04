import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';

const ConversationScreen = () => {
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [ws, setWs] = useState(null);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    const connectWebSocket = async () => {
      // Simulate fetching from backend (replace with actual fetch)
      const response = {
        success: true,
        result: {
          client_secret: {
            value: 'ek_688b3515ef348191b6078820dd175404',
            expires_at: 1753954157,
          },
        },
      };
      const clientSecret = response.result.client_secret.value;
      if (!clientSecret) {
        console.error('No client secret available');
        return;
      }

      const wsUrl = `wss://api.openai.com/v1/realtime?client_secret=${encodeURIComponent(
        clientSecret,
      )}`;
      const webSocket = new WebSocket(wsUrl);

      webSocket.onopen = () => {
        console.log('WebSocket Connected at', new Date().toISOString());
        // Send an initial message to verify connection
        webSocket.send(JSON.stringify({type: 'ping'}));
      };

      webSocket.onmessage = event => {
        console.log('Message Received:', event.data);
        const data = JSON.parse(event.data);
        if (data.content) {
          setMessages(prev => [...prev, {text: data.content, isUser: false}]);
        }
      };

      webSocket.onerror = error => {
        console.error('WebSocket Error:', error.message);
      };

      webSocket.onclose = event => {
        console.log(
          'WebSocket Disconnected, Code:',
          event.code,
          'Reason:',
          event.reason,
        );
      };

      setWs(webSocket);

      return () => {
        if (webSocket.readyState === WebSocket.OPEN) webSocket.close();
      };
    };

    connectWebSocket();
  }, []);

  const handleSend = () => {
    if (ws && ws.readyState === WebSocket.OPEN && inputText.trim()) {
      const message = {
        type: 'conversation.item.create',
        item: {
          type: 'message',
          role: 'user',
          content: [{type: 'input_text', text: inputText}],
        },
      };
      ws.send(JSON.stringify(message));
      console.log('Sent:', message);
      setMessages(prev => [...prev, {text: inputText, isUser: true}]);
      setInputText('');
    } else {
      console.log('WebSocket not open or input empty');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conversation</Text>
      <View style={styles.conversationArea}>
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.message,
              msg.isUser ? styles.userMessage : styles.assistantMessage,
            ]}>
            <Text style={styles.messageText}>{msg.text}</Text>
          </View>
        ))}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor="#9ca3af"
        />
        <TouchableOpacity
          style={styles.micButton}
          onPress={() => setIsListening(!isListening)}>
          <Text style={styles.buttonText}>{isListening ? 'Stop' : 'Mic'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.pushToTalkButton} onPress={handleSend}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#1a202c', padding: 16},
  title: {color: '#ffffff', fontSize: 18, marginBottom: 16},
  conversationArea: {
    flex: 1,
    backgroundColor: '#1e3a8a',
    padding: 8,
    borderRadius: 8,
  },
  message: {marginBottom: 8, padding: 8, borderRadius: 4},
  userMessage: {backgroundColor: '#1e40af', alignSelf: 'flex-end'},
  assistantMessage: {backgroundColor: '#374151'},
  messageText: {color: '#ffffff'},
  inputContainer: {flexDirection: 'row', alignItems: 'center', marginTop: 16},
  input: {
    flex: 1,
    backgroundColor: '#4b5563',
    color: '#ffffff',
    padding: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  micButton: {
    backgroundColor: '#4b5563',
    padding: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  pushToTalkButton: {backgroundColor: '#3b82f6', padding: 8, borderRadius: 4},
  buttonText: {color: '#ffffff', textAlign: 'center'},
});

export default ConversationScreen;
