import React from 'react'
import Tone from 'tone'
import Nexus from 'nexusui'

// import Nexus from '../js/NexusUI'
import '../scss/mixer.scss'


const defaultSlider = {
  'size': [40,240],
  'mode': 'absolute',  // 'relative' or 'absolute'
  'min': 0,
  'max': 1,
  'step': 0,
  'value': 0
}

const defaultDial = {
  'size': [50,50],
  'interaction': 'vertical', // "radial", "vertical", or "horizontal"
  'mode': 'relative', // "absolute" or "relative"
  'min': -1,
  'max': 1,
  'step': 0,
  'value': 0
}

const auxDial = {
  'size': [50,50],
  'interaction': 'vertical', // "radial", "vertical", or "horizontal"
  'mode': 'relative', // "absolute" or "relative"
  'min': 0,
  'max': 1,
  'step': 0,
  'value': 0
}

const defaultChannelSetting = {
  volume: -6, pan: 0, aux1: 0, aux2: 0, mute: false, solo: false,
  settings: {volume: -6, pan: 0, aux1: 0, aux2: 0, mute: false, solo: false}
}

const gainToDb = Tone.gainToDb

let isTicking
const debounce = (callback, ...args) => {
  if (isTicking) return
  setTimeout(()=>{
    callback(...args)
    isTicking = false
  },100)
  // requestAnimationFrame(() => {
  //   callback(...args)
  //   isTicking = false
  // })
  isTicking = true
}

class Mixer extends React.Component {
  constructor(){
    super()
    this.state = {
      instrumentCount: 0,
      channels: new Array(8).fill({...defaultChannelSetting})
    }
    this.channelArr = []
    this.levelElemArr = []
    this.meterArr = []
    this.aux1Send = []
    this.aux2Send = []
    this.volumeSliders = []
    this.panDials = []
    this.aux1Dials = []
    this.aux2Dials = []
    this.muteButtons = []
    this.soloButtons = []


    this.reverb = new Tone.Reverb(1.5).toMaster()
    this.reverb.generate()
    this.reverb.wet.value = 1
    this.reverb.receive('aux2')

    this.delay = new Tone.FeedbackDelay('6n', 0.2).toMaster()
    this.delay.receive('aux1')

    this.buildChannels = this.buildChannels.bind(this)
    this.connectInstrumentsToChannels = this.connectInstrumentsToChannels.bind(this)
    this.handleControlChange = this.handleControlChange.bind(this)

    this.stopDecayLevels = this.stopDecayLevels.bind(this)
  }


  // this.props.toneInstruments.forEach( (inst, i) => {
  //   const chnl = this.state.channels[i]
  //   // this.channelArr[i].set(chnl)
  //
  //   this.channelArr[i].volume.rampTo(chnl.volume, 1)
  //   this.channelArr[i].pan.rampTo(chnl.pan, 1)
  //   this.aux1Send[i].gain.rampTo(gainToDb(chnl.aux1), 0.2)
  //   this.aux2Send[i].gain.rampTo(gainToDb(chnl.aux2), 0.2)
  // })

  handleControlChange(val, channel, control){
    console.log('handleControlChange', this.channelArr[channel].pan, this.channelArr[channel].volume )
    const channels = [...this.state.channels]
    let value

    switch(control){
      case 'volume':
        if(val === 'x') value = '-196'
        else value = Tone.gainToDb(val)
        channels[channel].volume = value
        this.channelArr[channel].volume.rampTo(value, 0.1)
        break

      case 'pan':
        channels[channel].pan = val
        this.channelArr[channel].pan.linearRampToValueAtTime(val, +0.1)
        console.log('pan', val)
        break

      case 'aux1':
        channels[channel].aux1 = val
        this.aux1Send[channel].gain.rampTo(gainToDb(val), 0.1)
        break

      case 'aux2':
        channels[channel].aux2 = val
        this.aux2Send[channel].gain.rampTo(gainToDb(val), 0.1)
        break

    }
    this.setState({channels})
  }
  handleSoloChange(e, channel){
    // this.soloButtons.forEach(el => {
    //   el.classList.toggle('disabled')
    // })
    // e.currentTarget.classList.remove('disabled')
    const channels = [...this.state.channels]
    const val = !channels[channel].solo
    channels[channel].solo = val
    this.channelArr[channel].solo = val

    if(channels[channel].solo) e.currentTarget.classList.add('active')
    else e.currentTarget.classList.remove('active')

    this.setState({channels})
  }
  handleMuteChange(e, channel){
    const channels = [...this.state.channels]
    const val = !channels[channel].mute

    channels[channel].mute = val
    this.channelArr[channel].mute = val

    if(channels[channel].mute) e.currentTarget.classList.add('active')
    else e.currentTarget.classList.remove('active')

    this.setState({channels})
  }
  // handleLevelChange(val, channel){
  //   const channels = [...this.state.channels]
  //   let gain
  //   if(!val === 0) gain = '-196'
  //   else gain = Tone.gainToDb(val)
  //   channels[channel].volume = gain
  //   this.setState({channels})
  // }
  // handlePanChange(val, channel){
  //   const channels = [...this.state.channels]
  //   channels[channel].pan = val
  //   this.setState({channels})
  // }
  // handleAux1Change(val, channel){
  //   const channels = [...this.state.channels]
  //   channels[channel].aux1 = val
  //   this.setState({channels})
  // }
  // handleAux2Change(val, channel){
  //   const channels = [...this.state.channels]
  //   channels[channel].aux2 = val
  //   this.setState({channels})
  // }

  buildChannels(){

    this.muteButtons = document.querySelectorAll('.mute')
    this.soloButtons = document.querySelectorAll('.solo')

    this.state.channels.map((channel, i) => {
      const chnl = new Tone.Channel(channel)
      this.channelArr[i] = chnl

      this.aux1Send[i] = chnl.send('aux1', Tone.gainToDb(this.state.channels[i].aux1))
      this.aux2Send[i] = chnl.send('aux2', Tone.gainToDb(this.state.channels[i].aux2))

      const meter = new Tone.Meter(0.85)
      this.meterArr[i] = meter

      chnl.chain(meter, Tone.Master)


      this.volumeSliders[i] = new Nexus.Slider(`#volume-${this.props.id}-${i}`, defaultSlider)
      this.volumeSliders[i].value = Tone.dbToGain(channel.volume)
      // this.volumeSliders[i].on('change', (val)=>this.handleControlChange(val, i, 'volume') )
      this.volumeSliders[i].on('change', (val) => debounce(this.handleControlChange, val, i, 'volume') )

      this.panDials[i] = new Nexus.Dial(`#pan-${this.props.id}-${i}`, defaultDial)
      this.panDials[i].value = channel.pan
      this.panDials[i].on('change', (val)=>this.handleControlChange(val, i, 'pan') )

      this.aux1Dials[i] = new Nexus.Dial(`#aux1-${this.props.id}-${i}`, auxDial)
      this.aux1Dials[i].value = channel.aux1
      this.aux1Dials[i].on('change', (val)=>this.handleControlChange(val, i, 'aux1') )

      this.aux2Dials[i] = new Nexus.Dial(`#aux2-${this.props.id}-${i}`, auxDial)
      this.aux2Dials[i].value = channel.aux2
      this.aux2Dials[i].on('change', (val)=>this.handleControlChange(val, i, 'aux2') )

      this.muteButtons[i].onclick =  (e) => this.handleMuteChange(e, i)
      this.soloButtons[i].onclick =  (e) => this.handleSoloChange(e, i)
    })
  }

  connectInstrumentsToChannels(){
    const labels = document.querySelectorAll('.label')
    labels.forEach(label=>{
      label.innerText=''
    })
    const instruments = this.props.toneInstruments.slice(1)
    // this.props.toneInstruments.forEach((inst,i) => {
    instruments.forEach((inst,i) => {
      // Skip mixer in toneInstruments
      // if(i === 0) return

      const chnl = this.channelArr[i]
      inst.synth.connect(chnl)
      document.querySelector(`#label-${this.props.id}-${i}`).innerText = i
    })
    const instrumentCount = this.props.toneInstruments.length
    this.setState({instrumentCount})
  }
  updateLevels(){
    // this.levelElemArr.forEach((level,i) => {
    //   const signal = this.meterArr[i].getLevel()
    //   if(signal < -52) {
    //     level.style.height = '0px'
    //     return
    //   }
    //   level.style.height = (Tone.dbToGain(signal)*400)+'px'
    // })

    //Optimize

    return this.levelElemArr.reduce((acc, level, i) => {
      const signal = this.meterArr[i].getLevel()

      if(i===0) acc = false

      if(signal < -52) {
        level.style.height = '0%'
        return acc || false
      }
      level.style.height = (Tone.dbToGain(signal)*100)+'%'
      return true
      
    }, true)


  }
  componentDidMount(){
    this.props.attachSynth(this, this.props.id)

    const levelElems = document.querySelectorAll('.level')
    this.levelElemArr = Array.from(levelElems)
    // const this = this
    // new Tone.Loop(function(time){
    //   Tone.Draw.schedule(function(){
    //     that.levelElemArr.forEach((level,i) => {
    //       level.style.height = (Tone.dbToGain(that.meterArr[i].getLevel())*400)+'px'
    //     })
    //   }, time)
    //
    // }, '64n').start

    Tone.Transport.scheduleRepeat((time)=>{
      Tone.Draw.schedule(()=>{
        this.updateLevels()
      }, time)
    }, '64n')

    this.buildChannels()
    this.connectInstrumentsToChannels()

  }

  show(){

    this.setState({display: 'visible'})
  }
  hide(){

    this.setState({display: 'hidden'})
  }

  stopDecayLevels(){
    const decaying = this.updateLevels()
    if(decaying) {
      console.log('decaying',decaying)
      setTimeout(this.stopDecayLevels, 20)
    }
  }
  stop(){
    // this.setState({beat: 0})
    // Tone.Draw.schedule(()=>{
    //
    // })
    // this.stopDecayIntervalCounter = 100
    // const interval = setInterval( ()=> {
    //   if(!this.stopDecayIntervalCounter) clearInterval(interval)
    //   this.stopDecayIntervalCounter--
    //   const decaying = this.updateLevels()
    //   console.log(decaying)
    // }, 20)

    this.stopDecayLevels()

  }

  componentDidUpdate(){

    if(this.props.toneInstruments.length !== this.state.instrumentCount) this.connectInstrumentsToChannels()

    // this.props.toneInstruments.forEach( (inst, i) => {
    //   const chnl = this.state.channels[i]
    //   // this.channelArr[i].set(chnl)
    //
    //   this.channelArr[i].volume.rampTo(chnl.volume, 1)
    //   this.channelArr[i].pan.rampTo(chnl.pan, 1)
    //   this.aux1Send[i].gain.rampTo(gainToDb(chnl.aux1), 0.2)
    //   this.aux2Send[i].gain.rampTo(gainToDb(chnl.aux2), 0.2)
    // })
  }


  render(){
    const {display} = this.state
    return (
      <div id='mixer' className={`mixer ${display}`}>
        <h1>Mixer</h1>
        <div className="channels">

          {this.state.channels.map((inst, i)=>{

            return <div key={i} className='channel'>
              <div id={`label-${this.props.id}-${i}`} className="label"></div>
              <div id={`aux1-${this.props.id}-${i}`}></div>
              <div id={`aux2-${this.props.id}-${i}`}></div>
              <div id={`pan-${this.props.id}-${i}`}></div>
              <div className="mute-solo">
                <div id={`mute-${this.props.id}-${i}`} className='mute'></div>
                <div id={`solo-${this.props.id}-${i}`} className='solo'></div>
              </div>
              <div className="strip">
                <div id={`volume-${this.props.id}-${i}`}></div>
                <div className="level-container">
                  <div id={`level-${this.props.id}-${i}`} className="level"></div>
                </div>
              </div>
            </div>
          })}
        </div>
      </div>
    )
  }
}

export default Mixer
