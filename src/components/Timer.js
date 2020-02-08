import React, { Component } from 'react';

export default class Timer extends Component {
    state={
        label:this.props.label,
        seconds: this.props.seconds,
        minutes: this.props.minutes,
        hours: this.props.hours,
        startBoolean: true,
        show: true,
        done: false
    }
    componentDidMount() {
        this.countDown()
    }

    startStop = () => {
        this.setState({
            startBoolean:!this.state.startBoolean
        })
        setTimeout(()=> {
            if(this.state.startBoolean===true) {
            this.countDown()
            }
        }, 1 )
    }
    reset = () => {
        this.setState({
            seconds: this.props.seconds,
            minutes: this.props.minutes,
            hours: this.props.hours,
            startBoolean:false,
            done: false
        })
    }

    removeTimer = () => {
      this.setState({
        show: false
      })
    }

    countDown = () => {
        setTimeout(()=> {
            if(this.state.startBoolean===false) return

            if(this.state.seconds===0&&this.state.minutes===0&&this.state.hours===0) return

            if (this.state.seconds===0) {
                this.setState({
                    seconds:59,
                    minutes: (this.state.minutes===0&&this.state.hours>0)?
                    59:(this.state.minutes===0 ? 0 : (this.state.minutes-1)),
                    hours:(this.state.hours>0 && this.state.minutes===0)?this.state.hours-1:this.state.hours
                })
            } else {
                this.setState({
                seconds:this.state.seconds-1
            })
        }
        if (this.state.seconds===0&&this.state.minutes===0&&this.state.hours===0){
          this.setState({
            done:true
          })
        }
            this.countDown()
        }, 1000)

    }

    render () {
        return (
          <React.Fragment>
            {this.state.show===true?
              <div className='timer'>
                  <h4>{this.state.label}{this.state.done===true?<p>DONE</p>:''}</h4>
                  <h5>{`${this.state.hours}:${this.state.minutes<10?0:''}${this.state.minutes}:${this.state.seconds<10?0:''}${this.state.seconds}`}</h5>
                  <button onClick={this.startStop} className='action'>
                      {this.state.startBoolean===true?'Stop':'Start'}
                  </button>
                  <button onClick={this.reset} className='action'>
                      Reset
                  </button>
                  <button onClick={this.removeTimer} className='action'>
                      Remove
                  </button>

              </div>:''
            }
          </React.Fragment>
        )
    }
}
