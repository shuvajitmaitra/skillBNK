import {Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback, memo, useMemo} from 'react';
import {useTheme} from '../../../context/ThemeContext';
import {
  borderRadius,
  fontSizes,
  gGap,
  gMargin,
  gPadding,
} from '../../../constants/Sizes';
import {FontAwesomeIcon, IoniconsIcon} from '../../../constants/Icons';
import GlobalCollapsibleChecklist from '../../SharedComponent/GlobalCollapsibleChecklist';
import {useDispatch, useSelector} from 'react-redux';
import {
  clearFilterParameters,
  ICalendarQuery,
  setFilterParameter,
} from '../../../store/reducer/calendarReducerV2';
import {RootState} from '../../../types/redux/root';
import ReactNativeModal from 'react-native-modal';
import CloseIcon from '../../../assets/Icons/CloseIcon';

interface EventFilterModalProps {
  visible: {x: number; y: number};
  onCancel: () => void;
}

const ensureArray = (value: unknown): string[] => {
  return Array.isArray(value) ? value.filter(v => typeof v === 'string') : [];
};

const hasNonEmptyArrays = (obj: ICalendarQuery | null): boolean => {
  if (!obj) return false;

  return ['priorities', 'statuses', 'roles', 'states'].some(key => {
    const value = (obj as any)[key];
    return Array.isArray(value) && value.length > 0;
  });
};

const EventFilterModal: React.FC<EventFilterModalProps> = ({
  visible,
  onCancel,
}) => {
  const Colors = useTheme();
  const dispatch = useDispatch();
  const {filterParameter} = useSelector((state: RootState) => state.calendarV2);

  const priorities = ensureArray(filterParameter?.priorities);
  const statuses = ensureArray(filterParameter?.statuses);
  const roles = ensureArray(filterParameter?.roles);
  const states = ensureArray(filterParameter?.states);

  const priorityItems = useMemo(
    () => [
      {
        icon: (
          <IoniconsIcon
            name="flag-outline"
            size={fontSizes.subHeading}
            color={Colors.BodyText}
          />
        ),
        id: 'low',
        label: 'Low Priority',
      },
      {
        icon: (
          <IoniconsIcon
            name="flag-outline"
            size={fontSizes.subHeading}
            color={Colors.BodyText}
          />
        ),
        id: 'medium',
        label: 'Medium Priority',
      },
      {
        icon: (
          <IoniconsIcon
            name="flag-outline"
            size={fontSizes.subHeading}
            color={Colors.BodyText}
          />
        ),
        id: 'high',
        label: 'High Priority',
      },
    ],
    [Colors.BodyText],
  );

  const statusItems = useMemo(
    () => [
      {
        icon: (
          <IoniconsIcon
            name="checkmark-circle-outline"
            size={fontSizes.subHeading}
            color={Colors.BodyText}
          />
        ),
        id: 'accepted',
        label: 'Accepted',
      },
      {
        icon: (
          <IoniconsIcon
            name="time-outline"
            size={fontSizes.subHeading}
            color={Colors.BodyText}
          />
        ),
        id: 'pending',
        label: 'Pending',
      },
      {
        icon: (
          <IoniconsIcon
            name="close-circle-outline"
            size={fontSizes.subHeading}
            color={Colors.BodyText}
          />
        ),
        id: 'denied',
        label: 'Denied',
      },
      {
        icon: (
          <IoniconsIcon
            name="checkmark-done-outline"
            size={fontSizes.subHeading}
            color={Colors.BodyText}
          />
        ),
        id: 'finished',
        label: 'Finished',
      },
    ],
    [Colors.BodyText],
  );

  const roleItems = useMemo(
    () => [
      {
        icon: (
          <IoniconsIcon
            name="person-outline"
            size={fontSizes.subHeading}
            color={Colors.BodyText}
          />
        ),
        id: 'organizer',
        label: 'Organizer',
      },
    ],
    [Colors.BodyText],
  );

  const stateItems = useMemo(
    () => [
      {
        icon: (
          <FontAwesomeIcon
            name="calendar-check-o"
            size={fontSizes.subHeading}
            color={Colors.BodyText}
          />
        ),
        id: 'confirmed',
        label: 'Confirmed Events',
      },
      {
        icon: (
          <FontAwesomeIcon
            name="calendar-times-o"
            size={fontSizes.subHeading}
            color={Colors.BodyText}
          />
        ),
        id: 'cancelled',
        label: 'Cancelled Events',
      },
      {
        icon: (
          <IoniconsIcon
            name="list-outline"
            size={fontSizes.subHeading}
            color={Colors.BodyText}
          />
        ),
        id: 'todo',
        label: 'Tasks (Todo)',
      },
      {
        icon: (
          <IoniconsIcon
            name="hourglass-outline"
            size={fontSizes.subHeading}
            color={Colors.BodyText}
          />
        ),
        id: 'inprogress',
        label: 'Tasks (In Progress)',
      },
      {
        icon: (
          <IoniconsIcon
            name="checkmark-done-outline"
            size={fontSizes.subHeading}
            color={Colors.BodyText}
          />
        ),
        id: 'completed',
        label: 'Tasks (Completed)',
      },
    ],
    [Colors.BodyText],
  );

  const handlePrioritiesChange = useCallback(
    (items: string[]) => {
      dispatch(setFilterParameter({priorities: items}));
    },
    [dispatch],
  );

  const handleStatusesChange = useCallback(
    (items: string[]) => {
      const nextStatuses = ensureArray(items);

      if (nextStatuses.length > 0) {
        dispatch(
          setFilterParameter({
            statuses: nextStatuses,
            roles: ['attendee'],
          }),
        );
      } else {
        const filteredRoles = roles.filter(role => role !== 'attendee');

        dispatch(
          setFilterParameter({
            statuses: [],
            roles: filteredRoles,
          }),
        );
      }
    },
    [dispatch, roles],
  );

  const handleRolesChange = useCallback(
    (items: string[]) => {
      dispatch(setFilterParameter({roles: ensureArray(items)}));
    },
    [dispatch],
  );

  const handleStatesChange = useCallback(
    (items: string[]) => {
      dispatch(setFilterParameter({states: ensureArray(items)}));
    },
    [dispatch],
  );

  const flagIcon = useMemo(
    () => (
      <IoniconsIcon
        name="flag-outline"
        size={fontSizes.subHeading}
        color={Colors.BodyText}
      />
    ),
    [Colors.BodyText],
  );

  const checkmarkIcon = useMemo(
    () => (
      <IoniconsIcon
        name="checkmark-circle-outline"
        size={fontSizes.subHeading}
        color={Colors.BodyText}
      />
    ),
    [Colors.BodyText],
  );

  const personIcon = useMemo(
    () => (
      <IoniconsIcon
        name="person-outline"
        size={fontSizes.subHeading}
        color={Colors.BodyText}
      />
    ),
    [Colors.BodyText],
  );

  const listIcon = useMemo(
    () => (
      <IoniconsIcon
        name="list-outline"
        size={fontSizes.subHeading}
        color={Colors.BodyText}
      />
    ),
    [Colors.BodyText],
  );

  if (!visible) return null;

  return (
    <ReactNativeModal isVisible={Boolean(visible)} onBackdropPress={onCancel}>
      <View
        style={{
          backgroundColor: Colors.Foreground,
          height: 'auto',
          padding: gPadding(15),
          borderRadius: 10,
        }}>
        <TouchableOpacity
          style={{
            width: gGap(30),
            height: gGap(30),
            borderRadius: borderRadius.circle,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: gGap(10),
            borderWidth: 1,
            borderColor: Colors.BorderColor,
            backgroundColor: '#F97066',
            position: 'absolute',
            right: -gMargin(15),
            top: -gMargin(15),
          }}
          onPress={onCancel}>
          <CloseIcon color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            dispatch(clearFilterParameters());
          }}
          disabled={!hasNonEmptyArrays(filterParameter)}
          style={{
            padding: 10,
            backgroundColor: hasNonEmptyArrays(filterParameter)
              ? Colors.Primary
              : Colors.DisablePrimaryBackgroundColor,
            marginBottom: gMargin(10),
            borderRadius: borderRadius.small,
          }}>
          <Text
            style={{
              color: hasNonEmptyArrays(filterParameter)
                ? Colors.PrimaryButtonTextColor
                : Colors.DisablePrimaryButtonTextColor,
            }}>
            Clear filter
          </Text>
        </TouchableOpacity>

        <GlobalCollapsibleChecklist
          title="Priority"
          items={priorityItems}
          icon={flagIcon}
          onSelectionChange={handlePrioritiesChange}
          initialSelectedItems={priorities}
        />

        <GlobalCollapsibleChecklist
          title="Event Status (as attendee)"
          items={statusItems}
          icon={checkmarkIcon}
          onSelectionChange={handleStatusesChange}
          initialSelectedItems={statuses}
        />

        <GlobalCollapsibleChecklist
          title="Based on Role (as organizer)"
          items={roleItems}
          icon={personIcon}
          onSelectionChange={handleRolesChange}
          initialSelectedItems={roles.filter(role => role !== 'attendee')}
        />

        <GlobalCollapsibleChecklist
          title="Event/Task State"
          items={stateItems}
          icon={listIcon}
          onSelectionChange={handleStatesChange}
          initialSelectedItems={states}
        />
      </View>
    </ReactNativeModal>
  );
};

EventFilterModal.displayName = 'EventFilterModal';

export default memo(EventFilterModal);
