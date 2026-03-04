export type TUpdateInfo = {
  url?: string | undefined;
  isMandatory?: boolean;
  version?: string; // Could be more specific like `${number}.${number}.${number}`
  releaseInfo?: string; // Could be typed as a Markdown string if you have a specific format
  minimized?: boolean;
  // Additional properties that might be present
  branch?: 'iOS' | 'android';
  bundlePath?: string;
};
