import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import CustomFonts from '../../constants/CustomFonts';
import {gMargin} from '../../constants/Sizes';
import {useTheme} from '../../context/ThemeContext';
import {TColors} from '../../types';
import {responsiveScreenFontSize} from 'react-native-responsive-dimensions';
import CustomMultiSelectDropDown from '../SharedComponent/CustomMultiSelectDropdown';

// Define the permission type
interface Permission {
  data: 'modifyEvent' | 'inviteOthers' | 'seeGuestList';
  type: 'Modify Event' | 'Invite Others' | 'See Guest List';
}

// Define the permissions object type
interface PermissionsObject {
  modifyEvent: boolean;
  inviteOthers: boolean;
  seeGuestList: boolean;
}

function transformToPermissionsObject(
  permissionsArray: Permission[],
): PermissionsObject {
  const allPermissions: PermissionsObject = {
    modifyEvent: false,
    inviteOthers: false,
    seeGuestList: false,
  };

  permissionsArray.forEach(permission => {
    if (permission.data in allPermissions) {
      allPermissions[permission.data] = true;
    }
  });

  return allPermissions;
}

function transformPermissions(
  permissionsObj: Partial<PermissionsObject>,
): Permission[] {
  const permissionMap: Record<string, string> = {
    modifyEvent: 'Modify Event',
    inviteOthers: 'Invite Others',
    seeGuestList: 'See Guest List',
  };

  return Object.entries(permissionsObj)
    .filter(([_, value]) => value === true) // Added filter for true values only
    .map(([key]) => ({
      data: key as keyof PermissionsObject,
      type: permissionMap[key] as Permission['type'],
    }));
}

interface EventPermissionsProps {
  onSelect: (permissions: PermissionsObject) => void;
  selected?: Partial<PermissionsObject>;
}

const EventPermissionsV2 = ({onSelect, selected}: EventPermissionsProps) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  return (
    <View style={{marginBottom: 10}}>
      <Text style={styles.Text}>Permissions</Text>
      <CustomMultiSelectDropDown
        options={
          [
            {data: 'modifyEvent', type: 'Modify Event'},
            {data: 'inviteOthers', type: 'Invite Others'},
            {data: 'seeGuestList', type: 'See Guest List'},
          ] as Permission[]
        }
        initialSelections={
          selected && Object.keys(selected).length > 0
            ? transformPermissions(selected)
            : []
        }
        setState={(mtd: Permission[]) => {
          onSelect(transformToPermissionsObject(mtd));
        }}
      />
    </View>
  );
};

export default EventPermissionsV2;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    Text: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      marginBottom: gMargin(2),
      color: Colors.Heading,
    },
  });
