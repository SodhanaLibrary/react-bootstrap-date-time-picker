import React from 'react';
import ReactDOM from 'react-dom';
import {
  Button,
  FormControl,
  InputGroup,
  Overlay,
  Popover,
  FormGroup,
  ControlLabel
} from 'react-bootstrap';

const genOptions = (limit) => {
  const arr = [];
  for(let i=0; i<limit; i++) {
    arr.push(i);
  }
  return arr;
}
class CalendarFooter extends React.Component {
  constructor(props) {
    super(props);
    this.onChangeHours = this.onChangeHours.bind(this);
    this.onChangeMinutes = this.onChangeMinutes.bind(this);
    this.onChangeSeconds = this.onChangeSeconds.bind(this);
    this.onChangeM = this.onChangeM.bind(this);
    this.getValidNewDate = this.getValidNewDate.bind(this);
  }

  onChangeHours(event) {
    let hours = parseInt(event.target.value);
    const newDisplayDate = new Date(this.props.displayDate);
    if(!this.props.is12HoursFormat) {
      newDisplayDate.setHours(hours);
      this.props.onChange(this.getValidNewDate(newDisplayDate));
    } else {
      hours = newDisplayDate.getHours() >= 12 ? hours === 12 ? 12 : hours + 12 : hours;
      newDisplayDate.setHours(hours);
      this.props.onChange(this.getValidNewDate(newDisplayDate));
    }
  }

  onChangeMinutes(event) {
    const newDisplayDate = new Date(this.props.displayDate);
    newDisplayDate.setMinutes(event.target.value);
    this.props.onChange(this.getValidNewDate(newDisplayDate));
  }

  onChangeSeconds(event) {
    const newDisplayDate = new Date(this.props.displayDate);
    newDisplayDate.setSeconds(event.target.value);
    this.props.onChange(this.getValidNewDate(newDisplayDate));
  }

  onChangeM(event) {
    const newDisplayDate = new Date(this.props.displayDate);
    const hours = event.target.value === 'AM' ? (newDisplayDate.getHours() % 12) : (newDisplayDate.getHours() % 12) + 12;
    newDisplayDate.setHours(hours);
    this.props.onChange(this.getValidNewDate(newDisplayDate));
  }

  getValidNewDate(displayDate) {
    const {from, to} = this.props;
    let newDisplayDate = new Date(displayDate);
    if(from) {
      const dateMatch = from.getFullYear() === newDisplayDate.getFullYear() && from.getMonth() === newDisplayDate.getMonth() && from.getDate() === newDisplayDate.getDate();
      if(dateMatch && from.getHours() > newDisplayDate.getHours()) {
        newDisplayDate.setHours(from.getHours());
      }
      const hourMatch = from.getHours() === newDisplayDate.getHours();
      if(dateMatch && hourMatch && from.getMinutes() > newDisplayDate.getMinutes()) {
        newDisplayDate.setMinutes(from.getMinutes());
      }
      const minMatch = from.getMinutes() === newDisplayDate.getMinutes();
      if(dateMatch && hourMatch && minMatch && from.getSeconds() > newDisplayDate.getSeconds()) {
        newDisplayDate.setSeconds(from.getSeconds());
      }
    }
    if(to) {
      const dateMatch = to.getFullYear() === newDisplayDate.getFullYear() && to.getMonth() === newDisplayDate.getMonth() && to.getDate() === newDisplayDate.getDate();
      if(dateMatch && to.getHours() < newDisplayDate.getHours()) {
        newDisplayDate.setHours(to.getHours());
      }
      const hourMatch = to.getHours() === newDisplayDate.getHours();
      if(dateMatch && hourMatch && to.getMinutes() < newDisplayDate.getMinutes()) {
        newDisplayDate.setMinutes(to.getMinutes());
      }
      const minMatch = to.getMinutes() === newDisplayDate.getMinutes();
      if(dateMatch && hourMatch && minMatch && to.getSeconds() < newDisplayDate.getSeconds()) {
        newDisplayDate.setSeconds(to.getSeconds());
      }
    }

    return newDisplayDate;
  }

  intersection_destructive(a, b) {
    const result = [];
    while( a.length > 0 && b.length > 0 )
    {
       if      (a[0] < b[0] ){ a.shift(); }
       else if (a[0] > b[0] ){ b.shift(); }
       else /* they're equal */
       {
         result.push(a.shift());
         b.shift();
       }
    }
    return result;
  }

  render() {
    const {monthLabels, displayDate, hours, minutes, seconds, is12HoursFormat, isHrVisible, isMinVisible, isSecVisible, from, to, selectedDate, timeOnly} = this.props;
    let calcHours = hours;
    let calcMinutes = minutes;
    let calcSeconds = seconds;
    let mer = ['AM', 'PM'];
    if(from) {
      const fromDateMatch = from.getFullYear() === displayDate.getFullYear() && from.getMonth() === displayDate.getMonth() && from.getDate() === displayDate.getDate();
      const fromHourMatch = from.getHours() === displayDate.getHours();
      const fromMinMatch = from.getMinutes() === displayDate.getMinutes();
      if(fromDateMatch) {
        const limit = from.getHours();
        calcHours = calcHours.filter((hour) => hour >= limit );
        mer = from.getHours() > 12 ? ['PM'] : ['AM', 'PM'];
      }
      if(fromDateMatch && fromHourMatch) {
        calcMinutes = calcMinutes.filter((min) => min >= from.getMinutes() );
      }
      if(fromDateMatch && fromHourMatch && fromMinMatch) {
        calcSeconds = calcSeconds.filter((sec) => sec >= from.getSeconds() );
      }
    }
    if(to) {
      const dateMatch = to.getFullYear() === displayDate.getFullYear() && to.getMonth() === displayDate.getMonth() && to.getDate() === displayDate.getDate();
      const hourMatch = to.getHours() === displayDate.getHours();
      const minMatch = to.getMinutes() === displayDate.getMinutes();
      if(dateMatch) {
        const limit = to.getHours();
        calcHours = calcHours.filter((hour) => hour <= limit );
        const mer1 = to.getHours() > 12 ? ['AM','PM'] : ['AM'];
        mer = this.intersection_destructive(mer, mer1);
      }
      if(dateMatch && hourMatch) {
        calcMinutes = calcMinutes.filter((min) => min <= to.getMinutes() );
      }
      if(dateMatch && hourMatch && minMatch) {
        calcSeconds = calcSeconds.filter((sec) => sec <= to.getSeconds() );
      }
    }
    calcHours = is12HoursFormat ? displayDate.getHours() >= 12 ? calcHours.filter((hour) => hour >= 12) : calcHours.filter((hour) => hour < 12) : calcHours;
    calcHours = is12HoursFormat ? calcHours.map(hour => hour === 0 ? 12 : hour > 12 ? hour % 12 : hour) : calcHours;
    const meridian = displayDate.getHours() >= 12 ? 'PM' : 'AM';

    return <div>{(isHrVisible || isMinVisible || isSecVisible) && <div>
      {!timeOnly && <hr/>}
      <div className="date-time-picker__footer">
      {isHrVisible && <FormGroup controlId="date-time-picker__input-month">
        <ControlLabel>Hr</ControlLabel>
        <FormControl onChange={this.onChangeHours} value={is12HoursFormat ? displayDate.getHours() % 12 : displayDate.getHours()} componentClass="select" placeholder="select">
          {calcHours.map((month) => <option key={month} value={month}>{month}</option>)}
        </FormControl>
      </FormGroup>}
      {isMinVisible && <FormGroup controlId="date-time-picker__input-month">
        <ControlLabel>Min</ControlLabel>
        <FormControl onChange={this.onChangeMinutes} componentClass="select" placeholder="select" value={displayDate.getMinutes()}>
          {calcMinutes.map((year) => <option key={year} value={year}>{year}</option>)}
        </FormControl>
      </FormGroup>}
      {isSecVisible && <FormGroup controlId="date-time-picker__input-month">
        <ControlLabel>Sec</ControlLabel>
        <FormControl onChange={this.onChangeSeconds} componentClass="select" placeholder="select" value={displayDate.getSeconds()}>
          {calcSeconds.map((year) => <option key={year} value={year}>{year}</option>)}
        </FormControl>
      </FormGroup>}
      {is12HoursFormat && <FormGroup controlId="date-time-picker__input-month">
        <ControlLabel>Mer</ControlLabel>
        <FormControl onChange={this.onChangeM} componentClass="select" placeholder="select" value={meridian}>
           {mer.map((mr) => <option key={mr} value={mr}>{mr}</option>)}
        </FormControl>
      </FormGroup>}
    </div></div>}
    <div className="date-time-picker__footer-actions">
      <button onClick={this.props.onCancel} className="btn btn-secondary btn-sm">Cancel</button>
      <button onClick={() => this.props.onApply(displayDate)} disabled={!displayDate} className="btn btn-primary btn-sm">Apply</button>
    </div>
    </div>;
  }
}

CalendarFooter.propTypes = {
  displayDate: React.PropTypes.object.isRequired,
  onChange: React.PropTypes.func.isRequired,
  years: React.PropTypes.array,
  hours: React.PropTypes.array,
  minutes: React.PropTypes.array,
  seconds: React.PropTypes.array,
  isSecVisible : React.PropTypes.bool,
  isHrVisible : React.PropTypes.bool,
  isMinVisible : React.PropTypes.bool,
  from: React.PropTypes.object,
  to: React.PropTypes.object,
  selectedDate: React.PropTypes.object,
  onApply: React.PropTypes.func,
  onCancel: React.PropTypes.func,
  timeOnly: React.PropTypes.bool
}

CalendarFooter.defaultProps = {
  hours:genOptions(24),
  minutes:genOptions(60),
  seconds:genOptions(60),
  isSecVisible:true,
  isHrVisible:true,
  isMinVisible:true,
  timeOnly:false
}


export default CalendarFooter;
