import React from 'react'
import ReactDOM from 'react-dom'

import Tone from 'tone'

import Monosynth from './components/Monosynth'
import Mixer from './components/Mixer'
// import GridSequencer from './components/GridSequencer'

import './scss/style.scss'

class App extends React.Component {

  constructor(){
    super()

    this.state={
      instruments: ['Monosynth','Monosynth','Monosynth'],
      toneInstruments: []
    }

    // const dist = new Tone.Distortion(0.8)
    // var pingPong = new Tone.PingPongDelay('4n', 0.2)
    //
    // const effectsChain = [pingPong, dist, Tone.Master]
    //
    // this.synth.chain(...effectsChain)
    this.attachSynth = this.attachSynth.bind(this)
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
  attachSynth(synth, i){
    // console.log('this.state.toneInstruments', this.state)
    const toneInstruments = this.state.toneInstruments
    toneInstruments[i] = synth
    this.setState({toneInstruments})
  }

  removeSynth(){
    this.state.toneInstruments[this.state.toneInstruments.length-1].synth.dispose()
    this.state.toneInstruments[this.state.toneInstruments.length-1].loop.stop()
    const instruments = this.state.instruments.slice(0, this.state.instruments.length-1)
    const toneInstruments = this.state.toneInstruments.slice(0, this.state.toneInstruments.length-1)

    this.setState({toneInstruments, instruments})
  }

  render() {

    return (
      <div>Hello World!
        <button onClick={()=>this.playSound()}>PLAY</button>
        <button onClick={()=>this.stopSound()}>STOP</button>
        <button onClick={()=>this.addSynth()}>ADD</button>
        <button onClick={()=>this.removeSynth()}>REMOVE</button>
        <div className="rack">
          {this.state.instruments.map( (inst,i) => <Monosynth key={i} id={i} toneInstruments={this.state.toneInstruments} attachSynth={this.attachSynth}/>)}
        </div>
        <Mixer id="1" toneInstruments={this.state.toneInstruments} len={this.state.toneInstruments.length}/>

      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
