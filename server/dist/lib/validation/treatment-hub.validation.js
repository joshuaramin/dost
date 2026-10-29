"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTreatmentHubSchema = exports.TreatmentHubSchema = void 0;
const zod_1 = require("zod");
const optionalString = zod_1.z
    .string()
    .trim()
    .transform((value) => (value === "" ? undefined : value))
    .optional();
const optionalNumber = zod_1.z.number().int().optional();
exports.TreatmentHubSchema = zod_1.z.object({
    treatment_hub_id: zod_1.z.string().uuid().optional(),
    code: optionalString,
    name: zod_1.z.string().trim().min(1, "Treatment hub name is required").max(255),
    slug: optionalString,
    description: optionalString,
    address: optionalString,
    region_ogc_fid: optionalNumber,
    province_ogc_fid: optionalNumber,
    municipality_ogc_fid: optionalNumber,
    barangay_ogc_fid: optionalNumber,
    postal_code: optionalString,
    contact_number: optionalString.refine((value) => !value || /^(\+63|0)9\d{9}$/.test(value) || /^[0-9\-+\s()]+$/.test(value), {
        message: "Invalid contact number.",
    }),
    telephone: optionalString,
    email: optionalString.pipe(zod_1.z.string().email("Invalid email address").optional()),
    website: optionalString.pipe(zod_1.z.string().url("Invalid website URL").optional()),
    facebook: optionalString.pipe(zod_1.z.string().url("Invalid Facebook URL").optional()),
    operating_hours: optionalString,
    latitude: zod_1.z.number().min(-90).max(90).optional(),
    longitude: zod_1.z.number().min(-180).max(180).optional(),
    service_id: zod_1.z.string().min(1, "Service is required"),
    populations_served: zod_1.z.array(zod_1.z.string()).default([]),
    status: zod_1.z
        .enum(["ACTIVE", "INACTIVE", "TEMPORARILY_CLOSED"])
        .default("ACTIVE"),
    is_doh_accredited: zod_1.z.boolean().default(true),
    accepts_walk_in: zod_1.z.boolean().default(true),
    appointment_required: zod_1.z.boolean().default(false),
    has_prep: zod_1.z.boolean().default(false),
    has_pep: zod_1.z.boolean().default(false),
    has_art: zod_1.z.boolean().default(true),
    has_hiv_testing: zod_1.z.boolean().default(true),
    has_cd4_testing: zod_1.z.boolean().default(false),
    has_viral_load_testing: zod_1.z.boolean().default(false),
});
exports.CreateTreatmentHubSchema = exports.TreatmentHubSchema;
