import React from 'react'
// import Nexus from 'nexusui'

// import Nexus from '../js/NexusUI'

class GridSequencer extends React.Component {
  constructor(){
    super()

    this.state={}


  }




  componentDidMount(){
    // console.log(Nexus)
    // new Nexus.Sequencer('#target')
    // this.sequencer = new Nexus.Sequencer(`#sequencer${this.props.id}`,{
    //   'size': [400,200],
    //   'mode': 'toggle',
    //   'rows': 8,
    //   'columns': 16
    // })
    //
    // this.sequencer.on('change',function(v) {
    //   console.log(v)
    // })

  }


  // <div id={`sequencer${this.props.id}`}></div>


  render(){
    return (
      <div className='grid-sequencer'>
        <h1>GridSequencer</h1>
        <div id="target" ref={el => this.sequencerElement = el}></div>
      </div>
    )
  }
}

export default GridSequencer
