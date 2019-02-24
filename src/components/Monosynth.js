import React from 'react'
import Tone from 'tone'

import Nexus from '../js/NexusUI'

class Monosynth extends React.Component {
  constructor(){
    super()

    this.state={
      'oscillator': {
        'type': 'pwm',
        'modulationFrequency': 0.2
      },
      'envelope': {
        'attack': 0.52,
        'decay': 0.1,
        'sustain': 0.2,
        'release': 0.9
      }
    }


    this.handleControlChange = this.handleControlChange.bind(this)
    this.handleRadioButtonChange = this.handleRadioButtonChange.bind(this)
  }

  componentDidUpdate(){
    // this.synth.triggerAttackRelease('C2', '32n', this.props.time)
    this.synth.triggerAttackRelease(this.props.pitch, this.props.duration, this.props.time)
  }

  handleControlChange(val, mod){
    console.log('v', val, this.synth)
    mod = mod.split('.')
    this.synth[mod[0]][mod[1]] = val
  }

  handleRadioButtonChange(val){
    console.log('v', val, this.synth)
    let str
    switch(val){
      case 0:
        str = 'sawtooth'
        break
      case 1:
        str = 'square'
        break
      case 2:
        str = 'pwm'
        break
      case 3:
        str = 'sine'
        break
    }
    console.log('str', str)

    this.synth.oscillator.type = str
  }
  componentDidMount(){
    this.synth = new Tone.Synth({
      oscillator: this.state.oscillator,
      envelope: this.state.envelope
    }).toMaster()

    const defaultSlider = {
      'size': [20,120],
      'mode': 'relative',  // 'relative' or 'absolute'
      'min': 0.000000000000001,
      'max': 1,
      'step': 0,
      'value': 0
    }

    // this.dial1 = new Nexus.Dial('#dial')
    // this.dial1.on('change', (val)=>this.handleRadioButtonChange(val, 'envelope.attack') )
    console.log('this.props.id',this.props.id)

    this.waveform = new Nexus.RadioButton(`#waveform${this.props.id}`,{
      'size': [120,25],
      'numberOfButtons': 4,
      'active': 0
    })

    this.waveform.on('change', (val)=>this.handleRadioButtonChange(val, 'envelope.attack') )
    this.envelopeAttack = new Nexus.Slider(`#envelopeAttack${this.props.id}`,defaultSlider)
    this.envelopeAttack.value = this.state.envelope.attack
    this.envelopeAttack.on('change', (val)=>this.handleControlChange(val, 'envelope.attack') )

    this.envelopeDecay = new Nexus.Slider(`#envelopeDecay${this.props.id}`,defaultSlider)
    this.envelopeDecay.value = this.state.envelope.decay
    this.envelopeDecay.on('change', (val)=>this.handleControlChange(val, 'envelope.decay') )

    this.envelopeSustain = new Nexus.Slider(`#envelopeSustain${this.props.id}`,defaultSlider)
    this.envelopeSustain.value = this.state.envelope.sustain
    this.envelopeSustain.on('change', (val)=>this.handleControlChange(val, 'envelope.sustain') )

    this.envelopeRelease = new Nexus.Slider(`#envelopeRelease${this.props.id}`,defaultSlider)
    this.envelopeRelease.value = this.state.envelope.release
    this.envelopeRelease.on('change', (val)=>this.handleControlChange(val, 'envelope.release') )

  }




  render(){
    return (
      <div className='monosynth'>
        <h1>Beat</h1>
        <h2>{this.props.currentBeat}</h2>
        <div id={`waveform${this.props.id}`}></div>
        <div className="control-container">
          <div id={`envelopeAttack${this.props.id}`}></div>
          <div id={`envelopeDecay${this.props.id}`}></div>
          <div id={`envelopeSustain${this.props.id}`}></div>
          <div id={`envelopeRelease${this.props.id}`}></div>
        </div>
      </div>
    )
  }
}

export default Monosynth
