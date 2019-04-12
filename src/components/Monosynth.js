import React from 'react'
import Tone from 'tone'
import Nexus from 'nexusui'

// import Nexus from '../js/NexusUI'

class Monosynth extends React.Component {
  constructor(){
    super()

    this.state={
      sequence: [
        {
          beat: 0,
          pitch: 64,
          velocity: 1,
          duration: '32n'
        },
        {
          beat: 1,
          pitch: 64,
          velocity: 1,
          duration: '32n'
        },
        {
          beat: 2,
          pitch: 64,
          velocity: 1,
          duration: '32n'
        },
        {
          beat: 3,
          pitch: 64,
          velocity: 1,
          duration: '32n'
        },
        {
          beat: 4,
          pitch: 64,
          velocity: 1,
          duration: '32n'
        },
        {
          beat: 5,
          pitch: 64,
          velocity: 1,
          duration: '32n'
        },
        {
          beat: 6,
          pitch: 64,
          velocity: 1,
          duration: '32n'
        },
        {
          beat: 7,
          pitch: 64,
          velocity: 1,
          duration: '32n'
        },
        {
          beat: 8,
          pitch: 64,
          velocity: 1,
          duration: '32n'
        },
        {
          beat: 9,
          pitch: 64,
          velocity: 1,
          duration: '32n'
        },
        {
          beat: 10,
          pitch: 64,
          velocity: 1,
          duration: '32n'
        },
        {
          beat: 11,
          pitch: 64,
          velocity: 1,
          duration: '32n'
        },
        {
          beat: 12,
          pitch: 64,
          velocity: 1,
          duration: '32n'
        },
        {
          beat: 13,
          pitch: 64,
          velocity: 1,
          duration: '32n'
        },
        {
          beat: 14,
          pitch: 64,
          velocity: 1,
          duration: '32n'
        },
        {
          beat: 15,
          pitch: 64,
          velocity: 1,
          duration: '32n'
        }
      ],
      settings: {
        oscillator: {
          type: 'pwm',
          modulationFrequency: 0.2
        },
        envelope: {
          attack: 0.01,
          decay: 0.1,
          sustain: 0.2,
          release: 0.1
        },
        filterEnvelope: {
          attack: 0.01 ,
          decay: 0.2 ,
          sustain: 0.5 ,
          release: 0.1 ,
          baseFrequency: 150 ,
          octaves: 5 ,
          exponent: 2
        },
        filter: {
          Q: 1,
          type: 'lowpass',
          rolloff: -24
        }
      }
    }
    this.handleControlChange = this.handleControlChange.bind(this)
    this.handleRadioButtonChange = this.handleRadioButtonChange.bind(this)
  }

  handleControlChange(val, mod){
    const [partA, partB] = mod.split('.')
    this.synth[partA][partB] = val
    const settings = {...this.state.settings}
    settings[partA][partB] = val
    this.setState({settings})
  }

  handleRadioButtonChange(val){
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
    this.synth.oscillator.type = str
  }

  handlePitchChange(val, beat){
    const sequence = [...this.state.sequence]
    sequence[beat].pitch = val
    this.setState({sequence})
  }
  handleVelocityChange(val, beat){
    const sequence = [...this.state.sequence]
    sequence[beat].velocity = val
    this.setState({sequence})
  }

  removeSynth(){
    this.synth.dispose()
  }
  componentDidMount(){
    const that = this
    this.loop = new Tone.Sequence(function(time, beat){
      const {pitch, velocity, duration} = that.state.sequence[beat]

      if(velocity) that.synth.triggerAttackRelease(pitch, duration, time, velocity)
    }, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], '16n').start()
    // this.loop.start()

    const settings = this.state.settings
    this.synth = new Tone.MonoSynth(settings
    ).toMaster()
    this.props.toneInstruments.push(this)

    const defaultSlider = {
      'size': [20,120],
      'mode': 'relative',  // 'relative' or 'absolute'
      'min': 0.01,
      'max': 1,
      'step': 0,
      'value': 0
    }
    const pitchSlider = {
      'size': [20,120],
      'mode': 'relative',  // 'relative' or 'absolute'
      'min': 64,
      'max': 88,
      'step': 1,
      'value': 64
    }
    const velocitySlider = {
      'size': [20,120],
      'mode': 'relative',  // 'relative' or 'absolute'
      'min': 0,
      'max': 1,
      'step': 0,
      'value': 1
    }

    const filterFreqSlider = {
      'size': [20,120],
      'mode': 'relative',  // 'relative' or 'absolute'
      'min': 1,
      'max': 150,
      'step': 0,
      'value': 150
    }

    this.oscillatorType = new Nexus.RadioButton(`#oscillatorType${this.props.id}`,{
      'size': [120,25],
      'numberOfButtons': 4,
      'active': 0
    })

    this.oscillatorType.on('change', (val)=>this.handleRadioButtonChange(val, 'oscillator.type') )

    const mainSettings = Object.keys(this.state.settings)

    for (const mainSetting in mainSettings){
      const main = mainSettings[mainSetting]
      if(main === 'oscillator') continue
      if(main === 'filter') continue

      const secondarySettings = Object.keys(this.state.settings[main])
      for(const secSetting in secondarySettings){
        const second = secondarySettings[secSetting]
        if(second === 'octaves') continue
        if(second === 'exponent') continue
        console.log('setting',main, second)
        const name = main+'.'+second
        if(second === 'baseFrequency'){
          this[name] = new Nexus.Slider(`#${name + this.props.id}`,filterFreqSlider)
        }else{
          this[name] = new Nexus.Slider(`#${name + this.props.id}`,defaultSlider)
        }
        this[name].value = this.state.settings[main][second]
        this[name].on('change', (val)=>this.handleControlChange(val, name) )

      }
    }

    this.pitchSliders = []
    this.state.sequence.forEach((beat,i)=>{
      this.pitchSliders[i] = new Nexus.Slider(`#pitch-${this.props.id}-${i}`,pitchSlider)
      this.pitchSliders[i].value = this.state.sequence[i].pitch
      this.pitchSliders[i].on('change', (val)=>this.handlePitchChange(val, i) )
    })
    this.velocitySliders = []
    this.state.sequence.forEach((beat,i)=>{
      this.velocitySliders[i] = new Nexus.Slider(`#velocity-${this.props.id}-${i}`,velocitySlider)
      this.velocitySliders[i].value = this.state.sequence[i].velocity
      this.velocitySliders[i].on('change', (val)=>this.handleVelocityChange(val, i) )
    })
  }




  render(){
    return (
      <div className='monosynth'>
        <h1>Monosynth</h1>
        <div id="#target" ref={el => this.sequencerElement = el} ></div>

        <div id={`oscillatorType${this.props.id}`}></div>

        <div className="controls">
          <div className="control-container">
            <div id={`envelope.attack${this.props.id}`}></div>
            <div id={`envelope.decay${this.props.id}`}></div>
            <div id={`envelope.sustain${this.props.id}`}></div>
            <div id={`envelope.release${this.props.id}`}></div>
          </div>
          <div className="control-container">
            <div id={`filterEnvelope.attack${this.props.id}`}></div>
            <div id={`filterEnvelope.decay${this.props.id}`}></div>
            <div id={`filterEnvelope.sustain${this.props.id}`}></div>
            <div id={`filterEnvelope.release${this.props.id}`}></div>
            <div id={`filterEnvelope.baseFrequency${this.props.id}`}></div>
          </div>
        </div>
        <div className="controls">
          <div className="notes">
            <div className="control-container">
              {this.state.sequence.map((beat, i)=><div key={i} id={`pitch-${this.props.id}-${i}`}></div>)}
            </div>
          </div>
          <div className="velocities">
            <div className="control-container">
              {this.state.sequence.map((beat, i)=><div key={i} id={`velocity-${this.props.id}-${i}`}></div>)}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Monosynth
