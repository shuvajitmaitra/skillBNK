import {View} from 'react-native';
import React from 'react';
import GroupMemberInfo from './GroupMemberInfo';
import NoDataAvailable from '../../SharedComponent/NoDataAvailable';
import {useSelector} from 'react-redux';
import {RootState} from '../../../types/redux/root';
import GlobalSeeMoreButton from '../../SharedComponent/GlobalSeeMoreButton';
import {getArrayFromLocalStorage} from '../../../utility/mmkvHelpers';
import {mStore} from '../../../utility/mmkvStoreName';
import {fetchMembers} from '../../../actions/apiCall';

export default function GroupModalMembers() {
  const {crowdMembers, chatMemberInfo} = useSelector(
    (state: RootState) => state.chatSlice,
  );
  const {singleChat} = useSelector((state: RootState) => state.chat);

  const handleSeeMore = () => {
    fetchMembers({
      chatId: singleChat?._id,
      page: chatMemberInfo.page + 1,
      limit: chatMemberInfo.limit,
    });
  };
  const allMembers =
    crowdMembers.length !== 0
      ? crowdMembers
      : getArrayFromLocalStorage(mStore.ALL_CROWDS_MEMBERS)[singleChat?._id];
  return (
    <View>
      {/* <SearchAndFilter
        handleRadioButton={handleRadioButton}
        handleFilter={handleFilter}
      /> */}
      <>
        {allMembers?.map((item: any, index: number) => {
          return <GroupMemberInfo key={index} item={item} index={index} />;
        })}
      </>
      {(allMembers?.length === 0 && <NoDataAvailable />) ||
        (allMembers?.length < chatMemberInfo?.total && (
          <GlobalSeeMoreButton onPress={handleSeeMore} buttonStatus={false} />
        ))}
    </View>
  );
}
