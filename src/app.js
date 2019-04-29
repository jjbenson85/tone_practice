import React from 'react'
import ReactDOM from 'react-dom'

import Tone from 'tone'

import Monosynth from './components/Monosynth'
import Polysynth from './components/Polysynth'
import Mixer from './components/Mixer'
// import GridSequencer from './components/GridSequencer'

import './scss/style.scss'

class App extends React.Component {

  constructor(){
    super()

    this.state={
      instruments: ['Mixer','Polysynth'],
      toneInstruments: []
    }

    // const dist = new Tone.Distortion(0.8)
    // var pingPong = new Tone.PingPongDelay('4n', 0.2)
    //
    // const effectsChain = [pingPong, dist, Tone.Master]
    //
    // this.synth.chain(...effectsChain)
    this.stopSynthArr = []

    this.attachSynth = this.attachSynth.bind(this)

    Tone.Transport.loop = true
    Tone.Transport.loopStart = '0m'
    Tone.Transport.loopEnd = '4m'
  }


  playSound(){
    Tone.Transport.start()

  }
  stopSound(){
    Tone.Transport.stop()
    Tone.Transport.position = '0:0:0'
    this.state.toneInstruments.forEach(inst => inst.stop())
  }
  addSynth(){
    const instruments = [...this.state.instruments, 'Monosynth']
    this.setState({instruments})
  }
  addPolySynth(){
    const instruments = [...this.state.instruments, 'Polysynth']
    this.setState({instruments})
  }
  attachSynth(synth, i){
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
  showSynth(i, e){
    const tracks = document.querySelectorAll('.track')
    tracks.forEach(track=>track.classList.remove('active'))
    e.currentTarget.classList.add('active')
    this.state.toneInstruments.forEach(inst => inst.hide())
    this.state.toneInstruments[i].show()
  }
  buildTrack(inst, i) {
    return <div key={i} className='track' onClick={(e)=>this.showSynth(i, e)}>{inst}</div>
  }
  buildInstrument(inst, i){
    switch(inst){
      case 'Mixer':
        return <Mixer
          key={i}
          id={i}
          toneInstruments={this.state.toneInstruments}
          attachSynth={this.attachSynth}
        />

      case 'Monosynth':
        return <Monosynth
          key={i}
          id={i}
          toneInstruments={this.state.toneInstruments}
          attachSynth={this.attachSynth}
        />

      case 'Polysynth':
        return <Polysynth
          key={i}
          id={i}
          toneInstruments={this.state.toneInstruments}
          attachSynth={this.attachSynth}
        />
    }
  }

  // showRack(){
  //   document.querySelector('#mixer').style.display = 'none'
  //
  // }
  // showMixer(){
  //   document.querySelector('#mixer').style.display = 'block'
  // }

  render() {

    return (
      <div className='main'>
        <div className='transport-bar'>
          <div className='left'>

          </div>
          <div className='center'>
            <button onClick={()=>this.playSound()}>PLAY</button>
            <button onClick={()=>this.stopSound()}>STOP</button>

          </div>
          <div className='right'>
            <button onClick={()=>this.addSynth()}>Add Mono</button>
            <button onClick={()=>this.addPolySynth()}>Add Poly</button>
            <button onClick={()=>this.removeSynth()}>REMOVE</button>

          </div>
          {/*<button onClick={()=>this.showMixer()}>Mixer</button>
            <button onClick={()=>this.showRack()}>Rack</button>*/}
        </div>
        <div className='work-space'>
          <div className='side-panel'>
            {this.state.instruments.map( (inst,i) => this.buildTrack(inst, i))}
          </div>
          <div className="rack">
            {this.state.instruments.map( (inst,i) => this.buildInstrument(inst, i))}
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
