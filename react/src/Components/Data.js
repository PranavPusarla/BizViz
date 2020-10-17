import React, { useState, Component } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import ReactFileReader from './ReactFileReader';
import Chart from 'chart.js';
import Dropzone from 'react-dropzone';
import csv from 'csv';

class Data extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 10, 
      advertising: 0,
      wages: 0,
      fixed_costs: 0,
      other_costs: 0,
      sector: 0,
      online: 0,
      file: null
    }
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleAdvertisingChange = this.handleAdvertisingChange.bind(this);
    this.handleWagesChange = this.handleWagesChange.bind(this);
    this.handleFixedChange = this.handleFixedChange.bind(this);
    this.handleOtherChange = this.handleOtherChange.bind(this);
    this.handleSectorChange = this.handleSectorChange.bind(this);
    this.handleOnlineChange = this.handleOnlineChange.bind(this);
    this._enterData = this._enterData.bind(this);
  }
  _enterData(event) {
    event.preventDefault();
    console.log(JSON.stringify({
          'time': this.state.time,
          'advertising': this.state.advertising,
          'wages': this.state.wages,
          'fixed_costs': this.state.fixed_costs,
          'other_costs': this.state.other_costs,
          'online': this.state.online,
          'sector':this.state.sector,
          'file_path': this.state.file
        })) 
    fetch("http://localhost:5000/getEstimatedRevenue", {
        method: "POST",
        headers : {
          'Content-Type': 'application/json',
          'accept':'application/json'
        },
        body : JSON.stringify({
          'time': this.state.time,
          'advertising': this.state.advertising,
          'wages': this.state.wages,
          'fixed_costs': this.state.fixed_costs,
          'other_costs': this.state.other_costs,
          'online': this.state.online,
          'sector':this.state.sector,
          'file_path': this.state.file
        })
    }) .then(response => {
        console.log(response.responseText)
        console.log(response)
        return response.json();
    }) .then(res => {
            var result = res
            console.log(result)
    }) .catch(function(error) {
        console.log('There has been a problem: ' + error.message);
        throw error;
    })
  };

  handleTimeChange(event) {
    this.setState({time: event.target.value});
  }

  handleAdvertisingChange(event) {
    this.setState({advertising: event.target.value});
  }
  handleWagesChange(event) {
    this.setState({wages: event.target.value});
  }
  handleFixedChange(event) {
    this.setState({fixed_costs: event.target.value});
  }
  handleOtherChange(event) {
    this.setState({other_costs: event.target.value});
  }
  handleSectorChange(event) {
    this.setState({sector: event.target.value});
  }
  handleOnlineChange(event) {
    this.setState({online: event.target.value});
  }
  



  createChart(ctx) {
  let color = null;
  if (this.performance[this.performance.length - 1] < 1) {
    color = '#ff7675';
  } else {
    color = '#55efc4';
  }
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: this.labels,
      datasets: [
        {
          label: 'Portfolio Performance',
          data: this.performance,
          fill: false,
          borderColor: color
        }
      ]
    },
    options: {
      scales: {
        xAxes: [{
          ticks: {
            autoSkip: true,
            maxRotation: 0,
            minRotation: 0
          }
        }],
        yAxes: [{
          ticks: {
            // Include a dollar sign in the ticks
            callback: function (value, index, values) {
              return '$' + value;
            }
          }
        }]
      }
    }
  });
    return chart;
  }
  composeChart() {
    this.performance = []
    this.labels = []
    var data_array = this.data
    //data = {"mm/dd/yy": Revenue 1, "mm/dd/yy": Revenue 2}
  }

  onDrop(files) {

    this.setState({ files });

    var file = files[0];

    const reader = new FileReader();
    reader.onload = () => {
      csv.parse(reader.result, (err, data) => {

        var userList = [];

        for (var i = 0; i < data.length; i++) {
          const month = data[i][0];
          const advertising = data[i][1];
          const wages = data[i][2];
          const fixed_cost = data[i][3];
          const other_cost = data[i][4];
          const online = data[i][5];
          const revenue = data[i][6];
          const newUser = { "month": month, "advertising": advertising, "wages": wages, "fixed_cost": fixed_cost, "other_cost": other_cost, "online": online, "revenue": revenue};
          userList.push(newUser);
        };
        this.setState({file: userList})
        console.log(this.state.userList)
      });
      
    };

    reader.readAsBinaryString(file);
  }

  render() {
      const wellStyles = { maxWidth: 400, margin: '0 auto 10px' };
      const fontSize = 5;
      return (
        <section id="data">
        <form onSubmit = {this._enterData}>
          <div className="row education">
            <div className="three columns header-col">
                <h1><span>Time Span</span></h1>
            </div>
            
              <div className="nine columns main-col">
                  <div className="row item">
                    <input type="text" defaultValue="" size="25" id="Time Span" name="Time Span" value={this.state.value} onChange={this.handleTimeChange}/>
                  </div>
              </div>
          </div>


          <div className="row work">

            <div className="three columns header-col">
                <h1><span>Advertising</span></h1>
            </div>

            <div className="nine columns main-col">
              <div className="row item">
                <input value={this.state.value} onChange={this.handleAdvertisingChange} type="text" defaultValue="" size="25" id="Advertising Amount" name="Advertising Amount" o/>
              </div>
            </div>
          </div>

          <div className="row work">

            <div className="three columns header-col">
                <h1><span>Wages</span></h1>
            </div>

            <div className="nine columns main-col">
              <div className="row item">
                <input value={this.state.value} onChange={this.handleWagesChange} type="text" defaultValue="" size="25" id="Wage Amount" name="Wage Amount" o/>
              </div>
            </div>
          </div>

          <div className="row work">

            <div className="three columns header-col">
                <h1><span>Fixed Costs</span></h1>
            </div>

            <div className="nine columns main-col">
              <div className="row item">
                <input value={this.state.value} onChange={this.handleFixedChange} type="text" defaultValue="" size="25" id="Fixed Amount" name="Fixed Amount" o/>
              </div>
            </div>
          </div>

          <div className="row work">

            <div className="three columns header-col">
                <h1><span>Other Costs</span></h1>
            </div>

            <div className="nine columns main-col">
              <div className="row item">
                <input value={this.state.value} onChange={this.handleOtherChange} type="text" defaultValue="" size="25" id="Other Amount" name="Other Amount" o/>
              </div>
            </div>
          </div>

          <div className="row work">

            <div className="three columns header-col">
                <h1><span>Sector</span></h1>
            </div>

            <div className="nine columns main-col">
              <div className="row item">
                <input value={this.state.value} onChange={this.handleSectorChange} type="text" defaultValue="" size="25" id="Sector Amount" name="Sector Amount" o/>
              </div>
            </div>
          </div>

          <div className="row work">

            <div className="three columns header-col">
                <h1><span>Online</span></h1>
            </div>

            <div className="nine columns main-col">
              <div className="row item">
                <input value={this.state.value} onChange={this.handleOnlineChange} type="text" defaultValue="" size="25" id="Online Amount" name="Online Amount" o/>
              </div>
            </div>
          </div>


          <div className="row skill">

            <div className="three columns header-col">
                <h1><span>CSV File</span></h1>
            </div>

            <div align="center" oncontextmenu="return false">
              <br /><br /><br />
              <div className="dropzone">
                <Dropzone accept=".csv" onDropAccepted={this.onDrop.bind(this)}>            
                </Dropzone>
                <br /><br /><br />
              </div>
              <h2>Upload or drop your <font size={fontSize} color="#00A4FF">CSV</font><br /> file here.</h2>
            </div>
          </div>
          <input type="submit" value="Submit" />
        </form>
    </section>
    );
  }
}

export default Data;