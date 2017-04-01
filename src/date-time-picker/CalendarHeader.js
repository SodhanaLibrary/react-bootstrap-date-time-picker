import React from 'react';
import ReactDOM from 'react-dom';
import {
  Button,
  FormControl,
  InputGroup,
  Overlay,
  Popover,
  FormGroup
} from 'react-bootstrap';

class CalendarHeader extends React.Component {
  constructor(props) {
    super(props);
    this.onChangeMonth = this.onChangeMonth.bind(this);
    this.onChangeYear = this.onChangeYear.bind(this);
  }

  onChangeMonth(event) {
    const {from, to, displayDate} = this.props;
    let date = 1;
    const newDisplayDate = new Date(displayDate);
    newDisplayDate.setDate(date);
    newDisplayDate.setMonth(this.props.monthLabels.indexOf(event.target.value));
    const fromMatch = from.getMonth() === newDisplayDate.getMonth() && from.getDate();
    const toMatch = to.getMonth() === newDisplayDate.getMonth() && to.getDate();
    if(fromMatch) {
      date = fromMatch > date ? fromMatch : date;
    }
    if(toMatch) {
      date = toMatch < date ? toMatch : date;
    }
    newDisplayDate.setDate(date);
    this.props.onChange(newDisplayDate);
  }

  onChangeYear(event) {
    const {displayDate, from, to} = this.props;
    const newDisplayDate = new Date(displayDate);
    newDisplayDate.setFullYear(event.target.value);
    if(from && newDisplayDate.getFullYear() === from.getFullYear()) {
      if(newDisplayDate.getMonth() < from.getMonth()) {
        newDisplayDate.setMonth(from.getMonth());
      }
    } else if(to && newDisplayDate.getFullYear() === to.getFullYear()) {
      if(newDisplayDate.getMonth() > to.getMonth()) {
        newDisplayDate.setMonth(to.getMonth());
      }
    }
    this.props.onChange(newDisplayDate);
  }

  render() {
    const {monthLabels, years, displayDate, from, to} = this.props;
    let calcYears = years ? years : [];
    let calcMonths = monthLabels;
    const fromYear = from.getFullYear();
    const toYear = to.getFullYear();
    calcYears = [];
    for(let i = fromYear; i <= toYear; i++) {
      calcYears.push(i);
    }
    if(displayDate.getFullYear() === from.getFullYear() && displayDate.getFullYear() === to.getFullYear()) {
      calcMonths = calcMonths.filter((month, i) => i >= from.getMonth() && i <= to.getMonth());
    } else if(displayDate.getFullYear() === from.getFullYear()) {
      calcMonths = calcMonths.filter((month, i) => i >= from.getMonth());
    } else if(displayDate.getFullYear() === to.getFullYear()) {
      calcMonths = calcMonths.filter((month, i) => i <= to.getMonth());
    }

    return <div className="date-time-picker__header">
      <FormGroup controlId="date-time-picker__input-month">
        <FormControl onChange={this.onChangeMonth} value={monthLabels[displayDate.getMonth()]} componentClass="select" placeholder="select">
          {calcMonths.map((month) => <option key={month} value={month}>{month}</option>)}
        </FormControl>
      </FormGroup>
      <FormGroup controlId="date-time-picker__input-month">
        <FormControl onChange={this.onChangeYear} componentClass="select" placeholder="select" value={displayDate.getFullYear()}>
          {calcYears.map((year) => <option key={year} value={year}>{year}</option>)}
        </FormControl>
      </FormGroup>
    </div>;
  }
}

CalendarHeader.propTypes = {
  displayDate: React.PropTypes.object.isRequired,
  onChange: React.PropTypes.func.isRequired,
  monthLabels: React.PropTypes.array.isRequired,
  years: React.PropTypes.array,
  from: React.PropTypes.object,
  to: React.PropTypes.object
}

CalendarHeader.defaultProps = {
}


export default CalendarHeader;
