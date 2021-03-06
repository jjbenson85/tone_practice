import React from 'react'
import Tone from 'tone'
import GridSequencer from './GridSequencer.js'
import PolySynthInterface from './PolySynthInterface.js'
import '../scss/polysynth.scss'

const settings = {
  oscillator: {
    type: 'sawtooth',
    modulationFrequency: 0.2
  },
  envelope: {
    attack: 0.01,
    decay: 0.1,
    sustain: 0.9,
    release: 0.9
  },
  filterEnvelope: {
    attack: 0.01 ,
    decay: 0.2 ,
    sustain: 0.5 ,
    release: 0.9 ,
    baseFrequency: 1000 ,
    octaves: 2 ,
    exponent: 1
  },
  filter: {
    Q: 6,
    type: 'lowpass',
    rolloff: -24
  }
}
const settings2 = {
  oscillator: {
    type: 'pwm',
    modulationFrequency: 0.2
  },
  envelope: {
    attack: 0.01,
    decay: 0.1,
    sustain: 0.9,
    release: 0.01
  },
  filterEnvelope: {
    attack: 0.01 ,
    decay: 0.01 ,
    sustain: 1 ,
    release: 0.01 ,
    baseFrequency: 1000 ,
    octaves: 3
  }
}
const settings3 = {
  oscillator: {
    type: 'pwm',
    modulationFrequency: 0.2
  },
  envelope: {
    attack: 0.001,
    decay: 0.1,
    sustain: 1,
    release: 0.001
  },
  filterEnvelope: {
    attack: 0.001 ,
    decay: 0.01 ,
    sustain: 0 ,
    release: 0.001 ,
    baseFrequency: 50 ,
    octaves: 7
  }
}

const settings4 = {
  oscillator: {
    type: 'fmsquare',
    modulationType: 'sawtooth',
    harmonicity: 0.3456
  },
  envelope: {
    attack: 0.001,
    decay: 0.1,
    sustain: 0,
    release: 0.001
  },
  filterEnvelope: {
    attack: 0.001 ,
    decay: 0.1 ,
    sustain: 0 ,
    release: 0.001 ,
    baseFrequency: 400 ,
    octaves: 1
  },
  filter: {
    type: 'highpass'
  }
}

class PolySynth extends React.Component {
  constructor(){
    super()
    this.state = {
      display: 'hidden',
      settings
    }
    this.attachSequencer = this.attachSequencer.bind(this)
  }
  attachSequencer(sequencer){
    this.sequencer = sequencer
  }
  removeSynth(){
    this.synth.dispose()
  }
  show(){
    this.setState({display: 'visible'})
  }
  hide(){
    this.setState({display: 'hidden'})
  }

  componentDidMount(){

    if(this.props.id === 0) this.setState({display: 'visible'})
    this.synth = new Tone.PolySynth(4,Tone.MonoSynth)
    this.synth.set(settings)
    this.props.attachSynth(this, this.props.id)

  }

  handleControlChange(val, name){
    switch(name){
      case 'preset':
        switch(val){
          case 1:
            this.synth.set(settings)
            break

          case 2:
            this.synth.set(settings2)
            break

          case 3:
            this.synth.set(settings3)
            break

          case 4:
            this.synth.set(settings4)
            break

        }
        break
    }
  }

  render(){
    const {id} = this.props
    const {display} = this.state
    const handleControlChange = this.handleControlChange
    const props = {id, display, handleControlChange}
    return (
      <div id={`poly-${id}`} className={`polysynth ${display}`}>
        <PolySynthInterface  {...props}/>
        <GridSequencer display={display} parent={this} id={id} attachSequencer={this.attachSequencer}/>
      </div>
    )
  }
}

export default PolySynth
