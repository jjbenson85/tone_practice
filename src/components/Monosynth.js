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
          duration: '16n'
        },
        {
          beat: 1,
          pitch: 64,
          duration: '16n'
        },
        {
          beat: 2,
          pitch: 64,
          duration: '16n'
        },
        {
          beat: 3,
          pitch: 64,
          duration: '16n'
        },
        {
          beat: 4,
          pitch: 64,
          duration: '16n'
        },
        {
          beat: 5,
          pitch: 64,
          duration: '16n'
        },
        {
          beat: 6,
          pitch: 64,
          duration: '16n'
        },
        {
          beat: 7,
          pitch: 64,
          duration: '16n'
        },
        {
          beat: 8,
          pitch: 64,
          duration: '16n'
        },
        {
          beat: 9,
          pitch: 64,
          duration: '16n'
        },
        {
          beat: 10,
          pitch: 64,
          duration: '16n'
        },
        {
          beat: 11,
          pitch: 64,
          duration: '16n'
        },
        {
          beat: 12,
          pitch: 64,
          duration: '16n'
        },
        {
          beat: 13,
          pitch: 64,
          duration: '16n'
        },
        {
          beat: 14,
          pitch: 64,
          duration: '16n'
        },
        {
          beat: 15,
          pitch: 64,
          duration: '16n'
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

  componentDidUpdate(){
    // const envelope = () => {
    //   const {attack, decay, sustain, release } = this.state.envelope
    //   const env = this.synth.envelope
    //   env.attack = attack
    //   env.decay = decay
    //   env.sustain = sustain
    //   env.release = release
    // }
    //
    // const filterEnvelope= () => {
    //   const {attack, decay, sustain, release } = this.state.filterEnvelope
    //   const env = this.synth.envelope
    //   env.attack = attack
    //   env.decay = decay
    //   env.sustain = sustain
    //   env.release = release
    // }
    //
    // envelope()
    // filterEnvelope()
    //
    // this.synth.filterEnvelope.baseFrequency = this.state.filterEnvelope.baseFrequency

    // this.synth.triggerAttackRelease(this.state.currentSequence.pitch, this.state.currentSequence.duration, this.state.transport.time)
  }

  handleControlChange(val, mod){
    // mod = mod.split('.')
    //
    // const partA = mod[0]
    // const partB = mod[1]

    const [partA, partB] = mod.split('.')
    console.log(partA, partB, val, this.synth)
    this.synth[partA][partB] = val
    const settings = {...this.state.settings}
    settings[partA][partB] = val
    this.setState({settings})
    // switch(mod[0]){
    //   case 'envelope':
    //     console.log(mod)
    //     break
    //
    // }
    //
    // // this.synth[mod[0]][mod[1]] = val
    //
    // let oscillator = {...this.state.oscillator}
    // let envelope = {...this.state.envelope}
    // let filterEnvelope = {...this.state.filterEnvelope}
    // let filter = {...this.state.filter}
    //
    // // if(mod[0]==='oscillator'){
    // //   oscillator = {...this.state.oscillator, [mod[1]]: val}
    // // }else if(mod[0]==='envelope'){
    // //   envelope = {...this.state.envelope, [mod[1]]: val}
    // // }
    // switch(mod[0]){
    //   case 'oscillator':
    //     oscillator = {...this.state.oscillator, [mod[1]]: val}
    //     break
    //
    //   case 'envelope':
    //     envelope = {...this.state.envelope, [mod[1]]: val}
    //     break
    //
    //   case 'filterEnvelope':
    //     filterEnvelope = {...this.state.filterEnvelope, [mod[1]]: val}
    //     break
    //
    //   case 'filter':
    //     filter = {...this.state.filter, [mod[1]]: val}
    //     break
    // }
    //
    // this.setState({oscillator, envelope, filterEnvelope, filter})
    // const envelopeF = () => {
    //   const {attack, decay, sustain, release } = this.state.envelope
    //   const env = this.synth.envelope
    //   env.attack = attack
    //   env.decay = decay
    //   env.sustain = sustain
    //   env.release = release
    // }
    //
    // const filterEnvelopeF= () => {
    //   const {attack, decay, sustain, release } = this.state.filterEnvelope
    //   const env = this.synth.envelope
    //   env.attack = attack
    //   env.decay = decay
    //   env.sustain = sustain
    //   env.release = release
    // }
    //
    // envelopeF()
    // filterEnvelopeF()
    //
    // this.synth.filterEnvelope.baseFrequency = this.state.filterEnvelope.baseFrequency

  }

  handleRadioButtonChange(val){
    // console.log('v', val, this.synth)
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
    // console.log('str', str)

    this.synth.oscillator.type = str
  }

  handlePitchChange(val, beat){
    // console.log(val, beat)
    const sequence = [...this.state.sequence]
    sequence[beat].pitch = val
    this.setState({sequence})
  }
  componentDidMount(){
    const that = this
    this.loop = new Tone.Sequence(function(time, beat){
      // that.setState({transport: {beat, time}})
      // console.log(that.state.sequence[beat])
      // this.setState({currentSequence: that.props.sequence[beat]})
      const {pitch, duration} = that.state.sequence[beat]
      // this.synth.triggerAttackRelease(this.state.currentSequence.pitch, this.state.currentSequence.duration, this.state.transport.time)
      that.synth.triggerAttackRelease(pitch, duration, time)
    }, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], '16n')
    this.loop.start()

    // this.synth = new Tone.MonoSynth({
    //   oscillator: this.state.oscillator,
    //   envelope: this.state.envelope,
    //   filterEnvelope: this.state.filterEnvelope
    // }).toMaster()
    const settings = this.state.settings
    this.synth = new Tone.MonoSynth(settings
    ).toMaster()

    const obj = {...this.synth}

    console.log('obj', obj)

    // const oscillator = {...this.state.oscillator}
    // const envelope = {...this.state.envelope}

    // this.setState({oscillator, envelope})


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

    const filterFreqSlider = {
      'size': [20,120],
      'mode': 'relative',  // 'relative' or 'absolute'
      'min': 1,
      'max': 150,
      'step': 0,
      'value': 150
    }



    // this.dial1 = new Nexus.Dial('#dial')
    // this.dial1.on('change', (val)=>this.handleRadioButtonChange(val, 'envelope.attack') )
    // console.log('this.props.id',this.props.id)

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
    /*
    const eA = 'envelope.attack'
    const arr = eA.split('.')
    const partA = arr[0]
    const partB = arr[1].substr(0,1).toUpperCase()
    const partC = arr[1].substr(1)
    const eACamel = [partA, partB, partC].join('')
    console.log(partA, partB, partC, eACamel)


    this[eA] = new Nexus.Slider(`#${eA + this.props.id}`,defaultSlider)
    this[eA].value = this.state.settings.envelope.attack
    this[eA].on('change', (val)=>this.handleControlChange(val, eA) )

    // this.envelopeAttack = new Nexus.Slider(`#envelopeAttack${this.props.id}`,defaultSlider)
    // this.envelopeAttack.value = this.state.settings.envelope.attack
    // this.envelopeAttack.on('change', (val)=>this.handleControlChange(val, 'envelope.attack') )

    this.envelopeDecay = new Nexus.Slider(`#envelopeDecay${this.props.id}`,defaultSlider)
    this.envelopeDecay.value = this.state.settings.envelope.decay
    this.envelopeDecay.on('change', (val)=>this.handleControlChange(val, 'envelope.decay') )

    this.envelopeSustain = new Nexus.Slider(`#envelopeSustain${this.props.id}`,defaultSlider)
    this.envelopeSustain.value = this.state.settings.envelope.sustain
    this.envelopeSustain.on('change', (val)=>this.handleControlChange(val, 'envelope.sustain') )

    this.envelopeRelease = new Nexus.Slider(`#envelopeRelease${this.props.id}`,defaultSlider)
    this.envelopeRelease.value = this.state.settings.envelope.release
    this.envelopeRelease.on('change', (val)=>this.handleControlChange(val, 'envelope.release') )



    this.filterEnvelopeAttack = new Nexus.Slider(`#filterEnvelopeAttack${this.props.id}`,defaultSlider)
    this.filterEnvelopeAttack.value = this.state.settings.filterEnvelope.attack
    this.filterEnvelopeAttack.on('change', (val)=>this.handleControlChange(val, 'filterEnvelope.attack') )

    this.filterEnvelopeDecay = new Nexus.Slider(`#filterEnvelopeDecay${this.props.id}`,defaultSlider)
    this.filterEnvelopeDecay.value = this.state.settings.filterEnvelope.decay
    this.filterEnvelopeDecay.on('change', (val)=>this.handleControlChange(val, 'filterEnvelope.decay') )

    this.filterEnvelopeSustain = new Nexus.Slider(`#filterEnvelopeSustain${this.props.id}`,defaultSlider)
    this.filterEnvelopeSustain.value = this.state.settings.filterEnvelope.sustain
    this.filterEnvelopeSustain.on('change', (val)=>this.handleControlChange(val, 'filterEnvelope.sustain') )

    this.filterEnvelopeRelease = new Nexus.Slider(`#filterEnvelopeRelease${this.props.id}`,defaultSlider)
    this.filterEnvelopeRelease.value = this.state.settings.filterEnvelope.release
    this.filterEnvelopeRelease.on('change', (val)=>this.handleControlChange(val, 'filterEnvelope.release') )

    this.filterFrequency = new Nexus.Slider(`#filterfrequency${this.props.id}`,filterFreqSlider)
    this.filterFrequency.value = this.state.settings.filterEnvelope.baseFrequency
    this.filterFrequency.on('change', (val)=>this.handleControlChange(val, 'filterEnvelope.baseFrequency') )
    */
    this.beatSliders = []
    this.state.sequence.forEach((beat,i)=>{
      this.beatSliders[i] = new Nexus.Slider(`#beat-${this.props.id}-${i}`,pitchSlider)
      this.beatSliders[i].value = this.state.sequence[i].pitch
      this.beatSliders[i].on('change', (val)=>this.handlePitchChange(val, i) )
    })
    // const el = document.querySelector('#target')
    // console.log(el)
    // console.log(this.sequencerElement)
    // if(this.sequencerElement)   this.sequencer = new Nexus.Sequencer(this.sequencerElement)



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

        <div className="notes">
          <div className="control-container">
            {this.state.sequence.map((beat, i)=><div key={i} id={`beat-${this.props.id}-${i}`}></div>)}
          </div>
        </div>
      </div>
    )
  }
}

export default Monosynth
