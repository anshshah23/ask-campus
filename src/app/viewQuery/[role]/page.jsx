import React from 'react'
import Table from './DeptUI'

const Page = ({ params }) => {

  return (
    <div>
        <Table role={params.role} />
    </div>
  )
}

export default Page