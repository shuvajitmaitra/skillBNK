// AiDrawer.tsx
import React, {useState, useCallback} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from '../../../context/ThemeContext';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import CrossCircle from '../../../assets/Icons/CrossCircle';
import RightArrowButtonWithoutTail from '../../../assets/Icons/RightArrowButtonWithoutTail';
import CustomFonts from '../../../constants/CustomFonts';
import {RegularFonts} from '../../../constants/Fonts';
import GlobalRadioGroup2 from '../GlobalRadioGroup2';
import GlobalRadioGroup from '../GlobalRadioButton';
import {TColors} from '../../../types';

//
// Define types for the keywords and categories
//
interface Keyword {
  label: string;
  value: string;
}

type InputType = 'radio' | 'checkbox';

interface KeywordsCategory {
  title: string;
  keywords: Keyword[];
  inputType: InputType;
}

//
// Define the type for the selected values state.
// Each category key may be a string (for radio) or an array of strings (for checkbox)
//
export interface SelectedValues {
  [key: string]: string | string[];
}

//
// Define the props for AiDrawer
//
interface AiDrawerProps {
  generatedText: string;
  toggle: () => void;
  setSelectedValues: React.Dispatch<React.SetStateAction<SelectedValues>>;
  selectedValues: SelectedValues;
}

const AiDrawer: React.FC<AiDrawerProps> = ({
  generatedText = '',
  toggle,
  setSelectedValues,
  selectedValues,
}) => {
  const {top} = useSafeAreaInsets();
  const Colors = useTheme();
  const styles = getStyles(Colors, top);

  // Track which categories are expanded
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});

  const toggleCategory = useCallback((category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  }, []);

  // Define the categories with keywords
  const keywordsCategories: KeywordsCategory[] = [
    {
      title: 'Rewrite',
      keywords: [
        {label: 'Discussion', value: 'Rewrite as Discussion'},
        {label: 'Opinions', value: 'Rewrite as Opinions'},
        {label: 'Advise', value: 'Rewrite as Advise'},
        {label: 'Recommendations', value: 'Rewrite as Recommendations'},
        {label: 'Outstanding', value: 'Rewrite as Outstanding'},
        {label: 'Exceptional', value: 'Rewrite as Exceptional'},
        {label: 'Feedback', value: 'Rewrite as Feedback'},
      ],
      inputType: 'radio',
    },
    {
      title: 'Questions',
      keywords: [
        {
          label: 'What',
          value: `What is ${generatedText}? and answer with first line question and under write answer`,
        },
        {
          label: 'Why',
          value: `Why is used ${generatedText}? and answer with first line question and under write answer`,
        },
        {
          label: 'Where',
          value: `Where is used ${generatedText}? and answer with first line question and under write answer`,
        },
        {
          label: 'When',
          value: `When is use ${generatedText}? and answer with first line question and under write answer`,
        },
        {
          label: 'Advantage',
          value: `What is the Advantage of ${generatedText}? and answer with first line question and under write answer`,
        },
        {
          label: 'Disadvantages',
          value: `What is the Disadvantages of ${generatedText}? and answer with first line question and under write answer`,
        },
        {
          label: 'Alternative',
          value: `Alternative of ${generatedText}? and answer with first line question and under write answer`,
        },
        {
          label: 'How',
          value: `How to use ${generatedText}? and give the example? and answer with first line question and under write answer`,
        },
      ],
      inputType: 'checkbox',
    },
    {
      title: 'About',
      keywords: [
        {label: 'Objective', value: 'Objective'},
        {label: 'Mission', value: 'Mission'},
      ],
      inputType: 'checkbox',
    },
    {
      title: 'Styles',
      keywords: [
        {value: 'write with Professional', label: 'Professional'},
        {value: 'write with Formal', label: 'Formal'},
        {value: 'write with Informal', label: 'Informal'},
        {value: 'write with Funny', label: 'Funny'},
        {value: 'write with Humor', label: 'Humor'},
        {value: 'write with Political', label: 'Political'},
        {value: 'write with Motivational', label: 'Motivational'},
        {value: 'write with Inspirational', label: 'Inspirational'},
        {value: 'write with Sad', label: 'Sad'},
        {value: 'write with Sorrow', label: 'Sorrow'},
        {value: 'write with Welcoming', label: 'Welcoming'},
        {value: 'write with Excited', label: 'Excited'},
        {value: 'write with Innovative', label: 'Innovative'},
        {value: 'write with Revolutionary', label: 'Revolutionary'},
      ],
      inputType: 'radio',
    },
    {
      title: 'S Media posts',
      keywords: [
        {label: 'Engaging', value: 'Engaging'},
        {label: 'Lucrative', value: 'Lucrative'},
        {label: 'Quick Outcome centric', value: 'Quick Outcome centric'},
        {label: 'Exceptional', value: 'Exceptional'},
        {label: 'Ask questions to engage', value: 'Ask questions to engage'},
        {
          label: 'Provide constructive feedback',
          value: 'Provide constructive feedback',
        },
      ],
      inputType: 'checkbox',
    },
    {
      title: 'Size',
      keywords: [
        {label: 'Long', value: 'write in Long'},
        {label: 'Shots', value: 'write in Shots'},
        {label: 'Medium', value: 'write in Medium'},
        {label: '100 words', value: 'write in 100 words'},
        {label: '200 words', value: 'write in 200 words'},
      ],
      inputType: 'radio',
    },
    // Add more categories as needed
  ];

  // For radio selections (single choice)
  const handleRadioSelect = useCallback(
    (category: string, value: string | number) => {
      // If you need a string, you can convert it here:
      setSelectedValues(prev => ({
        ...prev,
        [category]: String(value),
      }));
    },
    [setSelectedValues],
  );
  // For checkbox selections (multiple choices)
  const handleCheckboxToggle = useCallback(
    (category: string, updatedSelections: string[]) => {
      setSelectedValues(prev => ({
        ...prev,
        [category]: updatedSelections,
      }));
    },
    [setSelectedValues],
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          toggle();
          // Optionally generate prompt here if needed
        }}
        style={styles.drawerContainer}>
        <CrossCircle size={40} />
      </TouchableOpacity>

      <ScrollView>
        <View style={{gap: 10, paddingBottom: 10}}>
          {keywordsCategories.map((item, index) => (
            <View
              key={`${item.title}-${index}`}
              style={{
                // backgroundColor: Colors.Red,
                borderRadius: 10,
                marginHorizontal: responsiveScreenWidth(4),
              }}>
              <TouchableOpacity
                onPress={() => toggleCategory(item.title)}
                style={styles.buttonContainer}>
                <Text style={styles.itemText}>{item.title}</Text>
                <RightArrowButtonWithoutTail
                  bgColor={Colors.Background_color}
                />
              </TouchableOpacity>
              <View
                style={{
                  paddingHorizontal: responsiveScreenWidth(8),
                  // paddingVertical: 10,
                  // backgroundColor: 'red',
                }}>
                {expandedCategories[item.title] &&
                  (item.inputType === 'radio' ? (
                    <GlobalRadioGroup
                      options={item.keywords}
                      selectedValue={
                        item.inputType === 'radio'
                          ? (selectedValues[item.title] as string | number)
                          : undefined
                      }
                      onSelect={(value: string | number) =>
                        handleRadioSelect(item.title, value as string)
                      }
                    />
                  ) : (
                    <GlobalRadioGroup2
                      options={item.keywords}
                      selected={
                        Array.isArray(selectedValues[item.title])
                          ? (selectedValues[item.title] as string[])
                          : []
                      }
                      onSelect={(updatedSelections: string[]) => {
                        handleCheckboxToggle(item.title, updatedSelections);
                      }}
                    />
                  ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default AiDrawer;

const getStyles = (Colors: TColors, top: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.Foreground,
      paddingTop: top,
    },
    drawerContainer: {
      borderRadius: 100,
      padding: 10,
      zIndex: 10,
    },
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.Background_color,
      justifyContent: 'space-between',
      paddingHorizontal: 10,
      borderRadius: 10,
      paddingVertical: 10,
    },
    itemText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: RegularFonts.HL,
      color: Colors.Heading,
    },
  });
