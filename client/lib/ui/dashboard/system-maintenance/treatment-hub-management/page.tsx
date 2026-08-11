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
import Pagination from '@/components/Pagination/pagination';
import { RegionsInterface, RegionsInterfaceResult } from '@/lib/interface/geom/regions.interface';

export default function TreatmentHub() {


  const [ search, setSearch ] = useState<string>("");
  const [ region, setRegions ] = useState<string>("")
  const [ endCursor, setEndCursor ] = useState<string>("")
  const [ startCursor, setStartCursor ] = useState<string>("")

  const onHandleNextPage = () => { 
    setEndCursor(() => endCursor)
  }

  const onHandlePrevPage = () => {
    setStartCursor(() => startCursor)
  }

  const { data } = useFormQuery<RegionsInterfaceResult>({
    key: ["GetAllRegions"],
    url: "maintenance/geospatial/regions",
    headers
  })



  const { data: treatmentHubData  } = useFormQuery<TreatmentHubResult>({
    key: ["GetAllTreatmentHub", endCursor, startCursor, search, region],
    url: "maintenance/treatment-hub",
    headers,
    params:  {
      limit: 20, 
      after: endCursor,
      before: startCursor,
      search,
      psgc_code: region
    }
    
  })

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
              options={( data?.data.data || []).map(({code, name }) => ({label: `${name} ${code}`, value: code}))}
              name="region"
              onSelect={(val) => {
                setRegions(val)
              }}
          />
        </Grid>
        {JSON.stringify(treatmentHubData?.data.edges, null, 20)}

        <Pagination
                totalItems={treatmentHubData?.data.totalCount ?? 0}
                currentItems={treatmentHubData?.data.totalCount ?? 0}
                hasNextPage={treatmentHubData?.data.pageInfo.hasNextPage ?? false}
                hasPrevPage={treatmentHubData?.data.pageInfo.hasPrevPage ?? false}
                onNext={onHandleNextPage}
                onPrev={onHandlePrevPage}
            />
      </div>
    </Template>
  )
}
