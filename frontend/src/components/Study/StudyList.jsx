import React from 'react'
import { List } from 'antd'
import StudyCard from './StudyCard'

function StudyList({ studies }) {
  return (
    <div style={{ width: '100%' }}>
      <List
        grid={{
          colAlign: 'middle',
          gutter: 0,
          xs: 1,
          sm: 1,
          md: 2,
          lg: 4,
          xl: 4,
          xxl: 4,
        }}
        dataSource={studies}
        renderItem={study => (
          <List.Item>
            <StudyCard study={study} />
          </List.Item>
        )}
      />
    </div>
  )
}

export default StudyList
