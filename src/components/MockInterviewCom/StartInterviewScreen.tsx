import React, {useEffect, useMemo, useRef, useState, useCallback} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  RTCPeerConnection,
  RTCSessionDescription,
  mediaDevices,
} from 'react-native-webrtc';
import InCallManager from 'react-native-incall-manager';
import {useSelector} from 'react-redux';
import {RootState} from '../../types/redux/root';
import axiosInstance from '../../utility/axiosInstance';

// -------------------- WebRTC config --------------------
const RTC_CONFIGURATION = {
  iceServers: [{urls: 'stun:stun.l.google.com:19302'}],
};

// preview/beta fallback (backend না দিলে)
const FALLBACK_MODEL = 'gpt-4o-realtime-preview-2024-12-17';
const FALLBACK_VOICE = 'verse';

type ConnectStatus = 'notConnect' | 'connecting' | 'connected';
type Role = 'user' | 'assistant' | 'system';

type ConversationMessage = {
  id: string; // local id
  role: Role;
  text?: string; // transcript or assistant text
  audioUrl?: string | null; // if backend gives a URL later
  createdAt: number;
  truncated?: boolean;
  expanded?: boolean;
  meta?: {
    item_id?: string;
    response_id?: string;
    conversation_id?: string;
    event_id?: string;
    type?: string;
  };
};

function safeJsonParse<T = any>(s: string): T | null {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

function makeId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

// ---- UI helper: truncate ----
const TRUNCATE_AT = 180;
function computeTruncate(text?: string) {
  if (!text) return {truncated: false, preview: ''};
  const truncated = text.length > TRUNCATE_AT;
  const preview = truncated ? text.slice(0, TRUNCATE_AT) + '…' : text;
  return {truncated, preview};
}

// -------------------- Main component --------------------
export default function StartInterviewScreen() {
  const {singleInterview} = useSelector((state: RootState) => state.interview);

  const [connectStatus, setConnectStatus] =
    useState<ConnectStatus>('notConnect');
  const [debugText, setDebugText] = useState('');
  const [messages, setMessages] = useState<ConversationMessage[]>([]);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<any>(null);
  const localStreamRef = useRef<any>(null);

  const sessionConfigRef = useRef<{model: string; voice: string} | null>(null);

  // Keep these refs so we can stitch transcripts -> last message
  const lastUserMsgIdRef = useRef<string | null>(null);
  const lastAssistantMsgIdRef = useRef<string | null>(null);
  const conversationIdRef = useRef<string | null>(null);

  // -------------------- Permissions --------------------
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'android') return;
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'This app needs access to your microphone to talk.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn('Microphone permission denied');
        }
      } catch (err) {
        console.warn('Failed to request microphone permission', err);
      }
    })();

    return () => cleanup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buttonTitle = useMemo(() => {
    if (connectStatus === 'notConnect') return 'Connect';
    if (connectStatus === 'connecting') return 'Connecting...';
    return 'Disconnect';
  }, [connectStatus]);

  const setDebug = (s: string) => {
    console.log(s);
    setDebugText(s);
  };

  // -------------------- Cleanup --------------------
  const cleanup = () => {
    try {
      if (dcRef.current) {
        dcRef.current.onopen = null;
        dcRef.current.onmessage = null;
        dcRef.current.onerror = null;
        dcRef.current.onclose = null;
        dcRef.current.close();
        dcRef.current = null;
      }
    } catch {}

    try {
      if (pcRef.current) {
        pcRef.current.ontrack = null;
        pcRef.current.onconnectionstatechange = null;
        pcRef.current.close();
        pcRef.current = null;
      }
    } catch {}

    try {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t: any) => t.stop());
        localStreamRef.current = null;
      }
    } catch {}

    try {
      InCallManager.stop();
    } catch {}
  };

  // -------------------- Backend: log message --------------------
  // তুমি চাইলে endpoint বদলাতে পারো
  const postConversationToBackend = useCallback(
    async (msg: ConversationMessage) => {
      const interviewId = singleInterview?.interview?._id;
      if (!interviewId) return;

      // only send meaningful
      if (!msg.text || msg.text.trim().length === 0) return;

      try {
        await axiosInstance.post(`/interview/conversation/${interviewId}`, {
          role: msg.role,
          text: msg.text,
          createdAt: msg.createdAt,
          conversation_id:
            msg.meta?.conversation_id || conversationIdRef.current,
          item_id: msg.meta?.item_id,
          response_id: msg.meta?.response_id,
          event_type: msg.meta?.type,
          audio_url: msg.audioUrl || null,
        });
      } catch (e: any) {
        console.log('Failed to send message to backend:', e?.message || e);
      }
    },
    [singleInterview?.interview?._id],
  );

  // -------------------- UI: add/update message helpers --------------------
  const addMessage = useCallback((partial: Omit<ConversationMessage, 'id'>) => {
    const id = makeId(partial.role);
    const {truncated} = computeTruncate(partial.text);
    const msg: ConversationMessage = {
      id,
      ...partial,
      truncated,
      expanded: false,
    };
    setMessages(prev => [...prev, msg]);
    return id;
  }, []);

  const updateMessage = useCallback(
    (id: string, patch: Partial<ConversationMessage>) => {
      setMessages(prev =>
        prev.map(m => {
          if (m.id !== id) return m;
          const next = {...m, ...patch};
          const {truncated} = computeTruncate(next.text);
          next.truncated = truncated;
          return next;
        }),
      );
    },
    [],
  );

  const toggleExpand = useCallback((id: string) => {
    setMessages(prev =>
      prev.map(m => (m.id === id ? {...m, expanded: !m.expanded} : m)),
    );
  }, []);

  // -------------------- BACKEND TOKEN --------------------
  const getEphemeralClientSecretFromBackend = async (): Promise<{
    clientSecret: string;
    model: string;
    voice: string;
  }> => {
    const {data} = await axiosInstance.get(
      `/interview/gptession/${singleInterview?.interview?._id}`,
    );

    if (!data?.success) {
      throw new Error(data?.error || data?.message || 'Request failed');
    }

    const result = data.result ?? {};
    const clientSecret =
      result.client_secret?.value ?? result.client_secret ?? result.value ?? '';

    if (!clientSecret) throw new Error('Client secret not found in response');

    const model = result.model || FALLBACK_MODEL;
    const voice = result.voice || FALLBACK_VOICE;

    sessionConfigRef.current = {model, voice};
    return {clientSecret, model, voice};
  };

  // -------------------- DataChannel send --------------------
  const sendRealtimeEvent = (payload: any) => {
    const dc = dcRef.current;
    if (!dc || dc.readyState !== 'open') return;
    dc.send(JSON.stringify(payload));
  };

  // -------------------- OpenAI SDP exchange (Preview/Beta endpoint) --------------------
  const sendOfferToOpenAI_BETA = async (
    offerSdp: string,
    clientSecret: string,
    model: string,
  ) => {
    const url = `https://api.openai.com/v1/realtime?model=${encodeURIComponent(
      model,
    )}`;

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${clientSecret}`,
        'Content-Type': 'application/sdp',
      },
      body: offerSdp,
    });

    const answerSdp = await resp.text();
    if (!resp.ok) {
      throw new Error(
        `OpenAI /v1/realtime failed: ${resp.status} ${answerSdp}`,
      );
    }

    const pc = pcRef.current;
    if (!pc) throw new Error('PeerConnection missing while setting answer');

    await pc.setRemoteDescription(
      new RTCSessionDescription({type: 'answer', sdp: answerSdp}),
    );
  };

  // -------------------- Message stitching from events --------------------
  const ensureUserMessagePlaceholder = (meta?: any) => {
    const id = addMessage({
      role: 'user',
      text: '(Listening...)',
      audioUrl: null,
      createdAt: Date.now(),
      meta,
    });
    lastUserMsgIdRef.current = id;
    return id;
  };

  const ensureAssistantMessagePlaceholder = (meta?: any) => {
    const id = addMessage({
      role: 'assistant',
      text: '(Thinking...)',
      audioUrl: null,
      createdAt: Date.now(),
      meta,
    });
    lastAssistantMsgIdRef.current = id;
    return id;
  };

  // Handle events from OpenAI
  const handleRealtimeEvent = async (msg: any) => {
    const type = msg?.type;

    // capture conversation_id when available
    if (type === 'response.created' && msg?.response?.conversation_id) {
      conversationIdRef.current = msg.response.conversation_id;
    }

    // session created
    if (type === 'session.created') {
      setDebug('Session created ✅');
      return;
    }

    // user speech started/stopped/committed (we create placeholder on started)
    if (type === 'input_audio_buffer.speech_started') {
      ensureUserMessagePlaceholder({
        type,
        event_id: msg?.event_id,
        item_id: msg?.item_id,
        conversation_id: conversationIdRef.current || undefined,
      });
      return;
    }

    if (type === 'input_audio_buffer.committed') {
      // committed => trigger assistant response
      sendRealtimeEvent({
        type: 'response.create',
        response: {
          modalities: ['audio', 'text'],
          instructions:
            'Take interview in a friendly manner. Ask one question at a time. Keep it short.',
        },
      });
      return;
    }

    // If your account/session provides transcript events:
    if (
      type === 'conversation.item.added' ||
      type === 'conversation.item.created'
    ) {
      // Sometimes user item comes here with transcript
      const item = msg?.item;
      if (item?.role === 'user') {
        const content = item?.content?.[0];
        const transcript = content?.transcript;
        if (typeof transcript === 'string' && transcript.trim().length > 0) {
          const id = lastUserMsgIdRef.current;
          if (id) {
            updateMessage(id, {
              text: transcript,
              meta: {
                ...(messages.find(m => m.id === id)?.meta || {}),
                item_id: item?.id,
                conversation_id: conversationIdRef.current || undefined,
                type,
              },
            });
            // send to backend
            const updated: ConversationMessage = {
              ...(messages.find(m => m.id === id) as any),
              id,
              role: 'user',
              text: transcript,
              createdAt: Date.now(),
              meta: {
                item_id: item?.id,
                conversation_id: conversationIdRef.current || undefined,
                type,
              },
            };
            await postConversationToBackend(updated);
          }
        }
      }
      return;
    }

    // assistant transcript done (best text hook)
    if (
      type === 'response.audio_transcript.done' &&
      typeof msg?.transcript === 'string'
    ) {
      // ensure assistant bubble exists
      let aid = lastAssistantMsgIdRef.current;
      if (!aid) {
        aid = ensureAssistantMessagePlaceholder({
          type,
          response_id: msg?.response_id,
          conversation_id: conversationIdRef.current || undefined,
        });
      }

      updateMessage(aid, {
        text: msg.transcript,
        meta: {
          ...(messages.find(m => m.id === aid)?.meta || {}),
          type,
          response_id: msg?.response_id,
          conversation_id: conversationIdRef.current || undefined,
        },
      });

      // send to backend
      await postConversationToBackend({
        id: aid,
        role: 'assistant',
        text: msg.transcript,
        audioUrl: null,
        createdAt: Date.now(),
        truncated: msg.transcript.length > TRUNCATE_AT,
        expanded: false,
        meta: {
          type,
          response_id: msg?.response_id,
          conversation_id: conversationIdRef.current || undefined,
        },
      });

      return;
    }

    // Some servers may also send response.text.done
    if (type === 'response.text.done' && typeof msg?.text === 'string') {
      let aid = lastAssistantMsgIdRef.current;
      if (!aid) {
        aid = ensureAssistantMessagePlaceholder({
          type,
          response_id: msg?.response_id,
          conversation_id: conversationIdRef.current || undefined,
        });
      }

      updateMessage(aid, {
        text: msg.text,
        meta: {
          ...(messages.find(m => m.id === aid)?.meta || {}),
          type,
          response_id: msg?.response_id,
          conversation_id: conversationIdRef.current || undefined,
        },
      });

      await postConversationToBackend({
        id: aid,
        role: 'assistant',
        text: msg.text,
        audioUrl: null,
        createdAt: Date.now(),
        truncated: msg.text.length > TRUNCATE_AT,
        expanded: false,
        meta: {
          type,
          response_id: msg?.response_id,
          conversation_id: conversationIdRef.current || undefined,
        },
      });

      return;
    }

    // response created => create assistant placeholder so UI shows "assistant is replying"
    if (type === 'response.created') {
      ensureAssistantMessagePlaceholder({
        type,
        response_id: msg?.response?.id,
        conversation_id: msg?.response?.conversation_id,
      });
      return;
    }

    // failed response -> show as assistant error bubble and send to backend
    if (type === 'response.done' && msg?.response?.status === 'failed') {
      const err = msg?.response?.status_details?.error;
      const code = err?.code || err?.type || 'unknown_error';
      const message = err?.message || 'Unknown error';
      const text = `OpenAI error: ${code}\n${message}`;

      let aid = lastAssistantMsgIdRef.current;
      if (!aid) aid = ensureAssistantMessagePlaceholder({type});

      updateMessage(aid, {text});
      await postConversationToBackend({
        id: aid,
        role: 'assistant',
        text,
        audioUrl: null,
        createdAt: Date.now(),
        truncated: text.length > TRUNCATE_AT,
        expanded: false,
        meta: {type, conversation_id: conversationIdRef.current || undefined},
      });
      return;
    }
  };

  // -------------------- CONNECT --------------------
  const connect = async () => {
    if (connectStatus !== 'notConnect') return;

    setMessages([]);
    lastUserMsgIdRef.current = null;
    lastAssistantMsgIdRef.current = null;
    conversationIdRef.current = null;

    setDebugText('');
    setConnectStatus('connecting');

    try {
      setDebug('Fetching ephemeral token from backend...');
      const {clientSecret, model, voice} =
        await getEphemeralClientSecretFromBackend();
      setDebug(`Got token ✅ model=${model} voice=${voice}`);

      const pc = new RTCPeerConnection(RTC_CONFIGURATION);
      pcRef.current = pc;

      pc.onconnectionstatechange = () => {
        console.log('pc.connectionState:', pc.connectionState);
        if (
          pc.connectionState === 'failed' ||
          pc.connectionState === 'disconnected'
        ) {
          setDebug('Connection failed/disconnected.');
        }
      };

      setDebug('Getting local mic stream...');
      const localStream = await mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      if (!localStream || localStream.getTracks().length === 0) {
        throw new Error('No audio tracks in local stream');
      }
      localStreamRef.current = localStream;
      localStream
        .getTracks()
        .forEach((track: any) => pc.addTrack(track, localStream));

      pc.ontrack = (event: any) => {
        if (event?.streams?.[0]) {
          InCallManager.start({media: 'audio'});
          InCallManager.setSpeakerphoneOn(true);
        }
      };

      const dc = pc.createDataChannel('oai-events', {ordered: true});
      dcRef.current = dc;

      dc.onopen = () => {
        setDebug('Data channel open ✅ Speak now...');

        // update session to output audio+text
        sendRealtimeEvent({
          type: 'session.update',
          session: {
            modalities: ['audio', 'text'],
            voice,
            // transcription enable করতে চাইলে backend/session side লাগতে পারে
            // input_audio_transcription: { model: "gpt-4o-mini-transcribe" },
          },
        });

        // Initial greeting to create assistant bubble + voice output
        sendRealtimeEvent({
          type: 'response.create',
          response: {
            modalities: ['audio', 'text'],
            instructions:
              'Start the interview in English. Ask 1 short question about React Native.',
          },
        });
      };

      dc.onmessage = (event: any) => {
        const raw = event?.data;
        if (typeof raw !== 'string') return;
        const msg = safeJsonParse<any>(raw);
        if (!msg) return;
        handleRealtimeEvent(msg);
      };

      dc.onerror = (e: any) => console.log('DataChannel error:', e);
      dc.onclose = () => setDebug('Data channel closed');

      setDebug('Creating SDP offer...');
      const offer = await pc.createOffer({
        mandatory: {
          OfferToReceiveAudio: true,
          OfferToReceiveVideo: false,
          VoiceActivityDetection: true,
        },
      } as any);

      if (!offer?.sdp || !offer.sdp.includes('m=audio')) {
        throw new Error('Invalid SDP offer (missing m=audio).');
      }

      await pc.setLocalDescription(new RTCSessionDescription(offer));

      setDebug('Sending SDP to OpenAI (beta endpoint)...');
      await sendOfferToOpenAI_BETA(offer.sdp, clientSecret, model);

      setDebug('WebRTC connected ✅ Talk now.');
      setConnectStatus('connected');
    } catch (err: any) {
      console.log('Connect error:', err?.message || err);
      setDebug(err?.message || String(err));
      cleanup();
      setConnectStatus('notConnect');
    }
  };

  const disconnect = () => {
    cleanup();
    setConnectStatus('notConnect');
    setDebug('Disconnected');
  };

  // -------------------- UI: message card --------------------
  const renderItem = ({item}: {item: ConversationMessage}) => {
    const {preview, truncated} = computeTruncate(item.text || '');
    const showText = item.expanded ? item.text : preview;

    return (
      <View
        style={[
          styles.card,
          item.role === 'assistant' ? styles.cardAssistant : styles.cardUser,
        ]}>
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.badge,
              item.role === 'assistant'
                ? styles.badgeAssistant
                : styles.badgeUser,
            ]}>
            <Text style={styles.badgeText}>{item.role.toUpperCase()}</Text>
          </View>

          {truncated ? (
            <Text style={styles.truncatedLabel}>(Truncated)</Text>
          ) : null}
        </View>

        {showText ? <Text style={styles.cardText}>{showText}</Text> : null}

        {/* Expand/Collapse */}
        {truncated ? (
          <TouchableOpacity
            onPress={() => toggleExpand(item.id)}
            style={styles.expandBtn}>
            <Text style={styles.expandBtnText}>
              {item.expanded ? 'Show less' : 'Show more'}
            </Text>
          </TouchableOpacity>
        ) : null}

        {/* Audio bar UI (works if audioUrl exists; otherwise disabled UI) */}
        <View
          style={[
            styles.audioBar,
            !item.audioUrl ? styles.audioBarDisabled : null,
          ]}>
          <Text style={styles.audioPlayIcon}>{item.audioUrl ? '▶' : '⏸'}</Text>
          <View style={styles.audioProgressFake} />
          <Text style={styles.audioDurationFake}>
            {item.audioUrl ? '0:00 / 0:10' : '0:00 / 0:00'}
          </Text>
        </View>

        {item.audioUrl ? (
          <Text style={styles.audioHint}>Audio URL: {item.audioUrl}</Text>
        ) : null}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conversation</Text>

      <View style={styles.topRow}>
        <Button
          title={buttonTitle}
          onPress={() => {
            if (connectStatus === 'notConnect') connect();
            else disconnect();
          }}
          disabled={connectStatus === 'connecting'}
        />
      </View>

      <Text style={styles.debug}>{debugText || ''}</Text>

      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={messages}
        keyExtractor={m => m.id}
        renderItem={renderItem}
      />
    </View>
  );
}

// -------------------- Styles --------------------
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#0b0f17', paddingTop: 24},
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  topRow: {
    paddingHorizontal: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  debug: {
    color: '#b8c1d1',
    fontSize: 12,
    paddingHorizontal: 16,
    marginBottom: 6,
  },

  list: {flex: 1},
  listContent: {paddingHorizontal: 12, paddingBottom: 24},

  card: {
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
  },
  cardUser: {
    backgroundColor: '#131a26',
    borderColor: '#222b3b',
  },
  cardAssistant: {
    backgroundColor: '#0f2a66',
    borderColor: '#1f3c7e',
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  badge: {paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10},
  badgeUser: {backgroundColor: '#1f2937'},
  badgeAssistant: {backgroundColor: '#0b1b3d'},
  badgeText: {color: 'white', fontSize: 12, fontWeight: '700'},

  truncatedLabel: {color: '#cbd5e1', fontSize: 12, marginLeft: 6},

  cardText: {color: 'white', fontSize: 14, lineHeight: 20},

  expandBtn: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  expandBtnText: {color: '#9cc2ff', fontSize: 12, fontWeight: '600'},

  audioBar: {
    marginTop: 10,
    padding: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  audioBarDisabled: {opacity: 0.5},
  audioPlayIcon: {color: 'white', fontSize: 16, width: 20, textAlign: 'center'},
  audioProgressFake: {
    flex: 1,
    height: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  audioDurationFake: {color: 'white', fontSize: 12},

  audioHint: {color: '#d1e7ff', fontSize: 11, marginTop: 6},
});
