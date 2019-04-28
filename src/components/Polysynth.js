import React from 'react'
import Tone from 'tone'
import Nexus from 'nexusui'
import '../scss/polysynth.scss'


const rowArr = Array.from(Array(13), (x,i) => i)
const colArr = Array.from(Array(16), (x,i) => i)

const blackRows = ['1','3','6','8','10']
const downBeats = ['0','4','8','12']
const defaultSlider = {
  'size': [20,120],
  'mode': 'absolute',  // 'relative' or 'absolute'
  'min': 0.01,
  'max': 1,
  'step': 0,
  'value': 0
}
// const pitchSlider = {
//   'size': [20,120],
//   'mode': 'absolute',  // 'relative' or 'absolute'
//   'min': 32,
//   'max': 96,
//   'step': 1,
//   'value': 64
// }
// const velocitySlider = {
//   'size': [20,120],
//   'mode': 'absolute',  // 'relative' or 'absolute'
//   'min': 0,
//   'max': 1,
//   'step': 0,
//   'value': 1
// }
const durationArray = [
  '32n',
  '16n',
  '8n',
  '8n.',
  '4n',
  '4n.',
  '2n',
  '1n'
]
const filterFreqSlider = {
  'size': [20,120],
  'mode': 'absolute',  // 'relative' or 'absolute'
  'min': 1,
  'max': 150,
  'step': 0,
  'value': 150
}

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
    attack: 0.2 ,
    decay: 0.5 ,
    sustain: 0.5 ,
    release: 0.5 ,
    baseFrequency: 1000 ,
    octaves: 3 ,
    exponent: 1
  },
  filter: {
    Q: 6,
    type: 'lowpass',
    rolloff: -24
  }
}

const noteOff = {
  beat: 0,
  pitch: [],
  velocity: [],
  duration: []
}

const sequence = [
  noteOff,
  noteOff,
  noteOff,
  noteOff,
  noteOff,
  noteOff,
  noteOff,
  noteOff,
  noteOff,
  noteOff,
  noteOff,
  noteOff,
  noteOff,
  noteOff,
  noteOff,
  noteOff
]

const insertPattern = id => {
  return {
    id,
    sequence: JSON.parse(JSON.stringify(sequence))
  }
}

class Polysynth extends React.Component {
  constructor(){
    super()
    this.state = {
      display: 'hidden',
      beat: 0,
      selectedPattern: 0,
      octave: 3,
      duration: '16n',
      durationIndex: 1,
      patterns: [
        insertPattern(0),
        insertPattern(1),
        insertPattern(2),
        insertPattern(3)
      ],
      settings
    }


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
  stop(){
    console.log('stop', this.props.id)
    this.setState({beat: 0})
    Tone.Draw.schedule(()=>{
      this.removePostion()
    })
  }

  removePostion(){
    this.gridCols.forEach(col => col.classList.remove('active') )

  }
  drawPosition(beat){
    this.removePostion()
    this.gridCols[beat].classList.add('active')
  }

  componentDidMount(){

    if(this.props.id === 0) this.setState({display: 'visible'})

    this.synth = new Tone.PolySynth(4,Tone.MonoSynth)
    this.synth.set(settings)
    this.props.attachSynth(this, this.props.id)


    Tone.Transport.scheduleRepeat((time)=>{
      let {beat} = this.state

      const {pitch, velocity, duration} = this.state.patterns[this.state.selectedPattern].sequence[beat]
      const pitchHz = pitch.map((hz) => Tone.Frequency(hz+24, 'midi'))

      if(velocity) this.synth.triggerAttackRelease(pitchHz, duration, time, velocity)

      Tone.Draw.schedule(()=>{
        this.drawPosition(beat)
      }, time)

      beat = ++beat % 16
      this.setState({beat})

    }, '16n', '0m')

    // const mainSettings = Object.keys(this.state.settings)
    //
    // for (const mainSetting in mainSettings){
    //   const main = mainSettings[mainSetting]
    //   if(main === 'oscillator' || main === 'filter') continue
    //
    //   const secondarySettings = Object.keys(this.state.settings[main])
    //   for(const secSetting in secondarySettings){
    //     const second = secondarySettings[secSetting]
    //     if(second === 'octaves' || second === 'exponent') continue
    //
    //     const name = main+'.'+second
    //     if(second === 'baseFrequency'){
    //       this[name] = new Nexus.Slider(`#${name + this.props.id}`,filterFreqSlider)
    //     }else{
    //       this[name] = new Nexus.Slider(`#${name + this.props.id}`,defaultSlider)
    //     }
    //     this[name].value = this.state.settings[main][second]
    //     this[name].on('change', (val)=>this.handleControlChange(val, name) )
    //
    //   }
    // }

    this.polyElement = document.querySelector(`#poly-${this.props.id}`)
    this.gridCells = this.polyElement.querySelectorAll('.cell')

    this.gridCells.forEach(cell => {
      cell.addEventListener('click', (e) => this.clickGrid(e))
      // cell.addEventListener('mouseover', (e) => this.mouseoverGrid(e))

      if(blackRows.includes(cell.dataset.row)) cell.classList.add('black')
      if(downBeats.includes(cell.dataset.col)) cell.classList.add('down-beat')
    })

    this.gridCols = this.polyElement.querySelectorAll('.col')

    this.noteArray = []
    for (let i = 0; i <= 72; i++) {
      this.noteArray[i] = []
      for (var j = 0; j < 16; j++) {
        this.noteArray[i][j] = false
      }
    }
  }

  handleControlChange(val, name){
    let value
    let index
    switch(name){
      case 'octaveInc':

        value = (val === 5) ? val : ++val
        this.setState({octave: value}, this.drawGrid)
        break

      case 'octaveDec':
        value = (val === 0) ? val : --val
        this.setState({octave: value}, this.drawGrid)
        break

      case 'durationInc':
        index = (val === durationArray.length-1) ? val : ++val
        value = durationArray[index]
        this.setState({duration: value, durationIndex: val})
        break

      case 'durationDec':
        index = (val === 0) ? val : --val
        value = durationArray[index]
        this.setState({duration: value, durationIndex: val})
        break

      case 'preset':
        console.log('preset', val)
        switch(val){
          case 1:
            this.synth.set(settings)
            break

          case 2:
            this.synth.set(settings2)
            break

        }
    }

  }

  drawGrid(){
    console.log('drawGrid')
    const {octave} = this.state
    this.gridCells.forEach( cell => {
      const {row, col} = cell.dataset
      const pitch = parseInt(row) + (octave*12)

      cell.classList.remove('active')
      const delem = cell.querySelector('.note')
      if(delem) cell.removeChild(delem)


      if(this.noteArray[pitch][col]){
        const elem = document.createElement('div')
        elem.classList.add('note', `d${this.noteArray[pitch][col]}` )
        let val = this.noteArray[pitch][col].replace('n','')

        // const width = ((640 / val) - 2)
        // elem.style.width = width+'px'
        const dotted = val.includes('.')
        val = val.replace('.','')

        let width = ((16 / val) *100)
        if (dotted) width = width + width/2

        let border = (((16 / val)-1) *2)
        if (dotted) border = border + border/2

        elem.style.width = `calc(${width}% + ${border}px)`
        cell.appendChild(elem)

      }
    })
  }

  clickGrid(e){

    const {col, row} = e.currentTarget.dataset
    const {selectedPattern, duration} = this.state

    const patterns = [...this.state.patterns]
    const note = patterns[selectedPattern].sequence[col]
    const pitch = parseInt(row)+(this.state.octave*12)

    if(!this.noteArray[pitch][col]) this.noteArray[pitch][col] = duration
    else   this.noteArray[pitch][col] = false

    if(this.noteArray[pitch][col]){
      console.log(duration)
      const pitchHz = Tone.Frequency(pitch+24, 'midi')
      this.synth.triggerAttackRelease(pitchHz, duration)

      note.pitch.push(pitch)
      note.duration.push(duration)
      note.velocity = 1

    }else{

      // Get the index of this pitch in the pitch array
      const index = note.pitch.indexOf(pitch)

      //remove note from pitch array
      note.pitch.splice(index, 1)
      note.duration.splice(index, 1)

      //If no noes left to be played this beat, turn off with velocity 0
      if(note.pitch.length===0) note.velocity = 0
    }

    this.drawGrid()
    this.setState({patterns})


  }

  render(){
    const {id} = this.props
    return (
      <div id={`poly-${id}`} className={`polysynth ${this.state.display}`}>
        <div className='inner'>
          <h1>Polysynth</h1>
          <button onClick={()=>this.handleControlChange(1,'preset')}> Preset1</button>
          <button onClick={()=>this.handleControlChange(2,'preset')}> Preset2</button>
        </div>
        <div className='sequencer'>
          <div className='controls'>
            <div className='button' onClick={()=>this.handleControlChange(this.state.octave, 'octaveInc')}>8ve+</div>
            <div className='button' onClick={()=>this.handleControlChange(this.state.octave, 'octaveDec')}>8ve-</div>
            <div className='button'>{this.state.octave}</div>
            <div className='button hidden'></div>
            <div
              className='button'
              onClick={()=>this.handleControlChange(this.state.durationIndex, 'durationInc')}
            >Length+</div>
            <div
              className='button'
              onClick={()=>this.handleControlChange(this.state.durationIndex, 'durationDec')}
            >Length-</div>
            <div className='button'>{this.state.duration}</div>
            <div className='button hidden'></div>
            <div className='button hidden'></div>
            <div className='button hidden'></div>
            <div className='button hidden'></div>
            <div className='button hidden'></div>
            <div className='button hidden'></div>
          </div>
          <div className="grid">
            {colArr.map( col => <div key={col} className='col'>
              {rowArr.map( row =><div key={row} className='cell' data-col={col} data-row={row}></div>)}
            </div>)}
          </div>
        </div>

      </div>
    )
  }
}

export default Polysynth
