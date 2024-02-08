import React, { useState } from 'react'
import PropTypes from 'prop-types'

// bootstrap components
import { Container, Dropdown, DropdownButton } from 'react-bootstrap'

function TaskSort({ tasks, setTasks }) {
  const [filterName, setFilterName] = useState('')

  // sorts tasks by date created ascending
  const sortCreatedAscending = () => {
    const sorted = [...tasks].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    setTasks(sorted)
    setFilterName('Date added - oldest')
  }

  // sorts tasks by date created descending
  const sortCreatedDescending = () => {
    const sorted = [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    setTasks(sorted)
    setFilterName('Date added - newest')
  }

  // sorts tasks by due date ascending
  const sortDueDateClosest = () => {
    const sorted = [...tasks].sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    setTasks(sorted)
    setFilterName('Due date - closest')
  }

  // sorts tasks by due date descending
  const sortDueDateFurthest = () => {
    const sorted = [...tasks].sort((a, b) => new Date(b.deadline) - new Date(a.deadline))
    setTasks(sorted)
    setFilterName('Due date - furthest')
  }

  return (
    <Container className="d-flex justify-content-end align-items-center">
      <DropdownButton size="sm" variant="link" title="Sort" drop="end">
        <Dropdown.Header>Date added -</Dropdown.Header>
        <Dropdown.Item onClick={sortCreatedAscending}>oldest</Dropdown.Item>
        <Dropdown.Item onClick={sortCreatedDescending}>newest</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Header>Due date -</Dropdown.Header>
        <Dropdown.Item onClick={sortDueDateClosest}>closest</Dropdown.Item>
        <Dropdown.Item onClick={sortDueDateFurthest}>furthest</Dropdown.Item>
      </DropdownButton>
      <div>
        {filterName === ''
          ? <small className="m-0">Date added - oldest</small>
          : <small className="m-0">{ filterName }</small>}
      </div>
    </Container>
  )
}

TaskSort.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  tasks: PropTypes.array.isRequired,
  setTasks: PropTypes.func.isRequired,
}

export default TaskSort
