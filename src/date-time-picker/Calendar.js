import React from 'react';
import ReactDOM from 'react-dom';
import {
  Button,
  FormControl,
  InputGroup,
  Overlay,
  Popover,
} from 'react-bootstrap';
import './date-time-picker.scss';

const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];


class Calendar extends React.Component {
  constructor() {
    super();
    this.handleClickToday = this.handleClickToday.bind(this);
  }

  handleClick(day) {
    const newSelectedDate = new Date(this.props.displayDate);
    newSelectedDate.setDate(day);
    this.props.onChange(newSelectedDate);
    if(this.props.onApply) {
      this.props.onApply(newSelectedDate);
    }
  }

  handleClickToday() {
    const newSelectedDate = new Date();
    this.props.onChange(newSelectedDate);
    if(this.props.onApply) {
      this.props.onApply(newSelectedDate);
    }
  }

  render() {
    const {from, to, displayDate} = this.props;
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const selectedDay = this.props.displayDate ? this.props.displayDate.getDate() : null;
    const selectedMonth = this.props.displayDate ? this.props.displayDate.getMonth() : null;
    const selectedYear = this.props.displayDate ? this.props.displayDate.getFullYear() : null;
    const year = this.props.displayDate.getFullYear();
    const month = this.props.displayDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startingDay = this.props.weekStartsOnMonday ? (firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1) : firstDay.getDay();
    const fromMatch = from.getFullYear() === displayDate.getFullYear() && from.getMonth() === displayDate.getMonth() && from.getDate();
    const toMatch = to.getFullYear() === displayDate.getFullYear() && to.getMonth() === displayDate.getMonth() && to.getDate();

    let monthLength = daysInMonth[month];
    if (month == 1) {
      if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        monthLength = 29;
      }
    }

    const weeks = [];
    let day = 1;
    for (let i = 0; i < 9; i++) {
      const week = [];
      for (let j = 0; j <= 6; j++) {
        if (day <= monthLength && (i > 0 || j >= startingDay)) {
          const selected = day === selectedDay && month == selectedMonth && year === selectedYear;
          const current = day === currentDay && month == currentMonth && year === currentYear;
          let disabled = false;
          if(fromMatch) {
            disabled = fromMatch > day;
          }
          if(toMatch) {
            disabled = disabled || toMatch < day;
          }
          week.push(<td
            key={j}
            onClick={!disabled ? this.handleClick.bind(this, day) : () => {}}
            style={{cursor: 'pointer', padding: this.props.cellPadding}}
            className={disabled ? 'text-muted' : selected ? 'bg-primary' : current ? 'text-primary' : null}>
            {day}
          </td>);
          day++;
        } else {
          week.push(<td key={j} />);
        }
      }

      weeks.push(<tr key={i}>{week}</tr>);
      if (day > monthLength) {
        break;
      }
    }

    return <div><table className="text-center">
      <thead>
        <tr>
          {this.props.dayLabels.map((label, index)=>{
            return <td
              key={index}
              className="text-muted"
              style={{padding: this.props.cellPadding}}>
              <small>{label}</small>
            </td>;
          })}
        </tr>
      </thead>
      <tbody>
        {weeks}
      </tbody>
      {this.props.showTodayButton && <tfoot>
        <tr>
          <td colSpan={this.props.dayLabels.length} style={{ paddingTop: '9px' }}>
            <Button
              block
              bsSize="xsmall"
              className="u-today-button"
              onClick={this.handleClickToday}>
              {this.props.todayButtonLabel}
            </Button>
          </td>
        </tr>
      </tfoot>}
    </table>{this.props.footer}</div>;
  }
}

Calendar.propTypes = {
    selectedDate: React.PropTypes.object,
    displayDate: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func.isRequired,
    dayLabels: React.PropTypes.array.isRequired,
    cellPadding: React.PropTypes.string.isRequired,
    weekStartsOnMonday: React.PropTypes.bool,
    showTodayButton: React.PropTypes.bool,
    todayButtonLabel: React.PropTypes.string,
    fromDay: React.PropTypes.object,
    toDay: React.PropTypes.object
}

export default Calendar;
