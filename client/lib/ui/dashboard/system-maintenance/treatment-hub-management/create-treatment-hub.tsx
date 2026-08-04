"use client"

import Template from '@/lib/ui/template';
import React, { useState } from 'react'
import styles from '@/styles/lib/ui/dashboard/system-maintenance/treatment-hub-management/create-treatment-hub.module.scss';


//components
import Input from '@/components/Input/input';
import ButtonToggle from '@/components/Toggle/buttonToggle';

//lib & hooks
import { CreateTreatmentHubSchema } from '@/lib/validations/treatment-hub.validation';
import useFormHook from '@/lib/hooks/useFormHook';
import { booleanFields } from '@/lib/utils/treatment-hub';
import TitleWrapper from '@/lib/ui/titleWrapper';
import Textarea from '@/components/Textarea/textarea';
import useFormQuery from '@/lib/hooks/useQuery';


export default function CreateTreatmentHub() {


  const [ province, setProvince ] = useState<string>("");
  const [ region, setRegion ] = useState<string>("");
  const [ municipalities, setMunicipalities] = useState<string>("");
  const [ barangyas, setBarangyas ] = useState<string>("");


  const { data } = useFormQuery({
    key: ["GetAllRegions",  region],
    url:  "maintenance/geospatial/hierarchy",
    
  })


  const { register, setValue, control, errors } = useFormHook({
    schema: CreateTreatmentHubSchema,
    defaultValues: {
      name: "",
      accepts_walk_in: true,
      appointment_required: true,
      has_art: true,
      has_cd4_testing: true,
      has_hiv_testing: true,
      has_pep: true,
      has_prep: true,
      has_viral_load_testing: true,
      is_doh_accredited: true,
      populations_served: [],
      services: [],
      status: "ACTIVE",
      address: "",
      barangay: "",
      city: "",
      code: "",
      contact_number: "",
      description: "",
      email: "",
      facebook: "",
      operating_hours: "",
      province: "",
      region: "",
      telephone: "",
      website: "",
      postal_code: "",
    }
  })

  return (
    <Template title="Create new Treatment Hub">
      <div className={styles.container}>
        <TitleWrapper 
          title="Basic Information"
        />
        <Input 
          label="Name"
          name="name"
          register={register}
          error={errors.name}
        />

        <Textarea 
              label="Description"
              name="description"
              register={register}
              errors={errors.description}

        />

        <TitleWrapper 
          title="Location"
        />

        {JSON.stringify(data?.data.data[0].municipalities)}


        <TitleWrapper 
          title="Contact information"
        />

        <Input 
          label="Email Address"
          name="email"
          register={register}
          error={errors.email}
        />
        <Input 
          label="Telephone"
          name="telephone"
          register={register}
          error={errors.telephone}
        />
        <Input 
          label="Contact Number"
          name="contact_number"
          register={register}
          error={errors.contact_number}
        />
        <Input 
          label="Website"
          name="website"
          register={register}
          error={errors.website}
        />



        {booleanFields.map(({ label, name}, index) => (
          <ButtonToggle
            control={control}
            falseName={"NO"}
            label={label}
            name={name}
            setValue={setValue}
            trueName="YES"
            key={index}
          />
        ))}
        
      </div>
    </Template>
  )
}
