import React from 'react'
import Tone from 'tone'
import Nexus from 'nexusui'

// import Nexus from '../js/NexusUI'

const noteOff = {
  beat: 0,
  pitch: 0,
  velocity: 0,
  duration: '32n'
}

const note1 = {
  beat: 0,
  pitch: 44,
  velocity: 1,
  duration: '32n'
}

const note2 = {
  beat: 0,
  pitch: 48,
  velocity: 1,
  duration: '32n'
}
const note3 = {
  beat: 0,
  pitch: 62,
  velocity: 1,
  duration: '32n'
}







const sequence = [
  note1,
  noteOff,
  note2,
  noteOff,
  note3,
  noteOff,
  note1,
  noteOff,
  note2,
  noteOff,
  note3,
  noteOff,
  note1,
  noteOff,
  note2,
  noteOff
]

class Monosynth extends React.Component {
  constructor(){
    super()

    this.state={
      sequence,
      settings: {
        oscillator: {
          type: 'pwm',
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
          baseFrequency: 75 ,
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
      const pitchHz = Tone.Frequency(pitch, 'midi') //
      if(velocity) that.synth.triggerAttackRelease(pitchHz, duration, time, velocity)
    }, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], '16n').start()
    // this.loop.start()

    const settings = this.state.settings

    this.synth = new Tone.MonoSynth(settings)

    // this.props.toneInstruments.push(this)

    this.props.attachSynth(this, this.props.id)



    // const reverb = new Tone.Reverb({
    //   decay: 1.5 ,
    //   preDelay: 0.01
    // }).toMaster()

    // const dist = new Tone.Distortion(0.8)
    // var pingPong = new Tone.PingPongDelay('4n', 0.2)
    //
    // const effectsChain = [pingPong, dist, Tone.Master]
    //
    // this.synth.chain(...effectsChain)




    const defaultSlider = {
      'size': [20,120],
      'mode': 'absolute',  // 'relative' or 'absolute'
      'min': 0.01,
      'max': 1,
      'step': 0,
      'value': 0
    }
    const pitchSlider = {
      'size': [20,120],
      'mode': 'absolute',  // 'relative' or 'absolute'
      'min': 32,
      'max': 96,
      'step': 1,
      'value': 64
    }
    const velocitySlider = {
      'size': [20,120],
      'mode': 'absolute',  // 'relative' or 'absolute'
      'min': 0,
      'max': 1,
      'step': 0,
      'value': 1
    }

    const filterFreqSlider = {
      'size': [20,120],
      'mode': 'absolute',  // 'relative' or 'absolute'
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
        // console.log('setting',main, second)
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
        <div className='inner'>
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
          <div className="patterns">
          <div className="control-container">
            {this.state.sequence.map((beat, i)=><div key={i} id={`pattern-${this.props.id}-${i}`}></div>)}
          </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Monosynth
