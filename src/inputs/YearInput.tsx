import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

import CustomPropTypes from '../lib/CustomPropTypes';
import YearPicker, {
  YearPickerOnChangeData,
} from '../pickers/YearPicker';
import InputView from '../views/InputView';
import BaseInput, {
  BaseInputProps,
  BaseInputState,
  DateRelatedProps,
  DisableValuesProps,
  MinMaxValueProps,
} from './BaseInput';
import {
  getInitializer,
  parseArrayOrValue,
  parseValue,
} from './parse';

export type YearInputProps =
  & BaseInputProps
  & DateRelatedProps
  & MinMaxValueProps
  & DisableValuesProps;

export interface YearInputOnChangeData extends YearInputProps {
  value: string;
}

class YearInput extends BaseInput<YearInputProps, BaseInputState> {
  public static readonly defaultProps = {
    dateFormat: 'YYYY',
    inline: false,
    icon: 'calendar',
  };

  public static readonly propTypes = {
    /** Currently selected value. */
    value: PropTypes.string,
    /** Moment date formatting string. */
    dateFormat: PropTypes.string,
    /** Date to display initially when no date is selected. */
    initialDate: PropTypes.oneOfType([
      PropTypes.string,
      CustomPropTypes.momentObj,
      PropTypes.instanceOf(Date),
    ]),
    /** Date or list of dates that are displayed as disabled. */
    disable: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
      CustomPropTypes.momentObj,
      PropTypes.arrayOf(CustomPropTypes.momentObj),
      PropTypes.instanceOf(Date),
      PropTypes.arrayOf(PropTypes.instanceOf(Date)),
    ]),
    /** Maximum date that can be selected. */
    maxDate: PropTypes.oneOfType([
      PropTypes.string,
      CustomPropTypes.momentObj,
      PropTypes.instanceOf(Date),
    ]),
    /** Minimum date that can be selected. */
    minDate: PropTypes.oneOfType([
      PropTypes.string,
      CustomPropTypes.momentObj,
      PropTypes.instanceOf(Date),
    ]),
    /** If true, popup closes after selecting a date-time. */
    closable: PropTypes.bool,
    /**
     * Called on clear.
     *
     * @param {SyntheticEvent} event - React's original SyntheticEvent.
     * @param {object} data - All props and proposed value.
     */
    onClear: PropTypes.func,
    /** Using the clearable setting will let users remove their selection from a calendar. */
    clearable: PropTypes.bool,
    /** Optional Icon to display inside the clearable Input. */
    clearIcon: PropTypes.any,
    /** Duration of the CSS transition animation in milliseconds. */
    duration: PropTypes.number,
    /** Named animation event to used. Must be defined in CSS. */
    animation: PropTypes.string,
    /** Moment date localization. */
    localization: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      popupIsClosed: true,
    };
  }

  public render() {
    const {
      value,
      disable,
      maxDate,
      minDate,
      initialDate,
      dateFormat,
      closable,
      localization,
      ...rest
    } = this.props;

    const initializeWith = getInitializer({
      dateParams: { year: parseInt(value, 10) },
      initialDate,
      dateFormat,
      localization,
    });

    return (
      <InputView
        popupIsClosed={this.state.popupIsClosed}
        closePopup={this.closePopup}
        openPopup={this.openPopup}
        {...rest}
        value={value}
        onMount={this.onInputViewMount}
        render={
          (pickerProps) => (
            <YearPicker
              {...pickerProps}
              isPickerInFocus={this.isPickerInFocus}
              isTriggerInFocus={this.isTriggerInFocus}
              inline={this.props.inline}
              onCalendarViewMount={this.onCalendarViewMount}
              closePopup={this.closePopup}
              onChange={this.handleSelect}
              initializeWith={initializeWith}
              value={parseValue(value, dateFormat)}
              disable={parseArrayOrValue(disable, dateFormat)}
              maxDate={parseValue(maxDate, dateFormat)}
              minDate={parseValue(minDate, dateFormat)}
            />
          )
        }
      />
    );
  }

  private handleSelect = (e: React.SyntheticEvent<HTMLElement>,
                          { value }: YearPickerOnChangeData) => {
    const { localization } = this.props;
    const date = localization ? moment({ year: value.year }).locale(localization) : moment({ year: value.year });
    let output = '';
    if (date.isValid()) {
      output = date.format(this.props.dateFormat);
    }
    const data = {
      ...this.props,
      value: output,
    };
    this.props.onChange(e, data);
    if (this.props.closable) {
      this.closePopup();
    }
  }
}

export default YearInput;
