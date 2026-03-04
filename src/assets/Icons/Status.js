import React from 'react';
import {View} from 'react-native';
import CompleteIcon from '../../assets/Icons/CompleteIcon';
import IncompleteIcon from '../../assets/Icons/IncompleteIcon';

const Status = ({status}) => {
  return (
    <View>
      {status === 'complete' ? <CompleteIcon width={14} height={14} /> : null}
      {status === 'incomplete' ? (
        <IncompleteIcon width={14} height={14} />
      ) : null}
    </View>
  );
};

export default Status;
