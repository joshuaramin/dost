"use client" 


import React, { useState } from 'react'
import styles from '@/styles/lib/ui/dashboard/system-maintenance/treatment-hub-management/treatment-hub-management.module.scss';

//components
import SelectArray from '@/components/Select/select-array';
import Grid from '@/components/Grid/grid';
import Search from '@/components/Search/search';



//lib & hook
import headers from '@/lib/utils/headers'
import Template from '@/lib/ui/template';
import useFormQuery from '@/lib/hooks/useQuery';
import { TreatmentHubResult } from '@/lib/interface/treatment-hub/treatment-hub.interface';
import { LocationHierarchyResult } from '@/lib/interface/geom/country.interface';

export default function TreatmentHub() {


  const [ search, setSearch ] = useState<string>("");
  const [ region, setRegions ] = useState<string>("")

  const { data } = useFormQuery<LocationHierarchyResult>({
    key: ["GetAllRegions"],
    url: "maintenance/geospatial/hierarchy",
    headers
  })

  console.log("Region Data: ", data) 

  const { data: treatmentHubData } = useFormQuery<TreatmentHubResult>({
    key: ["GetAllTreatmentHub"],
    url: "maintenance/treatment-hub",
    headers,
    
  })


  console.log("Treatment Hub: ", treatmentHubData)
  const onHandleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value)
  }

  const onHandleClear = () => {
    setSearch('')
  }

  return (
    <Template
      title="Treatment Hub Management"
      create="/dashboard/system-maintenance/treatment-hub-management/create"
    >
      <div className={styles.container}>
        <Grid gap={3}>
            <Search  onChange={onHandleSearch} onClear={onHandleClear} value={search} />
            <SelectArray
            value={region}
            label="Region"
              options={(data?.data.data || []).map(({  region_code, region_name}) => ({
                value: region_code,
                label: region_name
              }))}
              name="email"
              onSelect={(val) => {
                setRegions(val)
              }}
          />
        </Grid>
        {JSON.stringify(treatmentHubData?.data.edges)}
      </div>
    </Template>
  )
}
