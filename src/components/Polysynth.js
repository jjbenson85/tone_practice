import React from 'react'
import Tone from 'tone'
import Nexus from 'nexusui'
import '../scss/polysynth.scss'


const rowArr = Array.from(Array(13), (x,i) => i)
const colArr = Array.from(Array(16), (x,i) => i)

const blackRows = ['1','3','6','8','10']
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

const noteOff = {
  beat: 0,
  pitch: [],
  velocity: [0],
  duration: '32n'
}

const note1 = {
  beat: 0,
  pitch: [44, 48, 51],
  velocity: 1,
  duration: '32n'
}

const note2 = {
  beat: 0,
  pitch: [48, 51, 55],
  velocity: 1,
  duration: '32n'
}
const note3 = {
  beat: 0,
  pitch: [51,55,58],
  velocity: 1,
  duration: '32n'
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
      selectedPattern: 0,
      octave: 3,
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

  componentDidMount(){
    this.synth = new Tone.PolySynth()
    this.synth.set(settings)
    this.props.attachSynth(this, this.props.id)

    const that = this
    this.loop = new Tone.Sequence(function(time, beat){
      const {pitch, velocity, duration} = that.state.patterns[that.state.selectedPattern].sequence[beat]
      const pitchHz = pitch.map((hz) => Tone.Frequency(hz, 'midi'))

      if(velocity) that.synth.triggerAttackRelease(pitchHz, duration, time, velocity)

      Tone.Draw.schedule(function(){
        that.gridCols.forEach(col => col.classList.remove('active'))
        that.gridCols[beat].classList.add('active')
      }, time)

    }, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], '16n').start()

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

    const polyElement = document.querySelector(`#poly-${this.props.id}`)
    this.gridCells = polyElement.querySelectorAll('.cell')

    this.gridCells.forEach(cell => {
      cell.addEventListener('click', (e) => this.toggleGrid(e))

      if(blackRows.includes(cell.dataset.row)) cell.classList.add('black')
    })

    this.gridCols = polyElement.querySelectorAll('.col')

    const ocatveSlider = new Nexus.Slider(`#octaves-${this.props.id}`,{
      'size': [120,20],
      'mode': 'relative',  // 'relative' or 'absolute'
      'min': 0,
      'max': 5,
      'step': 1,
      'value': 3
    })
    // ocatveSlider.value = this.state.settings[main][second]
    ocatveSlider.on('change', (val)=>this.handleControlChange(val, 'octave') )

    // const beats = new Array(16).fill(0)
    // this.noteArray = new Array(12*5).fill(JSON.parse(JSON.stringify(beats)))

    this.noteArray = []
    for (let i = 0; i < 12*5; i++) {
      this.noteArray[i] = []
      for (var j = 0; j < 16; j++) {
        this.noteArray[i][j] = false
      }
    }

    console.log(this.noteArray)

  }

  handleControlChange(val, name){
    console.log(val, name)

    this.setState({octave: val})

    // this.drawGrid()
  }

  drawGrid(){
    const {octave} = this.state
    this.gridCells.forEach( cell => {
      const {row, col} = cell.dataset
      const pitch = parseInt(row) + (octave*12)
      console.log(row, pitch, col, this.noteArray[pitch][col])
      cell.classList.remove('active')
      if(this.noteArray[pitch][col]){
        console.log('here')
        cell.classList.add('active')
      }
    })

  }

  toggleGrid(e){

    const {col, row} = e.target.dataset
    const elem = e.currentTarget
    const patterns = [...this.state.patterns]
    const note = patterns[this.state.selectedPattern].sequence[col]
    const pitch = parseInt(row)+(this.state.octave*12)

    this.noteArray[pitch][col] = !this.noteArray[pitch][col]
    console.log(col, pitch, this.noteArray[pitch][col])
    console.log('beep', pitch, col)

    if(this.noteArray[pitch][col]){
      // elem.classList.add('active')

      const pitchHz = Tone.Frequency(pitch+24, 'midi')
      this.synth.triggerAttackRelease(pitchHz, '8n')

      note.pitch.push(pitch)
      note.velocity = 1

    }else{

      //Remove active class
      // elem.classList.remove('active')

      // Get the index of this pitch in the pitch array
      const index = note.pitch.indexOf(pitch)

      //remove note from pitch array
      note.pitch.splice(index, 1)

      //If no noes left to be played this beat, turn off with velocity 0
      if(note.pitch.length===0) note.velocity = 0
    }

    this.drawGrid()
    this.setState({patterns})


  }

  render(){
    const {id} = this.props
    return (
      <div id={`poly-${id}`} className='polysynth'>
        <div className='inner'>
          <h1>Polysynth</h1>

          {/*<div id={`oscillatorType${this.props.id}`}></div>

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
                {this.state.patterns[this.state.selectedPattern].sequence.map((beat, i)=><div key={i} id={`pitch-${this.props.id}-${i}`}></div>)}
              </div>
            </div>
            <div className="velocities">
              <div className="control-container">
                {this.state.patterns[this.state.selectedPattern].sequence.map((beat, i)=><div key={i} id={`velocity-${this.props.id}-${i}`}></div>)}
              </div>
            </div>
          </div>*/}
          <div id={`octaves-${id}`} className="octaves">

          </div>
          <div className="grid">
            {colArr.map( col => <div key={col} className='col'>
              {rowArr.map( row =><div key={row} className='cell' data-col={col} data-row={row}></div>)}
            </div>)}
          </div>
          {/*<div className="patterns">
            <div className="control-container pattern">
              {this.state.patterns.map((beat, i)=><div key={i} id={`pattern-${this.props.id}-${i}`}></div>)}
            </div>
            <div className="control-container pattern">
              {this.state.patterns.map((beat, i)=><div key={i} id={`add-${this.props.id}-${i}`}></div>)}
            </div>
          </div>*/}
        </div>
      </div>
    )
  }
}

export default Polysynth
