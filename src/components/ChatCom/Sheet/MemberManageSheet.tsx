import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import CustomBottomSheet from '../../SharedComponent/CustomBottomSheet';
import {useDispatch, useSelector} from 'react-redux';
import {setSelectedMembers} from '../../../store/reducer/chatSlice';
import CustomFonts from '../../../constants/CustomFonts';
import {useTheme} from '../../../context/ThemeContext';
import CustomeBtn from '../../AuthenticationCom/CustomeBtn';
import {handleRemoveUser, handleUpdateMember} from '../../../actions/apiCall';
import GlobalRadioGroup from '../../SharedComponent/GlobalRadioButton';
import ChatMuteModal from '../Modal/ChatMuteModal';
import {RootState} from '../../../types/redux/root';
import {TColors} from '../../../types';
import Divider2 from '../../SharedComponent/Divider2';

type MemberManageSheetProps = {
  option: {
    label: string;
    icon: React.ReactNode;
    function: (params: any) => void;
  }[];
  blockConfirm: boolean;
  removeConfirm: boolean;
  roleClicked: boolean;
  role: string;
  muteClicked: boolean;
  setRemoveConfirm: (confirm: boolean) => void;
  setBlockConfirm: (confirm: boolean) => void;
  setMuteClicked: (confirm: boolean) => void;
  setRoleClicked: (confirm: boolean) => void;
};
const MemberManageSheet = ({
  option,
  blockConfirm = false,
  removeConfirm = false,
  roleClicked = false,
  role,
  muteClicked = false,
  setRemoveConfirm = () => {},
  setBlockConfirm = () => {},
  setMuteClicked = () => {},
  setRoleClicked = () => {},
}: MemberManageSheetProps) => {
  const dispatch = useDispatch();
  const {selectedMember} = useSelector((state: RootState) => state.chatSlice);
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const options = [
    {label: 'Admin', value: 'admin'},
    {label: 'Moderator', value: 'moderator'},
    {label: 'Member', value: 'member'},
  ];

  const renderDivider = () => <Divider2 marginTop={10} marginBottom={10} />;
  return (
    <>
      {selectedMember?._id && (
        <CustomBottomSheet
          onBackdropPress={() => {
            dispatch(setSelectedMembers({}));
            setRemoveConfirm(false);
            setBlockConfirm(false);
            setMuteClicked(false);
            setRoleClicked(false);
          }}>
          {!muteClicked && !roleClicked && !blockConfirm && !removeConfirm && (
            <FlatList
              data={option}
              renderItem={({item}) => (
                <TouchableOpacity onPress={item.function} style={styles.list}>
                  {item.icon}
                  <Text style={styles.listText}>{item.label}</Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={renderDivider}
            />
          )}
          {muteClicked && (
            <ChatMuteModal
              fullName={selectedMember.user.fullName}
              onSave={action => {
                handleUpdateMember({
                  ...action,
                  chat: selectedMember?.chat,
                  member: selectedMember?._id,
                });
                setMuteClicked(false);
              }}
              onCancel={() => {
                dispatch(setSelectedMembers({}));
                setMuteClicked(false);
              }}
              mute={selectedMember.mute}
            />
          )}
          {roleClicked && (
            <GlobalRadioGroup
              options={options}
              onSelect={value => {
                handleUpdateMember({
                  actionType: 'role',
                  member: selectedMember?._id,
                  chat: selectedMember?.chat,
                  role: value,
                });
                setRoleClicked(false);
              }}
              selectedValue={role}
            />
          )}
          {blockConfirm && (
            <View>
              <Text style={styles.titleText}>
                Do you want to {selectedMember.isBlocked ? 'unblock' : 'block'}{' '}
                the user?
              </Text>
              <View style={{flexDirection: 'row', gap: 10, paddingBottom: 10}}>
                <CustomeBtn
                  handlePress={() => {
                    dispatch(setSelectedMembers({}));
                    setBlockConfirm(false);
                  }}
                  title="Cancel"
                  customeContainerStyle={{
                    flex: 0.5,
                    backgroundColor: Colors.SecondaryButtonBackgroundColor,
                    borderWidth: 1,
                    borderColor: Colors.BorderColor,
                  }}
                  buttonTextStyle={{color: Colors.SecondaryButtonTextColor}}
                  isLoading={false}
                  disable={false}
                />
                <CustomeBtn
                  handlePress={() => {
                    handleUpdateMember({
                      member: selectedMember?._id,
                      chat: selectedMember?.chat,
                      actionType: selectedMember.isBlocked
                        ? 'Unblock'
                        : 'block',
                    });
                    setBlockConfirm(false);
                  }}
                  title={selectedMember.isBlocked ? 'Unblock' : 'Block'}
                  customeContainerStyle={{
                    flex: 0.5,
                  }}
                  isLoading={false}
                  disable={false}
                />
              </View>
            </View>
          )}
          {removeConfirm && (
            <View>
              <Text style={styles.titleText}>
                Do you want to remove the user?
              </Text>
              <View style={{flexDirection: 'row', gap: 10}}>
                <CustomeBtn
                  handlePress={() => {
                    dispatch(setSelectedMembers({}));
                    setRemoveConfirm(false);
                  }}
                  title="Cancel"
                  customeContainerStyle={{
                    flex: 0.5,
                    backgroundColor: Colors.SecondaryButtonBackgroundColor,
                    borderWidth: 1,
                    borderColor: Colors.BorderColor,
                  }}
                  buttonTextStyle={{color: Colors.SecondaryButtonTextColor}}
                  isLoading={false}
                  disable={false}
                />
                <CustomeBtn
                  handlePress={() => {
                    handleRemoveUser(selectedMember);
                    setRemoveConfirm(false);
                  }}
                  title={'Remove'}
                  customeContainerStyle={{
                    flex: 0.5,
                    backgroundColor: Colors.Primary,
                  }}
                  buttonTextStyle={{color: Colors.PrimaryButtonTextColor}}
                  isLoading={false}
                  disable={false}
                />
              </View>
            </View>
          )}
        </CustomBottomSheet>
      )}
    </>
  );
};

export default MemberManageSheet;
const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    titleText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: 20,
      textAlign: 'center',
      color: Colors.Heading,
    },
    listText: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: 18,
    },
    list: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
  });
