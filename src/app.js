import React from 'react';
import {FormGroup, ControlLabel, HelpBlock} from 'react-bootstrap';
import DateTimePicker from './date-time-picker/DateTimePicker';
import '../node_modules/bootstrap/dist/css/bootstrap.css'

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      format: 'MM/DD/YYYY hh:mm:ss A',
      calendarOnly: false,
      timeOnly:false,
      showClearButton:true,
      showTodayButton:false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleFormatChange = this.handleFormatChange.bind(this);
    this.dates = {
      dateSecFrom : new Date("2017-03-30T14:28:06+05:30"),
      dateSecTo : new Date("2017-03-30T14:28:40+05:30"),
      dateMinFrom : new Date("2017-03-30T14:28:06+05:30"),
      dateMinTo : new Date("2017-03-30T14:59:06+05:30"),
      dateHourFrom : new Date("2017-03-30T04:28:06+05:30"),
      dateHourTo : new Date("2017-03-30T18:28:06+05:30"),
      dateDateFrom : new Date("2017-03-15T14:28:06+05:30"),
      dateDateTo : new Date("2017-03-30T14:28:06+05:30"),
      dateMonthFrom : new Date("2017-02-15T14:28:06+05:30"),
      dateMonthTo : new Date("2017-03-30T14:28:06+05:30"),
      dateYearFrom : new Date("2015-03-30T14:28:06+05:30"),
      dateYearTo : new Date("2017-03-30T14:28:06+05:30")
    };
  }

  handleChange(value) {
   this.setState({
     date: value
   });
  }

  handleFormatChange(e) {
   this.setState({
     format: e.target.value
   });
  }

  onCheck(event) {
    if(this.dates[event.target.value+"From"]) {
      this.setState({
        from:this.dates[event.target.value+"From"],
        to:this.dates[event.target.value+"To"],
        checked:event.target.value
      });
    } else {
      const obj = {};
      obj[event.target.value] = !this.state[event.target.value]
      this.setState(obj);
    }
  }

  render() {
    const dates = this.dates;
    return (
      <div style={{
        width:'500px',
        margin:'auto',
        paddingTop:'100px'
      }}>
        <FormGroup controlId="change_handler">
          <ControlLabel>Change Handler</ControlLabel>
          <DateTimePicker
            calendarOnly={this.state.calendarOnly}
            timeOnly={this.state.timeOnly}
            from={this.state.from}
            to={this.state.to}
            onChange={this.handleChange}
            dateFormat={this.state.format}
            placeholder="Placeholder"
            value={this.state.date}
            showClearButton={this.state.showClearButton}
            showTodayButton={this.state.showTodayButton}
            bsClass="input-group"
            />
          <HelpBlock>Help</HelpBlock>
        </FormGroup>
        <div className="form-group">
          <div >
            <label>
              date format : <input style={{width:'300px'}} value={this.state.format} name="format" onChange={this.handleFormatChange}></input>
            </label>
          </div>
        </div>
        <div className="form-group">
          <label>
            <input type="checkbox"  value="calendarOnly"  checked={this.state.calendarOnly} name="calendar" onClick={this.onCheck.bind(this)}></input>
            &nbsp;Calendar only
          </label>
        </div>
        <div className="form-group">
          <label>
            <input type="checkbox"  value="timeOnly"  checked={this.state.timeOnly} name="time" onClick={this.onCheck.bind(this)}></input>
            &nbsp;Time only
          </label>
        </div>
        <div className="form-group">
          <label>
            <input type="checkbox"  value="showClearButton"  checked={this.state.showClearButton} name="clearBtn" onClick={this.onCheck.bind(this)}></input>
            &nbsp;Show Clear Button
          </label>
        </div>
        <div className="form-group">
          <label>
            <input type="checkbox"  value="showTodayButton"  checked={this.state.showTodayButton} name="todayBtn" onClick={this.onCheck.bind(this)}></input>
            &nbsp;Show Today Button
          </label>
        </div>
        <div className="form-group">
          <label>
            <input type="radio"  value="dateSec"  checked={this.state.checked === 'dateSec'} name="dates" onClick={this.onCheck.bind(this)}></input>
            &nbsp;Seconds diff
            <br/> &nbsp;&nbsp;&nbsp; from - {dates.dateSecFrom.toString()} <br/> &nbsp;&nbsp;&nbsp; to - {dates.dateSecTo.toString()}
          </label>
        </div>
        <div className="form-group">
          <label>
            <input type="radio"  value="dateMin" checked={this.state.checked === 'dateMin'} name="dates" onClick={this.onCheck.bind(this)}></input>
            &nbsp;Min diff
            <br/> &nbsp;&nbsp;&nbsp; from - {dates.dateMinFrom.toString()} <br/> &nbsp;&nbsp;&nbsp; to - {dates.dateMinTo.toString()}
          </label>
        </div>
        <div className="form-group">
          <label>
            <input type="radio"  value="dateHour"  checked={this.state.checked === 'dateHour'} name="dates" onClick={this.onCheck.bind(this)}></input>
            &nbsp;Hour diff
            <br/> &nbsp;&nbsp;&nbsp; from - {dates.dateHourFrom.toString()} <br/> &nbsp;&nbsp;&nbsp; to - {dates.dateHourTo.toString()}
          </label>
        </div>
        <div className="form-group">
          <label>
            <input type="radio"  value="dateDate"  checked={this.state.checked === 'dateDate'} name="dates" onClick={this.onCheck.bind(this)}></input>
            &nbsp;Days diff
            <br/> &nbsp;&nbsp;&nbsp; from - {dates.dateDateFrom.toString()} <br/> &nbsp;&nbsp;&nbsp; to - {dates.dateDateTo.toString()}
          </label>
        </div>
        <div className="form-group">
          <label>
            <input type="radio"  value="dateMonth"  checked={this.state.checked === 'dateMonth'} name="dates" onClick={this.onCheck.bind(this)}></input>
            &nbsp;Month diff
            <br/> &nbsp;&nbsp;&nbsp; from - {dates.dateMonthFrom.toString()} <br/> &nbsp;&nbsp;&nbsp; to - {dates.dateMonthTo.toString()}
          </label>
        </div>
        <div className="form-group">
          <label>
            <input type="radio"  value="dateYear"  checked={this.state.checked === 'dateYear'} name="dates" onClick={this.onCheck.bind(this)}></input>
            &nbsp;Year diff
            <br/> &nbsp;&nbsp;&nbsp; from - {dates.dateYearFrom.toString()} <br/> &nbsp;&nbsp;&nbsp; to - {dates.dateYearTo.toString()}
          </label>
        </div>
        </div>
    )
  }
}
