"use client";

import React, { useEffect } from "react";
import { SubmitHandler, useWatch } from "react-hook-form";
import styles from "@/styles/lib/ui/dashboard/system-maintenance/treatment-hub-management/create-treatment-hub.module.scss";


//components
import { Select } from "@/components/Select/select";
import Textarea from "@/components/Textarea/textarea";
import Grid from "@/components/Grid/grid";
import Input from "@/components/Input/input";
import ButtonToggle from "@/components/Toggle/buttonToggle";
import Button from "@/components/Button/button";
import Text from "@/components/Typography/Text/text";
import Form from "@/components/Form/form";
import MultiSelect from "@/components/Select/multi-select-arry";

//lib & hooks
import Template from "@/lib/ui/template";
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
import { toastSuccess } from "@/lib/ui/toast";

export default function CreateTreatmentHub() {
    const {
        register,
        setValue,
        control,
        errors,
        handleSubmit,
        reset,
    } = useFormHook({
        schema: CreateTreatmentHubSchema,
        defaultValues: {
            name: "",
            accepts_walk_in: true,
            appointment_required: true,
            populations_served: [],
            service_id: "",
            status: "ACTIVE",
            address: "",
            barangay_ogc_fid: undefined,
            code: "",
            contact_number: "",
            description: "",
            email: "",
            facebook: "",
            operating_hours: "",
            latitude: undefined,
            longitude: undefined,
            municipality_ogc_fid: undefined,
            province_ogc_fid: undefined,
            region_ogc_fid: undefined,
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

    const { data: RegionalData } =
        useFormQuery<RegionsInterfaceResult>({
            key: ["GetAllRegions"],
            url: "maintenance/geospatial/regions",
            headers,
        });

    const { data: ProvincesData } =
        useFormQuery<ProvinceInterfaceResult>({
            key: ["GetAllProvinces", region],
            url: "maintenance/geospatial/provinces",
            params: {
                region_code: region,
            },
            enabled: Boolean(region),
        });

    const { data: MunicipalitiesData } =
        useFormQuery<ProvinceInterfaceResult>({
            key: ["GetAllMunicipalities", province],
            url: "maintenance/geospatial/municipalities",
            params: {
                province_code: province,
            },
            enabled: Boolean(province),
        });

    const { data: BarangayData } =
        useFormQuery<BarangayInterfaceResult>({
            key: ["GetAllBarangays", municipality],
            url: "maintenance/geospatial/barangays",
            params: {
                municipality_code: municipality,
            },
            enabled: Boolean(municipality),
        });

    const { data: TreatmentHubServicesData } =
        useFormQuery<TreatmenetHubServiceResult>({
            key: ["GetAllTreatmentHubServices"],
            url: "maintenance/services",
            headers,
        });

    const mutation = useFormMutation({
        key: ["CreateTreatmentHub"],
        method: "POST",
        url: "maintenance/treatment-hub",
        headers,
    });

  

    const onHandleSubmit: SubmitHandler<TreatmentHubFields> = (data) => {
        mutation.mutate(data, {
            onSuccess: () => {
                toastSuccess({
                    title: "Treatment Hub Created Successfully",
                    body: "The new treatment hub has been added and is now available in the system.",
                });

                reset();
            },
            onError: (error) => {
                console.error("Error: ", error);
            },
        });
    };

    return (
        <Template title="Create new Treatment Hub">
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
                                ).map(({ id, name }) => ({
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
                                    ).map(({ id, name }) => ({
                                        label: name,
                                        value: id,
                                    }))}
                                    error={errors.province_ogc_fid}
                                />
                            )}

                            {province && (
                                <Select
                                    control={control}
                                    isRequired={true}
                                    label="Municipality"
                                    name="municipality_ogc_fid"
                                    options={(
                                        MunicipalitiesData?.data.data || []
                                    ).map(({ id, name }) => ({
                                        label: name,
                                        value: id,
                                    }))}
                                    error={errors.municipality_ogc_fid}
                                />
                            )}

                    {municipality && (
                        <Select
                            control={control}
                            isRequired={true}
                            label="Barangay"
                            name="barangay_ogc_fid"
                                options={(
                                    BarangayData?.data.data || []
                                ).map(({ id, name }) => ({
                                    label: name,
                                    value: id,
                                }))}
                            error={errors.barangay_ogc_fid}
                        />
                        )}
                    <Select
                        control={control}
                        isRequired={true}
                        label="Services"
                        name="service_id"
                        error={errors.service_id}
                        options={(
                            TreatmentHubServicesData?.data.edges || []
                        ).map(({ node }) => ({
                            label: node.name,
                            value: node.service_id,
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
                        name="status"
                        control={control}
                        falseValue="INACTIVE"
                        trueValue="ACTIVE"
                        setValue={setValue}
                        falseLabel="INACTIVE"
                        label="Status"
                        trueLabel="ACTIVE"
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
