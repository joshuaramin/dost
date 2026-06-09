"use client"


import Search from '@/components/Search/search';
import Template from '@/lib/ui/template';
import React, { useState } from 'react'

export default function TrendsAndTopics() {

    const [search, setSearch] = useState<string>('')

    const onHandleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.currentTarget.value)
    }


    const onHandleClear = () => {
        setSearch('')
    }
  return (
    <Template title="Trends and Topics">
        <div>
        <Search  value={search} onChange={onHandleSearch} onClear={onHandleClear}/>
      </div>
    </Template>
  )
}
