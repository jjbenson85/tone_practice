import React, { useState} from 'react'
import Tone from 'tone'
import '../scss/transport-bar.scss'


const TransportBar = (props) => {
  // console.log(props)
  // let position = '0:0:0'

  const [position, setPosition] = useState('0:0:0')
  //
  // useEffect(() => {
  //   position = props.position
  // })

  Tone.Transport.scheduleRepeat((time)=>{
    Tone.Draw.schedule(()=>{
      setPosition(Tone.Transport.position.split('.')[0])
    }, time+0.01)
  }, '16n', '0m')

  return(
    <div className='transport-bar'>
      <div className='left'>
        <div className='position'>{position}</div>
      </div>
      <div className='center'>
        <button onClick={()=>props.startSequencer()}>PLAY</button>
        <button onClick={()=>props.stopSequencer()}>STOP</button>

      </div>
      <div className='right'>
        <button onClick={()=>props.addPolySynth()}>Add Poly</button>
        <button onClick={()=>props.removeSynth()}>REMOVE</button>

      </div>
    </div>
  )
}

export default TransportBar
