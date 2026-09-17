import React from 'react'

// Section heading in the brand display face — inherits its size from the parent
// wrapper so each section keeps its own scale.
const Title = ({ text1, text2 }) => {
  return (
    <h2 className='heading-font uppercase tracking-[0.08em] text-ink leading-none'>
      {text1}{text2 ? ` ${text2}` : ''}
    </h2>
  )
}

export default Title
