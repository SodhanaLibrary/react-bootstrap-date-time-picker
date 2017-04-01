
import React from 'react';
import ReactDOM from 'react-dom';
import {
  Button,
  FormControl,
  InputGroup,
  Overlay,
  Popover,
} from 'react-bootstrap';
import CalendarHeader from './CalendarHeader';
import CalendarFooter from './CalendarFooter';
import Calendar from './Calendar';
import moment from 'moment';

let instanceCount = 0;

const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const language = typeof window !== 'undefined' && window.navigator ? (window.navigator.userLanguage || window.navigator.language || '').toLowerCase() : '';
const dateFormat = !language || language === 'en-us' ? 'MM/DD/YYYY hh:mm:ss A' : 'DD/MM/YYYY hh:mm:ss A';
const fromDate = new Date();
fromDate.setFullYear(fromDate.getFullYear() - 10);
const toDate = new Date();
toDate.setFullYear(toDate.getFullYear() + 10);

class DateTimePicker extends React.Component {
  constructor(props) {
    super(props);
    if (props.value && props.defaultValue) {
      throw new Error('Conflicting DatePicker properties \'value\' and \'defaultValue\'');
    }
    const state = this.makeDateValues(props.value || props.defaultValue);
    if (props.weekStartsOnMonday) {
      state.dayLabels = props.dayLabels.slice(1).concat(props.dayLabels.slice(0,1));
    } else {
      state.dayLabels = props.dayLabels;
    }
    state.focused = false;
    state.inputFocused = false;
    state.placeholder = props.placeholder || props.dateFormat;
    state.separator = props.dateFormat.match(/[^A-Z]/)[0];
    this.state = state;
    this.makeDateValues = this.makeDateValues.bind(this);
    this.clear = this.clear.bind(this);
    this.handleHide = this.handleHide.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this);
    this.getValue = this.getValue.bind(this);
    this.getFormattedValue = this.getFormattedValue.bind(this);
    this.makeInputValueString = this.makeInputValueString.bind(this);
    this.handleBadInput = this.handleBadInput.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.onChangeMonth = this.onChangeMonth.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.checkFormat = this.checkFormat.bind(this);
    this.onApply = this.onApply.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  makeDateValues(isoString) {
    let displayDate;
    const selectedDate = isoString ? new Date(isoString) : null;
    const inputValue = isoString ? this.makeInputValueString(selectedDate) : null;
    if (selectedDate) {
      displayDate = new Date(selectedDate);
    } else {
      displayDate = new Date();
    }
    const mDisplayDate = new moment(displayDate);
    const from = new moment(this.props.from);
    const to = new moment(this.props.to);
    if(mDisplayDate.isAfter(to)) {
        displayDate = this.props.to;
    } else if(mDisplayDate.isBefore(from)) {
        displayDate = this.props.from;
    }

    return {
      value: selectedDate ? selectedDate.toISOString() : null,
      displayDate: displayDate,
      selectedDate: selectedDate,
      inputValue: inputValue
    };
  }

  clear() {
    if (this.props.onClear) {
      this.props.onClear();
    }
    else {
      this.setState(this.makeDateValues(null));
    }

    if (this.props.onChange) {
      this.props.onChange(null, null);
    }
  }

  handleHide() {
    if (this.state.inputFocused) {
      return;
    }
    this.setState({
      focused: false
    });
    if (this.props.onBlur) {
      const event = document.createEvent('CustomEvent');
      event.initEvent('Change Date', true, false);
      ReactDOM.findDOMNode(this.refs.hiddenInput).dispatchEvent(event);
      this.props.onBlur(event);
    }
  }

  handleKeyDown(e) {
    if (e.which === 9 && this.state.inputFocused) {
      this.setState({
        focused: false
      });

      if (this.props.onBlur) {
        const event = document.createEvent('CustomEvent');
        event.initEvent('Change Date', true, false);
        ReactDOM.findDOMNode(this.refs.hiddenInput).dispatchEvent(event);
        this.props.onBlur(event);
      }
    }
  }

  handleFocus() {
    if (this.state.focused === true) {
      return;
    }

    this.setState({
      inputFocused: true,
      focused: true
    });

    if (this.props.onFocus) {
      const event = document.createEvent('CustomEvent');
      event.initEvent('Change Date', true, false);
      ReactDOM.findDOMNode(this.refs.hiddenInput).dispatchEvent(event);
      this.props.onFocus(event);
    }
  }

  handleBlur() {
    this.setState({
      inputFocused: false
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(this.state.inputFocused === true && nextState.inputFocused === false);
  }

  getValue() {
    return this.state.selectedDate ? this.state.selectedDate.toISOString() : null;
  }

  getFormattedValue() {
    return this.state.displayDate ? this.state.inputValue : null;
  }

  makeInputValueString(date, format) {
    const dateFormat = format ? format : this.props.dateFormat;
    const m = moment(date).format(dateFormat);
    return moment(date).format(dateFormat);
  }

  handleBadInput(originalValue) {
    const parts = originalValue.replace(new RegExp(`[^0-9${this.state.separator}]`), '').split(this.state.separator);
    if (this.props.dateFormat.match(/MM.DD.YYYY/) || this.props.dateFormat.match(/DD.MM.YYYY/)) {
      if (parts[0] && parts[0].length > 2) {
        parts[1] = parts[0].slice(2) + (parts[1] || '');
        parts[0] = parts[0].slice(0, 2);
      }
      if (parts[1] && parts[1].length > 2) {
        parts[2] = parts[1].slice(2) + (parts[2] || '');
        parts[1] = parts[1].slice(0, 2);
      }
      if (parts[2]) {
        parts[2] = parts[2].slice(0,4);
      }
    } else {
      if (parts[0] && parts[0].length > 4) {
        parts[1] = parts[0].slice(4) + (parts[1] || '');
        parts[0] = parts[0].slice(0, 4);
      }
      if (parts[1] && parts[1].length > 2) {
        parts[2] = parts[1].slice(2) + (parts[2] || '');
        parts[1] = parts[1].slice(0, 2);
      }
      if (parts[2]) {
        parts[2] = parts[2].slice(0,2);
      }
    }
    this.setState({
      inputValue: parts.join(this.state.separator)
    });
  }

  handleInputChange() {
    const inputValue = ReactDOM.findDOMNode(this.refs.input).value;
    if(moment(inputValue, this.props.dateFormat, true).isValid()) {
      const selectedDate = new Date(moment(inputValue, this.props.dateFormat).format());
      this.setState({
        selectedDate: selectedDate,
        displayDate: selectedDate,
        value: selectedDate.toISOString()
      });
      if (this.props.onChange) {
        this.props.onChange(selectedDate.toISOString(), inputValue);
      }
    }
    this.setState({
      inputValue: inputValue
    });
  }

  onChangeMonth(newDisplayDate) {
    this.setState({
      displayDate: newDisplayDate
    });
  }

  onChangeDate(newSelectedDate) {
    this.setState({
      displayDate: newSelectedDate
    });
  }

  onApply(newSelectedDate) {
    const inputValue = this.makeInputValueString(newSelectedDate);
    this.setState({
      inputValue: inputValue,
      selectedDate: newSelectedDate,
      displayDate: newSelectedDate,
      value: newSelectedDate.toISOString(),
      focused: false
    });

    if (this.props.onBlur) {
      const event = document.createEvent('CustomEvent');
      event.initEvent('Change Date', true, false);
      ReactDOM.findDOMNode(this.refs.hiddenInput).dispatchEvent(event);
      this.props.onBlur(event);
    }

    if (this.props.onChange) {
      this.props.onChange(newSelectedDate.toISOString(), inputValue);
    }
  }

  onCancel() {
    this.setState({
      focused:false
    });
  }

  componentWillReceiveProps(newProps) {
    const value = newProps.value;
    if (this.getValue() !== value) {
      this.setState(this.makeDateValues(value));
    }
    if(newProps.dateFormat !== this.props.dateFormat) {
      this.checkFormat(newProps.dateFormat);
      const inputValue = this.makeInputValueString(this.state.displayDate, newProps.dateFormat);
      this.setState({
        inputValue
      });
    }
    if(newProps.from !== this.props.from || newProps.to !== this.props.to) {
      const displayDate = new moment(this.state.displayDate);
      const from = new moment(newProps.from);
      const to = new moment(newProps.to);
      if(displayDate.isAfter(to)) {
        this.setState({
          displayDate:newProps.to,
          selectedDate:null
        });
      } else if(displayDate.isBefore(from)) {
        this.setState({
          displayDate:newProps.from,
          selectedDate:null
        });
      }
    }
  }

  componentDidMount() {
    this.checkFormat(this.props.dateFormat);
  }

  checkFormat(dateFormat) {
    let isSecVisible = false, isHrVisible = false, isMinVisible = false, is12HoursFormat = false;
    if(dateFormat.indexOf('ss') !== -1) {
        isSecVisible = true
    }
    if(dateFormat.indexOf('mm') !== -1) {
        isMinVisible = true
    }
    if(dateFormat.indexOf('HH') !== -1) {
        isHrVisible = true
    }
    if(dateFormat.indexOf('hh') !== -1) {
        is12HoursFormat = true;
        isHrVisible = true;
    }
    this.setState({
      isSecVisible,
      isHrVisible,
      isMinVisible,
      is12HoursFormat
    });
  }

  render() {
    const calendarHeader = <CalendarHeader
      displayDate={this.state.displayDate}
      onChange={this.onChangeMonth}
      monthLabels={this.props.monthLabels}
      dateFormat={this.props.dateFormat}
      from={this.props.from}
      to={this.props.to} />;
    const calendarFooter = <CalendarFooter
        displayDate={this.state.displayDate}
        selectedDate={this.state.selectedDate}
        onChange={this.onChangeMonth}
        dateFormat={this.props.dateFormat}
        isSecVisible={this.state.isSecVisible}
        isHrVisible={this.state.isHrVisible}
        isMinVisible={this.state.isMinVisible}
        is12HoursFormat={this.state.is12HoursFormat}
        from={this.props.from}
        to={this.props.to}
        onApply={this.onApply}
        onCancel={this.onCancel}
        timeOnly={this.props.timeOnly}/>;

    const control = this.props.customControl
      ? React.cloneElement(this.props.customControl, {
        onKeyDown: this.handleKeyDown,
        value: this.state.inputValue || '',
        placeholder: this.state.focused ? this.props.dateFormat : this.state.placeholder,
        ref: 'input',
        disabled: this.props.disabled,
        onFocus: this.handleFocus,
        onBlur: this.handleBlur,
        onChange: this.handleInputChange,
        className: this.props.className,
        style: this.props.style
      })
      : <FormControl
          onKeyDown={this.handleKeyDown}
          value={this.state.inputValue || ''}
          ref="input"
          type="text"
          className={this.props.className}
          style={this.props.style}
          autoFocus={this.props.autoFocus}
          disabled={this.props.disabled}
          placeholder={this.state.focused ? this.props.dateFormat : this.state.placeholder}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onChange={this.handleInputChange}
          />;

    return <InputGroup
      ref="inputGroup"
      bsSize={this.props.bsSize}
      id={this.props.id ? `${this.props.id}_group` : null}>
      <Overlay
        rootClose={true}
        onHide={this.handleHide}
        show={this.state.focused}
        container={() => this.props.calendarContainer || ReactDOM.findDOMNode(this.refs.overlayContainer)}
        target={() => ReactDOM.findDOMNode(this.refs.input)}
        placement={this.props.calendarPlacement}
        delayHide={200}>
        <Popover id={`date-picker-popover-${this.props.instanceCount}`} className="date-picker-popover" title={!this.props.timeOnly && calendarHeader}>
          <div className="date-time-picker">
            {!this.props.timeOnly && <Calendar
              cellPadding={this.props.cellPadding}
              selectedDate={this.state.selectedDate}
              displayDate={this.state.displayDate}
              onChange={this.onChangeDate}
              dayLabels={this.state.dayLabels}
              weekStartsOnMonday={this.props.weekStartsOnMonday}
              showTodayButton={this.props.showTodayButton}
              todayButtonLabel={this.props.todayButtonLabel}
              from={this.props.from}
              to={this.props.to}
              onApply={this.props.calendarOnly && this.onApply}/>}
             {!this.props.calendarOnly && calendarFooter}
           </div>
        </Popover>
      </Overlay>
      <div ref="overlayContainer" style={{position: 'relative'}} />
      <input ref="hiddenInput" type="hidden" id={this.props.id} name={this.props.name} value={this.state.value || ''} data-formattedvalue={this.state.value ? this.state.inputValue : ''} />
      {control}
      {this.props.showClearButton && !this.props.customControl && <InputGroup.Addon
        onClick={this.props.disabled ? null : this.clear}
        style={{cursor:(this.state.inputValue && !this.props.disabled) ? 'pointer' : 'not-allowed'}}>
        <div style={{opacity: (this.state.inputValue && !this.props.disabled) ? 1 : 0.5}}>
          {this.props.clearButtonElement}
        </div>
      </InputGroup.Addon>}
    </InputGroup>;
  }
}

DateTimePicker.propTypes = {
  defaultValue: React.PropTypes.string,
  value: React.PropTypes.string,
  className: React.PropTypes.string,
  style: React.PropTypes.object,
  cellPadding: React.PropTypes.string,
  placeholder: React.PropTypes.string,
  dayLabels: React.PropTypes.array,
  monthLabels: React.PropTypes.array,
  onChange: React.PropTypes.func,
  onClear: React.PropTypes.func,
  onBlur: React.PropTypes.func,
  onFocus: React.PropTypes.func,
  autoFocus: React.PropTypes.bool,
  disabled: React.PropTypes.bool,
  weekStartsOnMonday: React.PropTypes.bool,
  clearButtonElement: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.object
  ]),
  showClearButton: React.PropTypes.bool,
  calendarPlacement: React.PropTypes.string,
  dateFormat: React.PropTypes.string, // 'MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY/MM/DD', 'DD-MM-YYYY'
  bsClass: React.PropTypes.string,
  bsSize: React.PropTypes.string,
  calendarContainer: React.PropTypes.object,
  id: React.PropTypes.string,
  name: React.PropTypes.string,
  showTodayButton: React.PropTypes.bool,
  todayButtonLabel: React.PropTypes.string,
  customControl: React.PropTypes.object,
  from: React.PropTypes.object,
  to: React.PropTypes.object,
  calendarOnly: React.PropTypes.bool,
  timeOnly: React.PropTypes.bool
}

DateTimePicker.defaultProps = {
  cellPadding: '5px',
  dayLabels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  monthLabels: ['January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December'],
  clearButtonElement: '×',
  calendarPlacement: 'bottom',
  dateFormat: dateFormat,
  showClearButton: true,
  autoFocus: false,
  disabled: false,
  showTodayButton: false,
  todayButtonLabel: 'Today',
  instanceCount: instanceCount++,
  style: {
    width: '100%'
  },
  from:fromDate,
  to:toDate,
  calendarOnly: false,
  timeOnly: false
}

export default DateTimePicker;
