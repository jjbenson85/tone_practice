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
      beat: 0,
      selectedPattern: 0,
      octave: 3,
      duration: '16n',
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
    this.synth = new Tone.PolySynth()
    this.synth.set(settings)
    this.props.attachSynth(this, this.props.id)

    // const that = this


    // this.loop = new Tone.Sequence(function(time, beat){
    //   const {pitch, velocity, duration} = that.state.patterns[that.state.selectedPattern].sequence[beat]
    //   const pitchHz = pitch.map((hz) => Tone.Frequency(hz+24, 'midi'))
    //
    //   if(velocity) that.synth.triggerAttackRelease(pitchHz, duration, time, velocity)
    //
    //   Tone.Draw.schedule(function(){
    //     that.gridCols.forEach(col => col.classList.remove('active'))
    //     that.gridCols[beat].classList.add('active')
    //   }, time)
    //   // Tone.Transport.schedule(function(time){
    //   // 	//time = sample accurate time of the event
    //   // }, "1m");
    //
    // }, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], '16n').start()

    Tone.Transport.scheduleRepeat((time)=>{
      // note.triggerAttack(time)
      let {beat} = this.state


      const {pitch, velocity, duration} = this.state.patterns[this.state.selectedPattern].sequence[beat]
      const pitchHz = pitch.map((hz) => Tone.Frequency(hz+24, 'midi'))

      if(velocity) this.synth.triggerAttackRelease(pitchHz, duration, time, velocity)

      Tone.Draw.schedule(()=>{
        // that.gridCols.forEach(col => col.classList.remove('active'))
        // that.gridCols[beat].classList.add('active')
        this.drawPosition(beat)
      }, time)
      // Tone.Transport.schedule(function(time){
      // 	//time = sample accurate time of the event
      // }, "1m");



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

    const polyElement = document.querySelector(`#poly-${this.props.id}`)
    this.gridCells = polyElement.querySelectorAll('.cell')

    this.gridCells.forEach(cell => {
      cell.addEventListener('click', (e) => this.clickGrid(e))
      // cell.addEventListener('mouseover', (e) => this.mouseoverGrid(e))

      if(blackRows.includes(cell.dataset.row)) cell.classList.add('black')
      if(downBeats.includes(cell.dataset.col)) cell.classList.add('down-beat')
    })

    this.gridCols = polyElement.querySelectorAll('.col')

    const octaveSlider = new Nexus.Slider(`#octaves-${this.props.id}`,{
      'size': [120,20],
      'mode': 'relative',  // 'relative' or 'absolute'
      'min': 0,
      'max': 5,
      'step': 1,
      'value': 3
    })
    // octaveSlider.value = this.state.settings[main][second]
    octaveSlider.on('change', (val)=>this.handleControlChange(val, 'octave') )

    const durationSlider = new Nexus.Slider(`#duration-${this.props.id}`,{
      'size': [120,20],
      'mode': 'relative',  // 'relative' or 'absolute'
      'min': 0,
      'max': 5,
      'step': 1,
      'value': 1
    })
    // durationSlider.value = this.state.settings[main][second]
    durationSlider.on('change', (val)=>this.handleControlChange(val, 'duration') )

    // const beats = new Array(16).fill(0)
    // this.noteArray = new Array(12*5).fill(JSON.parse(JSON.stringify(beats)))

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

    switch(name){
      case 'octave':
        this.setState({octave: val})
        this.drawGrid()

        break

      case 'duration':
        switch(val){
          case 5:
            console.log('1n')
            value = '1n'
            break

          case 4:
            console.log('2n')
            value = '2n'
            break

          case 3:
            console.log('4n')
            value = '4n'
            break

          case 2:
            console.log('8n')
            value = '8n'

            break

          case 1:
            console.log('16n')
            value = '16n'

            break

          case 0:
            console.log('32n')
            value = '32n'
            break

        }

        // value = (32/(val+1))+'n'
        this.setState({duration: value})
        break
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
        const val = this.noteArray[pitch][col].replace('n','')

        const width = ((640 / val) - 2)
        elem.style.width = width+'px'
        cell.appendChild(elem)

      }
    })
  }
  // mouseoverGrid(e){
  //   // console.log(e.currentTarget)
  //   const cell = e.currentTarget
  //   const {duration} = this.state
  //
  //   // cell.classList.remove('active')
  //   const delem = cell.querySelector('.note')
  //   if(delem) cell.removeChild(delem)
  //
  //   const elem = document.createElement('div')
  //   console.log('duration', duration)
  //   elem.classList.add('note', duration )
  //   // elem.addEventListener('mouseout', (e) => {
  //   //   console.log('this', this)
  //   //   this.mouseoutGrid(e)
  //   // })
  //
  //   cell.appendChild(elem)
  //
  //
  //
  // }
  // mouseoutGrid(e){
  //   console.log(e.currentTarget)
  //   e.currentTarget.parentNode.removeChild(e.currentTarget)
  //   // this.drawGrid()
  // }
  clickGrid(e){

    const {col, row} = e.currentTarget.dataset
    const {selectedPattern, duration} = this.state
    // const elem = e.currentTarget
    const patterns = [...this.state.patterns]
    const note = patterns[selectedPattern].sequence[col]
    const pitch = parseInt(row)+(this.state.octave*12)

    // this.noteArray[pitch][col] = !this.noteArray[pitch][col]
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
          <div id={`octaves-${id}`} className="octaves"></div>
          <div id={`duration-${id}`} className="duration"></div>
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
