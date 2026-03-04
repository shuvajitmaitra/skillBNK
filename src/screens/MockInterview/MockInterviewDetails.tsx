import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {TColors} from '../../types';
import {useTheme} from '../../context/ThemeContext';
import InterviewInstructionSection from '../../components/MockInterviewCom/InterviewInstructionSection';
import InterviewGuideModal from '../../components/MockInterviewCom/InterviewGuideModal';

const MockInterviewDetails = () => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [step, setStep] = useState<'intro' | 'guide' | 'interview'>('intro');
  console.log('step', JSON.stringify(step, null, 2));

  return (
    <View style={styles.container}>
      {step === 'intro' && (
        <InterviewInstructionSection
          onNextPress={() => {
            setStep('guide');
          }}
        />
      )}
      {step === 'guide' && (
        <InterviewGuideModal
          isVisible={step === 'guide'}
          onClose={() => {
            setStep('intro');
          }}
          onContinuePress={() => {
            setStep('interview');
          }}
        />
      )}
    </View>
  );
};

export default MockInterviewDetails;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.Background_color,
    },
  });
