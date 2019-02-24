import React from 'react'
import ReactDOM from 'react-dom'

import Tone from 'tone'

import Monosynth from './components/Monosynth'

import './scss/style.scss'

class App extends React.Component {

  constructor(){
    super()

    this.state={
      transport: {
        beat: 0,
        time: 0
      },
      instrument: [
        {
          id: 0,
          sequence: [
            {
              beat: 0,
              pitch: 'C3',
              duration: '32n'
            },
            {
              beat: 1,
              pitch: 'D3',
              duration: '32n'
            },
            {
              beat: 2,
              pitch: 'E3',
              duration: '32n'
            },
            {
              beat: 3,
              pitch: 'C3',
              duration: '32n'
            },
            {
              beat: 4,
              pitch: 'F3',
              duration: '32n'
            },
            {
              beat: 5,
              pitch: 'G3',
              duration: '32n'
            },
            {
              beat: 6,
              pitch: 'A3',
              duration: '32n'
            },
            {
              beat: 7,
              pitch: 'B3',
              duration: '32n'
            },
            {
              beat: 8,
              pitch: 'C3',
              duration: '32n'
            },
            {
              beat: 9,
              pitch: 'B3',
              duration: '32n'
            },
            {
              beat: 10,
              pitch: 'A3',
              duration: '32n'
            },
            {
              beat: 11,
              pitch: 'G3',
              duration: '32n'
            },
            {
              beat: 12,
              pitch: 'F3',
              duration: '32n'
            },
            {
              beat: 13,
              pitch: 'E3',
              duration: '32n'
            },
            {
              beat: 14,
              pitch: 'D3',
              duration: '32n'
            },
            {
              beat: 15,
              pitch: 'C3',
              duration: '32n'
            },
            {
              beat: 16,
              pitch: 'B2',
              duration: '32n'
            }
          ]
        },{
          id: 1,
          sequence: [
            {
              beat: 0,
              pitch: 'F5',
              duration: '32n'
            },
            {
              beat: 1,
              pitch: 'A4',
              duration: '32n'
            },
            {
              beat: 2,
              pitch: 'B5',
              duration: '32n'
            },
            {
              beat: 3,
              pitch: 'C4',
              duration: '32n'
            },
            {
              beat: 4,
              pitch: 'F5',
              duration: '32n'
            },
            {
              beat: 5,
              pitch: 'G4',
              duration: '32n'
            },
            {
              beat: 6,
              pitch: 'A5',
              duration: '32n'
            },
            {
              beat: 7,
              pitch: 'B4',
              duration: '32n'
            },
            {
              beat: 8,
              pitch: 'F5',
              duration: '32n'
            },
            {
              beat: 9,
              pitch: 'B4',
              duration: '32n'
            },
            {
              beat: 10,
              pitch: 'A5',
              duration: '32n'
            },
            {
              beat: 11,
              pitch: 'G4',
              duration: '32n'
            },
            {
              beat: 12,
              pitch: 'F5',
              duration: '32n'
            },
            {
              beat: 13,
              pitch: 'E4',
              duration: '32n'
            },
            {
              beat: 14,
              pitch: 'D5',
              duration: '32n'
            },
            {
              beat: 15,
              pitch: 'C4',
              duration: '32n'
            },
            {
              beat: 16,
              pitch: 'B5',
              duration: '32n'
            }
          ]
        }
      ]
    }
  }


  componentDidMount(){
    const that = this
    this.loop = new Tone.Sequence(function(time, beat){
      that.setState({transport: {beat, time}})
    }, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], '16n')

  }

  playSound(){
    Tone.Transport.start()
    this.loop.start()

  }
  stopSound(){
    Tone.Transport.stop()
    this.loop.stop()
  }

  render() {
    return (
      <div>Hello World!
        <button onClick={()=>this.playSound()}>PLAY</button>
        <button onClick={()=>this.stopSound()}>STOP</button>
        <Monosynth
          id="1"
          time={this.state.transport.time}
          pitch={this.state.instrument[0].sequence[this.state.transport.beat].pitch}
          duration={this.state.instrument[0].sequence[this.state.transport.beat].duration}
        />
        <Monosynth
          id="2"
          time={this.state.transport.time}
          pitch={this.state.instrument[1].sequence[this.state.transport.beat].pitch}
          duration={this.state.instrument[1].sequence[this.state.transport.beat].duration}
        />
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
