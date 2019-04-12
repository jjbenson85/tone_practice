import React from 'react'
import ReactDOM from 'react-dom'

import Tone from 'tone'

import Monosynth from './components/Monosynth'
import GridSequencer from './components/GridSequencer'

import './scss/style.scss'

class App extends React.Component {

  constructor(){
    super()

    this.state={
      instruments: ['Monosynth', 'Monosynth'],
      toneInstruments: []
    }
  }


  playSound(){
    Tone.Transport.start()

  }
  stopSound(){
    Tone.Transport.stop()
  }
  addSynth(){
    const instruments = [...this.state.instruments, 'Monosynth']
    this.setState({instruments})
  }

  removeSynth(){
    this.state.toneInstruments[this.state.toneInstruments.length-1].synth.dispose()
    this.state.toneInstruments[this.state.toneInstruments.length-1].loop.stop()
    const instruments = this.state.instruments.slice(0, this.state.instruments.length-1)
    this.setState({instruments})
  }

  render() {
    return (
      <div>Hello World!
        <button onClick={()=>this.playSound()}>PLAY</button>
        <button onClick={()=>this.stopSound()}>STOP</button>
        <button onClick={()=>this.addSynth()}>ADD</button>
        <button onClick={()=>this.removeSynth()}>REMOVE</button>
        <div>
          {this.state.instruments.map( (inst,i) => <Monosynth key={i} id={i} toneInstruments={this.state.toneInstruments}/>)}
        </div>

      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
