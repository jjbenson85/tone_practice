import React from 'react'
import Tone from 'tone'
// import Nexus from 'nexusui'
import '../scss/grid-sequencer.scss'


const rowArr = Array.from(Array(13), (x,i) => i)
const colArr = Array.from(Array(16), (x,i) => i)

const patternNames =['A','B','C','D']
const blackRows = ['1','3','6','8','10']
const downBeats = ['0','4','8','12']

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


const noteOff = {
  beat: 0,
  pitch: [],
  pitchHz: [],
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

const twelveArr= new Array(12).fill(0)

class GridSequencer extends React.Component {
  constructor(){
    super()
    this.state = {
      beat: 0,
      selectedPattern: 0,
      octave: 3,
      duration: '16n',
      durationIndex: 1,
      patternIndex: 0,
      patternChain: [0],
      patterns: [
        insertPattern(0),
        insertPattern(1),
        insertPattern(2),
        insertPattern(3)
      ]
    }

  }
  //
  // removeSynth(){
  //   this.synth.dispose()
  // }
  // show(){
  //
  //   this.setState({display: 'visible'})
  // }
  // hide(){
  //
  //   this.setState({display: 'hidden'})
  // }

  stop(){
    // this.loop.stop()
    this.loop.mute = true
    // this.setState({beat: 0, patternIndex: 0})
    Tone.Draw.schedule(()=>{
      this.removePostion()
    })
  }
  start(){
    this.loop.mute = false

    // console.log('poly', this.props.id, pos)
    // this.setState({beat: pos},()=>this.loop.start())
    // this.loop.start()
  }

  //MAKE WORK WITH PARENT
  run(){
    Tone.Transport.start('+0.1')
    this.loop.mute = false

    // this.loop.start()
  }

  removePostion(){
    this.gridCols.forEach(col => col.classList.remove('active') )

  }
  drawPosition(beat){
    this.removePostion()
    this.gridCols[beat].classList.add('active')
  }

  componentDidMount(){
    this.props.attachSequencer(this)
    // if(this.props.id === 0) this.setState({display: 'visible'})

    // this.synth = new Tone.PolySynth(4,Tone.MonoSynth)
    // this.synth.set(settings)
    // this.props.attachSynth(this, this.props.id)


    // Tone.Transport.scheduleRepeat((time)=>{
    //   let {beat, patternIndex} = this.state
    //   const {patterns, patternChain} = this.state
    //
    //   const {pitch, velocity, duration} = patterns[patternChain[patternIndex]].sequence[beat]
    //   const pitchHz = pitch.map((hz) => Tone.Frequency(hz+24, 'midi'))
    //
    //   if(velocity) this.synth.triggerAttackRelease(pitchHz, duration, time, velocity)
    //
    //   Tone.Draw.schedule(()=>{
    //     this.drawPosition(beat)
    //   }, time)
    //
    //   beat = ++beat % 16
    //   if(beat===15){
    //     patternIndex++
    //
    //     if(patternIndex > patternChain.length-1) patternIndex = 0
    //
    //     this.setState({patternIndex})
    //   }
    //   this.setState({beat})
    //
    // }, '16n', '0m')
    // console.log(this.state.patterns[0])

    // const {patterns, patternIndex, patternChain} = this.state

    this.loop = new Tone.Sequence((time, beat)=>{
      let {patternIndex} = this.state
      const {patterns, patternChain} = this.state

      const {pitchHz, velocity, duration} = patterns[patternChain[patternIndex]].sequence[beat]
      // const {pitchHz, velocity, duration} = note
      // const pitchHz = pitch.map((hz) => Tone.Frequency(hz+24, 'midi'))

      //Trigger Parent
      if(velocity) this.props.parent.synth.triggerAttackRelease(pitchHz, duration, time+0.1, velocity)

      // beat = ++beat % 16
      Tone.Draw.schedule(()=>{
        // this.drawPosition(beat)
        this.drawPosition(beat)
      }, time)

      if(beat===15){

        patternIndex++

        if(patternIndex > patternChain.length-1) patternIndex = 0

        this.setState({patternIndex})
      }
      // this.setState({beat})

    }, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], '16n').start()
    // }, patterns[patternChain[patternIndex]].sequence, '16n').start()

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
    for (let x = 0; x <= 4; x++) {
      this.noteArray[x] = []
      for (let i = 0; i <= 72; i++) {
        this.noteArray[x][i] = []
        for (var j = 0; j < 16; j++) {
          this.noteArray[x][i][j] = false
        }
      }
    }
  }

  handleControlChange(val, name, e){
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

      case 'pattern':
        //optimize
        document.querySelectorAll('.button.pattern').forEach(x => x.classList.remove('active'))
        e.currentTarget.classList.add('active')
        this.setState({selectedPattern: val}, this.drawGrid)
        break

      case 'patternChain':
        value = [...this.state.patternChain]
        value.push(this.state.selectedPattern)
        this.setState({patternChain: value})

        break

      //This is a synth setting, lose when sequencer made component
      // case 'preset':
      //   switch(val){
      //     case 1:
      //       this.synth.set(settings)
      //       break
      //
      //     case 2:
      //       this.synth.set(settings2)
      //       break
      //
      //     case 3:
      //       this.synth.set(settings3)
      //       break
      //
      //     case 4:
      //       this.synth.set(settings4)
      //       break
      //
      //   }
    }

  }

  drawGrid(){
    const {octave} = this.state
    this.gridCells.forEach( cell => {
      const {row, col} = cell.dataset
      const pitch = parseInt(row) + (octave*12)

      cell.classList.remove('active')
      const delem = cell.querySelector('.note')
      if(delem) cell.removeChild(delem)


      if(this.noteArray[this.state.selectedPattern][pitch][col]){
        const elem = document.createElement('div')
        elem.classList.add('note', `d${this.noteArray[this.state.selectedPattern][pitch][col]}` )
        let val = this.noteArray[this.state.selectedPattern][pitch][col].replace('n','')

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
    // const pitchHz = pitch.map((hz) => Tone.Frequency(hz+24, 'midi'))

    if(!this.noteArray[this.state.selectedPattern][pitch][col]) this.noteArray[this.state.selectedPattern][pitch][col] = duration
    else this.noteArray[this.state.selectedPattern][pitch][col] = false

    if(this.noteArray[this.state.selectedPattern][pitch][col]){

      const pitchHz = Tone.Frequency(pitch+24, 'midi')
      this.props.parent.synth.triggerAttackRelease(pitchHz, duration)

      note.pitch.push(pitch)
      note.pitchHz.push(pitchHz)
      note.duration.push(duration)
      note.velocity = 1

    }else{

      // Get the index of this pitch in the pitch array
      const index = note.pitch.indexOf(pitch)

      //remove note from pitch array
      note.pitch.splice(index, 1)
      note.pitchHz.splice(index, 1)
      note.duration.splice(index, 1)

      //If no noes left to be played this beat, turn off with velocity 0
      if(note.pitch.length===0) note.velocity = 0
    }

    this.drawGrid()
    this.setState({patterns})


  }


  render(){
    const {id} = this.props
    const {patternIndex, patternChain, octave, duration, durationIndex} = this.state
    return (
      <div id={`gridSequnecer-${id}`} className='sequencer'>
        <div className='controls'>
          <div
            className='button'
            onClick={()=>this.run()}
          >Run</div>
          {twelveArr.map((x, i)=>{
            const pat = patternNames[patternChain[i]]
            return<div
              key={i}
              className={`button ${pat ? '':'hidden'} ${patternIndex===i ? 'active':'' }`}
            >{pat}</div>
          })
          }
        </div>
        <div className='controls'>
          <div className='button' onClick={()=>this.handleControlChange(octave, 'octaveInc')}>8ve+</div>
          <div className='button' onClick={()=>this.handleControlChange(octave, 'octaveDec')}>8ve-</div>
          <div className='button'>{octave}</div>
          <div className='button hidden'></div>
          <div
            className='button'
            onClick={()=>this.handleControlChange(durationIndex, 'durationInc')}
          >Length+</div>
          <div
            className='button'
            onClick={()=>this.handleControlChange(durationIndex, 'durationDec')}
          >Length-</div>
          <div className='button'>{duration}</div>
          <div className='button hidden'></div>
          <div className='button pattern active' onClick={(e)=>this.handleControlChange(0, 'pattern', e)}>A</div>
          <div className='button pattern' onClick={(e)=>this.handleControlChange(1, 'pattern', e)}>B</div>
          <div className='button pattern' onClick={(e)=>this.handleControlChange(2, 'pattern', e)}>C</div>
          <div className='button pattern' onClick={(e)=>this.handleControlChange(3, 'pattern', e)}>D</div>
          <div className='button' onClick={()=>this.handleControlChange(0, 'patternChain')}>Add</div>
        </div>
        <div className="grid">
          {colArr.map( col => <div key={col} className='col'>
            {rowArr.map( row =><div key={row} className='cell' data-col={col} data-row={row}></div>)}
          </div>)}
        </div>
      </div>
    )
  }
}

export default GridSequencer
