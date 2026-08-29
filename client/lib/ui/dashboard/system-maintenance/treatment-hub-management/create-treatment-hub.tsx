"use client";

import Template from "@/lib/ui/template";
import { SubmitHandler, useWatch } from "react-hook-form";
import styles from "@/styles/lib/ui/dashboard/system-maintenance/treatment-hub-management/create-treatment-hub.module.scss";

import { Select } from "@/components/Select/select";
import Textarea from "@/components/Textarea/textarea";
import Grid from "@/components/Grid/grid";
import Input from "@/components/Input/input";
import ButtonToggle from "@/components/Toggle/buttonToggle";
import Button from "@/components/Button/button";
import Text from "@/components/Typography/Text/text";
import Form from "@/components/Form/form";
import  MultiSelect from "@/components/Select/multi-select-arry";


import { RegionsInterfaceResult } from "@/lib/interface/geom/regions.interface";
import { ProvinceInterfaceResult } from "@/lib/interface/geom/provinces.interface";
import { BarangayInterfaceResult } from "@/lib/interface/geom/barangay.interface";
import { CreateTreatmentHubSchema } from "@/lib/validations/treatment-hub.validation";

import useFormHook from "@/lib/hooks/useFormHook";
import TitleWrapper from "@/lib/ui/titleWrapper";
import useFormQuery from "@/lib/hooks/useQuery";
import useFormMutation from "@/lib/hooks/useMutation";
import headers from "@/lib/utils/headers";
import { TreatmentHubFields } from "@/lib/types/treatment-hub.type";
import { TreatmenetHubServiceResult } from "@/lib/interface/services/service.interface";

export default function CreateTreatmentHub() {
    const {
        register,
        setValue,
        control,
        errors,
        handleSubmit,
    } = useFormHook({
        schema: CreateTreatmentHubSchema,
        defaultValues: {
            name: "",
            accepts_walk_in: true,
            appointment_required: true,
            populations_served: [],
            services: [],
            status: "ACTIVE",
            address: "",
            barangay_ogc_fid:  0,
            code: "",
            contact_number: "",
            description: "",
            email: "",
            facebook: "",
            operating_hours: "",
            latitude: 0,
            longitude: 0,
            municipality_ogc_fid: 0,
            province_ogc_fid: 0,
            region_ogc_fid: 0,
            telephone: "",
            website: "",
            postal_code: "",
        },
    });

    const region = useWatch({
        control,
        name: "region_ogc_fid",
    });

    const province = useWatch({
        control,
        name: "province_ogc_fid",
    });

    const municipality = useWatch({
        control,
        name: "municipality_ogc_fid",
    });

    const municipalityDataEnabled = Boolean(province);
    const barangayDataEnabled = Boolean(municipality);

    const { data: RegionalData } =
        useFormQuery<RegionsInterfaceResult>({
            key: ["GetAllRegions"],
            url: "maintenance/geospatial/regions",
        });

    const { data: ProvincesData } =
        useFormQuery<ProvinceInterfaceResult>({
            key: ["GetAllProvinces", region],
            url: `maintenance/geospatial/provinces`,
            params: {
                region_code: region
            },
        });

    const { data: MunicipalitiesData } =
        useFormQuery<ProvinceInterfaceResult>({
            key: ["GetAllMunicipalities", province],
            url: `maintenance/geospatial/municipalities?province_code=${province}`,
            enabled: !!province
        });

    const { data: BarangayData } =
        useFormQuery<BarangayInterfaceResult>({
            key: ["GetAllBarangays", municipality],
            url: `maintenance/geospatial/barangays`,
            params: {
                municipality_code: municipality
            }
        });

    const { data: TreatmentHubServicesData } = useFormQuery<TreatmenetHubServiceResult>({
        key: ["GetAllTreatmentHubServices"],
        url: "maintenance/services",
        headers
    })

    const mutation = useFormMutation({
        key: ["CreateTreatmentHub"],
        method: "POST",
        url: "maintenance/treatment-hub",
        headers,
    });

    const onHandleSubmit: SubmitHandler<TreatmentHubFields> = (data) => {

        mutation.mutate(data, {
            onSuccess: (data) => {
                console.log("Data: ", data)
            },
            onError: (error) => {
                console.error("Error: ", error)
            },
        });
    };
    

    return (
        <Template title="Create new Treatment Hub">
            {JSON.stringify(`Data: ${municipality}`, null, 2)}
            <Form onSubmit={handleSubmit(onHandleSubmit)}>
                <div className={styles.container}>
                    <TitleWrapper title="Basic Information" />

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

                    <TitleWrapper title="Location" />

                    <Grid>
                        <Grid.Column>
                            <Input
                                register={register}
                                label="Address"
                                name="address"
                                error={errors.address}
                            />

                            <Select
                                control={control}
                                isRequired={true}
                                label="Region"
                                name="region_ogc_fid"
                                options={(
                                    RegionalData?.data.data || []
                                ).map(({ id, name, code }) => ({
                                    label: name,
                                    value: id,
                                }))}
                                error={errors.region_ogc_fid}
                            />

                            {region && (
                                <Select
                                    control={control}
                                    isRequired={true}
                                    label="Province"
                                    name="province_ogc_fid"
                                    options={(
                                        ProvincesData?.data.data || []
                                    ).map(({ id,  name, code }) => ({
                                        label: name,
                                        value: id,
                                    }))}
                                    error={errors.province_ogc_fid}
                                />
                            )}

                            {municipalityDataEnabled && (
                                <Select
                                    control={control}
                                    isRequired={true}
                                    label="Municipality"
                                    name="municipality_ogc_fid"
                                    options={(
                                        MunicipalitiesData?.data.data || []
                                    ).map(({ id,  name, code }) => ({
                                        label: name,
                                        value: id,
                                    }))}
                                    error={errors.municipality_ogc_fid}
                                />
                            )}

                            {barangayDataEnabled && (
                                <Select
                                    control={control}
                                    isRequired={true}
                                    label="Barangay"
                                    name="barangay_ogc_fid"
                                    options={(
                                        BarangayData?.data.data || []
                                    ).map(({ id, name, code }) => ({
                                        label: name,
                                        value: id,
                                    }))}
                                    error={errors.barangay_ogc_fid}
                                />
                            )}
                        </Grid.Column>
                    </Grid>

                    <MultiSelect
                        control={control}
                        isRequired={true}
                        label="Services"
                        name="services"
                        options={(TreatmentHubServicesData?.data.edges || []).map(({cusor, node}) => ({
                            label: node.name,
                            value: node.service_id
                        }))}
                    />

                    <TitleWrapper title="Contact information" />

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

                    <ButtonToggle 
                        control={control}
                        name="status"
                        falseName="INACTIVE" 
                        label="Status"
                        setValue={setValue}
                        trueName="ACTIVE"
                    />

                    <div className={styles.footer}>
                        <Button
                            types="filled"
                            type="submit"
                            size="md"
                            variant="primary"
                        >
                            <Text size="sm">Save</Text>
                        </Button>
                    </div>
                </div>
            </Form>
        </Template>
    );
}