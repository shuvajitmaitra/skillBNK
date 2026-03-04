import {
  View,
  ViewStyle,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import WebView from 'react-native-webview';
import {FontAwesomeIcon, MaterialIcon} from '../../constants/Icons';

// Assuming you have these icon libraries installed
// If not, you'll need to install: npm install react-native-vector-icons

type AdvancedEditorProps = {
  data: {
    initialData: string;
  };
  setData: (arg0: any) => void;
  containerStyle?: ViewStyle;
  onEditorReady?: () => void;
  debugMode?: boolean;
};

const AdvancedRichTextEditor = ({
  data,
  setData,
  containerStyle,
  onEditorReady,
  debugMode = false,
}: AdvancedEditorProps) => {
  const webviewRef = useRef<WebView>(null);
  const [status, setStatus] = useState({
    isLoaded: false,
    contentSet: false,
    error: null as string | null,
    logs: [] as string[],
    documentStats: {
      characters: 0,
      words: 0,
    },
    currentSelection: {
      isBold: false,
      isItalic: false,
      isUnderline: false,
      isStrikethrough: false,
      align: 'left',
      format: 'paragraph',
    },
  });

  // Keep track of the current font settings
  const [fontSettings, setFontSettings] = useState({
    font: 'Arial',
    size: '16',
  });

  // Simple function to add logs
  const addLog = (message: string) => {
    console.log(`[Editor] ${message}`);
    if (debugMode) {
      setStatus(prev => ({
        ...prev,
        logs: [...prev.logs, `${message}`],
      }));
    }
  };

  // Create a complete HTML editor with formatting toolbar
  const generateHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        <title>Advanced Rich Text Editor</title>
        <style>
          body {
            font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
            margin: 0;
            padding: 8px;
            overflow-x: hidden;
            background-color: white;
            color: #333;
          }
          #editor {
            border: none;
            min-height: 250px;
            padding: 12px;
            outline: none;
            font-size: 16px;
            line-height: 1.5;
            width: 100%;
            box-sizing: border-box;
            overflow-y: auto;
          }
          .paragraph {
            margin: 0.5em 0;
          }
          h1, h2, h3, h4, h5, h6 {
            margin: 0.5em 0;
            font-weight: bold;
          }
          blockquote {
            border-left: 3px solid #ccc;
            margin-left: 5px;
            padding-left: 15px;
            color: #666;
          }
          ul, ol {
            margin: 0.5em 0;
            padding-left: 30px;
          }
          .text-left {
            text-align: left;
          }
          .text-center {
            text-align: center;
          }
          .text-right {
            text-align: right;
          }
          .text-justify {
            text-align: justify;
          }
          #debug {
            margin-top: 8px;
            padding: 8px;
            background-color: #f5f5f5;
            border-radius: 4px;
            font-size: 12px;
            max-height: 100px;
            overflow-y: auto;
            display: ${debugMode ? 'block' : 'none'};
          }
        </style>
      </head>
      <body>
        <div id="editor" contenteditable="true"></div>
        <div id="debug"></div>
        
        <script>
          // Simple debugging function
          function log(message) {
            console.log(message);
            const debugElement = document.getElementById('debug');
            if (debugElement) {
              debugElement.innerHTML += message + '<br>';
              debugElement.scrollTop = debugElement.scrollHeight;
            }
            
            // Send to React Native
            try {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'LOG',
                message: message
              }));
            } catch (e) {
              console.error('Failed to send log to RN:', e);
            }
          }
          
          // Get editor element
          const editor = document.getElementById('editor');
          
          // Selection tracking
          let currentSelection = null;
          
          // Save selection when user selects text
          document.addEventListener('selectionchange', function() {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
              const range = selection.getRangeAt(0);
              
              // Only save if selection is inside the editor
              if (editor.contains(range.commonAncestorContainer)) {
                currentSelection = range;
                sendSelectionStatus();
              }
            }
          });
          
          // Send current selection formatting status to React Native
          function sendSelectionStatus() {
            if (!currentSelection) return;
            
            // Get the current formatting
            const isBold = document.queryCommandState('bold');
            const isItalic = document.queryCommandState('italic');
            const isUnderline = document.queryCommandState('underline');
            const isStrikethrough = document.queryCommandState('strikethrough');
            
            // Get current alignment and format
            let align = 'left';
            let format = 'paragraph';
            
            // Try to determine the current node format and alignment
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
              let node = selection.anchorNode;
              
              // Find the closest element node
              while (node && node.nodeType !== 1) {
                node = node.parentNode;
              }
              
              if (node) {
                // Check for alignment
                const textAlign = window.getComputedStyle(node).textAlign;
                if (textAlign) {
                  align = textAlign;
                }
                
                // Check format (paragraph, heading, etc)
                const nodeName = node.nodeName.toLowerCase();
                if (nodeName.match(/^h[1-6]$/)) {
                  format = nodeName;
                } else if (nodeName === 'p') {
                  format = 'paragraph';
                } else if (nodeName === 'blockquote') {
                  format = 'blockquote';
                } else if (nodeName === 'pre') {
                  format = 'pre';
                }
              }
            }
            
            // Send to React Native
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'SELECTION_STATUS',
              payload: {
                isBold,
                isItalic,
                isUnderline,
                isStrikethrough,
                align,
                format
              }
            }));
          }
          
          // Handle content changes
          editor.addEventListener('input', function() {
            updateDocumentContent();
            updateStats();
          });
          
          // Update document content
          function updateDocumentContent() {
            try {
              const htmlContent = editor.innerHTML;
              
              // Serialize content to match expected format
              const content = {
                root: {
                  children: [
                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: 'normal',
                          style: '',
                          text: editor.innerText || '',
                          type: 'text',
                          version: 1,
                        },
                      ],
                      direction: 'ltr',
                      format: '',
                      indent: 0,
                      type: 'paragraph',
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  type: 'root',
                  version: 1,
                  html: htmlContent, // Store HTML for better rendering
                }
              };
              
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'DOC_CHANGE',
                payload: content
              }));
            } catch (e) {
              log('Error sending content update: ' + e.toString());
            }
          }
          
          // Update document statistics
          function updateStats() {
            try {
              const text = editor.innerText || '';
              const charCount = text.length;
              const wordCount = text.trim() ? text.trim().split(/\\s+/).length : 0;
              
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'DOC_STATS',
                payload: {
                  characters: charCount,
                  words: wordCount
                }
              }));
            } catch (e) {
              log('Error sending stats: ' + e.toString());
            }
          }
          
          // Function to apply formatting
          window.applyFormatting = function(command, value = null) {
            try {
              // Restore selection if we have one
              if (currentSelection) {
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(currentSelection);
              }
              
              // Focus editor if not focused
              if (document.activeElement !== editor) {
                editor.focus();
              }
              
              // Apply command
              document.execCommand(command, false, value);
              
              // Update content
              updateDocumentContent();
              
              // Update selection status after formatting
              sendSelectionStatus();
              
              return true;
            } catch (e) {
              log('Error applying formatting: ' + e.toString());
              return false;
            }
          };
          
          // Function to set font
          window.setFont = function(fontName) {
            return window.applyFormatting('fontName', fontName);
          };
          
          // Function to set font size
          window.setFontSize = function(size) {
            return window.applyFormatting('fontSize', size);
          };
          
          // Function to set paragraph format
          window.setFormat = function(format) {
            let command = 'formatBlock';
            let value = format;
            
            if (format === 'paragraph') {
              value = 'p';
            } else if (format === 'normal') {
              value = 'p';
            } else if (format.match(/^h[1-6]$/)) {
              // heading levels already in correct format
            } else if (format === 'blockquote') {
              value = 'blockquote';
            } else if (format === 'pre') {
              value = 'pre';
            }
            
            return window.applyFormatting(command, value);
          };
          
          // Function to set text alignment
          window.setTextAlign = function(align) {
            return window.applyFormatting('justify' + align.charAt(0).toUpperCase() + align.slice(1));
          };
          
          // Function to set content
          window.setEditorContent = function(contentObj) {
            try {
              log('Setting editor content');
              
              if (contentObj && contentObj.root) {
                if (contentObj.root.html) {
                  // If we have HTML content, use it directly
                  editor.innerHTML = contentObj.root.html;
                } else if (contentObj.root.children && 
                        contentObj.root.children[0] && 
                        contentObj.root.children[0].children && 
                        contentObj.root.children[0].children[0]) {
                  
                  // Extract text content
                  const textContent = contentObj.root.children[0].children[0].text || '';
                  editor.innerHTML = '<p>' + textContent + '</p>';
                } else {
                  editor.innerHTML = '<p>Start writing here...</p>';
                }
                
                log('Content set successfully');
                
                // Update stats
                updateStats();
                
                // Notify React Native
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'CONTENT_SET_SUCCESS'
                }));
                
                return true;
              } else {
                log('Invalid content structure');
                editor.innerHTML = '<p>Start writing here...</p>';
                return false;
              }
            } catch (e) {
              log('Error setting content: ' + e.toString());
              
              // Notify React Native
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'CONTENT_SET_ERROR',
                error: e.toString()
              }));
              
              return false;
            }
          };
          
          // Insert image at current selection
          window.insertImage = function(imageUrl) {
            try {
              // Restore selection if we have one
              if (currentSelection) {
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(currentSelection);
              }
              
              // Focus editor if not focused
              if (document.activeElement !== editor) {
                editor.focus();
              }
              
              // Create image element
              const img = document.createElement('img');
              img.src = imageUrl;
              img.style.maxWidth = '100%';
              
              // Insert at current position
              document.execCommand('insertHTML', false, img.outerHTML);
              
              // Update content
              updateDocumentContent();
              
              return true;
            } catch (e) {
              log('Error inserting image: ' + e.toString());
              return false;
            }
          };
          
          // Insert link at current selection
          window.insertLink = function(url, text) {
            try {
              // Restore selection if we have one
              if (currentSelection) {
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(currentSelection);
              }
              
              // Focus editor if not focused
              if (document.activeElement !== editor) {
                editor.focus();
              }
              
              // If there's selected text, create link with selection
              if (!text) {
                document.execCommand('createLink', false, url);
              } else {
                // If text is provided, insert new link with that text
                const link = document.createElement('a');
                link.href = url;
                link.textContent = text;
                document.execCommand('insertHTML', false, link.outerHTML);
              }
              
              // Update content
              updateDocumentContent();
              
              return true;
            } catch (e) {
              log('Error inserting link: ' + e.toString());
              return false;
            }
          };
          
          // Notify when editor is ready
          log('Platform: ${Platform.OS}');
          log('Editor initialized');
          
          // Send ready signal
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'EDITOR_READY'
          }));
          
          // Initialize with empty content
          editor.innerHTML = '<p>Start writing here...</p>';
          updateStats();
        </script>
      </body>
      </html>
    `;
  };

  // Apply formatting - will be connected to toolbar buttons
  const applyFormatting = (command: string, value: string | null = null) => {
    if (!webviewRef.current) return;

    const jsCode = `
      (function() {
        try {
          const result = window.applyFormatting('${command}', ${
      value ? `'${value}'` : 'null'
    });
          true;
        } catch(e) {
          console.error('Error applying formatting:', e);
          false;
        }
      })();
    `;

    webviewRef.current.injectJavaScript(jsCode);
  };

  // Set paragraph format (heading, normal, etc.)
  const setFormat = (format: string) => {
    if (!webviewRef.current) return;

    const jsCode = `
      (function() {
        try {
          const result = window.setFormat('${format}');
          true;
        } catch(e) {
          console.error('Error setting format:', e);
          false;
        }
      })();
    `;

    webviewRef.current.injectJavaScript(jsCode);
  };

  // Set text alignment
  const setTextAlign = (align: string) => {
    if (!webviewRef.current) return;

    const jsCode = `
      (function() {
        try {
          const result = window.setTextAlign('${align}');
          true;
        } catch(e) {
          console.error('Error setting alignment:', e);
          false;
        }
      })();
    `;

    webviewRef.current.injectJavaScript(jsCode);
  };

  // Set font size
  const setFontSize = (size: string) => {
    if (!webviewRef.current) return;

    setFontSettings(prev => ({...prev, size}));

    const jsCode = `
      (function() {
        try {
          const result = window.setFontSize('${size}');
          true;
        } catch(e) {
          console.error('Error setting font size:', e);
          false;
        }
      })();
    `;

    webviewRef.current.injectJavaScript(jsCode);
  };

  // Insert image
  const insertImage = (url: string) => {
    if (!webviewRef.current) return;

    const jsCode = `
      (function() {
        try {
          const result = window.insertImage('${url}');
          true;
        } catch(e) {
          console.error('Error inserting image:', e);
          false;
        }
      })();
    `;

    webviewRef.current.injectJavaScript(jsCode);
  };

  // Insert link
  const insertLink = (url: string, text: string | null = null) => {
    if (!webviewRef.current) return;

    const jsCode = `
      (function() {
        try {
          const result = window.insertLink('${url}', ${
      text ? `'${text}'` : 'null'
    });
          true;
        } catch(e) {
          console.error('Error inserting link:', e);
          false;
        }
      })();
    `;

    webviewRef.current.injectJavaScript(jsCode);
  };

  // Handle messages from WebView
  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      switch (data.type) {
        case 'EDITOR_READY':
          addLog('Editor ready signal received');
          setStatus(prev => ({...prev, isLoaded: true}));
          onEditorReady && onEditorReady();
          break;

        case 'DOC_CHANGE':
          // Send data back to parent component
          setData({text: JSON.stringify(data.payload)});
          break;

        case 'DOC_STATS':
          if (data.payload) {
            setStatus(prev => ({
              ...prev,
              documentStats: {
                characters: data.payload.characters || 0,
                words: data.payload.words || 0,
              },
            }));
          }
          break;

        case 'SELECTION_STATUS':
          if (data.payload) {
            setStatus(prev => ({
              ...prev,
              currentSelection: {
                isBold: data.payload.isBold || false,
                isItalic: data.payload.isItalic || false,
                isUnderline: data.payload.isUnderline || false,
                isStrikethrough: data.payload.isStrikethrough || false,
                align: data.payload.align || 'left',
                format: data.payload.format || 'paragraph',
              },
            }));
          }
          break;

        case 'CONTENT_SET_SUCCESS':
          addLog('Content set successfully');
          setStatus(prev => ({...prev, contentSet: true}));
          break;

        case 'CONTENT_SET_ERROR':
          addLog(`Error setting content: ${data.error}`);
          setStatus(prev => ({
            ...prev,
            error: `Error setting content: ${data.error}`,
          }));
          break;

        case 'LOG':
          if (data.message) {
            addLog(`WebView: ${data.message}`);
          }
          break;

        default:
          addLog(`Unknown message type: ${data.type}`);
      }
    } catch (e) {
      addLog(`Error parsing message: ${e}`);
    }
  };

  // Set content when editor is ready
  useEffect(() => {
    if (status.isLoaded && webviewRef.current) {
      try {
        let contentToSet;

        try {
          // Try to parse initialData if it's a string
          contentToSet = data.initialData ? JSON.parse(data.initialData) : null;
        } catch (e) {
          addLog(`Error parsing initialData: ${e}`);
          contentToSet = null;
        }

        if (contentToSet) {
          const script = `
            (function() {
              try {
                window.setEditorContent(${JSON.stringify(contentToSet)});
                true;
              } catch (e) {
                console.error('Error in content injection:', e);
                false;
              }
            })();
          `;

          addLog('Injecting content script');
          webviewRef.current.injectJavaScript(script);
        } else {
          addLog('No valid content to set');
        }
      } catch (e) {
        addLog(`Error setting content: ${e}`);
      }
    }
  }, [status.isLoaded, data.initialData]);

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Top Toolbar */}
      <View style={styles.toolbarContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.toolbar}>
            {/* Paragraph Format Dropdown */}
            <View style={styles.toolbarGroup}>
              <TouchableOpacity
                style={styles.formatDropdown}
                onPress={() => {}}>
                <Text style={styles.dropdownText}>
                  {status.currentSelection.format === 'paragraph'
                    ? 'Paragraph'
                    : status.currentSelection.format === 'h1'
                    ? 'Heading 1'
                    : status.currentSelection.format === 'h2'
                    ? 'Heading 2'
                    : status.currentSelection.format === 'h3'
                    ? 'Heading 3'
                    : status.currentSelection.format === 'blockquote'
                    ? 'Quote'
                    : 'Paragraph'}
                </Text>
                <MaterialIcon name="arrow-drop-down" size={18} color="#444" />
              </TouchableOpacity>

              {/* Format Menu (you would implement the dropdown menu) */}
              {/* For simplicity, I'll add buttons that directly set formats */}
              <TouchableOpacity
                style={styles.formatButton}
                onPress={() => setFormat('paragraph')}>
                <Text style={styles.toolbarButtonText}>P</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.formatButton}
                onPress={() => setFormat('h1')}>
                <Text style={styles.toolbarButtonText}>H1</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.formatButton}
                onPress={() => setFormat('h2')}>
                <Text style={styles.toolbarButtonText}>H2</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.toolbarDivider} />

            {/* Font Family */}
            <View style={styles.toolbarGroup}>
              <TouchableOpacity
                style={styles.formatDropdown}
                onPress={() => {}}>
                <Text style={styles.dropdownText}>{fontSettings.font}</Text>
                <MaterialIcon name="arrow-drop-down" size={18} color="#444" />
              </TouchableOpacity>
            </View>

            <View style={styles.toolbarDivider} />

            {/* Font Size */}
            <View style={styles.toolbarGroup}>
              <TouchableOpacity
                style={styles.sizeButton}
                onPress={() => setFontSize('2')}>
                <Text style={styles.toolbarButtonText}>-</Text>
              </TouchableOpacity>
              <View style={styles.sizeDisplay}>
                <Text style={styles.sizeText}>{fontSettings.size}</Text>
              </View>
              <TouchableOpacity
                style={styles.sizeButton}
                onPress={() => setFontSize('4')}>
                <Text style={styles.toolbarButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.toolbarDivider} />

            {/* Text Formatting */}
            <View style={styles.toolbarGroup}>
              <TouchableOpacity
                style={[
                  styles.toolbarButton,
                  status.currentSelection.isBold && styles.activeButton,
                ]}
                onPress={() => applyFormatting('bold')}>
                <FontAwesomeIcon
                  name="bold"
                  size={16}
                  color={status.currentSelection.isBold ? '#007AFF' : '#444'}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.toolbarButton,
                  status.currentSelection.isItalic && styles.activeButton,
                ]}
                onPress={() => applyFormatting('italic')}>
                <FontAwesomeIcon
                  name="italic"
                  size={16}
                  color={status.currentSelection.isItalic ? '#007AFF' : '#444'}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.toolbarButton,
                  status.currentSelection.isUnderline && styles.activeButton,
                ]}
                onPress={() => applyFormatting('underline')}>
                <FontAwesomeIcon
                  name="underline"
                  size={16}
                  color={
                    status.currentSelection.isUnderline ? '#007AFF' : '#444'
                  }
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.toolbarButton,
                  status.currentSelection.isStrikethrough &&
                    styles.activeButton,
                ]}
                onPress={() => applyFormatting('strikethrough')}>
                <FontAwesomeIcon
                  name="strikethrough"
                  size={16}
                  color={
                    status.currentSelection.isStrikethrough ? '#007AFF' : '#444'
                  }
                />
              </TouchableOpacity>
            </View>

            <View style={styles.toolbarDivider} />

            {/* Text Alignment */}
            <View style={styles.toolbarGroup}>
              <TouchableOpacity
                style={[
                  styles.toolbarButton,
                  status.currentSelection.align === 'left' &&
                    styles.activeButton,
                ]}
                onPress={() => setTextAlign('left')}>
                <FontAwesomeIcon
                  name="align-left"
                  size={16}
                  color={
                    status.currentSelection.align === 'left'
                      ? '#007AFF'
                      : '#444'
                  }
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.toolbarButton,
                  status.currentSelection.align === 'center' &&
                    styles.activeButton,
                ]}
                onPress={() => setTextAlign('center')}>
                <FontAwesomeIcon
                  name="align-center"
                  size={16}
                  color={
                    status.currentSelection.align === 'center'
                      ? '#007AFF'
                      : '#444'
                  }
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.toolbarButton,
                  status.currentSelection.align === 'right' &&
                    styles.activeButton,
                ]}
                onPress={() => setTextAlign('right')}>
                <FontAwesomeIcon
                  name="align-right"
                  size={16}
                  color={
                    status.currentSelection.align === 'right'
                      ? '#007AFF'
                      : '#444'
                  }
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.toolbarButton,
                  status.currentSelection.align === 'justify' &&
                    styles.activeButton,
                ]}
                onPress={() => setTextAlign('full')}>
                <FontAwesomeIcon
                  name="align-justify"
                  size={16}
                  color={
                    status.currentSelection.align === 'justify'
                      ? '#007AFF'
                      : '#444'
                  }
                />
              </TouchableOpacity>
            </View>

            <View style={styles.toolbarDivider} />

            {/* Insert Buttons */}
            <View style={styles.toolbarGroup}>
              <TouchableOpacity
                style={styles.toolbarButton}
                onPress={() => insertLink('https://example.com', 'Link text')}>
                <FontAwesomeIcon name="link" size={16} color="#444" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.toolbarButton}
                onPress={() => insertImage('https://via.placeholder.com/300')}>
                <FontAwesomeIcon name="image" size={16} color="#444" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Editor */}
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        source={{html: generateHTML(), baseUrl: ''}}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        onError={e => {
          addLog(`WebView error: ${e.nativeEvent.description}`);
          setStatus(prev => ({
            ...prev,
            error: `WebView error: ${e.nativeEvent.description}`,
          }));
        }}
        style={styles.webview}
      />

      {/* Footer stats */}
      <View style={styles.footer}>
        <Text style={styles.statsText}>
          {status.documentStats.characters} characters |{' '}
          {status.documentStats.words} words
        </Text>
      </View>

      {/* Debug Panel */}
      {debugMode && (
        <View style={styles.debugPanel}>
          <Text style={styles.debugTitle}>
            Editor Debug (Platform: {Platform.OS})
          </Text>
          <Text>Editor Loaded: {status.isLoaded ? 'Yes' : 'No'}</Text>
          <Text>Content Set: {status.contentSet ? 'Yes' : 'No'}</Text>
          {status.error && <Text style={styles.errorText}>{status.error}</Text>}
          <View style={styles.logsContainer}>
            <Text style={styles.logsTitle}>Logs:</Text>
            <ScrollView style={styles.logs}>
              {status.logs.slice(-5).map((log, index) => (
                <Text key={index} style={styles.logEntry}>
                  {log}
                </Text>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
    backgroundColor: '#fff',
  },
  toolbarContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#f5f5f5',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  toolbarGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toolbarButton: {
    padding: 8,
    borderRadius: 4,
  },
  toolbarButtonText: {
    fontSize: 14,
    color: '#444',
  },
  activeButton: {
    backgroundColor: '#e6f2ff',
  },
  toolbarDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  formatDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dropdownText: {
    fontSize: 14,
    color: '#444',
    marginRight: 4,
  },
  formatButton: {
    padding: 6,
    borderRadius: 4,
    marginLeft: 4,
  },
  sizeButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sizeDisplay: {
    paddingHorizontal: 8,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sizeText: {
    fontSize: 14,
    color: '#444',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#f5f5f5',
  },
  statsText: {
    fontSize: 12,
    color: '#777',
  },
  debugPanel: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    maxHeight: 150,
  },
  debugTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  errorText: {
    color: 'red',
    marginVertical: 4,
  },
  logsContainer: {
    marginTop: 4,
  },
  logsTitle: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  logs: {
    maxHeight: 80,
    backgroundColor: '#fff',
    padding: 4,
    borderRadius: 4,
  },
  logEntry: {
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});

export default AdvancedRichTextEditor;
